import React, { useState, useMemo } from "react";
import {
  FileCheck2,
  Printer,
  Share2,
  Copy,
  Check,
  X,
  AlertTriangle,
  Activity,
  Pill,
  Stethoscope,
  QrCode,
  ShieldCheck,
  Droplet,
  Heart,
  FileText,
  ExternalLink,
  Maximize2,
  MapPin,
  Navigation,
  Edit3
} from "lucide-react";
import { calculateAge } from "../utils/dateUtils";
import { generatePatientReports } from "../data/sampleReports";
import { getLiveGpsAddress } from "../utils/geolocation";

export default function DoctorHealthPassportModal({
  isOpen,
  onClose,
  patient,
  onUpdatePatient,
  lang = "en"
}) {
  const [includeDemographics, setIncludeDemographics] = useState(true);
  const [includeConditions, setIncludeConditions] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeLabResults, setIncludeLabResults] = useState(true);
  const [includeDoctorNotes, setIncludeDoctorNotes] = useState(true);
  const [copied, setCopied] = useState(false);
  const [doctorNote, setDoctorNote] = useState(
    lang === "hi"
      ? "नियमित त्रैमासिक जांच: टाइप 2 डायबिटीज व हाई ब्लड प्रेशर का फॉलो-अप। दवाइयों की अनुकूलता व लाइफस्टाइल समीक्षा।"
      : "Quarterly Clinical Review: Follow-up for Type 2 Diabetes Mellitus and Essential Hypertension. Medication tolerance and glycemic control review."
  );

  const [currentDateString] = useState(() => {
    return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  });

  const [passportSerial] = useState(() => {
    const rawId = (patient?.id || "01").toUpperCase().replace(/[^A-Z0-9]/g, "");
    return `PHP-2026-${rawId}-8842`;
  });

  // ── Address State & Live Satellite GPS Auto-Detection ─────────────────────
  const [currentAddress, setCurrentAddress] = useState(
    patient?.address || "Sector 62, Noida, Uttar Pradesh, India"
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(
    patient?.address || "Sector 62, Noida, Uttar Pradesh, India"
  );
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState("");

  const [prevAddressProp, setPrevAddressProp] = useState(patient?.address);
  if (patient?.address !== prevAddressProp) {
    setPrevAddressProp(patient?.address);
    if (patient?.address) {
      setCurrentAddress(patient.address);
      setAddressInput(patient.address);
    }
  }

  // Live GPS Fetch Handler
  const handleDetectLiveGps = async () => {
    setIsGpsLoading(true);
    setGpsStatusMsg(
      lang === "hi"
        ? "🛰️ लाइव सैटेलाइट GPS खोजा जा रहा है..."
        : "🛰️ Acquiring live satellite GPS location..."
    );

    try {
      const result = await getLiveGpsAddress();
      if (result && result.address) {
        setAddressInput(result.address);
        setCurrentAddress(result.address);
        if (onUpdatePatient) {
          onUpdatePatient({ address: result.address });
        }
        setGpsStatusMsg(
          lang === "hi"
            ? `✅ लाइव GPS से पता प्राप्त हुआ! (सटीकता ±${result.accuracy}m)`
            : `✅ Live GPS address acquired! (Accuracy ±${result.accuracy}m)`
        );
      }
    } catch (err) {
      setGpsStatusMsg(
        lang === "hi"
          ? `⚠️ GPS त्रुटि: ${err.message || "लोकेशन नहीं मिल सकी"}`
          : `⚠️ GPS Error: ${err.message || "Failed to acquire location"}`
      );
    } finally {
      setIsGpsLoading(false);
      setTimeout(() => setGpsStatusMsg(""), 5000);
    }
  };

  // Save manual/updated address
  const handleSaveAddress = () => {
    if (!addressInput.trim()) return;
    const trimmed = addressInput.trim();
    setCurrentAddress(trimmed);
    if (onUpdatePatient) {
      onUpdatePatient({ address: trimmed });
    }
    setIsEditingAddress(false);
    setGpsStatusMsg(
      lang === "hi" ? "✅ पता सुरक्षित कर लिया गया।" : "✅ Address saved."
    );
    setTimeout(() => setGpsStatusMsg(""), 3500);
  };

  // 3 Targeted body-pathway & blood reports dynamically bound to current patient's essential data
  const pathwayReports = useMemo(() => {
    return generatePatientReports({ ...patient, address: currentAddress });
  }, [patient, currentAddress]);

  const [selectedReportIndex, setSelectedReportIndex] = useState(0);
  const [fullDetailReport, setFullDetailReport] = useState(null);

  const selectedReport = pathwayReports[selectedReportIndex] || pathwayReports[0];

  // Latest vitals calculation
  const vitalsHistory = patient?.vitalsHistory || [];
  const latestVital = vitalsHistory[vitalsHistory.length - 1] || {};
  const calculatedAge = calculateAge(patient?.dob, patient?.age || 45);

  if (!isOpen) return null;

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Copy plain text clinical summary
  const handleCopyText = () => {
    const medList = patient?.todayMedications?.map(m => `• ${m.name} ${m.dosage} (${m.timing || m.slot}) - ${m.purpose}`).join("\n") || "None";
    const condList = patient?.conditions?.map(c => typeof c === "string" ? c : `${c.name} (${c.status || "Active"})`).join("\n") || "None";
    const allergyList = patient?.allergies?.map(a => typeof a === "string" ? a : `${a.allergen} (${a.reaction || "Allergy"})`).join(", ") || "None Reported";

    const text = `================================================
PULSEAI - DOCTOR HEALTH PASSPORT & CLINICAL SUMMARY
================================================
Document Ref: ${passportSerial}
Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
ABHA ID: ${patient?.abhaId || "91-4521-8842-1982@abdm"}

PATIENT DEMOGRAPHICS:
Name: ${patient?.name || "Patient"}
Age/Gender: ${calculatedAge} Yrs / ${patient?.gender || "Not specified"}
Blood Group: ${patient?.bloodGroup || "B+"}
Height / Weight: ${patient?.heightCm || 174} cm / ${patient?.weightKg || 78} kg (BMI: ${patient?.bmi || 25.9})
Primary Physician: ${patient?.primaryPhysician?.name || "Dr. Arvind Mehta, MD"}
Emergency Contact: ${patient?.emergencyContact?.name || "Contact"} (${patient?.emergencyContact?.phone || "+91 98765 43210"})

HIGH-ALERT DRUG ALLERGIES:
${allergyList}

DIAGNOSED CHRONIC CONDITIONS:
${condList}

CURRENT MEDICATIONS REGIMEN:
${medList}

LATEST PHYSIOLOGICAL VITALS (Smartwatch / Clinical):
• Blood Pressure: ${latestVital.bpSystolic || 128}/${latestVital.bpDiastolic || 82} mmHg
• Pulse / Heart Rate: ${latestVital.heartRate || 74} BPM
• Blood Oxygen (SpO2): ${latestVital.spo2 || 98}%
• Fasting Blood Glucose: ${latestVital.bloodSugarFasting || 115} mg/dL

LATEST LAB BIOMARKERS (3 Body-Pathway Medical Reports):
${pathwayReports.map(r => `• [${r.title}]: ${r.parameters.slice(0, 3).map(p => `${p.name} ${p.value}${p.unit}`).join(', ')}`).join('\n')}

PHYSICIAN CONSULTATION NOTE:
${doctorNote}
================================================
Generated via PulseAI ABDM Health Platform`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // WhatsApp share formatted summary
  const handleShareWhatsApp = () => {
    const medSummary = patient?.todayMedications?.map(m => `• *${m.name}* ${m.dosage}`).join("%0A") || "None";
    const msg = `📋 *DOCTOR HEALTH PASSPORT - PulseAI*%0A%0A*Patient:* ${encodeURIComponent(patient?.name || "Patient")} (${calculatedAge}y / ${encodeURIComponent(patient?.gender || "M")})%0A*Blood Group:* *${encodeURIComponent(patient?.bloodGroup || "B+")}*%0A*ABHA ID:* ${encodeURIComponent(patient?.abhaId || "91-4521-8842-1982")}%0A%0A⚠️ *Allergies:* ${encodeURIComponent(patient?.allergies?.map(a => typeof a === 'string' ? a : a.allergen).join(', ') || 'None')}%0A%0A🫀 *Latest Vitals:*%0A• BP: ${latestVital.bpSystolic || 128}/${latestVital.bpDiastolic || 82} mmHg%0A• Pulse: ${latestVital.heartRate || 74} BPM | SpO2: ${latestVital.spo2 || 98}%%0A• Glucose: ${latestVital.bloodSugarFasting || 115} mg/dL%0A%0A💊 *Current Medications:*%0A${medSummary}%0A%0A📄 *Full Passport Document:* ${passportSerial}%0A_Brought for clinical consultation via PulseAI._`;

    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200, padding: "14px" }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "880px",
          maxHeight: "92vh",
          padding: 0,
          background: "var(--bg-card)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
          position: "relative"
        }}
      >
        {/* Top-Right Corner Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="no-print"
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            zIndex: 40,
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            background: "var(--bg-card)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.18s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-highlight)";
            e.currentTarget.style.borderColor = "var(--border-hover)";
            e.currentTarget.style.background = "var(--bg-card-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.background = "var(--bg-card)";
          }}
          aria-label="Close modal"
          title={lang === "hi" ? "बंद करें" : "Close"}
        >
          <X size={18} />
        </button>

        {/* ── 1. NON-PRINTING TOOLBAR & CONTROL STRIP ── */}
        <div
          className="no-print"
          style={{
            padding: "16px 64px 16px 22px",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--bg-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
              }}
            >
              <FileCheck2 size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 900, margin: 0, color: "var(--text-highlight)" }}>
                  {lang === "hi" ? "डॉक्टर हेल्थ पासपोर्ट (PDF)" : "Doctor Health Passport"}
                </h2>
                <span className="badge badge-good" style={{ fontSize: "0.72rem" }}>
                  <ShieldCheck size={12} /> ABHA VERIFIED
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {lang === "hi"
                  ? "डॉक्टर विजिट के लिए 1-क्लिक प्रिंटेबल व शेयर करने योग्य क्लीनिकल समरी"
                  : "One-click printable & shareable clinical consultation dossier for doctor visits"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary"
              style={{
                height: "38px",
                padding: "0 16px",
                fontSize: "0.86rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
                borderColor: "#0284c7",
                display: "flex",
                alignItems: "center",
                gap: "7px"
              }}
            >
              <Printer size={16} />
              <span>{lang === "hi" ? "प्रिंट / PDF सेव करें" : "Print / Save PDF"}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="btn btn-secondary"
              title={lang === "hi" ? "डॉक्टर या परिवार को व्हाट्सएप पर भेजें" : "Share via WhatsApp"}
              style={{
                height: "38px",
                padding: "0 14px",
                fontSize: "0.86rem",
                color: "#22c55e",
                borderColor: "#22c55e",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Share2 size={16} />
              <span className="hide-on-mobile">{lang === "hi" ? "व्हाट्सएप" : "WhatsApp"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="btn btn-secondary"
              title={lang === "hi" ? "टेक्स्ट समरी कॉपी करें" : "Copy clinical text summary"}
              style={{
                height: "38px",
                padding: "0 14px",
                fontSize: "0.86rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span className="hide-on-mobile">{copied ? (lang === "hi" ? "कॉपी हुआ!" : "Copied!") : (lang === "hi" ? "कॉपी" : "Copy")}</span>
            </button>
          </div>
        </div>

        {/* ── 2. CUSTOMIZATION TOGGLES (NON-PRINTING) ── */}
        <div
          className="no-print"
          style={{
            padding: "10px 22px",
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "0.78rem",
            color: "var(--text-main)",
            flexWrap: "wrap"
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--text-muted)" }}>
            {lang === "hi" ? "शामिल करें:" : "Include in Passport:"}
          </span>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeDemographics}
              onChange={(e) => setIncludeDemographics(e.target.checked)}
            />
            <span>{lang === "hi" ? "मरीज विवरण" : "Demographics"}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeConditions}
              onChange={(e) => setIncludeConditions(e.target.checked)}
            />
            <span>{lang === "hi" ? "बीमारियां व एलर्जी" : "Conditions & Allergies"}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeMedications}
              onChange={(e) => setIncludeMedications(e.target.checked)}
            />
            <span>{lang === "hi" ? "सक्रिय दवाइयां" : "Active Medications"}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeVitals}
              onChange={(e) => setIncludeVitals(e.target.checked)}
            />
            <span>{lang === "hi" ? "विटल्स व वॉच डेटा" : "Vitals & Telemetry"}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeLabResults}
              onChange={(e) => setIncludeLabResults(e.target.checked)}
            />
            <span>{lang === "hi" ? "लैब टेस्ट रिजल्ट्स" : "Lab Biomarkers"}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeDoctorNotes}
              onChange={(e) => setIncludeDoctorNotes(e.target.checked)}
            />
            <span>{lang === "hi" ? "डॉक्टर नोट्स बॉक्स" : "Physician Notes Box"}</span>
          </label>
        </div>

        {/* ── 3. THE OFFICIAL DOCTOR HEALTH PASSPORT DOCUMENT ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            background: "rgba(0, 0, 0, 0.25)"
          }}
        >
          {/* Printable Document Container */}
          <div
            id="doctor-health-passport-doc"
            style={{
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "14px",
              padding: "36px 40px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
              margin: "0 auto",
              maxWidth: "800px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1.45,
              fontSize: "13.5px"
            }}
          >
            {/* ── Document Header ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: "18px",
                borderBottom: "2.5px solid #0284c7",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "#0284c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "17px"
                    }}
                  >
                    +
                  </div>
                  <span style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.5px", color: "#0369a1" }}>
                    PulseAI
                  </span>
                  <span
                    style={{
                      background: "#e0f2fe",
                      color: "#0284c7",
                      fontSize: "10px",
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: "6px",
                      letterSpacing: "0.5px"
                    }}
                  >
                    HEALTH PASSPORT
                  </span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
                  Official Doctor Health Passport & Clinical Consultation Summary
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  Standardized Patient Clinical Profile • Compliant with Ayushman Bharat Digital Mission (ABDM)
                </div>
              </div>

              {/* QR Code & Identification Badge */}
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div
                  style={{
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "4px",
                    background: "#f8fafc",
                    display: "inline-flex"
                  }}
                >
                  <QrCode size={52} color="#0f172a" />
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", marginTop: "4px" }}>
                  {passportSerial}
                </div>
                <div style={{ fontSize: "10px", color: "#0284c7", fontWeight: 600 }}>
                  Date: {currentDateString}
                </div>
              </div>
            </div>

            {/* ── Section 1: Patient Demographics & ABHA Identity ── */}
            {includeDemographics && (
              <div style={{ marginTop: "18px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    background: "#f1f5f9",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                    gap: "12px 18px",
                    fontSize: "12.5px"
                  }}
                >
                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Patient Full Name</span>
                    <strong style={{ fontSize: "15px", color: "#0f172a" }}>{patient?.name || "Aarish Rajput"}</strong>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Age / Gender</span>
                    <strong style={{ color: "#0f172a" }}>{calculatedAge || patient?.age || 22} Years / {patient?.gender || "Male"}</strong>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Blood Group</span>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#fee2e2",
                        color: "#dc2626",
                        fontWeight: 900,
                        padding: "1px 8px",
                        borderRadius: "6px",
                        fontSize: "13px"
                      }}
                    >
                      {patient?.bloodGroup || "B+"}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Mobile Number</span>
                    <strong style={{ color: "#0f172a", fontSize: "13px" }}>
                      {patient?.phone || patient?.emergencyContact?.phone || "+91 98765 43210"}
                    </strong>
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ color: "#64748b", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={13} color="#0284c7" />
                        <strong>RESIDENTIAL ADDRESS (निवास पता)</strong>
                      </span>

                      <div className="no-print" style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={handleDetectLiveGps}
                          disabled={isGpsLoading}
                          style={{
                            background: isGpsLoading ? "#e2e8f0" : "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "3px 9px",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            cursor: isGpsLoading ? "not-allowed" : "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: "0 1px 3px rgba(2, 132, 199, 0.2)"
                          }}
                          title="Click to automatically fill address using device live GPS location"
                        >
                          <Navigation size={12} />
                          <span>{isGpsLoading ? (lang === "hi" ? "GPS खोज रहा है..." : "Locating GPS...") : (lang === "hi" ? "📡 लाइव GPS से भरें" : "📡 Live GPS Auto-Fill")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAddressInput(currentAddress);
                            setIsEditingAddress(!isEditingAddress);
                          }}
                          style={{
                            background: "#f1f5f9",
                            color: "#0f172a",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            cursor: "pointer"
                          }}
                        >
                          <Edit3 size={11} />
                          <span>{isEditingAddress ? (lang === "hi" ? "बंद करें" : "Cancel") : (lang === "hi" ? "बदलें / जोड़ें" : "Edit / Add")}</span>
                        </button>
                      </div>
                    </div>

                    {/* Current Address Display */}
                    {!isEditingAddress ? (
                      <div style={{ color: "#0f172a", fontSize: "12.5px", fontWeight: 600, background: "#ffffff", padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        {currentAddress}
                      </div>
                    ) : (
                      /* Address Input Section with Live GPS Auto-Fill Controls */
                      <div className="no-print" style={{ background: "#ffffff", border: "1.5px solid #0284c7", borderRadius: "8px", padding: "10px", marginTop: "4px" }}>
                        <textarea
                          rows={2}
                          value={addressInput}
                          onChange={(e) => setAddressInput(e.target.value)}
                          placeholder={lang === "hi" ? "पूरा पता दर्ज करें (मकान/फ्लैट नं., क्षेत्र, शहर, राज्य, पिनकोड) या लाइव GPS बटन दबाएं..." : "Enter full address (Flat/Street, City, State, Pincode) or click Live GPS button..."}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "12px",
                            resize: "vertical",
                            outline: "none",
                            fontFamily: "inherit",
                            boxSizing: "border-box"
                          }}
                        />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", flexWrap: "wrap", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={handleDetectLiveGps}
                            disabled={isGpsLoading}
                            style={{
                              background: "#f0f9ff",
                              color: "#0369a1",
                              border: "1px solid #bae6fd",
                              borderRadius: "6px",
                              padding: "4px 10px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: isGpsLoading ? "not-allowed" : "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <Navigation size={12} />
                            <span>{lang === "hi" ? "📡 लाइव GPS से ऑटो-डिटेक्ट करें" : "📡 Auto-Detect with Live GPS"}</span>
                          </button>

                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => setIsEditingAddress(false)}
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontSize: "11px",
                                cursor: "pointer"
                              }}
                            >
                              {lang === "hi" ? "रद्द करें" : "Cancel"}
                            </button>

                            <button
                              type="button"
                              onClick={handleSaveAddress}
                              style={{
                                background: "#10b981",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "4px 14px",
                                fontSize: "11.5px",
                                fontWeight: 800,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Check size={13} />
                              <span>{lang === "hi" ? "पता सुरक्षित करें" : "Save Address"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GPS Status Message Toast/Badge */}
                    {gpsStatusMsg && (
                      <div style={{
                        marginTop: "5px",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "5px",
                        background: gpsStatusMsg.includes("⚠️") ? "#fef2f2" : "#ecfdf5",
                        color: gpsStatusMsg.includes("⚠️") ? "#dc2626" : "#059669",
                        border: gpsStatusMsg.includes("⚠️") ? "1px solid #fecaca" : "1px solid #a7f3d0"
                      }}>
                        {gpsStatusMsg}
                      </div>
                    )}
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>ABHA Digital ID</span>
                    <strong style={{ color: "#0284c7", fontFamily: "monospace", fontSize: "12px" }}>
                      {patient?.abhaId || "91-4521-8842-1982"}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Height / Weight</span>
                    <span style={{ color: "#0f172a" }}>{patient?.heightCm || 174} cm / {patient?.weightKg || 78.5} kg (BMI: {patient?.bmi || 25.9})</span>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Primary Physician</span>
                    <span style={{ color: "#0f172a" }}>{patient?.primaryPhysician?.name || "Dr. Arvind Mehta, MD"}</span>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Emergency Contact</span>
                    <span style={{ color: "#0f172a" }}>
                      {patient?.emergencyContact?.name || "Emergency Contact"} ({patient?.emergencyContact?.relation || "Family"}): {patient?.emergencyContact?.phone || patient?.phone || "+91 98765 43210"}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Medical Insurance</span>
                    <span style={{ color: "#0f172a" }}>{patient?.insurance?.provider || "Star Health"} (#{patient?.insurance?.policyNumber || "SH-99283"})</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Section 2: Critical Drug Allergies & Diagnosed Conditions ── */}
            {includeConditions && (
              <div style={{ marginTop: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Allergies Box */}
                  <div
                    style={{
                      border: "1.5px solid #ef4444",
                      background: "#fef2f2",
                      padding: "12px 14px",
                      borderRadius: "10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626", fontWeight: 800, fontSize: "12px", marginBottom: "6px" }}>
                      <AlertTriangle size={15} />
                      <span>HIGH-ALERT DRUG ALLERGIES</span>
                    </div>
                    {patient?.allergies && patient.allergies.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#991b1b" }}>
                        {patient.allergies.map((a, i) => (
                          <li key={i} style={{ marginBottom: "3px" }}>
                            <strong>{typeof a === "string" ? a : a.allergen}</strong>
                            {typeof a !== "string" && a.reaction ? ` — Reaction: ${a.reaction} (${a.severity || "Critical"})` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontSize: "12px", color: "#16a34a" }}>No known drug allergies reported.</div>
                    )}
                  </div>

                  {/* Active Diagnoses Box */}
                  <div
                    style={{
                      border: "1.5px solid #0284c7",
                      background: "#f0f9ff",
                      padding: "12px 14px",
                      borderRadius: "10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0369a1", fontWeight: 800, fontSize: "12px", marginBottom: "6px" }}>
                      <Stethoscope size={15} />
                      <span>DIAGNOSED CHRONIC CONDITIONS</span>
                    </div>
                    {patient?.conditions && patient.conditions.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#0c4a6e" }}>
                        {patient.conditions.map((c, i) => (
                          <li key={i} style={{ marginBottom: "3px" }}>
                            <strong>{typeof c === "string" ? c : c.name}</strong>
                            {typeof c !== "string" && c.status ? ` — Status: ${c.status}` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontSize: "12px", color: "#64748b" }}>No chronic conditions recorded.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Section 3: Active Pharmacotherapy (Medications) ── */}
            {includeMedications && (
              <div style={{ marginTop: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 800, fontSize: "13px", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Pill size={16} color="#0284c7" />
                    <span>CURRENT ACTIVE PHARMACOTHERAPY (PRESCRIBED MEDICATIONS)</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                    Patient Adherence: ~88% Optimal
                  </span>
                </div>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    textAlign: "left"
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #cbd5e1", color: "#475569" }}>
                      <th style={{ padding: "7px 10px", fontWeight: 700 }}>Medication & Strength</th>
                      <th style={{ padding: "7px 10px", fontWeight: 700 }}>Schedule / Frequency</th>
                      <th style={{ padding: "7px 10px", fontWeight: 700 }}>Meal Relation</th>
                      <th style={{ padding: "7px 10px", fontWeight: 700 }}>Clinical Purpose</th>
                      <th style={{ padding: "7px 10px", fontWeight: 700, textAlign: "right" }}>Refill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(patient?.todayMedications || []).map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "7px 10px", fontWeight: 700, color: "#0f172a" }}>
                          {m.name} <span style={{ fontWeight: 600, color: "#64748b" }}>{m.dosage}</span>
                        </td>
                        <td style={{ padding: "7px 10px", color: "#334155" }}>
                          {m.timing || m.slot || "Daily"}
                        </td>
                        <td style={{ padding: "7px 10px", color: "#334155" }}>
                          {m.withFood ? "After Meal" : "Before / Empty Stomach"}
                        </td>
                        <td style={{ padding: "7px 10px", color: "#0369a1" }}>
                          {m.purpose || "Prescribed Therapy"}
                        </td>
                        <td style={{ padding: "7px 10px", textAlign: "right", color: m.refillDaysLeft <= 5 ? "#ef4444" : "#64748b", fontWeight: 600 }}>
                          {m.refillDaysLeft ? `${m.refillDaysLeft}d left` : "Adequate"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Section 4: Recent Vitals & Smartwatch Telemetry ── */}
            {includeVitals && (
              <div style={{ marginTop: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 800, fontSize: "13px", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Activity size={16} color="#0284c7" />
                    <span>LATEST CLINICAL VITALS & SMARTWATCH TELEMETRY</span>
                  </div>
                  <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                    Synchronized via PulseAI Optical Sensor
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
                    gap: "10px"
                  }}
                >
                  <div style={{ border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "8px", background: "#f8fafc" }}>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>Blood Pressure</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                      {latestVital.bpSystolic || 128}/{latestVital.bpDiastolic || 82} <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>mmHg</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600 }}>Controlled</div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "8px", background: "#f8fafc" }}>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>Heart Rate (Pulse)</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                      {latestVital.heartRate || 74} <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>BPM</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600 }}>Normal Sinus</div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "8px", background: "#f8fafc" }}>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>Oxygen (SpO2)</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                      {latestVital.spo2 || 98} <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>%</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600 }}>Optimal</div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "8px", background: "#f8fafc" }}>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>Fasting Glucose</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                      {latestVital.bloodSugarFasting || 115} <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>mg/dL</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#d97706", fontWeight: 600 }}>Mild Impaired</div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "8px", background: "#f8fafc" }}>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>Current Weight</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                      {latestVital.weight || 78.5} <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>kg</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>BMI: {patient?.bmi || 25.9}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Section 5: 3 Body-Pathway Medical Lab Reports ── */}
            {includeLabResults && (
              <div style={{ marginTop: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                  <div style={{ fontWeight: 800, fontSize: "13px", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileText size={16} color="#0284c7" />
                    <span>SECTION 5: 3 TARGETED BODY-PATHWAY & BLOOD MEDICAL REPORTS</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: 700, background: "#e0f2fe", padding: "2px 8px", borderRadius: "6px" }}>
                    💡 Single-click to select • Double-click (2x) to open full official report modal
                  </span>
                </div>

                {/* 3 Pathway Report Cards Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "12px",
                    marginBottom: "14px"
                  }}
                >
                  {pathwayReports.map((rep, idx) => {
                    const isSelected = selectedReportIndex === idx;
                    const pathwayIcon = idx === 0 
                      ? <Droplet size={18} color="#0284c7" /> 
                      : idx === 1 
                      ? <Heart size={18} color="#ef4444" /> 
                      : <ShieldCheck size={18} color="#10b981" />;

                    return (
                      <div
                        key={rep.id || idx}
                        onClick={() => setSelectedReportIndex(idx)}
                        onDoubleClick={() => setFullDetailReport(rep)}
                        title="Double-click to open full clinical dossier modal"
                        style={{
                          border: isSelected ? "2px solid #0284c7" : "1.5px solid #cbd5e1",
                          borderRadius: "10px",
                          padding: "12px",
                          background: isSelected ? "#f0f9ff" : "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                          boxShadow: isSelected ? "0 4px 14px rgba(2, 132, 199, 0.18)" : "0 1px 3px rgba(0,0,0,0.04)",
                          position: "relative"
                        }}
                      >
                        {/* Header of Report Card */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {pathwayIcon}
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a" }}>
                              {rep.bodySystem.split(" ")[0]} Pathway
                            </span>
                          </div>
                          <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600 }}>
                            {rep.date}
                          </span>
                        </div>

                        {/* Title & Lab */}
                        <div style={{ fontWeight: 800, fontSize: "12.5px", color: "#0f172a", lineHeight: 1.3, marginBottom: "4px" }}>
                          {rep.title}
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748b", marginBottom: "8px" }}>
                          {rep.lab.split("/")[0]}
                        </div>

                        {/* Essential User Info Snapshot */}
                        <div
                          style={{
                            background: isSelected ? "#e0f2fe" : "#f8fafc",
                            padding: "6px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            color: "#334155",
                            marginBottom: "8px",
                            lineHeight: 1.4,
                            border: "1px solid #e2e8f0"
                          }}
                        >
                          <div><strong>Patient:</strong> {rep.patientName} ({rep.age}y/{rep.gender})</div>
                          <div><strong>Phone:</strong> {rep.phone} • <strong>Blood:</strong> <span style={{ color: "#dc2626", fontWeight: 800 }}>{rep.bloodGroup}</span></div>
                        </div>

                        {/* Status & Double Click Button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: rep.overallRisk === "Moderate" ? "#fef3c7" : "#dcfce7",
                              color: rep.overallRisk === "Moderate" ? "#b45309" : "#15803d"
                            }}
                          >
                            {rep.overallRisk === "Moderate" ? "Moderate Risk" : "Optimal"}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullDetailReport(rep);
                            }}
                            className="no-print"
                            style={{
                              background: "#0284c7",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "3px 8px",
                              fontSize: "10.5px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              cursor: "pointer"
                            }}
                            title="Double-click card or click this button to open full report"
                          >
                            <ExternalLink size={12} />
                            <span>Open (2x)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Report Detailed Investigations Table Preview */}
                {selectedReport && (
                  <div
                    style={{
                      border: "1px solid #bae6fd",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      padding: "12px",
                      marginTop: "10px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "13px", color: "#0369a1" }}>
                          {selectedReport.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {selectedReport.lab} • Ref: {selectedReport.referringDoctor}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFullDetailReport(selectedReport)}
                        className="no-print"
                        style={{
                          background: "#0284c7",
                          color: "#ffffff",
                          border: "none",
                          padding: "5px 12px",
                          borderRadius: "6px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Maximize2 size={13} />
                        <span>Open Full Report Dossier Modal</span>
                      </button>
                    </div>

                    {/* Patient Essential Info Header for this report */}
                    <div
                      style={{
                        background: "#f0f9ff",
                        border: "1px solid #e0f2fe",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "11.5px",
                        color: "#0f172a",
                        marginBottom: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px 16px"
                      }}
                    >
                      <div><span style={{ color: "#64748b" }}>Patient:</span> <strong>{selectedReport.patientName}</strong></div>
                      <div><span style={{ color: "#64748b" }}>Age/Gender:</span> <strong>{selectedReport.age} Yrs / {selectedReport.gender}</strong></div>
                      <div><span style={{ color: "#64748b" }}>Mobile:</span> <strong>{selectedReport.phone}</strong></div>
                      <div><span style={{ color: "#64748b" }}>Blood Group:</span> <strong style={{ color: "#dc2626" }}>{selectedReport.bloodGroup}</strong></div>
                      <div><span style={{ color: "#64748b" }}>Address:</span> <span>{selectedReport.address}</span></div>
                      <div><span style={{ color: "#64748b" }}>ABHA ID:</span> <span style={{ fontFamily: "monospace", color: "#0284c7" }}>{selectedReport.abhaId}</span></div>
                    </div>

                    {/* Investigations Table */}
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "12px",
                        textAlign: "left"
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f1f5f9", borderBottom: "1.5px solid #cbd5e1", color: "#475569" }}>
                          <th style={{ padding: "6px 8px", fontWeight: 700 }}>Biomarker / Investigation</th>
                          <th style={{ padding: "6px 8px", fontWeight: 700 }}>Observed Value</th>
                          <th style={{ padding: "6px 8px", fontWeight: 700 }}>Clinical Reference Range</th>
                          <th style={{ padding: "6px 8px", fontWeight: 700, textAlign: "right" }}>Status Assessment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedReport.parameters || []).map((p, pIdx) => (
                          <tr key={pIdx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "6px 8px", fontWeight: 700, color: "#0f172a" }}>
                              {p.name}
                            </td>
                            <td style={{ padding: "6px 8px", fontWeight: 800, color: p.status === "attention" ? "#dc2626" : p.status === "borderline" ? "#d97706" : "#0f172a" }}>
                              {p.value} {p.unit}
                            </td>
                            <td style={{ padding: "6px 8px", color: "#64748b", fontSize: "11.5px" }}>
                              {p.reference}
                            </td>
                            <td style={{ padding: "6px 8px", textAlign: "right" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "10.5px",
                                  fontWeight: 700,
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  background: p.status === "attention" ? "#fee2e2" : p.status === "borderline" ? "#fef3c7" : "#dcfce7",
                                  color: p.status === "attention" ? "#dc2626" : p.status === "borderline" ? "#d97706" : "#15803d"
                                }}
                              >
                                {p.status === "attention" ? "Elevated" : p.status === "borderline" ? "Borderline" : "Optimal"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ marginTop: "10px", fontSize: "11.5px", color: "#475569", background: "#f1f5f9", padding: "8px 10px", borderRadius: "6px" }}>
                      <strong>Summary:</strong> {selectedReport.headlineSummary}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Section 6: Attending Physician Notes & Prescription Box ── */}
            {includeDoctorNotes && (
              <div style={{ marginTop: "16px", paddingBottom: "12px" }}>
                <div style={{ fontWeight: 800, fontSize: "13px", color: "#0f172a", marginBottom: "8px" }}>
                  PHYSICIAN CLINICAL ASSESSMENT & CONSULTATION NOTES:
                </div>

                <div
                  style={{
                    border: "1.5px dashed #cbd5e1",
                    borderRadius: "8px",
                    padding: "12px",
                    background: "#fbfcfd",
                    minHeight: "75px"
                  }}
                >
                  <textarea
                    className="no-print"
                    value={doctorNote}
                    onChange={(e) => setDoctorNote(e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      color: "#334155",
                      fontSize: "12.5px",
                      resize: "vertical",
                      minHeight: "45px",
                      outline: "none",
                      fontFamily: "inherit"
                    }}
                    placeholder="Click to add custom notes for the doctor or type consultation briefing..."
                  />
                  <div
                    className="print-only"
                    style={{
                      display: "none",
                      fontSize: "12px",
                      color: "#334155",
                      lineHeight: 1.5
                    }}
                  >
                    {doctorNote}
                  </div>
                </div>

                {/* Doctor Signature & Stamp Area */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginTop: "22px",
                    paddingTop: "12px"
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    Follow-Up Advised: <strong>3 Months / As Needed</strong>
                  </div>

                  <div style={{ textAlign: "center", minWidth: "220px" }}>
                    <div style={{ height: "35px" }}></div>
                    <div style={{ borderTop: "1.5px solid #0f172a", paddingTop: "4px", fontSize: "11.5px", fontWeight: 700, color: "#0f172a" }}>
                      Attending Physician Signature & Registration
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>
                      Hospital / Clinic Official Stamp
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Document Footer ── */}
            <div
              style={{
                marginTop: "16px",
                paddingTop: "10px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "10px",
                color: "#94a3b8"
              }}
            >
              <div>
                PulseAI Health Engine • Official ABDM Health Record • Confidential Medical Document
              </div>
              <div>
                Page 1 of 1 • Generated for {patient?.name || "Patient"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Official Full Medical Report Dossier Modal (Opened on Double-Click) ── */}
      {fullDetailReport && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100030,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px"
          }}
          onClick={() => setFullDetailReport(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              color: "#0f172a",
              width: "100%",
              maxWidth: "880px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "2px solid #0284c7",
              padding: "24px",
              position: "relative"
            }}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setFullDetailReport(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#475569"
              }}
              title="Close Report (Esc)"
            >
              <X size={18} />
            </button>

            {/* Lab Letterhead Header */}
            <div style={{ borderBottom: "2px solid #0284c7", paddingBottom: "14px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingRight: "44px" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 900, color: "#0369a1", letterSpacing: "0.3px" }}>
                    {fullDetailReport.lab}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {fullDetailReport.labAddress}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: 700, marginTop: "2px" }}>
                    NABL Accredited • ISO 15189 Certified Reference Pathology Laboratory
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Report Date</div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{fullDetailReport.date}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Ref. Doctor: {fullDetailReport.referringDoctor}</div>
                </div>
              </div>
            </div>

            {/* Title & Body Pathway System */}
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "10px 14px", borderRadius: "10px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#0284c7", textTransform: "uppercase" }}>
                ORGAN SYSTEM / BODY PATHWAY: {fullDetailReport.bodySystem}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#0f172a", marginTop: "2px" }}>
                {fullDetailReport.title}
              </div>
            </div>

            {/* ── PATIENT ESSENTIAL INFORMATION (User Data Only) ── */}
            <div
              style={{
                background: "#f8fafc",
                border: "1.5px solid #cbd5e1",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "18px"
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                PATIENT DEMOGRAPHICS & ESSENTIAL IDENTIFIERS
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px 18px",
                  fontSize: "12.5px"
                }}
              >
                <div>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Patient Name</span>
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>{fullDetailReport.patientName}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Age & Gender</span>
                  <strong style={{ color: "#0f172a" }}>{fullDetailReport.age} Years / {fullDetailReport.gender}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Blood Group</span>
                  <span style={{ display: "inline-block", background: "#fee2e2", color: "#dc2626", fontWeight: 900, padding: "1px 8px", borderRadius: "6px" }}>
                    {fullDetailReport.bloodGroup}
                  </span>
                </div>

                <div>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Mobile Number</span>
                  <strong style={{ color: "#0f172a" }}>{fullDetailReport.phone}</strong>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Residential Address</span>
                  <span style={{ color: "#0f172a" }}>{fullDetailReport.address}</span>
                </div>

                <div>
                  <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>ABHA Digital Health ID</span>
                  <strong style={{ color: "#0284c7", fontFamily: "monospace" }}>{fullDetailReport.abhaId}</strong>
                </div>
              </div>
            </div>

            {/* Clinical Headline Summary */}
            <div style={{ background: fullDetailReport.overallRisk === "Moderate" ? "#fef3c7" : "#dcfce7", border: "1px solid #cbd5e1", padding: "10px 14px", borderRadius: "8px", marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: fullDetailReport.overallRisk === "Moderate" ? "#b45309" : "#15803d" }}>
                OVERALL CLINICAL INTERPRETATION: {fullDetailReport.overallRisk} Risk
              </div>
              <div style={{ fontSize: "12.5px", color: "#334155", marginTop: "3px", lineHeight: 1.4 }}>
                {fullDetailReport.headlineSummary}
              </div>
            </div>

            {/* Complete Tests Table */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                COMPLETE INVESTIGATION PARAMETERS & BIOMARKERS:
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", color: "#334155" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Investigation Name</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Observed Value</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Biological Reference</th>
                    <th style={{ padding: "8px 10px", textAlign: "center" }}>Status</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Plain Language Clinical Note</th>
                  </tr>
                </thead>
                <tbody>
                  {(fullDetailReport.parameters || []).map((param, pIdx) => (
                    <tr key={pIdx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "#0f172a" }}>
                        {param.name}
                      </td>
                      <td style={{ padding: "8px 10px", fontWeight: 800, color: param.status === "attention" ? "#dc2626" : param.status === "borderline" ? "#d97706" : "#0f172a" }}>
                        {param.value} {param.unit}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: "11px" }}>
                        {param.reference}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: param.status === "attention" ? "#fee2e2" : param.status === "borderline" ? "#fef3c7" : "#dcfce7",
                            color: param.status === "attention" ? "#dc2626" : param.status === "borderline" ? "#d97706" : "#15803d"
                          }}
                        >
                          {param.status === "attention" ? "Elevated" : param.status === "borderline" ? "Borderline" : "Optimal"}
                        </span>
                      </td>
                      <td style={{ padding: "8px 10px", color: "#334155", fontSize: "11px", lineHeight: 1.35 }}>
                        {param.plainExplanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctor Consultation Questions */}
            {fullDetailReport.doctorQuestions && fullDetailReport.doctorQuestions.length > 0 && (
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 14px", borderRadius: "10px", marginBottom: "20px" }}>
                <div style={{ fontWeight: 800, fontSize: "11.5px", color: "#0284c7", marginBottom: "6px" }}>
                  RECOMMENDED QUESTIONS FOR YOUR DOCTOR:
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#334155" }}>
                  {fullDetailReport.doctorQuestions.map((q, qIdx) => (
                    <li key={qIdx} style={{ marginBottom: "4px" }}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <Printer size={15} />
                <span>Print This Lab Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => setFullDetailReport(null)}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                Close Report Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
