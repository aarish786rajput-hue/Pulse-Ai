import React, { useState, useRef, useEffect } from "react";
import {
  ClipboardCheck,
  Calendar,
  User,
  Phone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pill,
  HeartHandshake,
  UploadCloud,
  Camera,
  Printer,
  ChevronDown,
  Trash2,
  Check,
  MessageSquareHeart,
  Clock,
  Utensils,
  Footprints,
  Droplets
} from "lucide-react";
import { mockDischargeSummaries } from "../data/mockDischargeData";

export default function DischargeSummary({ patient, lang = "en", onAskCopilot }) {
  // Load summaries from localStorage or fallback to mock data
  const [summaries, setSummaries] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_user_discharge_summaries");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            ...item,
            simpleDiagnosis: item.simpleDiagnosis
              ? item.simpleDiagnosis.replace(/\s*\(पेट का इन्फेक्शन व कमजोरी\)/g, "").trim()
              : item.simpleDiagnosis
          }));
        }
      }
    } catch (e) {
      console.error("Failed to load discharge summaries from storage", e);
    }
    return mockDischargeSummaries;
  });

  const [selectedSummaryId, setSelectedSummaryId] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_user_discharge_summaries");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch (e) {
      console.error(e);
    }
    return mockDischargeSummaries[0]?.id || "";
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const activeSummary = summaries.find((s) => s.id === selectedSummaryId) || summaries[0] || null;

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

  // Save to localStorage
  const saveSummaries = (newList) => {
    setSummaries(newList);
    try {
      localStorage.setItem("pulseai_user_discharge_summaries", JSON.stringify(newList));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a single discharge summary
  const handleDeleteSummary = (idToDelete, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const itemToDelete = summaries.find((s) => s.id === idToDelete);
    const confirmMsg =
      lang === "hi"
        ? `क्या आप "${itemToDelete?.title || "यह डिस्चार्ज सारांश"}" को हटाना चाहते हैं?`
        : `Are you sure you want to delete "${itemToDelete?.title || "this discharge summary"}"?`;

    if (window.confirm(confirmMsg)) {
      const updated = summaries.filter((s) => s.id !== idToDelete);
      saveSummaries(updated);
      if (selectedSummaryId === idToDelete) {
        setSelectedSummaryId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    saveSummaries(mockDischargeSummaries);
    setSelectedSummaryId(mockDischargeSummaries[0].id);
  };

  // Process uploaded discharge paper
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "");

      // Generate realistic simplified patient-friendly discharge record
      const newSummary = {
        id: `disch_upload_${Date.now()}`,
        patientId: patient?.id || "pat_1",
        patientName: patient?.name || "Aarish Rajput",
        title: cleanFileName.length > 3 ? cleanFileName : "Hospital Discharge Summary",
        hospital: "City Multi-Speciality Hospital",
        department: "General Medicine & Patient Care",
        admissionDate: "Recent Admission",
        dischargeDate: new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        lengthOfStay: "2-3 Days",
        doctor: "Attending Physician & Care Team",
        doctorPhone: "+91 11 2692 5000",
        emergencyHelpline: "1066",
        dischargeStatus: "Stable & Discharged Home",
        statusBadge: "good",
        previewUrl: dataUrl,
        simpleDiagnosis: "Recovered from Acute Illness",
        originalMedicalDiagnosis: "Scanned Discharge Protocol & Clinical Assessment",
        simpleSummary:
          "The patient received hospital care, initial monitoring, and stabilizing medical therapy. The vital signs have normalized, and the patient is advised to continue home rest, follow prescribed diet guidelines, and take scheduled medications as instructed.",
        homeCare: {
          diet: {
            titleEn: "Diet & Food Guidelines",
            titleHi: "आहार और खान-पान सलाह",
            allowedEn: ["Fresh homemade light meals (khichdi, oats, dalia)", "Plenty of water, ORS fluids, and coconut water", "Steamed vegetables and fresh soft fruits"],
            allowedHi: ["हल्का घर का खाना (खिचड़ी, दलिया, सूप)", "पर्याप्त पानी, ओआरएस और नारियल पानी", "उबली सब्जियां और ताजे फल"],
            avoidEn: ["Heavy, oily, or spicy outside foods", "Aerated sodas, excessive tea or coffee", "Raw or unhygienic street food"],
            avoidHi: ["ऑयली और तीखा खाना", "कोल्ड ड्रिंक्स और ज्यादा चाय", "बाहर का खुला खाना"]
          },
          activity: {
            titleEn: "Physical Rest & Routine",
            titleHi: "आराम और दिनचर्या",
            instructionsEn: [
              "Take adequate bed rest for at least 48 hours.",
              "Light walking around the house is safe and recommended.",
              "Avoid strenuous physical work, heavy lifting, or workouts for 7 days."
            ],
            instructionsHi: [
              "कम से कम 48 घंटे पूरा आराम करें।",
              "घर में हल्की चहलकदमी कर सकते हैं।",
              "7 दिनों तक कोई भी भारी वजन न उठाएं।"
            ]
          },
          hydration: {
            dailyGoalEn: "2.5 to 3 Liters of fluids daily",
            dailyGoalHi: "प्रतिदिन 2.5 से 3 लीटर तरल पदार्थ पिएं",
            noteEn: "Staying hydrated promotes fast recovery and organ recovery.",
            noteHi: "पर्याप्त पानी पीने से शरीर की कमजोरी जल्दी दूर होती है।"
          }
        },
        dischargeMedications: [
          {
            id: `dm_${Date.now()}_1`,
            name: "Prescribed Recovery Medication",
            dosage: "1 Tablet",
            frequency: "Twice Daily (Morning & Night)",
            timing: "After Food",
            duration: "5 Days",
            purposeEn: "Promotes recovery and prevents infection relapse.",
            purposeHi: "इन्फेक्शन रोकने और तेजी से ठीक होने के लिए।"
          },
          {
            id: `dm_${Date.now()}_2`,
            name: "Antacid / Gastro-Protective",
            dosage: "1 Tablet",
            frequency: "Once Daily (Morning)",
            timing: "Before Breakfast",
            duration: "5 Days",
            purposeEn: "Prevents stomach acidity and gastric distress.",
            purposeHi: "पेट में गैस और एसिडिटी से बचाव के लिए।"
          }
        ],
        warningSigns: [
          {
            signEn: "High fever (> 101°F) or persistent chills",
            signHi: "101°F से अधिक तेज बुखार",
            severity: "critical"
          },
          {
            signEn: "Severe pain, continuous vomiting, or inability to take fluids",
            signHi: "लगातार उल्टी या अत्यधिक पेट दर्द",
            severity: "critical"
          },
          {
            signEn: "Severe dizziness, shortness of breath, or chest discomfort",
            signHi: "चक्कर आना या सांस लेने में तकलीफ",
            severity: "critical"
          }
        ],
        followUp: {
          doctorName: "Attending Consultant",
          department: "Hospital OPD Clinic",
          date: "Within 7 Days of Discharge",
          time: "10:30 AM",
          hospital: "City Hospital OPD Chamber",
          prepChecklistEn: [
            "Bring this discharge summary document",
            "Bring all current medicines and daily health notes"
          ],
          prepChecklistHi: [
            "यह डिस्चार्ज सारांश पत्र साथ लाएं",
            "चल रही सभी दवाइयां साथ रखें"
          ]
        }
      };

      const updated = [newSummary, ...summaries];
      saveSummaries(updated);
      setSelectedSummaryId(newSummary.id);
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 28px",
          background: "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
          border: "1px solid var(--primary-border)",
          borderRadius: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                {lang === "hi" ? "अस्पताल डिस्चार्ज सारांश" : "Discharge Summary"}
              </h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "6px", marginBottom: 0 }}>
              {lang === "hi"
                ? "अस्पताल की डिस्चार्ज रिपोर्ट को आसान व सरल भाषा में समझें — घर पर देखभाल, दवाइयां, सावधानियां और अगला चेकअप।"
                : "Understand your hospital discharge papers in simple, everyday language — home recovery, medicines, diet & warning signs."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isUploading}
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
                cursor: isUploading ? "not-allowed" : "pointer"
              }}
              title={lang === "hi" ? "कैमरे से डिस्चार्ज पेपर की फोटो लें" : "Take photo of discharge paper"}
            >
              <Camera size={18} color="var(--primary)" />
              <span>{lang === "hi" ? "फोटो स्कैन" : "Scan Photo"}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn btn-primary"
              style={{
                height: "44px",
                padding: "0 20px",
                fontSize: "0.9rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.22)",
                cursor: isUploading ? "not-allowed" : "pointer"
              }}
            >
              <UploadCloud size={18} />
              <span>
                {isUploading
                  ? (lang === "hi" ? "स्कैन हो रहा है..." : "Processing...")
                  : (lang === "hi" ? "डिस्चार्ज पेपर अपलोड करें" : "Upload Discharge Paper")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Discharge Record Dropdown Section */}
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
            <ClipboardCheck size={17} color="var(--primary)" />
            <span>{lang === "hi" ? "डिस्चार्ज रिकॉर्ड चुनें:" : "Select Discharge Record:"}</span>
          </label>

          {/* Custom Dropdown Trigger */}
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
                minWidth: "280px",
                maxWidth: "400px",
                justifyContent: "space-between"
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                {activeSummary ? activeSummary.title : (lang === "hi" ? "कोई रिकॉर्ड नहीं" : "No Record Selected")}
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
                  minWidth: "330px",
                  maxWidth: "440px",
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
                {summaries.length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {lang === "hi" ? "कोई डिस्चार्ज रिकॉर्ड मौजूद नहीं है" : "No discharge records found"}
                  </div>
                ) : (
                  summaries.map((s) => {
                    const isSelected = selectedSummaryId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedSummaryId(s.id);
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
                            <ClipboardCheck size={16} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                          )}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: "0.88rem",
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? "var(--primary)" : "var(--text-main)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {s.title}
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {s.dischargeDate} • {s.hospital}
                            </div>
                          </div>
                        </div>

                        {/* Delete Single Summary */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSummary(s.id, e)}
                          title={lang === "hi" ? "यह रिकॉर्ड हटाएं" : "Delete this record"}
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

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {activeSummary && (
            <button
              type="button"
              onClick={(e) => handleDeleteSummary(activeSummary.id, e)}
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
              title={lang === "hi" ? "यह रिकॉर्ड हटाएं" : "Delete this record"}
            >
              <Trash2 size={15} color="#ef4444" />
              <span>{lang === "hi" ? "रिकॉर्ड हटाएं" : "Delete Record"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{
              height: "40px",
              padding: "0 16px",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "10px"
            }}
          >
            <Printer size={15} />
            <span>{lang === "hi" ? "प्रिंट करें" : "Print Summary"}</span>
          </button>

          {summaries.length === 0 && (
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="btn btn-primary"
              style={{ height: "40px", padding: "0 14px", fontSize: "0.85rem", borderRadius: "10px" }}
            >
              {lang === "hi" ? "डिफ़ॉल्ट रिकॉर्ड लोड करें" : "Restore Defaults"}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {!activeSummary ? (
        <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center", borderRadius: "16px" }}>
          <ClipboardCheck size={44} color="var(--primary)" style={{ opacity: 0.6, marginBottom: "12px" }} />
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {lang === "hi" ? "कोई डिस्चार्ज रिकॉर्ड उपलब्ध नहीं है" : "No Discharge Summary Available"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
            {lang === "hi"
              ? "ऊपर दिए गए 'डिस्चार्ज पेपर अपलोड करें' बटन से नया रिकॉर्ड जोड़ें या डिफ़ॉल्ट रीसेट करें।"
              : "Upload your hospital discharge sheet above or restore sample discharge summaries."}
          </p>
          <button onClick={handleRestoreDefaults} className="btn btn-primary" style={{ marginTop: "14px" }}>
            {lang === "hi" ? "डिफ़ॉल्ट रिकॉर्ड्स लोड करें" : "Load Sample Records"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Section 1: Hospital & Admission Details Card */}
          <div
            className="glass-panel"
            style={{
              padding: "22px 26px",
              borderRadius: "16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-highlight)" }}>
                  {activeSummary.hospital}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap", marginTop: "6px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>
                      {lang === "hi" ? "भर्ती अवधि:" : "Stay:"} <strong>{activeSummary.admissionDate} → {activeSummary.dischargeDate}</strong> ({activeSummary.lengthOfStay})
                    </span>
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <User size={14} color="var(--primary)" />
                    <span>{lang === "hi" ? "डॉक्टर:" : "Treating Doctor:"} <strong>{activeSummary.doctor}</strong></span>
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ textAlign: "right" }}>
                <span className="badge badge-good" style={{ fontSize: "0.85rem", padding: "6px 14px", fontWeight: 700 }}>
                  <CheckCircle2 size={15} /> {activeSummary.dischargeStatus}
                </span>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "6px" }}>
                  {lang === "hi" ? "इमरजेंसी हेल्पलाइन:" : "Emergency Helpline:"} <strong style={{ color: "var(--status-crit-text)" }}>{activeSummary.emergencyHelpline}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Why You Were Admitted (Simple Diagnosis vs Medical Jargon) */}
          <div
            className="glass-panel"
            style={{
              padding: "22px 26px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
              border: "1.5px solid var(--primary-border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <HeartHandshake size={22} color="var(--primary)" />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                {lang === "hi" ? "बीमारी का सरल सारांश" : "Why You Were Admitted"}
              </h3>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "16px 20px", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "12px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {lang === "hi" ? "मुख्य कारण (Simple Diagnosis):" : "Simple Diagnosis:"}
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
                {activeSummary.simpleDiagnosis?.replace(/\s*\(पेट का इन्फेक्शन व कमजोरी\)/g, "").trim()}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "4px" }}>
                {lang === "hi" ? "मेडिकल टर्म:" : "Medical Term:"} <em>{activeSummary.originalMedicalDiagnosis}</em>
              </div>
            </div>

            <p style={{ fontSize: "0.92rem", lineHeight: "1.6", color: "var(--text-main)", margin: 0 }}>
              {activeSummary.simpleSummary}
            </p>
          </div>

          {/* Section 3: At-Home Care Guidelines (Diet, Activity, Hydration) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
            {/* Diet Box */}
            <div
              className="glass-panel"
              style={{
                padding: "22px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--status-good-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Utensils size={18} color="var(--status-good-text)" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>
                    {lang === "hi" ? activeSummary.homeCare.diet.titleHi : activeSummary.homeCare.diet.titleEn}
                  </h4>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {lang === "hi" ? "क्या खाएं और क्या न खाएं" : "What to eat & avoid"}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--status-good-text)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={14} /> {lang === "hi" ? "क्या खाएं (अनुशंसित):" : "Recommended Foods:"}
                </div>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-main)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(lang === "hi" ? activeSummary.homeCare.diet.allowedHi : activeSummary.homeCare.diet.allowedEn).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={{ paddingTop: "8px", borderTop: "1px dashed var(--border-color)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#ef4444", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <XCircle size={14} /> {lang === "hi" ? "परहेज करें (न खाएं):" : "Foods to Avoid:"}
                </div>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-main)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(lang === "hi" ? activeSummary.homeCare.diet.avoidHi : activeSummary.homeCare.diet.avoidEn).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rest & Physical Activity Box */}
            <div
              className="glass-panel"
              style={{
                padding: "22px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Footprints size={18} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>
                    {lang === "hi" ? activeSummary.homeCare.activity.titleHi : activeSummary.homeCare.activity.titleEn}
                  </h4>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {lang === "hi" ? "आराम और चलने-फिरने की सलाह" : "Rest & movement advice"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(lang === "hi" ? activeSummary.homeCare.activity.instructionsHi : activeSummary.homeCare.activity.instructionsEn).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.86rem", color: "var(--text-main)" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700, marginTop: "2px" }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Hydration Banner */}
              <div style={{ marginTop: "auto", background: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.84rem", color: "var(--primary)" }}>
                  <Droplets size={16} />
                  <span>{lang === "hi" ? activeSummary.homeCare.hydration.dailyGoalHi : activeSummary.homeCare.hydration.dailyGoalEn}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {lang === "hi" ? activeSummary.homeCare.hydration.noteHi : activeSummary.homeCare.hydration.noteEn}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Take-Home Medicines (Detailed Schedule) */}
          <div
            className="glass-panel"
            style={{
              padding: "24px 26px",
              borderRadius: "16px",
              border: "1px solid var(--border-color)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Pill size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  {lang === "hi" ? "घर ले जाने वाली दवाइयां" : "Discharge Medications"}
                </h3>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {lang === "hi" ? "दवाइयों का पूरा कोर्स समय पर पूरा करें" : "Complete full course as directed"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {activeSummary.dischargeMedications.map((med) => (
                <div
                  key={med.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    borderLeft: "4px solid var(--primary)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-highlight)" }}>
                      {med.name}
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: "0.74rem" }}>
                      {med.dosage}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} color="var(--primary)" /> {med.frequency}
                    </span>
                    <span>• {med.timing}</span>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--primary-dark)", fontWeight: 600 }}>
                    ⏳ {med.duration}
                  </div>

                  <div style={{ background: "var(--bg-elevated)", padding: "8px 10px", borderRadius: "8px", fontSize: "0.82rem", color: "var(--text-main)", marginTop: "4px" }}>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                      {lang === "hi" ? "किसलिए है: " : "Why you take it: "}
                    </span>
                    {lang === "hi" ? med.purposeHi : med.purposeEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Warning Signs & Red Flags (When to Call Hospital) */}
          <div
            className="glass-panel"
            style={{
              padding: "22px 26px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), var(--bg-card))",
              border: "1.5px solid rgba(239, 68, 68, 0.35)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertTriangle size={22} color="#ef4444" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "#dc2626" }}>
                  {lang === "hi" ? "जरूरी सावधानियां" : "Emergency Warning Signs"}
                </h3>
              </div>

              <a
                href={`tel:${activeSummary.emergencyHelpline}`}
                className="btn btn-secondary"
                style={{
                  color: "#ef4444",
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  height: "38px",
                  padding: "0 14px",
                  fontSize: "0.84rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Phone size={14} />
                <span>{lang === "hi" ? "इमरजेंसी कॉल:" : "Call Emergency:"} {activeSummary.emergencyHelpline}</span>
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
              {activeSummary.warningSigns.map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span style={{ color: "#ef4444", fontSize: "1.2rem", lineHeight: 1 }}>⚠️</span>
                  <span>{lang === "hi" ? w.signHi : w.signEn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Next Follow-Up Appointment */}
          <div
            className="glass-panel"
            style={{
              padding: "22px 26px",
              borderRadius: "16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "18px"
            }}
          >
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                {lang === "hi" ? "अगला फॉलो-अप चेकअप" : "Next Scheduled Follow-Up"}
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "4px 0", color: "var(--text-highlight)" }}>
                {activeSummary.followUp.doctorName}
              </h3>
              <div style={{ fontSize: "0.88rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginTop: "4px" }}>
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>📅 {activeSummary.followUp.date}</span>
                <span>⏰ {activeSummary.followUp.time}</span>
                <span>🏥 {activeSummary.followUp.hospital}</span>
              </div>

              <div style={{ marginTop: "10px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                <strong>{lang === "hi" ? "साथ लाने योग्य चीजें:" : "What to bring:"}</strong>{" "}
                {(lang === "hi" ? activeSummary.followUp.prepChecklistHi : activeSummary.followUp.prepChecklistEn).join(" • ")}
              </div>
            </div>

            {onAskCopilot && (
              <button
                type="button"
                onClick={() =>
                  onAskCopilot(
                    `Can you explain my hospital discharge summary from ${activeSummary.hospital}? What precautions and diet should I follow for ${activeSummary.simpleDiagnosis}?`
                  )
                }
                className="btn btn-secondary"
                style={{ height: "42px", padding: "0 18px", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "12px" }}
              >
                <MessageSquareHeart size={16} color="var(--primary)" />
                <span>{lang === "hi" ? "डिस्चार्ज के बारे में AI से पूछें" : "Ask Copilot About Discharge"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
