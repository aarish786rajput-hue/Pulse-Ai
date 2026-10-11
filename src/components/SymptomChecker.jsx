import React, { useState } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Activity, 
  Phone, 
  MessageSquareHeart,
  ShieldCheck
} from "lucide-react";
import { translations } from "../data/translations";

const bodyRegions = [
  {
    id: "chest",
    nameEn: "Chest, Heart & Lungs",
    nameHi: "छाती, हृदय और फेफड़े",
    names: {
      en: "Chest, Heart & Lungs",
      hi: "छाती, हृदय और फेफड़े",
      hinglish: "Chest, Heart & Lungs",
      bn: "বুক, হৃদযন্ত্র ও ফুসফুস",
      mr: "छाती, हृदय आणि फुफ्फुसे",
      te: "ఛాతీ, గుండె & ఊపిరితిత్తులు",
      ta: "மார்பு, இதயம் மற்றும் நுரையீரல்",
      gu: "છાતી, હૃદય અને ફેਫસાં",
      pa: "ਛਾਤੀ, ਦਿਲ ਅਤੇ ਫੇਫੜੇ",
      kn: "ಎದೆ, ಹೃದಯ ಮತ್ತು ಶ್ವಾಸಕೋಶ"
    },
    icon: "🫀",
    commonSymptoms: [
      { id: "chest_pain", en: "Chest tightness / pressure", hi: "छाती में जकड़न या भारीपन", isRedFlag: true },
      { id: "shortness_breath", en: "Difficulty breathing / shortness of breath", hi: "सांस लेने में कठिनाई", isRedFlag: true },
      { id: "arm_pain", en: "Left arm or jaw pain", hi: "बाएं हाथ या जबड़े में दर्द", isRedFlag: true },
      { id: "palpitations", en: "Rapid / pounding heart rate", hi: "दिल की धड़कन तेज होना", isRedFlag: false },
      { id: "cough", en: "Persistent dry / chest cough", hi: "लगातार खांसी आना", isRedFlag: false }
    ]
  },
  {
    id: "head",
    nameEn: "Head, Eyes & Neck",
    nameHi: "सिर, आंखें और गर्दन",
    names: {
      en: "Head, Eyes & Neck",
      hi: "सिर, आंखें और गर्दन",
      hinglish: "Head, Eyes & Neck",
      bn: "মাথা, চোখ ও ঘাড়",
      mr: "डोके, डोळे आणि मान",
      te: "తల, కళ్ళు & మెడ",
      ta: "தலை, கண்கள் மற்றும் கழுத்து",
      gu: "માથું, આંખો અને ગરદન",
      pa: "ਸਿਰ, ਅੱਖਾਂ ਅਤੇ ਗਰਦਨ",
      kn: "ತಲೆ, ಕಣ್ಣುಗಳು ಮತ್ತು ಕುತ್ತಿಗೆ"
    },
    icon: "🧠",
    commonSymptoms: [
      { id: "headache", en: "Throbbing headache", hi: "सिर में तेज धड़कता दर्द", isRedFlag: false },
      { id: "dizziness", en: "Dizziness / loss of balance", hi: "चक्कर आना या संतुलन बिगड़ना", isRedFlag: false },
      { id: "vision_blur", en: "Sudden blurred or double vision", hi: "अचानक धुंधला दिखाई देना", isRedFlag: true },
      { id: "facial_droop", en: "Numbness on one side of face", hi: "चेहरे के एक तरफ सुन्नपन", isRedFlag: true },
      { id: "neck_stiffness", en: "Stiff neck with severe headache", hi: "गर्दन में अकड़न व तेज सिरदर्द", isRedFlag: true }
    ]
  },
  {
    id: "abdomen",
    nameEn: "Stomach & Digestion",
    nameHi: "पेट और पाचन तंत्र",
    names: {
      en: "Stomach & Digestion",
      hi: "पेट और पाचन तंत्र",
      hinglish: "Pet aur Digestion",
      bn: "পেট ও হজম প্রক্রিয়া",
      mr: "पोट आणि पचनसंस्था",
      te: "కడుపు & జీర్ణవ్యవస్థ",
      ta: "வயிறு மற்றும் செரிமானம்",
      gu: "પેટ અને પાચનતંત્ર",
      pa: "ਢਿੱਡ ਅਤੇ ਪਾਚਨ ਪ੍ਰਣਾਲੀ",
      kn: "ಹೊಟ್ಟೆ ಮತ್ತು ಜೀರ್ಣಕ್ರಿಯೆ"
    },
    icon: "🫄",
    commonSymptoms: [
      { id: "acid_burn", en: "Heartburn / acid reflux", hi: "सीने में जलन व खट्टी डकारें", isRedFlag: false },
      { id: "sharp_stomach", en: "Sharp lower abdominal pain", hi: "पेट के निचले हिस्से में तेज दर्द", isRedFlag: false },
      { id: "nausea", en: "Nausea or vomiting", hi: "जी मिचलाना या उल्टी होना", isRedFlag: false },
      { id: "bloating", en: "Severe bloating & gas", hi: "पेट फूलना व भारीपन", isRedFlag: false }
    ]
  },
  {
    id: "limbs",
    nameEn: "Joints, Muscles & Feet",
    nameHi: "जोड़, मांसपेशियां और पैर",
    names: {
      en: "Joints, Muscles & Feet",
      hi: "जोड़, मांसपेशियां और पैर",
      hinglish: "Joints, Muscles & Feet",
      bn: "জয়েন্ট, পেশী ও পা",
      mr: "सांधे, स्नायू आणि पाय",
      te: "కీళ్ళు, కండరాలు & పాదాలు",
      ta: "மூட்டுகள், தசைகள் மற்றும் பாதங்கள்",
      gu: "સાંધા, સ્નાયુઓ અને પગ",
      pa: "ਜੋੜ, ਮਾਸਪੇਸ਼ੀਆਂ ਅਤੇ ਪੈਰ",
      kn: "ಕೀಲುಗಳು, ಸ್ನಾಯುಗಳು ಮತ್ತು ಪಾದಗಳು"
    },
    icon: "🦴",
    commonSymptoms: [
      { id: "joint_stiff", en: "Knee / finger joint stiffness", hi: "घुटने या उंगलियों के जोड़ों में अकड़न", isRedFlag: false },
      { id: "foot_numb", en: "Tingling / numbness in feet (Diabetic)", hi: "पैरों में सुई चुभने जैसा सुन्नपन", isRedFlag: false },
      { id: "calf_swelling", en: "Swelling & warmth in one calf", hi: "एक पैर की पिंडली में सूजन व दर्द", isRedFlag: true },
      { id: "back_pain", en: "Lower back ache", hi: "कमर के निचले हिस्से में दर्द", isRedFlag: false }
    ]
  },
  {
    id: "general",
    nameEn: "Whole Body & Systemic",
    nameHi: "पूरा शरीर और सामान्य लक्षण",
    names: {
      en: "Whole Body & Systemic",
      hi: "पूरा शरीर और सामान्य लक्षण",
      hinglish: "Full Body & Common Symptoms",
      bn: "সমগ্র শরীর ও সাধারণ লক্ষণ",
      mr: "संपूर्ण शरीर आणि सामान्य लक्षणे",
      te: "మొత్తం శరీరం & సాధారణ లక్షణాలు",
      ta: "முழு உடல் மற்றும் பொதுவான அறிகுறிகள்",
      gu: "આખું શરીર અને સામાન્ય લક્ષણો",
      pa: "ਸਾਰਾ ਸਰੀਰ ਅਤੇ ਆਮ ਲੱਛਣ",
      kn: "ಇಡೀ ದೇಹ ಮತ್ತು ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು"
    },
    icon: "🌡️",
    commonSymptoms: [
      { id: "fever", en: "Fever > 101°F (38.3°C)", hi: "तेज बुखार (101°F से अधिक)", isRedFlag: false },
      { id: "sweating", en: "Sudden cold sweat & trembling (Hypo)", hi: "अचानक ठंडा पसीना व कंपकंपी", isRedFlag: false },
      { id: "extreme_fatigue", en: "Severe unusual exhaustion", hi: "अत्यधिक कमजोरी व थकान", isRedFlag: false },
      { id: "skin_rash", en: "Sudden itchy hives or rash", hi: "त्वचा पर अचानक लाल चकत्ते व खुजली", isRedFlag: false }
    ]
  }
];

function getRegionName(region, lang = "en") {
  if (!region) return "";
  if (region.names && region.names[lang]) return region.names[lang];
  if (lang === "hi") return region.nameHi || region.nameEn;
  return region.nameEn;
}

export default function SymptomChecker({ patient, lang = "en", onAskCopilot }) {
  const t = translations[lang] || translations.en;
  const [step, setStep] = useState(1);
  const [selectedRegionId, setSelectedRegionId] = useState("chest");
  const [selectedSymptoms, setSelectedSymptoms] = useState(["shortness_breath"]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("1-3 days");
  const [hasEmergencyFlag, setHasEmergencyFlag] = useState(false);

  const activeRegion = bodyRegions.find(r => r.id === selectedRegionId) || bodyRegions[0];

  const toggleSymptom = (symId) => {
    if (selectedSymptoms.includes(symId)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symId]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customSymptom.trim()) return;
    setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
    setCustomSymptom("");
  };

  // Determine Triage Logic
  const evaluateTriage = () => {
    const redFlagSelected = activeRegion.commonSymptoms.some(
      s => selectedSymptoms.includes(s.id) && s.isRedFlag
    );

    if (hasEmergencyFlag || (redFlagSelected && severity >= 7)) {
      return {
        level: "emergency",
        badgeEn: "🚨 CRITICAL EMERGENCY (Immediate Medical Care)",
        badgeHi: "🚨 आपातकालीन स्थिति (तुरंत अस्पताल या 112/102 पर संपर्क करें)",
        color: "#ef4444",
        actionEn: "Your symptoms indicate a possible acute cardiovascular, respiratory, or neurological event. Do not wait. Call 112 / 102 or proceed to the nearest Emergency Department immediately.",
        actionHi: "आपके लक्षण किसी गंभीर आपातकालीन स्थिति (हृदय, मस्तिष्क या फेफड़े) का संकेत दे सकते हैं। बिल्कुल देर न करें, तुरंत 112 या 102 पर कॉल करें या नजदीकी आपातकालीन वार्ड में जाएं।",
        stepsEn: [
          "Call emergency ambulance services (112 / 102) right away.",
          "Sit down in an upright, supported position; do not drive yourself.",
          `Inform first responders of your known allergy to ${patient.allergies?.join(", ") || "Penicillin"}.`,
          "Take slow, calm breaths while help is en route."
        ],
        stepsHi: [
          "तुरंत एम्बुलेंस या आपातकालीन हेल्पलाइन (112 / 102) पर कॉल करें।",
          "आराम से पीठ के सहारे बैठ जाएं, स्वयं गाड़ी न चलाएं।",
          `स्वास्थ्य कर्मियों को अपनी दवाओं और एलर्जी (${patient.allergies?.join(", ") || "पेनिसिलिन"}) के बारे में जरूर बताएं।`,
          "शांत रहकर गहरी और धीमी सांसें लें।"
        ]
      };
    }

    if (severity >= 5 || redFlagSelected || duration === "more than 1 week") {
      return {
        level: "urgent",
        badgeEn: "⚠️ URGENT CLINICAL CONSULTATION (Within 24 Hours)",
        badgeHi: "⚠️ शीघ्र डॉक्टर परामर्श (आज या अगले 24 घंटे में)",
        color: "#f59e0b",
        actionEn: "These moderate symptoms require in-person evaluation by a healthcare provider. Because you are managing diabetes & hypertension, prompt review prevents complications.",
        actionHi: "इन लक्षणों के लिए डॉक्टर से व्यक्तिगत परामर्श की आवश्यकता है। चूंकि आप पहले से मधुमेह और बीपी का उपचार ले रहे हैं, शीघ्र जांच जरूरी है।",
        stepsEn: [
          `Schedule a priority appointment with ${patient.primaryPhysician?.name || "your physician"}.`,
          "Log your Blood Pressure and Blood Glucose twice today in PulseAI.",
          "Avoid heavy physical exertion and stay well hydrated.",
          "If pain escalates sharply, upgrade immediately to emergency care."
        ],
        stepsHi: [
          `अपने डॉक्टर (${patient.primaryPhysician?.name || "चिकित्सक"}) से तुरंत अपॉइंटमेंट लें।`,
          "आज पल्स-एआई में अपना ब्लड प्रेशर और ब्लड शुगर दो बार मापकर दर्ज करें।",
          "भारी शारीरिक मेहनत से बचें और पर्याप्त पानी पिएं।",
          "यदि दर्द अचानक बहुत बढ़ जाए, तो तुरंत आपातकालीन सेवा लें।"
        ]
      };
    }

    return {
      level: "home",
      badgeEn: "🟢 MILD SYMPTOMS (Home Care & Continuous Monitoring)",
      badgeHi: "🟢 सामान्य लक्षण (घरेलू देखभाल व नियमित निगरानी)",
      color: "#10b981",
      actionEn: "Your symptoms appear mild and manageable with rest and home care. Continue your routine medications and monitor for changes over the next 48 hours.",
      actionHi: "आपके लक्षण हल्के प्रतीत होते हैं और पर्याप्त आराम व घरेलू देखभाल से ठीक हो सकते हैं। अपनी नियमित दवाइयां जारी रखें और अगले 48 घंटे निगरानी रखें।",
      stepsEn: [
        "Rest adequately and ensure 2.5 - 3 liters of fluid intake.",
        "Take prescribed daily medications on time.",
        "Avoid NSAIDs like Ibuprofen without doctor advice due to your Telmisartan prescription; Paracetamol is safer for mild pain.",
        "Consult your clinic if symptoms do not improve after 3 days."
      ],
      stepsHi: [
        "पर्याप्त आराम करें और 2.5 से 3 लीटर तरल पदार्थ पिएं।",
        "अपनी दैनिक दवाएं निर्धारित समय पर लेते रहें।",
        "बीपी की दवा के कारण ब्रूफेन (Ibuprofen) जैसी दर्द निवारक दवाओं से बचें; पैरासिटामोल अधिक सुरक्षित विकल्प है।",
        "यदि 3 दिनों में सुधार न हो, तो डॉक्टर से संपर्क करें।"
      ]
    };
  };

  const triageResult = evaluateTriage();

  const handleTransferToCopilot = () => {
    const symListNames = selectedSymptoms.join(", ");
    const prompt = lang === "hi"
      ? `मैंने लक्षण जांच विज़ार्ड का उपयोग किया है। मेरा प्रभावित अंग: ${activeRegion.nameHi}, लक्षण: ${symListNames}, दर्द का स्तर: ${severity}/10, अवधि: ${duration}। कृपया मुझे समझाएं कि मुझे क्या सावधानियां बरतनी चाहिए?`
      : `I just used the clinical symptom checker. Body area: ${activeRegion.nameEn}, Symptoms: ${symListNames}, Severity: ${severity}/10, Duration: ${duration}. Can you guide me on next steps given my diabetes and blood pressure?`;

    if (onAskCopilot) onAskCopilot(prompt);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: "24px 28px",
        background: "linear-gradient(135deg, var(--primary-soft), var(--secondary-soft))",
        border: "1px solid var(--primary-border)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="badge badge-primary">Clinical Triage Wizard</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {t.symptomGuideSub}
              </span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
              {t.symptomCheckerTitle}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "680px" }}>
              {t.symptomCheckerDesc}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge badge-good" style={{ padding: "6px 12px" }}>
              <ShieldCheck size={14} /> {t.clinicalGuardActive}
            </span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", gap: "8px" }}>
          {[
            { num: 1, title: t.step1Region },
            { num: 2, title: t.step2Symptoms },
            { num: 3, title: t.step3Severity },
            { num: 4, title: t.step4Outcome }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                cursor: s.num < step ? "pointer" : "default"
              }}
            >
              <div style={{
                height: "6px",
                borderRadius: "3px",
                background: step >= s.num ? "var(--primary)" : "var(--border-color)",
                transition: "background 0.3s ease"
              }} />
              <span style={{
                fontSize: "0.76rem",
                fontWeight: step === s.num ? 800 : 600,
                color: step === s.num ? "var(--primary)" : "var(--text-muted)",
                whiteSpace: "nowrap"
              }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Body Area / Region */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: "24px 28px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "8px" }}>
            {lang === "hi" ? "शरीर के किस हिस्से में परेशानी महसूस हो रही है?" : "Where in your body are you experiencing discomfort?"}
          </h2>
          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            {lang === "hi" ? "नीचे दिए गए मुख्य अंगों में से चुनें:" : "Choose the primary area to load relevant clinical symptom checklists:"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
            {bodyRegions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className="interactive-card"
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    background: isSelected ? "var(--primary-soft)" : "var(--bg-elevated)",
                    border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "2.4rem", marginBottom: "10px" }}>
                    {region.icon}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: isSelected ? "var(--primary)" : "var(--text-highlight)" }}>
                    {getRegionName(region, lang)}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {region.commonSymptoms.length} {lang === "hi" ? "लक्षण शामिल" : "markers mapped"}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ padding: "12px 24px" }}>
              <span>{t.chooseSymptomsBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms Selection */}
      {step === 2 && (
        <div className="glass-panel" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              2. {getRegionName(activeRegion, lang)}
            </h2>
            <span className="badge badge-primary">
              {selectedSymptoms.length} {lang === "hi" ? "चयनित" : "selected"}
            </span>
          </div>
          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "18px" }}>
            {lang === "hi" ? "जो भी लक्षण आप महसूस कर रहे हैं, उन पर टैप करें:" : "Tap any symptom that matches what you are currently feeling:"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {activeRegion.commonSymptoms.map((sym) => {
              const isChecked = selectedSymptoms.includes(sym.id);
              return (
                <div
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className="interactive-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    background: isChecked ? "var(--primary-soft)" : "var(--bg-elevated)",
                    border: isChecked ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      border: isChecked ? "none" : "2px solid var(--border-color)",
                      background: isChecked ? "var(--primary)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff"
                    }}>
                      {isChecked && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-highlight)" }}>
                        {lang === "hi" ? sym.hi : sym.en}
                      </div>
                    </div>
                  </div>

                  {sym.isRedFlag && (
                    <span className="badge badge-critical" style={{ fontSize: "0.7rem" }}>
                      ⚠️ {lang === "hi" ? "महत्वपूर्ण लक्षण" : "Red Flag Marker"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Custom Symptom Input */}
          <form onSubmit={handleAddCustom} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <input
              type="text"
              placeholder={lang === "hi" ? "अन्य कोई लक्षण? यहाँ टाइप करके जोड़ें..." : "Experiencing another symptom? Type and add..."}
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-secondary">
              {lang === "hi" ? "जोड़ें" : "Add"}
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>{lang === "hi" ? "पीछे जाएं" : "Back"}</span>
            </button>
            <button 
              onClick={() => setStep(3)} 
              disabled={selectedSymptoms.length === 0}
              className="btn btn-primary"
              style={{ opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}
            >
              <span>{lang === "hi" ? "तीव्रता दर्ज करें" : "Next: Severity & Duration"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Severity Slider & Duration */}
      {step === 3 && (
        <div className="glass-panel" style={{ padding: "24px 28px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "8px" }}>
            {lang === "hi" ? "3. दर्द की तीव्रता और अवधि बताएं" : "3. Rate Discomfort Intensity & Duration"}
          </h2>
          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "24px" }}>
            {lang === "hi" ? "स्लाइडर को हिलाकर दर्द या परेशानी का स्तर चुनें:" : "Move the slider to quantify pain from 1 (very mild) to 10 (unbearable):"}
          </p>

          {/* Severity Slider */}
          <div style={{
            background: "var(--bg-elevated)",
            padding: "20px 24px",
            borderRadius: "14px",
            border: "1px solid var(--border-color)",
            marginBottom: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>
                {lang === "hi" ? "दर्द या परेशानी का स्तर:" : "Discomfort Severity Score:"}
              </span>
              <span style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: severity >= 7 ? "var(--status-crit-text)" : severity >= 4 ? "var(--status-warn-text)" : "var(--status-good-text)"
              }}>
                {severity} / 10
                <span style={{ fontSize: "0.85rem", fontWeight: 700, marginLeft: "8px" }}>
                  ({severity >= 7 ? (lang === "hi" ? "तीव्र / गंभीर" : "Severe") : severity >= 4 ? (lang === "hi" ? "मध्यम" : "Moderate") : (lang === "hi" ? "हल्का" : "Mild")})
                </span>
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: severity >= 7 ? "#ef4444" : severity >= 4 ? "#f59e0b" : "#10b981", height: "8px", cursor: "pointer" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "8px" }}>
              <span>1 - {lang === "hi" ? "हल्का (Mild)" : "Mild"}</span>
              <span>5 - {lang === "hi" ? "मध्यम (Moderate)" : "Moderate"}</span>
              <span>10 - {lang === "hi" ? "असहनीय (Extreme)" : "Unbearable"}</span>
            </div>
          </div>

          {/* Duration Chips */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px", display: "block" }}>
              {lang === "hi" ? "यह लक्षण कितने समय से बना हुआ है?" : "How long has this symptom been present?"}
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { id: "< 24 hours", en: "Less than 24 hours", hi: "24 घंटे से कम" },
                { id: "1-3 days", en: "1 - 3 Days", hi: "1 से 3 दिन" },
                { id: "4-7 days", en: "4 - 7 Days", hi: "4 से 7 दिन" },
                { id: "more than 1 week", en: "More than 1 week", hi: "1 सप्ताह से अधिक" }
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDuration(d.id)}
                  className="btn"
                  style={{
                    background: duration === d.id ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "var(--bg-elevated)",
                    color: duration === d.id ? "#ffffff" : "var(--text-muted)",
                    border: duration === d.id ? "none" : "1px solid var(--border-color)",
                    fontWeight: duration === d.id ? 700 : 500,
                    fontSize: "0.85rem",
                    padding: "8px 16px"
                  }}
                >
                  {lang === "hi" ? d.hi : d.en}
                </button>
              ))}
            </div>
          </div>

          {/* Acute Red Flag Emergency Checkbox */}
          <div style={{
            background: "var(--status-crit-bg)",
            border: "1px solid var(--status-crit-border)",
            borderRadius: "12px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "24px",
            cursor: "pointer"
          }}
          onClick={() => setHasEmergencyFlag(!hasEmergencyFlag)}
          >
            <input
              type="checkbox"
              checked={hasEmergencyFlag}
              onChange={(e) => setHasEmergencyFlag(e.target.checked)}
              style={{ width: "20px", height: "20px", marginTop: "2px", accentColor: "#ef4444" }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--status-crit-text)" }}>
                {lang === "hi" ? "अचानक बेहोशी, सांस फूलना या चेहरे का सुन्न होना?" : "Sudden loss of consciousness, severe breathlessness, or speech difficulty?"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-main)", marginTop: "2px" }}>
                {lang === "hi" ? "यदि हाँ, तो यह आपातकालीन हस्तक्षेप की मांग करता है।" : "If yes, this immediately triggers our highest emergency assessment protocol."}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>{lang === "hi" ? "पीछे जाएं" : "Back"}</span>
            </button>
            <button onClick={() => setStep(4)} className="btn btn-primary" style={{ padding: "12px 24px" }}>
              <span>{lang === "hi" ? "मूल्यांकन परिणाम देखें" : "Generate Triage Assessment"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Comprehensive AI Clinical Triage Outcome */}
      {step === 4 && (
        <div className="glass-panel" style={{ padding: "26px 30px" }}>
          {/* Triage Outcome Header Banner */}
          <div style={{
            background: triageResult.level === "emergency" 
              ? "var(--status-crit-bg)" 
              : triageResult.level === "urgent" 
              ? "var(--status-warn-bg)" 
              : "var(--status-good-bg)",
            border: `1.5px solid ${triageResult.color}`,
            borderRadius: "14px",
            padding: "20px 22px",
            marginBottom: "24px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 900, fontSize: "1.1rem", color: triageResult.color, textTransform: "uppercase" }}>
              {triageResult.level === "emergency" ? <ShieldAlert size={26} /> : triageResult.level === "urgent" ? <AlertTriangle size={26} /> : <CheckCircle2 size={26} />}
              <span>{lang === "hi" ? triageResult.badgeHi : triageResult.badgeEn}</span>
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-highlight)", marginTop: "8px", lineHeight: "1.5", fontWeight: 600 }}>
              {lang === "hi" ? triageResult.actionHi : triageResult.actionEn}
            </p>
          </div>

          {/* Action Steps Checklist */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} color="var(--primary)" />
              {lang === "hi" ? "अनुशंसित तात्कालिक कदम:" : "Recommended Immediate Action Protocol:"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(lang === "hi" ? triageResult.stepsHi : triageResult.stepsEn).map((st, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-color)",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {i + 1}
                  </span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency SOS Call Trigger if emergency */}
          {triageResult.level === "emergency" && (
            <div style={{
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              borderRadius: "14px",
              padding: "18px 22px",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 900 }}>
                  {lang === "hi" ? "आपातकालीन एम्बुलेंस डायल करें" : "Dial Emergency Ambulance Hotline"}
                </div>
                <div style={{ fontSize: "0.82rem", opacity: 0.9 }}>
                  {lang === "hi" ? "भारत में आपातकालीन नंबर: 112 / 102" : "National Emergency Helpline: 112 / 102"}
                </div>
              </div>
              <a href="tel:112" className="btn" style={{ background: "#ffffff", color: "#ef4444", fontWeight: 900 }}>
                <Phone size={16} />
                <span>{lang === "hi" ? "112 पर कॉल करें" : "Call 112 Now"}</span>
              </a>
            </div>
          )}

          {/* Bottom Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "18px" }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <RotateCcw size={15} />
              <span>{lang === "hi" ? "पुनः जांच करें (Reset)" : "Start New Assessment"}</span>
            </button>

            <button onClick={handleTransferToCopilot} className="btn btn-primary" style={{ padding: "12px 20px" }}>
              <MessageSquareHeart size={16} />
              <span>{lang === "hi" ? "कोपायलट से इस रिपोर्ट पर चर्चा करें" : "Discuss Assessment with AI Copilot"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
