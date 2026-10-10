// Patient-friendly mock hospital discharge summaries for PulseAI

export const mockDischargeSummaries = [
  {
    id: "disch_1",
    patientId: "pat_1",
    patientName: "Aarish Rajput",
    title: "Acute Gastroenteritis & Dehydration Recovery",
    hospital: "Max Super Speciality Hospital, Saket",
    department: "Internal Medicine & Critical Care",
    admissionDate: "October 01, 2026",
    dischargeDate: "October 04, 2026",
    lengthOfStay: "3 Days",
    doctor: "Dr. Arvind Mehta, MD",
    doctorPhone: "+91 11 2692 5858",
    emergencyHelpline: "1066 / +91 11 4055 4055",
    dischargeStatus: "Stable & Discharged Home",
    statusBadge: "good",
    
    // Simple Explanation
    simpleDiagnosis: "Stomach Infection with Fluid Loss",
    originalMedicalDiagnosis: "Acute Infectious Gastroenteritis with Moderate Dehydration & Hypokalemia (Resolved)",
    simpleSummary: "Aarish was admitted with acute vomiting, stomach cramps, and weakness. He was administered IV rehydration fluids, electrolyte correction, and targeted antibiotics. After 72 hours, his vitals, appetite, and electrolytes fully normalized, and he was approved for safe home discharge.",
    
    // What to do at home
    homeCare: {
      diet: {
        titleEn: "Diet & Nutrition Guidelines",
        titleHi: "खान-पान और आहार सलाह",
        allowedEn: ["Moong dal khichdi & soft rice", "Fresh homemade curd / buttermilk", "Electrolyte fluids (ORS) in small sips", "Boiled vegetables & bananas"],
        allowedHi: ["मूंग दाल खिचड़ी और नरम चावल", "ताजा दही और छाछ", "ओआरएस (ORS) का घोल धीरे-धीरे पिएं", "उबली सब्जियां और केला"],
        avoidEn: ["Deep fried, oily snacks & fast food", "Spicy curries & chili sauces", "Unpasteurized milk or outside sweets", "Caffeine, soda & cold aerated drinks"],
        avoidHi: ["तले-भुने और ऑयली स्नैक्स", "तीखा व मसालेदार खाना", "बाहर की मिठाइयां और खुला खाना", "चाय, कॉफी और कोल्ड ड्रिंक्स"]
      },
      activity: {
        titleEn: "Rest & Physical Activity",
        titleHi: "आराम और शारीरिक गतिविधि",
        instructionsEn: [
          "Complete bed rest for the next 24 to 48 hours.",
          "Short 5-minute indoor walks around the room are encouraged to maintain circulation.",
          "Strictly avoid heavy weight lifting (> 5 kg) or gym workouts for 7 days.",
          "Ensure 8 hours of uninterrupted sleep every night."
        ],
        instructionsHi: [
          "अगले 24 से 48 घंटे तक पूरा आराम करें।",
          "कमरे में 5 मिनट की हल्की चहलकदमी कर सकते हैं।",
          "7 दिनों तक कोई भी भारी वजन (> 5 किग्रा) न उठाएं और जिम से बचें।",
          "रोजाना रात को कम से कम 8 घंटे की अच्छी नींद लें।"
        ]
      },
      hydration: {
        dailyGoalEn: "2.5 to 3.0 Liters of fluids daily (Water + ORS + Coconut water)",
        dailyGoalHi: "प्रतिदिन 2.5 से 3 लीटर तरल पदार्थ (पानी + ओआरएस + नारियल पानी)",
        noteEn: "Drink in small sips every 30 minutes rather than gulping full glasses at once.",
        noteHi: "एक बार में पूरा गिलास पीने के बजाय हर 30 मिनट में घूंट-घूंट करके पिएं।"
      }
    },

    // Post-Discharge Medications
    dischargeMedications: [
      {
        id: "dm_1",
        name: "Cefixime 200 mg",
        dosage: "1 Tablet",
        frequency: "Twice daily (Morning & Night)",
        timing: "After Food",
        duration: "5 Days (Complete full course)",
        purposeEn: "Antibiotic to clear remaining bacterial infection in the gut.",
        purposeHi: "पेट के बैक्टीरिया और इन्फेक्शन को पूरी तरह खत्म करने के लिए।"
      },
      {
        id: "dm_2",
        name: "Pantoprazole 40 mg",
        dosage: "1 Tablet",
        frequency: "Once daily (Morning)",
        timing: "30 Mins Before Breakfast",
        duration: "7 Days",
        purposeEn: "Prevents stomach acid buildup and protects stomach lining.",
        purposeHi: "पेट में गैस और एसिडिटी रोकने के लिए खाली पेट।"
      },
      {
        id: "dm_3",
        name: "Probiotic Sachet (Bacillus Clausii)",
        dosage: "1 Mini-bottle / Sachet",
        frequency: "Twice daily",
        timing: "With Water after meals",
        duration: "5 Days",
        purposeEn: "Restores healthy gut bacteria and digestive strength.",
        purposeHi: "पाचन शक्ति सुधारने और अच्छे बैक्टीरिया वापस बनाने के लिए।"
      },
      {
        id: "dm_4",
        name: "Paracetamol 650 mg",
        dosage: "1 Tablet (SOS)",
        frequency: "Only if fever > 100°F or body ache",
        timing: "After Food",
        duration: "As needed (Max 3/day)",
        purposeEn: "Relieves mild fever or body aches if needed.",
        purposeHi: "बुखार या शरीर दर्द होने पर ही लें।"
      }
    ],

    // Safety Red Flags
    warningSigns: [
      {
        signEn: "High fever exceeding 101°F with chills",
        signHi: "101°F से अधिक तेज बुखार या कंपकंपी",
        severity: "critical"
      },
      {
        signEn: "Severe stomach cramps or persistent vomiting for > 6 hours",
        signHi: "असहनीय पेट दर्द या 6 घंटे से ज्यादा लगातार उल्टी होना",
        severity: "critical"
      },
      {
        signEn: "Dizziness, faintness, or severe dry mouth (signs of severe dehydration)",
        signHi: "चक्कर आना, आंखों के आगे अंधेरा छाना या अत्यधिक कमजोरी",
        severity: "urgent"
      },
      {
        signEn: "Blood in stool or black colored stools",
        signHi: "मल में खून आना या काला मल होना",
        severity: "critical"
      }
    ],

    // Follow-up Appointment
    followUp: {
      doctorName: "Dr. Arvind Mehta",
      department: "Internal Medicine OPD",
      date: "October 10, 2026 (Saturday)",
      time: "10:30 AM",
      hospital: "Max Hospital, OPD Chamber 214, Tower A",
      prepChecklistEn: [
        "Bring this discharge paper summary",
        "Bring a record of daily temperature & fluid intake",
        "Note down any lingering weakness or symptoms"
      ],
      prepChecklistHi: [
        "यह डिस्चार्ज सारांश पत्र साथ लाएं",
        "अपने दैनिक तापमान और पानी पीने का रिकॉर्ड लाएं",
        "कोई भी बची हुई कमजोरी या लक्षण लिखकर लाएं"
      ]
    }
  },
  {
    id: "disch_2",
    patientId: "pat_2",
    patientName: "Rahul Sharma",
    title: "Diabetic Ketoacidosis & Hyperglycemic Recovery",
    hospital: "Apollo Hospital, New Delhi",
    department: "Endocrinology & Diabetology",
    admissionDate: "August 14, 2026",
    dischargeDate: "August 17, 2026",
    lengthOfStay: "4 Days",
    doctor: "Dr. Sunita Kapoor, MD (Endocrinologist)",
    doctorPhone: "+91 11 2692 7878",
    emergencyHelpline: "1066 / +91 11 2692 5000",
    dischargeStatus: "Stable & Controlled",
    statusBadge: "good",
    
    simpleDiagnosis: "Sudden High Blood Sugar & Dehydration (हाई ब्लड शुगर कंट्रोल)",
    originalMedicalDiagnosis: "Hyperosmolar Hyperglycemic State with Metabolic Derangement",
    simpleSummary: "Rahul experienced very high sugar levels (above 380 mg/dL) due to a missed medication schedule and dehydration. Hospitalized for intravenous insulin infusion and fluid rebalancing. Discharged on a streamlined oral medication routine with stable blood glucose (Fasting 124 mg/dL).",
    
    homeCare: {
      diet: {
        titleEn: "Diabetic Meal Guidelines",
        titleHi: "डायबिटीज अनुकूल भोजन सलाह",
        allowedEn: ["Whole grain rotis, oats, quinoa", "Green leafy vegetables & salads", "Sprouted moong & high-fiber lentils", "Water with lemon & cinnamon"],
        allowedHi: ["मल्टीग्रेन रोटी, ओट्स, दलिया", "हरी पत्तेदार सब्जियां और सलाद", "अंकुरित मूंग और दालें", "नींबू पानी व दालचीनी पानी"],
        avoidEn: ["White sugar, honey, jaggery & sweets", "White bread, maida & potatoes", "Sweet fruits (mango, grapes, chiku)", "Processed fruit juices & sweetened tea"],
        avoidHi: ["सफेद चीनी, गुड़, शहद और मिठाइयां", "मैदा, सफेद ब्रेड और आलू", "ज्यादा मीठे फल (आम, अंगूर, चीकू)", "पैकेट वाले जूस और मीठी चाय"]
      },
      activity: {
        titleEn: "Exercise & Blood Sugar Care",
        titleHi: "व्यायाम और शुगर मॉनिटरिंग",
        instructionsEn: [
          "Daily 30 minutes brisk walking in morning or after dinner.",
          "Check Fasting blood sugar every morning before breakfast.",
          "Carry 3 glucose tablets or a small candy in pocket in case of hypoglycemia."
        ],
        instructionsHi: [
          "रोजाना 30 मिनट सुबह या रात के खाने के बाद टहलें।",
          "हर सुबह नाश्ते से पहले फास्टिंग शुगर जरूर चेक करें।",
          "अचानक शुगर लो होने पर तुरंत 1 टॉफी या ग्लूकोज लें।"
        ]
      },
      hydration: {
        dailyGoalEn: "3.0 Liters of plain water daily",
        dailyGoalHi: "रोजाना कम से कम 3 लीटर सादा पानी पिएं",
        noteEn: "Good hydration helps kidneys flush excess circulating sugars naturally.",
        noteHi: "पर्याप्त पानी पीने से किडनी खून से अतिरिक्त शुगर आसानी से बाहर निकालती है।"
      }
    },

    dischargeMedications: [
      {
        id: "dm_21",
        name: "Metformin ER 1000 mg",
        dosage: "1 Tablet",
        frequency: "Twice daily (Morning & Dinner)",
        timing: "With Meals",
        duration: "Ongoing Daily Prescription",
        purposeEn: "Maintains optimal insulin sensitivity and keeps sugar level stable.",
        purposeHi: "शरीर में शुगर कंट्रोल रखने और इंसुलिन काम करने के लिए।"
      },
      {
        id: "dm_22",
        name: "Telmisartan 40 mg",
        dosage: "1 Tablet",
        frequency: "Once daily (Morning 8 AM)",
        timing: "After Breakfast",
        duration: "Ongoing",
        purposeEn: "Protects kidneys and stabilizes blood pressure.",
        purposeHi: "किडनी की सुरक्षा और ब्लड प्रेशर सामान्य रखने के लिए।"
      }
    ],

    warningSigns: [
      {
        signEn: "Blood sugar reading higher than 300 mg/dL twice in a row",
        signHi: "लगातार दो बार ब्लड शुगर 300 से ऊपर आना",
        severity: "critical"
      },
      {
        signEn: "Extreme thirst, frequent urination, and fruity-smelling breath",
        signHi: "अत्यधिक प्यास, बार-बार पेशाब और मुंह से असामान्य गंध",
        severity: "urgent"
      },
      {
        signEn: "Confusion, extreme tiredness, or shortness of breath",
        signHi: "घबराहट, अत्यधिक थकावट या सांस फूलना",
        severity: "critical"
      }
    ],

    followUp: {
      doctorName: "Dr. Sunita Kapoor",
      department: "Apollo Endocrine Clinic",
      date: "August 25, 2026 (Tuesday)",
      time: "11:00 AM",
      hospital: "Apollo Hospital OPD Chamber 108",
      prepChecklistEn: [
        "Bring 7-day fasting and post-meal sugar readings chart",
        "Bring this discharge summary sheet"
      ],
      prepChecklistHi: [
        "पिछले 7 दिनों का शुगर चार्ट साथ लाएं",
        "यह डिस्चार्ज सारांश पत्र साथ लाएं"
      ]
    }
  }
];
