import React, { useState } from "react";
import { Key, X, CheckCircle2 } from "lucide-react";
import { getStoredApiKey, setStoredApiKey } from "../services/geminiService";

export default function ApiKeyModal({ isOpen, onClose, lang = "en" }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [statusMsg, setStatusMsg] = useState("");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setStatusMsg(lang === "hi" ? "सेटिंग्स सफलतापूर्वक अपडेट की गईं!" : "Settings updated successfully!");
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey("");
    setStoredApiKey("");
    setStatusMsg(lang === "hi" ? "हटाया गया! इन-बिल्ट ऑफलाइन क्लिनिकल इंजन सक्रिय है।" : "Cleared! Using built-in offline clinical engine.");
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Key size={20} color="var(--primary)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              {lang === "hi" ? "एआई इंजन कॉन्फ़िगरेशन" : "AI Engine Configuration"}
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: "6px" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            background: "var(--primary-soft)",
            border: "1px solid var(--primary-border)",
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "0.88rem",
            lineHeight: "1.5"
          }}>
            <strong style={{ color: "var(--primary)" }}>
              {lang === "hi" ? "डुअल-मोड इंजन:" : "Dual-Mode Engine:"}
            </strong>
            <p style={{ marginTop: "4px", color: "var(--text-main)" }}>
              {lang === "hi"
                ? "PulseAI अपने इन-बिल्ट क्लिनिकल ट्राइएज इंजन के साथ पूरी तरह से काम करता है। आप वैकल्पिक रूप से लाइव Gemini 2.0 Flash मॉडल कनेक्ट करने के लिए Google Gemini API Key जोड़ सकते हैं।"
                : "PulseAI is fully operational out of the box with its built-in clinical triage engine. You can optionally paste a Google Gemini API Key to connect live Gemini 2.0 Flash models."}
            </p>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              {lang === "hi" ? "Gemini API Key (वैकल्पिक)" : "Gemini API Key (Optional)"}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
            />
            <span style={{ fontSize: "0.74rem", color: "var(--text-dim)", marginTop: "4px", display: "block" }}>
              {lang === "hi"
                ? "आपके ब्राउज़र की लोकल मेमोरी (localStorage) में सुरक्षित रूप से सहेजा गया।"
                : "Stored securely in your browser's local memory (`localStorage`)."}
            </span>
          </div>

          {statusMsg && (
            <div style={{ color: "var(--secondary)", fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={16} />
              <span>{statusMsg}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <button type="button" onClick={handleClear} className="btn btn-secondary" style={{ fontSize: "0.84rem" }}>
              {lang === "hi" ? "इन-बिल्ट इंजन का उपयोग करें" : "Use Built-in Engine"}
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                {lang === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button type="submit" className="btn btn-primary">
                {lang === "hi" ? "कुंजी सहेजें" : "Save Key"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
