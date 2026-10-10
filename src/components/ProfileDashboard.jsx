import React, { useState, useRef } from "react";
import { 
  User, 
  ShieldAlert, 
  Activity, 
  Scale, 
  Phone, 
  Edit3, 
  CheckCircle2, 
  FileCheck2,
  Copy, 
  History, 
  X, 
  Stethoscope, 
  Camera, 
  Upload, 
  RefreshCcw, 
  Trash2,
  Calendar,
  CreditCard,
  Flame,
  MapPin,
  Navigation
} from "lucide-react";
import { calculateAge } from "../utils/dateUtils";
import { getLiveGpsAddress } from "../utils/geolocation";

export default function ProfileDashboard({ 
  patient, 
  patients = [],
  onSelectPatient,
  onUpdatePatient, 
  onOpenHealthPassport,
  lang = "en" 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedAbha, setCopiedAbha] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Dynamically compute exact age from DOB
  const currentDob = patient.dob || "1981-04-12";
  const displayedAge = calculateAge(currentDob, patient.age || 45);

  // Editable Form State
  const [formName, setFormName] = useState(patient.name || "");
  const [formDob, setFormDob] = useState(currentDob);
  const [formAge, setFormAge] = useState(displayedAge);
  const [formGender, setFormGender] = useState(patient.gender || "Male");
  const [formHeight, setFormHeight] = useState(patient.heightCm || 170);
  const [formWeight, setFormWeight] = useState(patient.weightKg || 70);
  const [formBloodGroup, setFormBloodGroup] = useState(patient.bloodGroup || "O+");
  const [formAddress, setFormAddress] = useState(patient.address || "Flat 402, Green Valley Apts, Sector 14, Gurugram, Haryana - 122001");
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState("");
  const [formEmergencyName, setFormEmergencyName] = useState(patient.emergencyContact?.name || "");
  const [formEmergencyPhone, setFormEmergencyPhone] = useState(patient.emergencyContact?.phone || "");
  const [formEmergencyRelation, setFormEmergencyRelation] = useState(patient.emergencyContact?.relation || "");
  const [formPhysicianName, setFormPhysicianName] = useState(patient.primaryPhysician?.name || "");
  const [formPhysicianPhone, setFormPhysicianPhone] = useState(patient.primaryPhysician?.phone || "");
  const [formDiet, setFormDiet] = useState(patient.lifestyle?.dietType || "");

  // Detect Live GPS Address
  const handleDetectLiveGps = async () => {
    setIsGpsLoading(true);
    setGpsStatusMsg(lang === "hi" ? "📡 उपग्रह GPS से सटीक पता खोजा जा रहा है..." : "📡 Acquiring satellite GPS location & address...");
    try {
      const res = await getLiveGpsAddress();
      const addr = res?.address || res?.formattedAddress;
      if (addr) {
        setFormAddress(addr);
        setGpsStatusMsg(
          lang === "hi" 
            ? `✅ GPS से पता प्राप्त हुआ (सटीकता: ±${res.accuracy || 15}m)` 
            : `✅ Live GPS address synced (Accuracy: ±${res.accuracy || 15}m)`
        );
      }
    } catch (err) {
      console.warn("GPS detection error in ProfileDashboard:", err);
      setGpsStatusMsg(
        lang === "hi" 
          ? `⚠️ GPS त्रुटि: ${err.message || "स्थान प्राप्त नहीं हो सका"}` 
          : `⚠️ GPS Notice: ${err.message || "Could not fetch location"}`
      );
    } finally {
      setIsGpsLoading(false);
      setTimeout(() => setGpsStatusMsg(""), 6000);
    }
  };

  // Initialize and open edit modal
  const startEditing = () => {
    setFormName(patient.name || "");
    const d = patient.dob || "1981-04-12";
    setFormDob(d);
    setFormAge(calculateAge(d, patient.age || 45));
    setFormGender(patient.gender || "Male");
    setFormHeight(patient.heightCm || 170);
    setFormWeight(patient.weightKg || 70);
    setFormBloodGroup(patient.bloodGroup || "O+");
    setFormAddress(patient.address || "Flat 402, Green Valley Apts, Sector 14, Gurugram, Haryana - 122001");
    setGpsStatusMsg("");
    setFormEmergencyName(patient.emergencyContact?.name || "");
    setFormEmergencyPhone(patient.emergencyContact?.phone || "");
    setFormEmergencyRelation(patient.emergencyContact?.relation || "");
    setFormPhysicianName(patient.primaryPhysician?.name || "");
    setFormPhysicianPhone(patient.primaryPhysician?.phone || "");
    setFormDiet(patient.lifestyle?.dietType || "");
    setIsEditing(true);
  };

  const handleCopyAbha = () => {
    navigator.clipboard.writeText(patient.abhaId || "91-4521-8842-1982");
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  // Gallery File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        if (onUpdatePatient) onUpdatePatient({ avatar: dataUrl });
        setShowPhotoOptions(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Live Camera Activation
  const startCamera = async () => {
    setShowPhotoOptions(false);
    setIsCameraActive(true);
    setCapturedPhoto(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert(lang === "hi" 
        ? "कैमरा एक्सेस की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में कैमरा अनुमति जांचें।" 
        : "Camera access was denied or not supported on this device. Please check permissions."
      );
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCapturedPhoto(null);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedPhoto(dataUrl);
    }
  };

  const saveCapturedPhoto = () => {
    if (capturedPhoto && onUpdatePatient) {
      onUpdatePatient({ avatar: capturedPhoto });
    }
    stopCamera();
  };

  const handleRemovePhoto = () => {
    if (onUpdatePatient) {
      onUpdatePatient({ avatar: "" });
    }
    setShowPhotoOptions(false);
  };

  const handleDobChange = (newDob) => {
    setFormDob(newDob);
    const calculated = calculateAge(newDob);
    setFormAge(calculated);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const finalAge = calculateAge(formDob);
    const heightM = (parseFloat(formHeight) || 170) / 100;
    const weightVal = parseFloat(formWeight) || 75;
    const newBmi = parseFloat((weightVal / (heightM * heightM)).toFixed(1));

    const updated = {
      name: formName,
      dob: formDob,
      age: finalAge,
      gender: formGender,
      heightCm: parseFloat(formHeight),
      weightKg: weightVal,
      bmi: newBmi,
      bloodGroup: formBloodGroup,
      address: formAddress,
      emergencyContact: {
        ...patient.emergencyContact,
        name: formEmergencyName,
        phone: formEmergencyPhone,
        relation: formEmergencyRelation
      },
      primaryPhysician: {
        ...patient.primaryPhysician,
        name: formPhysicianName,
        phone: formPhysicianPhone
      },
      lifestyle: {
        ...patient.lifestyle,
        dietType: formDiet
      }
    };

    if (onUpdatePatient) onUpdatePatient(updated);
    setIsEditing(false);
  };

  const conditionsList = patient.conditions || [];
  const allergiesList = patient.allergies || [];
  const surgeriesList = patient.surgeries || [];
  const familyList = patient.familyHistory || [];
  const lifestyle = patient.lifestyle || {};
  const insurance = patient.insurance || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Hidden file input for gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Top Identity & ABHA Health Passport Banner */}
      <div className="glass-panel" style={{
        padding: "26px 30px",
        background: "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
        border: "1px solid var(--primary-border)",
        position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "18px" }}>
          {/* Left Avatar & Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Interactive Photo Avatar */}
            <div style={{ position: "relative" }}>
              <div 
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                className="interactive-card"
                style={{
                  width: "84px",
                  height: "84px",
                  borderRadius: "22px",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "1.9rem",
                  boxShadow: "0 4px 16px rgba(2, 132, 199, 0.35)",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid var(--border-color)"
                }}
                title={lang === "hi" ? "फोटो बदलने के लिए क्लिक करें" : "Click to change photo"}
              >
                {patient.avatar ? (
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  patient.name.split(" ").map(n => n[0]).join("")
                )}
              </div>

              {/* Camera Icon Overlay Badge */}
              <button
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  right: "-4px",
                  background: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--bg-card)",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"
                }}
                title={lang === "hi" ? "कैमरा / गैलरी से फोटो जोड़ें" : "Update photo from Camera / Gallery"}
              >
                <Camera size={14} />
              </button>

              {/* Photo Options Dropdown Popover */}
              {showPhotoOptions && (
                <div style={{
                  position: "absolute",
                  top: "92px",
                  left: 0,
                  zIndex: 200,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "14px",
                  boxShadow: "var(--shadow-lg)",
                  padding: "8px",
                  width: "220px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary"
                    style={{ justifyContent: "flex-start", padding: "8px 12px", fontSize: "0.82rem" }}
                  >
                    <Upload size={15} color="var(--primary)" />
                    <span>{lang === "hi" ? "गैलरी से चुनें" : "Upload from Gallery"}</span>
                  </button>

                  <button
                    onClick={startCamera}
                    className="btn btn-secondary"
                    style={{ justifyContent: "flex-start", padding: "8px 12px", fontSize: "0.82rem" }}
                  >
                    <Camera size={15} color="var(--secondary)" />
                    <span>{lang === "hi" ? "कैमरा से फोटो लें" : "Take Live Photo"}</span>
                  </button>

                  {patient.avatar && (
                    <button
                      onClick={handleRemovePhoto}
                      className="btn btn-secondary"
                      style={{ justifyContent: "flex-start", padding: "8px 12px", fontSize: "0.82rem", color: "var(--status-crit-text)" }}
                    >
                      <Trash2 size={15} />
                      <span>{lang === "hi" ? "फोटो हटाएं" : "Remove Photo"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Row 1: Patient Name & Blood Group */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)", letterSpacing: "-0.01em" }}>
                  {patient.name}
                </h1>
                <span className="badge badge-primary" style={{ fontSize: "0.82rem", padding: "4px 12px" }}>
                  {lang === "hi" ? "रक्त समूह:" : "Blood:"} {patient.bloodGroup}
                </span>
              </div>

              {/* Row 2: Age, Gender & ABHA ID Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                {/* Age Badge */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bg-elevated)",
                  border: "1.5px solid var(--primary-border)",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "var(--text-highlight)"
                }}>
                  <Calendar size={14} color="var(--primary)" />
                  <span>{lang === "hi" ? "आयु:" : "Age:"} <strong style={{ color: "var(--primary)" }}>{displayedAge} {lang === "hi" ? "वर्ष" : "Yrs"}</strong></span>
                </div>

                {/* Gender Badge */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  fontSize: "0.86rem",
                  color: "var(--text-main)"
                }}>
                  <User size={14} color="var(--secondary)" />
                  <span>{lang === "hi" ? "लिंग:" : "Gender:"} <strong>{patient.gender}</strong></span>
                </div>

                {/* Digital ABHA Card Pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  fontSize: "0.86rem",
                  color: "var(--text-main)"
                }}>
                  <CreditCard size={14} color="var(--primary)" />
                  <span>ABHA ID: <strong>{patient.abhaId || "91-4521-8842-1982"}</strong></span>
                  <button
                    type="button"
                    onClick={handleCopyAbha}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", color: "var(--primary)", display: "flex", alignItems: "center" }}
                    title="Copy ABHA ID"
                  >
                    {copiedAbha ? <CheckCircle2 size={13} color="var(--secondary)" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* Row 3: Switch Account Selector */}
              {patients && patients.length > 0 && (
                <div style={{ marginTop: "2px" }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--bg-elevated)",
                    border: "1.5px solid var(--primary-border)",
                    borderRadius: "10px",
                    padding: "6px 14px"
                  }}>
                    <User size={15} color="var(--primary)" />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                      {lang === "hi" ? "खाता बदलें:" : "Switch Account:"}
                    </span>
                    <select
                      value={patient.id}
                      onChange={(e) => {
                        const found = patients.find(p => p.id === e.target.value);
                        if (found && onSelectPatient) onSelectPatient(found);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        boxShadow: "none",
                        padding: "2px 4px",
                        fontSize: "0.88rem",
                        fontWeight: 800,
                        color: "var(--text-highlight)",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.bloodGroup})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Row 4: Residential Address Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "6px 14px",
                fontSize: "0.84rem",
                color: "var(--text-main)",
                maxWidth: "680px"
              }}>
                <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {patient.address || (lang === "hi" ? "आवासीय पता दर्ज नहीं है" : "No address specified")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Column: Top Edit Details & Bottom Print Health Report */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between", 
            alignItems: "flex-end", 
            gap: "18px",
            minHeight: "115px",
            alignSelf: "stretch"
          }}>
            {/* Top Right: Edit Details */}
            <button
              onClick={startEditing}
              className="btn btn-secondary"
              style={{
                height: "40px",
                padding: "0 16px",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "10px",
                background: "var(--bg-card)",
                border: "1.5px solid var(--border-color)",
                fontWeight: 600,
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <Edit3 size={15} color="var(--primary)" />
              <span>{lang === "hi" ? "विवरण संपादित करें" : "Edit Details"}</span>
            </button>

            {/* Bottom Right: Doctor Health Passport (PDF) */}
            <button
              onClick={() => onOpenHealthPassport ? onOpenHealthPassport() : window.print()}
              className="btn btn-primary"
              style={{
                height: "42px",
                padding: "0 18px",
                fontSize: "0.88rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.22)"
              }}
            >
              <FileCheck2 size={16} />
              <span>{lang === "hi" ? "हेल्थ पासपोर्ट (PDF)" : "Health Passport (PDF)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraActive && (
        <div className="modal-overlay" onClick={stopCamera}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ padding: "26px", maxWidth: "560px", textAlign: "center" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                <Camera size={20} color="var(--primary)" />
                {lang === "hi" ? "लाइव कैमरा से फोटो लें" : "Capture Profile Photo"}
              </h2>
              <button onClick={stopCamera} className="btn btn-secondary" style={{ padding: "6px" }}>
                <X size={18} />
              </button>
            </div>

            {/* Video Feed or Captured Preview */}
            <div style={{
              width: "100%",
              height: "340px",
              background: "#000000",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {!capturedPhoto ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={capturedPhoto}
                  alt="Captured Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            {/* Camera Actions */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              {!capturedPhoto ? (
                <button
                  type="button"
                  onClick={captureFrame}
                  className="btn btn-primary"
                  style={{ padding: "12px 28px", fontSize: "0.95rem" }}
                >
                  <Camera size={18} />
                  <span>{lang === "hi" ? "फोटो क्लिक करें" : "Snap Photo"}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCapturedPhoto(null)}
                    className="btn btn-secondary"
                  >
                    <RefreshCcw size={16} />
                    <span>{lang === "hi" ? "दोबारा लें (Retake)" : "Retake"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={saveCapturedPhoto}
                    className="btn btn-primary"
                  >
                    <CheckCircle2 size={16} />
                    <span>{lang === "hi" ? "प्रोफ़ाइल फोटो बनाएं" : "Set Profile Photo"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="bento-grid-12">
        {/* Card 1: Physical & Body Composition (Cols 1-4) */}
        <div className="glass-panel" style={{ gridColumn: "span 4", padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                <Scale size={18} color="var(--primary)" />
                {lang === "hi" ? "शारीरिक माप व बीएमआई" : "Body Composition & BMI"}
              </h2>
              <span className={`badge ${patient.bmi > 25 ? "badge-borderline" : "badge-good"}`}>
                {patient.bmi > 25 ? (lang === "hi" ? "अधिक वजन" : "Overweight") : (lang === "hi" ? "सामान्य" : "Normal BMI")}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "14px" }}>
              <div style={{ background: "var(--bg-elevated)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "लंबाई" : "HEIGHT"}</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                  {patient.heightCm} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>cm</span>
                </div>
              </div>
              <div style={{ background: "var(--bg-elevated)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "वजन" : "WEIGHT"}</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                  {patient.weightKg} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>kg</span>
                </div>
              </div>
            </div>

            {/* BMI Meter */}
            <div style={{ background: "var(--bg-elevated)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>BMI SCORE</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)" }}>{patient.bmi} kg/m²</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min((patient.bmi / 35) * 100, 100)}%`,
                  height: "100%",
                  background: patient.bmi > 25 ? "linear-gradient(90deg, #10b981, #f59e0b)" : "var(--secondary)",
                  borderRadius: "4px"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "4px" }}>
                <span>18.5 (Normal)</span>
                <span>25.0 (Threshold)</span>
                <span>30.0 (Obese)</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--secondary)", fontWeight: 600, marginTop: "14px" }}>
            🎯 {lang === "hi" ? "लक्ष्य वजन:" : "Target Weight:"} <strong>{patient.targetWeightKg || 72} kg</strong>
          </div>
        </div>

        {/* Card 2: Chronic Conditions Registry (Cols 5-8) */}
        <div className="glass-panel" style={{ gridColumn: "span 4", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} color="var(--primary)" />
              {lang === "hi" ? "दीर्घकालिक बीमारियां" : "Chronic Conditions"}
            </h2>
            <span className="badge badge-primary">{conditionsList.length} {lang === "hi" ? "सक्रिय" : "Active"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {conditionsList.map((cond, idx) => {
              const condName = typeof cond === "string" ? cond : cond.name;
              const year = typeof cond === "object" ? cond.diagnosedYear : 2022;
              const status = typeof cond === "object" ? cond.status : "Monitored";

              return (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-highlight)" }}>
                      {condName}
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 700 }}>
                      {lang === "hi" ? "वर्ष " : "Since "} {year}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {lang === "hi" ? "स्थिति:" : "Status:"} {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Critical Allergies & Safety Shield (Cols 9-12) */}
        <div className="glass-panel" style={{
          gridColumn: "span 4",
          padding: "22px",
          background: "linear-gradient(135deg, var(--status-crit-bg), var(--bg-card))",
          border: "1px solid var(--status-crit-border)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-crit-text)", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={20} />
              {lang === "hi" ? "दवा एलर्जी व सुरक्षा" : "Drug Allergies & Safety"}
            </h2>
            <span className="badge badge-critical">{lang === "hi" ? "उच्च सतर्कता" : "Critical Shield"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {allergiesList.map((all, idx) => {
              const name = typeof all === "string" ? all : all.allergen;
              const reaction = typeof all === "object" ? all.reaction : "Adverse allergic reaction";
              const severity = typeof all === "object" ? all.severity : "Severe";

              return (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--status-crit-border)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "var(--status-crit-text)" }}>
                      ⚠️ {name}
                    </div>
                    <span className="badge badge-critical" style={{ fontSize: "0.68rem" }}>
                      {severity}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-main)", marginTop: "4px" }}>
                    {lang === "hi" ? "प्रतिक्रिया:" : "Reaction:"} <strong>{reaction}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "14px", lineHeight: "1.4" }}>
            🔒 {lang === "hi" 
              ? "पल्स-एआई किसी भी नई दवा के टकराव को रोकने के लिए इस एलर्जी सूची को स्वचालित रूप से मॉनिटर करता है।"
              : "Automatically monitored: PulseAI will flag any new prescription or OTC drug containing these substances."
            }
          </div>
        </div>

        {/* Card 4: Digital Health Insurance & ABHA Card (Cols 1-6) */}
        <div className="glass-panel" style={{ gridColumn: "span 6", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={18} color="var(--primary)" />
              {lang === "hi" ? "स्वास्थ्य बीमा व कवरेज" : "Health Insurance & Coverage"}
            </h2>
            <span className="badge badge-good">{lang === "hi" ? "सक्रिय पॉलिसी" : "Active Policy"}</span>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(16, 185, 129, 0.08))",
            border: "1px solid var(--primary-border)",
            borderRadius: "14px",
            padding: "18px 20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "बीमा प्रदाता" : "INSURANCE PROVIDER"}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-highlight)" }}>{insurance.provider}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "बीमा राशि" : "SUM INSURED"}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--secondary)" }}>{insurance.sumInsured || "₹ 15,00,000"}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", fontSize: "0.8rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{lang === "hi" ? "पॉलिसी नंबर" : "Policy Number"}</span>
                <strong>{insurance.policyNumber}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{lang === "hi" ? "वैधता" : "Valid Till"}</span>
                <strong>{insurance.validTill || "Nov 2027"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{lang === "hi" ? "टीपीए हेल्पलाइन" : "TPA Helpline"}</span>
                <strong style={{ color: "var(--primary)" }}>{insurance.tpaSupport}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Lifestyle Profile (Cols 7-12) */}
        <div className="glass-panel" style={{ gridColumn: "span 6", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
              <Flame size={18} color="var(--secondary)" />
              {lang === "hi" ? "जीवनशैली व दैनिक आदतें" : "Lifestyle & Daily Habits"}
            </h2>
            <span className="badge badge-good">{lang === "hi" ? "संतुलित" : "Healthy Baseline"}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            <div style={{ background: "var(--bg-elevated)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "धूम्रपान स्थिति" : "SMOKING STATUS"}</span>
              <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-highlight)", marginTop: "2px" }}>
                {lifestyle.smoking || "Non-Smoker"}
              </div>
            </div>
            <div style={{ background: "var(--bg-elevated)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "शराब सेवन" : "ALCOHOL"}</span>
              <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-highlight)", marginTop: "2px" }}>
                {lifestyle.alcohol || "Social / None"}
              </div>
            </div>
            <div style={{ background: "var(--bg-elevated)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "शारीरिक व्यायाम" : "PHYSICAL ACTIVITY"}</span>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-highlight)", marginTop: "2px" }}>
                {lifestyle.activityLevel || "Moderate (30m walk)"}
              </div>
            </div>
            <div style={{ background: "var(--bg-elevated)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "औसत नींद" : "AVERAGE SLEEP"}</span>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-highlight)", marginTop: "2px" }}>
                {lifestyle.sleepHours || "7 hours / night"}
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Surgical & Family History Ledger (Cols 1-6) */}
        <div className="glass-panel" style={{ gridColumn: "span 6", padding: "22px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} color="var(--primary)" />
            {lang === "hi" ? "सर्जरी व पारिवारिक इतिहास" : "Surgical & Family Medical History"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ background: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 800 }}>{lang === "hi" ? "पूर्व सर्जरी व प्रक्रियाएं" : "PAST SURGERIES & PROCEDURES"}</div>
              {surgeriesList.length > 0 ? (
                surgeriesList.map((surg, i) => (
                  <div key={i} style={{ fontSize: "0.86rem", color: "var(--text-main)", marginTop: "4px" }}>
                    • <strong>{surg.procedure}</strong> ({surg.year}) — {surg.hospital}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "4px" }}>{lang === "hi" ? "कोई पूर्व सर्जरी दर्ज नहीं।" : "No previous surgeries recorded."}</div>
              )}
            </div>

            <div style={{ background: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 800 }}>{lang === "hi" ? "वंशानुगत स्वास्थ्य जोखिम" : "HEREDITARY / FAMILY RISKS"}</div>
              {familyList.map((fam, i) => (
                <div key={i} style={{ fontSize: "0.86rem", color: "var(--text-main)", marginTop: "4px" }}>
                  • <strong>{fam.relation}:</strong> {fam.condition}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 7: Care Circle & Contacts (Cols 7-12) */}
        <div className="glass-panel" style={{ gridColumn: "span 6", padding: "22px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
            <Stethoscope size={18} color="var(--secondary)" />
            {lang === "hi" ? "देखभाल नेटवर्क व संपर्क" : "Care Circle & Primary Contacts"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-elevated)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)"
            }}>
              <div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "आपातकालीन संपर्क" : "PRIMARY EMERGENCY CONTACT"}</div>
                <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "var(--text-highlight)" }}>
                  {patient.emergencyContact?.name} ({patient.emergencyContact?.relation})
                </div>
              </div>
              <a href={`tel:${patient.emergencyContact?.phone}`} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                <Phone size={14} /> {lang === "hi" ? "कॉल" : "Call"}
              </a>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-elevated)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)"
            }}>
              <div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "प्राथमिक चिकित्सक / विशेषज्ञ" : "PRIMARY PHYSICIAN"}</div>
                <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "var(--text-highlight)" }}>
                  {patient.primaryPhysician?.name}
                </div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{patient.primaryPhysician?.clinic}</div>
              </div>
              <a href={`tel:${patient.primaryPhysician?.phone}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                <Phone size={14} /> {lang === "hi" ? "क्लिनिक" : "Clinic"}
              </a>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              background: "var(--bg-elevated)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)"
            }}>
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "आवासीय पता" : "RESIDENTIAL ADDRESS"}</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-highlight)", marginTop: "4px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{patient.address || "Flat 402, Green Valley Apts, Sector 14, Gurugram, Haryana - 122001"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "26px", maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{lang === "hi" ? "स्वास्थ्य प्रोफ़ाइल संपादित करें" : "Edit Patient Health Profile"}</h2>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: "6px" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "पूरा नाम" : "Full Name"}</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
              </div>

              {/* Residential Address with Live Satellite GPS Auto-Fill */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
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
                      padding: "4px 10px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: isGpsLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease"
                    }}
                    title="Automatically fill address using real-time device GPS"
                  >
                    <Navigation size={12} className={isGpsLoading ? "spin" : ""} />
                    {isGpsLoading 
                      ? (lang === "hi" ? "GPS खोज रहा है..." : "Locating GPS...") 
                      : (lang === "hi" ? "📡 लाइव GPS ऑटो-फिल" : "📡 Live GPS Auto-Fill")}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder={lang === "hi" ? "मकान नं, सड़क, क्षेत्र, शहर, पिन कोड..." : "Flat/House No, Street, Landmark, City, State - Pincode..."}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-elevated)",
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    resize: "vertical"
                  }}
                />
                {gpsStatusMsg && (
                  <div style={{ fontSize: "0.75rem", marginTop: "4px", color: gpsStatusMsg.startsWith("✅") ? "var(--status-good-text)" : "var(--primary)", fontWeight: 600 }}>
                    {gpsStatusMsg}
                  </div>
                )}
              </div>

              {/* DOB & Auto-Computed Age Fields */}
              <div className="grid-3">
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "जन्म तिथि (DOB)" : "Date of Birth (DOB)"}
                  </label>
                  <input 
                    type="date" 
                    value={formDob} 
                    onChange={(e) => handleDobChange(e.target.value)} 
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {lang === "hi" ? "आयु (DOB से गणना)" : "Calculated Age (Yrs)"}
                  </label>
                  <input 
                    type="number" 
                    value={formAge} 
                    readOnly
                    style={{ background: "var(--bg-elevated)", fontWeight: 800, color: "var(--primary)" }}
                    title="Age is automatically calculated based on Date of Birth"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "लिंग" : "Gender"}</label>
                  <select value={formGender} onChange={(e) => setFormGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "रक्त समूह" : "Blood Group"}</label>
                  <select value={formBloodGroup} onChange={(e) => setFormBloodGroup(e.target.value)}>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "लंबाई (cm)" : "Height (cm)"}</label>
                  <input type="number" value={formHeight} onChange={(e) => setFormHeight(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "वजन (kg)" : "Weight (kg)"}</label>
                  <input type="number" step="0.1" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} required />
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "आपातकालीन संपर्क नाम" : "Emergency Contact Name"}</label>
                  <input type="text" value={formEmergencyName} onChange={(e) => setFormEmergencyName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "संबंध" : "Relationship"}</label>
                  <input type="text" value={formEmergencyRelation} onChange={(e) => setFormEmergencyRelation(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "फोन नंबर" : "Emergency Phone"}</label>
                  <input type="text" value={formEmergencyPhone} onChange={(e) => setFormEmergencyPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "चिकित्सक / डॉक्टर" : "Attending Physician"}</label>
                  <input type="text" value={formPhysicianName} onChange={(e) => setFormPhysicianName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>{lang === "hi" ? "आहार प्रकार" : "Diet & Nutrition Type"}</label>
                  <input type="text" value={formDiet} onChange={(e) => setFormDiet(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "hi" ? "सुरक्षित करें" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
