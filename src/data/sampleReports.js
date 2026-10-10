// Preloaded sample medical lab reports for instant testing and demonstration

export const sampleReports = [
  {
    id: "rep_lipid_diabetes",
    title: "Comprehensive Metabolic & Lipid Panel",
    date: "October 04, 2026",
    lab: "Thyrocare Technologies / Metropolis",
    patientName: "Rahul Sharma",
    ageGender: "45 / M",
    overallRisk: "Moderate",
    headlineSummary: "Elevated blood sugar and LDL cholesterol detected. Kidney filtration markers remain within safe limits.",
    parameters: [
      {
        name: "HbA1c (Glycated Hemoglobin)",
        value: 7.2,
        unit: "%",
        reference: "< 5.7% (Normal), 5.7 - 6.4% (Prediabetes), > 6.5% (Diabetes)",
        status: "attention",
        plainExplanation: "Shows your average blood sugar over the last 90 days. 7.2% indicates moderate control; ideal target is below 6.5% - 7.0%.",
        actionItem: "Discuss with your physician if dose adjustment for Metformin/Glimepiride is required."
      },
      {
        name: "Fasting Blood Glucose",
        value: 128,
        unit: "mg/dL",
        reference: "70 - 99 (Normal), 100 - 125 (Impaired), ≥ 126 (High)",
        status: "attention",
        plainExplanation: "Morning blood sugar before food. A reading of 128 mg/dL is higher than optimal, meaning glucose was circulating overnight.",
        actionItem: "Limit high-glycemic carbohydrates in dinners and maintain a 12-hour overnight fast."
      },
      {
        name: "Total Cholesterol",
        value: 215,
        unit: "mg/dL",
        reference: "< 200 mg/dL",
        status: "borderline",
        plainExplanation: "Overall count of cholesterol in your bloodstream. Slightly above the recommended ceiling.",
        actionItem: "Monitor intake of trans fats and saturated animal fats."
      },
      {
        name: "LDL Cholesterol ('Bad' Cholesterol)",
        value: 138,
        unit: "mg/dL",
        reference: "< 100 mg/dL (Optimal for diabetic individuals < 70 mg/dL)",
        status: "attention",
        plainExplanation: "Excess LDL can form plaque inside blood vessels. Because you have hypertension & diabetes, keeping LDL low is critical to prevent artery hardening.",
        actionItem: "Your prescribed Rosuvastatin 10mg is specifically targeting this. Ensure adherence at bedtime."
      },
      {
        name: "HDL Cholesterol ('Good' Cholesterol)",
        value: 48,
        unit: "mg/dL",
        reference: "> 40 mg/dL (Men)",
        status: "good",
        plainExplanation: "Healthy cholesterol that sweeps away bad cholesterol. Your level is healthy.",
        actionItem: "Continue aerobic activities like brisk walking to keep HDL strong."
      },
      {
        name: "Triglycerides",
        value: 178,
        unit: "mg/dL",
        reference: "< 150 mg/dL",
        status: "borderline",
        plainExplanation: "Type of fat stored from excess calories, refined sugars, or alcohol. Borderline elevated.",
        actionItem: "Cut down on sweet beverages, refined flours, and late-night snacks."
      },
      {
        name: "Serum Creatinine",
        value: 0.95,
        unit: "mg/dL",
        reference: "0.7 - 1.2 mg/dL",
        status: "good",
        plainExplanation: "Waste product filtered by kidneys. Normal level confirms kidneys are filtering efficiently.",
        actionItem: "Stay hydrated with 2.5 - 3 liters of water daily."
      },
      {
        name: "Estimated GFR (eGFR)",
        value: 92,
        unit: "mL/min/1.73m²",
        reference: "> 90 (Normal Kidney Function)",
        status: "good",
        plainExplanation: "Filtration capacity of your kidneys. Score 92 indicates robust kidney performance.",
        actionItem: "Maintain BP control to protect these delicate kidney vessels long-term."
      }
    ],
    doctorQuestions: [
      "My HbA1c is 7.2%. Should we adjust my medication timing or dosage?",
      "Given my LDL of 138 mg/dL, should I continue Rosuvastatin 10mg or need a higher statin dose?",
      "Are there specific dietary fiber modifications you suggest to bring triglycerides below 150?"
    ]
  },
  {
    id: "rep_cbc_anemia",
    title: "Complete Blood Count (CBC) & Inflammation Panel",
    date: "September 22, 2026",
    lab: "Dr. Lal PathLabs",
    patientName: "Rahul Sharma",
    ageGender: "45 / M",
    overallRisk: "Low",
    headlineSummary: "Red and white blood cell counts are balanced. Mildly elevated inflammatory marker (ESR) likely from minor seasonal throat irritation.",
    parameters: [
      {
        name: "Hemoglobin (Hb)",
        value: 14.8,
        unit: "g/dL",
        reference: "13.0 - 17.0 g/dL (Men)",
        status: "good",
        plainExplanation: "Protein in red blood cells that carries oxygen across your body. Perfectly optimal.",
        actionItem: "No iron deficiency detected."
      },
      {
        name: "Total Leukocyte Count (WBC)",
        value: 7400,
        unit: "/cu.mm",
        reference: "4,000 - 11,000 /cu.mm",
        status: "good",
        plainExplanation: "Immune defense cells. Count is in the healthy zone, indicating no acute infection.",
        actionItem: "Immune system active and balanced."
      },
      {
        name: "Platelet Count",
        value: 245000,
        unit: "/cu.mm",
        reference: "150,000 - 450,000 /cu.mm",
        status: "good",
        plainExplanation: "Cells responsible for normal blood clotting. Normal range.",
        actionItem: "Normal coagulation capacity."
      },
      {
        name: "ESR (Erythrocyte Sedimentation Rate)",
        value: 22,
        unit: "mm/1st hr",
        reference: "0 - 15 mm/1st hr",
        status: "borderline",
        plainExplanation: "General indicator of low-grade inflammation in the body. Mildly elevated.",
        actionItem: "Usually resolves spontaneously after mild recovery from cold/allergy; recheck if joints ache."
      }
    ],
    doctorQuestions: [
      "My ESR is slightly above range at 22. Does this need a repeat test or is it insignificant?",
      "My blood counts are optimal—can I maintain my current diet?"
    ]
  }
];
