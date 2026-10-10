import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Video,
  Award,
  ChevronRight,
  Filter,
  Sparkles,
  Stethoscope,
  Smile,
  Eye,
  HeartPulse,
  Activity,
  Baby,
  Bone,
  Ear,
  Brain,
  HeartHandshake,
  CheckCircle2,
  BriefcaseMedical,
  AlertCircle
} from "lucide-react";
import { mockDoctors, doctorSpecialties } from "../data/doctorsData";
import DoctorDetailModal from "./DoctorDetailModal";

export default function DoctorsDashboard({
  patient,
  lang = "en",
  onAddTimelineEvent,
  initialSpecialty = "all",
  onOpenDoctorListing
}) {
  const [customDoctorsList, setCustomDoctorsList] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_custom_doctors");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleDoctorAdded = () => {
      try {
        const saved = localStorage.getItem("pulseai_custom_doctors");
        if (saved) setCustomDoctorsList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("pulseai_doctor_added", handleDoctorAdded);
    return () => window.removeEventListener("pulseai_doctor_added", handleDoctorAdded);
  }, []);

  const allDoctors = useMemo(() => {
    return [...customDoctorsList, ...mockDoctors];
  }, [customDoctorsList]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [filterVideoOnly, setFilterVideoOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating"); // 'rating' | 'experience' | 'fee-asc'

  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(null);

  // Icon mapping for specialties
  const getSpecialtyIcon = (iconName) => {
    switch (iconName) {
      case "Smile": return <Smile size={16} />;
      case "Sparkles": return <Sparkles size={16} />;
      case "Eye": return <Eye size={16} />;
      case "HeartPulse": return <HeartPulse size={16} />;
      case "Activity": return <Activity size={16} />;
      case "Baby": return <Baby size={16} />;
      case "Bone": return <Bone size={16} />;
      case "Ear": return <Ear size={16} />;
      case "Brain": return <Brain size={16} />;
      case "HeartHandshake": return <HeartHandshake size={16} />;
      default: return <Stethoscope size={16} />;
    }
  };

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return allDoctors
      .filter((doc) => {
        // Specialty filter
        if (selectedSpecialty !== "all" && doc.specialtyId !== selectedSpecialty) {
          return false;
        }

        // Available Today filter
        if (filterTodayOnly && !doc.availableToday) {
          return false;
        }

        // Free OPD filter
        if (filterFreeOnly && !doc.isFreeOpd) {
          return false;
        }

        // Video consult filter
        if (filterVideoOnly && !doc.videoConsult) {
          return false;
        }

        // Search Query filter (matches name, specialty, clinic, location, treatments)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = doc.name.toLowerCase().includes(q) || doc.nameHi.includes(q);
          const matchesSpecialty = doc.specialty.toLowerCase().includes(q) || doc.specialtyHi.includes(q);
          const matchesClinic = doc.clinic.toLowerCase().includes(q) || doc.hospital.toLowerCase().includes(q);
          const matchesLocation = doc.location.toLowerCase().includes(q);
          const matchesServices = doc.services.some(s => s.toLowerCase().includes(q));

          // Also match common symptoms terms
          const symptomMap = {
            teeth: "dentist",
            tooth: "dentist",
            dental: "dentist",
            दांत: "dentist",
            skin: "dermatologist",
            acne: "dermatologist",
            त्वचा: "dermatologist",
            hair: "dermatologist",
            eye: "ophthalmologist",
            vision: "ophthalmologist",
            आंख: "ophthalmologist",
            चश्मा: "ophthalmologist",
            heart: "cardiologist",
            bp: "cardiologist",
            दिल: "cardiologist",
            bone: "orthopedic",
            joint: "orthopedic",
            हड्डी: "orthopedic",
            ear: "ent",
            nose: "ent",
            throat: "ent",
            गला: "ent",
            कान: "ent"
          };

          const matchedBySymptom = Object.entries(symptomMap).some(([sym, specId]) => {
            return q.includes(sym) && doc.specialtyId === specId;
          });

          return matchesName || matchesSpecialty || matchesClinic || matchesLocation || matchesServices || matchedBySymptom;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "experience") return b.experience - a.experience;
        if (sortBy === "fee-asc") return a.fee - b.fee;
        return 0;
      });
  }, [allDoctors, selectedSpecialty, filterTodayOnly, filterFreeOnly, filterVideoOnly, searchQuery, sortBy]);

  const handleOpenDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleAppointmentBooked = ({ doctor, bookingDetails }) => {
    // Show top banner alert
    setBookingSuccessAlert({
      doctorName: bookingDetails.doctorName,
      date: bookingDetails.date,
      time: bookingDetails.time,
      token: bookingDetails.token
    });

    // Optionally save to longitudinal health timeline
    if (onAddTimelineEvent) {
      onAddTimelineEvent({
        id: `event-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        type: "Doctor Consultation",
        title: `${doctor.specialty} Consultation with ${doctor.name}`,
        doctor: doctor.name,
        facility: doctor.clinic,
        notes: `Confirmed appointment (${bookingDetails.type}) - ${bookingDetails.date} at ${bookingDetails.time}. Token: ${bookingDetails.token}. Fee: ${doctor.isFreeOpd ? 'FREE OPD' : '₹' + doctor.fee}`,
        category: "appointment"
      });
    }

    setTimeout(() => {
      setBookingSuccessAlert(null);
    }, 8000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Success Booking Toast / Banner */}
      {bookingSuccessAlert && (
        <div style={{
          background: "var(--status-good-bg)",
          border: "1.5px solid var(--status-good-border)",
          color: "var(--status-good-text)",
          padding: "14px 20px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-md)",
          animation: "fadeInBackdrop 0.3s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle2 size={24} color="var(--secondary)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                {lang === "hi" ? "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!" : "Appointment Successfully Confirmed!"}
              </div>
              <div style={{ fontSize: "0.82rem", opacity: 0.9 }}>
                {bookingSuccessAlert.doctorName} • {bookingSuccessAlert.date} ({bookingSuccessAlert.time}) • {bookingSuccessAlert.token}
              </div>
            </div>
          </div>
          <button
            onClick={() => setBookingSuccessAlert(null)}
            className="btn btn-secondary"
            style={{ padding: "4px 10px", fontSize: "0.78rem" }}
          >
            {lang === "hi" ? "ठीक है" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Hero Search & Title Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(5, 150, 105, 0.08), var(--bg-card))",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "var(--shadow-sm)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-primary" style={{ fontSize: "0.74rem" }}>
                <ShieldCheck size={13} />
                <span>{lang === "hi" ? "आयुष्मान भारत ABDM सत्यापित" : "ABDM Empanelled Doctors"}</span>
              </span>
              <span className="badge badge-good" style={{ fontSize: "0.74rem" }}>
                {allDoctors.length} {lang === "hi" ? "सक्रिय विशेषज्ञ उपलब्ध" : "Active Specialists Available"}
              </span>
            </div>

            <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-highlight)", margin: "8px 0 4px" }}>
              {lang === "hi" ? "विशेषज्ञ डॉक्टर खोजें व परामर्श लें" : "Find Doctors & Book Consultations"}
            </h1>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0, maxWidth: "680px" }}>
              {lang === "hi"
                ? "सत्यापित डॉक्टर खोजें, रेटिंग्स देखें और आसानी से परामर्श बुक करें।"
                : "Find verified specialists, check ratings, and book appointments easily."}
            </p>
          </div>

          {/* Quick Stat Pill & Doctor Partner Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {onOpenDoctorListing && (
              <button
                type="button"
                onClick={onOpenDoctorListing}
                className="btn btn-secondary"
                style={{
                  padding: "10px 16px",
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  borderRadius: "14px",
                  borderColor: "var(--secondary-border)",
                  color: "var(--secondary)",
                  background: "var(--bg-card)"
                }}
              >
                <BriefcaseMedical size={15} />
                <span>{lang === "hi" ? "डॉक्टर हैं? खुद को लिस्ट करें" : "Doctor? List Your Practice"}</span>
              </button>
            )}

            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              padding: "10px 16px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {lang === "hi" ? "सक्रिय मरीज" : "Active Patient"}
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--primary)" }}>
                  {patient?.name || "Aarish Khan"} ({patient?.bloodGroup || "B+"})
                </div>
              </div>
              <div style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "var(--primary-soft)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Calendar size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Primary Filters */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "hi" ? "डॉक्टर या विशेषता खोजें..." : "Search doctor or specialty..."}
              style={{
                paddingLeft: "42px",
                borderRadius: "12px",
                fontSize: "0.92rem",
                background: "var(--bg-card)"
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By Select */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "auto",
                minWidth: "160px",
                padding: "10px 14px",
                borderRadius: "12px",
                fontSize: "0.86rem",
                fontWeight: 600,
                background: "var(--bg-card)"
              }}
            >
              <option value="rating">{lang === "hi" ? "सर्वश्रेष्ठ रेटिंग (4.9+)" : "Highest Rating"}</option>
              <option value="experience">{lang === "hi" ? "अधिकतम अनुभव (Years)" : "Most Experience"}</option>
              <option value="fee-asc">{lang === "hi" ? "कम परामर्श शुल्क (Fee)" : "Lowest Fee First"}</option>
            </select>
          </div>
        </div>

        {/* Filter Toggle Chips */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
            {lang === "hi" ? "त्वरित फ़िल्टर:" : "Quick Filters:"}
          </span>

          <button
            type="button"
            onClick={() => setFilterTodayOnly(!filterTodayOnly)}
            className={`btn ${filterTodayOnly ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "20px" }}
          >
            <Clock size={13} />
            <span>{lang === "hi" ? "आज उपलब्ध (Available Today)" : "Available Today"}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterVideoOnly(!filterVideoOnly)}
            className={`btn ${filterVideoOnly ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "20px" }}
          >
            <Video size={13} />
            <span>{lang === "hi" ? "ऑनलाइन वीडियो परामर्श" : "Video Consult"}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterFreeOnly(!filterFreeOnly)}
            className={`btn ${filterFreeOnly ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "20px" }}
          >
            <Sparkles size={13} />
            <span>{lang === "hi" ? "मुफ़्त ओपीडी (आयुष्मान)" : "Free Ayushman OPD"}</span>
          </button>
        </div>
      </div>

      {/* Specialties Horizontal Scroll / Pills */}
      <div style={{ maxWidth: "100%", width: "100%", overflow: "hidden" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          scrollbarWidth: "thin"
        }}>
          {doctorSpecialties.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecialty(spec.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 16px",
                  borderRadius: "14px",
                  border: isSelected ? "1.5px solid #10b981" : "1px solid var(--border-color)",
                  background: isSelected ? "linear-gradient(135deg, #10b981, #059669)" : "var(--bg-card)",
                  color: isSelected ? "#ffffff" : "var(--text-main)",
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: isSelected ? "0 4px 14px rgba(16, 185, 129, 0.35)" : "none",
                  transition: "all 0.18s ease"
                }}
              >
                {getSpecialtyIcon(spec.icon)}
                <span>{lang === "hi" ? spec.labelHi : spec.label}</span>
                <span style={{
                  fontSize: "0.72rem",
                  background: isSelected ? "rgba(255, 255, 255, 0.25)" : "var(--bg-elevated)",
                  padding: "1px 6px",
                  borderRadius: "8px",
                  fontWeight: 700
                }}>
                  {spec.id === "all" ? allDoctors.length : allDoctors.filter(d => d.specialtyId === spec.id).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Selection */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-highlight)" }}>
          {lang === "hi"
            ? `${filteredDoctors.length} विशेषज्ञ डॉक्टर उपलब्ध हैं`
            : `Showing ${filteredDoctors.length} specialist doctors`}
        </div>

        {(selectedSpecialty !== "all" || filterTodayOnly || filterFreeOnly || filterVideoOnly || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSpecialty("all");
              setFilterTodayOnly(false);
              setFilterFreeOnly(false);
              setFilterVideoOnly(false);
              setSearchQuery("");
            }}
            className="btn btn-secondary"
            style={{ padding: "4px 10px", fontSize: "0.78rem" }}
          >
            {lang === "hi" ? "सभी फ़िल्टर साफ़ करें" : "Reset All Filters"}
          </button>
        )}
      </div>

      {/* Doctors Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div style={{
          background: "var(--bg-card)",
          border: "1px dashed var(--border-color)",
          borderRadius: "18px",
          padding: "48px 24px",
          textAlign: "center"
        }}>
          <AlertCircle size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-highlight)", margin: 0 }}>
            {lang === "hi" ? "कोई डॉक्टर नहीं मिला" : "No doctors matched your criteria"}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
            {lang === "hi"
              ? "कृपया खोज शब्द बदलें या अन्य विशेषता (Specialty) चुनें।"
              : "Try adjusting your search query or selecting a different specialty category."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSpecialty("all");
              setFilterTodayOnly(false);
              setFilterFreeOnly(false);
              setFilterVideoOnly(false);
              setSearchQuery("");
            }}
            className="btn btn-primary"
            style={{ marginTop: "14px" }}
          >
            {lang === "hi" ? "सभी डॉक्टर देखें" : "View All Doctors"}
          </button>
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map((doc) => {
            return (
              <div
                key={doc.id}
                className="interactive-card"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "20px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-sm)",
                  position: "relative",
                  transition: "all 0.22s ease"
                }}
              >
                {/* Card Top: Avatar + Status + Basic Info */}
                <div>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {/* Avatar with Live Availability indicator */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "2px solid var(--border-color)",
                        background: "var(--bg-elevated)",
                        boxShadow: "var(--shadow-sm)"
                      }}>
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      {doc.availableToday && (
                        <span
                          title={lang === "hi" ? "आज उपलब्ध" : "Available Today"}
                          style={{
                            position: "absolute",
                            bottom: "-2px",
                            right: "-2px",
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            background: "#10b981",
                            border: "2.5px solid var(--bg-card)",
                            boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)"
                          }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <h3 style={{
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          color: "var(--text-highlight)",
                          margin: 0,
                          lineHeight: 1.25,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {lang === "hi" ? doc.nameHi : doc.name}
                        </h3>
                        {doc.isNewlyRegistered ? (
                          <span className="badge badge-primary" style={{ fontSize: "0.68rem", padding: "1px 6px", flexShrink: 0 }}>
                            <Sparkles size={12} />
                            <span>{lang === "hi" ? "नया पार्टनर" : "New Partner"}</span>
                          </span>
                        ) : (
                          <span className="badge badge-good" style={{ fontSize: "0.68rem", padding: "1px 6px", flexShrink: 0 }}>
                            <ShieldCheck size={12} />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "var(--primary-soft)",
                        color: "var(--primary)",
                        border: "1px solid var(--primary-border)",
                        borderRadius: "8px",
                        padding: "2px 8px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        marginTop: "5px"
                      }}>
                        <span>{lang === "hi" ? doc.specialtyHi : doc.specialty}</span>
                      </div>

                      <div style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                        lineHeight: 1.35,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {doc.qualifications}
                      </div>

                      {/* Rating & Experience */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          background: "rgba(234, 179, 8, 0.12)",
                          color: "#ca8a04",
                          padding: "2px 7px",
                          borderRadius: "6px",
                          fontWeight: 800,
                          fontSize: "0.78rem"
                        }}>
                          <Star size={12} fill="#ca8a04" color="#ca8a04" />
                          <span>{doc.rating}</span>
                          <span style={{ opacity: 0.85, fontSize: "0.7rem" }}>({doc.reviewsCount})</span>
                        </div>

                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "var(--bg-elevated)",
                          color: "var(--text-main)",
                          border: "1px solid var(--border-color)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600
                        }}>
                          <Award size={12} color="var(--primary)" />
                          <span>{doc.experience} {lang === "hi" ? "वर्ष अनुभव" : "Yrs Exp."}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinic & Location Details */}
                  <div style={{
                    marginTop: "14px",
                    padding: "12px 14px",
                    background: "var(--bg-elevated)",
                    borderRadius: "14px",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-highlight)", display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: 0 }}>
                        <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lang === "hi" ? doc.clinicHi : doc.clinic}
                        </span>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: "0.68rem", padding: "1px 6px", flexShrink: 0 }}>
                        {doc.distance}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", paddingLeft: "20px" }}>
                      {lang === "hi" ? doc.locationHi : doc.location}
                    </div>
                  </div>

                  {/* Next Available Slot */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                    fontSize: "0.78rem",
                    flexWrap: "wrap",
                    gap: "6px"
                  }}>
                    <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <Clock size={13} color="var(--secondary)" />
                      <span>{lang === "hi" ? "स्लॉट:" : "Next Slot:"} <strong style={{ color: "var(--text-highlight)" }}>{doc.nextSlot}</strong></span>
                    </span>

                    {doc.videoConsult && (
                      <span style={{
                        color: "var(--primary)",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "var(--primary-soft)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "0.72rem"
                      }}>
                        <Video size={12} />
                        <span>{lang === "hi" ? "वीडियो कॉल" : "Video Consult"}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Fee + Action Buttons */}
                <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        {lang === "hi" ? "परामर्श शुल्क" : "Consultation Fee"}
                      </div>
                      <div style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: doc.isFreeOpd ? "var(--secondary)" : "var(--text-highlight)",
                        marginTop: "1px"
                      }}>
                        {doc.isFreeOpd ? (
                          <span style={{ color: "var(--secondary)" }}>{lang === "hi" ? "मुफ़्त (आयुष्मान)" : "FREE OPD"}</span>
                        ) : (
                          <span>₹{doc.fee}</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Call & WhatsApp Icons with clean labels */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={`tel:${doc.contactNumber}`}
                        className="btn btn-secondary"
                        style={{
                          padding: "7px 11px",
                          borderRadius: "10px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "0.78rem",
                          textDecoration: "none"
                        }}
                        title={lang === "hi" ? "कॉल करें: " + doc.contactNumber : "Direct Call: " + doc.contactNumber}
                      >
                        <Phone size={13} color="var(--primary)" />
                        <span>{lang === "hi" ? "कॉल" : "Call"}</span>
                      </a>
                      <a
                        href={`https://wa.me/${doc.whatsappNumber}?text=${encodeURIComponent(`Hello ${doc.name}, inquiring from PulseAI.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{
                          padding: "7px 11px",
                          borderRadius: "10px",
                          color: "#16a34a",
                          borderColor: "rgba(22, 163, 74, 0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "0.78rem",
                          textDecoration: "none"
                        }}
                        title="WhatsApp Consult"
                      >
                        <MessageCircle size={13} color="#16a34a" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Booking & Details Trigger Buttons */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => handleOpenDoctor(doc)}
                      className="btn btn-secondary"
                      style={{
                        flex: 1,
                        padding: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        borderRadius: "12px",
                        justifyContent: "center"
                      }}
                    >
                      <span>{lang === "hi" ? "प्रोफ़ाइल देखें" : "View Profile"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDoctor(doc)}
                      className="btn btn-primary"
                      style={{
                        flex: 1.25,
                        padding: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        borderRadius: "12px",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <Calendar size={14} />
                      <span>{lang === "hi" ? "स्लॉट बुक करें" : "Book Slot"}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Doctor Detail & Appointment Modal */}
      <DoctorDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        patient={patient}
        lang={lang}
        onBookAppointment={handleAppointmentBooked}
      />
    </div>
  );
}
