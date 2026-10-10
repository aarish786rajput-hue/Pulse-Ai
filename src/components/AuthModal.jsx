import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  BriefcaseMedical,
  Users,
  MapPin,
  Phone,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Trash2,
  ArrowRight,
  Building2
} from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
  patients = [],
  currentPatient,
  onLogin,
  onNavigate,
  lang = "en"
}) {
  const [activeTab, setActiveTab] = useState("demo"); // 'demo' | 'doctor-partner'
  const [successMsg, setSuccessMsg] = useState("");

  // Doctor Partner Listing Form State
  const [docName, setDocName] = useState("");
  const [specialty, setSpecialty] = useState("dentist");
  const [qualifications, setQualifications] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [experience, setExperience] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [cityAddress, setCityAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [fee, setFee] = useState("600");
  const [isFreeOpd, setIsFreeOpd] = useState(false);
  const [services, setServices] = useState("");
  const [videoConsult, setVideoConsult] = useState(true);
  const [createdDoctor, setCreatedDoctor] = useState(null);

  // Photo management state (Camera / Gallery / Delete)
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync camera stream to video element when active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn("Video play error:", e));
    }
  }, [isCameraActive]);

  if (!isOpen) return null;

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleModalClose = () => {
    stopCamera();
    onClose();
  };

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" } 
        });
        streamRef.current = stream;
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn("Video play error:", e));
        }
      } else {
        cameraInputRef.current?.click();
      }
    } catch (err) {
      console.warn("Camera access failed, falling back to camera input:", err);
      cameraInputRef.current?.click();
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPhotoPreview(dataUrl);
      stopCamera();
    }
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setPhotoPreview(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleResetDoctorForm = () => {
    setCreatedDoctor(null);
    setDocName("");
    setClinicName("");
    setCityAddress("");
    setContactPhone("");
    setQualifications("");
    setRegistrationNo("");
    setExperience("");
    setFee("600");
    setIsFreeOpd(false);
    setServices("");
    handleDeletePhoto();
  };

  const handleDemoSelect = (patientId) => {
    setSuccessMsg(lang === "hi" ? "प्रोफ़ाइल सफलतापूर्वक स्विच की गई!" : "Profile Switched Successfully!");
    setTimeout(() => {
      setSuccessMsg("");
      if (onLogin) onLogin(patientId);
    }, 450);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    if (!docName || !clinicName || !contactPhone) return;

    const formattedName = docName.trim().startsWith("Dr.") ? docName.trim() : `Dr. ${docName.trim()}`;
    const formattedNameHi = docName.trim().startsWith("डॉ.") ? docName.trim() : `डॉ. ${docName.trim().replace(/^Dr\.\s*/, '')}`;

    const specialtyLabels = {
      dentist: { en: "Dentist & Oral Surgeon", hi: "दंत चिकित्सक व ओरल सर्जन" },
      dermatologist: { en: "Dermatologist & Cosmetologist", hi: "त्वचा व सौंदर्य विशेषज्ञ" },
      ophthalmologist: { en: "Ophthalmologist & Eye Surgeon", hi: "नेत्र रोग विशेषज्ञ व आई सर्जन" },
      cardiologist: { en: "Cardiologist & Heart Specialist", hi: "हृदय रोग विशेषज्ञ" },
      physician: { en: "General Physician", hi: "सामान्य चिकित्सक" },
      pediatrician: { en: "Pediatrician & Child Health", hi: "बाल रोग व शिशु विशेषज्ञ" },
      orthopedic: { en: "Orthopedic & Joint Surgeon", hi: "हड्डी रोग विशेषज्ञ" },
      ent: { en: "ENT Specialist", hi: "कान-नाक-गला विशेषज्ञ" },
      gynecologist: { en: "Gynecologist & Obstetrician", hi: "स्त्री रोग विशेषज्ञ" },
      neurologist: { en: "Neurologist & Neuro Specialist", hi: "न्यूरोलॉजिस्ट" },
      psychiatrist: { en: "Psychiatrist & Mental Wellness", hi: "मनोचिकित्सक" }
    };

    const specMeta = specialtyLabels[specialty] || { en: "Medical Specialist", hi: "विशेषज्ञ चिकित्सक" };

    const parsedServices = services.trim()
      ? services.split(",").map(s => s.trim()).filter(Boolean)
      : ["Specialized OPD Consultation", "Diagnosis & Clinical Workup", "Prescription & Follow-up"];

    const newDoctor = {
      id: `partner-doc-${Date.now()}`,
      name: formattedName,
      nameHi: formattedNameHi,
      specialtyId: specialty,
      specialty: specMeta.en,
      specialtyHi: specMeta.hi,
      qualifications: qualifications.trim() || "MBBS, Medical Specialist",
      experience: parseInt(experience, 10) || 8,
      rating: 5.0,
      reviewsCount: 1,
      clinic: clinicName.trim(),
      clinicHi: clinicName.trim(),
      hospital: clinicName.trim(),
      location: cityAddress.trim() || "City Center",
      locationHi: cityAddress.trim() || "सिटी सेंटर",
      address: cityAddress.trim() || "Clinic Address",
      distance: "1.2 km away",
      contactNumber: contactPhone.trim(),
      whatsappNumber: contactPhone.replace(/\D/g, "") || "919876543210",
      email: `partner@${clinicName.toLowerCase().replace(/\s+/g, '') || 'clinic'}.health`,
      fee: isFreeOpd ? 0 : (parseInt(fee, 10) || 500),
      isFreeOpd: isFreeOpd,
      videoConsult: videoConsult,
      availableToday: true,
      nextSlot: "Today, 04:30 PM",
      registrationNo: registrationNo.trim() || "MCI-ABDM-VERIFIED",
      languages: ["English", "Hindi"],
      about: `${formattedName} is a verified healthcare partner on PulseAI Network providing expert clinical care at ${clinicName}.`,
      aboutHi: `${formattedNameHi} पल्स-एआई नेटवर्क पर सत्यापित डॉक्टर पार्टनर हैं जो ${clinicName} में विशेषज्ञ सेवाएं प्रदान करते हैं।`,
      services: parsedServices,
      servicesHi: parsedServices,
      education: [qualifications.trim() || "MBBS"],
      timings: "Mon - Sat: 10:00 AM - 07:00 PM",
      avatar: photoPreview || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=350&auto=format&fit=crop&q=80",
      isNewlyRegistered: true,
      patientStories: [
        { name: "Verified Patient", rating: 5, date: "Today", comment: "Newly verified practitioner on PulseAI Doctor Network." }
      ]
    };

    // Save to localStorage so DoctorsDashboard immediately displays it
    try {
      const existing = JSON.parse(localStorage.getItem("pulseai_custom_doctors") || "[]");
      const updated = [newDoctor, ...existing];
      localStorage.setItem("pulseai_custom_doctors", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("pulseai_doctor_added", { detail: newDoctor }));
    } catch (err) {
      console.error("Error saving doctor partner:", err);
    }

    setCreatedDoctor(newDoctor);
  };

  const handleGoToDirectory = () => {
    handleModalClose();
    if (onNavigate) {
      onNavigate("doctors");
    }
  };

  return (
    <div className="modal-overlay" onClick={handleModalClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "620px", padding: "0", overflow: "hidden", borderRadius: "24px" }}
      >
        {/* Header */}
        <div style={{
          padding: "22px 26px",
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(5, 150, 105, 0.1), var(--bg-card))",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff"
            }}>
              {activeTab === "demo" ? <Users size={22} /> : <BriefcaseMedical size={22} />}
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "हेल्थ अकाउंट व डॉक्टर पार्टनर पोर्टल" : "Patient Access & Doctor Partner Portal"}
              </h2>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {activeTab === "demo" 
                  ? (lang === "hi" ? "सक्रिय मरीज प्रोफ़ाइल स्विच करें (1-क्लिक)" : "Switch active patient profile (1-Click)")
                  : (lang === "hi" ? "पल्स-एआई नेटवर्क पर अपनी प्रैक्टिस लिस्ट करें" : "List your clinic & practice on PulseAI Network")
                }
              </div>
            </div>
          </div>

          <button onClick={handleModalClose} className="btn btn-secondary" style={{ padding: "6px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", background: "var(--bg-elevated)" }}>
          <button
            type="button"
            onClick={() => { setActiveTab("demo"); setCreatedDoctor(null); stopCamera(); }}
            style={{
              flex: 1,
              padding: "13px",
              background: activeTab === "demo" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "demo" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "demo" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Users size={16} />
            <span>{lang === "hi" ? "मरीज़ प्रोफ़ाइल स्विच" : "1-Click Profile Switch"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("doctor-partner")}
            style={{
              flex: 1.2,
              padding: "13px",
              background: activeTab === "doctor-partner" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "doctor-partner" ? "2.5px solid var(--secondary)" : "none",
              color: activeTab === "doctor-partner" ? "var(--secondary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <BriefcaseMedical size={16} color="var(--secondary)" />
            <span>{lang === "hi" ? "डॉक्टर पार्टनर (खुद को लिस्ट करें)" : "Doctor Partner (List Practice)"}</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", maxHeight: "72vh", overflowY: "auto" }}>
          {successMsg && (
            <div style={{
              background: "var(--status-good-bg)",
              border: "1px solid var(--status-good-border)",
              color: "var(--status-good-text)",
              padding: "12px 16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              fontWeight: 700,
              fontSize: "0.9rem"
            }}>
              <CheckCircle2 size={18} color="var(--secondary)" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "demo" ? (
            /* Tab 1: Patient Profiles */
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                {lang === "hi" ? "लॉगिन या स्विच करने के लिए सक्रिय मरीज चुनें:" : "Select an active patient profile to login:"}
              </div>

              {patients.map((p) => {
                const isSelected = p.id === currentPatient?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleDemoSelect(p.id)}
                    className="interactive-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: isSelected ? "var(--primary-soft)" : "var(--bg-elevated)",
                      border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        overflow: "hidden"
                      }}>
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          p.name.split(" ").map(n => n[0]).join("")
                        )}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-highlight)" }}>
                            {p.name}
                          </span>
                          <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                            {p.bloodGroup}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          ABHA ID: <strong style={{ color: "var(--primary)" }}>{p.abhaId || "91-4521-8842-1982"}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
                      style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                    >
                      {isSelected ? (lang === "hi" ? "सक्रिय (Active)" : "Active") : (lang === "hi" ? "लॉगिन करें" : "Select")}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : createdDoctor ? (
            /* Doctor Partner Success Confirmation Screen */
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
                margin: "0 auto 12px",
                color: "var(--status-good-text)"
              }}>
                <CheckCircle2 size={30} />
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--status-good-text)", margin: 0 }}>
                {lang === "hi" ? "बधाई! आपकी डॉक्टर प्रोफ़ाइल लाइव हो गई है!" : "Congratulations! Your Practice is Live!"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                {lang === "hi"
                  ? `${createdDoctor.nameHi} अब PulseAI नेटवर्क पर सक्रिय हैं। मरीज सीधे आपकी क्लीनिक पर अपॉइंटमेंट बुक कर सकते हैं।`
                  : `${createdDoctor.name} has been verified & listed on PulseAI Doctor Network. Patients can now discover and book slots with you.`
                }
              </p>

              {/* Preview Card */}
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "left",
                margin: "18px 0",
                display: "flex",
                gap: "14px",
                alignItems: "center"
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  flexShrink: 0,
                  overflow: "hidden",
                  border: "2px solid var(--border-color)"
                }}>
                  {createdDoctor.avatar ? (
                    <img src={createdDoctor.avatar} alt={createdDoctor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    "👨‍⚕️"
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-highlight)" }}>{createdDoctor.name}</span>
                    <span className="badge badge-good" style={{ fontSize: "0.68rem" }}>Verified</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700 }}>{createdDoctor.specialty}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{createdDoctor.clinic} • {createdDoctor.location}</div>
                  <div style={{ fontSize: "0.78rem", color: createdDoctor.isFreeOpd ? "var(--secondary)" : "var(--primary)", fontWeight: 800, marginTop: "2px" }}>
                    {createdDoctor.isFreeOpd ? "FREE OPD" : `Fee: ₹${createdDoctor.fee}`}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={handleResetDoctorForm}
                  className="btn btn-secondary"
                  style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                >
                  {lang === "hi" ? "अन्य डॉक्टर जोड़ें" : "List Another"}
                </button>

                <button
                  type="button"
                  onClick={handleGoToDirectory}
                  className="btn btn-primary"
                  style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                >
                  <span>{lang === "hi" ? "डायरेक्टरी में देखें" : "View in Doctors Directory"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Doctor Partner Registration Form */
            <form onSubmit={handleDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Partner Banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(2, 132, 199, 0.08))",
                border: "1px solid var(--secondary-border)",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--secondary-soft)",
                  color: "var(--secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-highlight)" }}>
                    {lang === "hi" ? "डॉक्टर पार्टनर नेटवर्क रजिस्ट्रेशन" : "Join PulseAI Doctor Partner Network"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {lang === "hi" 
                      ? "अपनी क्लीनिक व अस्पताल को लिस्ट करें, ऑनलाइन अपॉइंटमेंट स्वीकार करें और मरीजों से सीधे जुड़ें।"
                      : "Empanel your practice, accept instant patient appointments & display transparent fees."
                    }
                  </div>
                </div>
              </div>

              {/* ── Doctor Profile Photo (Camera / Gallery / Delete) ── */}
              <div style={{
                background: "var(--bg-elevated)",
                border: "1px dashed var(--border-color)",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-highlight)", margin: 0 }}>
                    {lang === "hi" ? "डॉक्टर प्रोफ़ाइल फोटो (Camera / Gallery / Delete):" : "Doctor Profile Photo (Camera / Gallery / Delete):"}
                  </label>
                  {photoPreview && (
                    <span className="badge badge-good" style={{ fontSize: "0.72rem", padding: "1px 6px" }}>
                      ✓ {lang === "hi" ? "फोटो संलग्न" : "Photo Attached"}
                    </span>
                  )}
                </div>

                {/* Live Camera View when Active */}
                {isCameraActive ? (
                  <div style={{
                    background: "#0f172a",
                    borderRadius: "14px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "14px",
                    gap: "12px"
                  }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "220px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "2px solid rgba(255, 255, 255, 0.2)"
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="btn btn-primary"
                        style={{ padding: "8px 18px", fontSize: "0.84rem", fontWeight: 700 }}
                      >
                        <Camera size={15} />
                        <span>{lang === "hi" ? "फोटो खींचें (Capture)" : "Capture Photo"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="btn btn-secondary"
                        style={{ padding: "8px 14px", fontSize: "0.84rem" }}
                      >
                        <X size={15} />
                        <span>{lang === "hi" ? "कैमरा बंद करें" : "Cancel Camera"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    {/* Avatar Preview Box */}
                    <div style={{ position: "relative" }}>
                      <div style={{
                        width: "76px",
                        height: "76px",
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "2px solid var(--border-color)",
                        background: "var(--bg-card)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-sm)"
                      }}>
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Doctor Upload"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "1.8rem"
                          }}>
                            👨‍⚕️
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Camera, Gallery & Delete */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "220px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {/* 1. Camera Option */}
                        <button
                          type="button"
                          onClick={startCamera}
                          className="btn btn-secondary"
                          style={{
                            padding: "7px 12px",
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            fontWeight: 700
                          }}
                        >
                          <Camera size={14} color="var(--primary)" />
                          <span>{lang === "hi" ? "कैमरा" : "Camera"}</span>
                        </button>

                        {/* 2. Gallery Option */}
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="btn btn-secondary"
                          style={{
                            padding: "7px 12px",
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            fontWeight: 700
                          }}
                        >
                          <ImageIcon size={14} color="var(--secondary)" />
                          <span>{lang === "hi" ? "गैलरी" : "Gallery"}</span>
                        </button>

                        {/* 3. Delete Option */}
                        {photoPreview && (
                          <button
                            type="button"
                            onClick={handleDeletePhoto}
                            className="btn btn-secondary"
                            style={{
                              padding: "7px 12px",
                              fontSize: "0.8rem",
                              borderRadius: "10px",
                              fontWeight: 700,
                              color: "#ef4444",
                              borderColor: "rgba(239, 68, 68, 0.3)"
                            }}
                            title={lang === "hi" ? "फोटो हटाएं" : "Delete Photo"}
                          >
                            <Trash2 size={14} color="#ef4444" />
                            <span>{lang === "hi" ? "हटाएं" : "Delete"}</span>
                          </button>
                        )}
                      </div>

                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                        {lang === "hi"
                          ? "लाइव कैमरे से तत्काल फोटो लें अथवा फोन/कंप्यूटर गैलरी से अपलोड करें।"
                          : "Take instant live photo or upload from device gallery."
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden File Inputs for Gallery & Camera Fallback */}
                <input
                  type="file"
                  ref={galleryInputRef}
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  style={{ display: "none" }}
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="user"
                  onChange={handleGalleryUpload}
                  style={{ display: "none" }}
                />
              </div>

              {/* Row 1: Doctor Name & Specialty */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "डॉक्टर का पूरा नाम *" : "Doctor Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                    style={{ padding: "9px 12px", fontSize: "0.88rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "चिकित्सा विभाग / स्पेशलिटी *" : "Specialty *"}
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    style={{ padding: "9px 12px", fontSize: "0.88rem" }}
                  >
                    <option value="dentist">{lang === "hi" ? "दंत चिकित्सक (Dentist)" : "Dentist"}</option>
                    <option value="dermatologist">{lang === "hi" ? "त्वचा विशेषज्ञ (Dermatologist)" : "Dermatologist"}</option>
                    <option value="ophthalmologist">{lang === "hi" ? "नेत्र विशेषज्ञ (Ophthalmologist)" : "Ophthalmologist"}</option>
                    <option value="cardiologist">{lang === "hi" ? "हृदय विशेषज्ञ (Cardiologist)" : "Cardiologist"}</option>
                    <option value="physician">{lang === "hi" ? "सामान्य चिकित्सक (General Physician)" : "General Physician"}</option>
                    <option value="pediatrician">{lang === "hi" ? "बाल रोग विशेषज्ञ (Pediatrician)" : "Pediatrician"}</option>
                    <option value="orthopedic">{lang === "hi" ? "हड्डी रोग विशेषज्ञ (Orthopedic)" : "Orthopedic Surgeon"}</option>
                    <option value="ent">{lang === "hi" ? "कान-नाक-गला (ENT)" : "ENT Specialist"}</option>
                    <option value="gynecologist">{lang === "hi" ? "स्त्री रोग विशेषज्ञ (Gynecologist)" : "Gynecologist"}</option>
                    <option value="neurologist">{lang === "hi" ? "न्यूरोलॉजिस्ट (Neurologist)" : "Neurologist"}</option>
                    <option value="psychiatrist">{lang === "hi" ? "मनोचिकित्सक (Psychiatrist)" : "Psychiatrist"}</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Qualifications & Council Reg No */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "डिग्रियां व योग्यता" : "Degrees & Qualifications"}
                  </label>
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="MBBS, MD / BDS, MDS"
                    style={{ padding: "9px 12px", fontSize: "0.88rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "काउंसिल रजिस्ट्रेशन संख्या" : "Medical Council Reg. No."}
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="MCI/DMC/2018/98412"
                    style={{ padding: "9px 12px", fontSize: "0.88rem" }}
                  />
                </div>
              </div>

              {/* Row 3: Clinic Name & Experience */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "क्लीनिक / अस्पताल का नाम *" : "Clinic / Hospital Name *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Building2 size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Apex Dental Care / City Hospital"
                      style={{ paddingLeft: "32px", fontSize: "0.88rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "अनुभव (वर्ष)" : "Experience (Yrs)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="12"
                    style={{ padding: "9px 12px", fontSize: "0.88rem" }}
                  />
                </div>
              </div>

              {/* Row 4: Address / Location & Contact Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "स्थान / क्लीनिक पता *" : "City & Clinic Address *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      required
                      value={cityAddress}
                      onChange={(e) => setCityAddress(e.target.value)}
                      placeholder="Indiranagar, Bengaluru"
                      style={{ paddingLeft: "32px", fontSize: "0.88rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "संपर्क / व्हाट्सएप नंबर *" : "Phone / WhatsApp *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{ paddingLeft: "32px", fontSize: "0.88rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Consultation Fee & Ayushman Free Checkbox */}
              <div style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    {lang === "hi" ? "परामर्श शुल्क (₹)" : "Consultation Fee (₹)"}
                  </label>
                  <input
                    type="number"
                    disabled={isFreeOpd}
                    value={isFreeOpd ? "0" : fee}
                    onChange={(e) => setFee(e.target.value)}
                    placeholder="600"
                    style={{ padding: "7px 10px", fontSize: "0.88rem", maxWidth: "160px" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={isFreeOpd}
                      onChange={(e) => setIsFreeOpd(e.target.checked)}
                      style={{ width: "auto" }}
                    />
                    <span>{lang === "hi" ? "मुफ़्त आयुष्मान ओपीडी (Free OPD)" : "Free Ayushman OPD"}</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={videoConsult}
                      onChange={(e) => setVideoConsult(e.target.checked)}
                      style={{ width: "auto" }}
                    />
                    <span>{lang === "hi" ? "ऑनलाइन वीडियो परामर्श उपलब्ध" : "Online Video Consult Available"}</span>
                  </label>
                </div>
              </div>

              {/* Row 6: Key Services Tags */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  {lang === "hi" ? "प्रमुख सेवाएं व उपचार (कॉमा से अलग करें)" : "Key Services / Treatments (Comma separated)"}
                </label>
                <input
                  type="text"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="Root canal, Teeth whitening, Dental implants"
                  style={{ padding: "9px 12px", fontSize: "0.88rem" }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                <button type="button" onClick={handleModalClose} className="btn btn-secondary">
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: "10px 22px",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, var(--secondary), #047857)"
                  }}
                >
                  <BriefcaseMedical size={16} />
                  <span>{lang === "hi" ? "डॉक्टर प्रोफ़ाइल लिस्ट करें" : "List My Practice on PulseAI"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
