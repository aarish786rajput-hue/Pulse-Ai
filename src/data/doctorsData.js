// Comprehensive Doctors and Specialist Directory Data for PulseAI

export const doctorSpecialties = [
  { 
    id: "all", 
    label: "All Specialists", 
    labelHi: "सभी विशेषज्ञ", 
    icon: "Stethoscope", 
    count: 12,
    labels: {
      en: "All Specialists",
      hi: "सभी विशेषज्ञ",
      hinglish: "Sabhi Specialists",
      bn: "সকল বিশেষজ্ঞ",
      mr: "सर्व तज्ज्ञ",
      te: "అన్ని స్పెషలిస్టులు",
      ta: "அனைத்து நிபுணர்கள்",
      gu: "તમામ નિષ્ણાતો",
      pa: "ਸਾਰੇ ਮਾਹਰ",
      kn: "ಎಲ್ಲಾ ತಜ್ಞರು"
    }
  },
  { 
    id: "dentist", 
    label: "Dentist", 
    labelHi: "दंत चिकित्सक", 
    icon: "Smile", 
    count: 2,
    labels: {
      en: "Dentist",
      hi: "दंत चिकित्सक",
      hinglish: "Dentist",
      bn: "দন্ত চিকিৎসক",
      mr: "दंतचिकित्सक",
      te: "దంత వైద్యుడు",
      ta: "பல் மருத்துவர்",
      gu: "દાંતના ડૉક્ટર",
      pa: "ਦੰਦਾਂ ਦਾ ਡਾਕਟਰ",
      kn: "ದಂತ ವೈದ್ಯರು"
    }
  },
  { 
    id: "dermatologist", 
    label: "Dermatologist", 
    labelHi: "त्वचा विशेषज्ञ", 
    icon: "Sparkles", 
    count: 1,
    labels: {
      en: "Dermatologist",
      hi: "त्वचा विशेषज्ञ",
      hinglish: "Skin Specialist",
      bn: "চর্মরোগ বিশেষজ্ঞ",
      mr: "त्वचारोगतज्ज्ञ",
      te: "చర్మ నిపుణుడు",
      ta: "தோல் மருத்துவர்",
      gu: "ચામડીના નિષ્ણાત",
      pa: "ਚਮੜੀ ਦਾ ਮਾਹਰ",
      kn: "ಚರ್ಮ ತಜ್ಞರು"
    }
  },
  { 
    id: "ophthalmologist", 
    label: "Ophthalmologist", 
    labelHi: "नेत्र विशेषज्ञ", 
    icon: "Eye", 
    count: 1,
    labels: {
      en: "Ophthalmologist",
      hi: "नेत्र विशेषज्ञ",
      hinglish: "Eye Specialist",
      bn: "চক্ষুরোগ বিশেষজ্ঞ",
      mr: "नेत्रतज्ज्ञ",
      te: "నేత్ర నిపుణుడు",
      ta: "கண் மருத்துவர்",
      gu: "આંખના નિષ્ણાત",
      pa: "ਅੱਖਾਂ ਦਾ ਮਾਹਰ",
      kn: "ಕಣ್ಣಿನ ತಜ್ಞರು"
    }
  },
  { 
    id: "cardiologist", 
    label: "Cardiologist", 
    labelHi: "हृदय रोग विशेषज्ञ", 
    icon: "HeartPulse", 
    count: 1,
    labels: {
      en: "Cardiologist",
      hi: "हृदय रोग विशेषज्ञ",
      hinglish: "Heart Specialist",
      bn: "হৃদরোগ বিশেষজ্ঞ",
      mr: "हृदयरोगतज्ज्ञ",
      te: "గుండె నిపుణుడు",
      ta: "இதய மருத்துவர்",
      gu: "હૃદય રોગના નિષ્ણાત",
      pa: "ਦਿਲ ਦਾ ਮਾਹਰ",
      kn: "ಹೃದಯ ತಜ್ಞರು"
    }
  },
  { 
    id: "physician", 
    label: "General Physician", 
    labelHi: "सामान्य चिकित्सक", 
    icon: "Activity", 
    count: 1,
    labels: {
      en: "General Physician",
      hi: "सामान्य चिकित्सक",
      hinglish: "General Physician",
      bn: "সাধারণ চিকিৎসক",
      mr: "जनरल फिजिशियन",
      te: "జనరల్ ఫిజీషియన్",
      ta: "பொது மருத்துவர்",
      gu: "સામાન્ય ચિકિત્સક",
      pa: "ਜਨਰਲ ਫਿਜ਼ੀਸ਼ੀਅਨ",
      kn: "ಸಾಮಾನ್ಯ ವೈದ್ಯರು"
    }
  },
  { 
    id: "pediatrician", 
    label: "Pediatrician", 
    labelHi: "बाल रोग विशेषज्ञ", 
    icon: "Baby", 
    count: 1,
    labels: {
      en: "Pediatrician",
      hi: "बाल रोग विशेषज्ञ",
      hinglish: "Child Specialist",
      bn: "শিশু বিশেষজ্ঞ",
      mr: "बालरोगतज्ज्ञ",
      te: "పిల్లల వైద్యుడు",
      ta: "குழந்தை மருத்துவர்",
      gu: "બાળ રોગ નિષ્ણાત",
      pa: "ਬੱਚਿਆਂ ਦਾ ਡਾਕਟਰ",
      kn: "ಮಕ್ಕಳ ತಜ್ಞರು"
    }
  },
  { 
    id: "orthopedic", 
    label: "Orthopedic", 
    labelHi: "हड्डी रोग विशेषज्ञ", 
    icon: "Bone", 
    count: 1,
    labels: {
      en: "Orthopedic",
      hi: "हड्डी रोग विशेषज्ञ",
      hinglish: "Bone Specialist",
      bn: "অস্থিরোগ বিশেষজ্ঞ",
      mr: "अस्थिरोगतज्ज्ञ",
      te: "ఆర్థోపెడిక్ నిపుణుడు",
      ta: "எலும்பு மருத்துவர்",
      gu: "હાડકાના નિષ્ણાત",
      pa: "ਹੱਡੀਆਂ ਦਾ ਮਾਹਰ",
      kn: "ಮೂಳೆ ತಜ್ಞರು"
    }
  },
  { 
    id: "ent", 
    label: "ENT Specialist", 
    labelHi: "कान-नाक-गला विशेषज्ञ", 
    icon: "Ear", 
    count: 1,
    labels: {
      en: "ENT Specialist",
      hi: "कान-नाक-गला विशेषज्ञ",
      hinglish: "ENT Specialist",
      bn: "নাক-কান-গলা বিশেষজ্ঞ",
      mr: "कान-नाक-घसा तज्ज्ञ",
      te: "ఈఎన్‌టీ నిపుణుడు",
      ta: "காது-மூக்கு-தொண்டை மருத்துவர்",
      gu: "કાન-નાક-ગળાના નિષ્ણાત",
      pa: "ਕੰਨ-ਨੱਕ-ਗਲੇ ਦਾ ਮਾਹਰ",
      kn: "ಕಿವಿ-ಮೂಗು-ಗಂಟಲು ತಜ್ಞರು"
    }
  },
  { 
    id: "gynecologist", 
    label: "Gynecologist", 
    labelHi: "स्त्री रोग विशेषज्ञ", 
    icon: "UserCheck", 
    count: 1,
    labels: {
      en: "Gynecologist",
      hi: "स्त्री रोग विशेषज्ञ",
      hinglish: "Lady Specialist",
      bn: "স্ত্রীরোগ বিশেষজ্ঞ",
      mr: "स्त्रीरोगतज्ज्ञ",
      te: "గైనకాలజిస్ట్",
      ta: "மகப்பேறு மருத்துவர்",
      gu: "સ્ત્રીરોગ નિષ્ણાત",
      pa: "ਗਾਇਨੀਕੋਲੋਜਿਸਟ",
      kn: "ಸ್ತ್ರೀರೋಗ ತಜ್ಞರು"
    }
  },
  { 
    id: "neurologist", 
    label: "Neurologist", 
    labelHi: "न्यूरोलॉजिस्ट", 
    icon: "Brain", 
    count: 1,
    labels: {
      en: "Neurologist",
      hi: "न्यूरोलॉजिस्ट",
      hinglish: "Brain Specialist",
      bn: "স্নায়ুরোগ বিশেষজ্ঞ",
      mr: "मज्जारोगतज्ज्ञ",
      te: "న్యూరాలజిస్ట్",
      ta: "நரம்பியல் மருத்துவர்",
      gu: "ચેતાતંત્ર નિષ્ણાત",
      pa: "ਨਿਊਰੋਲੋਜਿਸਟ",
      kn: "ನರರೋಗ ತಜ್ಞರು"
    }
  },
  { 
    id: "psychiatrist", 
    label: "Psychiatrist", 
    labelHi: "मनोचिकित्सक", 
    icon: "HeartHandshake", 
    count: 1,
    labels: {
      en: "Psychiatrist",
      hi: "मनोचिकित्सक",
      hinglish: "Mind Specialist",
      bn: "মনোরোগ বিশেষজ্ঞ",
      mr: "मानसोपचारतज्ज्ञ",
      te: "సైకియాట్రిస్ట్",
      ta: "மனநல மருத்துவர்",
      gu: "મનોચિકિત્સક",
      pa: "ਦਿਮਾਗੀ ਡਾਕਟਰ",
      kn: "ಮನೋವೈದ್ಯರು"
    }
  }
];

export function getSpecialtyLabel(spec, lang = "en") {
  if (!spec) return "";
  if (spec.labels && spec.labels[lang]) return spec.labels[lang];
  if (lang === "hi") return spec.labelHi || spec.label;
  return spec.label;
}

export const mockDoctors = [
  {
    id: "doc-1",
    name: "Dr. Aarav Mehta",
    nameHi: "डॉ. आरव मेहता",
    specialtyId: "dentist",
    specialty: "Dentist & Implantologist",
    specialtyHi: "दंत चिकित्सक व इम्प्लांट विशेषज्ञ",
    qualifications: "BDS, MDS - Oral & Maxillofacial Implantology",
    experience: 14,
    rating: 4.9,
    reviewsCount: 384,
    clinic: "SmileCraft Dental & Implant Care",
    clinicHi: "स्माइलक्राफ्ट डेंटल व इम्प्लांट केयर",
    hospital: "Apollo Dental Network",
    location: "Indiranagar, Bengaluru",
    locationHi: "इंदिरानगर, बेंगलुरु",
    address: "742, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
    distance: "1.4 km away",
    contactNumber: "+91 98201 44520",
    whatsappNumber: "919820144520",
    email: "dr.mehta@smilecraft.health",
    fee: 600,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 04:30 PM",
    registrationNo: "KDC/2010/8841 (Karnataka Dental Council)",
    languages: ["English", "Hindi", "Kannada"],
    about: "Dr. Aarav Mehta is a renowned dental surgeon with over 14 years of clinical excellence in painless root canal treatments, immediate dental implants, digital smile designing, and comprehensive oral rehabilitation. Committed to gentle and anxiety-free dentistry.",
    aboutHi: "डॉ. आरव मेहता 14 वर्षों के अनुभव के साथ जाने-माने दंत शल्य चिकित्सक हैं। वे दर्द-रहित रूट कैनाल, डेंटल इम्प्लांट्स, डिजिटल स्माइल डिजाइन और संपूर्ण दंत सुरक्षा में विशेषज्ञता रखते हैं।",
    services: [
      "Painless Root Canal Treatment (RCT)",
      "Titanium Dental Implants",
      "Teeth Whitening & Veneers",
      "Wisdom Tooth Surgical Extraction",
      "Invisible Teeth Aligners"
    ],
    servicesHi: [
      "दर्द-रहित रूट कैनाल ट्रीटमेंट (RCT)",
      "टाइटेनियम डेंटल इम्प्लांट्स",
      "टीथ वाइटनिंग व वीनियर्स",
      "विजडम टूथ सर्जरी",
      "अदृश्य टीथ अलाइनर्स"
    ],
    education: [
      "MDS in Implantology - Manipal College of Dental Sciences (2014)",
      "BDS - Government Dental College, Bengaluru (2010)"
    ],
    timings: "Mon - Sat: 10:00 AM - 08:00 PM | Sun: 10:00 AM - 01:00 PM",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Rahul S.", rating: 5, date: "2 days ago", comment: "Completely painless RCT! Dr. Mehta explained every step clearly and made me feel relaxed." },
      { name: "Deepa Nair", rating: 5, date: "1 week ago", comment: "Modern clinic with top notch hygiene. My dental implant was seamless." }
    ]
  },
  {
    id: "doc-2",
    name: "Dr. Sunita Kulkarni",
    nameHi: "डॉ. सुनीता कुलकर्णी",
    specialtyId: "dermatologist",
    specialty: "Dermatologist & Cosmetologist",
    specialtyHi: "त्वचा व सौंदर्य विशेषज्ञ",
    qualifications: "MBBS, MD - Dermatology, Venereology & Leprosy",
    experience: 16,
    rating: 4.95,
    reviewsCount: 512,
    clinic: "DermaGlow Skin & Laser Institute",
    clinicHi: "डर्माग्लो स्किन व लेजर इंस्टीट्यूट",
    hospital: "Apollo Spectra Hospitals",
    location: "Bandra West, Mumbai",
    locationHi: "बांद्रा वेस्ट, मुंबई",
    address: "204, Linking Road, Near National College, Bandra West, Mumbai - 400050",
    distance: "2.8 km away",
    contactNumber: "+91 98114 77290",
    whatsappNumber: "919811477290",
    email: "dr.kulkarni@dermaglow.org",
    fee: 800,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 05:45 PM",
    registrationNo: "MMC/2008/04218 (Maharashtra Medical Council)",
    languages: ["English", "Hindi", "Marathi"],
    about: "Dr. Sunita Kulkarni is a Gold Medalist dermatologist with 16+ years of expertise handling stubborn acne, psoriasis, eczema, alopecia hair fall, and advanced fractional laser resurfacing. She believes in treating skin issues from root dietary and hormonal causes.",
    aboutHi: "डॉ. सुनीता कुलकर्णी 16+ वर्षों के अनुभव वाली स्वर्ण पदक विजेता त्वचा रोग विशेषज्ञ हैं। वे मुँहासे, सोरायसिस, एक्जिमा, बाल झड़ने और आधुनिक लेजर उपचार में कुशल हैं।",
    services: [
      "Severe Acne & Scar Laser Revision",
      "Eczema & Psoriasis Systemic Care",
      "PRP & Exosome Hair Loss Therapy",
      "Pigmentation & Melasma Peels",
      "Allergy Skin Patch Testing"
    ],
    servicesHi: [
      "गंभीर मुँहासे व लेजर स्कार रिपेयर",
      "सोरायसिस व एक्जिमा उपचार",
      "पीआरपी हेयर फॉल थेरेपी",
      "मेलास्मा व स्किन पिग्मेंटेशन",
      "एलर्जी स्किन पैच टेस्टिंग"
    ],
    education: [
      "MD (Dermatology) - KEM Hospital & Seth GS Medical College, Mumbai",
      "MBBS - Grant Government Medical College & Sir JJ Hospital"
    ],
    timings: "Mon - Sat: 11:00 AM - 07:30 PM",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Pooja Verma", rating: 5, date: "3 days ago", comment: "My chronic cystic acne resolved within 2 months under Dr. Sunita's personalized plan." },
      { name: "Aditya Jain", rating: 5, date: "2 weeks ago", comment: "Very ethical doctor. Does not recommend unnecessary expensive cosmetic treatments." }
    ]
  },
  {
    id: "doc-3",
    name: "Dr. Rajesh Singhania",
    nameHi: "डॉ. राजेश सिंघानिया",
    specialtyId: "ophthalmologist",
    specialty: "Ophthalmologist & Eye Surgeon",
    specialtyHi: "नेत्र रोग विशेषज्ञ व आई सर्जन",
    qualifications: "MBBS, MS - Ophthalmology, FICO (UK), Retina Fellow",
    experience: 19,
    rating: 4.9,
    reviewsCount: 420,
    clinic: "NetraJyoti Advanced Eye Hospital",
    clinicHi: "नेत्रज्योति एडवांस्ड आई हॉस्पिटल",
    hospital: "Max Super Speciality Hospital",
    location: "Connaught Place, New Delhi",
    locationHi: "कनॉट प्लेस, नई दिल्ली",
    address: "B-42, Inner Circle, Connaught Place, New Delhi - 110001",
    distance: "3.2 km away",
    contactNumber: "+91 98103 22910",
    whatsappNumber: "919810322910",
    email: "dr.singhania@netrajyoti.in",
    fee: 700,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 06:15 PM",
    registrationNo: "DMC/1997/11902 (Delhi Medical Council)",
    languages: ["English", "Hindi", "Punjabi"],
    about: "Dr. Rajesh Singhania is an internationally trained ophthalmic surgeon with over 19 years of dedicated practice. Specialist in blade-free robotic cataract surgery, diabetic retinopathy management, glaucoma laser therapy, and computer vision syndrome.",
    aboutHi: "डॉ. राजेश सिंघानिया 19 वर्षों से अधिक अनुभव वाले वरिष्ठ नेत्र शल्य चिकित्सक हैं। वे रोबोटिक मोतियाबिंद सर्जरी, रेटिना रोग, ग्लूकोमा और विज़न केयर में निपुण हैं।",
    services: [
      "Robotic Micro-Incision Cataract Surgery (MICS)",
      "Diabetic Retinopathy & Macular Degeneration",
      "Glaucoma Early Detection & Laser Iridotomy",
      "LASIK & SMILE Refractive Correction",
      "Pediatric Squint & Vision Triage"
    ],
    servicesHi: [
      "माइक्रो-इंसीजन मोतियाबिंद सर्जरी",
      "डायबिटिक रेटिनोपैथी व रेटिना जांच",
      "ग्लूकोमा (काला मोतिया) लेजर थेरेपी",
      "लेसिक व नजर चश्मा हटाने की सर्जरी",
      "बच्चों के भेंगेपन की जांच"
    ],
    education: [
      "Fellowship in Vitreo-Retinal Surgery - LV Prasad Eye Institute",
      "MS (Ophthalmology) - Maulana Azad Medical College (MAMC), Delhi",
      "MBBS - University College of Medical Sciences (UCMS)"
    ],
    timings: "Mon - Sat: 09:30 AM - 06:30 PM",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Harpreet Singh", rating: 5, date: "Yesterday", comment: "My mother got both eyes operated for cataract by Dr. Singhania. 20/20 vision restored!" },
      { name: "Kunal Ghosh", rating: 5, date: "3 weeks ago", comment: "Detailed retina OCT checkup. Very reassuring and thorough doctor." }
    ]
  },
  {
    id: "doc-4",
    name: "Dr. Devendra Reddy",
    nameHi: "डॉ. देवेन्द्र रेड्डी",
    specialtyId: "cardiologist",
    specialty: "Interventional Cardiologist",
    specialtyHi: "हृदय रोग व कार्डियोलॉजी विशेषज्ञ",
    qualifications: "MBBS, MD (Medicine), DM (Cardiology), FACC (USA)",
    experience: 22,
    rating: 4.96,
    reviewsCount: 640,
    clinic: "Apex Heart & Vascular Centre",
    clinicHi: "एपेक्स हार्ट व वैस्कुलर सेंटर",
    hospital: "Fortis Escorts Heart Institute",
    location: "Koramangala, Bengaluru",
    locationHi: "कोरमंगला, बेंगलुरु",
    address: "512, 80 Feet Road, 4th Block, Koramangala, Bengaluru - 560034",
    distance: "2.1 km away",
    contactNumber: "+91 98450 33918",
    whatsappNumber: "919845033918",
    email: "dr.reddy@apexheart.care",
    fee: 1000,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: false,
    nextSlot: "Tomorrow, 10:30 AM",
    registrationNo: "KMC/1998/05190 (Karnataka Medical Council)",
    languages: ["English", "Hindi", "Telugu", "Kannada"],
    about: "Dr. Devendra Reddy is a leading cardiologist with 22 years of experience performing over 7,000 coronary angioplasties. Expert in preventative cardiology, hypertension management, heart failure therapy, lipid disorders, and complex valve disease.",
    aboutHi: "डॉ. देवेन्द्र रेड्डी 22 वर्षों के अनुभव वाले प्रख्यात हृदय रोग विशेषज्ञ हैं जिन्होंने 7,000 से अधिक सफल एंजियोप्लास्टी की हैं। वे बीपी, हार्ट फेलियर व कोलेस्ट्रॉल नियंत्रण में माहिर हैं।",
    services: [
      "Coronary Angiography & Drug-Eluting Stents",
      "Hypertension & Resistant Blood Pressure Protocol",
      "Echocardiography (2D & 3D Strain Echo)",
      "Heart Failure & Pacemaker Management",
      "Lipid & Cholesterol Optimization"
    ],
    servicesHi: [
      "कोरोनरी एंजियोग्राफी व स्टेंटिंग",
      "हाई बीपी व ब्लड प्रेशर नियंत्रण",
      "2D व 3D इकोकार्डियोग्राफी जांच",
      "हार्ट फेलियर व पेसमेकर देखभाल",
      "कोलेस्ट्रॉल व ट्राइग्लिसराइड प्रबंधन"
    ],
    education: [
      "DM (Cardiology) - Sri Jayadeva Institute of Cardiovascular Sciences, Bengaluru",
      "MD (General Medicine) - Osmania Medical College, Hyderabad",
      "MBBS - Bangalore Medical College and Research Institute"
    ],
    timings: "Mon - Fri: 10:00 AM - 05:00 PM | Sat: 10:00 AM - 02:00 PM",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Suresh Rao", rating: 5, date: "4 days ago", comment: "Dr. Reddy detected my artery blockage in time and guided me through lifestyle and meds without rush." },
      { name: "Anand M.", rating: 5, date: "1 month ago", comment: "The gold standard of cardiologists in South India. Highly humble and knowledgeable." }
    ]
  },
  {
    id: "doc-5",
    name: "Dr. Neha Malhotra",
    nameHi: "डॉ. नेहा मल्होत्रा",
    specialtyId: "physician",
    specialty: "General Physician & Diabetologist",
    specialtyHi: "सामान्य चिकित्सक व मधुमेह विशेषज्ञ",
    qualifications: "MBBS, MD - Internal Medicine, PG Diabetology (Boston)",
    experience: 12,
    rating: 4.88,
    reviewsCount: 395,
    clinic: "CityCare Family Clinic (Ayushman Empanelled)",
    clinicHi: "सिटीकेयर फैमिली क्लीनिक (आयुष्मान संबद्ध)",
    hospital: "Max Healthcare & Ayushman Arogya Mandir",
    location: "South Extension, New Delhi",
    locationHi: "साउथ एक्सटेंशन, नई दिल्ली",
    address: "F-14, Part 1, South Extension, New Delhi - 110049",
    distance: "1.1 km away",
    contactNumber: "+91 98118 66421",
    whatsappNumber: "919811866421",
    email: "dr.malhotra@citycare.org",
    fee: 0,
    isFreeOpd: true,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 03:00 PM",
    registrationNo: "DMC/2012/19442 (Delhi Medical Council)",
    languages: ["English", "Hindi", "Punjabi"],
    about: "Dr. Neha Malhotra provides comprehensive holistic primary healthcare for entire families. Empanelled under Ayushman Bharat Digital Mission (ABDM), offering free consultations for eligible citizens. Specialist in Type-2 Diabetes reversal, thyroid disorders, and acute fevers.",
    aboutHi: "डॉ. नेहा मल्होत्रा 12 वर्षों के अनुभव के साथ संपूर्ण पारिवारिक स्वास्थ्य सेवाएं प्रदान करती हैं। आयुष्मान भारत (ABDM) संबद्ध होने से निःशुल्क ओपीडी परामर्श उपलब्ध कराती हैं।",
    services: [
      "Type-2 Diabetes Holistic Management & Reversal",
      "Seasonal Viral Fever, Dengue & Typhoid Care",
      "Thyroid Disorder & Metabolic Syndrome Care",
      "Adult Vaccinations & Preventive Wellness",
      "Ayushman Bharat ABHA Health Sync"
    ],
    servicesHi: [
      "टाइप-2 शुगर व डायबिटीज़ नियंत्रण",
      "मौसमी बुखार, डेंगू, मलेरिया व टाइफाइड इलाज",
      "थायरॉइड व मेटाबॉलिक विकार",
      "वयस्क टीकाकरण व स्वास्थ्य जांच",
      "आयुष्मान आभा डिजिटल सिंक"
    ],
    education: [
      "PG Diploma in Diabetology - Boston University School of Medicine (2018)",
      "MD (Internal Medicine) - Lady Hardinge Medical College, Delhi (2014)",
      "MBBS - Maulana Azad Medical College (MAMC)"
    ],
    timings: "Mon - Sat: 09:00 AM - 02:00 PM & 05:00 PM - 08:30 PM",
    avatar: "https://images.unsplash.com/photo-1594824813572-c23d46332152?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Manish Gupta", rating: 5, date: "3 days ago", comment: "Free Ayushman checkup was done with so much warmth and care. Prescribed generic affordable medicines." },
      { name: "Seema Tiwari", rating: 5, date: "2 weeks ago", comment: "My HbA1c dropped from 8.8% to 6.4% in 4 months following her diet and medication protocol." }
    ]
  },
  {
    id: "doc-6",
    name: "Dr. Anand Pillai",
    nameHi: "डॉ. आनंद पिल्लई",
    specialtyId: "pediatrician",
    specialty: "Senior Pediatrician & Neonatologist",
    specialtyHi: "वरिष्ठ बाल रोग व शिशु विशेषज्ञ",
    qualifications: "MBBS, MD - Pediatrics, DNB, FIAP (Pediatrics)",
    experience: 15,
    rating: 4.92,
    reviewsCount: 460,
    clinic: "TinyCare Child Health & Vaccination Clinic",
    clinicHi: "टाइनीकेयर चाइल्ड हेल्थ व टीकाकरण क्लीनिक",
    hospital: "Rainbow Children's Hospital",
    location: "Anna Nagar, Chennai",
    locationHi: "अन्ना नगर, चेन्नई",
    address: "Block AE, 2nd Avenue, Anna Nagar, Chennai - 600040",
    distance: "3.7 km away",
    contactNumber: "+91 98402 11928",
    whatsappNumber: "919840211928",
    email: "dr.pillai@tinycare.org",
    fee: 550,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 05:00 PM",
    registrationNo: "TNMC/2009/4812 (Tamil Nadu Medical Council)",
    languages: ["English", "Hindi", "Tamil", "Malayalam"],
    about: "Dr. Anand Pillai is a trusted pediatrician known for his child-friendly bedside manner. Expertise in newborn developmental milestones, painless immunization schedules, childhood asthma, allergy management, and nutritional counseling for fussy eaters.",
    aboutHi: "डॉ. आनंद पिल्लई बच्चों के पसंदीदा व अनुभवी बाल रोग विशेषज्ञ हैं। वे नवजात शिशु स्वास्थ्य, पेनलेस टीकाकरण, बाल अस्थमा, और पोषण संबंधी सलाह में विशेषज्ञ हैं।",
    services: [
      "Newborn Wellness & Growth Milestone Check",
      "Comprehensive Painless Vaccination Schedule",
      "Childhood Asthma & Wheezing Management",
      "Pediatric Allergy & Food Sensitivity",
      "Nutritional Guidance & Weight Optimization"
    ],
    servicesHi: [
      "नवजात शिशु स्वास्थ्य व विकास जांच",
      "पेनलेस टीकाकरण चार्ट व वैक्सीन",
      "बाल अस्थमा व सांस की तकलीफ",
      "एलर्जी व फूड सेंसिटिविटी जांच",
      "शिशु पोषण व वजन वृद्धि परामर्श"
    ],
    education: [
      "DNB (Pediatrics) - National Board of Examinations",
      "MD (Pediatrics) - Madras Medical College, Chennai",
      "MBBS - Stanley Medical College, Chennai"
    ],
    timings: "Mon - Sat: 10:30 AM - 01:30 PM & 05:00 PM - 08:30 PM",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Kavitha R.", rating: 5, date: "5 days ago", comment: "My 3-year-old usually cries at clinics, but Dr. Pillai made him laugh and gave painless vaccination." },
      { name: "Ramesh Iyer", rating: 5, date: "3 weeks ago", comment: "Excellent diagnosis for recurrent chest congestion in our child." }
    ]
  },
  {
    id: "doc-7",
    name: "Dr. Vikramaditya Joshi",
    nameHi: "डॉ. विक्रमादित्य जोशी",
    specialtyId: "orthopedic",
    specialty: "Orthopedic & Joint Replacement Surgeon",
    specialtyHi: "हड्डी रोग व जोड़ प्रत्यारोपण सर्जन",
    qualifications: "MBBS, MS (Ortho), DNB, Fellowship in Joint Arthroplasty (Germany)",
    experience: 18,
    rating: 4.89,
    reviewsCount: 370,
    clinic: "Bone & Joint Care Centre",
    clinicHi: "बोन एंड जॉइंट केयर सेंटर",
    hospital: "Manipal Hospital",
    location: "Whitefield, Bengaluru",
    locationHi: "व्हाइटफील्ड, बेंगलुरु",
    address: "ITPL Main Rd, Near Hope Farm Junction, Whitefield, Bengaluru - 560066",
    distance: "4.5 km away",
    contactNumber: "+91 98455 88201",
    whatsappNumber: "919845588201",
    email: "dr.joshi@bonejoint.health",
    fee: 900,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 04:00 PM",
    registrationNo: "KMC/2004/18210 (Karnataka Medical Council)",
    languages: ["English", "Hindi", "Kannada", "Marathi"],
    about: "Dr. Vikramaditya Joshi is a senior joint replacement surgeon with German fellowship training. Specialist in computer-navigated robotic knee & hip replacements, arthroscopic sports ligament repairs, slip disc treatment, and arthritis preservation therapy.",
    aboutHi: "डॉ. विक्रमादित्य जोशी जर्मनी से प्रशिक्षित वरिष्ठ जोड़ प्रत्यारोपण विशेषज्ञ हैं। वे रोबोटिक घुटना व कूल्हा रिप्लेसमेंट, लिगामेंट सर्जरी व स्लिप डिस्क में दक्ष हैं।",
    services: [
      "Robotic Total Knee & Hip Replacement",
      "Arthroscopic ACL / Meniscus Ligament Repair",
      "Sciatica & Lumbar Slip Disc Spine Protocol",
      "Osteoarthritis Joint Injections (Hyaluronic / PRP)",
      "Fracture Trauma & Minimally Invasive Plating"
    ],
    servicesHi: [
      "रोबोटिक घुटना व कूल्हा रिप्लेसमेंट",
      "लिगामेंट (ACL/Meniscus) सर्जरी",
      "साइटिका व कमर दर्द / स्लिप डिस्क इलाज",
      "गठिया (आर्थराइटिस) जॉइंट इंजेक्शन",
      "फ्रैक्चर व हड्डी जोड़ शल्य चिकित्सा"
    ],
    education: [
      "Fellowship in Adult Reconstruction & Arthroplasty - Asklepios Clinic, Germany",
      "MS (Orthopedics) - KEM Hospital, Mumbai",
      "MBBS - Bangalore Medical College"
    ],
    timings: "Mon - Sat: 11:00 AM - 07:00 PM",
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Vinod Chandran", rating: 5, date: "1 week ago", comment: "My knee surgery went smoothly. I was walking without support within 3 weeks!" },
      { name: "Sunil Hegde", rating: 5, date: "1 month ago", comment: "Saved me from unnecessary surgery. His conservative physiotherapy plan cured my frozen shoulder." }
    ]
  },
  {
    id: "doc-8",
    name: "Dr. Shalini Deshmukh",
    nameHi: "डॉ. शालिनी देशमुख",
    specialtyId: "ent",
    specialty: "ENT & Micro-Ear Surgeon",
    specialtyHi: "कान, नाक व गला (ENT) विशेषज्ञ",
    qualifications: "MBBS, MS - ENT, Fellowship in Endoscopic Sinus Surgery",
    experience: 13,
    rating: 4.86,
    reviewsCount: 310,
    clinic: "Swar & Shwas Advanced ENT Clinic",
    clinicHi: "स्वर व श्वास एडवांस्ड ईएनटी क्लीनिक",
    hospital: "Sahyadri Super Speciality Hospital",
    location: "Shivaji Nagar, Pune",
    locationHi: "शिवाजी नगर, पुणे",
    address: "1104, Fergusson College Rd, Shivaji Nagar, Pune - 411005",
    distance: "2.5 km away",
    contactNumber: "+91 98220 54192",
    whatsappNumber: "919822054192",
    email: "dr.shalini@swarent.in",
    fee: 650,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 06:00 PM",
    registrationNo: "MMC/2011/09420 (Maharashtra Medical Council)",
    languages: ["English", "Hindi", "Marathi"],
    about: "Dr. Shalini Deshmukh is an adept ENT surgeon focusing on endoscopic sinus surgery (FESS), hearing loss diagnosis, tinnitus, vertigo assessment, deviated nasal septum (DNS) repair, and voice cord disorders.",
    aboutHi: "डॉ. शालिनी देशमुख 13 वर्षों के अनुभव वाली कान, नाक व गला विशेषज्ञ हैं। वे साइनोसाइटिस, हियरिंग लॉस, टिनिटस, चक्कर (वर्टिगो) और खर्राटों के इलाज में दक्ष हैं।",
    services: [
      "Endoscopic Sinus Surgery (FESS) for Sinusitis",
      "Hearing Evaluation & Audiometry Testing",
      "Vertigo (BPPV) & Inner Ear Tinnitus Triage",
      "Septoplasty for Deviated Nasal Septum",
      "Coblation Tonsillectomy & Adenoid Care"
    ],
    servicesHi: [
      "साइनस एंडोस्कोपिक सर्जरी (FESS)",
      "कान की सुनने की क्षमता व ऑडियोमेट्री",
      "चक्कर आना (वर्टिगो) व कान बजना (टिनिटस)",
      "नाक की टेढ़ी हड्डी (DNS) सेप्टोप्लास्टी",
      "टॉन्सिल व एडेनॉइड उपचार"
    ],
    education: [
      "Fellowship in Advanced Rhinology - Christian Medical College (CMC), Vellore",
      "MS (ENT) - BJ Government Medical College, Pune",
      "MBBS - Government Medical College, Nagpur"
    ],
    timings: "Mon - Sat: 10:00 AM - 01:30 PM & 04:30 PM - 07:30 PM",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Nitin Shinde", rating: 5, date: "4 days ago", comment: "Cured my 5-year-old chronic sinusitis with minimal medication. Very accurate diagnosis." },
      { name: "Pooja B.", rating: 5, date: "2 weeks ago", comment: "Her Epley maneuver cured my severe vertigo in a single sitting!" }
    ]
  },
  {
    id: "doc-9",
    name: "Dr. Priya Nambiar",
    nameHi: "डॉ. प्रिया नंबियार",
    specialtyId: "gynecologist",
    specialty: "Gynecologist & Obstetrician",
    specialtyHi: "स्त्री रोग व प्रसूति विशेषज्ञ",
    qualifications: "MBBS, MS - Obstetrics & Gynaecology, FMAS (Laparoscopy)",
    experience: 17,
    rating: 4.94,
    reviewsCount: 520,
    clinic: "Matritva Women Health Centre",
    clinicHi: "मातृत्व वूमेन हेल्थ सेंटर",
    hospital: "Cloudnine Hospital & Motherhood Hospital",
    location: "Jayanagar, Bengaluru",
    locationHi: "जयनगर, बेंगलुरु",
    address: "32, 11th Main, 4th Block, Jayanagar, Bengaluru - 560011",
    distance: "1.9 km away",
    contactNumber: "+91 98451 99201",
    whatsappNumber: "919845199201",
    email: "dr.priya@matritva.care",
    fee: 800,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 03:30 PM",
    registrationNo: "KMC/2006/07192 (Karnataka Medical Council)",
    languages: ["English", "Hindi", "Malayalam", "Kannada"],
    about: "Dr. Priya Nambiar is an empathetic women's health specialist with 17+ years of experience in high-risk pregnancy care, PCOS / PCOD lifestyle correction, adolescent health, laparoscopic fibroid removal, and menopausal wellness.",
    aboutHi: "डॉ. प्रिया नंबियार 17 वर्षों के अनुभव वाली प्रसूति व स्त्री रोग विशेषज्ञ हैं। वे हाई-रिस्क प्रेग्नेंसी, पीसीओएस (PCOS), लेप्रोस्कोपिक सर्जरी और महिलाओं के स्वास्थ्य में निपुण हैं।",
    services: [
      "High-Risk Pregnancy & Antenatal Care",
      "PCOS / PCOD Hormonal & Lifestyle Reversal",
      "Minimally Invasive Laparoscopic Myomectomy",
      "Infertility Workup & Ovulation Monitoring",
      "Cervical Cancer Screening (Pap Smear & HPV)"
    ],
    servicesHi: [
      "गर्भावस्था व प्रसव पूर्व व्यापक देखभाल",
      "पीसीओएस (PCOS) व हार्मोन संतुलन",
      "लेप्रोस्कोपिक फाइब्रॉइड व सिस्ट सर्जरी",
      "निःसंतानता जांच व ओव्यूलेशन ट्रैकिंग",
      "पैप स्मीयर व गर्भाशय कैंसर स्क्रीनिंग"
    ],
    education: [
      "Fellowship in Minimal Access Surgery (FMAS) - World Laparoscopy Hospital",
      "MS (OBGYN) - St. John's Medical College, Bengaluru",
      "MBBS - Calicut Medical College, Kerala"
    ],
    timings: "Mon - Sat: 09:30 AM - 01:00 PM & 04:30 PM - 07:30 PM",
    avatar: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Ananya Krishnan", rating: 5, date: "3 days ago", comment: "Guided me through my entire pregnancy with utmost patience and positive energy. Had a smooth normal delivery." },
      { name: "Swati M.", rating: 5, date: "1 month ago", comment: "Best doctor for PCOS treatment. Her tailored diet and exercise guidance changed everything." }
    ]
  },
  {
    id: "doc-10",
    name: "Dr. Tariq Siddiqui",
    nameHi: "डॉ. तारिक सिद्दीकी",
    specialtyId: "neurologist",
    specialty: "Senior Neurologist & Stroke Specialist",
    specialtyHi: "वरिष्ठ न्यूरोलॉजिस्ट व स्ट्रोक विशेषज्ञ",
    qualifications: "MBBS, MD (Medicine), DM (Neurology), FINR (Zurich)",
    experience: 20,
    rating: 4.91,
    reviewsCount: 440,
    clinic: "NeuroAxis Brain & Spine Clinic",
    clinicHi: "न्यूरोएक्सिस ब्रेन व स्पाइन क्लीनिक",
    hospital: "Sir Ganga Ram Hospital & Max Healthcare",
    location: "Karol Bagh, New Delhi",
    locationHi: "करोल बाग, नई दिल्ली",
    address: "Plot 18, Pusa Road, Opp. Metro Pillar 98, Karol Bagh, New Delhi - 110005",
    distance: "3.5 km away",
    contactNumber: "+91 98101 77312",
    whatsappNumber: "919810177312",
    email: "dr.tariq@neuroaxis.org",
    fee: 1200,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: false,
    nextSlot: "Tomorrow, 11:30 AM",
    registrationNo: "DMC/2003/08912 (Delhi Medical Council)",
    languages: ["English", "Hindi", "Urdu"],
    about: "Dr. Tariq Siddiqui is a seasoned neurologist with international training at University Hospital of Zurich. Expert in acute stroke management, chronic refractory migraines, epilepsy seizure protocols, Parkinson's disease, and peripheral neuropathy.",
    aboutHi: "डॉ. तारिक सिद्दीकी 20 वर्षों के अनुभव वाले वरिष्ठ न्यूरोलॉजिस्ट हैं। वे माइग्रेन, मिर्गी (एपिलेप्सी), स्ट्रोक, पार्किंसंस और नसों की कमजोरी के विशेषज्ञ हैं।",
    services: [
      "Chronic Migraine & Cluster Headache Management",
      "Epilepsy & Seizure Disorder Long-Term Care",
      "Post-Stroke Neuro-Rehabilitation Protocols",
      "Parkinson's Disease & Tremor Movement Disorders",
      "EMG / NCV Nerve Conduction Diagnostics"
    ],
    servicesHi: [
      "गंभीर माइग्रेन व सिरदर्द इलाज",
      "मिर्गी (दौरे) व न्यूरोलॉजिकल केयर",
      "स्ट्रोक के बाद न्यूरो-रिकवरी प्रोग्राम",
      "पार्किंसंस व हाथ कांपने की समस्या",
      "नसों की ईएमजी (EMG/NCV) जांच"
    ],
    education: [
      "Fellowship in Interventional Neuroradiology - University Hospital Zurich, Switzerland",
      "DM (Neurology) - All India Institute of Medical Sciences (AIIMS), New Delhi",
      "MD (Medicine) - King George's Medical University (KGMU), Lucknow"
    ],
    timings: "Mon - Fri: 11:00 AM - 06:00 PM | Sat: 11:00 AM - 03:00 PM",
    avatar: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Rashid Khan", rating: 5, date: "6 days ago", comment: "My debilitating migraines have practically disappeared under Dr. Tariq's treatment." },
      { name: "Preeti Sahni", rating: 5, date: "3 weeks ago", comment: "Remarkable diagnostic precision. He identified my mother's early Parkinson signs immediately." }
    ]
  },
  {
    id: "doc-11",
    name: "Dr. Ritu Bannerjee",
    nameHi: "डॉ. रितु बनर्जी",
    specialtyId: "psychiatrist",
    specialty: "Psychiatrist & Mental Wellness Lead",
    specialtyHi: "मनोचिकित्सक व मानसिक स्वास्थ्य विशेषज्ञ",
    qualifications: "MBBS, MD - Psychiatry, DPM, Member IPS",
    experience: 11,
    rating: 4.88,
    reviewsCount: 290,
    clinic: "MindSpace Neuro-Psychiatric Clinic",
    clinicHi: "माइंडस्पेस मानसिक स्वास्थ्य क्लीनिक",
    hospital: "AMRI Hospitals & Apollo Gleneagles",
    location: "Salt Lake, Sector 2, Kolkata",
    locationHi: "सॉल्ट लेक, सेक्टर 2, कोलकाता",
    address: "BE-102, Near City Centre 1, Salt Lake, Kolkata - 700064",
    distance: "3.9 km away",
    contactNumber: "+91 98300 44109",
    whatsappNumber: "919830044109",
    email: "dr.ritu@mindspace.care",
    fee: 900,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 06:30 PM",
    registrationNo: "WBMC/2013/11492 (West Bengal Medical Council)",
    languages: ["English", "Hindi", "Bengali"],
    about: "Dr. Ritu Bannerjee offers a compassionate, judgment-free space for mental well-being. Specialist in anxiety disorders, clinical depression, adult ADHD, insomnia / sleep disorders, stress burnout, and cognitive behavioral therapy coordination.",
    aboutHi: "डॉ. रितु बनर्जी 11 वर्षों के अनुभव के साथ डिप्रेशन, चिंता (एंग्जायटी), नींद न आना (अनिद्रा), पैनिक अटैक और स्ट्रेस के प्रभावी और गोपनीय उपचार में विशेषज्ञ हैं।",
    services: [
      "Generalized Anxiety & Panic Disorder Therapy",
      "Depression & Bipolar Mood Stabilization",
      "Insomnia & Sleep Architecture Optimization",
      "Adult ADHD Diagnostics & Focus Coaching",
      "De-Addiction & Burnout Recovery Protocols"
    ],
    servicesHi: [
      "चिंता (एंग्जायटी) व पैनिक अटैक उपचार",
      "डिप्रेशन व मूड स्विंग्स संतुलन",
      "अनिद्रा (नींद न आना) सुधार प्रोटोकॉल",
      "एडल्ट एडीएचडी (ADHD) व फोकस परामर्श",
      "तनाव, बर्नआउट व नशा मुक्ति सलाह"
    ],
    education: [
      "MD (Psychiatry) - Central Institute of Psychiatry (CIP), Ranchi",
      "MBBS - Medical College and Hospital, Kolkata"
    ],
    timings: "Mon - Sat: 11:30 AM - 07:30 PM",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Debashis Sen", rating: 5, date: "4 days ago", comment: "So empathetic and non-judgmental. Helped me conquer severe panic attacks within weeks." },
      { name: "Priyanka Roy", rating: 5, date: "2 weeks ago", comment: "Safe space to talk. She adjusted my medication with utmost sensitivity to zero side effects." }
    ]
  },
  {
    id: "doc-12",
    name: "Dr. Meera Iyer",
    nameHi: "डॉ. मीरा अय्यर",
    specialtyId: "dentist",
    specialty: "Pediatric Dentist & Orthodontist",
    specialtyHi: "बाल दंत चिकित्सक व ब्रेसेस विशेषज्ञ",
    qualifications: "BDS, MDS - Orthodontics & Dentofacial Orthopedics",
    experience: 10,
    rating: 4.89,
    reviewsCount: 310,
    clinic: "PerfectSmile Orthodontic Studio",
    clinicHi: "परफेक्ट स्माइल ऑर्थोडॉन्टिक स्टूडियो",
    hospital: "Rainbow Dental Care",
    location: "Jubilee Hills, Hyderabad",
    locationHi: "जुबली हिल्स, हैदराबाद",
    address: "Road No. 36, Near Peddamma Temple, Jubilee Hills, Hyderabad - 500033",
    distance: "2.7 km away",
    contactNumber: "+91 98490 66219",
    whatsappNumber: "919849066219",
    email: "dr.meera@perfectsmile.in",
    fee: 500,
    isFreeOpd: false,
    videoConsult: true,
    availableToday: true,
    nextSlot: "Today, 04:15 PM",
    registrationNo: "APDC/2014/3391 (Telangana Dental Council)",
    languages: ["English", "Hindi", "Telugu"],
    about: "Dr. Meera Iyer specializes in correcting crooked teeth, gap closure, clear aligners (Invisalign), child preventative dental care, and jaw alignment for kids, teens, and adults.",
    aboutHi: "डॉ. मीरा अय्यर दांतों के ब्रेसेस, इनविजिबल अलाइनर्स, टेढ़े-मेढ़े दांत ठीक करने और बच्चों की डेंटल केयर में 10 वर्षों के अनुभव के साथ विशेषज्ञ हैं।",
    services: [
      "Clear Aligners (Invisalign & Spark)",
      "Ceramic & Metallic Braces for Teens",
      "Child Fluoride Varnish & Pit Fissure Sealants",
      "Night Guards for Teeth Grinding (Bruxism)",
      "Smile Designing & Gap Closure"
    ],
    servicesHi: [
      "ट्रांसपेरेंट अलाइनर्स (इनविजिबल ब्रेसेस)",
      "मेटल व सिरेमिक ब्रेसेस",
      "बच्चों के दांतों में फ्लोराइड कोटिंग",
      "दांत पीसने (ब्रुक्सिज्म) का नाइट गार्ड",
      "दांतों के बीच गैप ठीक करना"
    ],
    education: [
      "MDS (Orthodontics) - Army College of Dental Sciences",
      "BDS - Sri Ramachandra Dental College, Chennai"
    ],
    timings: "Mon - Sat: 10:00 AM - 07:00 PM",
    avatar: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=350&auto=format&fit=crop&q=80",
    patientStories: [
      { name: "Varun Teja", rating: 5, date: "1 week ago", comment: "My transparent aligners journey was smooth. In 7 months my front teeth gap is completely gone!" },
      { name: "Sneha Reddy", rating: 5, date: "3 weeks ago", comment: "Very gentle with children. Highly recommended for kids orthodontic needs." }
    ]
  }
];
