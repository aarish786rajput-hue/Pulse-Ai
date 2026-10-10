import React, { useState } from "react";
import { 
  CheckCircle2, 
  ClipboardCheck, 
  Printer, 
  X, 
  Sparkles,
  Stethoscope
} from "lucide-react";
import { calculateAge } from "../utils/dateUtils";

export default function DoctorPrepModal({ isOpen, onClose, patient, lang = 'en' }) {
  const [customNote, setCustomNote] = useState(
    lang === "hi"
      ? "शाम 4 बजे के आसपास कभी-कभार थकान महसूस होती है; सुबह की शुगर अभी भी 115-130 mg/dL के बीच रहती है।"
      : "Felt occasional fatigue around 4 PM; morning glucose still fluctuating between 115-130 mg/dL."
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vitalsHistory = patient?.vitalsHistory || [];
  const latestVital = vitalsHistory[vitalsHistory.length - 1] || {};

  const targetedQuestions = lang === "hi" ? [
    `"मेरी हालिया HbA1c 7.2% है और खाली पेट ब्लड शुगर ~125 mg/dL रहती है। क्या हमें मेटफॉर्मिन या ग्लिमेपिराइड की खुराक में बदलाव करना चाहिए?"`,
    `"मेरा ताज़ा ब्लड प्रेशर ${latestVital.bpSystolic || 128}/${latestVital.bpDiastolic || 82} mmHg है। क्या टेल्मिसार्टन 40mg से बीपी नियंत्रण संतोषजनक है?"`,
    `"मेरा एलडीएल कोलेस्ट्रॉल 138 mg/dL है। क्या मुझे रोसुवास्टैटिन 10mg जारी रखनी चाहिए?"`,
    `"क्या अगले 3-6 महीनों में मुझे यूरिन एल्बुमिन जैसी कोई किडनी जांच करानी चाहिए?"`,
    `"वर्तमान वजन ${latestVital.weight || 74} kg को देखते हुए मुझे रोजाना कितनी वॉक/व्यायाम की सलाह देंगे?"`
  ] : [
    `"My recent HbA1c is 7.2% and fasting blood sugar averages ~125 mg/dL. Should we adjust my Metformin 500mg ER or Glimepiride dosage?"`,
    `"My latest blood pressure reading is ${latestVital.bpSystolic || 128}/${latestVital.bpDiastolic || 82} mmHg. Are you satisfied with how Telmisartan 40mg is stabilizing my readings?"`,
    `"My LDL cholesterol is 138 mg/dL. Should I continue on Rosuvastatin 10mg or do we need a different statin target?"`,
    `"Are there any kidney function tests (e.g. Urine Albumin-to-Creatinine Ratio) I should schedule in the next 3-6 months?"`,
    `"What aerobic exercise threshold do you recommend given my joint comfort and current weight of ${latestVital.weight || 74} kg?"`
  ];

  const handleCopy = () => {
    const calculatedAge = calculateAge(patient?.dob, patient?.age);
    const textToCopy = `PULSEAI PRE-VISIT DOCTOR BRIEFING
Patient: ${patient?.name} (${calculatedAge}y / ${patient?.gender})
Conditions: ${patient?.conditions?.map(c => typeof c === "string" ? c : c.name).join(", ") || "None"}
Allergies: ${patient?.allergies?.map(a => typeof a === "string" ? a : a.allergen).join(", ") || "None reported"}
Recent Vitals: BP ${latestVital.bpSystolic || 120}/${latestVital.bpDiastolic || 80} mmHg | Glucose: ${latestVital.bloodSugarFasting || 100} mg/dL | Weight: ${latestVital.weight || 75} kg
Active Medications: ${patient?.todayMedications?.map(m => `${m.name} ${m.dosage}`).join(", ") || "None"}

PATIENT NOTES:
${customNote}

TARGETED QUESTIONS FOR DOCTOR:
${targetedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "700px" }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, var(--primary-soft), var(--bg-card))"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7c3aed, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Stethoscope size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {lang === "hi" ? "डॉक्टर परामर्श पूर्व तैयारी सारांश" : "Doctor Consultation Prep Brief"}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {lang === "hi" ? "परामर्श हेतु तैयार किया गया: " : "Prepared for upcoming visit with "} 
                <strong>{patient?.primaryPhysician?.name || "Doctor"}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: "6px" }} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Vitals Summary */}
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "16px 20px"
          }}>
            <div style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
              {lang === "hi" ? "📊 वाइटल्स सारांश (पिछले 30 दिन)" : "📊 Longitudinal Vitals Snapshot (Last 30 Days)"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", fontSize: "0.86rem", color: "var(--text-main)" }}>
              <div>• <strong>{lang === "hi" ? "रक्तचाप:" : "Blood Pressure:"}</strong> 128/82 - 140/90 mmHg</div>
              <div>• <strong>{lang === "hi" ? "खाली पेट शुगर:" : "Fasting Glucose:"}</strong> 115 - 135 mg/dL</div>
              <div>• <strong>{lang === "hi" ? "भोजन उपरांत शुगर:" : "Post-Meal Glucose:"}</strong> 146 - 182 mg/dL</div>
              <div>• <strong>{lang === "hi" ? "वजन:" : "Current Weight:"}</strong> {latestVital.weight || 74} kg</div>
            </div>
          </div>

          {/* AI Recommended Questions */}
          <div style={{
            background: "var(--primary-soft)",
            border: "1px solid var(--primary-border)",
            borderRadius: "14px",
            padding: "18px 20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, fontSize: "0.95rem", color: "var(--primary)", marginBottom: "12px" }}>
              <Sparkles size={18} />
              {lang === "hi" ? "डॉक्टर से पूछने योग्य एआई-अनुशंसित प्रश्न" : "AI-Curated Questions for Your Doctor"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {targetedQuestions.map((q, idx) => (
                <div key={idx} style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.88rem",
                  lineHeight: "1.4",
                  color: "var(--text-main)"
                }}>
                  <strong style={{ color: "var(--primary)" }}>Q{idx + 1}:</strong> {q}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", display: "block" }}>
              {lang === "hi" ? "आपके विशिष्ट लक्षण या सवाल जो आप बताना चाहते हैं:" : "Your Specific Symptoms or Concerns to Mention:"}
            </label>
            <textarea
              rows="3"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={lang === "hi" ? "जैसे: दोपहर में थकान, घुटनों में हल्का दर्द..." : "e.g. Occasional knee stiffness, dizziness in afternoons..."}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingTop: "6px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {lang === "hi" ? "अपनी क्लिनिक विजिट में साथ ले जाने के लिए इसे कॉपी या प्रिंट करें।" : "Print or copy this sheet to bring directly to your appointment."}
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleCopy} className="btn btn-secondary">
                {copied ? <CheckCircle2 size={16} color="var(--secondary)" /> : <ClipboardCheck size={16} />}
                <span>{lang === "hi" ? (copied ? "कॉपी हो गया!" : "सारांश कॉपी करें") : (copied ? "Copied!" : "Copy Summary")}</span>
              </button>
              <button onClick={() => window.print()} className="btn btn-primary">
                <Printer size={16} /> {lang === "hi" ? "ब्रीफिंग प्रिंट करें" : "Print Briefing"}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
