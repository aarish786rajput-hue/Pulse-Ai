import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { 
  FileText, 
  UploadCloud, 
  ArrowRight, 
  Search, 
  Eye, 
  X, 
  FileCheck2, 
  Camera, 
  HelpCircle, 
  Trash2, 
  Sparkles,
  Building2,
  Calendar,
  User,
  Activity,
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import { generatePatientReports, sampleReports } from "../data/sampleReports";
import { analyzeReportFile } from "../services/geminiService";
import { translations } from "../data/translations";

export default function ReportExplainer({ 
  onAskCopilot, 
  patient, 
  lang = 'en',
  pendingUploadFile,
  onClearPendingFile,
  onUpdateVitals,
  onAddTimelineEvent
}) {
  const t = translations[lang] || translations.en;
  // User uploaded reports from storage
  const [userUploadedReports, setUserUploadedReports] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_user_reports");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((r) => r.isUserUploaded);
        }
      }
    } catch (e) {
      console.error("Failed to load reports from storage", e);
    }
    return [];
  });

  // Dynamically generated 3 body-pathway & blood reports based on active patient profile
  const samplePatientReports = useMemo(() => {
    return generatePatientReports(patient);
  }, [patient]);

  // Combined reports (User uploads first, followed by active patient's 3 body pathway reports)
  const reports = useMemo(() => {
    return [...userUploadedReports, ...samplePatientReports];
  }, [userUploadedReports, samplePatientReports]);

  const [selectedReportId, setSelectedReportId] = useState(() => {
    return sampleReports[0]?.id || "";
  });

  const [searchFilter, setSearchFilter] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningPhase, setScanningPhase] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Fallback to first available report if selected ID is invalid
  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0] || null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const processUploadedFile = useCallback((file) => {
    if (!file) return;

    setIsAnalyzing(true);
    setScanningPhase(1);

    const phaseTimer1 = setTimeout(() => setScanningPhase(2), 700);
    const phaseTimer2 = setTimeout(() => setScanningPhase(3), 1400);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) {
        setIsAnalyzing(false);
        return;
      }

      try {
        const analyzed = await analyzeReportFile({
          file,
          fileDataUrl: dataUrl,
          mimeType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
          patientContext: patient,
          lang
        });

        clearTimeout(phaseTimer1);
        clearTimeout(phaseTimer2);

        setUserUploadedReports((prev) => {
          // Prepend new report to top of list
          const updated = [{ ...analyzed, isUserUploaded: true }, ...prev.filter((r) => r.id !== analyzed.id)];
          try {
            localStorage.setItem("pulseai_user_reports", JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });

        // Immediately select the newly analyzed report
        setSelectedReportId(analyzed.id);

        showToast(
          lang === "hi"
            ? `✅ "${analyzed.title}" का विश्लेषण पूरा हुआ और डेटा लोड हो गया!`
            : `✅ "${analyzed.title}" analyzed successfully and loaded!`
        );
      } catch (err) {
        console.error("Report processing error:", err);
        showToast(lang === "hi" ? "रिपोर्ट स्कैन करने में त्रुटि आई।" : "Error scanning report.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.readAsDataURL(file);
  }, [lang, patient]);

  // Process file passed from Dashboard quick upload
  useEffect(() => {
    if (pendingUploadFile) {
      const timer = setTimeout(() => {
        processUploadedFile(pendingUploadFile);
        if (onClearPendingFile) onClearPendingFile();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pendingUploadFile, processUploadedFile, onClearPendingFile]);

  const handleDeleteReport = (idToDelete, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const reportToDelete = reports.find((r) => r.id === idToDelete);
    const confirmMsg =
      lang === "hi"
        ? `क्या आप "${reportToDelete?.title || "यह रिपोर्ट"}" को हटाना चाहते हैं?`
        : `Are you sure you want to delete "${reportToDelete?.title || "this report"}"?`;

    if (window.confirm(confirmMsg)) {
      setUserUploadedReports((prev) => {
        const updated = prev.filter((r) => r.id !== idToDelete);
        try {
          localStorage.setItem("pulseai_user_reports", JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      if (selectedReportId === idToDelete) {
        setSelectedReportId(samplePatientReports[0]?.id || "");
      }
      showToast(lang === "hi" ? "रिपोर्ट हटा दी गई।" : "Report removed.");
    }
  };

  const handleRestoreSamples = () => {
    setUserUploadedReports([]);
    try {
      localStorage.removeItem("pulseai_user_reports");
    } catch (err) {
      console.error(err);
    }
    setSelectedReportId(samplePatientReports[0]?.id || "");
    showToast(lang === "hi" ? "डिफ़ॉल्ट 3 मेडिकल रिपोर्ट्स रीसेट हो गईं।" : "Default 3 medical reports restored.");
  };

  const handleSyncToVitals = () => {
    if (!activeReport) return;

    // Extract any matching biometric values from active report
    const sugarParam = activeReport.parameters?.find((p) =>
      p.name.toLowerCase().includes("glucose") || p.name.toLowerCase().includes("sugar")
    );

    let fastingVal = 124;
    if (sugarParam) {
      fastingVal = typeof sugarParam.value === "number" ? sugarParam.value : parseInt(sugarParam.value) || 124;
    }

    if (onUpdateVitals) {
      const newVital = {
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        bloodSugarFasting: fastingVal,
        bloodSugarPost: Math.round(fastingVal * 1.25),
        bpSystolic: 122,
        bpDiastolic: 80,
        pulse: 74,
        weight: patient?.weight || 72,
        bmi: 24.2,
        source: `Report: ${activeReport.title}`
      };
      onUpdateVitals(newVital);
    }

    if (onAddTimelineEvent) {
      let eventDate = new Date().toISOString().split("T")[0];
      if (activeReport.date) {
        try {
          const parsedD = new Date(activeReport.date);
          if (!isNaN(parsedD.getTime())) {
            eventDate = parsedD.toISOString().split("T")[0];
          }
        } catch {
          // fallback to today
        }
      }
      onAddTimelineEvent({
        id: `evt_rep_${Date.now()}`,
        date: eventDate,
        category: "Lab Test",
        title: activeReport.title,
        doctor: activeReport.lab || "Diagnostic Pathology",
        summary: activeReport.headlineSummary || "Laboratory diagnostic report analyzed.",
        badge: activeReport.overallRisk || "Report Logged",
        status:
          activeReport.overallRisk === "Attention Needed"
            ? "attention"
            : activeReport.overallRisk === "Moderate" || activeReport.overallRisk === "Borderline"
            ? "borderline"
            : "good"
      });
    }

    showToast(
      lang === "hi"
        ? `✅ "${activeReport.title}" का डेटा सफलतापूर्वक वाइटल्स व टाइमलाइन में सिंक हो गया!`
        : `✅ "${activeReport.title}" data synced to Vitals & Timeline!`
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedFile(file);
  };

  // Filter parameters by user search
  const filteredParams = activeReport?.parameters
    ? activeReport.parameters.filter(
        (p) =>
          p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (p.plainExplanation && p.plainExplanation.toLowerCase().includes(searchFilter.toLowerCase()))
      )
    : [];

  // Summary counts for active report
  const totalParamCount = activeReport?.parameters?.length || 0;
  const countGood = activeReport?.parameters?.filter((p) => p.status === "good").length || 0;
  const countBorderline = activeReport?.parameters?.filter((p) => p.status === "borderline").length || 0;
  const countAttention = activeReport?.parameters?.filter((p) => p.status === "attention").length || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          background: "var(--bg-elevated)",
          border: "1.5px solid var(--primary)",
          color: "var(--text-main)",
          padding: "14px 22px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.35)",
          zIndex: 9999,
          fontWeight: 700,
          fontSize: "0.92rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle2 size={18} color="var(--primary)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Inputs for Document & Camera */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Top Banner & Interactive Drag & Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="glass-panel" 
        style={{
          padding: "24px 28px",
          background: isDragOver ? "var(--primary-soft)" : "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
          border: isDragOver ? "2px dashed var(--primary)" : "1.5px solid var(--primary-border)",
          borderRadius: "18px",
          transition: "all 0.2s ease"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
              }}>
                <FileText size={22} />
              </div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)", letterSpacing: "-0.01em" }}>
                {t.smartLabReports || "Smart Lab Reports & AI Analyzer"}
              </h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "8px", marginBottom: 0, maxWidth: "680px" }}>
              {t.smartLabReportsDesc || "Upload or scan any lab report (PDF or image). PulseAI extracts clinical biomarkers, compares standard references, and translates them into everyday language."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isAnalyzing}
              className="btn btn-secondary"
              style={{
                height: "44px",
                padding: "0 18px",
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-elevated)",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
              title={lang === "hi" ? "कैमरे से रिपोर्ट की फोटो खींचें" : "Capture lab report with device camera"}
            >
              <Camera size={18} color="var(--primary)" />
              <span>{lang === "hi" ? "फोटो स्कैन करें" : "Scan Photo"}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{
                height: "44px",
                padding: "0 22px",
                fontSize: "0.9rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.28)",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <UploadCloud size={19} />
              <span>
                {isAnalyzing 
                  ? (lang === "hi" ? "एआई स्कैन हो रहा है..." : "Analyzing Report...") 
                  : (lang === "hi" ? "नई रिपोर्ट अपलोड करें (PDF / इमेज)" : "Upload Report (PDF / Image)")}
              </span>
            </button>
          </div>
        </div>

        {/* Live AI Vision Scanning Progress Banner */}
        {isAnalyzing && (
          <div style={{
            marginTop: "18px",
            background: "var(--bg-card)",
            borderRadius: "14px",
            padding: "16px 20px",
            border: "1.5px solid var(--primary)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "var(--shadow-md)"
          }}>
            <div className="spinner" style={{ width: "28px", height: "28px", borderTopColor: "var(--primary)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--primary)" }}>
                  {scanningPhase === 1 && (lang === "hi" ? "चरण 1/3: दस्तावेज़ व इमेज पिक्सल स्कैन हो रहे हैं..." : "Phase 1/3: Scanning document layout & image pixels...")}
                  {scanningPhase === 2 && (lang === "hi" ? "चरण 2/3: बायोमार्कर, इकाइयां व संदर्भ सीमाएं निकाली जा रही हैं..." : "Phase 2/3: Extracting laboratory markers & reference intervals...")}
                  {scanningPhase === 3 && (lang === "hi" ? "चरण 3/3: मरीज़-अनुकूल सरल सारांश व डॉक्टर के प्रश्न तैयार हो रहे हैं..." : "Phase 3/3: Formulating plain language synthesis & doctor questions...")}
                </span>
                <span className="badge badge-primary">{scanningPhase * 33}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-elevated)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{
                  width: `${scanningPhase * 33}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                  transition: "width 0.4s ease"
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instant Visual Report Tab Strip (Switch Between Reports at 1 Click) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={15} color="var(--primary)" />
            <span>{lang === "hi" ? "उपलब्ध मेडिकल रिपोर्ट्स (क्लिक करके तुरंत बदलें):" : "Available Medical Reports (Click Tab to Switch):"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={handleRestoreSamples}
              className="btn btn-secondary"
              style={{ fontSize: "0.78rem", height: "32px", padding: "0 10px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "5px" }}
              title={lang === "hi" ? "सभी डिफ़ॉल्ट रिपोर्ट्स रीसेट करें" : "Reset all default sample reports"}
            >
              <RotateCcw size={13} />
              <span>{lang === "hi" ? "डिफ़ॉल्ट रीसेट" : "Reset Samples"}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Pill Tabs */}
        <div style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "6px",
          scrollbarWidth: "thin"
        }}>
          {reports.map((r) => {
            const isSelected = selectedReportId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedReportId(r.id);
                  setSearchFilter("");
                }}
                onDoubleClick={() => {
                  setSelectedReportId(r.id);
                  setShowDocPreviewModal(true);
                }}
                title={lang === "hi" ? "क्लिक से चुनें • डबल-क्लिक (2x) से पूरी मेडिकल रिपोर्ट खोलें" : "Click to select • Double-click (2x) to open full official medical report"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "0.88rem",
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected 
                    ? "linear-gradient(135deg, #4f46e5, #6366f1)" 
                    : "var(--bg-card)",
                  color: isSelected ? "#ffffff" : "var(--text-main)",
                  border: isSelected ? "1.5px solid #6366f1" : "1.5px solid var(--border-color)",
                  boxShadow: isSelected ? "0 4px 16px rgba(79, 70, 229, 0.35)" : "var(--shadow-sm)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s ease",
                  flexShrink: 0
                }}
              >
                <FileText size={16} color={isSelected ? "#ffffff" : "#6366f1"} />
                <span>{r.title}</span>
                <span style={{
                  fontSize: "0.74rem",
                  padding: "2px 8px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  background: isSelected ? "rgba(255, 255, 255, 0.28)" : "var(--bg-elevated)",
                  color: isSelected ? "#ffffff" : "var(--text-muted)"
                }}>
                  {r.parameters?.length || 0} {lang === "hi" ? "टेस्ट" : "tests"}
                </span>
                {r.overallRisk && (
                  <span style={{
                    fontSize: "0.68rem",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    fontWeight: 800,
                    background: isSelected
                      ? "rgba(255, 255, 255, 0.2)"
                      : r.overallRisk === "Attention Needed"
                      ? "rgba(239, 68, 68, 0.16)"
                      : r.overallRisk === "Moderate" || r.overallRisk === "Borderline"
                      ? "rgba(245, 158, 11, 0.16)"
                      : "rgba(16, 185, 129, 0.16)",
                    color: isSelected
                      ? "#ffffff"
                      : r.overallRisk === "Attention Needed"
                      ? "#ef4444"
                      : r.overallRisk === "Moderate" || r.overallRisk === "Borderline"
                      ? "#f59e0b"
                      : "#10b981"
                  }}>
                    {r.overallRisk}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Active Report Overview & Executive Summary Banner */}
      {activeReport ? (
        <div
          className="glass-panel"
          style={{
            padding: "24px 28px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, var(--bg-card), var(--bg-elevated))",
            border: "1.5px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          {/* Header Row: Title, Risk Badge, Lab, Date, Patient & Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-highlight)", margin: 0 }}>
                  {activeReport.title}
                </h2>
                <span className={`badge ${
                  activeReport.overallRisk === "Attention Needed" 
                    ? "badge-critical" 
                    : activeReport.overallRisk === "Moderate" || activeReport.overallRisk === "Borderline" 
                    ? "badge-borderline" 
                    : "badge-good"
                }`} style={{ fontSize: "0.82rem", padding: "4px 12px", borderRadius: "8px" }}>
                  {activeReport.overallRisk === "Attention Needed"
                    ? (lang === "hi" ? "🔴 ध्यान देने योग्य (Attention Needed)" : "Attention Needed")
                    : (activeReport.overallRisk === "Moderate" || activeReport.overallRisk === "Borderline")
                    ? (lang === "hi" ? "🟡 मध्यम जोखिम (Moderate)" : "Moderate / Borderline")
                    : (lang === "hi" ? "🟢 सामान्य / स्वस्थ (Optimal)" : "Optimal")}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px", flexWrap: "wrap", fontSize: "0.86rem", color: "var(--text-muted)" }}>
                {activeReport.lab && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Building2 size={16} color="var(--primary)" />
                    <strong>{activeReport.lab}</strong>
                  </span>
                )}
                {activeReport.date && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={16} color="var(--secondary)" />
                    <span>{activeReport.date}</span>
                  </span>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <User size={16} color="var(--text-dim)" />
                  <span>{lang === "hi" ? "मरीज़:" : "Patient:"} {activeReport.patientName || patient?.name || "Aarish Rajput"}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons for Active Report */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleSyncToVitals}
                className="btn btn-secondary"
                style={{
                  height: "40px",
                  padding: "0 16px",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  borderRadius: "10px",
                  border: "1.5px solid var(--secondary-border)",
                  color: "var(--secondary)",
                  background: "var(--secondary-soft)"
                }}
                title={lang === "hi" ? "इस रिपोर्ट का डेटा वाइटल्स और टाइमलाइन में दर्ज करें" : "Sync report parameters to patient vitals & timeline"}
              >
                <Activity size={16} color="var(--secondary)" />
                <span>{lang === "hi" ? "वाइटल्स में सिंक करें" : "Sync to Vitals"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDocPreviewModal(true)}
                className="btn btn-secondary"
                style={{ height: "40px", padding: "0 14px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "10px" }}
                title={lang === "hi" ? "पूरी आधिकारिक मेडिकल रिपोर्ट खोलें (डबल-क्लिक भी कर सकते हैं)" : "Open full official diagnostic report (or double click tab)"}
              >
                <Eye size={16} color="var(--primary)" />
                <span>{lang === "hi" ? "पूरी रिपोर्ट देखें (2x)" : "View Full Report (2x)"}</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleDeleteReport(activeReport.id, e)}
                className="btn btn-secondary"
                style={{
                  height: "40px",
                  padding: "0 12px",
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#ef4444",
                  borderColor: "rgba(239, 68, 68, 0.35)",
                  borderRadius: "10px"
                }}
                title={lang === "hi" ? "सक्रिय रिपोर्ट हटाएं" : "Delete active report"}
              >
                <Trash2 size={16} color="#ef4444" />
              </button>
            </div>
          </div>

          {/* Metric Count Chips */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ padding: "7px 15px", borderRadius: "10px", background: "var(--bg-elevated)", border: "1px solid var(--border-color)", fontSize: "0.84rem", fontWeight: 700 }}>
              🧪 {lang === "hi" ? "कुल बायोमार्कर:" : "Total Biomarkers:"} <strong style={{ color: "var(--text-highlight)", marginLeft: "4px" }}>{totalParamCount}</strong>
            </div>
            <div style={{ padding: "7px 15px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", fontSize: "0.84rem", fontWeight: 700, color: "#10b981" }}>
              🟢 {lang === "hi" ? "सामान्य (Normal):" : "Normal:"} <strong style={{ marginLeft: "4px" }}>{countGood}</strong>
            </div>
            {countBorderline > 0 && (
              <div style={{ padding: "7px 15px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", fontSize: "0.84rem", fontWeight: 700, color: "#f59e0b" }}>
                🟡 {lang === "hi" ? "सीमा पर (Borderline):" : "Borderline:"} <strong style={{ marginLeft: "4px" }}>{countBorderline}</strong>
              </div>
            )}
            {countAttention > 0 && (
              <div style={{ padding: "7px 15px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", fontSize: "0.84rem", fontWeight: 700, color: "#ef4444" }}>
                🔴 {lang === "hi" ? "ध्यान देने योग्य (Attention):" : "Attention Needed:"} <strong style={{ marginLeft: "4px" }}>{countAttention}</strong>
              </div>
            )}
          </div>

          {/* Plain Language Headline Summary */}
          {activeReport.headlineSummary && (
            <div style={{
              background: "var(--primary-soft)",
              border: "1px solid var(--primary-border)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px"
            }}>
              <Sparkles size={22} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)", marginBottom: "4px" }}>
                  {lang === "hi" ? "एआई क्लिनिकल सारांश (सरल भाषा में):" : "AI Clinical Synthesis (Plain Language Summary):"}
                </div>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.55, color: "var(--text-main)", fontWeight: 500 }}>
                  {activeReport.headlineSummary}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center", borderRadius: "16px" }}>
          <FileText size={42} color="var(--primary)" style={{ opacity: 0.6, marginBottom: "12px" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
            {lang === "hi" ? "कोई रिपोर्ट मौजूद नहीं है" : "No Reports Available"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
            {lang === "hi" ? "कृपया ऊपर दिए गए बटन से नई रिपोर्ट अपलोड करें या डिफ़ॉल्ट रीसेट करें।" : "Upload a report using the button above or restore default sample reports."}
          </p>
          <button onClick={handleRestoreSamples} className="btn btn-primary" style={{ marginTop: "16px" }}>
            {lang === "hi" ? "डिफ़ॉल्ट रिपोर्ट रीसेट करें" : "Restore Sample Reports"}
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      {activeReport && (
        <div style={{ position: "relative" }}>
          <Search size={17} color="var(--text-dim)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={lang === "hi" ? "बायोमार्कर खोजें..." : "Search biomarkers..."}
            style={{ paddingLeft: "44px", height: "46px", borderRadius: "12px" }}
          />
        </div>
      )}

      {/* Biomarker Parameters Breakdown List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {activeReport && filteredParams.length === 0 ? (
          <div className="glass-panel" style={{ padding: "30px 20px", textAlign: "center", borderRadius: "14px", color: "var(--text-muted)" }}>
            {lang === "hi" ? "खोजे गए पैरामीटर से कोई टेस्ट नहीं मिला।" : "No parameters match your search filter in this report."}
          </div>
        ) : (
          filteredParams.map((param, index) => {
            const isAttention = param.status === "attention";
            const isBorderline = param.status === "borderline";

            return (
              <div
                key={index}
                className="glass-panel"
                style={{
                  padding: "20px 24px",
                  borderRadius: "16px",
                  borderLeft: isAttention
                    ? "5px solid #ef4444"
                    : isBorderline
                    ? "5px solid #f59e0b"
                    : "5px solid #10b981",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Header: Biomarker Name, Badge & Observed Value */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "1.12rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)" }}>
                        {param.name}
                      </h3>
                      <span className={`badge ${
                        isAttention ? "badge-critical" : isBorderline ? "badge-borderline" : "badge-good"
                      }`}>
                        {isAttention 
                          ? (lang === "hi" ? "ध्यान देने योग्य (Attention)" : "Attention Needed") 
                          : isBorderline 
                          ? (lang === "hi" ? "सीमा पर (Borderline)" : "Borderline") 
                          : (lang === "hi" ? "सामान्य (Normal)" : "Normal")}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {lang === "hi" ? "मानक संदर्भ सीमा:" : "Standard Reference:"} <strong>{param.reference}</strong>
                    </div>
                  </div>

                  <div style={{
                    textAlign: "right",
                    background: "var(--bg-elevated)",
                    padding: "8px 18px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    minWidth: "120px"
                  }}>
                    <div style={{ fontSize: "1.45rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                      {param.value} <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{param.unit}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                      {lang === "hi" ? "प्राप्त मान" : "Observed"}
                    </div>
                  </div>
                </div>

                {/* Visual Position Gauge */}
                <div style={{ marginTop: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                    <span>{lang === "hi" ? "न्यूनतम" : "Low"}</span>
                    <span style={{ color: isAttention ? "#ef4444" : isBorderline ? "#f59e0b" : "#10b981", fontWeight: 700 }}>
                      {lang === "hi" ? "लक्ष्य दायरा:" : "Target Interval:"} {param.reference}
                    </span>
                    <span>{lang === "hi" ? "अधिकतम" : "High"}</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "var(--bg-elevated)", borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{
                      width: isAttention ? "92%" : isBorderline ? "74%" : "50%",
                      height: "100%",
                      borderRadius: "8px",
                      background: isAttention ? "#ef4444" : isBorderline ? "#f59e0b" : "#10b981",
                      transition: "width 0.4s ease"
                    }} />
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                <div style={{
                  background: "var(--bg-elevated)",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontSize: "0.92rem",
                  lineHeight: "1.55",
                  color: "var(--text-main)"
                }}>
                  <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                    {lang === "hi" ? "आपके लिए इसका क्या अर्थ है: " : "What this means for you: "}
                  </span>
                  {param.plainExplanation}
                </div>

                {/* Action Item & Discuss Link */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingTop: "2px" }}>
                  <div style={{ fontSize: "0.86rem", color: "var(--secondary)", fontWeight: 700 }}>
                    💡 {lang === "hi" ? "सलाह:" : "Recommendation:"} {param.actionItem}
                  </div>
                  <button
                    onClick={() => onAskCopilot(`Tell me more about my ${param.name} reading of ${param.value} ${param.unit}. How does it affect my daily health?`)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "0.84rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {lang === "hi" ? "कोपायलट से इस बारे में पूछें" : "Ask Copilot about this"} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Doctor Consultation Questions Card */}
      {activeReport?.doctorQuestions && activeReport.doctorQuestions.length > 0 && (
        <div className="glass-panel" style={{
          padding: "24px 28px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, var(--secondary-soft), var(--bg-card))",
          border: "1.5px solid var(--secondary-border)"
        }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <HelpCircle size={22} color="var(--secondary)" />
            {lang === "hi" ? "इस रिपोर्ट के आधार पर डॉक्टर से पूछे जाने वाले सवाल" : "Questions to Ask Your Doctor Based On This Report"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeReport.doctorQuestions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.92rem",
                  color: "var(--text-main)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                <strong style={{ color: "var(--secondary)", flexShrink: 0 }}>{idx + 1}.</strong>
                <span style={{ flex: 1 }}>"{q}"</span>
                <button
                  type="button"
                  onClick={() => onAskCopilot(`Doctor Question from report: ${q}`)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                  title={lang === "hi" ? "कोपायलट से पूछें" : "Ask Copilot"}
                >
                  {lang === "hi" ? "कोपायलट से पूछें" : "Ask Copilot"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scanned Document Preview Modal / Full Clinical Dossier */}
      {showDocPreviewModal && activeReport && (
        <div className="modal-overlay" onClick={() => setShowDocPreviewModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: "850px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
          >
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileCheck2 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {activeReport.previewUrl 
                    ? (lang === "hi" ? "मूल स्कैन किया गया दस्तावेज़" : "Scanned Medical Report Source")
                    : (lang === "hi" ? "आधिकारिक मेडिकल लैब रिपोर्ट" : "Official Medical Diagnostic Report")}
                </h3>
                <span className="badge badge-primary">{activeReport.fileName || activeReport.title}</span>
              </div>
              <button 
                onClick={() => setShowDocPreviewModal(false)}
                className="btn btn-secondary"
                style={{ padding: "6px" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", background: "var(--bg-elevated)", minHeight: "350px" }}>
              {activeReport.previewUrl ? (
                <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeReport.fileType?.includes("pdf") ? (
                    <iframe
                      src={activeReport.previewUrl}
                      title="PDF Preview"
                      style={{ width: "100%", height: "560px", border: "none", borderRadius: "8px" }}
                    />
                  ) : (
                    <img
                      src={activeReport.previewUrl}
                      alt="Scanned Report"
                      style={{ maxWidth: "100%", maxHeight: "560px", objectFit: "contain", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
                    />
                  )}
                </div>
              ) : (
                <div style={{ background: "#ffffff", color: "#0f172a", borderRadius: "12px", padding: "24px", border: "1.5px solid #cbd5e1" }}>
                  {/* Lab Header */}
                  <div style={{ borderBottom: "2px solid #0284c7", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "18px", color: "#0369a1", fontWeight: 900 }}>{activeReport.lab || "Diagnostic Pathology Laboratory"}</h4>
                      <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#64748b" }}>{activeReport.labAddress || "NABL & CAP Accredited Clinical Laboratory"}</p>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "11px", color: "#64748b" }}>
                      <div>Date: <strong style={{ color: "#0f172a" }}>{activeReport.date}</strong></div>
                      <div>Doctor: <strong style={{ color: "#0f172a" }}>{activeReport.referringDoctor || "Primary Physician"}</strong></div>
                    </div>
                  </div>

                  {/* Patient Essential Demographics */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", fontSize: "12px" }}>
                    <div><span style={{ color: "#64748b" }}>Patient:</span> <strong style={{ color: "#0f172a", fontSize: "13px" }}>{activeReport.patientName || patient?.name}</strong></div>
                    <div><span style={{ color: "#64748b" }}>Age / Gender:</span> <strong style={{ color: "#0f172a" }}>{activeReport.age || patient?.age} Yrs / {activeReport.gender || patient?.gender}</strong></div>
                    <div><span style={{ color: "#64748b" }}>Blood Group:</span> <strong style={{ color: "#dc2626" }}>{activeReport.bloodGroup || patient?.bloodGroup}</strong></div>
                    <div><span style={{ color: "#64748b" }}>Mobile:</span> <strong style={{ color: "#0f172a" }}>{activeReport.phone || patient?.emergencyContact?.phone || patient?.phone}</strong></div>
                    <div style={{ gridColumn: "span 2" }}><span style={{ color: "#64748b" }}>Address:</span> <strong style={{ color: "#0f172a" }}>{activeReport.address || patient?.address}</strong></div>
                    <div><span style={{ color: "#64748b" }}>ABHA ID:</span> <strong style={{ color: "#0284c7", fontFamily: "monospace" }}>{activeReport.abhaId || patient?.abhaId}</strong></div>
                  </div>

                  {/* Test Table */}
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9", borderBottom: "1.5px solid #cbd5e1", color: "#334155" }}>
                        <th style={{ padding: "8px", textAlign: "left" }}>Investigation</th>
                        <th style={{ padding: "8px", textAlign: "left" }}>Observed Value</th>
                        <th style={{ padding: "8px", textAlign: "left" }}>Reference Range</th>
                        <th style={{ padding: "8px", textAlign: "center" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeReport.parameters || []).map((p, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "8px", fontWeight: 700 }}>{p.name}</td>
                          <td style={{ padding: "8px", fontWeight: 800, color: p.status === "attention" ? "#dc2626" : p.status === "borderline" ? "#d97706" : "#0f172a" }}>{p.value} {p.unit}</td>
                          <td style={{ padding: "8px", color: "#64748b" }}>{p.reference}</td>
                          <td style={{ padding: "8px", textAlign: "center" }}>
                            <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, background: p.status === "attention" ? "#fee2e2" : p.status === "borderline" ? "#fef3c7" : "#dcfce7", color: p.status === "attention" ? "#dc2626" : p.status === "borderline" ? "#d97706" : "#15803d" }}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
