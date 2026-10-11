import React, { useState } from "react";
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Video,
  Building,
  GraduationCap,
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  User,
  ArrowRight
} from "lucide-react";

export default function DoctorDetailModal({
  isOpen,
  onClose,
  doctor,
  patient,
  lang = "en",
  onBookAppointment
}) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'book'
  const [consultType, setConsultType] = useState("clinic"); // 'clinic' | 'video'
  const [selectedDate, setSelectedDate] = useState("today"); // 'today' | 'tomorrow' | 'custom'
  const [customDate, setCustomDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("04:30 PM");
  const [reason, setReason] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingSlip, setBookingSlip] = useState(null);

  if (!isOpen || !doctor) return null;

  const timeSlots = [
    "10:00 AM",
    "11:15 AM",
    "12:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
    "07:15 PM"
  ];

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const aptDate = selectedDate === "today" 
      ? (lang === "hi" ? "आज" : "Today")
      : selectedDate === "tomorrow"
        ? (lang === "hi" ? "कल" : "Tomorrow")
        : customDate || "Selected Date";

    const slip = {
      id: `PULSE-APT-${Math.floor(1000 + Math.random() * 9000)}`,
      token: `TK-${Math.floor(1 + Math.random() * 25)}`,
      doctorName: lang === "hi" ? doctor.nameHi : doctor.name,
      specialty: lang === "hi" ? doctor.specialtyHi : doctor.specialty,
      clinic: lang === "hi" ? doctor.clinicHi : doctor.clinic,
      hospital: doctor.hospital,
      address: doctor.address,
      patientName: patient?.name || "Aarish Khan",
      date: aptDate,
      time: selectedTimeSlot,
      type: consultType === "video" ? (lang === "hi" ? "ऑनलाइन वीडियो परामर्श" : "Online Video Consult") : (lang === "hi" ? "क्लीनिक विजिट" : "In-Clinic Visit"),
      fee: doctor.isFreeOpd ? 0 : doctor.fee,
      contact: doctor.contactNumber
    };

    setBookingSlip(slip);
    setIsBooked(true);

    if (onBookAppointment) {
      onBookAppointment({
        doctor,
        bookingDetails: slip
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100, padding: "16px" }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "760px",
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
          borderRadius: "24px",
          background: "var(--bg-card)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)"
        }}
      >
        {/* Header Profile Hero */}
        <div style={{
          flexShrink: 0,
          position: "relative",
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(5, 150, 105, 0.12), var(--bg-card))",
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border-color)"
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              padding: "6px",
              borderRadius: "50%"
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Avatar with Status Badge */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: "92px",
                height: "92px",
                borderRadius: "20px",
                overflow: "hidden",
                border: "3px solid var(--border-color)",
                boxShadow: "var(--shadow-md)",
                background: "var(--bg-elevated)",
                flexShrink: 0
              }}>
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              {doctor.availableToday && (
                <span
                  title={lang === "hi" ? "आज उपलब्ध" : "Available Today"}
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "3px solid var(--bg-card)",
                    boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)"
                  }}
                />
              )}
            </div>

            {/* Core Info */}
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-highlight)", margin: 0 }}>
                  {lang === "hi" ? doctor.nameHi : doctor.name}
                </h2>
                <span className="badge badge-good" style={{ fontSize: "0.74rem" }}>
                  <ShieldCheck size={13} />
                  <span>{lang === "hi" ? "सत्यापित चिकित्सक" : "Verified Doctor"}</span>
                </span>
              </div>

              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--primary)", marginTop: "4px" }}>
                {lang === "hi" ? doctor.specialtyHi : doctor.specialty}
              </div>

              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {doctor.qualifications}
              </div>

              {/* Meta Chips */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(234, 179, 8, 0.12)",
                  color: "#ca8a04",
                  padding: "3px 8px",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "0.84rem"
                }}>
                  <Star size={14} fill="#ca8a04" color="#ca8a04" />
                  <span>{doctor.rating}</span>
                  <span style={{ fontSize: "0.74rem", opacity: 0.85 }}>({doctor.reviewsCount})</span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "var(--bg-card)",
                  padding: "3px 10px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)"
                }}>
                  <Award size={14} color="var(--primary)" />
                  <span>{doctor.experience} {lang === "hi" ? "वर्ष अनुभव" : "Years Exp."}</span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: doctor.isFreeOpd ? "var(--status-good-bg)" : "var(--primary-soft)",
                  color: doctor.isFreeOpd ? "var(--status-good-text)" : "var(--primary)",
                  padding: "3px 10px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 700
                }}>
                  {doctor.isFreeOpd ? (
                    <span>{lang === "hi" ? "मुफ़्त ओपीडी (आयुष्मान)" : "FREE OPD (Ayushman)"}</span>
                  ) : (
                    <span>₹{doctor.fee} {lang === "hi" ? "परामर्श शुल्क" : "Consultation"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bar (Phone / WhatsApp / Address) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px dashed var(--border-color)",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>{lang === "hi" ? doctor.clinicHi : doctor.clinic} • {lang === "hi" ? doctor.locationHi : doctor.location}</span>
              <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                {doctor.distance}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                href={`tel:${doctor.contactNumber}`}
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", textDecoration: "none" }}
              >
                <Phone size={14} color="var(--primary)" />
                <span>{lang === "hi" ? "कॉल करें" : "Call"}</span>
              </a>

              <a
                href={`https://wa.me/${doctor.whatsappNumber}?text=${encodeURIComponent(
                  `Hello ${doctor.name}, I am contacting you via PulseAI to enquire about an appointment.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", textDecoration: "none", color: "#16a34a" }}
              >
                <MessageCircle size={14} color="#16a34a" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          flexShrink: 0,
          display: "flex",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-elevated)"
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab("overview"); setIsBooked(false); }}
            style={{
              flex: 1,
              padding: "13px",
              background: activeTab === "overview" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "overview" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "overview" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {lang === "hi" ? "डॉक्टर विवरण व क्लीनिक" : "Doctor Profile & Clinic"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("book")}
            style={{
              flex: 1,
              padding: "13px",
              background: activeTab === "book" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "book" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "book" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Calendar size={15} />
            <span>{lang === "hi" ? "अपॉइंटमेंट बुक करें" : "Book Appointment"}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px" }}>
          {activeTab === "overview" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* About */}
              <div>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-highlight)", marginBottom: "6px" }}>
                  {lang === "hi" ? "डॉक्टर के बारे में (About Dr.)" : "About the Doctor"}
                </h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.6, margin: 0 }}>
                  {lang === "hi" ? doctor.aboutHi : doctor.about}
                </p>
              </div>

              {/* Clinic & Timings Banner */}
              <div style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
                padding: "16px 18px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" }}>
                    <Building size={15} />
                    <span>{lang === "hi" ? "क्लीनिक व अस्पताल पता" : "Clinic & Hospital Address"}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-highlight)", marginTop: "4px" }}>
                    {lang === "hi" ? doctor.clinicHi : doctor.clinic}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px", lineHeight: 1.4 }}>
                    {doctor.address}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", marginTop: "3px" }}>
                    {lang === "hi" ? "संबद्ध अस्पताल:" : "Affiliated Hospital:"} <strong>{doctor.hospital}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" }}>
                    <Clock size={15} />
                    <span>{lang === "hi" ? "परामर्श समय (OPD Timings)" : "Consultation Timings"}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-highlight)", marginTop: "4px" }}>
                    {doctor.timings}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--secondary)", marginTop: "4px", fontWeight: 700 }}>
                    ⚡ {lang === "hi" ? "अगला उपलब्ध स्लॉट:" : "Next Slot:"} {doctor.nextSlot}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    {lang === "hi" ? "भाषाएं:" : "Languages:"} {doctor.languages.join(", ")}
                  </div>
                </div>
              </div>

              {/* Treatments & Services */}
              <div>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-highlight)", marginBottom: "8px" }}>
                  {lang === "hi" ? "प्रमुख सेवाएं व उपचार (Key Services)" : "Services & Specialized Treatments"}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(lang === "hi" ? doctor.servicesHi : doctor.services).map((srv, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--primary-soft)",
                        color: "var(--text-main)",
                        border: "1px solid var(--primary-border)",
                        padding: "5px 12px",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Sparkles size={13} color="var(--primary)" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Credentials */}
              <div>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-highlight)", marginBottom: "8px" }}>
                  {lang === "hi" ? "शिक्षा व चिकित्सा परिषद पंजीकरण" : "Education & Medical Registrations"}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {doctor.education.map((edu, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.83rem", color: "var(--text-main)" }}>
                      <GraduationCap size={15} color="var(--primary)" />
                      <span>{edu}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <ShieldCheck size={15} color="var(--secondary)" />
                    <span>{lang === "hi" ? "पंजीकरण संख्या:" : "Reg No:"} <strong>{doctor.registrationNo}</strong></span>
                  </div>
                </div>
              </div>

              {/* Patient Stories & Testimonials */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-highlight)", margin: 0 }}>
                    {lang === "hi" ? "मरीजों की समीक्षाएं व रेटिंग" : "Patient Reviews & Stories"}
                  </h4>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {doctor.reviewsCount} {lang === "hi" ? "सत्यापित समीक्षाएं" : "verified reviews"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {doctor.patientStories.map((story, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "12px 14px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-highlight)" }}>
                          {story.name}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="#ca8a04" color="#ca8a04" />
                          ))}
                          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginLeft: "4px" }}>{story.date}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
                        "{story.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Booking CTA */}
              <div style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--primary-soft), var(--secondary-soft))",
                border: "1px solid var(--primary-border)"
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-highlight)" }}>
                    {lang === "hi" ? "परामर्श हेतु स्लॉट उपलब्ध है" : "Consultation Slot Available"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {doctor.isFreeOpd ? (lang === "hi" ? "मुफ़्त आयुष्मान ओपीडी" : "Free Ayushman OPD") : `Fee: ₹${doctor.fee}`} • {doctor.nextSlot}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("book")}
                  className="btn btn-primary"
                  style={{ padding: "10px 20px" }}
                >
                  <Calendar size={16} />
                  <span>{lang === "hi" ? "अपॉइंटमेंट बुक करें" : "Book Appointment"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : isBooked && bookingSlip ? (
            /* Confirmation Receipt / Token Slip */
            <div style={{
              background: "var(--bg-elevated)",
              border: "1.5px solid var(--secondary)",
              borderRadius: "18px",
              padding: "24px",
              textAlign: "center"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--status-good-bg)",
                border: "2px solid var(--status-good-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                color: "var(--status-good-text)"
              }}>
                <CheckCircle2 size={32} />
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--status-good-text)", margin: 0 }}>
                {lang === "hi" ? "अपॉइंटमेंट सफलतापूर्वक कन्फर्म!" : "Appointment Confirmed Successfully!"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                {lang === "hi"
                  ? "कन्फर्मेशन एसएमएस व व्हाट्सएप आपके पंजीकृत नंबर पर भेज दिया गया है।"
                  : "Confirmation SMS & WhatsApp details have been dispatched to your mobile."}
              </p>

              {/* Receipt Ticket Box */}
              <div style={{
                background: "var(--bg-card)",
                border: "1px dashed var(--border-color)",
                borderRadius: "14px",
                padding: "18px 20px",
                textAlign: "left",
                margin: "18px 0",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Booking ID</div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--primary)" }}>{bookingSlip.id}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Token No</div>
                    <span className="badge badge-primary" style={{ fontSize: "0.88rem", fontWeight: 800 }}>
                      {bookingSlip.token}
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Doctor & Specialty</div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-highlight)" }}>{bookingSlip.doctorName}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--primary)" }}>{bookingSlip.specialty}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Patient</div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-highlight)" }}>{bookingSlip.patientName}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>Blood Group: {patient?.bloodGroup || "B+"}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Date & Time</div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-highlight)" }}>
                      {bookingSlip.date} • {bookingSlip.time}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Consultation Type & Fee</div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-highlight)" }}>
                      {bookingSlip.type}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: bookingSlip.fee === 0 ? "var(--secondary)" : "var(--primary)", fontWeight: 700 }}>
                      {bookingSlip.fee === 0 ? "FREE (Ayushman OPD)" : `₹${bookingSlip.fee} (Pay at Clinic)`}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Venue / Clinic Address</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: 1.4 }}>
                    <strong>{bookingSlip.clinic}</strong>, {bookingSlip.address}
                  </div>
                </div>
              </div>

              {/* Actions on slip */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn btn-secondary"
                  style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                >
                  <Printer size={15} />
                  <span>{lang === "hi" ? "स्लिप प्रिंट करें" : "Print Slip"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  style={{ padding: "8px 18px", fontSize: "0.85rem", fontWeight: 700 }}
                >
                  <CheckCircle2 size={15} />
                  <span>{lang === "hi" ? "बुकिंग देखें (Done)" : "View Bookings"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBooked(false)}
                  className="btn btn-primary"
                  style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                >
                  <span>{lang === "hi" ? "नया अपॉइंटमेंट बुक करें" : "Book Another"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form id="doctor-booking-form" onSubmit={handleConfirmBooking} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Patient Badge */}
              <div style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff"
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                      {lang === "hi" ? "मरीज़ का नाम:" : "Booking for Patient:"}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-highlight)" }}>
                      {patient?.name || "Aarish Khan"} ({patient?.bloodGroup || "B+"})
                    </div>
                  </div>
                </div>

                <span className="badge badge-good" style={{ fontSize: "0.72rem" }}>
                  ABHA Verified
                </span>
              </div>

              {/* Consultation Mode */}
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  {lang === "hi" ? "परामर्श का माध्यम चुनें (Consultation Type):" : "Choose Consultation Mode:"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setConsultType("clinic")}
                    className="interactive-card"
                    style={{
                      padding: "14px",
                      borderRadius: "14px",
                      background: consultType === "clinic" ? "var(--primary-soft)" : "var(--bg-elevated)",
                      border: consultType === "clinic" ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "var(--text-highlight)" }}>
                      <Building size={16} color="var(--primary)" />
                      <span>{lang === "hi" ? "क्लीनिक पर विजिट" : "In-Clinic Visit"}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {lang === "hi" ? "व्यक्तिगत शारीरिक जांच" : "Direct in-person physical checkup"}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType("video")}
                    className="interactive-card"
                    style={{
                      padding: "14px",
                      borderRadius: "14px",
                      background: consultType === "video" ? "var(--primary-soft)" : "var(--bg-elevated)",
                      border: consultType === "video" ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "var(--text-highlight)" }}>
                      <Video size={16} color="var(--secondary)" />
                      <span>{lang === "hi" ? "ऑनलाइन वीडियो परामर्श" : "Online Video Consult"}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {lang === "hi" ? "घर बैठे एचडी वीडियो कॉल" : "HD video call from home with digital prescription"}
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  {lang === "hi" ? "तारीख का चयन करें (Date):" : "Select Appointment Date:"}
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedDate("today")}
                    className={`btn ${selectedDate === "today" ? "btn-primary" : "btn-secondary"}`}
                    style={{ padding: "8px 16px", fontSize: "0.84rem" }}
                  >
                    {lang === "hi" ? "आज (Today)" : "Today"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDate("tomorrow")}
                    className={`btn ${selectedDate === "tomorrow" ? "btn-primary" : "btn-secondary"}`}
                    style={{ padding: "8px 16px", fontSize: "0.84rem" }}
                  >
                    {lang === "hi" ? "कल (Tomorrow)" : "Tomorrow"}
                  </button>

                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setSelectedDate("custom");
                      }}
                      style={{ padding: "7px 12px", fontSize: "0.84rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  {lang === "hi" ? "समय स्लॉट चुनें (Available Time Slot):" : "Choose Available Time Slot:"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: "8px",
                          borderRadius: "10px",
                          border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                          background: isSelected ? "var(--primary)" : "var(--bg-elevated)",
                          color: isSelected ? "#ffffff" : "var(--text-main)",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Symptoms / Note */}
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  {lang === "hi" ? "लक्षण या परामर्श का कारण (वैकल्पिक):" : "Reason for Visit / Symptoms (Optional):"}
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={lang === "hi" ? "उदा. दांत में दर्द, स्किन रैशेस, आंखों में जलन..." : "e.g. Toothache, skin rash, blurry vision, routine checkup..."}
                  style={{ resize: "none" }}
                />
              </div>

              {/* In-Form Action Row */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
                paddingTop: "14px",
                borderTop: "1px dashed var(--border-color)",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                    {lang === "hi" ? "कुल देय शुल्क:" : "Total Payable Fee:"}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem", color: doctor.isFreeOpd ? "var(--secondary)" : "var(--primary)" }}>
                    {doctor.isFreeOpd ? (lang === "hi" ? "मुफ़्त (आयुष्मान ओपीडी)" : "FREE (Ayushman OPD)") : `₹${doctor.fee}`}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                    style={{ padding: "10px 18px", fontSize: "0.88rem", fontWeight: 700 }}
                  >
                    <span>{lang === "hi" ? "रद्द करें (Cancel)" : "Cancel"}</span>
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: "10px 24px", fontSize: "0.92rem", fontWeight: 800 }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{lang === "hi" ? "अपॉइंटमेंट कन्फर्म करें" : "Confirm Appointment"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Action Footer - Always visible on screen for Book Appointment tab */}
        {activeTab === "book" && !isBooked && (
          <div style={{
            flexShrink: 0,
            background: "var(--bg-elevated)",
            borderTop: "1px solid var(--border-color)",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.08)",
            zIndex: 10
          }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                {lang === "hi" ? "देय परामर्श शुल्क:" : "Consultation Fee:"}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "1.12rem", color: doctor.isFreeOpd ? "var(--secondary)" : "var(--primary)" }}>
                  {doctor.isFreeOpd ? (lang === "hi" ? "मुफ़्त (आयुष्मान)" : "FREE (Ayushman)") : `₹${doctor.fee}`}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  • {selectedDate === "today" ? (lang === "hi" ? "आज" : "Today") : selectedDate === "tomorrow" ? (lang === "hi" ? "कल" : "Tomorrow") : customDate || (lang === "hi" ? "तारीख" : "Date")} @ {selectedTimeSlot}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ padding: "10px 18px", fontSize: "0.88rem", fontWeight: 700, borderRadius: "12px" }}
              >
                <span>{lang === "hi" ? "रद्द करें (Cancel)" : "Cancel"}</span>
              </button>

              <button
                type="submit"
                form="doctor-booking-form"
                className="btn btn-primary"
                style={{
                  padding: "10px 24px",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px var(--primary-glow)"
                }}
              >
                <CheckCircle2 size={16} />
                <span>{lang === "hi" ? "अपॉइंटमेंट कन्फर्म करें" : "Confirm Appointment"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
