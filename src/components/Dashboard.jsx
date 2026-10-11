import React, { useState, useRef } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  PlusCircle, 
  Stethoscope,
  HeartPulse,
  BellRing,
  UploadCloud,
  Pill,
  Activity
} from "lucide-react";
import { translations } from "../data/translations";
import { translateMedicalTerm } from "../utils/translator";

export default function Dashboard({
  patient,
  onNavigate,
  onToggleMedication,
  onOpenDoctorPrep,
  onOpenAddVital,
  onUploadReport,
  lang = "en"
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const t = translations[lang] || translations.en;
  const latestVital = patient.vitalsHistory[patient.vitalsHistory.length - 1] || {};
  const previousVital = patient.vitalsHistory[patient.vitalsHistory.length - 2] || {};

  const medsTakenCount = patient.todayMedications.filter(m => m.taken).length;
  const totalMeds = patient.todayMedications.length;
  const adherencePercent = Math.round((medsTakenCount / totalMeds) * 100);

  const handleFileSelected = (file) => {
    if (!file) return;
    if (onUploadReport) {
      onUploadReport(file);
    } else {
      onNavigate("reports");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Patient Greeting & Status Banner */}
      <div className="glass-panel" style={{
        padding: "26px 30px",
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12), var(--bg-card) 65%, rgba(16, 185, 129, 0.08))",
        border: "1px solid var(--border-color)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Ambient Radial Mesh Light */}
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(24px)"
        }} />

        <div className="dashboard-banner-grid">
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-highlight)", marginBottom: "6px" }}>
              {t.welcomeBack}, {patient.name}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.94rem", maxWidth: "620px" }}>
              {t.vitalsStable} <strong>{medsTakenCount} {t.ofMeds} {totalMeds}</strong> {t.dailyDoses}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
              {patient.conditions.map((cond, i) => {
                const condName = typeof cond === "string" ? cond : cond.name;
                return (
                  <span key={i} className="badge badge-primary">
                    ● {translateMedicalTerm(condName, lang)}
                  </span>
                );
              })}
              {patient.allergies.map((all, i) => {
                const allName = typeof all === "string" ? all : all.allergen;
                return (
                  <span key={i} className="badge badge-critical">
                    ⚠️ {t.allergyLabel || "Allergy:"} {translateMedicalTerm(allName, lang)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right Column in Welcome Banner: Adherence on Top + Upload Reports on Bottom */}
          <div className="dashboard-banner-right">
            {/* Adherence Circular Progress Card */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: "var(--bg-card)",
              padding: "14px 20px",
              borderRadius: "16px",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)"
            }}>
              <div style={{ position: "relative", width: "68px", height: "68px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="68" height="68" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="3.5"
                    strokeDasharray={`${adherencePercent}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: "absolute", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-highlight)" }}>
                  {adherencePercent}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                  {t.adherenceRate}
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--secondary)" }}>
                  {adherencePercent >= 75 ? t.optimalRoutine : `${totalMeds - medsTakenCount} ${t.dosesPending}`}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {t.nextDoseStatin || "Next: Rosuvastatin (Night)"}
                </div>
              </div>
            </div>

            {/* Quick Upload Reports Box (Right Bottom Side) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelected(file);
              }}
              className="interactive-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                background: isDragActive ? "rgba(14, 165, 233, 0.18)" : "var(--bg-card)",
                padding: "12px 18px",
                borderRadius: "14px",
                border: isDragActive ? "2px dashed var(--primary)" : "1.5px dashed var(--primary-border)",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              title={t.uploadReportsTitle || "Upload Reports"}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(file);
                  e.target.value = "";
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(5, 150, 105, 0.16))",
                  border: "1px solid var(--primary-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  flexShrink: 0
                }}>
                  <UploadCloud size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-highlight)", lineHeight: 1.2 }}>
                    {t.uploadReportsTitle || "Upload Reports"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {t.uploadReportsSub || "PDF or Photo • Instant AI Scan"}
                  </div>
                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                color: "#ffffff",
                fontSize: "0.74rem",
                fontWeight: 700,
                padding: "6px 11px",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 2px 6px rgba(14, 165, 233, 0.3)",
                flexShrink: 0
              }}>
                <UploadCloud size={13} strokeWidth={2.5} />
                <span>{t.upload || "Upload"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Quick Care Action Center */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-highlight)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="var(--primary)" />
            {t.quickActions || "Quick Health Actions"}
          </h2>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {t.quickActionsSub || "1-Click Direct Access"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {/* Symptom Checker Shortcut */}
          <div
            onClick={() => onNavigate("symptom-checker")}
            className="glass-panel interactive-card"
            style={{ 
              padding: "24px 22px", 
              display: "flex", 
              alignItems: "center", 
              gap: "18px", 
              borderRadius: "18px",
              border: "1.5px solid rgba(244, 63, 94, 0.35)",
              background: "linear-gradient(135deg, rgba(244, 63, 94, 0.08), var(--bg-card) 60%)",
              minHeight: "108px"
            }}
          >
            <div style={{
              width: "54px",
              height: "54px",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #f43f5e, #e11d48)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(244, 63, 94, 0.35)"
            }}>
              <Stethoscope size={26} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.12rem", color: "var(--text-highlight)", lineHeight: 1.25, marginBottom: "4px" }}>
                {t.navSymptomChecker || "Symptom Checker"}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
                {t.symptomGuideSub || "Step-by-step triage guide"}
              </div>
            </div>
          </div>

          {/* Medications */}
          <div
            onClick={() => onNavigate("medications")}
            className="glass-panel interactive-card"
            style={{ 
              padding: "24px 22px", 
              display: "flex", 
              alignItems: "center", 
              gap: "18px", 
              borderRadius: "18px",
              border: "1.5px solid rgba(236, 72, 153, 0.35)",
              background: "linear-gradient(135deg, rgba(236, 72, 153, 0.08), var(--bg-card) 60%)",
              minHeight: "108px"
            }}
          >
            <div style={{
              width: "54px",
              height: "54px",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #ec4899, #db2777)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(236, 72, 153, 0.35)"
            }}>
              <Pill size={26} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.12rem", color: "var(--text-highlight)", lineHeight: 1.25, marginBottom: "4px" }}>
                {t.navMedications || "Medications"}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
                {t.medsSub || "Pills, schedule & safety check"}
              </div>
            </div>
          </div>

          {/* Vitals & Trends */}
          <div
            onClick={() => onNavigate("vitals")}
            className="glass-panel interactive-card"
            style={{ 
              padding: "24px 22px", 
              display: "flex", 
              alignItems: "center", 
              gap: "18px", 
              borderRadius: "18px",
              border: "1.5px solid rgba(16, 185, 129, 0.35)",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), var(--bg-card) 60%)",
              minHeight: "108px"
            }}
          >
            <div style={{
              width: "54px",
              height: "54px",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)"
            }}>
              <Activity size={26} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.12rem", color: "var(--text-highlight)", lineHeight: 1.25, marginBottom: "4px" }}>
                {t.navVitals || "Vitals & Trends"}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
                {t.vitalsSub || "BP, glucose & pulse analytics"}
              </div>
            </div>
          </div>

          {/* Doctor Prep */}
          <div
            onClick={onOpenDoctorPrep}
            className="glass-panel interactive-card"
            style={{ 
              padding: "24px 22px", 
              display: "flex", 
              alignItems: "center", 
              gap: "18px", 
              borderRadius: "18px",
              border: "1.5px solid rgba(139, 92, 246, 0.35)",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), var(--bg-card) 60%)",
              minHeight: "108px"
            }}
          >
            <div style={{
              width: "54px",
              height: "54px",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(139, 92, 246, 0.35)"
            }}>
              <Calendar size={26} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.12rem", color: "var(--text-highlight)", lineHeight: 1.25, marginBottom: "4px" }}>
                {t.doctorPrep || "Doctor Visit Prep"}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
                {t.doctorPrepSub || "Vitals summary & top 5 Qs"}
              </div>
            </div>
          </div>
        </div>
    </div>

      {/* Vitals Summary Cards */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
            <HeartPulse size={20} color="var(--primary)" />
            {t.currentVitals}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {onOpenAddVital && (
              <button
                onClick={onOpenAddVital}
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              >
                <PlusCircle size={15} />
                {t.logVital || "Log Vitals"}
              </button>
            )}
            <button
              onClick={() => onNavigate("vitals")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "0.86rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {t.detailedTrends || "Detailed Trendlines"} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid-4">
          {/* BP */}
          <div 
            className="glass-panel interactive-card" 
            onClick={() => onNavigate("vitals")} 
            style={{ 
              padding: "20px",
              borderTop: "3.5px solid #f43f5e",
              background: "linear-gradient(180deg, rgba(244, 63, 94, 0.08) 0%, var(--bg-card) 50%)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700 }}>
                {t.bloodPressure}
              </div>
              <span className="badge badge-good vital-pulse-badge">{t.optimal || "Optimal"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                {latestVital.bpSystolic}/{latestVital.bpDiastolic}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>mmHg</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#f43f5e", marginTop: "6px", fontWeight: 600 }}>
              ↓ {previousVital.bpSystolic}/{previousVital.bpDiastolic} {t.improved || "improved"}
            </div>
          </div>

          {/* Blood Sugar */}
          <div 
            className="glass-panel interactive-card" 
            onClick={() => onNavigate("vitals")} 
            style={{ 
              padding: "20px",
              borderTop: "3.5px solid #f59e0b",
              background: "linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, var(--bg-card) 50%)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700 }}>
                {t.fastingSugar}
              </div>
              <span className={`badge ${latestVital.bloodSugarFasting > 125 ? "badge-borderline" : "badge-good"}`}>
                {latestVital.bloodSugarFasting > 125 ? (t.borderline || "Borderline") : (t.inTarget || "In Target")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                {latestVital.bloodSugarFasting}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>mg/dL</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#f59e0b", marginTop: "6px", fontWeight: 600 }}>
              {t.postMeal || "Post-meal:"} <strong>{latestVital.bloodSugarPost} mg/dL</strong>
            </div>
          </div>

          {/* Heart Rate & SpO2 */}
          <div 
            className="glass-panel interactive-card" 
            onClick={() => onNavigate("vitals")} 
            style={{ 
              padding: "20px",
              borderTop: "3.5px solid #10b981",
              background: "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-card) 50%)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700 }}>
                {t.restingPulse}
              </div>
              <span className="badge badge-good vital-pulse-badge">{t.healthy || "Healthy"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                {latestVital.heartRate}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>BPM</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#10b981", marginTop: "6px", fontWeight: 600 }}>
              SpO2 {t.oxygen || "Oxygen:"} <strong>{latestVital.spo2}%</strong>
            </div>
          </div>

          {/* Weight */}
          <div 
            className="glass-panel interactive-card" 
            onClick={() => onNavigate("vitals")} 
            style={{ 
              padding: "20px",
              borderTop: "3.5px solid #06b6d4",
              background: "linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, var(--bg-card) 50%)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700 }}>
                {t.bodyWeight}
              </div>
              <span className="badge badge-borderline">BMI {patient.bmi}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.85rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                {latestVital.weight}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>kg</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#06b6d4", marginTop: "6px", fontWeight: 600 }}>
              {t.steadyReduction || "Steady reduction (-0.6 kg)"}
            </div>
          </div>
        </div>
      </div>

      {/* Split Section: Today's Medications vs AI Health Alerts */}
      <div className="grid-2">
        {/* Today's Medications */}
        <div className="glass-panel" style={{ padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} color="var(--primary)" />
                {t.medSchedule}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {t.tapCheckboxTaken || "Tap checkbox to record when taken"}
              </p>
            </div>
            <button
              onClick={() => onNavigate("medications")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "0.84rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {t.fullSchedule} →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {patient.todayMedications.map((med) => (
              <div
                key={med.id}
                onClick={() => onToggleMedication(med.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: med.taken ? "var(--status-good-bg)" : "var(--bg-elevated)",
                  border: med.taken ? "1px solid var(--status-good-border)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {med.taken ? (
                    <CheckCircle2 size={22} color="var(--secondary)" />
                  ) : (
                    <Circle size={22} color="var(--text-dim)" />
                  )}
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textDecoration: med.taken ? "line-through" : "none",
                      color: med.taken ? "var(--text-muted)" : "var(--text-highlight)"
                    }}>
                      {med.name} <span style={{ fontSize: "0.82rem", color: "var(--primary)" }}>({med.dosage})</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {med.timing} • {med.purpose}
                    </div>
                  </div>
                </div>

                {med.refillDaysLeft <= 7 && (
                  <span className="badge badge-borderline" style={{ fontSize: "0.72rem" }}>
                    <BellRing size={12} /> {med.refillDaysLeft} {t.daysSupplyLeft}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Health Intelligence Feed */}
        <div className="glass-panel" style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={18} color="var(--secondary)" />
                {t.aiGuardianTitle || "AI Health Guardian & Safety Alerts"}
              </h3>
              <span className="badge badge-good">{t.monitored || "Monitored"}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Alert 1 */}
              <div style={{
                background: "var(--primary-soft)",
                border: "1px solid var(--primary-border)",
                borderRadius: "12px",
                padding: "14px 16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.9rem", color: "var(--primary)", marginBottom: "4px" }}>
                  <Sparkles size={16} />
                  {t.labReadyAlert || "Lab Report Ready: Thyrocare Metabolic Panel"}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.4 }}>
                  {t.labReportSummaryTip || (lang === "hi" 
                    ? "आपका HbA1c 7.2% है। एआई ने डॉक्टर से पूछने के लिए 3 महत्वपूर्ण प्रश्न तैयार किए हैं।"
                    : "Your HbA1c is 7.2%. AI has generated 3 doctor-targeted questions and plain-language breakdown.")
                  }
                </p>
                <button
                  onClick={() => onNavigate("reports")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: "6px",
                    padding: 0
                  }}
                >
                  {t.viewReportBreakdown || "View Report Breakdown →"}
                </button>
              </div>

              {/* Alert 2 */}
              <div style={{
                background: "var(--secondary-soft)",
                border: "1px solid var(--secondary-border)",
                borderRadius: "12px",
                padding: "14px 16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.9rem", color: "var(--secondary)", marginBottom: "4px" }}>
                  <ShieldCheck size={16} />
                  {t.drugInteractionAlert || "Drug-Drug Interaction Guard"}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.4 }}>
                  {t.allMedsSafeAlert || "All 4 active prescriptions verified for cross-compatibility. Alert: Avoid over-the-counter Ibuprofen due to your Telmisartan prescription."}
                </p>
              </div>
            </div>
          </div>

          {/* Guided Triage Prompt Chips */}
          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 700 }}>
              {t.howDoYouFeel}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                onClick={() => onNavigate("symptom-checker")}
                className="btn btn-primary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
              >
                🩺 {t.startSymptomCheck}
              </button>
              <button
                onClick={() => onNavigate("copilot", t.feelingDizzy || "Feeling dizzy / shaky")}
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
              >
                {t.feelingDizzy}
              </button>
              <button
                onClick={() => onNavigate("copilot", t.explainA1c || "Explain HbA1c 7.2%")}
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
              >
                {t.explainA1c}
              </button>
              <button
                onClick={() => onNavigate("doctors")}
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px", color: "var(--primary)", fontWeight: 700 }}
              >
                👨‍⚕️ {t.findSpecialistDoctor || "Find Specialist Doctor"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
