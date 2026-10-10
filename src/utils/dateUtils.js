// Helper utilities for date and age calculation

/**
 * Calculates exact age in years from a date of birth string (YYYY-MM-DD)
 * Uses timezone-safe string parsing to prevent UTC midnight date shift bugs.
 */
export function calculateAge(dobString, fallback = 45) {
  if (!dobString) return fallback;

  // Timezone-safe parsing for YYYY-MM-DD
  const parts = String(dobString).trim().split("-");
  if (parts.length === 3) {
    const birthYear = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10) - 1; // 0-indexed month
    const birthDay = parseInt(parts[2], 10);

    if (!isNaN(birthYear) && !isNaN(birthMonth) && !isNaN(birthDay)) {
      const today = new Date();
      let age = today.getFullYear() - birthYear;
      const monthDiff = today.getMonth() - birthMonth;

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
        age--;
      }
      return age >= 0 ? age : fallback;
    }
  }

  // Fallback to standard Date parsing if format differs
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return fallback;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : fallback;
}
