import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Maximize2, 
  Bot,
  RotateCcw, 
  Globe,
  Trash2,
  BookmarkPlus,
  History,
  CheckCircle2,
  ChevronLeft,
  Calendar,
  MessageSquare,
  Sparkles,
  Plus
} from "lucide-react";
import { sendChatMessage } from "../services/geminiService";

const SUPPORTED_LANGUAGES = [
  { id: "hinglish", label: "🇮🇳 Hinglish (हिंग्लिश)" },
  { id: "hi", label: "🇮🇳 हिन्दी (Hindi)" },
  { id: "en", label: "🇬🇧 English" },
  { id: "pa", label: "🇮🇳 ਪੰਜਾਬੀ (Punjabi)" },
  { id: "ta", label: "🇮🇳 தமிழ் (Tamil)" },
  { id: "te", label: "🇮🇳 తెలుగు (Telugu)" },
  { id: "bn", label: "🇮🇳 বাংলা (Bengali)" },
  { id: "mr", label: "🇮🇳 मराठी (Marathi)" },
  { id: "gu", label: "🇮🇳 ગુજરાતી (Gujarati)" },
  { id: "kn", label: "🇮🇳 ಕನ್ನಡ (Kannada)" }
];

export default function FloatingCopilot({ 
  patient, 
  lang = "en", 
  onNavigate,
  activeTab
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  
  const [inputQuery, setInputQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [chatLang, setChatLang] = useState(() => {
    return localStorage.getItem("pulseai_copilot_lang") || (lang === "hi" ? "hi" : "hinglish");
  });

  // Saved Chat Sessions from localStorage
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pulseai_copilot_sessions") || "[]");
    } catch {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => `session_${Date.now()}`);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(""), 2600);
  };

  // Welcome message customized to current patient and selected language
  const getInitialMessage = useCallback(() => {
    const pName = patient?.name || "Patient";
    const conditions = patient?.conditions?.map(c => typeof c === "string" ? c : c.name).join(", ") || "General Wellness";
    
    if (chatLang === "hi") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `नमस्ते ${pName} जी! 🙏 मैं आपका **AI Copilot** हूँ।\n\nआपकी प्रोफाइल (*${conditions}*) के अनुसार, मैं आपकी दवाओं, लैब रिपोर्ट्स या किसी भी स्वास्थ्य समस्या में सहायता के लिए तैयार हूँ।\n\nटाइप करें, फ़ोटो 📷 भेजें या माइक 🎙️ दबाकर सीधे बोलें!`,
        timestamp: "अभी",
        triageLevel: "routine"
      };
    } else if (chatLang === "bn") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `নমস্কার ${pName} বাবু! 🙏 আমি আপনার **AI Copilot**।\n\nআপনার স্বাস্থ্য প্রোফাইল (*${conditions}*) অনুযায়ী ওষুধ, ল্যাব রিপোর্ট বা যে কোনো শারীরিক সমস্যায় সাহায্যের জন্য প্রস্তুত।\n\nটাইপ করুন, ছবি 📷 পাঠান বা মাইক 🎙️ চেপে কথা বলুন!`,
        timestamp: "এখনই",
        triageLevel: "routine"
      };
    } else if (chatLang === "mr") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `नमस्कार ${pName} जी! 🙏 मी तुमचा **AI Copilot** आहे.\n\nतुमची प्रोफाइल (*${conditions}*) पाहून मी औषधे, लॅब रिपोर्ट्स आणि आरोग्याबाबत मदत करण्यास तयार आहे.\n\nटाईप करा, फोटो 📷 पाठवा किंवा माईक 🎙️ दाबून बोला!`,
        timestamp: "आत्ता",
        triageLevel: "routine"
      };
    } else if (chatLang === "pa") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${pName} ਜੀ! 🙏 ਮੈਂ ਤੁਹਾਡਾ **AI Copilot** ਹਾਂ।\n\nਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ (*${conditions}*) ਅਨੁਸਾਰ ਮੈਂ ਦਵਾਈਆਂ, ਲੈਬ ਰਿਪੋਰਟਾਂ ਅਤੇ ਸਿਹਤ ਸੰਬੰਧੀ ਸਵਾਲਾਂ ਲਈ ਹਾਜ਼ਰ ਹਾਂ। ਤੁਸੀ ਫ਼ੋਟੋ 📷 ਵੀ ਭੇਜ ਸਕਦੇ ਹੋ!`,
        timestamp: "ਹੁਣੇ",
        triageLevel: "routine"
      };
    } else if (chatLang === "ta") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `வணக்கம் ${pName}! 🙏 நான் உங்கள் **AI Copilot**.\n\nமருந்துகள், பரிசோதனை அறிக்கைகள் மற்றும் உடல்நல ஆலோசனைகளுக்கு நான் உதவ தயாராக உள்ளேன். நீங்கள் தட்டச்சு செய்யலாம் அல்லது புகைப்படம் 📷 பகிரலாம்!`,
        timestamp: "இப்போது",
        triageLevel: "routine"
      };
    } else if (chatLang === "te") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `నమస్కారం ${pName}! 🙏 నేను మీ **AI Copilot**.\n\nమీ మందులు, ల్యాబ్ రిపోర్టులు మరియు ఆరోగ్య ప్రశ్నలకు సహాయం చేయడానికి నేను సిద్ధంగా ఉన్నాను. టైప్ చేయండి లేదా ఫోటో 📷 పంపండి!`,
        timestamp: "ఇప్పుడు",
        triageLevel: "routine"
      };
    } else if (chatLang === "gu") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `નમસ્તે ${pName} જી! 🙏 હું તમારો **AI Copilot** છું.\n\nતમારી પ્રોફાઇલ (*${conditions}*) મુજબ દવાઓ, લેબ રિપોર્ટ કે આરોગ્ય અંગે મદદ માટે તૈયાર છું.\n\nટાઈપ કરો, ફોટો 📷 મોકલો અથવા માઇક 🎙️ દબાવીને બોલો!`,
        timestamp: "હમણાં",
        triageLevel: "routine"
      };
    } else if (chatLang === "kn") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `ನಮಸ್ಕಾರ ${pName} ಅವರೇ! 🙏 ನಾನು ನಿಮ್ಮ **AI Copilot**.\n\nನಿಮ್ಮ ಪ್ರೊಫೈಲ್ (*${conditions}*) ಆಧಾರದ ಮೇಲೆ ಔಷಧಿಗಳು, ಲ್ಯಾಬ್ ವರದಿಗಳು ಅಥವಾ ಆರೋಗ್ಯದ ಕುರಿತು ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ.\n\nಟೈಪ್ ಮಾಡಿ, ಫೋಟೋ 📷 ಕಳುಹಿಸಿ ಅಥವಾ ಮೈಕ್ 🎙️ ಒತ್ತಿ ಮಾತನಾಡಿ!`,
        timestamp: "ಈಗ",
        triageLevel: "routine"
      };
    } else if (chatLang === "hinglish") {
      return {
        id: "msg_init",
        sender: "bot",
        content: `Namaste ${pName} ji! 👋 Main aapka personal **AI Copilot** hoon.\n\nAapki medical history (*${conditions}*) mere paas updated hai. Aap mujhse apni **sugar, BP, medicines, lab reports ya kisi bhi lakshan** ke baare me pooch sakte hain.\n\nType karein, photo 📷 upload karein ya **Mic 🎙️** dabakar bolein!`,
        timestamp: "Just now",
        triageLevel: "routine"
      };
    } else {
      return {
        id: "msg_init",
        sender: "bot",
        content: `Hello ${pName}! 👋 I am your **AI Copilot**.\n\nI have reviewed your active profile (*${conditions}*). Feel free to ask me anything about your medications, upload photos of reports/medicines 📷, or ask in plain language!`,
        timestamp: "Just now",
        triageLevel: "routine"
      };
    }
  }, [patient, chatLang]);

  // Messages start completely empty until the user sends a command/query
  const [messages, setMessages] = useState([]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isHistoryOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, isOpen, isHistoryOpen, selectedImage]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isHistoryOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isHistoryOpen]);

  // Voice speech-to-text with full browser microphone access request
  const toggleListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showNotification(
        chatLang === "hi" 
          ? "इस ब्राउज़र में आवाज़ पहचान (Voice input) उपलब्ध नहीं है।" 
          : "Voice recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      showNotification(chatLang === "hi" ? "माइक बंद किया गया" : "Microphone stopped");
      return;
    }

    // Explicitly prompt user and gain permission for microphone access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.warn("Microphone access permission blocked or denied:", err);
        showNotification(
          chatLang === "hi"
            ? "⚠️ माइक्रोफ़ोन ब्लॉक है। ब्राउज़र URL बार में Mic Allow करें।"
            : (chatLang === "hinglish"
                ? "⚠️ Mic blocked hai. URL bar me jaakar Mic Allow karein."
                : "⚠️ Microphone access blocked. Please allow mic in browser address bar.")
        );
        return;
      }
    }

    // Start Speech Recognition
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap = {
        hi: "hi-IN",
        pa: "pa-IN",
        ta: "ta-IN",
        te: "te-IN",
        bn: "bn-IN",
        mr: "mr-IN",
        gu: "gu-IN",
        kn: "kn-IN",
        en: "en-IN",
        hinglish: "hi-IN"
      };
      recognition.lang = langMap[chatLang] || "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        showNotification(chatLang === "hi" ? "🎙️ सुन रहे हैं... स्पष्ट बोलें" : "🎙️ Listening... speak clearly");
      };

      recognition.onresult = (e) => {
        let transcript = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          transcript += e.results[i][0].transcript;
        }
        if (transcript) {
          setInputQuery(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsListening(false);
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          showNotification(
            chatLang === "hi"
              ? "⚠️ माइक्रोफ़ोन अनुमति अस्वीकार की गई।"
              : "⚠️ Microphone permission was denied."
          );
        } else if (e.error !== "no-speech") {
          showNotification(`Mic: ${e.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("SpeechRecognition start error:", err);
      setIsListening(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification(chatLang === "hi" ? "कृपया एक फ़ोटो चुनें" : "Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage({
        file,
        dataUrl: event.target?.result,
        name: file.name
      });
      showNotification(chatLang === "hi" ? "फ़ोटो संलग्न की गई 📷" : "Photo attached 📷");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Send message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputQuery).trim();
    if ((!text && !selectedImage) || isThinking) return;

    const currentImg = selectedImage;
    setSelectedImage(null);

    const userContent = text || (chatLang === "hi" ? "📷 फ़ोटो का विश्लेषण करें" : "📷 Please analyze this photo");

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: "user",
      content: userContent,
      image: currentImg?.dataUrl || null,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsThinking(true);

    try {
      const queryWithContext = currentImg
        ? `${userContent} [User attached medical/health photo: "${currentImg.name}"]`
        : userContent;

      const messagesForAI = updatedMessages.map((m, idx) => 
        idx === updatedMessages.length - 1 ? { ...m, content: queryWithContext } : m
      );

      const botResponse = await sendChatMessage(
        messagesForAI,
        patient,
        lang,
        chatLang
      );

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        content: botResponse.text,
        triageLevel: botResponse.triageLevel || "routine",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg = {
        id: `bot_err_${Date.now()}`,
        sender: "bot",
        content: chatLang === "hi" 
          ? "क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।" 
          : "Sorry, I had trouble generating a reply. Please try again.",
        triageLevel: "caution",
        timestamp: "Now"
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── SINGLE CHAT MESSAGE DELETION ───────────────────────────────────────────
  const handleDeleteSingleMessage = (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    showNotification(chatLang === "hi" ? "संदेश हटाया गया" : "Message deleted");
  };

  // ── SAVE CURRENT CHAT TO HISTORY ───────────────────────────────────────────
  const handleSaveCurrentChat = () => {
    if (messages.length === 0) {
      showNotification(chatLang === "hi" ? "सहेजने के लिए कोई बातचीत नहीं है" : "No conversation to save yet");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("pulseai_copilot_sessions") || "[]");
      const firstUserMsg = messages.find(m => m.sender === "user")?.content || "Health Consultation";
      const previewText = firstUserMsg.slice(0, 48) + (firstUserMsg.length > 48 ? "..." : "");

      const newSession = {
        id: currentSessionId,
        timestamp: new Date().toLocaleString(),
        preview: previewText,
        messages: [...messages],
        language: chatLang,
        patientName: patient?.name || "Patient"
      };

      const updated = [newSession, ...existing.filter(s => s.id !== currentSessionId)];
      localStorage.setItem("pulseai_copilot_sessions", JSON.stringify(updated));
      setSessions(updated);
      showNotification(chatLang === "hi" ? "चैट सफलतापूर्वक सहेजी गई! 💾" : "Chat saved successfully! 💾");
    } catch {
      showNotification("Failed to save chat");
    }
  };

  // Load a saved chat session
  const handleLoadSession = (session) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages || []);
    if (session.language) {
      setChatLang(session.language);
    }
    setIsHistoryOpen(false);
    showNotification(chatLang === "hi" ? "सहेजी गई चैट लोड हुई" : "Saved chat loaded");
  };

  // Delete a saved session from history
  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    try {
      const existing = JSON.parse(localStorage.getItem("pulseai_copilot_sessions") || "[]");
      const updated = existing.filter(s => s.id !== sessionId);
      localStorage.setItem("pulseai_copilot_sessions", JSON.stringify(updated));
      setSessions(updated);
      showNotification(chatLang === "hi" ? "सहेजा गया सत्र हटाया गया" : "Session deleted");
    } catch {
      // ignore
    }
  };

  // Start a fresh new chat
  const handleStartNewChat = () => {
    setMessages([]);
    setCurrentSessionId(`session_${Date.now()}`);
    setIsHistoryOpen(false);
    showNotification(chatLang === "hi" ? "नई बातचीत शुरू की गई" : "New chat started");
  };

  const handleOpenFullCopilot = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate("copilot");
    }
  };

  // Suggested prompts for all 10 supported languages
  const suggestedPromptsByLang = {
    hi: [
      "💊 मेरी आज की दवाओं का समय क्या है?",
      "🧪 क्या मेरा ब्लड शुगर 130 सामान्य है?",
      "🤒 हल्का बुखार और सिरदर्द है, क्या करूँ?",
      "📋 डॉक्टर से क्या सवाल पूछने चाहिए?"
    ],
    hinglish: [
      "💊 Meri aaj ki medicines ka timing kya hai?",
      "🧪 Blood sugar 130 mg/dL normal hai ya high?",
      "🤒 Halka bukhar aur sar dard hai, kya karun?",
      "📋 Doctor visit ke liye kya sawaal taiyar karun?"
    ],
    bn: [
      "💊 আজকে আমার ওষুধ খাওয়ার সময় কখন?",
      "🧪 ব্লাড সুগার ১৩০ কি স্বাভাবিক?",
      "🤒 হালকা জ্বর ও মাথা ব্যথায় কী করব?",
      "📋 ডাক্তারের কাছে কী প্রশ্ন করা উচিত?"
    ],
    mr: [
      "💊 आजच्या माझ्या औषधांची वेळ काय आहे?",
      "🧪 ब्लड शुगर १३० सामान्य आहे का?",
      "🤒 ताप आणि डोकेदुखीसाठी काय करावे?",
      "📋 डॉक्टरांना कोणते प्रश्न विचारावेत?"
    ],
    pa: [
      "💊 ਅੱਜ ਮੇਰੀਆਂ ਕਿਹੜੀਆਂ ਦਵਾਈਆਂ ਹਨ?",
      "🧪 ਬਲੱਡ ਸ਼ੂਗਰ 130 ਨਾਰਮਲ ਹੈ?",
      "🤒 ਸਿਰ ਦਰਦ ਲਈ ਸੁਰੱਖਿਅਤ ਦਵਾਈ?",
      "📋 ਡਾਕਟਰ ਨੂੰ ਕੀ ਪੁੱਛਣਾ ਚਾਹੀਦਾ ਹੈ?"
    ],
    ta: [
      "💊 இன்று நான் சாப்பிட வேண்டிய மருந்துகள்?",
      "🧪 ரத்த சர்க்கரை 130 இயல்பானதா?",
      "🤒 லேசான காய்ச்சல் மற்றும் தலைவலிக்கு என்ன செய்வது?",
      "📋 மருத்துவரிடம் என்ன கேள்விகள் கேட்க வேண்டும்?"
    ],
    te: [
      "💊 ఈరోజు నా మందుల సమయం ఏమిటి?",
      "🧪 బ్లడ్ షుగర్ 130 సాధారణమేనా?",
      "🤒 తలనొప్పి మరియు జ్వరానికి ఏం చేయాలి?",
      "📋 వైద్యుడిని ఏ ప్రశ్నలు అడగాలి?"
    ],
    gu: [
      "💊 મારી આજની દવાઓનો સમય શું છે?",
      "🧪 બ્લડ સુગર 130 નોર્મલ છે?",
      "🤒 તાવ અને માથાના દુખાવા માટે શું કરવું?",
      "📋 ડોક્ટરને કયા પ્રશ્નો પૂછવા જોઈએ?"
    ],
    kn: [
      "💊 ಇಂದು ನನ್ನ ಔಷಧಿಗಳ ಸಮಯ ಯಾವಾಗ?",
      "🧪 ರಕ್ತದ ಸಕ್ಕರೆ 130 ಸಹಜವೇ?",
      "🤒 ಜ್ವರ ಮತ್ತು ತಲೆನೋವಿಗೆ ಏನು ಮಾಡಬೇಕು?",
      "📋 ವೈದ್ಯರನ್ನು ಯಾವ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬೇಕು?"
    ],
    en: [
      "💊 What are my scheduled medications today?",
      "🧪 Is blood sugar 130 mg/dL in normal range?",
      "🤒 Mild fever and headache, safe steps to take?",
      "📋 Best questions to ask my doctor?"
    ]
  };

  const suggestedPrompts = suggestedPromptsByLang[chatLang] || suggestedPromptsByLang.en;

  return (
    <>
      {/* ── 1. FLOATING ACTION BUTTON (FAB) ── */}
      <div 
        style={{
          position: "fixed",
          bottom: "26px",
          right: "26px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        {/* Hover Tooltip Label */}
        {isHovered && !isOpen && (
          <div 
            style={{
              background: "rgba(15, 23, 42, 0.92)",
              color: "#ffffff",
              padding: "7px 14px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 600,
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
              animation: "fadeIn 0.2s ease"
            }}
          >
            {chatLang === "hi" ? "AI Copilot से पूछें ✨" : "Ask AI Copilot ✨"}
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="floating-ai-agent-btn"
          aria-label="Open AI Copilot"
          title={isOpen ? "Close AI Copilot" : "Open AI Copilot"}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            border: "1.5px solid rgba(255, 255, 255, 0.25)",
            background: isOpen 
              ? "linear-gradient(135deg, #1e293b, #0f172a)" 
              : "linear-gradient(135deg, var(--primary), var(--secondary))",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: isOpen
              ? "0 8px 24px rgba(0, 0, 0, 0.35)"
              : "0 10px 28px -4px rgba(2, 132, 199, 0.6), 0 0 16px rgba(14, 165, 233, 0.45)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "translateY(-3px) scale(1.05)" : "scale(1)"
          }}
        >
          {/* Subtle Ambient Pulse Ring when closed */}
          {!isOpen && (
            <span 
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "22px",
                border: "2px solid rgba(56, 189, 248, 0.4)",
                animation: "agentRingPulse 2.5s infinite",
                pointerEvents: "none"
              }}
            />
          )}

          {isOpen ? (
            <X size={26} color="#ffffff" strokeWidth={2.4} />
          ) : (
            <Bot size={28} color="#ffffff" strokeWidth={2.2} />
          )}
        </button>
      </div>

      {/* ── 2. FLOATING COPILOT CHAT WINDOW ── */}
      {isOpen && (
        <div 
          className="floating-copilot-window"
          style={{
            position: "fixed",
            bottom: "94px",
            right: "26px",
            width: "395px",
            maxWidth: "calc(100vw - 32px)",
            height: "580px",
            maxHeight: "calc(100vh - 120px)",
            borderRadius: "22px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            boxShadow: "0 24px 50px -10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUpFade 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "fixed"
          }}
        >
          {/* Toast Notification */}
          {notificationMsg && (
            <div 
              style={{
                position: "absolute",
                top: "56px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 100,
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid var(--primary)",
                color: "#ffffff",
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                animation: "fadeIn 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              <CheckCircle2 size={14} color="var(--primary)" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* ── Header: AI Copilot Brand (Online health Assistant removed per user request) ── */}
          <div 
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              flexShrink: 0
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isHistoryOpen ? (
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "8px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                  title="Back to Chat"
                >
                  <ChevronLeft size={18} />
                </button>
              ) : (
                <div 
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "11px",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.3)"
                  }}
                >
                  <Bot size={22} color="#ffffff" />
                </div>
              )}
              
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.06rem", lineHeight: 1.2 }}>
                  {isHistoryOpen ? "Saved Chats" : "AI Copilot"}
                </div>
              </div>
            </div>

            {/* Header Action Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {/* Save Chat Button */}
              <button
                onClick={handleSaveCurrentChat}
                title="Save Current Chat (चैट सहेजें)"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <BookmarkPlus size={16} />
              </button>

              {/* Saved History Drawer Toggle */}
              <button
                onClick={() => setIsHistoryOpen(prev => !prev)}
                title="View Saved Chats (इतिहास)"
                style={{
                  background: isHistoryOpen ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  position: "relative"
                }}
              >
                <History size={16} />
                {sessions.length > 0 && (
                  <span 
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      borderRadius: "10px",
                      padding: "1px 4px",
                      lineHeight: 1
                    }}
                  >
                    {sessions.length}
                  </span>
                )}
              </button>

              {/* New / Reset Chat Button */}
              <button
                onClick={handleStartNewChat}
                title="Start New Chat (नई चैट)"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <RotateCcw size={15} />
              </button>
              
              {/* Full-Screen Expand */}
              <button
                onClick={handleOpenFullCopilot}
                title="Expand to Full Page"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <Maximize2 size={15} />
              </button>

              {/* Minimize / Close */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* ── Language Bar with Rich Indian Languages Dropdown ── */}
          <div 
            style={{
              padding: "7px 14px",
              background: "var(--bg-card-hover)",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              fontSize: "0.76rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontWeight: 700 }}>
              <Globe size={14} color="var(--primary)" />
              <span>Language:</span>
            </div>
            
            <select
              value={chatLang}
              onChange={(e) => {
                const newLang = e.target.value;
                setChatLang(newLang);
                localStorage.setItem("pulseai_copilot_lang", newLang);
                showNotification(`Language: ${e.target.options[e.target.selectedIndex].text}`);
              }}
              style={{
                flex: 1,
                maxWidth: "220px",
                padding: "4px 8px",
                borderRadius: "8px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-highlight)",
                fontSize: "0.76rem",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none"
              }}
            >
              {SUPPORTED_LANGUAGES.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── VIEW A: SAVED CHATS SECTION ── */}
          {isHistoryOpen ? (
            <div 
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {sessions.length} Saved Conversation(s)
                </span>
                <button
                  onClick={handleSaveCurrentChat}
                  style={{
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    border: "1px solid var(--primary-border)",
                    borderRadius: "8px",
                    padding: "3px 8px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <BookmarkPlus size={13} />
                  <span>Save Current</span>
                </button>
              </div>

              {sessions.length === 0 ? (
                <div 
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.82rem"
                  }}
                >
                  <MessageSquare size={32} style={{ opacity: 0.4, margin: "0 auto 10px auto" }} />
                  <div>No saved chats yet.</div>
                  <div style={{ fontSize: "0.74rem", marginTop: "4px" }}>
                    Click the save button (💾) on top to save your current chat.
                  </div>
                </div>
              ) : (
                sessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleLoadSession(s)}
                    className="interactive-card"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "var(--bg-card-hover)",
                      border: s.id === currentSessionId ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-highlight)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.preview || "Health consultation"}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                        <span>{s.timestamp}</span>
                        <span>•</span>
                        <span style={{ textTransform: "uppercase", fontWeight: 700, color: "var(--primary)" }}>
                          {s.language || "hinglish"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      title="Delete saved chat"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "5px",
                        borderRadius: "6px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* ── VIEW B: ACTIVE CHAT MESSAGES ── */
            <div 
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              {messages.length === 0 ? (
                <div 
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "24px 14px",
                    gap: "14px",
                    minHeight: "320px"
                  }}
                >
                  <div 
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(2, 132, 199, 0.28)"
                    }}
                  >
                    <Bot size={28} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.08rem", fontWeight: 800, color: "var(--text-highlight)", marginBottom: "4px" }}>
                      AI Copilot
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "290px", lineHeight: 1.45 }}>
                      {chatLang === "hi" 
                        ? "नमस्ते! अपनी दवाओं, रिपोर्ट या सेहत से जुड़े किसी भी सवाल के लिए नीचे टाइप करें या माइक दबाकर बोलें।"
                        : (chatLang === "hinglish"
                            ? "Namaste! Apni dawai, report ya health ke baare me sawaal poochne ke liye neeche type karein ya mic dabayein."
                            : "Ask me anything about your medications, reports, or health queries in simple plain language.")}
                    </div>
                  </div>

                  {/* Clean Quick Clickable Prompts in Empty State */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "320px", marginTop: "4px" }}>
                    {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "12px",
                          background: "var(--bg-card-hover)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-highlight)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--primary)";
                          e.currentTarget.style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border-color)";
                          e.currentTarget.style.transform = "none";
                        }}
                      >
                        <Sparkles size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const isUser = m.sender === "user";
                  return (
                    <div 
                      key={m.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isUser ? "flex-end" : "flex-start",
                        maxWidth: "90%",
                        alignSelf: isUser ? "flex-end" : "flex-start",
                        position: "relative"
                      }}
                    >
                      {/* Bot Header with Single Message Delete Option */}
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "6px", 
                          marginBottom: "4px",
                          width: "100%",
                          justifyContent: isUser ? "flex-end" : "flex-start"
                        }}
                      >
                        {!isUser && (
                          <>
                            <div 
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "6px",
                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Bot size={12} color="#ffffff" />
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                              AI Copilot
                            </span>
                            {m.triageLevel === "emergency" && (
                              <span className="badge badge-critical" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                                🚨 Emergency
                              </span>
                            )}
                            {m.triageLevel === "caution" && (
                              <span className="badge badge-warning" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                                ⚠️ Caution
                              </span>
                            )}
                          </>
                        )}

                        {/* ── Single Chat Message Deletion Button ── */}
                        <button
                          onClick={() => handleDeleteSingleMessage(m.id)}
                          title="Delete this message"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            opacity: 0.6,
                            transition: "opacity 0.2s, color 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.color = "#ef4444";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.6";
                            e.currentTarget.style.color = "var(--text-muted)";
                          }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>

                      {/* Message Bubble with Optional Uploaded Image */}
                      <div 
                        style={{
                          padding: "10px 14px",
                          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: isUser 
                            ? "linear-gradient(135deg, var(--primary), var(--secondary))" 
                            : "var(--bg-card-hover)",
                          color: isUser ? "#ffffff" : "var(--text-main)",
                          fontSize: "0.85rem",
                          lineHeight: 1.45,
                          border: isUser ? "none" : "1px solid var(--border-color)",
                          boxShadow: "var(--shadow-sm)",
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {/* Attached Image if present */}
                        {m.image && (
                          <div style={{ marginBottom: m.content ? "8px" : "0" }}>
                            <img
                              src={m.image}
                              alt="Uploaded health photo"
                              style={{
                                maxWidth: "230px",
                                maxHeight: "180px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                display: "block",
                                border: "1px solid rgba(255,255,255,0.3)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                              }}
                            />
                          </div>
                        )}
                        {m.content}
                      </div>

                      <span style={{ fontSize: "0.66rem", color: "var(--text-muted)", marginTop: "2px", alignSelf: isUser ? "flex-end" : "flex-start" }}>
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })
              )}

              {/* AI Thinking Animation */}
              {isThinking && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", alignSelf: "flex-start" }}>
                  <div 
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Bot size={13} color="#ffffff" />
                  </div>
                  <div 
                    style={{
                      padding: "8px 12px",
                      borderRadius: "14px",
                      background: "var(--bg-card-hover)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <span className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", animation: "dotPulse 1.2s infinite ease-in-out" }} />
                    <span className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", animation: "dotPulse 1.2s infinite ease-in-out 0.2s" }} />
                    <span className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", animation: "dotPulse 1.2s infinite ease-in-out 0.4s" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ── Suggested Prompts Chips (when chat has messages and <= 2 messages and not in history) ── */}
          {!isHistoryOpen && messages.length > 0 && messages.length <= 2 && !isThinking && (
            <div 
              style={{
                padding: "8px 14px",
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                borderTop: "1px solid var(--border-color)",
                background: "var(--bg-card)"
              }}
            >
              {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "12px",
                    background: "var(--bg-card-hover)",
                    border: "1px solid var(--primary-border)",
                    color: "var(--text-highlight)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s"
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* ── Attached Image Preview Bar before sending ── */}
          {!isHistoryOpen && selectedImage && (
            <div 
              style={{
                padding: "7px 14px",
                background: "var(--bg-card-hover)",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={selectedImage.dataUrl}
                  alt="Selected"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    border: "1.5px solid var(--primary)"
                  }}
                />
                <div>
                  <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-highlight)", maxWidth: "230px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selectedImage.name}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    {chatLang === "hi" ? "फ़ोटो संलग्न है • भेजने के लिए तैयार" : "Photo attached • Ready to send"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  background: "rgba(239, 68, 68, 0.14)",
                  border: "none",
                  color: "#ef4444",
                  borderRadius: "6px",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="Remove Image"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* ── Input Box Bar with '+' Icon Embedded INSIDE Text Chat ── */}
          {!isHistoryOpen && (
            <div 
              style={{
                padding: "10px 14px",
                background: "var(--bg-card)",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {/* Cohesive text chat container with '+' embedded INSIDE on the left */}
              <div 
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: "var(--bg-card-hover)",
                  border: isListening ? "1.5px solid #ef4444" : "1px solid var(--border-color)",
                  borderRadius: "16px",
                  padding: "4px 8px 4px 6px",
                  boxShadow: isListening ? "0 0 12px rgba(239, 68, 68, 0.25)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Hidden Image File Input */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                {/* '+' (Plus) icon button embedded INSIDE the text chat box */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  title={chatLang === "hi" ? "फ़ोटो या रिपोर्ट अपलोड करें (+)" : "Upload Photo / Report (+)"}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "none",
                    background: selectedImage ? "var(--primary)" : "var(--primary-soft)",
                    color: selectedImage ? "#ffffff" : "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginRight: "6px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = selectedImage ? "var(--primary)" : "var(--primary-soft)";
                    e.currentTarget.style.color = selectedImage ? "#ffffff" : "var(--primary)";
                  }}
                >
                  <Plus size={18} strokeWidth={2.6} />
                </button>

                {/* Text Input with "Ask Anything..." */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={chatLang === "hi" ? "कुछ भी पूछें..." : "Ask Anything..."}
                  style={{
                    flex: 1,
                    padding: "7px 6px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    outline: "none"
                  }}
                />

                {/* Voice Mic Button embedded on the right inside text chat */}
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Listening... click to stop" : "Speak with Voice (Click to allow Microphone)"}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "none",
                    background: isListening ? "#ef4444" : "transparent",
                    color: isListening ? "#ffffff" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    animation: isListening ? "dotPulse 1.2s infinite" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!isListening) e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isListening) e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={(!inputQuery.trim() && !selectedImage) || isThinking}
                title="Send Message"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  border: "none",
                  background: (inputQuery.trim() || selectedImage) && !isThinking
                    ? "linear-gradient(135deg, var(--primary), var(--secondary))"
                    : "var(--border-color)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: (inputQuery.trim() || selectedImage) && !isThinking ? "pointer" : "default",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  boxShadow: (inputQuery.trim() || selectedImage) && !isThinking ? "0 2px 8px rgba(2, 132, 199, 0.35)" : "none"
                }}
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
