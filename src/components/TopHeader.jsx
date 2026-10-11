import React, { useState, useRef, useEffect } from "react";
import { LogoIcon } from "./BrandLogo";
import { 
  AlertOctagon, 
  Languages, 
  Sun, 
  Moon, 
  Search, 
  X, 
  Stethoscope, 
  FileText, 
  FileCheck2,
  Sparkles, 
  Home, 
  Check,
  Activity,
  Pill,
  User,
  Menu,
  Key
} from "lucide-react";
import { translations } from "../data/translations";
import { triggerGoogleTranslate } from "../utils/translator";
import { getStoredApiKey } from "../services/geminiService";

// Crisp vector SVG flags for UK and India to prevent Windows "GB" / "IN" font fallback
const UKFlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" style={{ borderRadius: "50%", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} aria-hidden="true">
    <clipPath id="circle-uk-nav"><circle cx="18" cy="18" r="18" /></clipPath>
    <g clipPath="url(#circle-uk-nav)">
      <path fill="#00247D" d="M0 0h36v36H0z"/>
      <path fill="#FFF" d="M0 0l36 36m0-36L0 36" stroke="#FFF" strokeWidth="6"/>
      <path fill="#CF142B" d="M0 0l36 36m0-36L0 36" stroke="#CF142B" strokeWidth="2.5"/>
      <path fill="#FFF" d="M18 0v36M0 18h36" stroke="#FFF" strokeWidth="8"/>
      <path fill="#CF142B" d="M18 0v36M0 18h36" stroke="#CF142B" strokeWidth="4.5"/>
    </g>
  </svg>
);

const IndiaFlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" style={{ borderRadius: "50%", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} aria-hidden="true">
    <clipPath id="circle-in-nav"><circle cx="18" cy="18" r="18" /></clipPath>
    <g clipPath="url(#circle-in-nav)">
      <path fill="#FF9933" d="M0 0h36v12H0z"/>
      <path fill="#FFFFFF" d="M0 12h36v12H0z"/>
      <path fill="#138808" d="M0 24h36v12H0z"/>
      <circle cx="18" cy="18" r="3.6" fill="none" stroke="#000080" strokeWidth="0.8"/>
      <circle cx="18" cy="18" r="0.9" fill="#000080"/>
      <circle cx="18" cy="18" r="3.2" fill="none" stroke="#000080" strokeWidth="0.3" strokeDasharray="0.3 0.5"/>
    </g>
  </svg>
);

const SUPPORTED_NAV_LANGUAGES = [
  { id: "en", label: "English", native: "English", country: "uk" },
  { id: "hi", label: "Hindi", native: "हिन्दी", country: "in" },
  { id: "hinglish", label: "Hinglish", native: "हिंग्लिश", country: "in" },
  { id: "bn", label: "Bengali", native: "বাংলা", country: "in" },
  { id: "mr", label: "Marathi", native: "मराठी", country: "in" },
  { id: "te", label: "Telugu", native: "తెలుగు", country: "in" },
  { id: "ta", label: "Tamil", native: "தமிழ்", country: "in" },
  { id: "gu", label: "Gujarati", native: "ગુજરાતી", country: "in" },
  { id: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", country: "in" },
  { id: "kn", label: "Kannada", native: "ಕನ್ನಡ", country: "in" }
];

const NAV_LINKS = [
  { 
    id: "dashboard", 
    key: "navDashboard",
    label: "Home", 
    labelHi: "होम", 
    icon: Home,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.16)",
    activeBg: "linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(37, 99, 235, 0.28))",
    borderColor: "rgba(59, 130, 246, 0.45)"
  },
  { 
    id: "reports", 
    key: "navReports",
    label: "Lab Reports", 
    labelHi: "लैब रिपोर्ट्स", 
    icon: FileText,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.16)",
    activeBg: "linear-gradient(135deg, rgba(79, 70, 229, 0.22), rgba(99, 102, 241, 0.28))",
    borderColor: "rgba(99, 102, 241, 0.45)"
  },
  { 
    id: "doctors", 
    key: "navDoctors",
    label: "Find Doctors", 
    labelHi: "डॉक्टर खोजें", 
    icon: Stethoscope,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.16)",
    activeBg: "linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(5, 150, 105, 0.28))",
    borderColor: "rgba(16, 185, 129, 0.45)"
  },
];

const SEARCH_CATEGORIES = [
  { id: "passport", key: "healthPassportPdf", label: "Doctor Health Passport (PDF)", labelHi: "डॉक्टर हेल्थ पासपोर्ट (PDF)", tab: "passport", icon: FileCheck2, color: "#10b981", bg: "rgba(16, 185, 129, 0.16)", keywords: ["passport", "pdf", "print", "summary", "पासपोर्ट", "प्रिंट", "डॉक्टर"] },
  { id: "doctors", key: "navDoctors", label: "Specialist Doctors", labelHi: "विशेषज्ञ डॉक्टर", tab: "doctors", icon: Stethoscope, color: "#06b6d4", bg: "rgba(6, 182, 212, 0.16)", keywords: ["doctor", "dentist", "dermatologist", "eye", "skin", "डॉक्टर", "दंत", "क्लिनिक"] },
  { id: "copilot", key: "navCopilot", label: "AI Health Copilot", labelHi: "एआई स्वास्थ्य कोपायलट", tab: "copilot", icon: Sparkles, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.16)", keywords: ["ai", "copilot", "ask", "chat", "voice", "सवाल", "मदद", "कोपायलट"] },
  { id: "symptom-checker", key: "navSymptomChecker", label: "Symptom Checker", labelHi: "लक्षण जांच विज़ार्ड", tab: "symptom-checker", icon: Activity, color: "#f43f5e", bg: "rgba(244, 63, 94, 0.16)", keywords: ["symptom", "fever", "pain", "headache", "dizzy", "cough", "दर्द", "बुखार", "चक्कर"] },
  { id: "medications", key: "navMedications", label: "Medications & Safety", labelHi: "दवाइयां और सुरक्षा", tab: "medications", icon: Pill, color: "#ec4899", bg: "rgba(236, 72, 153, 0.16)", keywords: ["medicine", "pill", "tablet", "statin", "telmisartan", "metformin", "dawa", "दवाई", "गोली"] },
  { id: "reports", key: "navReports", label: "Lab Test Reports", labelHi: "लैब टेस्ट रिपोर्ट", tab: "reports", icon: FileText, color: "#6366f1", bg: "rgba(99, 102, 241, 0.16)", keywords: ["report", "lab", "test", "hba1c", "blood", "sugar", "रिपोर्ट", "जांच"] },
  { id: "vitals", key: "navVitals", label: "Vitals & Physiological Trends", labelHi: "वाइटल्स व रुझान", tab: "vitals", icon: Activity, color: "#10b981", bg: "rgba(16, 185, 129, 0.16)", keywords: ["vitals", "bp", "blood pressure", "glucose", "pulse", "बीपी", "शुगर", "पल्स"] },
  { id: "profile", key: "navProfile", label: "Health Profile & ABHA", labelHi: "स्वास्थ्य प्रोफ़ाइल व आभा", tab: "profile", icon: User, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.16)", keywords: ["profile", "abha", "id", "allergy", "आभा", "प्रोफाइल"] }
];

export default function TopHeader({
  activeTab,
  onOpenEmergency,
  onOpenHealthPassport,
  _onOpenDoctorPrep,
  _isSidebarOpen,
  onToggleSidebar,
  lang,
  setLang,
  theme,
  setTheme,
  onNavigate,
  onOpenApiKeyModal
}) {
  const t = translations[lang] || translations.en;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const langContainerRef = useRef(null);

  // Close search & language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (langContainerRef.current && !langContainerRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Ctrl + K / Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered search results
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredResults = trimmedQuery ? SEARCH_CATEGORIES.filter((item) => {
    const matchesLabel = item.label.toLowerCase().includes(trimmedQuery);
    const matchesHi = item.labelHi.toLowerCase().includes(trimmedQuery);
    const matchesKeyword = item.keywords.some(k => k.toLowerCase().includes(trimmedQuery));
    return matchesLabel || matchesHi || matchesKeyword;
  }) : SEARCH_CATEGORIES;

  const handleSelectResult = (item) => {
    if (item.tab === "passport" || item.id === "passport") {
      if (onOpenHealthPassport) onOpenHealthPassport();
    } else if (onNavigate) {
      onNavigate(item.tab);
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!trimmedQuery) return;

    if (filteredResults.length > 0) {
      handleSelectResult(filteredResults[0]);
    } else if (onNavigate) {
      // Direct clinical query to AI Copilot
      onNavigate("copilot", searchQuery);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="top-header" style={{
      height: "64px",
      position: "sticky",
      top: 0,
      zIndex: 90,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      background: "var(--bg-nav)",
      borderBottom: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      gap: "14px",
      transition: "background 0.25s ease"
    }}>
      {/* ── ZONE 1 (LEFT): Brand Title + Nav Links ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        {/* Mobile Hamburger Toggle Button */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="show-on-mobile mobile-menu-btn"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)",
              cursor: "pointer",
              padding: 0
            }}
            aria-label="Toggle navigation drawer"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Brand Logo & Heading: Health Command Center */}
        <div 
          onClick={() => onNavigate && onNavigate("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          title="PulseAI Health Command Center"
        >
          <LogoIcon size={30} />
          <h1 
            style={{ 
              fontSize: "1.1rem", 
              fontWeight: 800, 
              color: "var(--text-highlight)", 
              letterSpacing: "-0.025em",
              margin: 0,
              whiteSpace: "nowrap"
            }}
          >
            {t.healthCommandCenter || "Health Command Center"}
          </h1>
        </div>

        {/* Vertical Divider */}
        <div className="nav-vertical-divider hide-on-mobile" style={{ margin: "0 4px" }} />

        {/* Separate Navigation Boxes: Home, Lab Reports, Find Doctors */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hide-on-mobile" aria-label="Primary Navigation">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            const linkLabel = t[link.key] || t[link.id] || link.label;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate && onNavigate(link.id)}
                className={`nav-box-btn ${isActive ? "active" : ""}`}
                style={{
                  background: isActive ? link.activeBg : "var(--bg-elevated)",
                  borderColor: isActive ? link.borderColor : "var(--border-color)",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  boxShadow: isActive 
                    ? `0 2px 14px ${link.bg}, inset 0 1px 0 rgba(255, 255, 255, 0.12)` 
                    : "var(--glass-highlight), var(--shadow-sm)"
                }}
                title={linkLabel}
              >
                <div style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "7px",
                  background: isActive ? link.color : link.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "#ffffff" : link.color,
                  flexShrink: 0,
                  transition: "all 0.2s ease"
                }}>
                  <Icon size={13} strokeWidth={isActive ? 2.5 : 2.2} />
                </div>
                <span style={{ fontWeight: isActive ? 700 : 600 }}>{linkLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── ZONE 2 (CENTER): Global Interactive Search Bar ── */}
      <div 
        ref={searchContainerRef}
        style={{ 
          flex: 1, 
          maxWidth: "380px", 
          minWidth: "180px", 
          position: "relative"
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: "relative", width: "100%" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-elevated)",
            border: isSearchOpen ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "0 14px",
            height: "38px",
            boxShadow: isSearchOpen ? "0 0 14px rgba(2, 132, 199, 0.22)" : "var(--shadow-sm)",
            transition: "all 0.2s ease"
          }}>
            <Search size={16} color="var(--primary)" style={{ flexShrink: 0, marginRight: "10px" }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={t.searchPlaceholder || "Search..."}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "0.85rem",
                color: "var(--text-highlight)"
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "2px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Live Search Suggestions Dropdown */}
        {isSearchOpen && (
          <div 
            className="glass-panel"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-lg)",
              padding: "8px",
              zIndex: 110,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              maxHeight: "320px",
              overflowY: "auto",
              animation: "fadeIn 0.18s ease"
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", padding: "4px 8px" }}>
              {trimmedQuery ? (t.searchMatching || "Matching Results") : (t.quickAccess || "Quick Access")}
            </div>

            {filteredResults.length === 0 ? (
              <div 
                onClick={() => {
                  if (onNavigate) onNavigate("copilot", searchQuery);
                  setIsSearchOpen(false);
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "var(--primary-soft)",
                  color: "var(--primary)"
                }}
              >
                <Sparkles size={16} />
                <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  {`${t.askCopilot || "Ask Copilot"}: "${searchQuery}"`}
                </div>
              </div>
            ) : (
              filteredResults.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="interactive-card"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: item.bg || "rgba(59, 130, 246, 0.16)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color || "var(--primary)",
                        flexShrink: 0
                      }}>
                        <Icon size={15} color={item.color || "var(--primary)"} />
                      </div>
                      <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                        {(item.key && t[item.key]) || (lang === "hi" ? item.labelHi : item.label)}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                      {t.openArrow || "Open →"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── ZONE 3 (RIGHT): Action Cluster (Passport + SOS + Theme + Language) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {/* Doctor Health Passport Quick Button */}
        {onOpenHealthPassport && (
          <button
            onClick={onOpenHealthPassport}
            className="header-icon-btn"
            title={t.healthPassportPdf || "Doctor Health Passport (PDF)"}
            aria-label="Doctor Health Passport"
            style={{
              color: "#10b981",
              borderColor: "rgba(16, 185, 129, 0.35)",
              background: "rgba(16, 185, 129, 0.12)",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.18)"
            }}
          >
            <FileCheck2 size={17} />
          </button>
        )}

        {/* SOS Emergency Button (Icon Only, Prominent Red Alert Pulse) */}
        <button
          onClick={onOpenEmergency}
          className="sos-icon-btn"
          title={t.sosIce || "Emergency SOS ID"}
          aria-label="Emergency SOS ID"
        >
          <AlertOctagon size={18} strokeWidth={2.4} />
        </button>

        {/* Vertical Divider */}
        <div className="nav-vertical-divider" style={{ margin: "0 2px" }} />

        {/* Gemini AI Engine Configuration Button */}
        {onOpenApiKeyModal && (
          <button
            onClick={onOpenApiKeyModal}
            className="header-icon-btn"
            title={getStoredApiKey() ? "Google Gemini Live AI Connected 🟢 (Click to configure)" : "Configure Gemini API Key / AI Engine 🔑"}
            aria-label="Configure AI Engine"
            style={{
              color: getStoredApiKey() ? "#10b981" : "var(--primary)",
              borderColor: getStoredApiKey() ? "rgba(16, 185, 129, 0.45)" : "var(--border-color)",
              background: getStoredApiKey() ? "rgba(16, 185, 129, 0.12)" : "var(--bg-elevated)",
              position: "relative"
            }}
          >
            <Key size={17} />
            {getStoredApiKey() && (
              <span style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981"
              }} />
            )}
          </button>
        )}

        {/* Light / Dark Mode Toggle Button */}
        {setTheme && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="header-icon-btn"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#0284c7" />}
          </button>
        )}

        {/* Multilingual Selector Icon Button with Dropdown Popup */}
        <div ref={langContainerRef} style={{ position: "relative" }} className="notranslate" translate="no" lang="zxx">
          <button
            onClick={() => setIsLangOpen(prev => !prev)}
            className={`header-icon-btn notranslate ${isLangOpen ? "is-active" : ""}`}
            translate="no"
            lang="zxx"
            title="Change Language / भाषा बदलें"
            aria-label="Language Selector"
          >
            <Languages size={17} color="var(--primary)" />
          </button>

          {isLangOpen && (
            <div 
              className="glass-panel notranslate"
              translate="no"
              lang="zxx"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: "220px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
                boxShadow: "var(--shadow-lg)",
                padding: "8px",
                zIndex: 120,
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                maxHeight: "340px",
                overflowY: "auto",
                animation: "fadeIn 0.15s ease"
              }}
            >
              <div 
                className="notranslate lang-static-title"
                data-title="SELECT LANGUAGE"
                translate="no"
                lang="zxx"
                style={{ 
                  fontSize: "0.7rem", 
                  fontWeight: 800, 
                  color: "var(--text-dim)", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.04em",
                  padding: "4px 8px 6px 8px",
                  borderBottom: "1px solid var(--border-color)",
                  marginBottom: "4px"
                }} 
              />

              {SUPPORTED_NAV_LANGUAGES.map((l) => {
                const isSelected = lang === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    className="notranslate"
                    translate="no"
                    lang="zxx"
                    aria-label={`${l.label} (${l.native})`}
                    onClick={() => {
                      setLang(l.id);
                      setIsLangOpen(false);
                      try {
                        triggerGoogleTranslate(l.id);
                      } catch {
                        // Ignored
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: isSelected ? "var(--primary-soft)" : "transparent",
                      color: isSelected ? "var(--primary)" : "var(--text-main)",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "var(--bg-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div className="notranslate" translate="no" lang="zxx" style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                      {l.country === "uk" ? <UKFlagIcon /> : <IndiaFlagIcon />}
                      <span className="lang-static-label notranslate" data-label={l.label} translate="no" lang="zxx" />
                      <span 
                        className="lang-static-native notranslate" 
                        data-native={`(${l.native})`} 
                        translate="no" 
                        lang="zxx"
                        style={{ 
                          color: isSelected ? "var(--primary)" : "var(--text-dim)", 
                          opacity: 0.85 
                        }} 
                      />
                    </div>
                    {isSelected && <Check size={14} color="var(--primary)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
