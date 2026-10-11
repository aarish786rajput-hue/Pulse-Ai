import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// PulseAI Official Firebase Production Web Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC9jm4ReZfrAL_5wRsQW8pyOVz3olUFuA0",
  authDomain: "pulseai-42def.firebaseapp.com",
  projectId: "pulseai-42def",
  storageBucket: "pulseai-42def.firebasestorage.app",
  messagingSenderId: "1046068109956",
  appId: "1:1046068109956:web:8741325bde2a2d369498d1",
  measurementId: "G-K5HXNDMG72"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Cloud Sync: Save a booked doctor appointment to Firestore
 * Uses non-blocking try/catch so local workflow is never interrupted.
 */
export async function syncAppointmentToCloud(appointment) {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointment,
      syncedAt: serverTimestamp(),
      platform: "PulseAI-Web"
    });
    console.log("Appointment successfully synchronized to Firebase Cloud. ID:", docRef.id);
    return { success: true, cloudId: docRef.id };
  } catch (error) {
    console.warn("Cloud sync warning (Local storage will keep data safe):", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Cloud Sync: Fetch appointments from Firestore
 */
export async function fetchAppointmentsFromCloud() {
  try {
    const q = query(collection(db, "appointments"), orderBy("syncedAt", "desc"));
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error) {
    console.warn("Failed to fetch cloud appointments, using local cache:", error.message);
    return [];
  }
}

/**
 * Cloud Sync: Record vital signs to Firestore
 */
export async function syncVitalsToCloud(patientId, vitalsData) {
  try {
    const docRef = await addDoc(collection(db, "vitals_logs"), {
      patientId,
      ...vitalsData,
      syncedAt: serverTimestamp()
    });
    return { success: true, cloudId: docRef.id };
  } catch (error) {
    console.warn("Failed to sync vitals to cloud:", error.message);
    return { success: false, error: error.message };
  }
}

export default app;
