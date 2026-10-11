import React, { useState } from "react";
import { 
  Activity, 
  Droplet, 
  Heart, 
  Scale, 
  Plus 
} from "lucide-react";
import { translations } from "../data/translations";

export default function VitalsTracker({ patient, onAddVital, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [selectedMetric, setSelectedMetric] = useState("bp"); // 'bp' | 'glucose' | 'heart' | 'weight'
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newSystolic, setNewSystolic] = useState("126");
  const [newDiastolic, setNewDiastolic] = useState("80");
  const [newFastingGlucose, setNewFastingGlucose] = useState("116");
  const [newPostGlucose, setNewPostGlucose] = useState("148");
  const [newPulse, setNewPulse] = useState("72");
  const [newSpo2, setNewSpo2] = useState("99");
  const [newWeight, setNewWeight] = useState("78.4");

  const vitals = patient?.vitalsHistory || [];

  const handleSaveVital = (e) => {
    e.preventDefault();
    const newEntry = {
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      bpSystolic: parseInt(newSystolic) || 120,
      bpDiastolic: parseInt(newDiastolic) || 80,
      bloodSugarFasting: parseInt(newFastingGlucose) || 110,
      bloodSugarPost: parseInt(newPostGlucose) || 140,
      heartRate: parseInt(newPulse) || 72,
      spo2: parseInt(newSpo2) || 98,
      weight: parseFloat(newWeight) || 78.5
    };

    if (onAddVital) onAddVital(newEntry);
    setShowAddModal(false);
  };

  const renderSvgTrendChart = () => {
    const width = 800;
    const height = 260;
    const padding = 45;

    let points = [];
    let points2 = [];
    let yMin = 0;
    let yMax = 200;
    let targetMin = 0;
    let targetMax = 0;

    if (selectedMetric === "bp") {
      yMin = 60;
      yMax = 160;
      targetMin = 80;
      targetMax = 125;
      points = vitals.map((v, i) => ({ x: i, y: v.bpSystolic, date: v.date }));
      points2 = vitals.map((v, i) => ({ x: i, y: v.bpDiastolic, date: v.date }));
    } else if (selectedMetric === "glucose") {
      yMin = 70;
      yMax = 200;
      targetMin = 70;
      targetMax = 120;
      points = vitals.map((v, i) => ({ x: i, y: v.bloodSugarFasting, date: v.date }));
      points2 = vitals.map((v, i) => ({ x: i, y: v.bloodSugarPost, date: v.date }));
    } else if (selectedMetric === "heart") {
      yMin = 50;
      yMax = 110;
      targetMin = 60;
      targetMax = 85;
      points = vitals.map((v, i) => ({ x: i, y: v.heartRate, date: v.date }));
    } else {
      yMin = 70;
      yMax = 85;
      targetMin = 72;
      targetMax = 76;
      points = vitals.map((v, i) => ({ x: i, y: v.weight, date: v.date }));
    }

    const n = points.length;
    const getXCoord = (idx) => padding + (idx / Math.max(n - 1, 1)) * (width - padding * 2);
    const getYCoord = (val) => height - padding - ((val - yMin) / (yMax - yMin)) * (height - padding * 2);

    const pathD1 = points.reduce((acc, pt, idx) => {
      const x = getXCoord(idx);
      const y = getYCoord(pt.y);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");

    const pathD2 = points2.length > 0 ? points2.reduce((acc, pt, idx) => {
      const x = getXCoord(idx);
      const y = getYCoord(pt.y);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "") : null;

    return (
      <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", minWidth: "600px" }}>
          {/* Grid lines */}
          {[yMin, (yMin + yMax) / 2, yMax].map((tickVal, i) => {
            const y = getYCoord(tickVal);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border-color)" strokeDasharray="4 4" />
                <text x={padding - 10} y={y + 4} fill="var(--text-dim)" fontSize="11" textAnchor="end">
                  {Math.round(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Target Zone Shading */}
          <rect
            x={padding}
            y={getYCoord(targetMax)}
            width={width - padding * 2}
            height={Math.max(getYCoord(targetMin) - getYCoord(targetMax), 4)}
            fill="var(--status-good-bg)"
            rx="4"
          />

          {/* Line 1 (Primary) */}
          <path d={pathD1} fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Line 2 (Secondary if dual) */}
          {pathD2 && (
            <path d={pathD2} fill="none" stroke="var(--secondary)" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Data Points Line 1 */}
          {points.map((pt, idx) => {
            const cx = getXCoord(idx);
            const cy = getYCoord(pt.y);
            return (
              <g key={`p1_${idx}`}>
                <circle cx={cx} cy={cy} r="5" fill="var(--primary-dark)" stroke="#ffffff" strokeWidth="2.5" />
                <text x={cx} y={cy - 12} fill="var(--text-highlight)" fontSize="11" fontWeight="800" textAnchor="middle">
                  {pt.y}
                </text>
                <text x={cx} y={height - 15} fill="var(--text-muted)" fontSize="11" textAnchor="middle">
                  {pt.date}
                </text>
              </g>
            );
          })}

          {/* Data Points Line 2 */}
          {points2.map((pt, idx) => {
            const cx = getXCoord(idx);
            const cy = getYCoord(pt.y);
            return (
              <g key={`p2_${idx}`}>
                <circle cx={cx} cy={cy} r="4.5" fill="var(--secondary)" stroke="#ffffff" strokeWidth="2" />
                <text x={cx} y={cy + 16} fill="var(--secondary)" fontSize="10" fontWeight="800" textAnchor="middle">
                  {pt.y}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "10px", fontSize: "0.85rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--primary)" }} />
            <span>
              {selectedMetric === "bp" 
                ? (lang === "hi" ? "सिस्टोलिक बीपी" : "Systolic Pressure") 
                : selectedMetric === "glucose" 
                ? (lang === "hi" ? "फास्टिंग शुगर" : "Fasting Glucose") 
                : (lang === "hi" ? "प्राथमिक मान" : "Primary Metric")}
            </span>
          </div>
          {points2.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--secondary)" }} />
              <span>
                {selectedMetric === "bp" 
                  ? (lang === "hi" ? "डायस्टोलिक बीपी" : "Diastolic Pressure") 
                  : (lang === "hi" ? "खाने के बाद शुगर" : "Post-Meal Glucose")}
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "14px", height: "10px", background: "var(--status-good-bg)", border: "1px solid var(--status-good-border)", borderRadius: "2px" }} />
            <span style={{ color: "var(--secondary)", fontWeight: 600 }}>
              {lang === "hi" ? "सुरक्षित लक्ष्य दायरा" : "Clinical Safe Target Zone"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const latestVital = vitals.length ? vitals[vitals.length - 1] : {
    bpSystolic: 120,
    bpDiastolic: 80,
    bloodSugarFasting: 110,
    bloodSugarPost: 140,
    heartRate: 72,
    spo2: 98,
    weight: 70
  };

  const metricCards = [
    { 
      id: "bp", 
      title: t.bloodPressure || (lang === "hi" ? "रक्तचाप (BP)" : "Blood Pressure"), 
      val: `${latestVital.bpSystolic}/${latestVital.bpDiastolic}`, 
      unit: "mmHg", 
      icon: Activity 
    },
    { 
      id: "glucose", 
      title: t.fastingSugar || (lang === "hi" ? "ब्लड शुगर (ग्लूकोज)" : "Blood Sugar"), 
      val: `${latestVital.bloodSugarFasting} / ${latestVital.bloodSugarPost}`, 
      unit: "mg/dL", 
      icon: Droplet 
    },
    { 
      id: "heart", 
      title: t.restingPulse || (lang === "hi" ? "हृदय गति व SpO2" : "Heart Rate & SpO2"), 
      val: `${latestVital.heartRate} bpm`, 
      unit: `${latestVital.spo2}% SpO2`, 
      icon: Heart 
    },
    { 
      id: "weight", 
      title: t.bodyWeight || (lang === "hi" ? "वजन व बीएमआई" : "Body Weight & BMI"), 
      val: `${latestVital.weight} kg`, 
      unit: `BMI ${patient?.bmi || 24.2}`, 
      icon: Scale 
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: "24px 28px",
        background: "linear-gradient(135deg, var(--primary-soft), var(--secondary-soft))",
        border: "1px solid var(--primary-border)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
              {t.navVitals || (lang === "hi" ? "वाइटल्स व शारीरिक रुझान (चार्ट्स)" : "Vitals & Physiological Trends")}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "650px", marginTop: "6px", marginBottom: 0 }}>
              {t.vitalsSub || (lang === "hi"
                ? "रक्तचाप स्थिरीकरण और ब्लड ग्लूकोज का विज़ुअल चार्ट विश्लेषण। सुरक्षित लक्ष्य सीमा के साथ समय के साथ बदलाव देखें।"
                : "Visual analytics for blood pressure stabilization and blood glucose curves. Track trends over time with safe target zones.")}
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: "12px 20px" }}>
            <Plus size={18} />
            <span>{t.logVital || (lang === "hi" ? "नया वाइटल दर्ज करें" : "Record Daily Reading")}</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        {metricCards.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMetric === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedMetric(item.id)}
              className="glass-panel interactive-card"
              style={{
                padding: "16px",
                border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                background: isSelected ? "var(--primary-soft)" : "var(--bg-card)",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>{item.title}</span>
                <Icon size={18} color={isSelected ? "var(--primary)" : "var(--text-dim)"} />
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-highlight)" }}>
                {item.val}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--secondary)", marginTop: "2px", fontWeight: 600 }}>
                {item.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Canvas Card */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
              {selectedMetric === "bp" 
                ? (lang === "hi" ? "रक्तचाप (सिस्टोलिक बनाम डायस्टोलिक)" : "Blood Pressure (Systolic vs Diastolic)") 
                : selectedMetric === "glucose" 
                ? (lang === "hi" ? "खाली पेट बनाम भोजन उपरांत ग्लूकोज" : "Fasting vs Post-Prandial Glucose") 
                : selectedMetric === "heart" 
                ? (lang === "hi" ? "आराम के समय पल्स रेट" : "Resting Pulse Rate") 
                : (lang === "hi" ? "वजन में उतार-चढ़ाव" : "Weight Variation")}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {lang === "hi" 
                ? "हालिया 6 रिकॉर्डिंग्स का डेटा • हरा शेडेड ज़ोन सामान्य सुरक्षित लक्ष्य को दर्शाता है" 
                : "Data tracked over past 6 recordings • Shaded zone represents normal clinical target"}
            </p>
          </div>
        </div>

        {renderSvgTrendChart()}
      </div>

      {/* Modal: Add New Vital */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "26px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>
              {lang === "hi" ? "दैनिक वाइटल्स दर्ज करें" : "Record Health Vitals"}
            </h2>
            <form onSubmit={handleSaveVital} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "सिस्टोलिक बीपी (mmHg)" : "Systolic BP (mmHg)"}
                  </label>
                  <input type="number" value={newSystolic} onChange={(e) => setNewSystolic(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "डायस्टोलिक बीपी (mmHg)" : "Diastolic BP (mmHg)"}
                  </label>
                  <input type="number" value={newDiastolic} onChange={(e) => setNewDiastolic(e.target.value)} required />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "फास्टिंग शुगर (mg/dL)" : "Fasting Glucose (mg/dL)"}
                  </label>
                  <input type="number" value={newFastingGlucose} onChange={(e) => setNewFastingGlucose(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "भोजन उपरांत शुगर (mg/dL)" : "Post-Meal Glucose (mg/dL)"}
                  </label>
                  <input type="number" value={newPostGlucose} onChange={(e) => setNewPostGlucose(e.target.value)} required />
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "पल्स (BPM)" : "Pulse (BPM)"}
                  </label>
                  <input type="number" value={newPulse} onChange={(e) => setNewPulse(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    SpO2 (%)
                  </label>
                  <input type="number" value={newSpo2} onChange={(e) => setNewSpo2(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "वजन (kg)" : "Weight (kg)"}
                  </label>
                  <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  {t.cancel || (lang === "hi" ? "रद्द करें" : "Cancel")}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t.saveChanges || (lang === "hi" ? "रीडिंग सुरक्षित करें" : "Save Reading")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
