import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  AlertTriangle, 
  RefreshCw,
  Globe,
  History,
  Trash2,
  X,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Square
} from "lucide-react";
import { sendChatMessage } from "../services/geminiService";

const SUPPORTED_LANGUAGES = [
  { id: "hinglish", label: "🇮🇳 Hinglish (हिंग्लिश)" },
  { id: "hi", label: "🇮🇳 हिन्दी (Hindi)" },
  { id: "en", label: "🇬🇧 English" },
  { id: "bn", label: "🇮🇳 বাংলা (Bengali)" },
  { id: "mr", label: "🇮🇳 मराठी (Marathi)" },
  { id: "te", label: "🇮🇳 తెలుగు (Telugu)" },
  { id: "ta", label: "🇮🇳 தமிழ் (Tamil)" },
  { id: "gu", label: "🇮🇳 ગુજરાતી (Gujarati)" },
  { id: "pa", label: "🇮🇳 ਪੰਜਾਬੀ (Punjabi)" },
  { id: "kn", label: "🇮🇳 ಕನ್ನಡ (Kannada)" }
];

const LANG_VOICE_MAP = {
  hinglish: "hi-IN",
  hi: "hi-IN",
  en: "en-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  te: "te-IN",
  ta: "ta-IN",
  gu: "gu-IN",
  pa: "pa-IN",
  kn: "kn-IN"
};

export default function ChatCopilot({ patient, lang = 'en', initialQuery, onClearInitialQuery }) {
  // Selected communication language from dropdown
  const [chatLang, setChatLang] = useState(() => {
    return localStorage.getItem("pulseai_copilot_lang") || (lang === "hi" ? "hi" : "hinglish");
  });

  // Chat History & Session Management
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pulseai_copilot_sessions") || "[]");
    } catch {
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => `session_${Date.now()}`);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(""), 2800);
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(() => {
    return localStorage.getItem("pulseai_copilot_auto_speak") === "true";
  });
  
  // Microphone Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [micError, setMicError] = useState("");
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync language selection to localStorage
  const handleLanguageChange = (newLang) => {
    setChatLang(newLang);
    localStorage.setItem("pulseai_copilot_lang", newLang);
    showNotification(`Language: ${SUPPORTED_LANGUAGES.find(l => l.id === newLang)?.label || newLang}`);
  };

  // Helper to persist current conversation into localStorage session list
  const persistSession = useCallback((updatedMessages, sessionId) => {
    try {
      const userMsgs = updatedMessages.filter(m => m.sender === "user");
      if (userMsgs.length === 0) return;

      const firstQuestion = userMsgs[0]?.content || "Health Consultation";
      const sessionTitle = firstQuestion.length > 36 ? `${firstQuestion.slice(0, 36)}...` : firstQuestion;

      setSessions((prevSessions) => {
        const filtered = prevSessions.filter(s => s.id !== sessionId);
        const currentSession = {
          id: sessionId,
          title: sessionTitle,
          date: new Date().toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          language: chatLang,
          messages: updatedMessages
        };
        const updatedList = [currentSession, ...filtered].slice(0, 25);
        localStorage.setItem("pulseai_copilot_sessions", JSON.stringify(updatedList));
        return updatedList;
      });
    } catch (e) {
      console.warn("Error persisting chat session:", e);
    }
  }, [chatLang]);

  // ── TEXT TO SPEECH (Elderly / Senior Calm Voice Rate) ─────────────────────
  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback((text, forceStart = false) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking && !forceStart) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();

    // Clean markdown, code, urls, bullets for comfortable listening
    const cleanText = (text || "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*#_`~>[\]]/g, "")
      .replace(/[•▪▫-]\s+/g, "")
      .replace(/\n+/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANG_VOICE_MAP[chatLang] || "en-IN";
    utterance.rate = 0.93; // Calmer senior-friendly pace
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [chatLang, isSpeaking, stopSpeaking]);

  const isAutoSpeakRef = useRef(isAutoSpeak);
  useEffect(() => {
    isAutoSpeakRef.current = isAutoSpeak;
  }, [isAutoSpeak]);

  const speakTextRef = useRef(speakText);
  useEffect(() => {
    speakTextRef.current = speakText;
  }, [speakText]);

  const toggleAutoSpeak = () => {
    const nextState = !isAutoSpeak;
    setIsAutoSpeak(nextState);
    localStorage.setItem("pulseai_copilot_auto_speak", String(nextState));
    if (!nextState && isSpeaking) {
      stopSpeaking();
    }
    showNotification(
      nextState
        ? (chatLang === "hi" ? "🔊 वरिष्ठ आवाज़ मोड (ऑटो-स्पीक) चालू!" : "🔊 Senior Auto-Voice Mode Enabled!")
        : (chatLang === "hi" ? "🔇 ऑटो-स्पीक बंद किया गया" : "🔇 Auto Voice Mode Muted")
    );
  };

  const handleSend = useCallback(async (customText) => {
    const query = (customText || input).trim();
    if (!query || isLoading) return;

    setInput("");
    setInterimTranscript("");

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: `u_${now.getTime()}`,
      sender: "user",
      content: query,
      timestamp: timeStr
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const result = await sendChatMessage(newHistory, patient, lang, chatLang);
      const botMessage = {
        id: `b_${Date.now()}`,
        sender: "bot",
        content: result.text,
        triageLevel: result.triageLevel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMsgs = [...newHistory, botMessage];
      setMessages(finalMsgs);
      persistSession(finalMsgs, currentSessionId);

      // Auto Speak for Seniors / Elderly mode
      if (isAutoSpeakRef.current && result.text) {
        speakTextRef.current(result.text, true);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newHistory, {
        id: `b_err_${Date.now()}`,
        sender: "bot",
        content: chatLang === "hi" 
          ? "अनुरोध प्रोसेस करने में समस्या आई। कृपया पुनः प्रयास करें।"
          : (chatLang === "hinglish" ? "Thoda technical issue aaya. Kripya dobara poochiye." : "I encountered a momentary issue. Please try again or rephrase."),
        triageLevel: "routine",
        timestamp: "Now"
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, patient, lang, chatLang, currentSessionId, persistSession]);

  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => {
        handleSend(initialQuery);
        if (onClearInitialQuery) onClearInitialQuery();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, handleSend, onClearInitialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Clean up recognition and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup error
        }
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── ACTIVE MICROPHONE LOGIC (Speech-to-Text) ─────────────────────────────
  const toggleListening = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore stop error
        }
      }
      setIsListening(false);
      setInterimTranscript("");
      return;
    }

    setMicError("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError(
        chatLang === "en"
          ? "Speech recognition is not supported in this browser. Please use Chrome or Edge."
          : "इस ब्राउज़र में आवाज़ पहचान (Voice Input) उपलब्ध नहीं है। कृपया Google Chrome या Edge का उपयोग करें।"
      );
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn("Microphone access permission error:", err);
        setMicError(
          chatLang === "en"
            ? "Microphone access blocked. Please allow mic permissions in your browser URL bar."
            : (chatLang === "hinglish"
                ? "Microphone block hai. Kripya browser ke address bar me mic allow karein."
                : "माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में Mic Allow करें।")
        );
        return;
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LANG_VOICE_MAP[chatLang] || "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setMicError("");
      };

      recognition.onresult = (event) => {
        let currentInterim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          setInput((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript).trim());
          setInterimTranscript("");
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicError(
            chatLang === "en"
              ? "Microphone permission denied. Please allow microphone in your browser."
              : "माइक्रोफ़ोन ब्लॉक है। कृपया ब्राउज़र एड्रेस बार में लॉक आइकॉन पर क्लिक करके Mic Allow करें।"
          );
        } else if (event.error === "no-speech") {
          setMicError(
            chatLang === "en"
              ? "No voice heard. Please tap the mic and speak clearly."
              : "कोई आवाज़ सुनाई नहीं दी। कृपया दोबारा माइक दबाकर बोलें।"
          );
        } else if (event.error !== "aborted") {
          setMicError(`Mic notice: ${event.error}`);
        }
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.start();
    } catch (e) {
      console.error("Speech recognition startup error:", e);
      setMicError(
        chatLang === "en"
          ? "Could not start microphone. Please check your browser audio settings."
          : "माइक्रोफ़ोन शुरू नहीं हो सका। कृपया ब्राउज़र सेटिंग्स जांचें।"
      );
      setIsListening(false);
    }
  };

  // ── DELETE ACTIVE CHAT / START FRESH ─────────────────────────────────────
  const handleDeleteCurrentChat = () => {
    // Remove current session from saved list
    try {
      const existing = JSON.parse(localStorage.getItem("pulseai_copilot_sessions") || "[]");
      const updated = existing.filter(s => s.id !== currentSessionId);
      localStorage.setItem("pulseai_copilot_sessions", JSON.stringify(updated));
      setSessions(updated);
    } catch {}

    // Reset conversation
    setMessages([]);
    setInput("");
    setInterimTranscript("");
    setCurrentSessionId(() => `session_${Date.now()}`);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    showNotification(chatLang === "hi" ? "चैट सफलतापूर्वक डिलीट की गई!" : "Chat Deleted Successfully!");
  };

  // ── LOAD SESSION FROM HISTORY ────────────────────────────────────────────
  const handleLoadSession = (session) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    if (session.language) {
      setChatLang(session.language);
    }
    setIsHistoryOpen(false);
    showNotification(chatLang === "hi" ? "पिछली चैट लोड की गई" : "Chat Session Loaded");
  };

  // ── DELETE INDIVIDUAL HISTORY SESSION ────────────────────────────────────
  const handleDeleteHistorySession = (e, sessionId) => {
    e.stopPropagation();
    try {
      const existing = JSON.parse(localStorage.getItem("pulseai_copilot_sessions") || "[]");
      const updated = existing.filter(s => s.id !== sessionId);
      localStorage.setItem("pulseai_copilot_sessions", JSON.stringify(updated));
      setSessions(updated);

      if (sessionId === currentSessionId) {
        setMessages([]);
        setCurrentSessionId(() => `session_${Date.now()}`);
      }
      showNotification(chatLang === "hi" ? "सत्र हटाया गया" : "Session Removed");
    } catch {}
  };

  // ── CLEAR ALL HISTORY ───────────────────────────────────────────────────
  const handleClearAllHistory = () => {
    localStorage.removeItem("pulseai_copilot_sessions");
    setSessions([]);
    handleDeleteCurrentChat();
    setIsHistoryOpen(false);
    showNotification(chatLang === "hi" ? "पूरा इतिहास साफ़ किया गया!" : "All Chat History Cleared!");
  };

  // Dynamic quick prompts adapted to simple language for all 10 languages
  const quickPromptsByLang = {
    hi: [
      "HbA1c 7.2% का क्या आसान मतलब है?",
      "चक्कर और हाथ कांप रहे हैं, क्या शुगर कम है?",
      "टेल्मिसार्टन के साथ कौन सा पेनकिलर सुरक्षित है?",
      "डॉक्टर से पूछने के लिए 3 जरूरी सवाल",
      "कोलेस्ट्रॉल कम करने के आसान उपाय"
    ],
    hinglish: [
      "HbA1c 7.2% ka kya aasan matlab hai?",
      "Chakkar aur kamkampi aa rahi hai, kya sugar low hai?",
      "BP ki dawa ke saath headache ki konsi goli safe hai?",
      "Doctor se milne se pehle kya 3 sawal poochein?",
      "Rosuvastatin raat ko kyu lete hain?"
    ],
    bn: [
      "HbA1c 7.2% এর সহজ অর্থ কী?",
      "মাথা ঘুরছে এবং হাত কাঁপছে, সুগার কি কম?",
      "রক্তচাপের ওষুধের সাথে কোন ব্যথানাশক নিরাপদ?",
      "ডাক্তারকে জিজ্ঞাসা করার ৩টি গুরুত্বপূর্ণ প্রশ্ন",
      "কোলেস্টেরল নিয়ন্ত্রণের সহজ নিয়ম"
    ],
    mr: [
      "HbA1c 7.2% चा सोपा अर्थ काय आहे?",
      "चक्कर येत आहे, शुगर कमी झाली आहे का?",
      "बीपीच्या औषधासोबत कोणती पेनकिलर सुरक्षित आहे?",
      "डॉक्टरांना विचारण्यासाठी ३ महत्त्वाचे प्रश्न",
      "कोलेस्टेरॉल कमी करण्याचे सोपे उपाय"
    ],
    pa: [
      "HbA1c 7.2% ਦਾ ਸੌਖਾ ਮਤਲਬ ਕੀ ਹੈ?",
      "ਚੱਕਰ ਆ ਰਹੇ ਹਨ, ਕੀ ਸ਼ੂਗਰ ਘੱਟ ਗਈ ਹੈ?",
      "ਬੀਪੀ ਦੀ ਦਵਾਈ ਨਾਲ ਕਿਹੜੀ ਪੇਨਕਿਲਰ ਸੁਰੱਖਿਅਤ ਹੈ?",
      "ਡਾਕਟਰ ਨੂੰ ਪੁੱਛਣ ਲਈ 3 ਜ਼ਰੂਰੀ ਸਵਾਲ",
      "ਕੋਲੈਸਟ੍ਰੋਲ ਕੰਟਰੋਲ ਕਰਨ ਦੇ ਆਸਾਨ ਨੁਸਖੇ"
    ],
    ta: [
      "HbA1c 7.2% என்பதன் எளிய விளக்கம் என்ன?",
      "தலைச்சுற்றல் உள்ளது, சர்க்கரை அளவு குறைந்துள்ளதா?",
      "ரத்த அழுத்த மாத்திரையுடன் எந்த வலி நிவாரணி பாதுகாப்பானது?",
      "மருத்துவரிடம் கேட்க வேண்டிய 3 முக்கிய கேள்விகள்",
      "கொலஸ்ட்ராலை குறைக்கும் எளிய வழிகள்"
    ],
    te: [
      "HbA1c 7.2% అంటే సరళమైన అర్థం ఏమిటి?",
      "తలతిరుగుతోంది, షుగర్ లెవెల్ తగ్గిపోయిందా?",
      "బీపీ మందుతో పాటు ఏ పెయిన్‌కిల్లర్ సురక్షితం?",
      "వైద్యుడిని అడగవలసిన 3 ముఖ్యమైన ప్రశ్నలు",
      "కొలెస్ట్రాల్ తగ్గించే సులభమైన చిట్కాలు"
    ],
    gu: [
      "HbA1c 7.2% નો સરળ અર્થ શું થાય?",
      "ચક્કર આવે છે, શું સુગર ઘટી ગઈ છે?",
      "બીપીની દવા સાથે કઈ પેઇનકિલર સુરક્ષિત છે?",
      "ડોક્ટરને પૂછવા માટેના 3 જરૂરી પ્રશ્નો",
      "કોલેસ્ટ્રોલ કંટ્રોલ કરવાના સરળ ઉપાય"
    ],
    kn: [
      "HbA1c 7.2% ನ ಸರಳ ಅರ್ಥವೇನು?",
      "ತಲೆಸುತ್ತು ಬರುತ್ತಿದೆ, ಶುಗರ್ ಕಡಿಮೆಯಾಗಿದೆಯೇ?",
      "ಬಿಪಿ ಮಾತ್ರೆ ಜೊತೆಗೆ ಯಾವ ನೋವು ನಿವಾರಕ ಸುರಕ್ಷಿತ?",
      "ವೈದ್ಯರನ್ನು ಕೇಳಬೇಕಾದ 3 ಮುಖ್ಯ ಪ್ರಶ್ನೆಗಳು",
      "ಕೊಲೆಸ್ಟ್ರಾಲ್ ನಿಯಂತ್ರಿಸುವ ಸರಳ ವಿಧಾನಗಳು"
    ],
    en: [
      "What does an HbA1c of 7.2% mean in simple words?",
      "Feeling dizzy and shaky - is my sugar low?",
      "What painkiller is safe with my BP medicine?",
      "3 simple questions for my doctor visit",
      "Why take Rosuvastatin at night?"
    ]
  };

  const quickPrompts = quickPromptsByLang[chatLang] || quickPromptsByLang.en;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      flex: 1,
      minHeight: 0,
      gap: "10px",
      position: "relative"
    }}>
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: "absolute",
          top: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 120,
          background: "var(--bg-elevated)",
          border: "1px solid var(--primary)",
          color: "var(--text-highlight)",
          boxShadow: "var(--shadow-md)",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "0.82rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          animation: "fadeIn 0.2s ease"
        }}>
          <CheckCircle2 size={15} color="var(--primary)" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header Bar: Clean, Very Short Subtitle, Language Dropdown, History & Delete */}
      <div className="glass-panel" style={{
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
        flexShrink: 0,
        borderRadius: "16px"
      }}>
        {/* Left: Bot Icon + Simple Title & Very Short Subtitle (No Long Illness Text) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 3px 10px rgba(2, 132, 199, 0.25)"
          }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h2 style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-highlight)", margin: 0, lineHeight: 1.2 }}>
                {chatLang === "hi" ? "एआई हेल्थ कोपायलट" : "AI Health Copilot"}
              </h2>
              <span className="badge badge-good" style={{ fontSize: "0.68rem", padding: "1px 6px" }}>
                {chatLang === "hi" ? "सरल भाषा" : "Simple"}
              </span>
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "1px" }}>
              {patient?.name ? `Patient: ${patient.name}` : "Personal Health Assistant"}
            </div>
          </div>
        </div>

        {/* Right: Language Dropdown, Chat History, Chat Delete, New Chat */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* 1. Multiple Languages Dropdown */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            padding: "4px 10px"
          }}>
            <Globe size={14} color="var(--primary)" />
            <select
              value={chatLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-highlight)",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                outline: "none"
              }}
              title="Select AI Copilot Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id} style={{ background: "var(--bg-card)", color: "var(--text-main)" }}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Chat History Button */}
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.78rem", borderRadius: "10px", fontWeight: 700 }}
            title={chatLang === "hi" ? "पिछली चैट देखें" : "View Chat History"}
          >
            <History size={14} color="var(--secondary)" />
            <span>{chatLang === "hi" ? "हिस्ट्री" : "History"}</span>
            {sessions.length > 0 && (
              <span style={{
                background: "var(--secondary-soft)",
                color: "var(--secondary)",
                borderRadius: "10px",
                padding: "1px 6px",
                fontSize: "0.7rem",
                fontWeight: 800
              }}>
                {sessions.length}
              </span>
            )}
          </button>

          {/* 3. Senior Auto Voice Mode Toggle */}
          <button
            type="button"
            onClick={toggleAutoSpeak}
            className={`btn ${isAutoSpeak ? "btn-primary" : "btn-secondary"}`}
            style={{
              padding: "6px 12px",
              fontSize: "0.78rem",
              borderRadius: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: isAutoSpeak ? "linear-gradient(135deg, var(--primary), #2563eb)" : undefined,
              color: isAutoSpeak ? "#ffffff" : "var(--text-main)",
              borderColor: isAutoSpeak ? "transparent" : "var(--border-color)",
              boxShadow: isAutoSpeak ? "0 2px 10px rgba(2, 132, 199, 0.35)" : "none"
            }}
            title={
              isAutoSpeak
                ? (chatLang === "hi" ? "ऑटो-स्पीक चालू है (क्लिक करके बंद करें)" : "Auto Voice ON (Click to mute)")
                : (chatLang === "hi" ? "बुजुर्गों के लिए ऑटो-स्पीक चालू करें (बोलकर सुनाएगा)" : "Enable Senior Auto Voice Mode")
            }
          >
            {isAutoSpeak ? <Volume2 size={14} color="#ffffff" /> : <VolumeX size={14} />}
            <span>
              {isAutoSpeak 
                ? (chatLang === "hi" ? "ऑटो-बोलें ON" : "Auto Voice ON") 
                : (chatLang === "hi" ? "बोलकर सुनें" : "Voice Mode")}
            </span>
          </button>

          {/* 4. Chat Delete Button */}
          <button
            type="button"
            onClick={handleDeleteCurrentChat}
            className="btn btn-secondary"
            style={{
              padding: "6px 12px",
              fontSize: "0.78rem",
              borderRadius: "10px",
              fontWeight: 700,
              color: "#ef4444",
              borderColor: "rgba(239, 68, 68, 0.3)"
            }}
            title={chatLang === "hi" ? "यह बातचीत डिलीट करें" : "Delete Current Chat"}
          >
            <Trash2 size={14} color="#ef4444" />
            <span>{chatLang === "hi" ? "डिलीट चैट" : "Delete"}</span>
          </button>

          {/* 5. New Chat Button */}
          <button
            type="button"
            onClick={handleDeleteCurrentChat}
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.78rem", borderRadius: "10px" }}
            title="Start a fresh chat"
          >
            <RefreshCw size={13} />
            <span>{chatLang === "hi" ? "नई चैट" : "New Chat"}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div 
        className="no-scrollbar" 
        style={{ 
          display: "flex", 
          gap: "8px", 
          overflowX: "auto", 
          paddingBottom: "2px", 
          flexShrink: 0 
        }}
      >
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="btn btn-secondary"
            style={{
              padding: "6px 14px",
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
              borderRadius: "20px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)"
            }}
          >
            <Sparkles size={13} color="var(--primary)" />
            <span>{qp}</span>
          </button>
        ))}
      </div>

      {/* Active Speech Playing Banner (Elderly / Senior Audio Indicator) */}
      {isSpeaking && (
        <div style={{
          background: "linear-gradient(90deg, rgba(2, 132, 199, 0.12), rgba(99, 102, 241, 0.12))",
          border: "1px solid rgba(2, 132, 199, 0.35)",
          borderRadius: "14px",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "fadeIn 0.25s ease",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 0 12px rgba(2, 132, 199, 0.5)"
            }}>
              <Volume2 size={15} />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                {chatLang === "hi" ? "कोपायलट बोलकर सुना रहा है..." : "Copilot is speaking aloud..."}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {chatLang === "hi" ? "सरल उच्चारण व स्पष्ट गति (0.93x सीनियर पेस)" : "Senior-friendly cadence & clear pronunciation"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={stopSpeaking}
            className="btn btn-secondary"
            style={{
              padding: "4px 10px",
              fontSize: "0.74rem",
              borderRadius: "8px",
              fontWeight: 700,
              color: "#ef4444",
              borderColor: "rgba(239, 68, 68, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Square size={12} fill="#ef4444" />
            <span>{chatLang === "hi" ? "रोकें (Stop)" : "Stop"}</span>
          </button>
        </div>
      )}

      {/* Chat Messages Stream (Answering Screen Arrangement) */}
      <div className="glass-panel" style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        borderRadius: "18px"
      }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "var(--text-muted)", gap: "14px", padding: "40px 20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(2, 132, 199, 0.28)" }}>
              <Bot size={30} color="#ffffff" />
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-highlight)" }}>
              {chatLang === "hi" ? "एआई हेल्थ कोपायलट" : "AI Health Copilot"}
            </div>
            <div style={{ maxWidth: "420px", fontSize: "0.85rem", lineHeight: 1.5 }}>
              {chatLang === "hi"
                ? "नमस्ते! अपनी दवाओं, जांच रिपोर्ट या स्वास्थ्य के बारे में कोई भी सवाल पूछें। नीचे टाइप करें या माइक दबाकर बोलें।"
                : chatLang === "hinglish"
                ? "Namaste! Mujhse apni medicines, lab reports ya health ke baare me koi bhi sawal poochein. Neeche type karein ya mic dabayein."
                : chatLang === "bn"
                ? "নমস্কার! ওষুধ, ল্যাব রিপোর্ট বা স্বাস্থ্য নিয়ে যে কোনো প্রশ্ন করুন। নিচে লিখুন বা মাইকে কথা বলুন।"
                : chatLang === "mr"
                ? "नमस्कार! औषधे, लॅब रिपोर्ट्स किंवा आरोग्याविषयी कोणताही प्रश्न विचारा. खाली टाईप करा किंवा माईक दाबून बोला."
                : chatLang === "pa"
                ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਦਵਾਈਆਂ, ਲੈਬ ਰਿਪੋਰਟਾਂ ਜਾਂ ਸਿਹਤ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ। ਹੇਠਾਂ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ।"
                : chatLang === "ta"
                ? "வணக்கம்! உங்கள் மருந்துகள், பரிசோதனை முடிவுகள் பற்றி ஏதேனும் கேள்விகள் கேட்கலாம். கீழே தட்டச்சு செய்யவும் அல்லது பேசவும்."
                : chatLang === "te"
                ? "నమస్కారం! మీ మందులు, ల్యాబ్ రిపోర్టుల గురించి ఏవైనా ప్రశ్నలు అడగండి. క్రింద టైప్ చేయండి లేదా మాట్లాడండి."
                : chatLang === "gu"
                ? "નમસ્તે! દવાઓ, લેબ રિપોર્ટ અથવા આરોગ્ય વિશે કોઈ પણ સવાલ પૂછો. નીચે ટાઈપ કરો અથવા માઇક દબાવીને બોલો."
                : chatLang === "kn"
                ? "ನಮಸ್ಕಾರ! ಔಷಧಿಗಳು, ಲ್ಯಾಬ್ ವರದಿಗಳು ಅಥವಾ ಆರೋಗ್ಯದ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ. ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ."
                : "Ask me anything about your medications, lab test reports, or health queries. Type or tap the mic below to begin."}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isEmergency = msg.triageLevel === "emergency";
          const isUrgent = msg.triageLevel === "urgent";

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: "12px",
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "85%",
                flexDirection: isUser ? "row-reverse" : "row"
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: isUser ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : isEmergency ? "#ef4444" : "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {isUser ? <User size={18} color="#ffffff" /> : <Bot size={18} color="#ffffff" />}
              </div>

              {/* Message Bubble */}
              <div style={{
                background: isUser
                  ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                  : isEmergency
                  ? "var(--status-crit-bg)"
                  : isUrgent
                  ? "var(--status-warn-bg)"
                  : "var(--bg-elevated)",
                border: isEmergency
                  ? "1px solid var(--status-crit-border)"
                  : isUrgent
                  ? "1px solid var(--status-warn-border)"
                  : "1px solid var(--border-color)",
                borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                padding: "16px 20px",
                boxShadow: "var(--shadow-sm)"
              }}>
                {!isUser && isEmergency && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--status-crit-text)", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px" }}>
                    <ShieldAlert size={18} />
                    {chatLang === "hi" ? "आपातकालीन चेतावनी (EMERGENCY)" : "CRITICAL EMERGENCY ALERT"}
                  </div>
                )}
                {!isUser && isUrgent && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--status-warn-text)", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px" }}>
                    <AlertTriangle size={18} />
                    {chatLang === "hi" ? "तत्काल ध्यान देने की आवश्यकता" : "ATTENTION RECOMMENDED"}
                  </div>
                )}

                {/* Content */}
                <div style={{
                  fontSize: "0.93rem",
                  lineHeight: "1.65",
                  color: isUser ? "#ffffff" : "var(--text-main)",
                  whiteSpace: "pre-line"
                }}>
                  {msg.content}
                </div>

                {/* Footer bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", paddingTop: "6px", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "0.72rem", color: isUser ? "rgba(255, 255, 255, 0.7)" : "var(--text-dim)" }}>
                    {msg.timestamp}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.content)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX size={14} color="#ef4444" /> : <Volume2 size={14} />}
                      <span>{isSpeaking ? (chatLang === "hi" ? "रोकें" : "Stop") : (chatLang === "hi" ? "सुनें" : "Listen")}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }))}

        {isLoading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Bot size={18} color="#ffffff" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>
                {chatLang === "hi" 
                  ? "पल्स-एआई आसान शब्दों में उत्तर तैयार कर रहा है..." 
                  : (chatLang === "hinglish" 
                      ? "PulseAI aasan shabdo me answer ready kar raha hai..." 
                      : "PulseAI is crafting a simple, easy-to-understand explanation...")}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Live Active Microphone Status Banner */}
      {isListening && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(2, 132, 199, 0.08))",
          border: "1.5px solid #ef4444",
          borderRadius: "14px",
          padding: "10px 16px",
          boxShadow: "0 4px 18px rgba(239, 68, 68, 0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 10px #ef4444"
            }} />
            <div>
              <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-highlight)" }}>
                {chatLang === "hi" 
                  ? "🎙️ माइक सक्रिय है — कृपया स्पष्ट बोलें..." 
                  : (chatLang === "hinglish" ? "🎙️ Mic active hai — kripya boliye..." : "🎙️ Microphone is Active — speak clearly now...")}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {interimTranscript 
                  ? `"${interimTranscript}"` 
                  : (chatLang === "hi" ? "हिंदी, हिंग्लिश या अन्य भाषा में कुछ भी बोलें" : "Speaking in your selected language works automatically")}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleListening}
            className="btn btn-secondary"
            style={{
              padding: "5px 12px",
              fontSize: "0.78rem",
              borderRadius: "10px",
              borderColor: "#ef4444",
              color: "#ef4444",
              fontWeight: 700
            }}
          >
            {chatLang === "hi" ? "बोलना समाप्त करें" : "Done / Stop"}
          </button>
        </div>
      )}

      {/* Microphone Error Notification */}
      {micError && (
        <div style={{
          background: "var(--status-warn-bg)",
          border: "1px solid var(--status-warn-border)",
          color: "var(--status-warn-text)",
          padding: "8px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertTriangle size={15} />
            <span>{micError}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setMicError("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form with Active Mic Button - Docked neatly at bottom */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel"
        style={{
          flexShrink: 0,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderRadius: "16px",
          border: isListening ? "2px solid #ef4444" : "1px solid var(--border-color)",
          boxShadow: isListening ? "0 0 16px rgba(239, 68, 68, 0.25)" : "var(--shadow-sm)",
          transition: "all 0.2s ease"
        }}
      >
        {/* Active Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`btn ${isListening ? "btn-emergency" : "btn-secondary"}`}
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: isListening ? "#ef4444" : undefined,
            color: isListening ? "#ffffff" : undefined,
            boxShadow: isListening ? "0 0 12px rgba(239, 68, 68, 0.5)" : undefined
          }}
          title={isListening 
            ? (chatLang === "hi" ? "माइक बंद करने के लिए क्लिक करें" : "Listening... click to stop")
            : (chatLang === "hi" ? "बोलकर पूछने के लिए माइक चालू करें" : "Click to speak your question via microphone")}
        >
          {isListening ? <MicOff size={19} /> : <Mic size={19} color="var(--primary)" />}
        </button>

        {/* Query Input - Only 'Ask anything...' as requested */}
        <input
          type="text"
          value={interimTranscript ? `${input} ${interimTranscript}`.trim() : input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            boxShadow: "none",
            padding: "8px 10px",
            fontSize: "0.95rem"
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!input.trim() && !interimTranscript.trim()) || isLoading}
          className="btn btn-primary"
          style={{ 
            padding: "10px 18px", 
            borderRadius: "12px",
            opacity: (!input.trim() && !interimTranscript.trim()) || isLoading ? 0.6 : 1 
          }}
        >
          <Send size={16} />
          <span>{chatLang === "hi" ? "भेजें" : "Send"}</span>
        </button>
      </form>

      {/* ── CHAT HISTORY DRAWER / MODAL ── */}
      {isHistoryOpen && (
        <div 
          onClick={() => setIsHistoryOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 130,
            display: "flex",
            justifyContent: "flex-end",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "380px",
              height: "100%",
              background: "var(--bg-card)",
              borderLeft: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-lg)",
              animation: "slideInRight 0.25s ease"
            }}
          >
            {/* History Header */}
            <div style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-elevated)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <History size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)" }}>
                  {chatLang === "hi" ? "चैट हिस्ट्री (इतिहास)" : "Chat History"}
                </h3>
                <span className="badge badge-good" style={{ fontSize: "0.7rem" }}>
                  {sessions.length}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsHistoryOpen(false)}
                className="btn btn-secondary"
                style={{ padding: "6px 8px", borderRadius: "8px" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* History List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {sessions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  <MessageSquare size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-highlight)" }}>
                    {chatLang === "hi" ? "कोई पुरानी चैट नहीं है" : "No Past Chats Saved"}
                  </div>
                  <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                    {chatLang === "hi" ? "जब आप सवाल पूछेंगे, तो आपकी चैट यहाँ सुरक्षित रहेगी।" : "Your conversations will be automatically saved here as you ask questions."}
                  </div>
                </div>
              ) : (
                sessions.map((s) => {
                  const isActive = s.id === currentSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleLoadSession(s)}
                      className="interactive-card"
                      style={{
                        padding: "12px 14px",
                        borderRadius: "14px",
                        background: isActive ? "var(--primary-soft)" : "var(--bg-elevated)",
                        border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--text-highlight)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {s.title}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteHistorySession(e, s.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "3px 6px",
                            borderRadius: "6px"
                          }}
                          title={chatLang === "hi" ? "यह चैट हटाएं" : "Delete session"}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        <span>{s.date}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ textTransform: "capitalize", fontWeight: 700, color: "var(--primary)" }}>{s.language}</span>
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* History Footer Actions */}
            {sessions.length > 0 && (
              <div style={{
                padding: "14px 18px",
                borderTop: "1px solid var(--border-color)",
                background: "var(--bg-elevated)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="btn btn-secondary"
                  style={{
                    padding: "7px 14px",
                    fontSize: "0.8rem",
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    fontWeight: 700
                  }}
                >
                  <Trash2 size={14} color="#ef4444" />
                  <span>{chatLang === "hi" ? "पूरा इतिहास हटाएं" : "Clear All History"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="btn btn-primary"
                  style={{ padding: "7px 16px", fontSize: "0.8rem" }}
                >
                  <span>{chatLang === "hi" ? "बंद करें" : "Close"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
