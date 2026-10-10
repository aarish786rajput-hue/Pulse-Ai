/**
 * Geolocation Utility for PulseAI
 * Fetches user's live satellite GPS coordinates and performs reverse-geocoding 
 * to automatically retrieve complete street, city, state, postal code, and country.
 */

export async function getLiveGpsAddress() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              signal: controller.signal,
              headers: {
                "Accept-Language": "en,hi",
                "User-Agent": "PulseAI-Health-Platform/1.0"
              }
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const road = addr.road || addr.street || addr.neighbourhood || addr.suburb || addr.quarter || "";
            const city = addr.city || addr.town || addr.village || addr.county || addr.district || "";
            const state = addr.state || "";
            const postcode = addr.postcode ? ` - ${addr.postcode}` : "";
            const country = addr.country || "India";

            const parts = [road, city, state + postcode, country].filter(Boolean);
            const formatted = parts.length > 0 ? parts.join(", ") : data.display_name;

            if (formatted) {
              resolve({
                address: formatted,
                formattedAddress: formatted,
                latitude,
                longitude,
                accuracy: Math.round(accuracy),
                raw: data
              });
              return;
            }
          }
        } catch (fetchErr) {
          console.warn("Reverse geocode service timed out or offline, using GPS coordinate format:", fetchErr);
        }

        // Coordinate fallback if reverse-geocoding network request fails or times out
        const fallbackStr = `GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (Live Location Detected, Accuracy ±${Math.round(accuracy)}m)`;
        resolve({
          address: fallbackStr,
          formattedAddress: fallbackStr,
          latitude,
          longitude,
          accuracy: Math.round(accuracy)
        });
      },
      (error) => {
        let msg = "Could not fetch GPS location.";
        if (error.code === 1) {
          msg = "GPS location permission denied. Please allow location access in your browser.";
        } else if (error.code === 2) {
          msg = "Position unavailable. Please check your device location services.";
        } else if (error.code === 3) {
          msg = "GPS request timed out. Please try again.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}
