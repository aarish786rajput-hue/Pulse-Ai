import React, { useState, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import SymptomChecker from './components/SymptomChecker';
import ProfileDashboard from './components/ProfileDashboard';
import ChatCopilot from './components/ChatCopilot';
import ReportExplainer from './components/ReportExplainer';
import DischargeSummary from './components/DischargeSummary';
import MedicineTracker from './components/MedicineTracker';
import VitalsTracker from './components/VitalsTracker';
import HealthTimeline from './components/HealthTimeline';
import EmergencyIDModal from './components/EmergencyIDModal';
import DoctorPrepModal from './components/DoctorPrepModal';
import DoctorHealthPassportModal from './components/DoctorHealthPassportModal';
import ApiKeyModal from './components/ApiKeyModal';
import AuthModal from './components/AuthModal';
import DoctorsDashboard from './components/DoctorsDashboard';
import DeviceManager from './components/DeviceManager';
import FloatingCopilot from './components/FloatingCopilot';
import { mockPatients } from './data/mockPatientData';
import { calculateAge } from './utils/dateUtils';
import { translations } from './data/translations';
import { applyDomTranslations, triggerGoogleTranslate } from './utils/translator';

export default function App() {
  // ── Patient list (from localStorage or mock data) ──────────────────────────
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('pulseai_patients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({
            ...p,
            age: calculateAge(p?.dob, p?.age || 45),
            vitalsHistory: Array.isArray(p?.vitalsHistory) ? p.vitalsHistory : (mockPatients[0].vitalsHistory || []),
            todayMedications: Array.isArray(p?.todayMedications) ? p.todayMedications : (mockPatients[0].todayMedications || []),
            conditions: Array.isArray(p?.conditions) ? p.conditions : (mockPatients[0].conditions || [])
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse pulseai_patients from localStorage, using mockPatients fallback:', e);
    }
    return mockPatients.map(p => ({ ...p, age: calculateAge(p.dob, p.age || 45) }));
  });

  const [currentPatientId, setCurrentPatientId] = useState(() => {
    return (patients && patients.length > 0) ? patients[0].id : (mockPatients[0]?.id || "pt-01");
  });
  const [activeTab, setActiveTab]               = useState('dashboard');
  const [initialCopilotQuery, setInitialCopilotQuery] = useState('');
  const [initialDoctorSpecialty, setInitialDoctorSpecialty] = useState('all');
  const [pendingUploadFile, setPendingUploadFile] = useState(null);

  // ── Sidebar open/collapsed (persisted) ────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('pulseai_sidebar_open');
    return saved !== null ? saved === 'true' : window.innerWidth > 900;
  });

  // ── Language: 'en' | 'hi' (persisted) ────────────────────────────────────
  const [lang, setLang]   = useState(() => localStorage.getItem('pulseai_lang')  || 'en');

  // ── Theme: 'dark' | 'light' (persisted) ──────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('pulseai_theme') || 'dark');

  // ── Modal visibility ──────────────────────────────────────────────────────
  const [isEmergencyOpen,      setIsEmergencyOpen]      = useState(false);
  const [isDoctorPrepOpen,     setIsDoctorPrepOpen]     = useState(false);
  const [isHealthPassportOpen, setIsHealthPassportOpen] = useState(false);
  const [isApiKeyModalOpen,    setIsApiKeyModalOpen]    = useState(false);
  const [isAuthModalOpen,   setIsAuthModalOpen]   = useState(false);
  const [isOnline,          setIsOnline]          = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [isLoggedIn,        setIsLoggedIn]        = useState(() => {
    const saved = localStorage.getItem('pulseai_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  // ── Online/Offline Network Listener ───────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── Ctrl+B / Cmd+B — toggle sidebar ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Persist state changes to localStorage ─────────────────────────────────
  useEffect(() => { localStorage.setItem('pulseai_sidebar_open', isSidebarOpen); }, [isSidebarOpen]);
  useEffect(() => { localStorage.setItem('pulseai_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('pulseai_lang', lang); }, [lang]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulseai_theme', theme);
  }, [theme]);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    try {
      triggerGoogleTranslate(lang);
    } catch {
      // Ignored
    }
    const timer = setTimeout(() => {
      try {
        applyDomTranslations(lang);
      } catch {
        // Ignored
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [lang, activeTab, currentPatientId]);

  // ── Current patient — age always recomputed from DOB ──────────────────────
  const rawPatient = (patients && patients.find(p => p.id === currentPatientId)) || (patients && patients[0]) || mockPatients[0];
  const currentPatient = {
    ...rawPatient,
    age: calculateAge(rawPatient?.dob, rawPatient?.age || 45),
    vitalsHistory: Array.isArray(rawPatient?.vitalsHistory) ? rawPatient.vitalsHistory : (mockPatients[0].vitalsHistory || []),
    todayMedications: Array.isArray(rawPatient?.todayMedications) ? rawPatient.todayMedications : (mockPatients[0].todayMedications || []),
    conditions: Array.isArray(rawPatient?.conditions) ? rawPatient.conditions : (mockPatients[0].conditions || [])
  };

  // ── Update fields on the active patient ───────────────────────────────────
  const updateCurrentPatient = (updatedFields) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== currentPatient.id) return p;
      const merged = { ...p, ...updatedFields };
      if (merged.dob) merged.age = calculateAge(merged.dob, merged.age || 45);
      return merged;
    }));
  };

  // ── Medication actions ─────────────────────────────────────────────────────
  const handleToggleMedication = (medId) => {
    const meds = currentPatient.todayMedications || [];
    updateCurrentPatient({
      todayMedications: meds.map(m =>
        m.id === medId ? { ...m, taken: !m.taken } : m
      )
    });
  };

  const handleAddMedication = (newMed) => {
    updateCurrentPatient({ todayMedications: [...currentPatient.todayMedications, newMed] });
  };

  // ── Vitals action ──────────────────────────────────────────────────────────
  const handleAddVital = (newVital) => {
    updateCurrentPatient({ vitalsHistory: [...currentPatient.vitalsHistory, newVital] });
  };

  // ── Timeline action ────────────────────────────────────────────────────────
  const handleAddTimelineEvent = (newEvent) => {
    updateCurrentPatient({ timelineEvents: [newEvent, ...(currentPatient.timelineEvents || [])] });
  };

  // ── Navigate between tabs (optional pre-fill for AI copilot / doctors) ────
  const handleNavigate = (tab, query = '', specialty = 'all') => {
    setActiveTab(tab);
    if (tab === 'copilot' && query) setInitialCopilotQuery(query);
    if (tab === 'doctors' && specialty) setInitialDoctorSpecialty(specialty);
  };

  // ── Auth session actions ──────────────────────────────────────────────────
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('pulseai_logged_in', 'false');
  };

  const handleLogin = (patientId = null) => {
    setIsLoggedIn(true);
    localStorage.setItem('pulseai_logged_in', 'true');
    if (patientId) setCurrentPatientId(patientId);
    setIsAuthModalOpen(false);
  };

  const handleRegisterPatient = (newPatient) => {
    setPatients(prev => {
      const updated = [newPatient, ...prev];
      try {
        localStorage.setItem('pulseai_patients', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save pulseai_patients to localStorage:', e);
      }
      return updated;
    });
    setCurrentPatientId(newPatient.id);
    setIsLoggedIn(true);
    localStorage.setItem('pulseai_logged_in', 'true');
    setIsAuthModalOpen(false);
  };

  // ── Context value: shared globally, avoids prop drilling ──────────────────
  const contextValue = {
    lang, setLang,
    theme, setTheme,
    currentPatient,
    patients,
    setCurrentPatientId,
    updateCurrentPatient,
    openApiKeyModal: () => setIsApiKeyModalOpen(true),
    openEmergency: () => setIsEmergencyOpen(true),
    openDoctorPrep: () => setIsDoctorPrepOpen(true),
    openAuthModal: () => setIsAuthModalOpen(true),
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`app-layout ${isSidebarOpen ? "has-sidebar-expanded" : "has-sidebar-collapsed"}`}>

        {/* ── LEFT SIDEBAR — collapsible navigation rail ── */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(prev => !prev)}
          currentPatient={currentPatient}
          patients={patients}
          onSelectPatient={(p) => setCurrentPatientId(p.id)}
          isLoggedIn={isLoggedIn}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* ── MAIN AREA — header + page content + footer ── */}
        <div className={`main-wrapper ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
          <TopHeader
            activeTab={activeTab}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
            onOpenHealthPassport={() => setIsHealthPassportOpen(true)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            onNavigate={handleNavigate}
          />

          {/* ── OFFLINE MODE ACTIVE WARNING BANNER ── */}
          {!isOnline && (
            <div style={{
              background: "linear-gradient(90deg, #b91c1c, #dc2626)",
              color: "#ffffff",
              padding: "9px 20px",
              fontSize: "0.82rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
              animation: "fadeIn 0.25s ease",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.05rem" }}>📶</span>
                <span>
                  {t.offlineNotice || (lang === "hi"
                    ? "ऑफ़लाइन मोड सक्रिय: इंटरनेट डिस्कनेक्ट है। इमरजेंसी मेडिकल ID व दवाइयां बिना इंटरनेट सुरक्षित उपलब्ध हैं।"
                    : "Offline Mode Active: Internet disconnected. Emergency Health ID & Medications remain fully accessible offline.")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyOpen(true)}
                style={{
                  background: "#ffffff",
                  color: "#b91c1c",
                  border: "none",
                  borderRadius: "8px",
                  padding: "4px 14px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                }}
              >
                {t.sosIce || "🚨 View Emergency ID"}
              </button>
            </div>
          )}

          <main className={`main-content ${activeTab === 'copilot' ? 'copilot-main-layout' : ''}`}>
            {activeTab === 'dashboard' && (
              <Dashboard
                patient={currentPatient}
                onNavigate={handleNavigate}
                onToggleMedication={handleToggleMedication}
                onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
                onOpenAddVital={() => setActiveTab('vitals')}
                onUploadReport={(file) => {
                  setPendingUploadFile(file);
                  setActiveTab('reports');
                }}
                lang={lang}
              />
            )}
            {activeTab === 'symptom-checker' && (
              <SymptomChecker
                patient={currentPatient}
                lang={lang}
                onAskCopilot={(q) => handleNavigate('copilot', q)}
              />
            )}
            {activeTab === 'doctors' && (
              <DoctorsDashboard
                patient={currentPatient}
                lang={lang}
                onAddTimelineEvent={handleAddTimelineEvent}
                initialSpecialty={initialDoctorSpecialty}
                onOpenDoctorListing={() => setIsAuthModalOpen(true)}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileDashboard
                key={currentPatient.id}
                patient={currentPatient}
                patients={patients}
                onSelectPatient={(p) => setCurrentPatientId(p.id)}
                onUpdatePatient={updateCurrentPatient}
                onOpenHealthPassport={() => setIsHealthPassportOpen(true)}
                lang={lang}
              />
            )}
            {activeTab === 'copilot' && (
              <ChatCopilot
                patient={currentPatient}
                lang={lang}
                initialQuery={initialCopilotQuery}
                onClearInitialQuery={() => setInitialCopilotQuery('')}
              />
            )}
            {activeTab === 'reports' && (
              <ReportExplainer
                patient={currentPatient}
                lang={lang}
                onAskCopilot={(q) => handleNavigate('copilot', q)}
                pendingUploadFile={pendingUploadFile}
                onClearPendingFile={() => setPendingUploadFile(null)}
                onUpdateVitals={handleAddVital}
                onAddTimelineEvent={handleAddTimelineEvent}
              />
            )}
            {activeTab === 'discharge' && (
              <DischargeSummary
                patient={currentPatient}
                lang={lang}
                onAskCopilot={(q) => handleNavigate('copilot', q)}
              />
            )}
            {activeTab === 'medications' && (
              <MedicineTracker
                patient={currentPatient}
                lang={lang}
                onToggleMedication={handleToggleMedication}
                onAddMedication={handleAddMedication}
              />
            )}
            {activeTab === 'devices' && (
              <DeviceManager
                patient={currentPatient}
                lang={lang}
                onAskCopilot={(q) => handleNavigate('copilot', q)}
                onUpdateVitals={handleAddVital}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}
            {activeTab === 'vitals' && (
              <VitalsTracker
                patient={currentPatient}
                lang={lang}
                onAddVital={handleAddVital}
              />
            )}
            {activeTab === 'timeline' && (
              <HealthTimeline
                patient={currentPatient}
                lang={lang}
                onAddTimelineEvent={handleAddTimelineEvent}
              />
            )}
          </main>

          {/* ── FOOTER (Hidden on Copilot for full-height chat experience) ── */}
          {activeTab !== 'copilot' && (
            <footer style={{
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-nav)',
              padding: '14px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <span>
                <strong style={{ color: 'var(--primary)' }}>PulseAI</strong>
                {' — '}
                {t.appSubtitle}
              </span>
              <span className="hide-on-mobile">
                {t.tagline}
              </span>
            </footer>
          )}
        </div>

        {/* ── GLOBAL MODALS ── */}
        <EmergencyIDModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          patient={currentPatient}
          lang={lang}
        />
        <DoctorPrepModal
          isOpen={isDoctorPrepOpen}
          onClose={() => setIsDoctorPrepOpen(false)}
          patient={currentPatient}
          lang={lang}
        />
        <DoctorHealthPassportModal
          isOpen={isHealthPassportOpen}
          onClose={() => setIsHealthPassportOpen(false)}
          patient={currentPatient}
          onUpdatePatient={updateCurrentPatient}
          lang={lang}
        />
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          lang={lang}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          patients={patients}
          currentPatient={currentPatient}
          onLogin={handleLogin}
          onRegisterPatient={handleRegisterPatient}
          onNavigate={handleNavigate}
          lang={lang}
        />

        {/* ── FLOATING AGENT AI COPILOT (Always available across all pages) ── */}
        <FloatingCopilot
          patient={currentPatient}
          lang={lang}
          onNavigate={handleNavigate}
          activeTab={activeTab}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />
      </div>
    </AppContext.Provider>
  );
}
