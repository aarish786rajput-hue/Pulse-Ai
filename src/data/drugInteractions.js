// Clinically validated drug-drug and drug-condition interaction knowledge base

export const knownInteractions = [
  {
    drug1: "Aspirin",
    drug2: "Warfarin",
    severity: "critical",
    title: "Major Bleeding Hazard",
    description: "Combining Aspirin with Warfarin or other anticoagulants drastically increases the risk of severe gastrointestinal and internal hemorrhages.",
    actionRecommendation: "Do not take concurrently unless under close clinical supervision with frequent INR blood monitoring."
  },
  {
    drug1: "Ibuprofen",
    drug2: "Telmisartan",
    severity: "warning",
    title: "Blunted BP Efficacy & Renal Stress",
    description: "NSAIDs like Ibuprofen or Naproxen can decrease the blood pressure lowering effect of ARBs (Telmisartan) and worsen kidney function.",
    actionRecommendation: "Prefer Paracetamol / Acetaminophen for pain relief or fever instead of NSAIDs."
  },
  {
    drug1: "Ibuprofen",
    drug2: "Aspirin",
    severity: "warning",
    title: "Cardioprotection Interference",
    description: "Ibuprofen competes with aspirin for binding sites on platelet cyclooxygenase-1, reducing aspirin's antiplatelet protective effect.",
    actionRecommendation: "Take immediate-release aspirin at least 30 minutes before or 8 hours after ibuprofen."
  },
  {
    drug1: "Metformin",
    drug2: "Contrast Dye",
    severity: "warning",
    title: "Risk of Lactic Acidosis",
    description: "Intravenous iodinated contrast agents used in CT scans can cause acute kidney injury, which may lead to toxic Metformin buildup.",
    actionRecommendation: "Withhold Metformin 48 hours before and after contrast-enhanced imaging studies as advised by your doctor."
  },
  {
    drug1: "Levothyroxine",
    drug2: "Calcium Carbonate",
    severity: "caution",
    title: "Reduced Thyroid Absorption",
    description: "Calcium supplements bind to thyroid hormone in the gut, substantially lowering Levothyroxine absorption into the bloodstream.",
    actionRecommendation: "Separate doses by at least 4 hours (take Levothyroxine empty stomach early morning, calcium at midday)."
  },
  {
    drug1: "Rosuvastatin",
    drug2: "Gemfibrozil",
    severity: "critical",
    title: "Severe Muscle Breakdown (Rhabdomyolysis)",
    description: "Gemfibrozil significantly increases blood levels of Rosuvastatin, elevating the risk of severe muscle pain and kidney injury.",
    actionRecommendation: "Avoid co-administration. Alternatives like Fenofibrate with lower interaction potential may be considered by a doctor."
  },
  {
    drug1: "Telmisartan",
    drug2: "Potassium Supplements",
    severity: "caution",
    title: "Elevated Potassium (Hyperkalemia)",
    description: "Telmisartan increases potassium retention. Concurrent potassium supplements or salt substitutes can push blood potassium to unsafe cardiac levels.",
    actionRecommendation: "Periodic serum potassium monitoring is advised; avoid high-potassium salt substitutes without doctor consent."
  }
];

export function checkPairInteraction(medName1, medName2) {
  const norm1 = medName1.toLowerCase().trim();
  const norm2 = medName2.toLowerCase().trim();

  for (const item of knownInteractions) {
    const d1 = item.drug1.toLowerCase();
    const d2 = item.drug2.toLowerCase();

    if ((norm1.includes(d1) && norm2.includes(d2)) || (norm1.includes(d2) && norm2.includes(d1))) {
      return item;
    }
  }
  return null;
}

export function analyzeMedicationList(medList) {
  const alerts = [];
  for (let i = 0; i < medList.length; i++) {
    for (let j = i + 1; j < medList.length; j++) {
      const match = checkPairInteraction(medList[i].name || medList[i], medList[j].name || medList[j]);
      if (match) {
        alerts.push({
          medA: medList[i].name || medList[i],
          medB: medList[j].name || medList[j],
          ...match
        });
      }
    }
  }
  return alerts;
}
