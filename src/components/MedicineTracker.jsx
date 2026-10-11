import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Plus, 
  Utensils, 
  Search,
  BellRing
} from "lucide-react";
import { analyzeMedicationList, checkPairInteraction } from "../data/drugInteractions";
import { translations } from "../data/translations";
import { translateMedicalTerm } from "../utils/translator";

export default function MedicineTracker({ patient, onToggleMedication, onAddMedication, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' | 'interactions'
  const [testMedName, setTestMedName] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New med form state
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedSlot, setNewMedSlot] = useState("morning");
  const [newMedPurpose, setNewMedPurpose] = useState("");

  const medsList = patient?.todayMedications || [];
  const activeAlerts = analyzeMedicationList(medsList, lang);

  const handleTestInteraction = (e) => {
    e.preventDefault();
    if (!testMedName.trim()) return;

    const conflicts = [];
    patient.todayMedications.forEach((currentMed) => {
      const match = checkPairInteraction(currentMed.name, testMedName, lang);
      if (match) {
        conflicts.push({
          currentMed: currentMed.name,
          ...match
        });
      }
    });

    setTestResult({
      searched: testMedName,
      conflicts,
      isSafe: conflicts.length === 0
    });
  };

  const handleCreateMed = (e) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedDosage.trim()) return;

    const newMed = {
      id: `med_${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      timing: newMedSlot === "morning" ? "Morning (8:00 AM)" : newMedSlot === "afternoon" ? "Afternoon (1:30 PM)" : "Night (9:30 PM)",
      slot: newMedSlot,
      taken: false,
      purpose: newMedPurpose.trim() || "General Therapy",
      refillDaysLeft: 30,
      withFood: true
    };

    if (onAddMedication) onAddMedication(newMed);
    setNewMedName("");
    setNewMedDosage("");
    setNewMedPurpose("");
    setShowAddForm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: "24px 28px",
        background: "linear-gradient(135deg, var(--secondary-soft), var(--primary-soft))",
        border: "1px solid var(--secondary-border)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
              {t.navMedications || "Smart Medicine Center"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "650px", marginTop: "6px", marginBottom: 0 }}>
              {t.medsSub || "Track daily doses with timely food reminders, and protect yourself against dangerous drug-drug interactions before consuming over-the-counter painkillers."}
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>{showAddForm ? translateMedicalTerm("Close Form", lang) : translateMedicalTerm("Add Medication", lang)}</span>
          </button>
        </div>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <form onSubmit={handleCreateMed} className="glass-panel" style={{ padding: "20px 24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "14px" }}>{translateMedicalTerm("Add New Prescription", lang)}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{translateMedicalTerm("Medication Name", lang)}</label>
              <input
                type="text"
                placeholder="e.g. Atorvastatin, Metformin"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{translateMedicalTerm("Dosage", lang)}</label>
              <input
                type="text"
                placeholder="e.g. 500 mg, 10 mcg"
                value={newMedDosage}
                onChange={(e) => setNewMedDosage(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{translateMedicalTerm("Daily Timing", lang)}</label>
              <select value={newMedSlot} onChange={(e) => setNewMedSlot(e.target.value)}>
                <option value="morning">{translateMedicalTerm("Morning Routine", lang)}</option>
                <option value="afternoon">{translateMedicalTerm("Afternoon Routine", lang)}</option>
                <option value="night">{translateMedicalTerm("Night Routine", lang)}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{translateMedicalTerm("Purpose / Condition", lang)}</label>
              <input
                type="text"
                placeholder="e.g. Blood Sugar, Blood Pressure"
                value={newMedPurpose}
                onChange={(e) => setNewMedPurpose(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
              {t.cancel || "Cancel"}
            </button>
            <button type="submit" className="btn btn-primary">
              {translateMedicalTerm("Save to Daily Regimen", lang)}
            </button>
          </div>
        </form>
      )}

      {/* Navigation Sub-Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
        <button
          onClick={() => setActiveTab("schedule")}
          className="btn"
          style={{
            background: activeTab === "schedule" ? "linear-gradient(135deg, #ec4899, #db2777)" : "var(--bg-elevated)",
            color: activeTab === "schedule" ? "#ffffff" : "var(--text-muted)",
            border: activeTab === "schedule" ? "none" : "1px solid var(--border-color)",
            boxShadow: activeTab === "schedule" ? "0 4px 14px rgba(236, 72, 153, 0.35)" : "none",
            fontWeight: 700
          }}
        >
          <Clock size={16} /> {translateMedicalTerm("Daily Dosage Schedule", lang)}
        </button>
        <button
          onClick={() => setActiveTab("interactions")}
          className="btn"
          style={{
            background: activeTab === "interactions" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "var(--bg-elevated)",
            color: activeTab === "interactions" ? "#ffffff" : "var(--text-muted)",
            border: activeTab === "interactions" ? "none" : "1px solid var(--border-color)",
            boxShadow: activeTab === "interactions" ? "0 4px 14px rgba(245, 158, 11, 0.35)" : "none",
            fontWeight: 700
          }}
        >
          <ShieldAlert size={16} /> {translateMedicalTerm("Drug Interaction Scanner", lang)}
        </button>
      </div>

      {/* Tab 1: Schedule */}
      {activeTab === "schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {["morning", "afternoon", "night"].map((slotName) => {
            const slotMeds = patient.todayMedications.filter(m => m.slot === slotName);
            const slotTitle = slotName === "morning" ? "Morning Routine" : slotName === "afternoon" ? "Afternoon Routine" : "Night Routine";
            const slotTime = slotName === "morning" ? "8:00 AM - 10:00 AM" : slotName === "afternoon" ? "1:00 PM - 2:30 PM" : "9:00 PM - 10:30 PM";

            return (
              <div key={slotName} className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                      {translateMedicalTerm(slotTitle, lang)}
                    </h3>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{slotTime}</div>
                  </div>
                  <span className="badge badge-primary">
                    {slotMeds.filter(m => m.taken).length} / {slotMeds.length} {translateMedicalTerm("Completed", lang)}
                  </span>
                </div>

                {slotMeds.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.86rem", fontStyle: "italic", padding: "8px 0" }}>
                    {translateMedicalTerm("No medications scheduled for this time.", lang)}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {slotMeds.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => onToggleMedication(med.id)}
                        className="interactive-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          background: med.taken ? "var(--status-good-bg)" : "var(--bg-elevated)",
                          border: med.taken ? "1px solid var(--status-good-border)" : "1px solid var(--border-color)",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          {med.taken ? (
                            <CheckCircle2 size={24} color="var(--secondary)" />
                          ) : (
                            <Circle size={24} color="var(--text-dim)" />
                          )}
                          <div>
                            <div style={{
                              fontWeight: 800,
                              fontSize: "1rem",
                              textDecoration: med.taken ? "line-through" : "none",
                              color: med.taken ? "var(--text-muted)" : "var(--text-highlight)"
                            }}>
                              {med.name} <span style={{ color: "var(--primary)", fontSize: "0.85rem" }}>({med.dosage})</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "12px", marginTop: "3px" }}>
                              <span>{translateMedicalTerm(med.purpose, lang)}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Utensils size={13} /> {med.withFood ? translateMedicalTerm("Take with/after meals", lang) : translateMedicalTerm("Take on empty stomach", lang)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className={`badge ${med.refillDaysLeft <= 7 ? "badge-critical" : "badge-good"}`}>
                          <BellRing size={12} /> {med.refillDaysLeft} {translateMedicalTerm("days supply", lang)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Drug Interaction Scanner */}
      {activeTab === "interactions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Active Cross-Check Card */}
          <div className="glass-panel" style={{ padding: "22px 26px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <ShieldCheck size={20} color="var(--secondary)" />
              {translateMedicalTerm("Active Regimen Cross-Compatibility Scan", lang)}
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "14px" }}>
              {lang === "hi"
                ? `पल्स-एआई ने ${patient?.name || "Patient"} द्वारा ली जा रही सभी ${medsList.length} सक्रिय दवाओं की सुरक्षा जांच की है।`
                : `PulseAI verified all ${medsList.length} active prescriptions currently taken by ${patient?.name || "Patient"}.`}
            </p>

            {activeAlerts.length === 0 ? (
              <div style={{
                background: "var(--status-good-bg)",
                border: "1px solid var(--status-good-border)",
                borderRadius: "12px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}>
                <CheckCircle2 size={24} color="var(--secondary)" />
                <div>
                  <div style={{ fontWeight: 800, color: "var(--status-good-text)" }}>
                    {translateMedicalTerm("Zero Internal Conflicts Detected", lang)}
                  </div>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-main)", marginTop: "2px" }}>
                    {lang === "hi"
                      ? "आपकी नियमित दवाओं के बीच कोई प्रतिकूल परस्पर क्रिया नहीं है।"
                      : "All current active medications in the prescription have compatible metabolic pathways."}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activeAlerts.map((al, idx) => (
                  <div key={idx} style={{
                    background: "var(--status-warn-bg)",
                    border: "1px solid var(--status-warn-border)",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}>
                    <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--status-warn-text)", fontSize: "0.95rem" }}>
                        {al.title} ({al.drugA} + {al.drugB})
                      </div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-main)", marginTop: "3px" }}>
                        {al.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test an OTC / New Drug Simulator */}
          <div className="glass-panel" style={{ padding: "22px 26px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Search size={20} color="var(--primary)" />
              {translateMedicalTerm("Test An Over-The-Counter Medicine Before Taking", lang)}
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Planning to take a painkiller, fever tablet, or supplement? Test it below to check compatibility with <strong>{patient.name}’s</strong> active medications:
            </p>

            <form onSubmit={handleTestInteraction} style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
              <input
                type="text"
                value={testMedName}
                onChange={(e) => setTestMedName(e.target.value)}
                placeholder={t.searchPlaceholder || "Search medicine name..."}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                {translateMedicalTerm("Scan Safety", lang)}
              </button>
            </form>

            {/* Quick Test Chips */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{translateMedicalTerm("Quick Test:", lang)}</span>
              {["Ibuprofen (Painkiller)", "Aspirin", "Paracetamol", "Potassium Supplement", "Warfarin"].map((drug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const clean = drug.split(" ")[0];
                    setTestMedName(clean);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: "4px 12px", fontSize: "0.78rem", borderRadius: "8px" }}
                >
                  {drug}
                </button>
              ))}
            </div>

            {/* Results display */}
            {testResult && (
              <div>
                {testResult.isSafe ? (
                  <div style={{
                    background: "var(--status-good-bg)",
                    border: "1px solid var(--status-good-border)",
                    borderRadius: "12px",
                    padding: "16px 20px"
                  }}>
                    <div style={{ fontWeight: 800, color: "var(--status-good-text)", fontSize: "1rem" }}>
                      ✅ No High-Risk Conflict Found for "{testResult.searched}"
                    </div>
                    <div style={{ fontSize: "0.86rem", color: "var(--text-main)", marginTop: "4px" }}>
                      This medication does not exhibit severe adverse interactions with your current prescription. Always adhere to recommended doses.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {testResult.conflicts.map((conf, idx) => (
                      <div key={idx} style={{
                        background: conf.severity === "critical" ? "var(--status-crit-bg)" : "var(--status-warn-bg)",
                        border: conf.severity === "critical" ? "1px solid var(--status-crit-border)" : "1px solid var(--status-warn-border)",
                        borderRadius: "12px",
                        padding: "18px 20px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: conf.severity === "critical" ? "var(--status-crit-text)" : "var(--status-warn-text)", fontWeight: 800, fontSize: "1rem" }}>
                          <AlertTriangle size={20} />
                          {conf.severity.toUpperCase()} CONFLICT: {testResult.searched} + {conf.currentMed}
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-highlight)", marginTop: "4px" }}>
                          {conf.title}
                        </div>
                        <p style={{ fontSize: "0.86rem", color: "var(--text-main)", marginTop: "6px", lineHeight: "1.5" }}>
                          {conf.description}
                        </p>
                        <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 700 }}>
                          💡 Safer Alternative: {conf.actionRecommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
