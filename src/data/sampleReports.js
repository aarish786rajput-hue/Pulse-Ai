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
  },
  {
    id: "rep_thyroid_panel",
    title: "Thyroid Function Test (TFT - T3, T4, TSH)",
    date: "October 08, 2026",
    lab: "Apollo Diagnostics Centre",
    patientName: "Rahul Sharma",
    ageGender: "45 / M",
    overallRisk: "Borderline",
    headlineSummary: "TSH is slightly elevated (4.85 mIU/L), indicating early subclinical hypothyroidism. Free T3 and Free T4 remain within normal biological limits.",
    parameters: [
      {
        name: "TSH (Thyroid Stimulating Hormone)",
        value: 4.85,
        unit: "mIU/L",
        reference: "0.45 - 4.50 mIU/L",
        status: "borderline",
        plainExplanation: "Pituitary hormone that prompts thyroid to work. Slightly elevated, meaning thyroid gland is working a bit slowly.",
        actionItem: "Re-check in 6-8 weeks with your doctor; maintain adequate dietary selenium and zinc."
      },
      {
        name: "Free T4 (Free Thyroxine)",
        value: 1.25,
        unit: "ng/dL",
        reference: "0.82 - 1.77 ng/dL",
        status: "good",
        plainExplanation: "Active circulating thyroid hormone controlling metabolic rate. Within healthy balance.",
        actionItem: "Normal metabolic energy regulation."
      },
      {
        name: "Free T3 (Free Triiodothyronine)",
        value: 3.10,
        unit: "pg/mL",
        reference: "2.0 - 4.4 pg/mL",
        status: "good",
        plainExplanation: "Potent active thyroid hormone supporting body temperature and energy. Normal.",
        actionItem: "Optimal cellular metabolism."
      },
      {
        name: "Anti-TPO Antibodies",
        value: 18,
        unit: "IU/mL",
        reference: "< 34 IU/mL (Negative)",
        status: "good",
        plainExplanation: "Autoantibody test. Normal value rules out active autoimmune thyroiditis (Hashimoto's).",
        actionItem: "No autoimmune thyroid damage detected."
      }
    ],
    doctorQuestions: [
      "My TSH is 4.85 mIU/L with normal T3/T4. Does this warrant starting low-dose Thyroxine or observing?",
      "Should I retest morning fasting TSH in 8 weeks?"
    ]
  },
  {
    id: "rep_liver_kidney",
    title: "Comprehensive Liver & Kidney Profile (LFT & KFT)",
    date: "September 14, 2026",
    lab: "Max Super Speciality Lab",
    patientName: "Rahul Sharma",
    ageGender: "45 / M",
    overallRisk: "Optimal",
    headlineSummary: "Hepatic detoxification enzymes and renal clearance markers are completely normal. Robust liver and kidney filtration.",
    parameters: [
      {
        name: "Serum Creatinine",
        value: 0.90,
        unit: "mg/dL",
        reference: "0.70 - 1.20 mg/dL",
        status: "good",
        plainExplanation: "Kidney filtration waste marker. Excellent clearance rate.",
        actionItem: "Kidneys filtering efficiently; keep drinking 2.5L water daily."
      },
      {
        name: "Blood Urea Nitrogen (BUN)",
        value: 14.5,
        unit: "mg/dL",
        reference: "7.0 - 20.0 mg/dL",
        status: "good",
        plainExplanation: "Byproduct of protein breakdown. Normal range confirms balanced protein metabolism.",
        actionItem: "Stable kidney clearance."
      },
      {
        name: "SGPT / ALT (Liver Enzyme)",
        value: 28,
        unit: "U/L",
        reference: "< 45 U/L",
        status: "good",
        plainExplanation: "Primary liver cellular integrity enzyme. Safe and normal level with zero signs of fatty liver inflammation.",
        actionItem: "Liver health in optimal condition."
      },
      {
        name: "SGOT / AST (Liver & Heart Enzyme)",
        value: 24,
        unit: "U/L",
        reference: "< 40 U/L",
        status: "good",
        plainExplanation: "Enzyme present in liver and muscle tissue. Optimal reading.",
        actionItem: "Balanced cellular markers."
      },
      {
        name: "Total Bilirubin",
        value: 0.8,
        unit: "mg/dL",
        reference: "0.2 - 1.2 mg/dL",
        status: "good",
        plainExplanation: "Bile pigment processed by liver. Optimal, ruling out jaundice or bile duct obstruction.",
        actionItem: "Healthy bile flow."
      },
      {
        name: "Serum Albumin",
        value: 4.4,
        unit: "g/dL",
        reference: "3.5 - 5.2 g/dL",
        status: "good",
        plainExplanation: "Crucial protein produced by liver maintaining blood vessel osmotic fluid pressure. Strong level.",
        actionItem: "Excellent nutritional protein synthesis."
      }
    ],
    doctorQuestions: [
      "Both liver enzymes and kidney creatinine are optimal—can I continue my current medication schedule safely?",
      "Are any special precautions needed for my annual screening?"
    ]
  }
];
