// Clinically realistic patient profiles for PulseAI

export const mockPatients = [
  {
    id: "pat_1",
    name: "Rahul Sharma",
    age: 45,
    gender: "Male",
    dob: "1981-04-12",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    address: "B-42, Sector 62, Noida, Uttar Pradesh, India - 201309",
    abhaId: "91-4521-8842-1982",
    heightCm: 174,
    weightKg: 78.5,
    bmi: 25.9,
    targetWeightKg: 72.0,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    conditions: [
      { name: "Type 2 Diabetes Mellitus", diagnosedYear: 2021, status: "Active (Oral Agents)" },
      { name: "Essential Hypertension", diagnosedYear: 2023, status: "Controlled on ARB" },
      { name: "Mild Dyslipidemia", diagnosedYear: 2024, status: "Under Statin Therapy" }
    ],
    allergies: [
      { allergen: "Penicillin", reaction: "Severe Urticaria / Hives", severity: "Critical" },
      { allergen: "Sulfa Drugs", reaction: "Skin Rash & Erythema", severity: "Moderate" }
    ],
    surgeries: [
      { procedure: "Laparoscopic Appendectomy", year: 2018, hospital: "Max Healthcare" }
    ],
    familyHistory: [
      { relation: "Father", condition: "Coronary Artery Disease & Myocardial Infarction at age 58" },
      { relation: "Mother", condition: "Late-onset Type 2 Diabetes" }
    ],
    lifestyle: {
      smoking: "Non-Smoker",
      alcohol: "Occasional (Social)",
      activityLevel: "Moderate (30 mins brisk walk, 5x/wk)",
      sleepHours: "6.5 - 7 hours / night",
      dietType: "Diabetic-conscious / Low Glycemic Index"
    },
    emergencyContact: {
      name: "Sunita Sharma",
      relation: "Spouse",
      phone: "+91 98765 43210",
      secondaryPhone: "+91 98111 22334"
    },
    secondaryContact: {
      name: "Amit Sharma",
      relation: "Brother",
      phone: "+91 98333 44556"
    },
    primaryPhysician: {
      name: "Dr. Arvind Mehta, MD (Cardiologist)",
      clinic: "Apollo Health City, New Delhi",
      phone: "+91 11 2692 5858",
      email: "dr.arvind.mehta@apollo.org"
    },
    insurance: {
      provider: "Star Health Premier Insurance",
      policyNumber: "SH-99283-IND",
      tpaSupport: "1800-425-2255",
      validTill: "November 2027",
      sumInsured: "₹ 15,00,000"
    },
    todayMedications: [
      {
        id: "med_1",
        name: "Metformin ER",
        dosage: "500 mg",
        timing: "Morning (After breakfast)",
        slot: "morning",
        taken: true,
        purpose: "Blood Glucose Regulation",
        refillDaysLeft: 12,
        withFood: true
      },
      {
        id: "med_2",
        name: "Telmisartan",
        dosage: "40 mg",
        timing: "Morning (8:00 AM)",
        slot: "morning",
        taken: true,
        purpose: "Blood Pressure Control",
        refillDaysLeft: 18,
        withFood: false
      },
      {
        id: "med_3",
        name: "Glimepiride",
        dosage: "1 mg",
        timing: "Afternoon (1:30 PM)",
        slot: "afternoon",
        taken: false,
        purpose: "Stimulate Insulin Release",
        refillDaysLeft: 5,
        withFood: true
      },
      {
        id: "med_4",
        name: "Rosuvastatin",
        dosage: "10 mg",
        timing: "Night (9:30 PM)",
        slot: "night",
        taken: false,
        purpose: "Cholesterol Management",
        refillDaysLeft: 24,
        withFood: false
      }
    ],
    vitalsHistory: [
      { date: "Oct 1", bpSystolic: 138, bpDiastolic: 88, bloodSugarFasting: 132, bloodSugarPost: 178, heartRate: 76, spo2: 98, weight: 79.1 },
      { date: "Oct 2", bpSystolic: 135, bpDiastolic: 86, bloodSugarFasting: 128, bloodSugarPost: 165, heartRate: 74, spo2: 98, weight: 79.0 },
      { date: "Oct 3", bpSystolic: 140, bpDiastolic: 90, bloodSugarFasting: 135, bloodSugarPost: 182, heartRate: 80, spo2: 97, weight: 78.9 },
      { date: "Oct 4", bpSystolic: 132, bpDiastolic: 84, bloodSugarFasting: 122, bloodSugarPost: 158, heartRate: 72, spo2: 99, weight: 78.7 },
      { date: "Oct 5", bpSystolic: 130, bpDiastolic: 82, bloodSugarFasting: 118, bloodSugarPost: 150, heartRate: 71, spo2: 98, weight: 78.6 },
      { date: "Oct 6", bpSystolic: 128, bpDiastolic: 82, bloodSugarFasting: 115, bloodSugarPost: 146, heartRate: 70, spo2: 99, weight: 78.5 }
    ],
    timelineEvents: [
      {
        id: "evt_1",
        date: "2026-10-04",
        category: "Lab Test",
        title: "Comprehensive Metabolic & Lipid Profile",
        doctor: "Thyrocare Pathlabs",
        summary: "HbA1c observed at 7.2% (Moderate control). LDL cholesterol elevated at 134 mg/dL. Renal eGFR normal at 88.",
        badge: "Report Available",
        status: "attention"
      },
      {
        id: "evt_2",
        date: "2026-09-18",
        category: "Consultation",
        title: "Quarterly Cardiology & BP Review",
        doctor: "Dr. Arvind Mehta",
        summary: "BP showed improvement from 145/95 to 130/84. Recommended continuing Telmisartan 40mg. Advised 30 mins brisk walking.",
        badge: "Consultation Note",
        status: "good"
      },
      {
        id: "evt_3",
        date: "2026-08-10",
        category: "Diagnostic",
        title: "Fundoscopy (Diabetic Retinopathy Screening)",
        doctor: "Dr. N. Sengupta (Eye Care)",
        summary: "Both retinas clear. No microaneurysms detected. Next annual screening advised August 2027.",
        badge: "Clear",
        status: "good"
      },
      {
        id: "evt_4",
        date: "2026-05-15",
        category: "Immunization",
        title: "Annual Influenza Vaccine",
        doctor: "Max Super Speciality Hospital",
        summary: "Quadrivalent flu vaccine administered in left deltoid. No acute reaction.",
        badge: "Vaccine",
        status: "good"
      }
    ]
  },
  {
    id: "pat_2",
    name: "Ananya Sen",
    age: 32,
    gender: "Female",
    dob: "1994-08-20",
    bloodGroup: "O+",
    phone: "+91 98234 56789",
    address: "Flat 4B, Silver Oak Heights, Salt Lake Sector 5, Kolkata, West Bengal - 700091",
    abhaId: "91-8842-1920-5519",
    heightCm: 162,
    weightKg: 58.2,
    bmi: 22.2,
    targetWeightKg: 58.0,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    conditions: [
      { name: "Hypothyroidism", diagnosedYear: 2022, status: "Stable on Eltroxin" },
      { name: "Mild Allergic Asthma", diagnosedYear: 2020, status: "Seasonal Exacerbation" }
    ],
    allergies: [
      { allergen: "NSAIDs (Aspirin, Ibuprofen)", reaction: "Bronchospasm & Wheezing", severity: "Critical" },
      { allergen: "Peanuts", reaction: "Oral itching", severity: "Moderate" }
    ],
    surgeries: [],
    familyHistory: [
      { relation: "Mother", condition: "Hypothyroidism & Osteopenia" }
    ],
    lifestyle: {
      smoking: "Non-Smoker",
      alcohol: "None",
      activityLevel: "Active (Yoga & Pilates 4x/wk)",
      sleepHours: "7.5 hours / night",
      dietType: "Vegetarian / High Protein"
    },
    emergencyContact: {
      name: "Rohit Sen",
      relation: "Sibling (Brother)",
      phone: "+91 98234 56789",
      secondaryPhone: "+91 97654 32109"
    },
    secondaryContact: {
      name: "Meera Sen",
      relation: "Mother",
      phone: "+91 98111 00223"
    },
    primaryPhysician: {
      name: "Dr. Shalini Ray (Endocrinologist)",
      clinic: "Fortis Escorts Care, Kolkata",
      phone: "+91 33 2441 5500",
      email: "dr.shalini.ray@fortis.in"
    },
    insurance: {
      provider: "HDFC ERGO Optima Secure",
      policyNumber: "HE-77192-KOL",
      tpaSupport: "1800-2666-400",
      validTill: "March 2028",
      sumInsured: "₹ 10,00,000"
    },
    todayMedications: [
      {
        id: "med_a1",
        name: "Levothyroxine",
        dosage: "75 mcg",
        timing: "Early Morning (Empty Stomach)",
        slot: "morning",
        taken: true,
        purpose: "Thyroid Hormone Supplement",
        refillDaysLeft: 21,
        withFood: false
      },
      {
        id: "med_a2",
        name: "Montelukast + Levocetirizine",
        dosage: "10mg / 5mg",
        timing: "Night (Bedtime)",
        slot: "night",
        taken: false,
        purpose: "Asthma & Allergy Prevention",
        refillDaysLeft: 8,
        withFood: false
      }
    ],
    vitalsHistory: [
      { date: "Oct 1", bpSystolic: 114, bpDiastolic: 74, bloodSugarFasting: 92, bloodSugarPost: 118, heartRate: 68, spo2: 99, weight: 58.5 },
      { date: "Oct 2", bpSystolic: 116, bpDiastolic: 76, bloodSugarFasting: 89, bloodSugarPost: 115, heartRate: 70, spo2: 98, weight: 58.4 },
      { date: "Oct 3", bpSystolic: 112, bpDiastolic: 72, bloodSugarFasting: 94, bloodSugarPost: 122, heartRate: 67, spo2: 99, weight: 58.3 },
      { date: "Oct 4", bpSystolic: 115, bpDiastolic: 75, bloodSugarFasting: 91, bloodSugarPost: 119, heartRate: 72, spo2: 99, weight: 58.2 },
      { date: "Oct 5", bpSystolic: 118, bpDiastolic: 78, bloodSugarFasting: 90, bloodSugarPost: 114, heartRate: 69, spo2: 99, weight: 58.2 },
      { date: "Oct 6", bpSystolic: 114, bpDiastolic: 74, bloodSugarFasting: 88, bloodSugarPost: 116, heartRate: 68, spo2: 99, weight: 58.2 }
    ],
    timelineEvents: [
      {
        id: "evt_a1",
        date: "2026-09-29",
        category: "Lab Test",
        title: "Thyroid Function Panel (TSH, Free T3, Free T4)",
        doctor: "Dr. Lal PathLabs",
        summary: "TSH stabilized at 2.45 mIU/L (Within target range 0.4 - 4.0). Free T4 normal.",
        badge: "Optimal Control",
        status: "good"
      }
    ]
  }
];
