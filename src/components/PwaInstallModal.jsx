import React, { useState } from "react";
import { 
  X, 
  Smartphone, 
  CheckCircle2, 
  Download, 
  Share2, 
  Monitor, 
  WifiOff, 
  ShieldCheck, 
  Zap,
  Sparkles
} from "lucide-react";

export default function PwaInstallModal({ 
  isOpen, 
  onClose, 
  installPrompt, 
  onInstallSuccess,
  lang = 'en' 
}) {
  const [activePlatform, setActivePlatform] = useState("android");
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    setIsInstalling(true);
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    } catch (err) {
      console.warn("PWA install error:", err);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        animation: "fadeIn 0.2s ease"
      }}
    >
      <div 
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "490px",
          borderRadius: "22px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(99, 102, 241, 0.08))",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)"
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "PulseAI ऐप इनस्टॉल करें" : "Install PulseAI Mobile App"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--text-muted)" }}>
                {lang === "hi" ? "बिना इंटरनेट ऑफलाइन इमरजेंसी सहायता के लिए" : "Fast native experience & offline emergency ready"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Key Advantages Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px"
          }}>
            <div style={{
              padding: "10px 12px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <WifiOff size={16} color="var(--primary)" />
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "100% ऑफ़लाइन उपलब्ध" : "100% Offline Access"}
              </div>
            </div>
            <div style={{
              padding: "10px 12px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <ShieldCheck size={16} color="#10b981" />
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "इमरजेंसी ID सुरक्षित" : "Emergency ID Cached"}
              </div>
            </div>
            <div style={{
              padding: "10px 12px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Zap size={16} color="#f59e0b" />
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "सुपरफास्ट लोडिंग" : "Instant Launch"}
              </div>
            </div>
            <div style={{
              padding: "10px 12px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Sparkles size={16} color="#8b5cf6" />
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "प्ले-स्टोर की जरूरत नहीं" : "No App Store Needed"}
              </div>
            </div>
          </div>

          {/* Direct 1-Click Install Button if supported by Browser */}
          {installPrompt && (
            <div style={{
              background: "linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(99, 102, 241, 0.15))",
              border: "1.5px solid var(--primary)",
              borderRadius: "14px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "📱 आपका ब्राउज़र 1-क्लिक इनस्टॉल का समर्थन करता है:" : "📱 Your browser supports 1-click install:"}
              </div>
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Download size={18} />
                <span>
                  {isInstalling 
                    ? (lang === "hi" ? "इनस्टॉल हो रहा है..." : "Installing...") 
                    : (lang === "hi" ? "फ़ोन / लैपटॉप में इनस्टॉल करें (Install App)" : "Install App to Device Now")}
                </span>
              </button>
            </div>
          )}

          {/* Platform Step-by-Step Instructions */}
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
              {lang === "hi" ? "मैन्युअल रूप से होम स्क्रीन पर जोड़ने का तरीका:" : "Manual Steps for Your Device:"}
            </div>

            {/* Platform Tab Switcher */}
            <div style={{
              display: "flex",
              borderRadius: "10px",
              background: "var(--bg-elevated)",
              padding: "3px",
              gap: "4px",
              marginBottom: "12px"
            }}>
              <button
                type="button"
                onClick={() => setActivePlatform("android")}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: activePlatform === "android" ? "var(--primary)" : "transparent",
                  color: activePlatform === "android" ? "#ffffff" : "var(--text-muted)",
                  transition: "all 0.2s"
                }}
              >
                🤖 Android / Chrome
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform("ios")}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: activePlatform === "ios" ? "var(--primary)" : "transparent",
                  color: activePlatform === "ios" ? "#ffffff" : "var(--text-muted)",
                  transition: "all 0.2s"
                }}
              >
                🍏 iPhone / iOS
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform("desktop")}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: activePlatform === "desktop" ? "var(--primary)" : "transparent",
                  color: activePlatform === "desktop" ? "#ffffff" : "var(--text-muted)",
                  transition: "all 0.2s"
                }}
              >
                💻 Desktop / PC
              </button>
            </div>

            {/* Platform Guides */}
            <div style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              fontSize: "0.8rem",
              lineHeight: 1.6,
              color: "var(--text-main)"
            }}>
              {activePlatform === "android" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <CheckCircle2 size={14} color="var(--primary)" />
                    <strong>Google Chrome / Samsung Internet:</strong>
                  </div>
                  <div>1. ऊपर दाईं ओर <strong>तीन बिंदुओं (⋮)</strong> पर टैप करें।</div>
                  <div>2. <strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें।</div>
                  <div>3. यह आपके फ़ोन पर एक असली ऐप की तरह तुरंत सेव हो जाएगी।</div>
                </div>
              )}

              {activePlatform === "ios" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Share2 size={14} color="var(--primary)" />
                    <strong>Safari on iPhone / iPad:</strong>
                  </div>
                  <div>1. नीचे दिए गए <strong>Share बटन (⎙ या [↑])</strong> पर टैप करें।</div>
                  <div>2. थोड़ा नीचे स्क्रॉल करें और <strong>"Add to Home Screen" (होम स्क्रीन पर जोड़ें)</strong> चुनें।</div>
                  <div>3. ऊपर <strong>"Add"</strong> पर टैप करें। ऐप आपके होम स्क्रीन पर आ जाएगी!</div>
                </div>
              )}

              {activePlatform === "desktop" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Monitor size={14} color="var(--primary)" />
                    <strong>Chrome / Edge Browser on PC:</strong>
                  </div>
                  <div>1. ब्राउज़र के एड्रेस बार के दाईं ओर <strong>कंप्यूटर/इनस्टॉल आइकन (⊕)</strong> पर क्लिक करें।</div>
                  <div>2. <strong>"Install"</strong> बटन पर क्लिक करें।</div>
                  <div>3. PulseAI बिना ब्राउज़र टैब्स के एक स्टैंडअलोन डेस्कटॉप ऐप की तरह खुलेगी।</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: "12px 20px",
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: "6px 16px", fontSize: "0.82rem", borderRadius: "10px" }}
          >
            {lang === "hi" ? "समझ गया / बंद करें" : "Got It / Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
