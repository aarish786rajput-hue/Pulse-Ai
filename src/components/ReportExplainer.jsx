import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  Trash2,
  Check
} from "lucide-react";
import { sampleReports } from "../data/sampleReports";
import { analyzeReportFile } from "../services/geminiService";

export default function ReportExplainer({ 
  onAskCopilot, 
  patient, 
  lang = 'en',
  pendingUploadFile,
  onClearPendingFile
}) {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_user_reports");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load reports from storage", e);
    }
    return sampleReports;
  });

  const [selectedReportId, setSelectedReportId] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_user_reports");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch (e) {
      console.error(e);
    }
    return sampleReports[0]?.id || "";
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningPhase, setScanningPhase] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0] || null;

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (pendingUploadFile) {
      processUploadedFile(pendingUploadFile);
      if (onClearPendingFile) onClearPendingFile();
    }
  }, [pendingUploadFile]);

  const processUploadedFile = (file) => {
    if (!file) return;

    setIsAnalyzing(true);
    setScanningPhase(1);

    const phaseTimer1 = setTimeout(() => setScanningPhase(2), 600);
    const phaseTimer2 = setTimeout(() => setScanningPhase(3), 1200);

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
        setReports((prev) => {
          const updated = [analyzed, ...prev];
          try {
            localStorage.setItem("pulseai_user_reports", JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        setSelectedReportId(analyzed.id);
      } catch (err) {
        console.error("Report processing error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteReport = (idToDelete, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const reportToDelete = reports.find(r => r.id === idToDelete);
    const confirmMsg = lang === "hi" 
      ? `क्या आप "${reportToDelete?.title || 'यह रिपोर्ट'}" को हटाना चाहते हैं?` 
      : `Are you sure you want to delete "${reportToDelete?.title || 'this report'}"?`;
    
    if (window.confirm(confirmMsg)) {
      const updated = reports.filter(r => r.id !== idToDelete);
      setReports(updated);
      try {
        localStorage.setItem("pulseai_user_reports", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      if (selectedReportId === idToDelete) {
        if (updated.length > 0) {
          setSelectedReportId(updated[0].id);
        } else {
          setSelectedReportId(null);
        }
      }
    }
  };

  const handleRestoreSamples = () => {
    setReports(sampleReports);
    setSelectedReportId(sampleReports[0].id);
    try {
      localStorage.setItem("pulseai_user_reports", JSON.stringify(sampleReports));
    } catch (err) {
      console.error(err);
    }
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

  const filteredParams = activeReport?.parameters ? activeReport.parameters.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.plainExplanation.toLowerCase().includes(searchFilter.toLowerCase())
  ) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
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
          padding: "22px 28px",
          background: isDragOver ? "var(--primary-soft)" : "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
          border: isDragOver ? "2px dashed var(--primary)" : "1px solid var(--primary-border)",
          borderRadius: "16px",
          transition: "all 0.2s ease"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <div>
            <h1 style={{ fontSize: "1.65rem", fontWeight: 800, margin: 0, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
              {lang === "hi" ? "स्मार्ट लैब रिपोर्ट्स" : "Smart Lab Reports"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px", marginBottom: 0 }}>
              {lang === "hi"
                ? "अपनी टेस्ट रिपोर्ट अपलोड या स्कैन करें और आसान भाषा में रिज़ल्ट समझें।"
                : "Upload or scan your medical test report to view clear, easy-to-understand insights."}
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
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.22)",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <UploadCloud size={18} />
              <span>
                {isAnalyzing 
                  ? (lang === "hi" ? "स्कैन हो रहा है..." : "Analyzing Report...") 
                  : (lang === "hi" ? "रिपोर्ट अपलोड करें (PDF / इमेज)" : "Upload Report (PDF / Image)")}
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

      {/* Report Selector Dropdown Section */}
      <div 
        ref={dropdownRef} 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "12px", 
          flexWrap: "wrap",
          position: "relative"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", position: "relative" }}>
          <label style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={16} color="var(--primary)" />
            <span>{lang === "hi" ? "मेडिकल रिपोर्ट चुनें:" : "Select Medical Report:"}</span>
          </label>

          {/* Interactive Custom Dropdown Menu Trigger */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                fontSize: "0.9rem",
                fontWeight: 600,
                background: "var(--bg-card)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "12px",
                color: "var(--text-main)",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                minWidth: "260px",
                maxWidth: "380px",
                justifyContent: "space-between"
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                {activeReport ? activeReport.title : (lang === "hi" ? "कोई रिपोर्ट नहीं" : "No Report Selected")}
              </span>
              <ChevronDown 
                size={16} 
                color="var(--text-muted)" 
                style={{ 
                  flexShrink: 0, 
                  transition: "transform 0.2s ease", 
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" 
                }} 
              />
            </button>

            {/* Dropdown Options Popup */}
            {isDropdownOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  minWidth: "320px",
                  maxWidth: "420px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                  padding: "6px",
                  zIndex: 999,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  maxHeight: "340px",
                  overflowY: "auto"
                }}
              >
                {reports.length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {lang === "hi" ? "कोई रिपोर्ट मौजूद नहीं है" : "No reports available"}
                  </div>
                ) : (
                  reports.map((r) => {
                    const isSelected = selectedReportId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedReportId(r.id);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          background: isSelected ? "var(--primary-soft)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s ease"
                        }}
                        className={!isSelected ? "dropdown-hover-item" : ""}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                          {isSelected ? (
                            <Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                          ) : (
                            <FileText size={16} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                          )}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ 
                              fontSize: "0.88rem", 
                              fontWeight: isSelected ? 700 : 500, 
                              color: isSelected ? "var(--primary)" : "var(--text-main)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}>
                              {r.title}
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {r.date} {r.lab ? `• ${r.lab}` : ""}
                            </div>
                          </div>
                        </div>

                        {/* Delete Single Report Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteReport(r.id, e)}
                          title={lang === "hi" ? "यह रिपोर्ट हटाएं" : "Delete this report"}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "6px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                            transition: "all 0.15s ease",
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#ef4444";
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--text-muted)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls for Selected Report (Delete & View Original) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {activeReport && (
            <button
              type="button"
              onClick={(e) => handleDeleteReport(activeReport.id, e)}
              className="btn btn-secondary"
              style={{
                height: "40px",
                padding: "0 14px",
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
              <Trash2 size={15} color="#ef4444" />
              <span>{lang === "hi" ? "रिपोर्ट हटाएं" : "Delete Report"}</span>
            </button>
          )}

          {activeReport?.previewUrl && (
            <button
              type="button"
              onClick={() => setShowDocPreviewModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: "0.84rem", display: "inline-flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 14px", borderRadius: "10px" }}
            >
              <Eye size={15} color="var(--primary)" />
              <span>{lang === "hi" ? "मूल दस्तावेज़" : "View Original"}</span>
            </button>
          )}

          {reports.length === 0 && (
            <button
              type="button"
              onClick={handleRestoreSamples}
              className="btn btn-primary"
              style={{ height: "40px", padding: "0 14px", fontSize: "0.85rem", borderRadius: "10px" }}
            >
              {lang === "hi" ? "डिफ़ॉल्ट रिपोर्ट रीसेट करें" : "Restore Sample Reports"}
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ position: "relative" }}>
        <Search size={16} color="var(--text-dim)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={lang === "hi" 
            ? "टेस्ट बायोमार्कर खोजें (जैसे: 'HbA1c', 'Glucose', 'LDL', 'Creatinine')..." 
            : "Search test parameters (e.g. 'HbA1c', 'Glucose', 'LDL', 'Creatinine')..."}
          style={{ paddingLeft: "40px" }}
        />
      </div>

      {/* Biomarker Parameters Breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reports.length === 0 ? (
          <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center", borderRadius: "14px" }}>
            <FileText size={40} color="var(--primary)" style={{ opacity: 0.6, marginBottom: "12px" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {lang === "hi" ? "कोई रिपोर्ट मौजूद नहीं है" : "No Reports Available"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.86rem", marginTop: "4px" }}>
              {lang === "hi" ? "कृपया ऊपर दिए गए बटन से नई रिपोर्ट अपलोड करें या डिफ़ॉल्ट रीसेट करें।" : "Upload a new report using the button above or restore default sample reports."}
            </p>
            <button onClick={handleRestoreSamples} className="btn btn-primary" style={{ marginTop: "14px" }}>
              {lang === "hi" ? "डिफ़ॉल्ट रिपोर्ट रीसेट करें" : "Restore Sample Reports"}
            </button>
          </div>
        ) : filteredParams.length === 0 ? (
          <div className="glass-panel" style={{ padding: "30px 20px", textAlign: "center", borderRadius: "14px", color: "var(--text-muted)" }}>
            {lang === "hi" ? "खोजे गए पैरामीटर से कोई टेस्ट नहीं मिला।" : "No parameters match your search filter."}
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
                padding: "18px 22px",
                borderLeft: isAttention
                  ? "4px solid #ef4444"
                  : isBorderline
                  ? "4px solid #f59e0b"
                  : "4px solid #10b981",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "1.08rem", fontWeight: 800 }}>{param.name}</h3>
                    <span className={`badge ${
                      isAttention ? "badge-critical" : isBorderline ? "badge-borderline" : "badge-good"
                    }`}>
                      {isAttention 
                        ? (lang === "hi" ? "ध्यान देने योग्य" : "Attention Needed") 
                        : isBorderline 
                        ? (lang === "hi" ? "सीमा पर (Borderline)" : "Borderline") 
                        : (lang === "hi" ? "सामान्य (Normal)" : "Normal")}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    {lang === "hi" ? "मानक संदर्भ सीमा:" : "Standard Reference:"} {param.reference}
                  </div>
                </div>

                <div style={{
                  textAlign: "right",
                  background: "var(--bg-elevated)",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)"
                }}>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                    {param.value} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{param.unit}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {lang === "hi" ? "प्राप्त मान" : "Observed"}
                  </div>
                </div>
              </div>

              {/* Translation */}
              <div style={{
                background: "var(--bg-elevated)",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                color: "var(--text-main)"
              }}>
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {lang === "hi" ? "आपके लिए इसका क्या अर्थ है: " : "What this means for you: "}
                </span>
                {param.plainExplanation}
              </div>

              {/* Action Item & Discuss Link */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingTop: "4px" }}>
                <div style={{ fontSize: "0.84rem", color: "var(--secondary)", fontWeight: 600 }}>
                  💡 {lang === "hi" ? "सलाह:" : "Recommendation:"} {param.actionItem}
                </div>
                <button
                  onClick={() => onAskCopilot(`Tell me more about my ${param.name} reading of ${param.value} ${param.unit}. How does it affect my daily health?`)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {lang === "hi" ? "कोपायलट से इस बारे में पूछें" : "Ask Copilot about this"} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Doctor Consultation Questions Card */}
      {activeReport?.doctorQuestions && (
        <div className="glass-panel" style={{
          padding: "22px 26px",
          background: "linear-gradient(135deg, var(--secondary-soft), var(--bg-card))",
          border: "1px solid var(--secondary-border)"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <HelpCircle size={20} color="var(--secondary)" />
            {lang === "hi" ? "इस रिपोर्ट के आधार पर डॉक्टर से पूछे जाने वाले सवाल" : "Questions to Ask Your Doctor Based On This Report"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {activeReport.doctorQuestions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.88rem",
                  color: "var(--text-main)"
                }}
              >
                <strong>{idx + 1}.</strong> "{q}"
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scanned Document Preview Modal */}
      {showDocPreviewModal && activeReport?.previewUrl && (
        <div className="modal-overlay" onClick={() => setShowDocPreviewModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: "780px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
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
                  {lang === "hi" ? "मूल स्कैन किया गया दस्तावेज़" : "Scanned Medical Report Source"}
                </h3>
                <span className="badge badge-primary">{activeReport?.fileName || "Document"}</span>
              </div>
              <button 
                onClick={() => setShowDocPreviewModal(false)}
                className="btn btn-secondary"
                style={{ padding: "6px" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", textAlign: "center", background: "var(--bg-elevated)", minHeight: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {activeReport.fileType?.includes("pdf") ? (
                <iframe
                  src={activeReport.previewUrl}
                  title="PDF Preview"
                  style={{ width: "100%", height: "540px", border: "none", borderRadius: "8px" }}
                />
              ) : (
                <img
                  src={activeReport.previewUrl}
                  alt="Scanned Report"
                  style={{ maxWidth: "100%", maxHeight: "540px", objectFit: "contain", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
