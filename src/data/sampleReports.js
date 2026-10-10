// Preloaded clinical medical lab reports covering 3 distinct body paths & blood tests
// Dynamically bound to the active patient's essential data (Name, Age, Gender, Phone, Address, Blood Group, ABHA ID)

export const generatePatientReports = (patient = {}) => {
  const patientName = patient?.name || "Aarish Rajput";
  const age = patient?.age || 22;
  const gender = patient?.gender || "Male";
  const bloodGroup = patient?.bloodGroup || "B+";
  const phone = patient?.emergencyContact?.phone || patient?.phone || "+91 98765 43210";
  const address = patient?.address || "Sector 62, Noida, Uttar Pradesh, India";
  const abhaId = patient?.abhaId || "91-4521-8842-1982";

  return [
    {
      id: "rep_blood_metabolic",
      title: "Comprehensive Blood, Glycemic & Hematology Panel",
      bodySystem: "Vascular & Hematologic System (Blood & Metabolism)",
      bodySystemHi: "रक्त, हीमोग्लोबिन व मेटाबॉलिक प्रोफाइल",
      bodyIcon: "Droplet",
      date: "08 Oct 2026",
      lab: "Thyrocare Technologies / Metropolis Central Pathology",
      labAddress: "Plot C-12, Institutional Area, New Delhi - 110001",
      referringDoctor: "Dr. Arvind Mehta, MD (Cardiologist)",
      patientName,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      abhaId,
      overallRisk: "Moderate",
      headlineSummary: "Elevated glycated hemoglobin (HbA1c 7.2%) and fasting glucose indicate ongoing glycemic attention. Complete blood count (CBC) and platelets remain robust.",
      parameters: [
        {
          name: "HbA1c (Glycated Hemoglobin)",
          value: 7.2,
          unit: "%",
          reference: "< 5.7% (Normal), 5.7 - 6.4% (Prediabetes), > 6.5% (Diabetes)",
          status: "attention",
          plainExplanation: "Measures 90-day average blood sugar. 7.2% reflects moderate control; target is 6.5% - 7.0%.",
          actionItem: "Consult doctor for Metformin dosage adherence and dinner carbohydrate management."
        },
        {
          name: "Fasting Blood Glucose (FBS)",
          value: 128,
          unit: "mg/dL",
          reference: "70 - 99 (Normal), 100 - 125 (Impaired), ≥ 126 (High)",
          status: "attention",
          plainExplanation: "Morning blood sugar before breakfast. 128 mg/dL confirms elevated fasting levels.",
          actionItem: "Maintain consistent 12-hour overnight fasting and limit late-night starches."
        },
        {
          name: "Hemoglobin (Hb)",
          value: 14.8,
          unit: "g/dL",
          reference: "13.0 - 17.0 g/dL (Male), 12.0 - 15.0 g/dL (Female)",
          status: "good",
          plainExplanation: "Oxygen-carrying capacity of circulating red blood cells. Perfectly optimal.",
          actionItem: "Normal cellular oxygen delivery; no nutritional anemia."
        },
        {
          name: "Total Leukocyte Count (WBC)",
          value: 7400,
          unit: "/cu.mm",
          reference: "4,000 - 11,000 /cu.mm",
          status: "good",
          plainExplanation: "White blood cell immune defense count. Balanced and healthy.",
          actionItem: "No acute systemic infection or immune stress."
        },
        {
          name: "Platelet Count",
          value: 245000,
          unit: "/cu.mm",
          reference: "150,000 - 450,000 /cu.mm",
          status: "good",
          plainExplanation: "Blood clotting and vessel repair cells. Optimal count.",
          actionItem: "Normal coagulation capacity."
        },
        {
          name: "Total Serum Cholesterol",
          value: 215,
          unit: "mg/dL",
          reference: "< 200 mg/dL",
          status: "borderline",
          plainExplanation: "Cumulative circulating blood lipids. Slightly above target threshold.",
          actionItem: "Continue evening statin medication and increase soluble dietary fiber."
        },
        {
          name: "LDL Cholesterol ('Bad' Lipid)",
          value: 138,
          unit: "mg/dL",
          reference: "< 100 mg/dL (Optimal < 70 mg/dL)",
          status: "attention",
          plainExplanation: "Atherogenic low-density lipoprotein. Requires control to protect vascular walls.",
          actionItem: "Adhere to prescribed Rosuvastatin 10mg at bedtime."
        }
      ],
      doctorQuestions: [
        "My HbA1c is 7.2%. Should we adjust my medication timing or dosage?",
        "Given my LDL of 138 mg/dL, is the current Rosuvastatin 10mg dose sufficient?",
        "Are there specific dietary fiber modifications you suggest?"
      ]
    },
    {
      id: "rep_chest_cardiopulmonary",
      title: "Chest Cardiopulmonary & Digital Radiology Panel",
      bodySystem: "Thoracic Cavity, Lungs & Cardiovascular (Chest & Heart)",
      bodySystemHi: "छाती, फेफड़े व कार्डियोपल्मोनरी प्रोफाइल",
      bodyIcon: "Activity",
      date: "04 Oct 2026",
      lab: "Max Super Speciality Cardiopulmonary Imaging Centre",
      labAddress: "Press Enclave Road, Saket, New Delhi - 110017",
      referringDoctor: "Dr. Arvind Mehta, MD (Cardiologist)",
      patientName,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      abhaId,
      overallRisk: "Optimal",
      headlineSummary: "Cardiopulmonary investigation demonstrates clear bilateral lung fields, normal sinus cardiac rhythm, and no cardiomegaly or active pulmonary consolidation.",
      parameters: [
        {
          name: "Resting 12-Lead Electrocardiogram (ECG)",
          value: "Normal Sinus Rhythm (HR: 74 BPM)",
          unit: "Rhythm",
          reference: "Normal Sinus, No ST-T segment elevation or ischemic changes",
          status: "good",
          plainExplanation: "Electrical rhythm of heart ventricles. Regular pacemaker conduction with zero ischemic distress.",
          actionItem: "Healthy resting cardiac conduction."
        },
        {
          name: "High-Sensitivity Cardiac Troponin-I",
          value: "< 0.01",
          unit: "ng/mL",
          reference: "< 0.04 ng/mL (Normal Baseline)",
          status: "good",
          plainExplanation: "Specific enzyme released during myocardial muscle injury. Baseline negative value rules out cardiac damage.",
          actionItem: "Zero myocardial stress or injury detected."
        },
        {
          name: "Digital Chest Radiography (PA View)",
          value: "Clear Bilateral Fields",
          unit: "Imaging",
          reference: "Normal bronchovascular markings, sharp costophrenic angles",
          status: "good",
          plainExplanation: "High-resolution lung scan. Both lung lobes are fully expanded without effusion or congestion.",
          actionItem: "Clean respiratory lung fields."
        },
        {
          name: "Cardiothoracic (CT) Ratio",
          value: "0.46",
          unit: "Ratio",
          reference: "< 0.50 (Normal Heart Size)",
          status: "good",
          plainExplanation: "Compares heart width against inner chest diameter. 0.46 confirms no cardiac enlargement (cardiomegaly).",
          actionItem: "Heart dimensions within anatomical normal."
        },
        {
          name: "Blood Oxygen Saturation (SpO2)",
          value: 98,
          unit: "%",
          reference: "95 - 100% (Ambient Air)",
          status: "good",
          plainExplanation: "Arterial oxygen saturation delivered to peripheral tissues. Excellent oxygenation.",
          actionItem: "Healthy pulmonary alveolar gas exchange."
        },
        {
          name: "Resting Arterial Blood Pressure",
          value: "128/82",
          unit: "mmHg",
          reference: "< 130/80 mmHg (Target on Antihypertensive)",
          status: "good",
          plainExplanation: "Systolic and diastolic arterial pressure. Well controlled under prescribed Telmisartan.",
          actionItem: "Continue daily morning BP medication."
        }
      ],
      doctorQuestions: [
        "My ECG and Chest X-Ray are clear. Can I proceed with higher-intensity aerobic exercise?",
        "My resting blood pressure is 128/82 mmHg—should I keep the current Telmisartan 40mg dose?"
      ]
    },
    {
      id: "rep_abdomen_liver_kidney",
      title: "Abdominal Ultrasound, Hepatic & Renal Function Profile",
      bodySystem: "Abdominal Viscera, Hepato-Biliary & Renal (Liver & Kidneys)",
      bodySystemHi: "पेट, लिवर व गुर्दे (LFT व KFT) प्रोफाइल",
      bodyIcon: "ShieldCheck",
      date: "28 Sep 2026",
      lab: "Apollo Diagnostic Pathology & Sonography Centre",
      labAddress: "Sarita Vihar, Delhi Mathura Road, New Delhi - 110076",
      referringDoctor: "Dr. Arvind Mehta, MD (Cardiologist)",
      patientName,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      abhaId,
      overallRisk: "Optimal",
      headlineSummary: "Hepatic enzymes (SGPT/SGOT) and renal filtration clearance (Creatinine & eGFR 94) reflect healthy organ function with zero evidence of fatty liver or nephropathy.",
      parameters: [
        {
          name: "Serum Creatinine",
          value: 0.92,
          unit: "mg/dL",
          reference: "0.70 - 1.20 mg/dL",
          status: "good",
          plainExplanation: "Primary muscular waste marker filtered by kidney glomeruli. Optimal filtration efficiency.",
          actionItem: "Maintain 2.5 - 3 liters daily water intake."
        },
        {
          name: "Estimated Glomerular Filtration Rate (eGFR)",
          value: 94,
          unit: "mL/min/1.73m²",
          reference: "> 90 (Stage 1 / Normal Renal Function)",
          status: "good",
          plainExplanation: "Direct measure of functional kidney filtering units. Score 94 confirms youthful, strong kidney clearance.",
          actionItem: "Kidneys operating at peak performance."
        },
        {
          name: "Blood Urea Nitrogen (BUN)",
          value: 14.2,
          unit: "mg/dL",
          reference: "7.0 - 20.0 mg/dL",
          status: "good",
          plainExplanation: "Protein catabolism byproduct excreted through kidneys. Balanced metabolism.",
          actionItem: "Balanced dietary protein utilization."
        },
        {
          name: "SGPT / ALT (Alanine Aminotransferase)",
          value: 28,
          unit: "U/L",
          reference: "< 45 U/L (Normal Liver)",
          status: "good",
          plainExplanation: "Enzyme indicating liver cell membrane integrity. Normal reading shows zero liver inflammation.",
          actionItem: "Liver cells healthy and intact."
        },
        {
          name: "SGOT / AST (Aspartate Aminotransferase)",
          value: 24,
          unit: "U/L",
          reference: "< 40 U/L",
          status: "good",
          plainExplanation: "Enzyme present in liver and cardiovascular tissues. Normal.",
          actionItem: "Healthy tissue integrity."
        },
        {
          name: "Total Serum Bilirubin",
          value: 0.8,
          unit: "mg/dL",
          reference: "0.2 - 1.2 mg/dL",
          status: "good",
          plainExplanation: "Bile pigment produced during natural red blood cell recycling. Normal bile drainage.",
          actionItem: "Smooth gallbladder and bile duct function."
        },
        {
          name: "High-Resolution Abdominal Ultrasound (USG)",
          value: "Grade 0 / Normal Parenchyma",
          unit: "Sonography",
          reference: "Normal liver size (13.2 cm), smooth borders, normal renal cortical depth",
          status: "good",
          plainExplanation: "Ultrasonic imaging of abdominal organs. Normal liver echotexture without fatty infiltration or stones.",
          actionItem: "Clear abdominal scan; continue low-oil diet."
        }
      ],
      doctorQuestions: [
        "Given optimal eGFR of 94 and normal liver enzymes, can I safely continue all current medications?",
        "When should I repeat this ultrasound screening?"
      ]
    }
  ];
};

// Default fallback reports using standard profile
export const sampleReports = generatePatientReports({
  name: "Aarish Rajput",
  age: 22,
  gender: "Male",
  bloodGroup: "B+",
  phone: "+91 98765 43210",
  address: "Sector 62, Noida, Uttar Pradesh, India",
  abhaId: "91-4521-8842-1982"
});
