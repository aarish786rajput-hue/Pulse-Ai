// Clinically validated drug-drug and drug-condition interaction knowledge base
// Multi-language support for all 10 languages: en, hi, hinglish, bn, mr, te, ta, gu, pa, kn

export const knownInteractions = [
  {
    drug1: "Aspirin",
    drug2: "Warfarin",
    severity: "critical",
    title: "Major Bleeding Hazard",
    description: "Combining Aspirin with Warfarin or other anticoagulants drastically increases the risk of severe gastrointestinal and internal hemorrhages.",
    actionRecommendation: "Do not take concurrently unless under close clinical supervision with frequent INR blood monitoring.",
    translations: {
      hi: {
        title: "गंभीर रक्तस्राव (ब्लडिंग) का खतरा",
        description: "एस्पिरिन और वारफेरिन या अन्य रक्त पतला करने वाली दवाओं को एक साथ लेने से आंतरिक व पेट में गंभीर रक्तस्राव का जोखिम बहुत बढ़ जाता है।",
        actionRecommendation: "डॉक्टर की सख्त निगरानी और नियमित INR टेस्ट के बिना इन दोनों को एक साथ कभी न लें।"
      },
      hinglish: {
        title: "Major Bleeding ka Danger",
        description: "Aspirin aur Warfarin ek saath lene se internal aur pet me bleeding ka risk drastically badh jata hai.",
        actionRecommendation: "Doctor ke regular supervision aur INR blood test ke bina dono medicines saath me na lein."
      },
      bn: {
        title: "গুরুতর রক্তক্ষরণের ঝুঁকি",
        description: "অ্যাসপিরিন এবং ওয়ারফারিন একসাথে গ্রহণ করলে পাকস্থলী ও অভ্যন্তরীণ রক্তক্ষরণের ঝুঁকি মারাত্মকভাবে বৃদ্ধি পায়।",
        actionRecommendation: "চিকিৎসকের নিবিড় পর্যবেক্ষণ ও নিয়মিত INR রক্ত পরীক্ষা ছাড়া একসাথে খাবেন না।"
      },
      mr: {
        title: "गंभीर रक्तस्त्रावाचा धोका",
        description: "एस्पिरिन आणि वॉरफेरिन एकत्र घेतल्यास पोटात आणि शरीरात अंतर्गत रक्तस्त्रावाचा मोठा धोका निर्माण होतो.",
        actionRecommendation: "डॉक्टरांच्या सल्ल्याशिवाय आणि नियमित INR तपासणीशिवाय ही दोन्ही औषधे एकत्र घेऊ नका."
      },
      te: {
        title: "తీవ్రమైన రక్తస్రావ ప్రమాదం",
        description: "ఆస్పిరిన్ మరియు వార్ఫరిన్ కలిపి తీసుకోవడం వల్ల అంతర్గత రక్తస్రావం జరిగే ప్రమాదం బాగా పెరుగుతుంది.",
        actionRecommendation: "వైద్యుడి పర్యవేక్షణ మరియు క్రమమైన INR పరీక్షలు లేకుండా వీటిని కలిపి తీసుకోకండి."
      },
      ta: {
        title: "கடுமையான இரத்தப்போக்கு ஆபத்து",
        description: "ஆஸ்பிரின் மற்றும் வார்ஃபரின் ஒன்றாக உட்கொள்வது கடுமையான உள் இரத்தப்போக்கு அபாயத்தை உருவாக்குகிறது.",
        actionRecommendation: "மருத்துவர் கண்காணிப்பு மற்றும் வழக்கமான INR பரிசோதனை இல்லாமல் இரண்டையும் ஒன்றாக உட்கொள்ள வேண்டாம்."
      },
      gu: {
        title: "ગંભીર રક્તસ્ત્રાવનું જોખમ",
        description: "એસ્પિરિન અને વોરફરીન એકસાથે લેવાથી પેટમાં અને આંતરિક રક્તસ્ત્રાવનું જોખમ ઘણું વધી જાય છે.",
        actionRecommendation: "ડૉક્ટરની દેખરેખ અને નિયમિત INR ટેસ્ટ વિના આ દવાઓ સાથે ન લેશો."
      },
      pa: {
        title: "ਗੰਭੀਰ ਖੂਨ ਵਹਿਣ ਦਾ ਖਤਰਾ",
        description: "ਐਸਪਰੀਨ ਅਤੇ ਵਾਰਫਰੀਨ ਇਕੱਠੇ ਲੈਣ ਨਾਲ ਅੰਦਰੂਨੀ ਖੂਨ ਵਹਿਣ ਦਾ ਖਤਰਾ ਬਹੁਤ ਜ਼ਿਆਦਾ ਵੱਧ ਜਾਂਦਾ ਹੈ।",
        actionRecommendation: "ਡਾਕਟਰ ਦੀ ਸਖ਼ਤ ਨਿਗਰਾਨੀ ਅਤੇ ਨਿਯਮਿਤ INR ਟੈਸਟ ਤੋਂ ਬਿਨਾਂ ਇਹ ਦੋਵੇਂ ਇਕੱਠੀਆਂ ਨਾ ਲਓ।"
      },
      kn: {
        title: "ತೀವ್ರ ರಕ್ತಸ್ರಾವದ ಅಪಾಯ",
        description: "ಆಸ್ಪಿರಿನ್ ಮತ್ತು ವಾರ್ಫರಿನ್ ಒಟ್ಟಿಗೆ ಸೇವಿಸುವುದರಿಂದ ಆಂತರಿಕ ರಕ್ತಸ್ರಾವದ ಅಪಾಯ ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚಾಗುತ್ತದೆ.",
        actionRecommendation: "ವೈದ್ಯರ ಕಟ್ಟುನಿಟ್ಟಾದ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ನಿಯಮಿತ INR ಪರೀಕ್ಷೆಯಿಲ್ಲದೆ ಇವುಗಳನ್ನು ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ."
      }
    }
  },
  {
    drug1: "Ibuprofen",
    drug2: "Telmisartan",
    severity: "warning",
    title: "Blunted BP Efficacy & Renal Stress",
    description: "NSAIDs like Ibuprofen or Naproxen can decrease the blood pressure lowering effect of ARBs (Telmisartan) and worsen kidney function.",
    actionRecommendation: "Prefer Paracetamol / Acetaminophen for pain relief or fever instead of NSAIDs.",
    translations: {
      hi: {
        title: "बीपी दवा का असर कम व किडनी पर दबाव",
        description: "आइबुप्रोफेन जैसी दर्द निवारक दवाएं टेल्मीसार्टन के बीपी घटाने वाले असर को कमजोर करती हैं और किडनी पर तनाव बढ़ाती हैं।",
        actionRecommendation: "दर्द या बुखार के लिए दर्दनिवारक NSAID के बदले पैरासिटामोल का उपयोग करें।"
      },
      hinglish: {
        title: "BP Effect kam aur Kidney par Stress",
        description: "Ibuprofen jaisi painkillers Telmisartan ke BP control karne ke effect ko kam kar deti hain aur kidney par pressure dalti hain.",
        actionRecommendation: "Pain ya fever ke liye Ibuprofen ke bajay Paracetamol prefer karein."
      },
      bn: {
        title: "রক্তচাপ নিয়ন্ত্রণের কার্যকারিতা হ্রাস ও কিডনির ক্ষতি",
        description: "আইবুপ্রোফেনের মতো ব্যথানাশক ওষুধ টেলমিসার্টানের রক্তচাপ কমানোর ক্ষমতা কমিয়ে দেয় এবং কিডনিতে চাপ সৃষ্টি করে।",
        actionRecommendation: "ব্যথা বা জ্বরের জন্য আইবুপ্রোফেনের বদলে প্যারাসিটামল ব্যবহার করুন।"
      },
      mr: {
        title: "बीपी औषधाचा प्रभाव कमी आणि किडनीवर ताण",
        description: "इबुप्रोफेनसारख्या वेदनाशामक गोळ्या टेल्मिसार्टनचा बीपी नियंत्रित करण्याचा प्रभाव कमी करतात आणि मूत्रपिंडावर ताण आणतात.",
        actionRecommendation: "वेदना किंवा तापासाठी इबुप्रोफेनऐवजी पॅरासिटामॉल घेणे सुरक्षित आहे."
      },
      te: {
        title: "బీపీ ఔషధ ప్రభావం తగ్గింపు & కిడ్నీపై ఒత్తిడి",
        description: "ఐబుప్రోఫెన్ వంటి పెయిన్‌కిల్లర్స్ టెల్మిసార్టాన్ బీపీ నియంత్రణ సామర్థ్యాన్ని తగ్గించి కిడ్నీలపై భారం మోపుతాయి.",
        actionRecommendation: "నొప్పులు లేదా జ్వరానికి ఐబుప్రోఫెన్‌కు బదులుగా పారాసిటమాల్ వాడండి."
      },
      ta: {
        title: "இரத்த அழுத்த மருந்து வீரியம் குறைவு & சிறுநீரக அழுத்தம்",
        description: "இப்யூபுரூஃபன் போன்ற வலி நிவாரணிகள் டெல்மிசார்டனின் இரத்த அழுத்தக் கட்டுப்பாட்டைக் குறைத்து சிறுநீரகத்தை பாதிக்கலாம்.",
        actionRecommendation: "வலி அல்லது காய்ச்சலுக்கு இப்யூபுரூஃபெனுக்குப் பதிலாக பாராசிட்டமால் பயன்படுத்துங்கள்."
      },
      gu: {
        title: "બીપી દવાની અસર ઓછી અને કિડની પર તણાવ",
        description: "આઇબુપ્રૂફેન જેવી પેઇનકિલર્સ ટેલ્મિસારટનની બીપી ઘટાડવાની અસરને ઓછી કરે છે અને કિડની પર જોખમ વધારે છે.",
        actionRecommendation: "દુખાવા કે તાવ માટે આઇબુપ્રૂફેનને બદલે પેરાસિટામોલનો ઉપયોગ કરો."
      },
      pa: {
        title: "ਬੀਪੀ ਦਵਾਈ ਦਾ ਅਸਰ ਘੱਟ ਅਤੇ ਗੁਰਦਿਆਂ 'ਤੇ ਦਬਾਅ",
        description: "ਆਈਬੂਪ੍ਰੋਫੇਨ ਵਰਗੀਆਂ ਦਰਦ ਨਿਵਾਰਕ ਦਵਾਈਆਂ ਟੈਲਮੀਸਾਰਟਨ ਦੇ ਬੀਪੀ ਘਟਾਉਣ ਵਾਲੇ ਅਸਰ ਨੂੰ ਕਮਜ਼ੋਰ ਕਰਦੀਆਂ ਹਨ ਅਤੇ ਗੁਰਦਿਆਂ 'ਤੇ ਬੋਝ ਪਾਉਂਦੀਆਂ ਹਨ।",
        actionRecommendation: "ਦਰਦ ਜਾਂ ਬੁਖਾਰ ਲਈ ਆਈਬੂਪ੍ਰੋਫੇਨ ਦੀ ਥਾਂ ਪੈਰਾਸੀਟਾਮੋਲ ਦੀ ਵਰਤੋਂ ਕਰੋ।"
      },
      kn: {
        title: "ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಣ ಕುಂಠಿತ ಮತ್ತು ಮೂತ್ರಪಿಂಡದ ಮೇಲೆ ಒತ್ತಡ",
        description: "ಐಬುಪ್ರೊಫೇನ್‌ನಂತಹ ನೋವು ನಿವಾರಕಗಳು ಟೆಲ್ಮಿಸಾರ್ಟನ್‌ನ ಬಿಪಿ ನಿಯಂತ್ರಿಸುವ ಶಕ್ತಿಯನ್ನು ಕಡಿಮೆ ಮಾಡಿ ಮೂತ್ರಪಿಂಡಕ್ಕೆ ಹಾನಿ ಮಾಡಬಹುದು.",
        actionRecommendation: "ನೋವು ಅಥವಾ ಜ್ವರಕ್ಕೆ ಐಬುಪ್ರೊಫೇನ್ ಬದಲಿಗೆ ಪ್ಯಾರಸಿಟಮಲ್ ಬಳಸಿ."
      }
    }
  },
  {
    drug1: "Ibuprofen",
    drug2: "Aspirin",
    severity: "warning",
    title: "Cardioprotection Interference",
    description: "Ibuprofen competes with aspirin for binding sites on platelet cyclooxygenase-1, reducing aspirin's antiplatelet protective effect.",
    actionRecommendation: "Take immediate-release aspirin at least 30 minutes before or 8 hours after ibuprofen.",
    translations: {
      hi: {
        title: "हृदय सुरक्षा में रुकावट",
        description: "आइबुप्रोफेन एस्पिरिन के प्लेटलेट सुरक्षात्मक प्रभाव को बाधित करता है, जिससे दिल का दौरा रोकने की क्षमता घट सकती है।",
        actionRecommendation: "एस्पिरिन को आइबुप्रोफेन लेने से 30 मिनट पहले या 8 घंटे बाद लें।"
      },
      hinglish: {
        title: "Heart Protection me Rukawat",
        description: "Ibuprofen Aspirin ke heart-protective antiplatelet effect ko kam kar deta hai.",
        actionRecommendation: "Aspirin ko Ibuprofen lene se 30 minutes pehle ya 8 hours baad lein."
      },
      bn: {
        title: "হৃদযন্ত্র সুরক্ষায় বাধা",
        description: "আইবুপ্রোফেন অ্যাসপিরিনের হার্ট-সুরক্ষাকারী প্রভাব নষ্ট করে, ফলে রক্ত জমাট বাঁধার ঝুঁকি তৈরি হতে পারে।",
        actionRecommendation: "অ্যাসপিরিন আইবুপ্রোফেন খাওয়ার ৩০ মিনিট আগে অথবা ৮ ঘণ্টা পরে গ্রহণ করুন।"
      },
      mr: {
        title: "हृदय संरक्षणात अडथळा",
        description: "इबुप्रोफेन एस्पिरिनच्या हृदय संरक्षण क्षमतेला कमजोर करते.",
        actionRecommendation: "एस्पिरिन इबुप्रोफेन घेण्यापूर्वी ३० मिनिटे किंवा ८ तासांनंतर घ्या."
      },
      te: {
        title: "గుండె రక్షణ ప్రభావంలో అంతరాయం",
        description: "ఐబుప్రోఫెన్ ఆస్పిరిన్ అందించే గుండె రక్షణ యాంటీప్లేట్‌లెట్ ప్రభావాన్ని తగ్గిస్తుంది.",
        actionRecommendation: "ఐబుప్రోఫెన్ తీసుకోవడానికి 30 నిమిషాల ముందు లేదా 8 గంటల తర్వాత ఆస్పిరిన్ తీసుకోండి."
      },
      ta: {
        title: "இதயப் பாதுகாப்பில் குறுக்கீடு",
        description: "இப்யூபுரூஃபன் ஆஸ்பிரினின் இதய பாதுகாப்பு விளைவைக் குறைக்கிறது.",
        actionRecommendation: "ஆஸ்பிரினை இப்யூபுரூஃபெனுக்கு 30 நிமிடங்களுக்கு முன் அல்லது 8 மணி நேரத்திற்குப் பின் எடுத்துக் கொள்ளுங்கள்."
      },
      gu: {
        title: "હૃદય સુરક્ષામાં અવરોધ",
        description: "આઇબુપ્રૂફેન એસ્પિરિનની હૃદય રક્ષણાત્મક અસરને ઘટાડે છે.",
        actionRecommendation: "એસ્પિરિન આઇબુપ્રૂફેન લેવાના 30 મિનિટ પહેલાં અથવા 8 કલાક પછી લો."
      },
      pa: {
        title: "ਦਿਲ ਦੀ ਸੁਰੱਖਿਆ ਵਿੱਚ ਰੁਕਾਵਟ",
        description: "ਆਈਬੂਪ੍ਰੋਫੇਨ ਐਸਪਰੀਨ ਦੇ ਦਿਲ ਦੀ ਸੁਰੱਖਿਆ ਕਰਨ ਵਾਲੇ ਪ੍ਰਭਾਵ ਨੂੰ ਘਟਾਉਂਦੀ ਹੈ।",
        actionRecommendation: "ਐਸਪਰੀਨ ਨੂੰ ਆਈਬੂਪ੍ਰੋਫੇਨ ਲੈਣ ਤੋਂ 30 ਮਿੰਟ ਪਹਿਲਾਂ ਜਾਂ 8 ਘੰਟੇ ਬਾਅਦ ਲਓ।"
      },
      kn: {
        title: "ಹೃದಯ ರಕ್ಷಣೆಯಲ್ಲಿ ಅಡಚಣೆ",
        description: "ಐಬುಪ್ರೊಫೇನ್ ಆಸ್ಪಿರಿನ್‌ನ ಹೃದಯ ರಕ್ಷಣಾತ್ಮಕ ಪರಿಣಾಮವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
        actionRecommendation: "ಆಸ್ಪಿರಿನ್ ಅನ್ನು ಐಬುಪ್ರೊಫೇನ್ ತೆಗೆದುಕೊಳ್ಳುವ 30 ನಿಮಿಷಗಳ ಮೊದಲು ಅಥವಾ 8 ಗಂಟೆಗಳ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಿ."
      }
    }
  },
  {
    drug1: "Metformin",
    drug2: "Contrast Dye",
    severity: "warning",
    title: "Risk of Lactic Acidosis",
    description: "Intravenous iodinated contrast agents used in CT scans can cause acute kidney injury, which may lead to toxic Metformin buildup.",
    actionRecommendation: "Withhold Metformin 48 hours before and after contrast-enhanced imaging studies as advised by your doctor.",
    translations: {
      hi: {
        title: "लैक्टिक एसिडोसिस का गंभीर जोखिम",
        description: "सीटी स्कैन में प्रयुक्त डाई किडनी की कार्यक्षमता को अस्थायी रूप से प्रभावित कर सकती है, जिससे मेटफॉर्मिन का संचय हो सकता है।",
        actionRecommendation: "सीटी स्कैन कंट्रास्ट से 48 घंटे पहले और बाद में डॉक्टर के निर्देशानुसार मेटफॉर्मिन बंद रखें।"
      },
      hinglish: {
        title: "Lactic Acidosis ka Risk",
        description: "CT scan me use hone wali contrast dye kidney par asar daal sakti hai, jisse Metformin body me jama ho sakti hai.",
        actionRecommendation: "Doctor ki advice par CT scan se 48 hours pehle aur baad me Metformin band rakhein."
      },
      bn: {
        title: "ল্যাকটিক অ্যাসিডোসিসের ঝুঁকি",
        description: "সিটি স্ক্যানে ব্যবহৃত কনট্রাস্ট ডাই কিডনির ওপর চাপ ফেলে মেটফর্মিন জমার ঝুঁকি বাড়াতে পারে।",
        actionRecommendation: "চিকিৎসকের পরামর্শ অনুযায়ী সিটি স্ক্যানের ৪৮ ঘণ্টা আগে ও পরে মেটফর্মিন বন্ধ রাখুন।"
      },
      mr: {
        title: "लॅक्टिक ॲसिडोसिसचा धोका",
        description: "सीटी स्कॅनमध्ये वापरण्यात येणारे कॉन्ट्रास्ट डाय किडनीवर परिणाम करू शकते ज्यामुळे मेटफॉर्मिन साचू शकते.",
        actionRecommendation: "स्कॅनच्या ४८ तास आधी आणि नंतर डॉक्टरांच्या सल्ल्याने मेटफॉर्मिन बंद ठेवा."
      },
      te: {
        title: "లాక్టిక్ అసిడోసిస్ ప్రమాదం",
        description: "సీటీ స్కాన్లలో ఉపయోగించే డై కిడ్నీలపై ప్రభావం చూపి మెట్‌ఫార్మిన్ విషపూరితం కావడానికి కారణం కావచ్చు.",
        actionRecommendation: "స్కాన్ చేయడానికి 48 గంటల ముందు మరియు తరువాత మెట్‌ఫార్మిన్ తాత్కాలికంగా ఆపండి."
      },
      ta: {
        title: "லாக்டிக் அசிடோசிஸ் ஆபத்து",
        description: "சிடி ஸ்கேன்களில் பயன்படுத்தப்படும் சாயம் சிறுநீரகத்தை பாதித்து மெட்ஃபோர்மின் நச்சுத்தன்மையை ஏற்படுத்தலாம்.",
        actionRecommendation: "ஸ்கேனுக்கு 48 மணி நேரத்திற்கு முன்னும் பின்னும் மருத்துவ ஆலோசனையின்படி மெட்ஃபோர்மினை நிறுத்துங்கள்."
      },
      gu: {
        title: "લેક્ટિક એસિડોસિસનું જોખમ",
        description: "સીટી સ્કેનમાં વપરાતો ડાઈ કિડની પર અસર કરી શકે છે, જેથી મેટફોર્મિનનું સ્તર વધી શકે છે.",
        actionRecommendation: "ડૉક્ટરની સલાહ મુજબ સ્કેનના 48 કલાક પહેલાં અને પછી મેટફોર્મિન બંધ રાખો."
      },
      pa: {
        title: "ਲੈਕਟਿਕ ਐਸਿਡੋਸਿਸ ਦਾ ਖ਼ਤਰਾ",
        description: "ਸੀਟੀ ਸਕੈਨ ਵਿੱਚ ਵਰਤੀ ਜਾਣ ਵਾਲੀ ਡਾਈ ਗੁਰਦਿਆਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਮੈਟਫਾਰਮਿਨ ਇਕੱਠੀ ਹੋ ਸਕਦੀ ਹੈ।",
        actionRecommendation: "ਸਕੈਨ ਤੋਂ 48 ਘੰਟੇ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਨਾਲ ਮੈਟਫਾਰਮਿਨ ਬੰਦ ਰੱਖੋ।"
      },
      kn: {
        title: "ಲ್ಯಾಕ್ಟಿಕ್ ಆಸಿಡೋಸಿಸ್ ಅಪಾಯ",
        description: "ಸಿಟಿ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಬಳಸುವ ಕಾಂಟ್ರಾಸ್ಟ್ ಡೈ ಮೂತ್ರಪಿಂಡದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿ ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಹೆಚ್ಚಳಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು.",
        actionRecommendation: "ಸ್ಕ್ಯಾನ್‌ಗೆ 48 ಗಂಟೆಗಳ ಮೊದಲು ಮತ್ತು ನಂತರ ವೈದ್ಯರ ಸಲಹೆಯಂತೆ ಮೆಟ್‌ಫಾರ್ಮಿನ್ ನಿಲ್ಲಿಸಿ."
      }
    }
  },
  {
    drug1: "Levothyroxine",
    drug2: "Calcium Carbonate",
    severity: "caution",
    title: "Reduced Thyroid Absorption",
    description: "Calcium supplements bind to thyroid hormone in the gut, substantially lowering Levothyroxine absorption into the bloodstream.",
    actionRecommendation: "Separate doses by at least 4 hours (take Levothyroxine empty stomach early morning, calcium at midday).",
    translations: {
      hi: {
        title: "थायराइड दवा के अवशोषण में कमी",
        description: "कैल्शियम सप्लीमेंट पेट में थायराइड हार्मोन से जुड़ जाते हैं, जिससे लेवोथायरोक्सिन का रक्त में अवशोषण बहुत कम हो जाता है।",
        actionRecommendation: "दोनों दवाओं में कम से कम 4 घंटे का अंतर रखें (थायराइड दवा सुबह खाली पेट, कैल्शियम दोपहर में)।"
      },
      hinglish: {
        title: "Thyroid Medicine ka Absorption kam hona",
        description: "Calcium supplements pet me Levothyroxine ke sath bind ho jate hain jisse thyroid medicine ka absorption kam ho jata hai.",
        actionRecommendation: "Dono doses me kam se kam 4 hours ka gap rakhein (Thyroid subah khali pet, Calcium dopahar me)."
      },
      bn: {
        title: "থাইরয়েড ওষুধের শোষণ হ্রাস",
        description: "ক্যালসিয়াম পেট ও অন্ত্রে থাইরয়েড হরমোনের শোষণ কমিয়ে দেয়, ফলে ওষুধের কার্যকারিতা হ্রাস পায়।",
        actionRecommendation: "দুই ওষুধের মাঝে কমপক্ষে ৪ ঘণ্টার ব্যবধান রাখুন (সকালে খালি পেটে থাইরয়েড, দুপুরে ক্যালসিয়াম)।"
      },
      mr: {
        title: "थायरॉईड औषधाचे शोषण कमी होणे",
        description: "कॅल्शियम सप्लिमेंट्स थायरॉईड संप्रेरकाचे शोषण कमी करतात, ज्यामुळे लेव्होथायरॉक्सिनचा प्रभाव कमी होतो.",
        actionRecommendation: "दोन्ही औषधांमध्ये किमान ४ तासांचे अंतर ठेवा (सकाळी उपाशीपोटी थायरॉईड, दुपारी कॅल्शियम)."
      },
      te: {
        title: "థైరాయిడ్ ఔషధ శోషణ తగ్గింపు",
        description: "కాల్షియం సప్లిమెంట్లు లెవోథైరాక్సిన్ రక్తంలోకి చేరే శాతాన్ని గణనీಯంగా తగ్గిస్తాయి.",
        actionRecommendation: "రెండు డోసుల మధ్య కనీసం 4 గంటల వ్యవధి ఉంచండి (ఉదయం ఖాళీ కడుపుతో థైరాయిడ్, మధ్యాహ్నం కాల్షియం)."
      },
      ta: {
        title: "தைராய்டு மருந்து உறிஞ்சுதல் குறைவு",
        description: "கால்சியம் தைராய்டு ஹார்மோனுடன் இணைந்து லெவோதைராக்ஸின் உறிஞ்சுதலைக் கணிசமாகக் குறைக்கிறது.",
        actionRecommendation: "குறைந்தது 4 மணி நேர இடைவெளியில் எடுத்துக்கொள்ளுங்கள் (காலையில் தைராய்டு, மதியம் கால்சியம்)."
      },
      gu: {
        title: "થાઇરોઇડ દવાનું શોષણ ઓછું થવું",
        description: "કેલ્શિયમ સપ્લિમેન્ટ્સ લેવોથાઇરોક્સિનના રક્તમાં શોષણને ઘણું ઘટાડી દે છે.",
        actionRecommendation: "બંને વચ્ચે ઓછામાં ઓછા 4 કલાકનું અંતર રાખો (સવારે ભૂખ્યા પેટે થાઇરોઇડ, બપોરે કેલ્શિયમ)."
      },
      pa: {
        title: "ਥਾਇਰਾਇਡ ਦਵਾਈ ਦਾ ਸਮਾਈ ਘੱਟਣਾ",
        description: "ਕੈਲਸ਼ੀਅਮ ਸਪਲੀਮੈਂਟਸ ਲੈਵੋਥਾਈਰੋਕਸਿਨ ਦੇ ਖੂਨ ਵਿੱਚ ਸੋਖਣ ਨੂੰ ਕਾਫ਼ੀ ਘਟਾ ਦਿੰਦੇ ਹਨ।",
        actionRecommendation: "ਦੋਵਾਂ ਖੁਰਾਕਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ 4 ਘੰਟੇ ਦਾ ਫ਼ਰਕ ਰੱਖੋ (ਸਵੇਰੇ ਖ਼ਾਲੀ ਪੇਟ ਥਾਇਰਾਇਡ, ਦੁਪਹਿਰੇ ਕੈਲਸ਼ੀਅਮ)।"
      },
      kn: {
        title: "ಥೈರಾಯ್ಡ್ ಔಷಧಿಯ ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಕಡಿತ",
        description: "ಕ್ಯಾಲ್ಸಿಯಂ ಪೂರಕಗಳು ಲೆವೊಥೈರಾಕ್ಸಿನ್ ರಕ್ತದಲ್ಲಿ ಹೀರಿಕೊಳ್ಳುವುದನ್ನು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆ ಮಾಡುತ್ತವೆ.",
        actionRecommendation: "ಕನಿಷ್ಠ 4 ಗಂಟೆಗಳ ಅಂತರವಿರಲಿ (ಬೆಳಿಗ್ಗೆ ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಥೈರಾಯ್ಡ್, ಮಧ್ಯಾಹ್ನ ಕ್ಯಾಲ್ಸಿಯಂ ತೆಗೆದುಕೊಳ್ಳಿ)."
      }
    }
  },
  {
    drug1: "Rosuvastatin",
    drug2: "Gemfibrozil",
    severity: "critical",
    title: "Severe Muscle Breakdown (Rhabdomyolysis)",
    description: "Gemfibrozil significantly increases blood levels of Rosuvastatin, elevating the risk of severe muscle pain and kidney injury.",
    actionRecommendation: "Avoid co-administration. Alternatives like Fenofibrate with lower interaction potential may be considered by a doctor.",
    translations: {
      hi: {
        title: "मांसपेशियों के टूटने (रैब्डोमायोलिसिस) का खतरा",
        description: "जेमफिब्रोजिल रोसुवास्टेटिन के स्तर को काफी बढ़ा देता है, जिससे मांसपेशियों में तेज दर्द और किडनी की गंभीर क्षति हो सकती है।",
        actionRecommendation: "इन दोनों को साथ न लें। डॉक्टर से फेनोफाइब्रेट जैसे सुरक्षित विकल्प पर विचार करने का परामर्श लें।"
      },
      hinglish: {
        title: "Muscle Damage (Rhabdomyolysis) ka Critical Danger",
        description: "Gemfibrozil Rosuvastatin ke level ko badha deta hai, jisse muscles me tez dard aur kidney failure ka risk rehta hai.",
        actionRecommendation: "Dono saath me lene se bachein. Doctor se Fenofibrate jaisa safer option discuss karein."
      },
      bn: {
        title: "পেশির মারাত্মক ক্ষতি (র‌্যাবডোমায়োলাইসিস)",
        description: "জেমফিব্রোজিল রোসুভাস্ট্যাটিনের রক্তে মাত্রা বাড়িয়ে দেয়, ফলে তীব্র পেশির ব্যথা এবং কিডনি নষ্ট হওয়ার ঝুঁকি তৈরি হয়।",
        actionRecommendation: "একসাথে খাওয়া সম্পূর্ণ এড়িয়ে চলুন। ডাক্তারের পরামর্শে নিরাপদ বিকল্প যেমন ফেনোফাইব্রেট বিবেচনা করুন।"
      },
      mr: {
        title: "स्नायूंचे गंभीर नुकसान (रॅब्डोमायोलायसिस)",
        description: "जेमफिब्रोजिल रोसुवास्टॅटिनचे प्रमाण वाढवते, ज्यामुळे स्नायूंमध्ये तीव्र वेदना आणि मूत्रपिंड निकामी होण्याचा धोका असतो.",
        actionRecommendation: "दोन्ही औषधे एकत्र घेणे टाळा. डॉक्टरांच्या सल्ल्याने फेनोफायब्रेटसारखा सुरक्षित पर्याय वापरा."
      },
      te: {
        title: "తీవ్రమైన కండరాల విచ్ఛిన్నం (రాబ్డోమయోలిసిస్)",
        description: "జెమ్‌ఫైబ్రోజిల్ రోసువాస్టాటిన్ స్థాయిలను గణనీయంగా పెంచుతుంది, ఇది కండరాల నొప్పి మరియు కిడ్నీ వైఫల్యానికి దారితీయవచ్చు.",
        actionRecommendation: "వీటిని కలిపి తీసుకోవద్దు. డాక్టర్ సలహాతో ఫెనోఫైబ్రేట్ వంటి సురక్షిత ప్రత్యామ్నాయాన్ని ఎంచుకోండి."
      },
      ta: {
        title: "கடுமையான தசை முறிவு (ராப்டோமையோலிசிஸ்)",
        description: "ஜெம்ஃபிப்ரோசில் ரோசுவாஸ்டேடின் அளவை அதிகரித்து கடுமையான தசை வலி மற்றும் சிறுநீரக பாதிப்பை ஏற்படுத்தலாம்.",
        actionRecommendation: "ஒன்றாக உட்கொள்வதைத் தவிர்க்கவும். ஃபெனோஃபிப்ரேட் போன்ற பாதுகாப்பான மாற்று மருந்துகளை மருத்துவரிடம் கேளுங்கள்."
      },
      gu: {
        title: "સ્નાયુઓનું ગંભીર નુકસાન (રેબ્ડોમાયોલિસિસ)",
        description: "જેમફિબ્રોઝિલ રોસુવાસ્ટેટિનનું સ્તર વધારે છે, જેનાથી સ્નાયુઓમાં તીવ્ર દુખાવો અને કિડનીને નુકસાન થઈ શકે છે.",
        actionRecommendation: "સાથે લેવાનું ટાળો. ડૉક્ટરની સલાહ મુજબ ફેનોફાઇબ્રેટ જેવો સુરક્ષિત વિકલ્પ વાપરો."
      },
      pa: {
        title: "ਮਾਸਪੇਸ਼ੀਆਂ ਦਾ ਗੰਭੀਰ ਨੁਕਸਾਨ (ਰੈਬਡੋਮਾਇਓਲਿਸਿਸ)",
        description: "ਜੈਮਫਾਈਬਰੋਜ਼ਿਲ ਰੋਸੂਵਾਸਟੈਟਿਨ ਦੇ ਪੱਧਰ ਨੂੰ ਵਧਾਉਂਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਅਤੇ ਗੁਰਦੇ ਖਰਾਬ ਹੋ ਸਕਦੇ ਹਨ।",
        actionRecommendation: "ਇਨ੍ਹਾਂ ਨੂੰ ਇਕੱਠੇ ਨਾ ਲਓ। ਡਾਕਟਰ ਤੋਂ ਫੈਨੋਫਾਈਬ੍ਰੇਟ ਵਰਗਾ ਸੁਰੱਖਿਅਤ ਬਦਲ ਲਓ।"
      },
      kn: {
        title: "ತೀವ್ರ ಸ್ನಾಯು ಹಾನಿ (ರ್ಯಾಬ್ಡೋಮೈಯೋಲೈಸಿಸ್)",
        description: "ಜೆಮ್‌ಫೈಬ್ರೊಜಿಲ್ ರೋಸುವಾಸ್ಟಾಟಿನ್ ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ, ಇದರಿಂದ ಸ್ನಾಯು ನೋವು ಮತ್ತು ಮೂತ್ರಪಿಂಡ ವೈಫಲ್ಯ ಉಂಟಾಗಬಹುದು.",
        actionRecommendation: "ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ. ವೈದ್ಯರ ಸಲಹೆಯಂತೆ ಫೆನೋಫೈಬ್ರೇಟ್‌ನಂತಹ ಸುರಕ್ಷಿತ ಪರ್ಯಾಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ."
      }
    }
  },
  {
    drug1: "Telmisartan",
    drug2: "Potassium Supplements",
    severity: "caution",
    title: "Elevated Potassium (Hyperkalemia)",
    description: "Telmisartan increases potassium retention. Concurrent potassium supplements or salt substitutes can push blood potassium to unsafe cardiac levels.",
    actionRecommendation: "Periodic serum potassium monitoring is advised; avoid high-potassium salt substitutes without doctor consent.",
    translations: {
      hi: {
        title: "पोटेशियम का अत्यधिक स्तर (हाइपरकेलेमिया)",
        description: "टेल्मीसार्टन शरीर में पोटेशियम रोकता है। अतिरिक्त पोटेशियम सप्लीमेंट लेने से हृदय गति में खतरनाक असंतुलन हो सकता है।",
        actionRecommendation: "नियमित सीरम पोटेशियम जांच कराएं और बिना डॉक्टर की अनुमति के लो-सोडियम पोटाशियम नमक न लें।"
      },
      hinglish: {
        title: "High Potassium (Hyperkalemia) ka Risk",
        description: "Telmisartan body me potassium retain karta hai. Saath me potassium supplement lene se heart beat me dangerous gadbad ho sakti hai.",
        actionRecommendation: "Serum potassium check karwate rahein aur doctor ke bina potassium salt substitute na lein."
      },
      bn: {
        title: "উচ্চ পটাশিয়াম মাত্রা (হাইপারক্যালেমিয়া)",
        description: "টেলমিসার্টান পটাশিয়াম ধরে রাখে। অতিরিক্ত পটাশিয়াম সম্পূরক গ্রহণ হৃদস্পন্দনে বিপজ্জনক ঝুঁকি তৈরি করতে পারে।",
        actionRecommendation: "নিয়মিত রক্তে পটাশিয়াম মাত্রা পরীক্ষা করান; ডাক্তারের অনুমতি ছাড়া পটাশিয়ামযুক্ত লবণ বিকল্প এড়িয়ে চলুন।"
      },
      mr: {
        title: "पोटॅशियमचे प्रमाण वाढणे (हायपरकलेमिया)",
        description: "टेल्मिसार्टन पोटॅशियम टिकवून ठेवते. अतिरिक्त पोटॅशियम सप्लिमेंट घेतल्याने हृदयाच्या ठोक्यांवर धोकादायक परिणाम होऊ शकतो.",
        actionRecommendation: "नियमित पोटॅशियम तपासणी करा आणि डॉक्टरांच्या सल्ल्याशिवाय पोटॅशियमयुक्त मीठ वापरू नका."
      },
      te: {
        title: "పొటాషియం స్థాయిలు అధికం (హైపర్‌కలేమియా)",
        description: "టెల్మిసార్టాన్ పొటాషియంను నిలుపుకుంటుంది. అదనపు సప్లిమెంట్లు గుండె లయలో ప్రమాదకర మార్పులకు దారితీయవచ్చు.",
        actionRecommendation: "రక్తంలో పొటాషియం స్థాయిలను క్రమంగా పరీక్షించండి; వైద్యుడి అనుమతి లేకుండా పొటాషియం ఉప్పు ప్రత్యామ్నాయాలు వాడవద్దు."
      },
      ta: {
        title: "அதிக பொட்டாசியம் அளவு (ஹைபர்கலேமியா)",
        description: "டெல்மிசார்டன் பொட்டாசியத்தைத் தக்கவைக்கிறது. கூடுதல் பொட்டாசியம் உட்கொள்வது இதயத் துடிப்பில் ஆபத்தான மாற்றங்களை ஏற்படுத்தலாம்.",
        actionRecommendation: "இரத்த பொட்டாசியம் அளவை பரிசோதிக்கவும்; மருத்துவர் அனுமதியின்றி பொட்டாசியம் உப்பு மாற்றுக்களைத் தவிர்க்கவும்."
      },
      gu: {
        title: "પોટેશિયમનું ઊંચું સ્તર (હાઇપરકેલેમિયા)",
        description: "ટેલ્મિસારટન પોટેશિયમ જાળવી રાખે છે. વધારાનું પોટેશિયમ લેવાથી હૃદયના ધબકારા અનિયમિત થઈ શકે છે.",
        actionRecommendation: "નિયમિત પોટેશિયમ ચેક કરાવો અને ડૉક્ટરની મંજૂરી વિના પોટેશિયમ યુક્ત મીઠાના વિકલ્પ ન વાપરો."
      },
      pa: {
        title: "ਪੋਟਾਸ਼ੀਅਮ ਦਾ ਵੱਧ ਪੱਧਰ (ਹਾਈਪਰਕੇਲੇਮੀਆ)",
        description: "ਟੈਲਮੀਸਾਰਟਨ ਪੋਟਾਸ਼ੀਅਮ ਨੂੰ ਰੋਕਦੀ ਹੈ। ਵਾਧੂ ਪੋਟਾਸ਼ੀਅਮ ਲੈਣ ਨਾਲ ਦਿਲ ਦੀ ਧੜਕਣ 'ਤੇ ਖ਼ਤਰਨਾਕ ਅਸਰ ਪੈ ਸਕਦਾ ਹੈ।",
        actionRecommendation: "ਨਿਯਮਿਤ ਸੀਰਮ ਪੋਟਾਸ਼ੀਅਮ ਦੀ ਜਾਂਚ ਕਰਵਾਓ ਅਤੇ ਡਾਕਟਰ ਦੀ ਇਜਾਜ਼ਤ ਤੋਂ ਬਿਨਾਂ ਪੋਟਾਸ਼ੀਅਮ ਲੂਣ ਨਾ ਲਓ।"
      },
      kn: {
        title: "ಹೆಚ್ಚಿದ ಪೊಟ್ಯಾಸಿಯಮ್ ಮಟ್ಟ (ಹೈಪರ್‌ಕಲೇಮಿಯಾ)",
        description: "ಟೆಲ್ಮಿಸಾರ್ಟನ್ ಪೊಟ್ಯಾಸಿಯಮ್ ಅನ್ನು ಉಳಿಸಿಕೊಳ್ಳುತ್ತದೆ. ಹೆಚ್ಚುವರಿ ಸಪ್ಲಿಮೆಂಟ್ ತೆಗೆದುಕೊಳ್ಳುವುದರಿಂದ ಹೃದಯ ಬಡಿತದಲ್ಲಿ ಅಪಾಯಕಾರಿ ಏರಿಳಿತವಾಗಬಹುದು.",
        actionRecommendation: "ನಿಯಮಿತವಾಗಿ ಪೊಟ್ಯಾಸಿಯಮ್ ತಪಾಸಣೆ ಮಾಡಿಸಿ; ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ಪೊಟ್ಯಾಸಿಯಮ್ ಉಪ್ಪಿನ ಪರ್ಯಾಯಗಳನ್ನು ತಪ್ಪಿಸಿ."
      }
    }
  }
];

export function getLocalizedInteraction(item, lang = "en") {
  if (!item) return null;
  if (!lang || lang === "en") return item;
  const loc = item.translations?.[lang];
  if (!loc) return item;
  return {
    ...item,
    title: loc.title || item.title,
    description: loc.description || item.description,
    actionRecommendation: loc.actionRecommendation || item.actionRecommendation
  };
}

export function checkPairInteraction(medName1, medName2, lang = "en") {
  const norm1 = (medName1 || "").toLowerCase().trim();
  const norm2 = (medName2 || "").toLowerCase().trim();

  for (const item of knownInteractions) {
    const d1 = item.drug1.toLowerCase();
    const d2 = item.drug2.toLowerCase();

    if ((norm1.includes(d1) && norm2.includes(d2)) || (norm1.includes(d2) && norm2.includes(d1))) {
      return getLocalizedInteraction(item, lang);
    }
  }
  return null;
}

export function analyzeMedicationList(medList = [], lang = "en") {
  const alerts = [];
  for (let i = 0; i < medList.length; i++) {
    for (let j = i + 1; j < medList.length; j++) {
      const medA = medList[i]?.name || medList[i] || "";
      const medB = medList[j]?.name || medList[j] || "";
      const match = checkPairInteraction(medA, medB, lang);
      if (match) {
        alerts.push({
          medA,
          medB,
          ...match
        });
      }
    }
  }
  return alerts;
}
