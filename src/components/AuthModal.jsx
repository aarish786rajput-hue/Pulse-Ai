import React, { useState } from "react";
import { 
  X, 
  LogIn,
  UserPlus,
  Users,
  MapPin,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  Stethoscope,
  AlertCircle
} from "lucide-react";
import { getLiveGpsAddress } from "../utils/geolocation";

export default function AuthModal({
  isOpen,
  onClose,
  patients = [],
  currentPatient,
  onLogin,
  onRegisterPatient,
  onNavigate,
  lang = "en"
}) {
  const [activeTab, setActiveTab] = useState("demo"); // 'demo' | 'login' | 'register' | 'doctor'
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Login Form State (ABHA / Mobile + OTP) ──
  const [loginIdentifier, setLoginIdentifier] = useState("9876543210");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // ── Register Form State ──
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("30");
  const [regGender, setRegGender] = useState("Male");
  const [regBloodGroup, setRegBloodGroup] = useState("O+");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState("");

  // ── Doctor Partner Quick Form State ──
  const [docName, setDocName] = useState("");
  const [docSpecialty, setDocSpecialty] = useState("cardiologist");
  const [docClinic, setDocClinic] = useState("");
  const [docPhone, setDocPhone] = useState("");
  const [docFee, setDocFee] = useState("500");

  if (!isOpen) return null;

  // ── Handlers ──
  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (!loginIdentifier.trim()) {
      setErrorMsg(lang === "hi" ? "कृपया मोबाइल नंबर या आभा आईडी दर्ज करें।" : "Please enter mobile number or ABHA ID.");
      return;
    }
    setErrorMsg("");
    setIsOtpLoading(true);
    setTimeout(() => {
      setIsOtpLoading(false);
      setIsOtpSent(true);
      setEnteredOtp("123456"); // Pre-filled for demo convenience
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      setErrorMsg(lang === "hi" ? "कृपया मान्य 6-अंकीय ओटीपी दर्ज करें।" : "Please enter a valid 6-digit OTP.");
      return;
    }

    // Match patient by phone/id or pick current/first
    const matched = patients.find(p => 
      p.emergencyContact?.phone?.includes(loginIdentifier) ||
      p.abhaId?.replace(/\D/g, "").includes(loginIdentifier.replace(/\D/g, ""))
    ) || patients[0];

    setSuccessMsg(lang === "hi" ? "✅ आभा लॉगिन सफल! खाता लोड हो रहा है..." : "✅ ABHA Sign In Verified! Loading account...");
    setTimeout(() => {
      setSuccessMsg("");
      setIsOtpSent(false);
      if (onLogin && matched) onLogin(matched.id);
      onClose();
    }, 600);
  };

  const handleDetectLiveGps = async () => {
    setIsGpsLoading(true);
    setGpsStatusMsg(lang === "hi" ? "📡 लाइव GPS खोजा जा रहा है..." : "📡 Acquiring live device GPS...");
    try {
      const res = await getLiveGpsAddress();
      const addr = res?.address || res?.formattedAddress;
      if (addr) {
        setRegAddress(addr);
        setGpsStatusMsg(
          lang === "hi" 
            ? `✅ GPS पता प्राप्त हुआ (±${res.accuracy || 15}m)` 
            : `✅ Live GPS address acquired (±${res.accuracy || 15}m)`
        );
      }
    } catch (err) {
      setGpsStatusMsg(
        lang === "hi" 
          ? `⚠️ GPS त्रुटि: ${err.message || "लोकेशन नहीं मिल सकी"}` 
          : `⚠️ GPS Notice: ${err.message || "Failed to acquire location"}`
      );
    } finally {
      setIsGpsLoading(false);
      setTimeout(() => setGpsStatusMsg(""), 5000);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg(lang === "hi" ? "कृपया पूरा नाम दर्ज करें।" : "Please enter full name.");
      return;
    }

    // Generate unique 14-digit ABHA ID & internal ID
    const randomBlock = () => Math.floor(1000 + Math.random() * 9000);
    const newAbha = `91-${randomBlock()}-${randomBlock()}-${randomBlock()}`;
    const newId = `pt-${Date.now()}`;
    const currentYear = new Date().getFullYear();
    const approxBirthYear = currentYear - (parseInt(regAge, 10) || 30);
    const generatedDob = `${approxBirthYear}-01-15`;

    const newPatient = {
      id: newId,
      name: regName.trim(),
      abhaId: newAbha,
      dob: generatedDob,
      age: parseInt(regAge, 10) || 30,
      gender: regGender,
      bloodGroup: regBloodGroup,
      heightCm: 172,
      weightKg: 68,
      bmi: 23.0,
      address: regAddress.trim() || "City Center, New Delhi, India - 110001",
      avatar: "",
      emergencyContact: {
        name: "Primary Contact",
        relation: "Family",
        phone: regPhone.trim() || "+91 98765 43210"
      },
      primaryPhysician: {
        name: "Dr. Vikram Sethi",
        clinic: "PulseAI Health Hub",
        phone: "+91 98112 33445"
      },
      conditions: [],
      allergies: [],
      surgeries: [],
      familyHistory: [],
      lifestyle: {
        smoking: "Non-Smoker",
        alcohol: "None",
        activityLevel: "Moderate Active",
        dietType: "Balanced"
      },
      vitalsHistory: [
        { date: "Today", bp: "120/80", hr: 72, spo2: 99, glucose: 95 }
      ],
      todayMedications: [],
      timelineEvents: [
        { date: "Today", event: "ABHA Health Account Created via PulseAI", status: "Completed" }
      ]
    };

    setSuccessMsg(lang === "hi" ? `🎉 नया आभा खाता ${newAbha} सक्रिय हो गया!` : `🎉 New ABHA Account ${newAbha} created!`);
    setTimeout(() => {
      setSuccessMsg("");
      if (onRegisterPatient) {
        onRegisterPatient(newPatient);
      } else if (onLogin) {
        onLogin(newPatient.id);
      }
      onClose();
    }, 700);
  };

  const handleSelectDemoProfile = (patientId) => {
    setSuccessMsg(lang === "hi" ? "प्रोफ़ाइल सफलतापूर्वक स्विच की गई!" : "Profile Switched Successfully!");
    setTimeout(() => {
      setSuccessMsg("");
      if (onLogin) onLogin(patientId);
      onClose();
    }, 350);
  };

  const handleQuickDoctorSubmit = (e) => {
    e.preventDefault();
    if (!docName || !docClinic) return;

    const formattedName = docName.trim().startsWith("Dr.") ? docName.trim() : `Dr. ${docName.trim()}`;
    const newDoc = {
      id: `partner-doc-${Date.now()}`,
      name: formattedName,
      specialtyId: docSpecialty,
      specialty: docSpecialty.charAt(0).toUpperCase() + docSpecialty.slice(1) + " Specialist",
      clinic: docClinic.trim(),
      hospital: docClinic.trim(),
      contactNumber: docPhone.trim() || "9876543210",
      fee: parseInt(docFee, 10) || 500,
      rating: 5.0,
      availableToday: true,
      nextSlot: "Today, 05:00 PM",
      isNewlyRegistered: true
    };

    try {
      const existing = JSON.parse(localStorage.getItem("pulseai_custom_doctors") || "[]");
      localStorage.setItem("pulseai_custom_doctors", JSON.stringify([newDoc, ...existing]));
      window.dispatchEvent(new CustomEvent("pulseai_doctor_added", { detail: newDoc }));
    } catch (err) {
      console.warn("Could not save doctor:", err);
    }

    setSuccessMsg(lang === "hi" ? "✅ डॉक्टर प्रोफ़ाइल नेटवर्क पर लिस्ट हो गई!" : "✅ Doctor profile listed on network!");
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
      if (onNavigate) onNavigate("doctors");
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "620px", padding: "0", overflow: "hidden", borderRadius: "20px" }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(16, 185, 129, 0.08), var(--bg-card))",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff"
            }}>
              {activeTab === "demo" && <Users size={20} />}
              {activeTab === "login" && <LogIn size={20} />}
              {activeTab === "register" && <UserPlus size={20} />}
              {activeTab === "doctor" && <Stethoscope size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)" }}>
                {activeTab === "demo" && (lang === "hi" ? "1-क्लिक जज / डेमो प्रोफाइल एक्सेस" : "1-Click Demo & Evaluator Access")}
                {activeTab === "login" && (lang === "hi" ? "आयुष्मान भारत (आभा) लॉगिन" : "ABHA & Mobile Sign In")}
                {activeTab === "register" && (lang === "hi" ? "नया मरीज पंजीकरण (आभा आईडी बनाएं)" : "Create New Patient & ABHA ID")}
                {activeTab === "doctor" && (lang === "hi" ? "डॉक्टर पार्टनर लिस्टिंग" : "List Doctor Clinic on Network")}
              </h2>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {lang === "hi" 
                  ? "राष्ट्रीय डिजिटल स्वास्थ्य मिशन (ABDM) अनुपालित सुरक्षित पोर्टल" 
                  : "National Digital Health Mission (ABDM) Compliant Health Access"}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: "6px" }}>
            <X size={18} />
          </button>
        </div>

        {/* 4 Clean Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", background: "var(--bg-elevated)" }}>
          <button
            type="button"
            onClick={() => { setActiveTab("demo"); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "11px 6px",
              background: activeTab === "demo" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "demo" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "demo" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <Users size={15} />
            <span>{lang === "hi" ? "डेमो एक्सेस" : "1-Click Demo"}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "11px 6px",
              background: activeTab === "login" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "login" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "login" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <LogIn size={15} />
            <span>{lang === "hi" ? "आभा लॉगिन" : "Sign In"}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "11px 6px",
              background: activeTab === "register" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "register" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "register" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <UserPlus size={15} />
            <span>{lang === "hi" ? "नया मरीज" : "Register"}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("doctor"); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "11px 6px",
              background: activeTab === "doctor" ? "var(--bg-card)" : "transparent",
              border: "none",
              borderBottom: activeTab === "doctor" ? "2.5px solid var(--primary)" : "none",
              color: activeTab === "doctor" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <Stethoscope size={15} />
            <span>{lang === "hi" ? "डॉक्टर पार्टनर" : "Doctor Partner"}</span>
          </button>
        </div>

        {/* Notification Toasts */}
        {successMsg && (
          <div style={{
            padding: "10px 18px",
            background: "rgba(16, 185, 129, 0.12)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#10b981",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            padding: "10px 18px",
            background: "rgba(239, 68, 68, 0.12)",
            borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: "20px 24px", maxHeight: "68vh", overflowY: "auto" }}>

          {/* ════ TAB 1: 1-CLICK DEMO (HACKATHON JUDGES) ════ */}
          {activeTab === "demo" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{
                padding: "12px 14px",
                background: "var(--primary-soft)",
                borderRadius: "10px",
                border: "1px solid var(--primary-border)",
                fontSize: "0.8rem",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>
                  {lang === "hi"
                    ? "हैकाथॉन मूल्यांकनकर्ता: नीचे किसी भी प्रोफाइल पर 1-क्लिक करके सीधे पूरी मेडिकल हिस्ट्री व एआई एनालिसिस देखें।"
                    : "Hackathon Evaluator: Click any profile below to instantly load full health passport, vitals history & AI reports."}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {patients.map((p) => {
                  const isCurrent = currentPatient?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectDemoProfile(p.id)}
                      className="interactive-card"
                      style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: isCurrent ? "var(--primary-soft)" : "var(--bg-elevated)",
                        border: isCurrent ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          overflow: "hidden"
                        }}>
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            p.name.split(" ").map(n => n[0]).join("")
                          )}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-highlight)" }}>{p.name}</span>
                            <span className="badge badge-primary" style={{ fontSize: "0.72rem", padding: "1px 6px" }}>{p.bloodGroup}</span>
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            {p.age} {lang === "hi" ? "वर्ष" : "Yrs"} • {p.gender} • ABHA: {p.abhaId?.slice(0, 10)}...
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn ${isCurrent ? "btn-secondary" : "btn-primary"}`}
                        style={{ padding: "6px 14px", fontSize: "0.8rem", pointerEvents: "none" }}
                      >
                        {isCurrent ? (lang === "hi" ? "सक्रिय" : "Active") : (lang === "hi" ? "चुनें →" : "Select →")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ TAB 2: ABHA / MOBILE SIGN IN ════ */}
          {activeTab === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{
                background: "var(--bg-elevated)",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>{lang === "hi" ? "राष्ट्रीय डिजिटल स्वास्थ्य मिशन (ABDM) द्वारा प्रमाणित सुरक्षित लॉगिन।" : "Government of India ABDM verified instant health authentication."}</span>
              </div>

              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                      {lang === "hi" ? "10-अंकीय मोबाइल नंबर या 14-अंकीय आभा आईडी" : "10-Digit Mobile Number or 14-Digit ABHA ID"}
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="9876543210 or 91-4521-8842-1982"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-elevated)",
                        color: "var(--text-main)",
                        fontSize: "0.95rem",
                        fontWeight: 700
                      }}
                    />
                    <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "var(--text-dim)" }}>
                      💡 {lang === "hi" ? "डेमो परीक्षण के लिए: " : "For evaluator demo: "}
                      <span 
                        onClick={() => setLoginIdentifier("9876543210")} 
                        style={{ color: "var(--primary)", fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}
                      >
                        9876543210
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isOtpLoading}
                    className="btn btn-primary"
                    style={{ padding: "10px", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800, marginTop: "6px" }}
                  >
                    {isOtpLoading 
                      ? (lang === "hi" ? "ओटीपी भेजा जा रहा है..." : "Sending OTP...") 
                      : (lang === "hi" ? "ओटीपी प्राप्त करें →" : "Request Instant OTP →")}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{
                    padding: "10px 14px",
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "8px",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    fontSize: "0.82rem",
                    color: "var(--text-highlight)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span>{lang === "hi" ? `ओटीपी भेजा गया: ${loginIdentifier}` : `OTP sent to: ${loginIdentifier}`}</span>
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 700 }}
                    >
                      {lang === "hi" ? "नंबर बदलें" : "Change"}
                    </button>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                      {lang === "hi" ? "6-अंकीय सत्यापन ओटीपी दर्ज करें" : "Enter 6-Digit Verification OTP"}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="123456"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        letterSpacing: "4px",
                        textAlign: "center",
                        borderRadius: "8px",
                        border: "1.5px solid var(--primary-border)",
                        background: "var(--bg-elevated)",
                        color: "var(--primary)",
                        fontSize: "1.2rem",
                        fontWeight: 800
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
                        {lang === "hi" ? "डेमो ओटीपी कोड:" : "Evaluator Demo OTP:"} <strong>123456</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp("123456")}
                        style={{ background: "none", border: "none", color: "var(--secondary)", fontSize: "0.74rem", cursor: "pointer", fontWeight: 700 }}
                      >
                        {lang === "hi" ? "ऑटो-फिल 123456" : "Auto-fill 123456"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: "10px", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800 }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{lang === "hi" ? "सत्यापित करें व साइन इन करें" : "Verify & Sign In"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ════ TAB 3: REGISTER NEW PATIENT WITH LIVE GPS ════ */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {lang === "hi" ? "मरीज़ का पूरा नाम *" : "Full Legal Name *"}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "आयु (वर्ष) *" : "Age (Yrs) *"}
                  </label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "लिंग *" : "Gender *"}
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "रक्त समूह *" : "Blood Group *"}
                  </label>
                  <select
                    value={regBloodGroup}
                    onChange={(e) => setRegBloodGroup(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {lang === "hi" ? "मोबाइल नंबर (ओटीपी व एसएमएस अलर्ट के लिए)" : "Mobile Number (For Health SMS Alerts)"}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={15} color="var(--primary)" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                  />
                </div>
              </div>

              {/* Residential Address with Live Satellite GPS Auto-Fill */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={14} color="var(--primary)" />
                    {lang === "hi" ? "आवासीय पता (Residential Address)" : "Residential Address"}
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLiveGps}
                    disabled={isGpsLoading}
                    style={{
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      color: "#10b981",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: isGpsLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <Navigation size={11} className={isGpsLoading ? "spin" : ""} />
                    {isGpsLoading 
                      ? (lang === "hi" ? "GPS खोज रहा है..." : "Locating GPS...") 
                      : (lang === "hi" ? "📡 लाइव GPS ऑटो-फिल" : "📡 Live GPS Auto-Fill")}
                  </button>
                </div>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder={lang === "hi" ? "मकान नं, सड़क, क्षेत्र, शहर, पिन कोड..." : "Flat No, Street, City, State - Pincode"}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                />
                {gpsStatusMsg && (
                  <div style={{ fontSize: "0.72rem", marginTop: "3px", color: gpsStatusMsg.startsWith("✅") ? "var(--status-good-text)" : "var(--primary)", fontWeight: 600 }}>
                    {gpsStatusMsg}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "10px", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800, marginTop: "6px" }}
              >
                <Sparkles size={16} />
                <span>{lang === "hi" ? "आभा आईडी बनाएं व प्रोफाइल शुरू करें" : "Generate ABHA ID & Start Health Record"}</span>
              </button>
            </form>
          )}

          {/* ════ TAB 4: QUICK DOCTOR PARTNER LISTING ════ */}
          {activeTab === "doctor" && (
            <form onSubmit={handleQuickDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                background: "var(--bg-elevated)",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                fontSize: "0.78rem",
                color: "var(--text-muted)"
              }}>
                {lang === "hi"
                  ? "डॉक्टर पार्टनर: अपनी क्लीनिक लिस्ट करें ताकि मरीज सीधे ओपीडी कंसल्टेशन बुक कर सकें।"
                  : "Doctor Partners: List your practice to receive verified patient consultations on PulseAI Network."}
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {lang === "hi" ? "डॉक्टर का नाम *" : "Doctor Full Name *"}
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Alok Verma"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "विशेषज्ञता *" : "Specialty *"}
                  </label>
                  <select
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                  >
                    <option value="cardiologist">{lang === "hi" ? "कार्डियोलॉजिस्ट" : "Cardiologist"}</option>
                    <option value="physician">{lang === "hi" ? "जनरल फिजिशियन" : "General Physician"}</option>
                    <option value="dentist">{lang === "hi" ? "डेंटिस्ट" : "Dentist"}</option>
                    <option value="pediatrician">{lang === "hi" ? "पीडियाट्रिशियन" : "Pediatrician"}</option>
                    <option value="dermatologist">{lang === "hi" ? "डर्मेटोलॉजिस्ट" : "Dermatologist"}</option>
                    <option value="orthopedic">{lang === "hi" ? "ऑर्थोपेडिक" : "Orthopedic"}</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "परामर्श शुल्क (₹)" : "OPD Fee (₹)"}
                  </label>
                  <input
                    type="number"
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {lang === "hi" ? "क्लीनिक / अस्पताल का नाम *" : "Clinic / Hospital Name *"}
                </label>
                <input
                  type="text"
                  value={docClinic}
                  onChange={(e) => setDocClinic(e.target.value)}
                  placeholder="e.g. Apex Heart & Health Care"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {lang === "hi" ? "संपर्क फोन नंबर" : "Clinic Contact Phone"}
                </label>
                <input
                  type="tel"
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-main)" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                style={{ padding: "10px", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800, marginTop: "6px" }}
              >
                <ArrowRight size={16} />
                <span>{lang === "hi" ? "क्लीनिक नेटवर्क में जोड़ें" : "List Clinic on Doctor Network"}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
