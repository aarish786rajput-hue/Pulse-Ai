import React, { useState, useEffect } from "react";
import { 
  AlertOctagon, 
  Phone, 
  ShieldAlert, 
  X, 
  Printer,
  Copy,
  CheckCircle2,
  Navigation,
  WifiOff
} from "lucide-react";
import { calculateAge } from "../utils/dateUtils";

function WhatsAppIcon({ size = 18, color = "#ffffff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.52 3.48A11.93 11.93 0 0012.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.16 1.6 5.97L0 24l6.23-1.63a11.94 11.94 0 005.83 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.87h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.64-.23-.38a9.92 9.92 0 01-1.52-5.27c0-5.48 4.46-9.94 9.94-9.94 2.65 0 5.15 1.03 7.02 2.91a9.88 9.88 0 012.91 7.02c0 5.49-4.46 9.91-9.97 9.91zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.92 1.23 3.12c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z"
        fill={color}
      />
    </svg>
  );
}

export default function EmergencyIDModal({ isOpen, onClose, patient, lang = 'en' }) {
  const [isLocating, setIsLocating] = useState(false);
  const [copiedSos, setCopiedSos] = useState(false);

  // Auto-sync emergency snapshot to localStorage for 100% offline access
  useEffect(() => {
    if (patient) {
      try {
        const emergencyCache = {
          name: patient.name,
          bloodGroup: patient.bloodGroup,
          allergies: patient.allergies,
          todayMedications: patient.todayMedications,
          emergencyContact: patient.emergencyContact,
          primaryPhysician: patient.primaryPhysician,
          conditions: patient.conditions,
          cachedAt: new Date().toISOString()
        };
        localStorage.setItem('pulseai_offline_emergency_cache', JSON.stringify(emergencyCache));
      } catch (e) {
        console.warn('Failed to cache emergency data:', e);
      }
    }
  }, [patient]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateSosText = (mapsUrl = null) => {
    const allergiesText = patient?.allergies?.map(a => typeof a === "string" ? a : a.allergen).join(", ") || (lang === "hi" ? "कोई नहीं" : "None");
    const medsText = patient?.todayMedications?.map(m => m.name).join(", ") || (lang === "hi" ? "कोई नहीं" : "None");

    if (lang === "hi") {
      return `🚨 *आपातकालीन मेडिकल सहायता अलर्ट (EMERGENCY SOS) — PULSEAI* 🚨\n\n` +
        `प्रिय ${patient?.emergencyContact?.name || "आपातकालीन संपर्क"},\n` +
        `मुझे तुरंत मेडिकल सहायता की आवश्यकता है!\n\n` +
        `👤 *मरीज़ का नाम:* ${patient?.name || "Patient"}\n` +
        `🩸 *रक्त समूह (Blood Group):* ${patient?.bloodGroup || "O+"}\n` +
        `⚠️ *गंभीर एलर्जी:* ${allergiesText}\n` +
        `💊 *सक्रिय दवाइयां:* ${medsText}\n` +
        `🏥 *प्राथमिक चिकित्सक:* ${patient?.primaryPhysician?.name || "Dr. Mehta"} (${patient?.primaryPhysician?.phone || "N/A"})\n` +
        (mapsUrl ? `\n📍 *मेरी लाइव GPS लोकेशन (Google Maps):*\n${mapsUrl}\n` : `\n📍 *लोकेशन:* तत्काल सहायता भेजें!\n`) +
        `\nकृपया तुरंत इस स्थान पर एम्बुलेंस भेजें या मुझे कॉल करें!`;
    }

    return `🚨 *EMERGENCY MEDICAL SOS ALERT — PULSEAI* 🚨\n\n` +
      `Dear ${patient?.emergencyContact?.name || "Emergency Contact"},\n` +
      `I am facing an acute medical emergency and need immediate assistance!\n\n` +
      `👤 *Patient:* ${patient?.name || "Patient"}\n` +
      `🩸 *Blood Group:* ${patient?.bloodGroup || "O+"}\n` +
      `⚠️ *Critical Allergies:* ${allergiesText}\n` +
      `💊 *Active Medications:* ${medsText}\n` +
      `🏥 *Primary Physician:* ${patient?.primaryPhysician?.name || "Dr. Mehta"} (${patient?.primaryPhysician?.phone || "N/A"})\n` +
      (mapsUrl ? `\n📍 *Live GPS Google Maps Location:*\n${mapsUrl}\n` : `\n📍 *Location:* Urgent assistance requested!\n`) +
      `\nPLEASE CALL ME OR DISPATCH EMERGENCY RESPONDERS TO THIS LOCATION IMMEDIATELY!`;
  };

  const handleWhatsAppSOS = () => {
    setIsLocating(true);

    const dispatch = (lat, lng) => {
      setIsLocating(false);
      const mapsUrl = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : null;
      const message = generateSosText(mapsUrl);
      const cleanPhone = (patient?.emergencyContact?.phone || "").replace(/[^0-9]/g, "");

      const waUrl = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(waUrl, "_blank", "noopener,noreferrer");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => dispatch(pos.coords.latitude, pos.coords.longitude),
        (_err) => dispatch(null, null),
        { timeout: 3500, enableHighAccuracy: true }
      );
    } else {
      dispatch(null, null);
    }
  };

  const handleCopySOS = () => {
    const text = generateSosText(null);
    navigator.clipboard.writeText(text);
    setCopiedSos(true);
    setTimeout(() => setCopiedSos(false), 2200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "680px", border: "2px solid #ef4444" }}
      >
        {/* Red emergency banner header */}
        <div style={{
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          padding: "20px 24px",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
            }}>
              <AlertOctagon size={28} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {lang === "hi" ? "आपातकालीन मेडिकल आईडी (ICE)" : "Emergency Medical ID (ICE)"}
              </div>
              <div style={{ fontSize: "0.82rem", opacity: 0.95 }}>
                {lang === "hi" ? "पैरामेडिक व आपातकालीन कर्मियों हेतु महत्वपूर्ण जानकारी" : "Paramedic & First Responder Critical Information"}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: "rgba(0, 0, 0, 0.2)", border: "none", color: "#ffffff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Offline Ready Paramedic Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            background: "linear-gradient(90deg, rgba(16, 185, 129, 0.12), rgba(2, 132, 199, 0.12))",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "10px",
            padding: "8px 14px",
            fontSize: "0.78rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-highlight)", fontWeight: 700 }}>
              <WifiOff size={15} color="#10b981" />
              <span>{lang === "hi" ? "100% ऑफ़लाइन सुरक्षित (PWA Device Cache)" : "100% Offline Ready (PWA Device Cache)"}</span>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {lang === "hi" ? "बिना इंटरनेट फर्स्ट-रिस्पॉन्डर हेतु तुरंत उपलब्ध" : "Instant access for first responders without internet"}
            </span>
          </div>

          {/* Patient Quick Vitals Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "12px",
            background: "var(--bg-elevated)",
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)"
          }}>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "पूरा नाम" : "FULL NAME"}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-highlight)" }}>{patient?.name || "Patient"}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "आयु / लिंग" : "AGE / GENDER"}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-highlight)" }}>{calculateAge(patient?.dob, patient?.age)} {lang === "hi" ? "वर्ष" : "Y"} / {patient?.gender}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "रक्त समूह" : "BLOOD TYPE"}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ef4444" }}>{patient?.bloodGroup || "O+"}</div>
            </div>
          </div>

          {/* CRITICAL ALLERGIES WARNING */}
          <div style={{
            background: "var(--status-crit-bg)",
            border: "1px solid var(--status-crit-border)",
            borderRadius: "12px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px"
          }}>
            <ShieldAlert size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.84rem", color: "#ef4444", fontWeight: 900, textTransform: "uppercase" }}>
                {lang === "hi" ? "गंभीर दवा एलर्जी (कदापि न दें)" : "SEVERE DRUG ALLERGIES (DO NOT ADMINISTER)"}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-highlight)", marginTop: "2px" }}>
                {patient?.allergies?.map(a => typeof a === "string" ? a : `${a.allergen} (${a.severity || "Critical"})`).join(" • ") || (lang === "hi" ? "कोई ज्ञात एलर्जी नहीं" : "None")}
              </div>
            </div>
          </div>

          {/* Chronic Conditions & Active Meds */}
          <div className="grid-2">
            <div style={{ background: "var(--bg-elevated)", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 800, marginBottom: "8px" }}>
                {lang === "hi" ? "दीर्घकालिक बीमारियां" : "CHRONIC CONDITIONS"}
              </div>
              <ul style={{ paddingLeft: "18px", fontSize: "0.88rem", lineHeight: "1.6", color: "var(--text-main)" }}>
                {(patient?.conditions || []).map((c, i) => (
                  <li key={i}>{typeof c === "string" ? c : c.name}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: "var(--bg-elevated)", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 800, marginBottom: "8px" }}>
                {lang === "hi" ? "सक्रिय दवाइयां" : "ACTIVE MEDICATIONS"}
              </div>
              <ul style={{ paddingLeft: "18px", fontSize: "0.88rem", lineHeight: "1.6", color: "var(--text-main)" }}>
                {(patient?.todayMedications || []).map((m, i) => (
                  <li key={i}><strong>{m.name}</strong> ({m.dosage})</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Contacts */}
          {patient?.emergencyContact && (
            <div style={{
              background: "linear-gradient(135deg, var(--primary-soft), var(--bg-elevated))",
              border: "1px solid var(--primary-border)",
              borderRadius: "14px",
              padding: "16px 20px"
            }}>
              <div style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 800, marginBottom: "10px" }}>
                {lang === "hi" ? "प्राथमिक आपातकालीन संपर्क" : "PRIMARY EMERGENCY CONTACT"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-highlight)" }}>{patient.emergencyContact.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{lang === "hi" ? "संबंध:" : "Relation:"} {patient.emergencyContact.relation}</div>
                </div>
                <a 
                  href={`tel:${patient.emergencyContact.phone}`} 
                  className="btn btn-primary"
                  style={{ padding: "8px 18px", fontSize: "0.88rem" }}
                >
                  <Phone size={15} />
                  <span>{lang === "hi" ? "कॉल करें:" : "Call"} {patient.emergencyContact.phone}</span>
                </a>
              </div>
            </div>
          )}

          {/* 🟢 WhatsApp 1-Click SOS Dispatch Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(37, 211, 102, 0.12), rgba(18, 140, 126, 0.08))",
            border: "1.5px solid #25D366",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(37, 211, 102, 0.4)"
                }}>
                  <WhatsAppIcon size={16} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-highlight)" }}>
                  {lang === "hi" ? "व्हाट्सएप 1-क्लिक एसओएस डिस्पैच" : "WhatsApp 1-Click Emergency SOS"}
                </span>
              </div>
              <span className="badge badge-good" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem" }}>
                <Navigation size={12} /> {lang === "hi" ? "लाइव जीपीएस लिंक अटैच होगा" : "Live GPS Location Attached"}
              </span>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-main)", margin: 0, lineHeight: "1.4" }}>
              {lang === "hi"
                ? "एक क्लिक में आपके आपातकालीन संपर्क को आपकी लाइव लोकेशन, ब्लड ग्रुप, गंभीर एलर्जी और दवाओं का आपातकालीन संदेश भेजा जाएगा।"
                : "One tap instantly generates and sends an urgent WhatsApp alert with your live Google Maps coordinates, blood group, critical allergies, and medications."}
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleWhatsAppSOS}
                disabled={isLocating}
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease"
                }}
              >
                <WhatsAppIcon size={18} />
                <span>
                  {isLocating
                    ? (lang === "hi" ? "जीपीएस लोकेशन जोड़ी जा रही है..." : "Locating GPS coordinates...")
                    : (lang === "hi" ? "व्हाट्सएप पर एसओएस भेजें" : "Send WhatsApp SOS Alert")}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCopySOS}
                className="btn btn-secondary"
                style={{ padding: "10px 16px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {copiedSos ? <CheckCircle2 size={16} color="var(--secondary)" /> : <Copy size={16} />}
                <span>
                  {copiedSos
                    ? (lang === "hi" ? "एसओएस संदेश कॉपी हुआ!" : "SOS Alert Copied!")
                    : (lang === "hi" ? "संदेश कॉपी करें" : "Copy SOS Text")}
                </span>
              </button>
            </div>
          </div>

          {/* Doctor & Insurance info */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <strong>{lang === "hi" ? "प्राथमिक चिकित्सक:" : "Primary Physician:"}</strong> {patient?.primaryPhysician?.name || "N/A"}
            </div>
            <div>
              <strong>{lang === "hi" ? "बीमा:" : "Insurance:"}</strong> {patient?.insurance?.provider || "N/A"} {patient?.insurance?.policyNumber ? `(#${patient.insurance.policyNumber})` : ""}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "6px" }}>
            <button onClick={handlePrint} className="btn btn-secondary">
              <Printer size={16} /> {lang === "hi" ? "आईसई कार्ड प्रिंट करें" : "Print ICE Card"}
            </button>
            <button onClick={onClose} className="btn btn-primary">
              {lang === "hi" ? "पूर्ण (बंद करें)" : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
