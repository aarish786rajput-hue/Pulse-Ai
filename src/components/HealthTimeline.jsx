import React, { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Filter,
  Building2
} from "lucide-react";

export default function HealthTimeline({ patient, onAddTimelineEvent, lang = 'en' }) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Consultation");
  const [eventDoctor, setEventDoctor] = useState("");
  const [eventSummary, setEventSummary] = useState("");

  const events = patient?.timelineEvents || [];

  const filteredEvents = events.filter((ev) => {
    if (selectedFilter === "All") return true;
    return ev.category === selectedFilter;
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv = {
      id: `evt_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      category: eventCategory,
      title: eventTitle.trim(),
      doctor: eventDoctor.trim() || (lang === "hi" ? "परामर्श चिकित्सक" : "Attending Physician"),
      summary: eventSummary.trim() || (lang === "hi" ? "चिकित्सीय समीक्षा एवं अवलोकन विवरण दर्ज किया गया।" : "Documented clinical review and observation notes."),
      badge: lang === "hi" ? "दर्ज" : "Logged",
      status: "good"
    };

    if (onAddTimelineEvent) onAddTimelineEvent(newEv);
    setEventTitle("");
    setEventDoctor("");
    setEventSummary("");
    setShowAddModal(false);
  };

  const filterOptions = [
    { id: "All", label: lang === "hi" ? "सभी" : "All" },
    { id: "Consultation", label: lang === "hi" ? "परामर्श" : "Consultation" },
    { id: "Lab Test", label: lang === "hi" ? "लैब टेस्ट" : "Lab Test" },
    { id: "Diagnostic", label: lang === "hi" ? "जांच / इमेजिंग" : "Diagnostic" },
    { id: "Immunization", label: lang === "hi" ? "टीकाकरण" : "Immunization" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: "24px 28px",
        background: "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
        border: "1px solid var(--primary-border)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
              {lang === "hi" ? "स्वास्थ्य इतिहास व मेडिकल टाइमलाइन" : "Chronological Health Dossier"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "650px" }}>
              {lang === "hi"
                ? "डॉक्टर परामर्श, लैब टेस्ट, नियमित टीके और जांच का एक संपूर्ण एकीकृत कालानुक्रमिक रिकॉर्ड ताकि आपका स्वास्थ्य इतिहास हमेशा सुरक्षित रहे।"
                : "A single unified timeline of consultations, blood panels, routine vaccines, and eye checkups so your complete history is always at hand."}
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: "12px 20px" }}>
            <Plus size={18} />
            <span>{lang === "hi" ? "मेडिकल रिकॉर्ड जोड़ें" : "Add Medical Event"}</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
          <Filter size={14} /> {lang === "hi" ? "फ़िल्टर रिकॉर्ड:" : "Filter Record:"}
        </span>
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedFilter(opt.id)}
            className="btn"
            style={{
              padding: "6px 14px",
              fontSize: "0.82rem",
              background: selectedFilter === opt.id ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "var(--bg-elevated)",
              color: selectedFilter === opt.id ? "#ffffff" : "var(--text-muted)",
              border: selectedFilter === opt.id ? "none" : "1px solid var(--border-color)",
              borderRadius: "20px",
              fontWeight: selectedFilter === opt.id ? 700 : 500
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div style={{ position: "relative", paddingLeft: "28px" }}>
        {/* Continuous vertical line */}
        <div style={{
          position: "absolute",
          top: "8px",
          bottom: "8px",
          left: "10px",
          width: "2px",
          background: "linear-gradient(to bottom, var(--primary), var(--secondary))"
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {filteredEvents.map((ev, index) => {
            const isAttention = ev.status === "attention";
            return (
              <div key={ev.id || index} style={{ position: "relative" }}>
                {/* Timeline node */}
                <div style={{
                  position: "absolute",
                  left: "-28px",
                  top: "16px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: isAttention ? "#f59e0b" : "var(--primary)",
                  border: "4px solid var(--bg-main)",
                  boxShadow: "0 0 10px rgba(2, 132, 199, 0.4)"
                }} />

                {/* Event card */}
                <div className="glass-panel interactive-card" style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="badge badge-primary">{ev.category}</span>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{ev.title}</h3>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "14px", marginTop: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={13} /> {ev.date}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Building2 size={13} /> {ev.doctor}
                        </span>
                      </div>
                    </div>

                    <span className={`badge ${isAttention ? "badge-borderline" : "badge-good"}`}>
                      {ev.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: "1.5", marginTop: "10px" }}>
                    {ev.summary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "26px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px" }}>
              {lang === "hi" ? "नया मेडिकल रिकॉर्ड जोड़ें" : "Log Medical Event"}
            </h2>
            <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {lang === "hi" ? "शीर्षक / घटना" : "Event Title"}
                </label>
                <input
                  type="text"
                  placeholder={lang === "hi" ? "जैसे: हृदय रोग विशेषज्ञ परामर्श, वार्षिक नेत्र जांच..." : "e.g. Cardiologist Consultation, Eye Retina Checkup"}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "श्रेणी" : "Category"}
                  </label>
                  <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
                    <option value="Consultation">{lang === "hi" ? "डॉक्टर परामर्श" : "Doctor Consultation"}</option>
                    <option value="Lab Test">{lang === "hi" ? "लैब टेस्ट" : "Lab Test"}</option>
                    <option value="Diagnostic">{lang === "hi" ? "जांच / इमेजिंग" : "Diagnostic / Imaging"}</option>
                    <option value="Immunization">{lang === "hi" ? "टीकाकरण" : "Immunization"}</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {lang === "hi" ? "डॉक्टर / अस्पताल" : "Doctor / Clinic"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === "hi" ? "जैसे: डॉ. वर्मा / अपोलो क्लिनिक" : "e.g. Dr. Verma / Apollo Hospital"}
                    value={eventDoctor}
                    onChange={(e) => setEventDoctor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {lang === "hi" ? "चिकित्सीय विवरण व सलाह" : "Clinical Notes & Advice"}
                </label>
                <textarea
                  rows="3"
                  placeholder={lang === "hi" ? "दवा बदलाव, टेस्ट परिणाम, अगली विजिट..." : "Prescription changes, test outcomes, next visit advised..."}
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "hi" ? "सुरक्षित करें" : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
