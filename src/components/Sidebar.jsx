import React from "react";
import BrandLogo from "./BrandLogo";
import { 
  Home,
  FileText, 
  ClipboardCheck,
  Pill, 
  TrendingUp, 
  History, 
  UserCheck, 
  Stethoscope, 
  BriefcaseMedical,
  Watch,
  ChevronRight, 
  ChevronLeft,
  LogOut,
  LogIn,
  User,
  ShieldCheck
} from "lucide-react";
import { translations } from "../data/translations";

export default function Sidebar({
  activeTab,
  setActiveTab,
  lang,
  isOpen,
  onToggle,
  currentPatient,
  _patients = [],
  _onSelectPatient,
  isLoggedIn = true,
  onOpenAuthModal,
  onLogout
}) {
  const t = translations[lang] || translations.en;

  const navItems = [
    { id: "dashboard", label: lang === "hi" ? "होम" : "Home", icon: Home },
    { id: "symptom-checker", label: t.navSymptomChecker, icon: Stethoscope },
    { id: "doctors", label: t.navDoctors, icon: BriefcaseMedical },
    { id: "profile", label: t.navProfile, icon: UserCheck },
    { id: "reports", label: t.navReports, icon: FileText },
    { id: "discharge", label: lang === "hi" ? "डिस्चार्ज सारांश" : (t.navDischarge || "Discharge Summary"), icon: ClipboardCheck },
    { id: "medications", label: t.navMedications, icon: Pill },
    { id: "devices", label: lang === "hi" ? "स्मार्ट वॉच व डिवाइसेज" : (t.navDevices || "Smart Watch & Devices"), icon: Watch },
    { id: "vitals", label: t.navVitals, icon: TrendingUp },
    { id: "timeline", label: t.navTimeline, icon: History }
  ];

  const renderNavButton = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          if (window.innerWidth <= 768 && onToggle) onToggle();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          padding: isOpen ? "11px 14px" : "11px 0",
          borderRadius: "12px",
          border: "none",
          background: isActive ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "transparent",
          color: isActive ? "#ffffff" : "var(--text-muted)",
          fontWeight: isActive ? 700 : 500,
          cursor: "pointer",
          transition: "all 0.18s ease",
          textAlign: "left",
          width: "100%",
          position: "relative",
          boxShadow: isActive ? "0 3px 10px rgba(2, 132, 199, 0.22)" : "none"
        }}
        className={!isActive ? "sidebar-item-hover" : ""}
        title={!isOpen ? item.label : undefined}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: isOpen ? "flex-start" : "center" }}>
          <Icon size={19} color={isActive ? "#ffffff" : "var(--primary)"} style={{ flexShrink: 0 }} />
          {isOpen && (
            <span style={{ fontSize: "0.89rem", fontWeight: isActive ? 700 : 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.label}
            </span>
          )}
        </div>
        {isOpen && isActive && <ChevronRight size={14} color="#ffffff" />}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (strictly only on mobile screens <= 768px) */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="sidebar-backdrop"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        {/* Floating Circular Edge Toggle Button (Matches reference image) */}
        <button
          onClick={onToggle}
          className="sidebar-edge-toggle"
          title={isOpen 
            ? (lang === "hi" ? "साइडबार छोटा करें (केवल आइकन्स)" : "Collapse to Icons (Ctrl+B)") 
            : (lang === "hi" ? "साइडबार पूरा खोलें" : "Expand Sidebar (Ctrl+B)")
          }
          aria-label="Toggle Sidebar Rail"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Top Section - Internal scroll container with balanced vertical arrangement */}
        <div 
          className="sidebar-scrollable-area"
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "14px", 
            flex: 1, 
            minHeight: 0, 
            overflowY: "auto", 
            overflowX: "hidden",
            paddingRight: "2px"
          }}
        >
          {/* Brand Logo */}
          <div onClick={() => setActiveTab("dashboard")}>
            <BrandLogo 
              size={38} 
              isOpen={isOpen} 
              appName={t.appName || "PulseAI"} 
              subtitle={null} 
              badge={null} 
            />
          </div>

          {/* Main Navigation Menu with Single Top Title */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {isOpen && (
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 8px 6px" }}>
                {lang === "hi" ? "मेनू" : "Menu"}
              </div>
            )}
            {navItems.map(renderNavButton)}
          </nav>
        </div>

        {/* Bottom User Dashboard & Profile / Auth Section */}
        <div style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0
        }}>
          {isLoggedIn && currentPatient ? (
            isOpen ? (
              /* Expanded User Card */
              <div 
                className="interactive-card"
                style={{
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}
              >
                {/* Left Profile Info (Click to open Health Profile) */}
                <div 
                  onClick={() => setActiveTab("profile")}
                  style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer", overflow: "hidden" }}
                  title={lang === "hi" ? "हेल्थ प्रोफाइल देखें" : "View Health Profile"}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      overflow: "hidden",
                      border: "1.5px solid var(--border-color)"
                    }}>
                      {currentPatient.avatar ? (
                        <img src={currentPatient.avatar} alt={currentPatient.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        currentPatient.name.split(" ").map(n => n[0]).join("")
                      )}
                    </div>
                    {/* Live Online / ABHA Verified Pulse Dot */}
                    <span style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2px solid var(--bg-card)",
                      boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)"
                    }} />
                  </div>

                  <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--text-highlight)", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {currentPatient.name}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 700 }}>
                        ({currentPatient.bloodGroup})
                      </span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <ShieldCheck size={11} color="var(--secondary)" />
                      <span>{lang === "hi" ? "सत्यापित आभा" : "ABHA Active"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="btn btn-secondary"
                      style={{ padding: "6px", borderRadius: "8px", color: "var(--primary)" }}
                      title={lang === "hi" ? "मरीज बदलें / डॉक्टर पार्टनर पोर्टल" : "Switch Patient / Doctor Partner Portal"}
                    >
                      <User size={15} />
                    </button>
                  )}
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="btn btn-secondary"
                      style={{ padding: "6px", borderRadius: "8px", color: "var(--text-dim)" }}
                      title={lang === "hi" ? "लॉगआउट करें" : "Log Out"}
                    >
                      <LogOut size={15} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Collapsed Avatar Circle */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div
                  onClick={() => setActiveTab("profile")}
                  style={{ position: "relative", cursor: "pointer" }}
                  title={`${currentPatient.name} (${currentPatient.bloodGroup}) — ${lang === "hi" ? "प्रोफाइल देखें" : "Health Profile"}`}
                >
                  <div style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    border: "1.5px solid var(--border-color)",
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    {currentPatient.avatar ? (
                      <img src={currentPatient.avatar} alt={currentPatient.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      currentPatient.name.split(" ").map(n => n[0]).join("")
                    )}
                  </div>
                  <span style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "2px solid var(--bg-card)"
                  }} />
                </div>
              </div>
            )
          ) : (
            /* Logged Out / Guest Mode State */
            isOpen ? (
              <div style={{
                padding: "10px 12px",
                borderRadius: "14px",
                background: "var(--bg-elevated)",
                border: "1px dashed var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "var(--bg-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)"
                  }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                      {lang === "hi" ? "गेस्ट मोड" : "Guest Mode"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                      {lang === "hi" ? "ऑफ़लाइन सत्र" : "Offline Session"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="btn btn-primary"
                  style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                >
                  <LogIn size={13} />
                  <span>{lang === "hi" ? "लॉगिन" : "Sign In"}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="btn btn-secondary"
                  style={{ width: "38px", height: "38px", padding: 0, borderRadius: "12px", color: "var(--primary)" }}
                  title={lang === "hi" ? "आभा लॉगिन करें" : "Sign In with ABHA"}
                >
                  <LogIn size={18} />
                </button>
              </div>
            )
          )}
        </div>
      </aside>
    </>
  );
}
