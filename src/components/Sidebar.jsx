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

  const navSections = [
    {
      id: "overview",
      title: t.navOverview || "Overview",
      items: [
        { 
          id: "dashboard", 
          label: t.navDashboard || "Home", 
          icon: Home,
          color: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.24), rgba(37, 99, 235, 0.32))",
          borderColor: "rgba(59, 130, 246, 0.45)"
        },
        { 
          id: "symptom-checker", 
          label: t.navSymptomChecker || "Symptom Checker", 
          icon: Stethoscope,
          color: "#f43f5e",
          bg: "rgba(244, 63, 94, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.24), rgba(225, 29, 72, 0.32))",
          borderColor: "rgba(244, 63, 94, 0.45)"
        },
        { 
          id: "doctors", 
          label: t.navDoctors || "Find Doctors", 
          icon: BriefcaseMedical,
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.24), rgba(5, 150, 105, 0.32))",
          borderColor: "rgba(16, 185, 129, 0.45)"
        }
      ]
    },
    {
      id: "records",
      title: t.navRecords || "Medical Records",
      items: [
        { 
          id: "reports", 
          label: t.navReports || "Lab Reports", 
          icon: FileText,
          color: "#6366f1",
          bg: "rgba(99, 102, 241, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(79, 70, 229, 0.24), rgba(99, 102, 241, 0.32))",
          borderColor: "rgba(99, 102, 241, 0.45)"
        },
        { 
          id: "discharge", 
          label: t.navDischarge || "Discharge Summary", 
          icon: ClipboardCheck,
          color: "#8b5cf6",
          bg: "rgba(139, 92, 246, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.24), rgba(124, 58, 237, 0.32))",
          borderColor: "rgba(139, 92, 246, 0.45)"
        },
        { 
          id: "profile", 
          label: t.navProfile || "Health Profile", 
          icon: UserCheck,
          color: "#06b6d4",
          bg: "rgba(6, 182, 212, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.24), rgba(8, 145, 178, 0.32))",
          borderColor: "rgba(6, 182, 212, 0.45)"
        }
      ]
    },
    {
      id: "monitoring",
      title: t.navMonitoring || "Daily Monitoring",
      items: [
        { 
          id: "medications", 
          label: t.navMedications || "Medications", 
          icon: Pill,
          color: "#ec4899",
          bg: "rgba(236, 72, 153, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.24), rgba(219, 39, 119, 0.32))",
          borderColor: "rgba(236, 72, 153, 0.45)"
        },
        { 
          id: "devices", 
          label: t.navDevices || "Smart Watch & Devices", 
          icon: Watch,
          color: "#14b8a6",
          bg: "rgba(20, 184, 166, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.24), rgba(13, 148, 136, 0.32))",
          borderColor: "rgba(20, 184, 166, 0.45)"
        },
        { 
          id: "vitals", 
          label: t.navVitals || "Vitals & Trends", 
          icon: TrendingUp,
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.24), rgba(5, 150, 105, 0.32))",
          borderColor: "rgba(16, 185, 129, 0.45)"
        },
        { 
          id: "timeline", 
          label: t.navTimeline || "Health Dossier", 
          icon: History,
          color: "#0284c7",
          bg: "rgba(2, 132, 199, 0.16)",
          activeGradient: "linear-gradient(135deg, rgba(2, 132, 199, 0.24), rgba(3, 105, 161, 0.32))",
          borderColor: "rgba(2, 132, 199, 0.45)"
        }
      ]
    }
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
          padding: isOpen ? "8px 10px" : "8px 0",
          borderRadius: "12px",
          background: isActive 
            ? (item.activeGradient || "rgba(59, 130, 246, 0.2)") 
            : "transparent",
          border: isActive 
            ? `1px solid ${item.borderColor || "rgba(59, 130, 246, 0.35)"}` 
            : "1px solid transparent",
          color: isActive ? "#ffffff" : "var(--text-main)",
          fontWeight: isActive ? 800 : 600,
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          textAlign: "left",
          width: "100%",
          position: "relative",
          boxShadow: isActive ? `0 2px 14px ${item.bg}, inset 0 1px 0 rgba(255, 255, 255, 0.12)` : "none"
        }}
        className={!isActive ? "sidebar-item-hover" : ""}
        title={!isOpen ? item.label : undefined}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: isOpen ? "flex-start" : "center" }}>
          {/* Vibrant Rounded Icon Container */}
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "9px",
            background: isActive ? item.color : item.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isActive ? "#ffffff" : item.color,
            boxShadow: isActive ? `0 3px 10px ${item.bg}` : "none",
            flexShrink: 0,
            transition: "all 0.2s ease"
          }}>
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2.2} />
          </div>

          {isOpen && (
            <span style={{ 
              fontSize: "0.86rem", 
              fontWeight: isActive ? 800 : 600, 
              color: isActive ? "var(--text-highlight)" : "var(--text-main)", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap" 
            }}>
              {item.label}
            </span>
          )}
        </div>
        {isOpen && isActive && <ChevronRight size={14} color={item.color} />}
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
            gap: "12px", 
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

          {/* Categorized Navigation Menu with Clear Sections */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {navSections.map((sec, idx) => (
              <div key={sec.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {idx > 0 && !isOpen && (
                  <div style={{ height: "1px", background: "var(--border-color)", margin: "4px 8px" }} />
                )}
                {isOpen && (
                  <div style={{ 
                    fontSize: "0.68rem", 
                    fontWeight: 800, 
                    color: "var(--text-dim)", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.06em", 
                    padding: idx === 0 ? "2px 8px 4px" : "6px 8px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span>{sec.title}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {sec.items.map(renderNavButton)}
                </div>
              </div>
            ))}
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

                  <div style={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                      <span style={{ 
                        fontWeight: 800, 
                        fontSize: "0.88rem", 
                        color: "var(--text-highlight)", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap" 
                      }}>
                        {currentPatient.name}
                      </span>
                      <span style={{ 
                        fontSize: "0.72rem", 
                        color: "var(--primary)", 
                        fontWeight: 800,
                        background: "var(--primary-soft)",
                        padding: "1px 6px",
                        borderRadius: "6px",
                        flexShrink: 0
                      }}>
                        {currentPatient.bloodGroup}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <ShieldCheck size={11} color="var(--secondary)" />
                      <span>{lang === "hi" ? "सत्यापित आभा" : "ABHA Active"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Clean Single Logout Button */}
                {onLogout && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogout();
                    }}
                    className="btn btn-secondary"
                    style={{ 
                      padding: "7px", 
                      borderRadius: "8px", 
                      color: "var(--text-dim)", 
                      flexShrink: 0,
                      border: "1px solid var(--border-color)",
                      background: "transparent"
                    }}
                    title={lang === "hi" ? "लॉगआउट करें" : "Log Out"}
                  >
                    <LogOut size={15} />
                  </button>
                )}
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
                      {t.guestMode || "Guest Mode"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                      {t.offlineSession || "Offline Session"}
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
                  <span>{t.signIn || "Sign In"}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="btn btn-secondary"
                  style={{ width: "38px", height: "38px", padding: 0, borderRadius: "12px", color: "var(--primary)" }}
                  title={t.signIn || "Sign In with ABHA"}
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
