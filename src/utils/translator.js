// Universal Medical and UI Translator for PulseAI
// Supports 10 Languages: en, hi, hinglish, bn, mr, te, ta, gu, pa, kn

export const MEDICAL_DICTIONARY = {
  // Conditions
  "Type 2 Diabetes Mellitus": {
    hi: "टाइप 2 डायबिटीज मेलिटस",
    hinglish: "Type 2 Diabetes Mellitus",
    bn: "টাইপ ২ ডায়াবেটিস মেলিটাস",
    mr: "टाइप २ मधुमेह (डायबिटीज)",
    te: "టైప్ 2 డయాబెటిస్ మెల్లిటస్",
    ta: "வகை 2 நீரிழிவு நோய்",
    gu: "ટાઇપ 2 ડાયાબિટીસ મેલીટસ",
    pa: "ਟਾਈਪ 2 ਸ਼ੂਗਰ (ਡਾਇਬਟੀਜ਼)",
    kn: "ಟೈಪ್ 2 ಮಧುಮೇಹ ಮೆಲ್ಲಿಟಸ್"
  },
  "Essential Hypertension": {
    hi: "उच्च रक्तचाप (हाइपरटेंशन)",
    hinglish: "High BP (Hypertension)",
    bn: "উচ্চ রক্তচাপ (হাইপারটেনশন)",
    mr: "उच्च रक्तदाब (हायपरटेंशन)",
    te: "అధిక రక్తపోటు (హైపర్‌టెన్షన్)",
    ta: "உயர் இரத்த அழுத்தம்",
    gu: "હાઈ બ્લડ પ્રેશર (હાયપરટેન્શન)",
    pa: "ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
    kn: "ಅಧಿಕ ರಕ್ತದೊತ್ತಡ"
  },
  "Mild Dyslipidemia": {
    hi: "हल्का डिस्लिपिडेमिया (कोलेस्ट्रॉल)",
    hinglish: "Mild Cholesterol Imbalance",
    bn: "হালকা ডিসলিপিডেমিয়া (রক্তে চর্বি)",
    mr: "सौम्य डिसलिपिडेमिया (कोलेस्ट्रॉल)",
    te: "తేలికపాటి డిస్లిపిడెమియా",
    ta: "லேசான கொழுப்பு ஏற்றத்தாழ்வு",
    gu: "હળવું ડિસ્લિપિડેમિયા",
    pa: "ਹਲਕਾ ਕੋਲੈਸਟ੍ਰੋਲ ਅਸੰਤੁਲਨ",
    kn: "ಸೌಮ್ಯ ಕೊಲೆಸ್ಟ್ರಾಲ್ ವ್ಯತ್ಯಾಸ"
  },

  // Allergies
  "Penicillin": {
    hi: "पेनिसिलिन",
    hinglish: "Penicillin",
    bn: "পেনিসিলিন",
    mr: "पेनिसिलिन",
    te: "పెన్సిలిన్",
    ta: "பென்சிலின்",
    gu: "પેનિસિલિન",
    pa: "ਪੈਨਿਸਿਲਿਨ",
    kn: "ಪೆನ್ಸಿಲಿನ್"
  },
  "Sulfa Drugs": {
    hi: "सल्फा दवाएं",
    hinglish: "Sulfa Drugs",
    bn: "সালফা ওষুধ",
    mr: "सल्फा औषधे",
    te: "సల్ఫా మందులు",
    ta: "சல்ஃபா மருந்துகள்",
    gu: "સલ્ફા દવાઓ",
    pa: "ਸਲਫਾ ਦਵਾਈਆਂ",
    kn: "ಸಲ್ಫಾ ಔಷಧಗಳು"
  },

  // Statuses & Regimen
  "Active (Oral Agents)": {
    hi: "सक्रिय (दवाओं पर)",
    hinglish: "Active (Medicines par)",
    bn: "সক্রিয় (মুখের ওষুধ চলছে)",
    mr: "सक्रिय (गोळ्या सुरू)",
    te: "యాక్టివ్ (మందులు వాడుతున్నారు)",
    ta: "செயலில் (மாத்திரைகள் மூலம்)",
    gu: "સક્રિય (દવાઓ ચાલુ)",
    pa: "ਸਰਗਰਮ (ਦਵਾਈਆਂ ਚੱਲ ਰਹੀਆਂ ਹਨ)",
    kn: "ಸಕ್ರಿಯ (ಮಾತ್ರೆಗಳು ಚಾಲ್ತಿಯಲ್ಲಿದೆ)"
  },
  "Controlled on ARB": {
    hi: "नियंत्रित (ARB दवा द्वारा)",
    hinglish: "Controlled on ARB",
    bn: "নিয়ন্ত্রিত (ARB ওষুধ দ্বারা)",
    mr: "नियंत्रित (ARB औषधाने)",
    te: "నియంత్రణలో ఉంది (ARB మందు ద్వారా)",
    ta: "கட்டுப்பாட்டில் உள்ளது (ARB)",
    gu: "નિયંત્રિત (ARB દવા દ્વારા)",
    pa: "ਕੰਟਰੋਲ ਹੇਠ (ARB ਦਵਾਈ)",
    kn: "ನಿಯಂತ್ರಣದಲ್ಲಿದೆ (ARB)"
  },
  "Under Statin Therapy": {
    hi: "स्टेटिन थेरेपी जारी",
    hinglish: "Statin Therapy par",
    bn: "স্ট্যাটিন থেরাপি চলছে",
    mr: "स्टॅटिन उपचार सुरू",
    te: "స్టాటిన్ చికిత్సలో ఉంది",
    ta: "ஸ்டேடின் சிகிச்சை கீழ்",
    gu: "સ્ટેટિન સારવાર હેઠળ",
    pa: "ਸਟੈਟਿਨ ਇਲਾਜ ਅਧੀਨ",
    kn: "ಸ್ಟ್ಯಾಟಿನ್ ಚಿಕಿತ್ಸೆಯಲ್ಲಿದೆ"
  },

  // Routines & Slots
  "Morning Routine": {
    hi: "सुबह की दिनचर्या",
    hinglish: "Morning Routine",
    bn: "সকালের রুটিন",
    mr: "सकाळचे वेळापत्रक",
    te: "ఉదయం షెడ్యూల్",
    ta: "காலை அட்டவணை",
    gu: "સવારનો સમય",
    pa: "ਸਵੇਰ ਦਾ ਸਮਾਂ",
    kn: "ಬೆಳಗಿನ ದಿನಚರಿ"
  },
  "Afternoon Routine": {
    hi: "दोपहर की दिनचर्या",
    hinglish: "Afternoon Routine",
    bn: "দুপুরের রুটিন",
    mr: "दुपारचे वेळापत्रक",
    te: "మధ్యాహ్నం షెడ్యూల్",
    ta: "மதிய அட்டவணை",
    gu: "બપોરનો સમય",
    pa: "ਦੁਪਹਿਰ ਦਾ ਸਮਾਂ",
    kn: "ಮಧ್ಯಾಹ್ನದ ದಿನಚರಿ"
  },
  "Night Routine": {
    hi: "रात की दिनचर्या",
    hinglish: "Night Routine",
    bn: "রাতের রুটিন",
    mr: "रात्रीचे वेळापत्रक",
    te: "రాత్రి షెడ్యూల్",
    ta: "இரவு அட்டவணை",
    gu: "રાત્રિનો સમય",
    pa: "ਰਾਤ ਦਾ ਸਮਾਂ",
    kn: "ರಾತ್ರಿಯ ದಿನಚರಿ"
  },
  "Completed": {
    hi: "पूर्ण हुआ",
    hinglish: "Completed",
    bn: "সম্পন্ন",
    mr: "पूर्ण झाले",
    te: "పూర్తయింది",
    ta: "முடிந்தது",
    gu: "પૂર્ણ થયું",
    pa: "ਪੂਰਾ ਹੋਇਆ",
    kn: "ಪೂರ್ಣಗೊಂಡಿದೆ"
  },
  "days supply": {
    hi: "दिनों की खुराक शेष",
    hinglish: "days supply bachi hai",
    bn: "দিনের ওষুধ অবশিষ্ট",
    mr: "दिवसांचा साठा शिल्लक",
    te: "రోజుల మందులు మిగిలి ఉన్నాయి",
    ta: "நாட்கள் இருப்பு உள்ளது",
    gu: "દિવસનો જથ્થો બાકી",
    pa: "ਦਿਨਾਂ ਦੀ ਖੁਰਾਕ ਬਾਕੀ",
    kn: "ದಿನಗಳ ಸರಬರಾಜು ಉಳಿದಿದೆ"
  },
  "Take with/after meals": {
    hi: "भोजन के साथ या बाद में लें",
    hinglish: "Khane ke sath ya baad me lein",
    bn: "খাবারের সাথে বা পরে গ্রহণ করুন",
    mr: "जेवणासोबत किंवा जेवणानंतर घ्या",
    te: "భోజనంతో లేదా తర్వాత తీసుకోండి",
    ta: "உணவுடன் அல்லது உணவுக்குப் பின்",
    gu: "જમ્યા પછી અથવા સાથે લો",
    pa: "ਖਾਣੇ ਦੇ ਨਾਲ ਜਾਂ ਬਾਅਦ ਵਿੱਚ ਲਓ",
    kn: "ಊಟದೊಂದಿಗೆ ಅಥವಾ ಊಟದ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಿ"
  },
  "Take on empty stomach": {
    hi: "खाली पेट लें",
    hinglish: "Khali pet lein",
    bn: "খালি পেটে গ্রহণ করুন",
    mr: "उपाशीपोटी घ्या",
    te: "ఖాళీ కడుపుతో తీసుకోండి",
    ta: "வெறும் வயிற்றில் உட்கொள்ளவும்",
    gu: "ભૂખ્યા પેટે લો",
    pa: "ਖ਼ਾਲੀ ਪੇਟ ਲਓ",
    kn: "ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಿ"
  },
  "No medications scheduled for this time.": {
    hi: "इस समय के लिए कोई दवा निर्धारित नहीं है।",
    hinglish: "Is time ke liye koi medicine schedule nahi hai.",
    bn: "এই সময়ের জন্য কোনো ওষুধ নির্ধারিত নেই।",
    mr: "या वेळेसाठी कोणतेही औषध निर्धारित नाही.",
    te: "ఈ సమయానికి ఎటువంటి మందులు షెడ్యూల్ చేయబడలేదు.",
    ta: "இந்த நேரத்திற்கு எந்த மருந்தும் திட்டமிடப்படவில்லை.",
    gu: "આ સમય માટે કોઈ દવા નિર્ધારિત નથી.",
    pa: "ਇਸ ਸਮੇਂ ਲਈ ਕੋਈ ਦਵਾਈ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੈ।",
    kn: "ಈ ಸಮಯಕ್ಕೆ ಯಾವುದೇ ಔಷಧಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ."
  },

  // Action Buttons & Titles
  "Daily Dosage Schedule": {
    hi: "दैनिक खुराक शेड्यूल",
    hinglish: "Daily Dose Schedule",
    bn: "দৈনিক ডোজের সময়সূচী",
    mr: "दैनिक डोस वेळापत्रक",
    te: "రోజువారీ మోతాదు షెడ్యూల్",
    ta: "தினசரி மருந்தளவு அட்டவணை",
    gu: "દૈનિક ડોઝ શેડ્યૂલ",
    pa: "ਰੋਜ਼ਾਨਾ ਖੁਰਾਕ ਸ਼ਡਿਊਲ",
    kn: "ದೈನಂದಿನ ಡೋಸ್ ವೇಳಾಪಟ್ಟಿ"
  },
  "Drug Interaction Scanner": {
    hi: "दवा टकराव व सुरक्षा स्कैनर",
    hinglish: "Drug Conflict Scanner",
    bn: "ওষুধ সংঘাত ও সুরক্ষা স্ক্যানার",
    mr: "औषध परस्परक्रिया स्कॅनर",
    te: "ఔషధ పరస్పర చర్య స్కానర్",
    ta: "மருந்து முரண்பாடு ஸ்கேனர்",
    gu: "ડ્રગ ઇન્ટરેક્શન સ્કેનર",
    pa: "ਡਰੱਗ ਇੰਟਰਐਕਸ਼ਨ ਸਕੈਨਰ",
    kn: "ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆ ಸ್ಕ್ಯಾನರ್"
  },
  "Add Medication": {
    hi: "दवा जोड़ें",
    hinglish: "Medicine Add karein",
    bn: "ওষুধ যোগ করুন",
    mr: "औषध जोडा",
    te: "మందును జోడించండి",
    ta: "மருந்து சேர்க்க",
    gu: "દવા ઉમેરો",
    pa: "ਦਵਾਈ ਜੋੜੋ",
    kn: "ಔಷಧ ಸೇರಿಸಿ"
  },
  "Close Form": {
    hi: "फॉर्म बंद करें",
    hinglish: "Form Close karein",
    bn: "ফর্ম বন্ধ করুন",
    mr: "फॉर्म बंद करा",
    te: "ఫారమ్ మూసివేయండి",
    ta: "படிவத்தை மூடு",
    gu: "ફોર્મ બંધ કરો",
    pa: "ਫਾਰਮ ਬੰਦ ਕਰੋ",
    kn: "ಫಾರ್ಮ್ ಮುಚ್ಚಿ"
  },
  "Add New Prescription": {
    hi: "नया नुस्खा (प्रिस्क्रिप्शन) जोड़ें",
    hinglish: "New Prescription Add karein",
    bn: "নতুন প্রেসক্রিপশন যোগ করুন",
    mr: "नवीन प्रिस्क्रिप्शन जोडा",
    te: "కొత్త ప్రిస్క్రిప్షన్ జోడించండి",
    ta: "புதிய மருந்துச் சீட்டைச் சேர்க்கவும்",
    gu: "નવું પ્રિસ્ક્રિપ્શન ઉમેરો",
    pa: "ਨਵਾਂ ਨੁਸਖਾ ਜੋੜੋ",
    kn: "ಹೊಸ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸೇರಿಸಿ"
  },
  "Medication Name": {
    hi: "दवा का नाम",
    hinglish: "Medicine Name",
    bn: "ওষুধের নাম",
    mr: "औषधाचे नाव",
    te: "మందు పేరు",
    ta: "மருந்தின் பெயர்",
    gu: "દવાનું નામ",
    pa: "ਦਵਾਈ ਦਾ ਨਾਮ",
    kn: "ಔಷಧಿಯ ಹೆಸರು"
  },
  "Dosage": {
    hi: "खुराक (डोज़)",
    hinglish: "Dosage",
    bn: "ডোজ / মাত্রা",
    mr: "डोस (प्रमाण)",
    te: "మోతాదు",
    ta: "மருந்தளவு",
    gu: "માત્રા",
    pa: "ਖੁਰਾਕ",
    kn: "ಪ್ರಮಾಣ (ಡೋಸೇಜ್)"
  },
  "Daily Timing": {
    hi: "दिन का समय",
    hinglish: "Daily Timing",
    bn: "গ্রহণের সময়",
    mr: "घेण्याची वेळ",
    te: "తీసుకోవలసిన సమయం",
    ta: "எடுத்துக்கொள்ளும் நேரம்",
    gu: "સમય",
    pa: "ਸਮਾਂ",
    kn: "ಸಮಯ"
  },
  "Purpose / Condition": {
    hi: "उद्देश्य / बीमारी",
    hinglish: "Kiske liye hai (Condition)",
    bn: "উদ্দেশ্য / রোগ",
    mr: "उद्देश / आजार",
    te: "ఉద్దేశం / వ్యాధి",
    ta: "நோக்கம் / நோய்",
    gu: "રોગ / હેતુ",
    pa: "ਮਕਸਦ / ਬਿਮਾਰੀ",
    kn: "ಉದ್ದೇಶ / ಸ್ಥಿತಿ"
  },
  "Save to Daily Regimen": {
    hi: "दैनिक दिनचर्या में सुरक्षित करें",
    hinglish: "Save to Daily Regimen",
    bn: "দৈনিক তালিকায় সংরক্ষণ করুন",
    mr: "वेळापत्रकात सेव्ह करा",
    te: "రోజువారీ జాబితాలో సేవ్ చేయండి",
    ta: "பட்டியலில் சேமிக்கவும்",
    gu: "સેવ કરો",
    pa: "ਸੁਰੱਖਿਅਤ ਕਰੋ",
    kn: "ದಿನಚರಿಯಲ್ಲಿ ಉಳಿಸಿ"
  },
  "Test An Over-The-Counter Medicine Before Taking": {
    hi: "बिना पर्ची वाली (OTC) दवा लेने से पहले जांचें",
    hinglish: "OTC Medicine lene se pehle Safety check karein",
    bn: "কোনো সাধারণ বা ব্যথানাশক ওষুধ খাওয়ার আগে পরীক্ষা করুন",
    mr: "कोणतेही वेदनाशामक औषध घेण्यापूर्वी तपासा",
    te: "ఏదైనా పెయిన్‌కిల్లర్ తీసుకునే ముందు సురక్షితతను పరీక్షించండి",
    ta: "வலி நிவாரணி மாத்திரை எடுக்கும் முன் சோதிக்கவும்",
    gu: "પેઇનકિલર લેતાં પહેલાં તપાસો",
    pa: "ਕੋਈ ਵੀ ਦਵਾਈ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਸੁਰੱਖਿਆ ਪਰਖੋ",
    kn: "ಯಾವುದೇ ನೋವು ನಿವಾರಕ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಪರೀಕ್ಷಿಸಿ"
  },
  "Scan Safety": {
    hi: "सुरक्षा जांचें",
    hinglish: "Scan Safety",
    bn: "নিরাপত্তা স্ক্যান করুন",
    mr: "सुरक्षितता तपासा",
    te: "భద్రతను స్కాన్ చేయండి",
    ta: "பாதுகாப்பைச் சோதிக்கவும்",
    gu: "તપાસો",
    pa: "ਜਾਂਚ ਕਰੋ",
    kn: "ಸುರಕ್ಷತೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ"
  },
  "Quick Test:": {
    hi: "त्वरित जांच:",
    hinglish: "Quick Test:",
    bn: "দ্রুত পরীক্ষা:",
    mr: "जलद चाचणी:",
    te: "త్వరిత పరీక్ష:",
    ta: "விரைவு சோதனை:",
    gu: "ઝડપી પરીક્ષણ:",
    pa: "ਤੁਰੰਤ ਜਾਂਚ:",
    kn: "ತ್ವರಿತ ಪರೀಕ್ಷೆ:"
  },
  "Safer Alternative:": {
    hi: "💡 सुरक्षित विकल्प:",
    hinglish: "💡 Safer Alternative:",
    bn: "💡 নিরাপদ বিকল্প:",
    mr: "💡 सुरक्षित पर्याय:",
    te: "💡 సురక్షితమైన ప్రత్యామ్నಾಯం:",
    ta: "💡 பாதுகாப்பான மாற்று:",
    gu: "💡 સુરક્ષિત વિકલ્પ:",
    pa: "💡 ਸੁਰੱਖਿਅਤ ਬਦਲ:",
    kn: "💡 ಸುರಕ್ಷಿತ ಪರ್ಯಾಯ:"
  }
};

/**
 * Translates any medical term, condition, allergy, or UI phrase.
 * If exact match is found, returns translation for targetLang.
 * If not found, falls back gracefully to the original term.
 */
export function translateMedicalTerm(term, lang = "en") {
  if (!term || typeof term !== "string" || !lang || lang === "en") {
    return term;
  }
  const clean = term.trim();
  const entry = MEDICAL_DICTIONARY[clean];
  if (entry && entry[lang]) {
    return entry[lang];
  }
  // Case-insensitive fallback
  const lower = clean.toLowerCase();
  for (const [key, val] of Object.entries(MEDICAL_DICTIONARY)) {
    if (key.toLowerCase() === lower && val[lang]) {
      return val[lang];
    }
  }
  return term;
}

/**
 * Recursively scans visible text nodes across the entire page
 * and replaces recognized English phrases with the active language translation.
 * Non-destructive and lossless (stores original in memory).
 */
export function applyDomTranslations(lang = "en") {
  if (typeof document === "undefined" || !document.body) return;

  try {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      try {
        const parent = node.parentElement;
        if (
          !parent ||
          parent.tagName === "SCRIPT" ||
          parent.tagName === "STYLE" ||
          parent.tagName === "FONT" ||
          parent.tagName === "SELECT" ||
          parent.tagName === "OPTION" ||
          parent.isContentEditable ||
          parent.closest(".notranslate") ||
          parent.closest("[translate='no']") ||
          parent.closest("[lang='zxx']")
        ) {
          continue;
        }

        const currentText = node.nodeValue?.trim();
        if (!currentText) continue;

        // Retrieve or cache original text
        if (!node.__pulseOriginal) {
          node.__pulseOriginal = node.nodeValue;
        }

        const originalText = node.__pulseOriginal;
        const cleanOrig = originalText.trim();

        if (lang === "en") {
          if (node.nodeValue !== originalText) {
            node.nodeValue = originalText;
          }
          continue;
        }

        // Check if whole string matches
        const translated = translateMedicalTerm(cleanOrig, lang);
        if (translated && translated !== cleanOrig) {
          node.nodeValue = originalText.replace(cleanOrig, translated);
        }
      } catch {
        // Individual node error safely caught
      }
    }
  } catch (err) {
    console.warn("[PulseAI] DOM translation skipped:", err);
  }
}

/**
 * Automatically triggers Google Translate across the entire page for 100% deep translation
 */
export function triggerGoogleTranslate(lang = "en") {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    const target = (lang === "hinglish" || !lang) ? "hi" : lang;

    // Set Google Translate cookie safely
    try {
      if (target === "en") {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (window.location.hostname) {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        }
      } else {
        document.cookie = `googtrans=/en/${target}; path=/;`;
        if (window.location.hostname) {
          document.cookie = `googtrans=/en/${target}; domain=${window.location.hostname}; path=/;`;
        }
      }
    } catch {
      // Ignore cookie restrictions
    }

    // Clean any body shift or injected banner frames immediately
    const cleanBannerShift = () => {
      try {
        if (document.body) {
          if (document.body.style.top && document.body.style.top !== "0px") {
            document.body.style.top = "0px";
          }
          if (document.body.style.position === "relative") {
            document.body.style.position = "static";
          }
        }
        if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== "0px") {
          document.documentElement.style.top = "0px";
        }
        const banners = document.querySelectorAll(
          ".goog-te-banner-frame, iframe.goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd, iframe.VIpgJd-ZVi9od-ORHb-OEVmcd, body > .skiptranslate, body > iframe.skiptranslate, iframe.skiptranslate, iframe[src*='translate.google']"
        );
        banners.forEach((el) => {
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
          el.style.setProperty("height", "0px", "important");
          el.style.setProperty("width", "0px", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
        });
      } catch {
        // Suppress banner cleanup errors
      }
    };

    cleanBannerShift();

    // Attempt to activate the hidden combo element
    const activateCombo = () => {
      cleanBannerShift();
      try {
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
          if (combo.value !== target) {
            combo.value = target;
            combo.dispatchEvent(new Event("change"));
          }
          cleanBannerShift();
          return true;
        }
      } catch {
        // Dispatch error caught
      }
      return false;
    };

    if (!activateCombo()) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        cleanBannerShift();
        if (activateCombo() || count > 20) {
          clearInterval(interval);
        }
      }, 150);
    }
  } catch (err) {
    console.warn("[PulseAI] Trigger Google translate caught:", err);
  }
}

