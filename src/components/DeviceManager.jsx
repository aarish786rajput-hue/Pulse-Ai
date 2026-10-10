import React, { useState, useEffect, useRef } from "react";
import {
  Watch,
  Activity,
  Heart,
  Droplet,
  Flame,
  Moon,
  Battery,
  RefreshCw,
  Bluetooth,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sparkles,
  MessageSquareHeart,
  Check,
  X,
  PhoneCall,
  Volume2,
  VolumeX,
  ShieldAlert,
  Share2
} from "lucide-react";

export default function DeviceManager({ 
  patient, 
  lang = "en", 
  onAskCopilot, 
  onUpdateVitals, 
  onOpenEmergency 
}) {
  // ── Connected device state (persisted in localStorage) ─────────────────────
  const [device, setDevice] = useState(() => {
    try {
      const saved = localStorage.getItem("pulseai_connected_device");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load device config:", e);
    }
    return {
      id: "dev_apple_watch",
      name: "Apple Watch Series 9 (Midnight 45mm)",
      brand: "Apple",
      type: "Smartwatch",
      battery: 86,
      isConnected: true,
      bluetoothAddress: "7A:B4:9C:22:DF:11",
      signalStrength: "Excellent",
      firmware: "watchOS 10.4.1",
      lastSync: "Just now"
    };
  });

  // ── Live sensor readings with realistic heartbeat fluctuation ─────────────
  const [liveReadings, setLiveReadings] = useState({
    heartRate: 74,
    systolicBP: 122,
    diastolicBP: 80,
    spo2: 98,
    skinTemp: 98.4,
    stressLevel: 24,
    hrv: 58,
    steps: 6420,
    stepGoal: 10000,
    calories: 418,
    activeMinutes: 42,
    sleepDuration: "7h 35m",
    deepSleep: "2h 10m",
    sleepScore: 88
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureCountdown, setMeasureCountdown] = useState(3);
  const [notification, setNotification] = useState("");
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isSimulatingAbnormal, setIsSimulatingAbnormal] = useState(false);
  const [syncTimeText, setSyncTimeText] = useState("Just now");

  // ── AI Anomaly Detection & Siren States ─────────────────────────────────────
  const [isSoundAlertEnabled, setIsSoundAlertEnabled] = useState(true);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState("normal");
  const lastAlertSoundTimeRef = useRef(0);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Clinical Web Audio Synthesizer: 2-tone Medical Alert Chime
  const playMedicalAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Pulse 1 (880Hz A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1175, now + 0.12);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.32);

      // Pulse 2 (1175Hz D6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.38);
      osc2.frequency.setValueAtTime(1175, now + 0.5);
      gain2.gain.setValueAtTime(0.22, now + 0.38);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.38);
      osc2.stop(now + 0.7);
    } catch (e) {
      console.warn("Medical alert chime audio error:", e);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3200);
  };

  // ── Save device state to localStorage ──────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem("pulseai_connected_device", JSON.stringify(device));
    } catch (err) {
      console.warn(err);
    }
  }, [device]);

  // ── AI Clinical Anomaly Evaluation Engine ────────────────────────────────
  const anomalyStatus = (() => {
    const issues = [];
    let severity = "normal"; // "normal" | "warning" | "critical"

    // 1. Heart Rate Evaluation
    if (liveReadings.heartRate > 120) {
      severity = "critical";
      issues.push({
        metric: "Heart Rate",
        badge: lang === "hi" ? "गंभीर तेज धड़कन" : "Severe Tachycardia",
        title: lang === "hi" ? "अत्यधिक तेज दिल की धड़कन (Severe Tachycardia)" : "Severe Tachycardia (>120 BPM)",
        val: `${liveReadings.heartRate} BPM`,
        target: "60 - 100 BPM",
        level: "critical",
        color: "#ef4444",
        adviceHi: "पल्स 120 से ऊपर है। दिल बहुत तेजी से पंप कर रहा है। तुरंत शांत होकर बैठें और किसी भी काम को रोक दें।",
        adviceEn: "Pulse is critically elevated above 120 BPM. Stop physical activity, sit upright, and rest."
      });
    } else if (liveReadings.heartRate > 100) {
      if (severity !== "critical") severity = "warning";
      issues.push({
        metric: "Heart Rate",
        badge: lang === "hi" ? "बढ़ी हुई धड़कन" : "Elevated Pulse",
        title: lang === "hi" ? "बढ़ी हुई दिल की धड़कन (Elevated Heart Rate)" : "Elevated Heart Rate (>100 BPM)",
        val: `${liveReadings.heartRate} BPM`,
        target: "60 - 100 BPM",
        level: "warning",
        color: "#f59e0b",
        adviceHi: "धड़कन 100 BPM पार कर चुकी है। आराम करें और गहरी सांसें लें।",
        adviceEn: "Resting pulse is above normal resting limits. Take deep, slow breaths."
      });
    } else if (liveReadings.heartRate < 55) {
      if (severity !== "critical") severity = "warning";
      issues.push({
        metric: "Heart Rate",
        badge: lang === "hi" ? "धीमी धड़कन" : "Bradycardia",
        title: lang === "hi" ? "धीमी धड़कन (Bradycardia)" : "Bradycardia (<55 BPM)",
        val: `${liveReadings.heartRate} BPM`,
        target: "60 - 100 BPM",
        level: "warning",
        color: "#f59e0b",
        adviceHi: "पल्स 55 से कम है। यदि चक्कर या कमजोरी लगे तो तुरंत बैठ जाएं।",
        adviceEn: "Heart rate is below standard resting baseline (55 BPM)."
      });
    }

    // 2. Blood Oxygen Evaluation
    if (liveReadings.spo2 < 90) {
      severity = "critical";
      issues.push({
        metric: "SpO2 Oxygen",
        badge: lang === "hi" ? "गंभीर कम ऑक्सीजन" : "Critical Low SpO2",
        title: lang === "hi" ? "गंभीर हाइपोक्सिया (Critical Low Oxygen)" : "Severe Hypoxemia (<90% SpO2)",
        val: `${liveReadings.spo2}%`,
        target: "95% - 100%",
        level: "critical",
        color: "#ef4444",
        adviceHi: "खून में ऑक्सीजन 90% से नीचे है। फेफड़ों तक पर्याप्त ऑक्सीजन नहीं पहुंच रही है। तुरंत ताजी हवा लें या डॉक्टर से संपर्क करें।",
        adviceEn: "Blood oxygen is critically below 90%. Seek prompt medical attention or oxygen support."
      });
    } else if (liveReadings.spo2 < 94) {
      if (severity !== "critical") severity = "warning";
      issues.push({
        metric: "SpO2 Oxygen",
        badge: lang === "hi" ? "कम ऑक्सीजन" : "Low SpO2",
        title: lang === "hi" ? "कम ऑक्सीजन स्तर (Mild Hypoxemia)" : "Low Blood Oxygen (<94% SpO2)",
        val: `${liveReadings.spo2}%`,
        target: "95% - 100%",
        level: "warning",
        color: "#f59e0b",
        adviceHi: "ऑक्सीजन 94% से कम है। गहरी सांसें लें और खुली हवा में बैठें।",
        adviceEn: "Blood oxygen has dipped below the optimal 94% healthy threshold."
      });
    }

    // 3. Blood Pressure Evaluation
    if (liveReadings.systolicBP >= 148 || liveReadings.diastolicBP >= 94) {
      severity = "critical";
      issues.push({
        metric: "Blood Pressure",
        badge: lang === "hi" ? "स्टेज 2 हाई बीपी" : "Stage 2 Crisis",
        title: lang === "hi" ? "स्टेज 2 उच्च रक्तचाप (Hypertensive Spike)" : "Stage 2 Hypertension Spike",
        val: `${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg`,
        target: "< 120/80 mmHg",
        level: "critical",
        color: "#ef4444",
        adviceHi: "रक्तचाप गंभीर रूप से बढ़ा हुआ है। सिरदर्द या सीने में भारीपन हो तो तुरंत डॉक्टर से संपर्क करें।",
        adviceEn: "Blood pressure is critically elevated into Stage 2 hypertension territory."
      });
    } else if (liveReadings.systolicBP >= 135 || liveReadings.diastolicBP >= 88) {
      if (severity !== "critical") severity = "warning";
      issues.push({
        metric: "Blood Pressure",
        badge: lang === "hi" ? "बढ़ा हुआ बीपी" : "Pre-Hypertension",
        title: lang === "hi" ? "बढ़ा हुआ बीपी (Pre-Hypertension)" : "Elevated Blood Pressure",
        val: `${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg`,
        target: "< 120/80 mmHg",
        level: "warning",
        color: "#f59e0b",
        adviceHi: "बीपी सामान्य से थोड़ा अधिक है। पानी पिएं और तनाव कम करें।",
        adviceEn: "Blood pressure is moderately elevated above optimal baseline."
      });
    }

    return {
      hasAnomaly: issues.length > 0,
      severity,
      issues
    };
  })();

  // ── Auto-chime siren when anomaly is newly detected ─────────────────────────
  useEffect(() => {
    if (anomalyStatus.hasAnomaly && isSoundAlertEnabled) {
      const now = Date.now();
      if (now - lastAlertSoundTimeRef.current > 14000) {
        lastAlertSoundTimeRef.current = now;
        playMedicalAlertSound();
      }
    }
  }, [anomalyStatus.hasAnomaly, isSoundAlertEnabled]);

  // ── Interactive Telemetry Scenarios (Live Testing for Judges) ─────────────
  const handleSelectScenario = (scenarioKey) => {
    setActiveScenario(scenarioKey);
    if (scenarioKey === "normal") {
      setIsSimulatingAbnormal(false);
      setLiveReadings((prev) => ({
        ...prev,
        heartRate: 74,
        systolicBP: 120,
        diastolicBP: 80,
        spo2: 98,
        stressLevel: 22
      }));
      showToast(lang === "hi" ? "रीडिंग सामान्य (74 BPM, 120/80) रीसेट की गई" : "Vitals reset to Normal Resting Baseline");
    } else if (scenarioKey === "tachycardia") {
      setIsSimulatingAbnormal(true);
      setLiveReadings((prev) => ({
        ...prev,
        heartRate: 136,
        systolicBP: 138,
        diastolicBP: 88,
        spo2: 95,
        stressLevel: 82
      }));
      setIsAnomalyModalOpen(true);
      showToast(lang === "hi" ? "⚠️ Tachycardia Anomaly Detected (136 BPM)!" : "⚠️ Tachycardia Anomaly Detected (136 BPM)!");
    } else if (scenarioKey === "hypoxemia") {
      setIsSimulatingAbnormal(true);
      setLiveReadings((prev) => ({
        ...prev,
        heartRate: 106,
        systolicBP: 126,
        diastolicBP: 82,
        spo2: 89,
        stressLevel: 72
      }));
      setIsAnomalyModalOpen(true);
      showToast(lang === "hi" ? "⚠️ Low Blood Oxygen Anomaly (89% SpO2)!" : "⚠️ Low Blood Oxygen Anomaly (89% SpO2)!");
    } else if (scenarioKey === "hypertension") {
      setIsSimulatingAbnormal(true);
      setLiveReadings((prev) => ({
        ...prev,
        heartRate: 94,
        systolicBP: 154,
        diastolicBP: 98,
        spo2: 97,
        stressLevel: 78
      }));
      setIsAnomalyModalOpen(true);
      showToast(lang === "hi" ? "⚠️ Stage 2 Hypertension Spike (154/98 mmHg)!" : "⚠️ Stage 2 Hypertension Spike (154/98 mmHg)!");
    } else if (scenarioKey === "exercise") {
      setIsSimulatingAbnormal(false);
      setLiveReadings((prev) => ({
        ...prev,
        heartRate: 118,
        systolicBP: 132,
        diastolicBP: 82,
        spo2: 98,
        stressLevel: 42
      }));
      showToast(lang === "hi" ? "कार्डियो वर्कआउट सिम्युलेट किया गया (118 BPM)" : "Cardio Workout simulated (118 BPM)");
    }
  };

  // ── Dispatch Immediate Emergency WhatsApp Alert ────────────────────────────
  const handleShareWhatsAppAlert = () => {
    const pName = patient?.name || "Patient";
    const blood = patient?.bloodGroup || "O+";
    const contactName = patient?.emergencyContacts?.[0]?.name || "Family Member";
    const contactPhone = patient?.emergencyContacts?.[0]?.phone || "112";

    const issuesText = anomalyStatus.issues.map(i => `• ${i.title}: *${i.val}* (Safe: ${i.target})`).join("%0A");

    const msg = `🚨 *URGENT MEDICAL TELEMETRY ALERT - PulseAI*%0A%0A*Patient:* ${encodeURIComponent(pName)}%0A*Blood Group:* ${encodeURIComponent(blood)}%0A*Emergency Contact:* ${encodeURIComponent(contactName)} (${encodeURIComponent(contactPhone)})%0A%0A*Smartwatch Abnormal Telemetry:*%0A${issuesText}%0A%0A*Patient Diagnosed Conditions:*%0A• ${encodeURIComponent(patient?.conditions?.map(c => typeof c === 'string' ? c : c.name).join(', ') || 'Hypertension, Type 2 Diabetes')}%0A%0A⚠️ *Automated Action:* Telemetry has breached clinical safety limits. Please check immediately or dispatch Emergency 112.`;

    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
    showToast(lang === "hi" ? "व्हाट्सएप इमरजेंसी अलर्ट तैयार किया गया!" : "WhatsApp emergency alert dispatched!");
  };

  // ── Real-time subtle heartbeat fluctuations (natural bio-rhythm) ───────────
  useEffect(() => {
    if (!device.isConnected || isMeasuring) return;

    const interval = setInterval(() => {
      setLiveReadings((prev) => {
        if (isSimulatingAbnormal) {
          // Subtle variance around anomaly
          const deltaBpm = (Math.random() * 4 - 2);
          return {
            ...prev,
            heartRate: Math.min(142, Math.max(126, Math.round(prev.heartRate + deltaBpm))),
            steps: prev.steps + (Math.random() > 0.8 ? 1 : 0)
          };
        }

        // Realistic normal baseline fluctuation
        const deltaBpm = (Math.random() * 2 - 1);
        const nextBpm = Math.min(78, Math.max(71, Math.round(prev.heartRate + deltaBpm)));
        return {
          ...prev,
          heartRate: nextBpm,
          steps: prev.steps + (Math.random() > 0.7 ? 2 : 0)
        };
      });
      setSyncTimeText(lang === "hi" ? "अभी-अभी (लाइव)" : "Live (Just now)");
    }, 2800);

    return () => clearInterval(interval);
  }, [device.isConnected, isMeasuring, isSimulatingAbnormal, lang]);

  // ── Real-time Glowing ECG Canvas Animation (P-Q-R-S-T wave simulator) ──────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 130);

    let offset = 0;

    const isAbnormalActive = anomalyStatus.hasAnomaly;

    const generateWaveValue = (x) => {
      const cycle = (x % 100);
      const mid = height / 2;

      // Flat isoelectric baseline
      if (cycle < 20) return mid;
      // P wave
      if (cycle < 35) return mid - Math.sin(((cycle - 20) / 15) * Math.PI) * 10;
      // PR segment
      if (cycle < 45) return mid;
      // Q dip
      if (cycle < 48) return mid + 8;
      // R spike (peak ventricular depolarization)
      if (cycle < 53) return mid - (isAbnormalActive ? 48 : 38);
      // S dip
      if (cycle < 57) return mid + 14;
      // ST segment
      if (cycle < 68) return mid;
      // T wave
      if (cycle < 85) return mid - Math.sin(((cycle - 68) / 17) * Math.PI) * 14;
      // Baseline to end
      return mid;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint medical grid
      ctx.strokeStyle = isAbnormalActive ? "rgba(239, 68, 68, 0.12)" : "rgba(14, 165, 233, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!device.isConnected) {
        // Flatline if disconnected
        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      // Draw live ECG curve with glowing telemetry accent
      const waveColor = isAbnormalActive 
        ? (anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b") 
        : "#38bdf8";
      const glowColor = isAbnormalActive 
        ? (anomalyStatus.severity === "critical" ? "rgba(239, 68, 68, 0.8)" : "rgba(245, 158, 11, 0.8)") 
        : "rgba(56, 189, 248, 0.6)";

      ctx.shadowBlur = isAbnormalActive ? 14 : 10;
      ctx.shadowColor = glowColor;
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const waveY = generateWaveValue(x + offset);
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Sweep head dot
      const sweepX = (offset * 1.5) % width;
      ctx.fillStyle = waveColor;
      ctx.beginPath();
      ctx.arc(sweepX, generateWaveValue(sweepX + offset), 4.5, 0, Math.PI * 2);
      ctx.fill();

      offset += isAbnormalActive ? 3.8 : 2;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [device.isConnected, anomalyStatus.hasAnomaly, anomalyStatus.severity]);

  // ── Trigger Instant Sensor Measurement (Countdown Simulation) ─────────────
  const handleMeasureNow = () => {
    if (!device.isConnected) {
      showToast(lang === "hi" ? "कृपया पहले स्मार्ट वॉच कनेक्ट करें!" : "Please connect your smartwatch first!");
      return;
    }
    setIsMeasuring(true);
    setMeasureCountdown(3);

    const timer = setInterval(() => {
      setMeasureCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsMeasuring(false);
          // Generate fresh updated reading
          const newBpm = Math.round(72 + Math.random() * 5);
          const newSys = Math.round(118 + Math.random() * 6);
          const newDia = Math.round(78 + Math.random() * 4);
          setLiveReadings((r) => ({
            ...r,
            heartRate: newBpm,
            systolicBP: newSys,
            diastolicBP: newDia,
            spo2: 99
          }));
          showToast(
            lang === "hi"
              ? `ताजा रीडिंग सफल: दिल की धड़कन ${newBpm} BPM, बीपी ${newSys}/${newDia} mmHg`
              : `Measurement complete: Pulse ${newBpm} BPM, BP ${newSys}/${newDia} mmHg`
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Sync Watch Data Directly to Patient Vitals History ─────────────────────
  const handleSyncToRecords = () => {
    if (!device.isConnected) return;

    if (onUpdateVitals) {
      // Push heart rate and BP vital entries
      onUpdateVitals({
        type: "Blood Pressure",
        systolic: liveReadings.systolicBP,
        diastolic: liveReadings.diastolicBP,
        unit: "mmHg",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        notes: `Auto-synced from ${device.name}`
      });

      onUpdateVitals({
        type: "Heart Rate",
        value: liveReadings.heartRate,
        unit: "BPM",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        notes: `Live optical sensor sync from ${device.name}`
      });
    }

    showToast(
      lang === "hi"
        ? "✅ स्मार्ट वॉच का सारा डेटा विटल्स और रिकॉर्ड्स में सेव हो गया!"
        : "✅ Smartwatch vitals synced successfully into your health record!"
    );
  };

  // ── Device Library & Connection Options ────────────────────────────────────
  const AVAILABLE_DEVICES = [
    {
      id: "dev_apple_watch",
      name: "Apple Watch Series 9 (Midnight 45mm)",
      brand: "Apple",
      type: "Smartwatch",
      battery: 86,
      firmware: "watchOS 10.4.1"
    },
    {
      id: "dev_samsung",
      name: "Samsung Galaxy Watch 6 (44mm Bluetooth)",
      brand: "Samsung",
      type: "Smartwatch",
      battery: 92,
      firmware: "WearOS 4.0"
    },
    {
      id: "dev_noise",
      name: "Noise ColorFit Ultra 3 (AMOLED Display)",
      brand: "Noise",
      type: "Smart Fitness Watch",
      battery: 78,
      firmware: "v2.1.0"
    },
    {
      id: "dev_boat",
      name: "boAt Wave Call 2 Health Band",
      brand: "boAt",
      type: "Fitness Tracker",
      battery: 64,
      firmware: "v1.8.4"
    },
    {
      id: "dev_fitbit",
      name: "Fitbit Charge 6 (ECG + SpO2 Sensor)",
      brand: "Fitbit / Google",
      type: "Health Band",
      battery: 89,
      firmware: "FitbitOS 6.2"
    }
  ];

  const handleSelectDevice = (selected) => {
    setIsScanning(true);
    setTimeout(() => {
      setDevice({
        ...selected,
        isConnected: true,
        bluetoothAddress: "7A:B4:9C:" + Math.floor(10 + Math.random() * 89) + ":DF:" + Math.floor(10 + Math.random() * 89),
        signalStrength: "Strong",
        lastSync: "Just now"
      });
      setIsScanning(false);
      setIsDeviceModalOpen(false);
      showToast(lang === "hi" ? `${selected.name} सफलतापूर्वक कनेक्ट हो गई!` : `${selected.name} successfully paired & connected!`);
    }, 1400);
  };

  const handleToggleConnection = () => {
    if (device.isConnected) {
      setDevice((d) => ({ ...d, isConnected: false }));
      showToast(lang === "hi" ? "स्मार्ट वॉच डिस्कनेक्ट की गई।" : "Smartwatch disconnected.");
    } else {
      setIsScanning(true);
      setTimeout(() => {
        setDevice((d) => ({ ...d, isConnected: true }));
        setIsScanning(false);
        showToast(lang === "hi" ? "स्मार्ट वॉच दोबारा कनेक्ट हो गई!" : "Smartwatch reconnected!");
      }, 1000);
    }
  };

  // Real Web Bluetooth API Scan (Supported in Chrome/Edge)
  const handleRealBluetoothScan = async () => {
    if (!navigator.bluetooth) {
      showToast(
        lang === "hi"
          ? "ब्राउज़र ब्लूटूथ एपीआई उपलब्ध नहीं है, सिमुलेटर डिवाइस इस्तेमाल हो रहा है।"
          : "Web Bluetooth not available in this browser. Using smart simulator."
      );
      setIsDeviceModalOpen(true);
      return;
    }

    try {
      showToast(lang === "hi" ? "आस-पास के ब्लूटूथ डिवाइस ढूंढे जा रहे हैं..." : "Searching for nearby Bluetooth health devices...");
      const btDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["heart_rate", "battery_service"]
      });

      if (btDevice) {
        setDevice({
          id: `dev_${Date.now()}`,
          name: btDevice.name || "Bluetooth Health Band",
          brand: "BLE Device",
          type: "Smart Wearable",
          battery: 85,
          isConnected: true,
          bluetoothAddress: btDevice.id || "BLE:PAIRED",
          signalStrength: "Excellent",
          firmware: "BLE 5.2",
          lastSync: "Just now"
        });
        showToast(lang === "hi" ? `${btDevice.name || "डिवाइस"} कनेक्ट हो गई!` : `${btDevice.name || "Device"} paired!`);
      }
    } catch (err) {
      console.warn("Bluetooth pair cancelled or error:", err);
      setIsDeviceModalOpen(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* ── Toast Notification ── */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "28px",
            zIndex: 9999,
            background: "var(--bg-elevated)",
            border: "1px solid var(--primary)",
            padding: "10px 18px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "var(--text-highlight)",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <CheckCircle2 size={18} color="var(--primary)" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── 1. Top Header Banner & Controls ── */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 28px",
          background: "linear-gradient(135deg, var(--primary-soft), var(--bg-card))",
          border: "1px solid var(--primary-border)",
          borderRadius: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)"
                }}
              >
                <Watch size={22} color="#ffffff" />
              </div>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                  {lang === "hi" ? "स्मार्ट वॉच व डिवाइसेज" : "Smart Watch & Devices"}
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "4px 0 0 0" }}>
                  {lang === "hi"
                    ? `${patient?.name ? patient.name + " के लिए " : ""}अपनी स्मार्ट वॉच को कनेक्ट करें और बीपी, पल्स व दिल की धड़कन का लाइव डेटा आसान भाषा में देखें।`
                    : `Live telemetry for ${patient?.name || "Patient"} — pair your smartwatch to monitor real-time Blood Pressure, Pulse, SpO2 & Heart Rate.`}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleMeasureNow}
              disabled={isMeasuring || !device.isConnected}
              className="btn btn-secondary"
              style={{
                height: "42px",
                padding: "0 16px",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px"
              }}
              title={lang === "hi" ? "सेंसर से ताजा माप लें" : "Take live reading from watch sensors"}
            >
              <RefreshCw size={16} className={isMeasuring ? "spin" : ""} color="var(--primary)" />
              <span>{isMeasuring ? `${lang === "hi" ? "माप रहे हैं..." : "Reading..."} (${measureCountdown}s)` : lang === "hi" ? "अभी मापें" : "Measure Now"}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncToRecords}
              disabled={!device.isConnected}
              className="btn btn-primary"
              style={{
                height: "42px",
                padding: "0 18px",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px"
              }}
              title={lang === "hi" ? "आज के विटल्स रिकॉर्ड में सिंक करें" : "Save watch readings to health records"}
            >
              <Activity size={16} />
              <span>{lang === "hi" ? "रिकॉर्ड में सिंक करें" : "Sync to Vitals"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeviceModalOpen(true)}
              className="btn btn-secondary"
              style={{
                height: "42px",
                padding: "0 16px",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px"
              }}
              title={lang === "hi" ? "वॉच बदलें या नई जोड़ें" : "Switch or pair another watch"}
            >
              <Bluetooth size={16} color="var(--primary)" />
              <span>{lang === "hi" ? "डिवाइस बदलें" : "Switch Watch"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Device Status Card (Battery, Signal, Pairing Info) ── */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: device.isConnected ? "var(--primary-soft)" : "rgba(239, 68, 68, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px solid ${device.isConnected ? "var(--primary)" : "rgba(239, 68, 68, 0.3)"}`
            }}
          >
            <Watch size={28} color={device.isConnected ? "var(--primary)" : "#ef4444"} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "var(--text-highlight)" }}>
                {device.name}
              </h3>
              <span className={`badge ${device.isConnected ? "badge-good" : "badge-crit"}`} style={{ fontSize: "0.75rem" }}>
                {device.isConnected ? (lang === "hi" ? "● लाइव कनेक्टेड" : "● Live Connected") : (lang === "hi" ? "डिसकनेक्टेड" : "Disconnected")}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", flexWrap: "wrap" }}>
              <span>Brand: <strong>{device.brand}</strong></span>
              <span>• MAC: <code>{device.bluetoothAddress}</code></span>
              <span>• OS: {device.firmware}</span>
              <span>• {lang === "hi" ? "सिंक:" : "Sync:"} <strong>{syncTimeText}</strong></span>
            </div>
          </div>
        </div>

        {/* Battery & Quick Disconnect */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--bg-elevated)",
              padding: "6px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
              fontSize: "0.84rem",
              fontWeight: 700
            }}
          >
            <Battery size={16} color="#10b981" />
            <span>{device.battery}% Battery</span>
          </div>

          <button
            type="button"
            onClick={handleToggleConnection}
            className="btn btn-secondary"
            style={{
              height: "36px",
              padding: "0 12px",
              fontSize: "0.82rem",
              color: device.isConnected ? "#ef4444" : "var(--primary)"
            }}
          >
            {device.isConnected ? (lang === "hi" ? "डिस्कनेक्ट करें" : "Disconnect") : (lang === "hi" ? "पुनः कनेक्ट करें" : "Reconnect")}
          </button>
        </div>
      </div>

      {/* ── 3A. Interactive AI Telemetry Demo Control Strip (For Judges & Live Testing) ── */}
      <div
        className="glass-panel"
        style={{
          padding: "12px 18px",
          borderRadius: "14px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem", fontWeight: 700, color: "var(--text-main)" }}>
          <Sparkles size={16} color="var(--primary)" />
          <span>{lang === "hi" ? "लाइव एआई टेलीमेट्री टेस्ट (Live Scenarios):" : "AI Live Telemetry Simulation & Testing:"}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleSelectScenario("normal")}
            className="btn btn-secondary"
            style={{
              padding: "5px 11px",
              fontSize: "0.76rem",
              height: "30px",
              borderColor: activeScenario === "normal" ? "#10b981" : undefined,
              background: activeScenario === "normal" ? "rgba(16, 185, 129, 0.15)" : undefined,
              color: activeScenario === "normal" ? "#10b981" : undefined,
              fontWeight: 700
            }}
          >
            ✅ {lang === "hi" ? "सामान्य (Normal 74)" : "Normal (74 BPM)"}
          </button>

          <button
            onClick={() => handleSelectScenario("tachycardia")}
            className="btn btn-secondary"
            style={{
              padding: "5px 11px",
              fontSize: "0.76rem",
              height: "30px",
              borderColor: activeScenario === "tachycardia" ? "#ef4444" : undefined,
              background: activeScenario === "tachycardia" ? "rgba(239, 68, 68, 0.15)" : undefined,
              color: activeScenario === "tachycardia" ? "#ef4444" : undefined,
              fontWeight: 700
            }}
          >
            ⚡ {lang === "hi" ? "टैचीकार्डिया (136 BPM)" : "Tachycardia (136 BPM)"}
          </button>

          <button
            onClick={() => handleSelectScenario("hypoxemia")}
            className="btn btn-secondary"
            style={{
              padding: "5px 11px",
              fontSize: "0.76rem",
              height: "30px",
              borderColor: activeScenario === "hypoxemia" ? "#0284c7" : undefined,
              background: activeScenario === "hypoxemia" ? "rgba(2, 132, 199, 0.15)" : undefined,
              color: activeScenario === "hypoxemia" ? "#0284c7" : undefined,
              fontWeight: 700
            }}
          >
            🫁 {lang === "hi" ? "कम ऑक्सीजन (89%)" : "Low SpO2 (89%)"}
          </button>

          <button
            onClick={() => handleSelectScenario("hypertension")}
            className="btn btn-secondary"
            style={{
              padding: "5px 11px",
              fontSize: "0.76rem",
              height: "30px",
              borderColor: activeScenario === "hypertension" ? "#f59e0b" : undefined,
              background: activeScenario === "hypertension" ? "rgba(245, 158, 11, 0.15)" : undefined,
              color: activeScenario === "hypertension" ? "#f59e0b" : undefined,
              fontWeight: 700
            }}
          >
            🩸 {lang === "hi" ? "हाई बीपी (154/98)" : "High BP (154/98)"}
          </button>

          <button
            onClick={() => handleSelectScenario("exercise")}
            className="btn btn-secondary"
            style={{
              padding: "5px 11px",
              fontSize: "0.76rem",
              height: "30px",
              borderColor: activeScenario === "exercise" ? "#8b5cf6" : undefined,
              background: activeScenario === "exercise" ? "rgba(139, 92, 246, 0.15)" : undefined,
              color: activeScenario === "exercise" ? "#8b5cf6" : undefined,
              fontWeight: 700
            }}
          >
            🏃 {lang === "hi" ? "वर्कआउट (118 BPM)" : "Workout (118 BPM)"}
          </button>

          {/* Sound alert chime toggle */}
          <button
            onClick={() => setIsSoundAlertEnabled(!isSoundAlertEnabled)}
            className="btn btn-secondary"
            title={isSoundAlertEnabled ? (lang === "hi" ? "साउंड अलर्ट म्यूट करें" : "Mute Sound Alert") : (lang === "hi" ? "साउंड अलर्ट चालू करें" : "Enable Sound Alert")}
            style={{
              padding: "5px 9px",
              fontSize: "0.76rem",
              height: "30px",
              color: isSoundAlertEnabled ? "#10b981" : "var(--text-muted)"
            }}
          >
            {isSoundAlertEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </div>

      {/* ── 3B. Active Clinical Anomaly Alert Banner ── */}
      {anomalyStatus.hasAnomaly && (
        <div
          style={{
            background: anomalyStatus.severity === "critical"
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.18), var(--bg-card))"
              : "linear-gradient(135deg, rgba(245, 158, 11, 0.15), var(--bg-card))",
            border: `2px solid ${anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b"}`,
            padding: "16px 20px",
            borderRadius: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            boxShadow: anomalyStatus.severity === "critical"
              ? "0 0 24px rgba(239, 68, 68, 0.25)"
              : "0 0 20px rgba(245, 158, 11, 0.2)",
            animation: "pulse 2s infinite"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: anomalyStatus.severity === "critical" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <AlertTriangle size={26} color={anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b"} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 900,
                    color: anomalyStatus.severity === "critical" ? "#dc2626" : "#d97706"
                  }}
                >
                  {anomalyStatus.summary}
                </span>
                <span
                  className={`badge ${anomalyStatus.severity === "critical" ? "badge-crit" : "badge-warn"}`}
                  style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                >
                  {anomalyStatus.severity === "critical" ? "🚨 IMMEDIATE ACTION" : "⚠️ MONITOR CLOSELY"}
                </span>
              </div>

              <div style={{ fontSize: "0.84rem", color: "var(--text-main)", marginTop: "3px" }}>
                {anomalyStatus.clinicalNotes}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
                {anomalyStatus.issues.map((iss, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(0,0,0,0.25)",
                      color: anomalyStatus.severity === "critical" ? "#fca5a5" : "#fcd34d"
                    }}
                  >
                    • {iss.title}: {iss.val} (Safe: {iss.target})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setIsAnomalyModalOpen(true)}
              className="btn btn-primary"
              style={{
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
                borderColor: "#0284c7",
                fontSize: "0.82rem",
                padding: "8px 14px"
              }}
            >
              <ShieldAlert size={15} />
              <span>{lang === "hi" ? "AI क्लीनिकल असेसमेंट" : "AI Assessment"}</span>
            </button>

            <button
              onClick={handleShareWhatsAppAlert}
              className="btn btn-secondary"
              title={lang === "hi" ? "व्हाट्सएप पर परिवार / डॉक्टर को भेजें" : "Dispatch WhatsApp Emergency Alert"}
              style={{
                fontSize: "0.82rem",
                padding: "8px 12px",
                borderColor: "#22c55e",
                color: "#22c55e"
              }}
            >
              <Share2 size={15} />
              <span>{lang === "hi" ? "व्हाट्सएप अलर्ट" : "WhatsApp"}</span>
            </button>

            <button
              onClick={() => (onOpenEmergency ? onOpenEmergency() : window.open("tel:112"))}
              className="btn btn-primary"
              style={{
                background: "#ef4444",
                borderColor: "#dc2626",
                fontSize: "0.82rem",
                padding: "8px 14px"
              }}
            >
              <PhoneCall size={15} />
              <span>{lang === "hi" ? "इमरजेंसी 112" : "Call 112"}</span>
            </button>

            <button
              onClick={() => handleSelectScenario("normal")}
              className="btn btn-secondary"
              style={{ fontSize: "0.8rem", padding: "8px 12px" }}
            >
              {lang === "hi" ? "अलर्ट रीसेट" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Real-time Glowing ECG Rhythm Monitor ── */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Activity size={20} color={anomalyStatus.hasAnomaly ? (anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b") : "var(--primary)"} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
              {lang === "hi" ? "लाइव पल्स वेव व ईसीजी (Live ECG Rhythm Wave)" : "Live Pulse Wave & ECG Rhythm"}
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: anomalyStatus.hasAnomaly ? (anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b") : "var(--status-good-text)", fontWeight: 700 }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: anomalyStatus.hasAnomaly ? "#ef4444" : "#10b981", animation: "ping 1.5s infinite" }} />
              {anomalyStatus.hasAnomaly ? (lang === "hi" ? "असामान्य गति (Arrhythmia / Elevated)" : "Arrhythmia / Elevated Wave") : (lang === "hi" ? "सामान्य ताल (Normal Sinus Rhythm)" : "Normal Sinus Rhythm")}
            </span>
            <span style={{ color: "var(--text-muted)" }}>| 25mm/s • 10mm/mV</span>
          </div>
        </div>

        {/* ECG Wave Canvas */}
        <div
          style={{
            width: "100%",
            height: "120px",
            background: "#030712",
            borderRadius: "12px",
            border: "1px solid rgba(14, 165, 233, 0.2)",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      </div>

      {/* ── 5. Core Live Health Metrics (Dynamic Clinical Cards) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
        
        {/* Metric 1: Heart Rate / Pulse */}
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: liveReadings.heartRate > 100 || liveReadings.heartRate < 55 ? "1px solid #ef4444" : "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "border-color 0.2s ease"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: liveReadings.heartRate > 100 ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={20} color="#ef4444" style={{ animation: liveReadings.heartRate > 100 ? "pulse 0.6s infinite" : "pulse 1.2s infinite" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {lang === "hi" ? "दिल की धड़कन (Heart Rate)" : "Heart Rate (Pulse)"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: liveReadings.heartRate > 100 ? "#ef4444" : "var(--text-highlight)", lineHeight: 1.1, marginTop: "2px" }}>
                  {liveReadings.heartRate} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>BPM</span>
                </div>
              </div>
            </div>

            <span
              className={`badge ${
                liveReadings.heartRate > 120 || liveReadings.heartRate < 55
                  ? "badge-crit"
                  : liveReadings.heartRate > 100
                  ? "badge-warn"
                  : "badge-good"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              {liveReadings.heartRate > 120
                ? (lang === "hi" ? "टैचीकार्डिया (>120)" : "Tachycardia (>120)")
                : liveReadings.heartRate > 100
                ? (lang === "hi" ? "तेज धड़कन (>100)" : "Elevated (>100)")
                : liveReadings.heartRate < 55
                ? (lang === "hi" ? "धीमी धड़कन (<55)" : "Bradycardia (<55)")
                : (lang === "hi" ? "सामान्य (60-100)" : "Normal (60-100)")}
            </span>
          </div>

          <div style={{ background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            {liveReadings.heartRate > 100 ? (
              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                ⚠️ {lang === "hi"
                  ? "पल्स सामान्य से तेज है। तुरंत शांत होकर बैठें, पानी पिएं और गहरी सांसें लें।"
                  : "Heart rate is elevated. Sit upright, rest quietly, breathe slowly, and avoid exertion."}
              </span>
            ) : liveReadings.heartRate < 55 ? (
              <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                ⚠️ {lang === "hi"
                  ? "पल्स सामान्य से धीमी है। चक्कर या कमजोरी महसूस हो तो तुरंत बैठें।"
                  : "Pulse is low (bradycardia). Monitor for any lightheadedness or fatigue."}
              </span>
            ) : (
              <span>
                💡 {lang === "hi"
                  ? "आपका दिल सुरक्षित और स्वस्थ गति से धड़क रहा है। आराम के समय 60 से 100 BPM बिल्कुल सामान्य होता है।"
                  : "Your heart is beating at a healthy, safe resting pace. Normal range is 60 to 100 BPM."}
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Blood Pressure */}
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: liveReadings.systolicBP >= 140 || liveReadings.diastolicBP >= 90 ? "1px solid #ef4444" : "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "border-color 0.2s ease"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: liveReadings.systolicBP >= 140 ? "rgba(239, 68, 68, 0.15)" : "var(--primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={20} color={liveReadings.systolicBP >= 140 ? "#ef4444" : "var(--primary)"} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {lang === "hi" ? "रक्तचाप (Blood Pressure)" : "Blood Pressure (BP)"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: liveReadings.systolicBP >= 140 ? "#ef4444" : "var(--text-highlight)", lineHeight: 1.1, marginTop: "2px" }}>
                  {liveReadings.systolicBP}/{liveReadings.diastolicBP} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>mmHg</span>
                </div>
              </div>
            </div>

            <span
              className={`badge ${
                liveReadings.systolicBP >= 140 || liveReadings.diastolicBP >= 90
                  ? "badge-crit"
                  : liveReadings.systolicBP >= 130 || liveReadings.diastolicBP >= 85
                  ? "badge-warn"
                  : "badge-good"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              {liveReadings.systolicBP >= 140 || liveReadings.diastolicBP >= 90
                ? (lang === "hi" ? "स्टेज 2 हाइपरटेंशन" : "Stage 2 High BP")
                : liveReadings.systolicBP >= 130 || liveReadings.diastolicBP >= 85
                ? (lang === "hi" ? "बढ़ा हुआ (Elevated)" : "Elevated BP")
                : (lang === "hi" ? "उत्तम (Optimal)" : "Optimal (<120/80)")}
            </span>
          </div>

          <div style={{ background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            {liveReadings.systolicBP >= 140 || liveReadings.diastolicBP >= 90 ? (
              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                ⚠️ {lang === "hi"
                  ? `बीपी बढ़ा हुआ है (${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg)। तनाव न लें, 5 मिनट शांत बैठें और बीपी पुनः चेक करें।`
                  : `Blood pressure spike detected (${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg). Rest quietly and recheck in 5 minutes.`}
              </span>
            ) : (
              <span>
                💡 {lang === "hi"
                  ? `ऊपर का बीपी ${liveReadings.systolicBP} और नीचे का ${liveReadings.diastolicBP} है। दोनों सुरक्षित दायरे में हैं।`
                  : `Systolic (${liveReadings.systolicBP}) and Diastolic (${liveReadings.diastolicBP}) are within safe clinical bounds.`}
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Blood Oxygen (SpO2) */}
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: liveReadings.spo2 < 94 ? "1px solid #ef4444" : "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "border-color 0.2s ease"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: liveReadings.spo2 < 94 ? "rgba(239, 68, 68, 0.15)" : "rgba(56, 189, 248, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Droplet size={20} color={liveReadings.spo2 < 94 ? "#ef4444" : "#0284c7"} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {lang === "hi" ? "ऑक्सीजन स्तर (Blood Oxygen)" : "Blood Oxygen (SpO2)"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: liveReadings.spo2 < 94 ? "#ef4444" : "var(--text-highlight)", lineHeight: 1.1, marginTop: "2px" }}>
                  {liveReadings.spo2}%
                </div>
              </div>
            </div>

            <span
              className={`badge ${
                liveReadings.spo2 < 90
                  ? "badge-crit"
                  : liveReadings.spo2 < 95
                  ? "badge-warn"
                  : "badge-good"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              {liveReadings.spo2 < 90
                ? (lang === "hi" ? "गंभीर हाइपोक्सिमिया" : "Severe Low (<90%)")
                : liveReadings.spo2 < 95
                ? (lang === "hi" ? "कम ऑक्सीजन" : "Low SpO2 (<95%)")
                : (lang === "hi" ? "स्वस्थ (95-100%)" : "Healthy (95-100%)")}
            </span>
          </div>

          <div style={{ background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            {liveReadings.spo2 < 95 ? (
              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                ⚠️ {lang === "hi"
                  ? `ऑक्सीजन स्तर (${liveReadings.spo2}%) सामान्य से कम है। खुली हवा में बैठें, गहरी सांस लें और जरूरत पड़ने पर तुरंत डॉक्टर से मिलें।`
                  : `Circulating SpO2 (${liveReadings.spo2}%) is below ideal levels. Sit upright, ensure good airflow, and breathe deeply.`}
              </span>
            ) : (
              <span>
                💡 {lang === "hi"
                  ? "खून में ऑक्सीजन पूरी तरह सही है। फेफड़ों का काम बिल्कुल ठीक चल रहा है।"
                  : "Circulating blood oxygen saturation is optimal, reflecting healthy lung function."}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. Lifestyle & Recovery Sensors (Steps, Sleep, Stress, Skin Temp) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
        
        {/* Steps */}
        <div className="glass-panel" style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {lang === "hi" ? "आज के कदम (Steps)" : "Daily Steps"}
            </span>
            <Flame size={17} color="#f97316" />
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, marginTop: "6px", color: "var(--text-highlight)" }}>
            {liveReadings.steps.toLocaleString()} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/ {liveReadings.stepGoal.toLocaleString()}</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "var(--bg-elevated)", borderRadius: "4px", marginTop: "10px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, (liveReadings.steps / liveReadings.stepGoal) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #f97316, #fb923c)" }} />
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "6px" }}>
            🔥 {liveReadings.calories} kcal • ⏱️ {liveReadings.activeMinutes} mins
          </div>
        </div>

        {/* Sleep */}
        <div className="glass-panel" style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {lang === "hi" ? "पिछली रात की नींद (Sleep)" : "Sleep Analysis"}
            </span>
            <Moon size={17} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, marginTop: "6px", color: "var(--text-highlight)" }}>
            {liveReadings.sleepDuration}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#8b5cf6", fontWeight: 700, marginTop: "8px" }}>
            Score: {liveReadings.sleepScore}/100 (Deep Restful Sleep)
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            🌙 {lang === "hi" ? "गहरी नींद:" : "Deep sleep:"} {liveReadings.deepSleep}
          </div>
        </div>

        {/* Stress & HRV */}
        <div className="glass-panel" style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {lang === "hi" ? "तनाव स्तर (Stress Level)" : "Stress Level"}
            </span>
            <Sparkles size={17} color="#10b981" />
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, marginTop: "6px", color: "#10b981" }}>
            {liveReadings.stressLevel} / 100
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--status-good-text)", fontWeight: 700, marginTop: "8px" }}>
            {lang === "hi" ? "शांत व तनाव-मुक्त (Relaxed)" : "Relaxed & Recovered"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            HRV (Heart Rate Variability): {liveReadings.hrv} ms
          </div>
        </div>

        {/* Skin Temperature */}
        <div className="glass-panel" style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {lang === "hi" ? "त्वचा का तापमान (Temp)" : "Skin Temperature"}
            </span>
            <Activity size={17} color="var(--primary)" />
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, marginTop: "6px", color: "var(--text-highlight)" }}>
            {liveReadings.skinTemp}°F
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--status-good-text)", fontWeight: 700, marginTop: "8px" }}>
            {lang === "hi" ? "सामान्य शारीरिक तापमान" : "Normal Body Baseline"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Sensor Variance: ±0.1°F
          </div>
        </div>
      </div>

      {/* ── 7. Ask AI Copilot & Interactive Demonstration Box ── */}
      <div
        className="glass-panel"
        style={{
          padding: "22px 26px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, var(--bg-card), var(--primary-soft))",
          border: "1px solid var(--primary-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px"
        }}
      >
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
            {lang === "hi" ? "एआई हेल्थ विश्लेषण" : "AI Copilot Integration"}
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "4px 0", color: "var(--text-highlight)" }}>
            {lang === "hi" ? "स्मार्ट वॉच डेटा पर AI से सलाह लें" : "Ask AI Copilot to Analyze Your Watch Readings"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.86rem", margin: "4px 0 0 0", maxWidth: "600px" }}>
            {lang === "hi"
              ? "क्या मेरी 74 BPM धड़कन और 122/80 BP मेरी दवाइयों के साथ ठीक है? एआई कोपायलट इसे सरल भाषा में समझाएगा।"
              : "Let our AI assistant cross-reference your live watch metrics with your medical history and prescription safety."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Demo toggle: Simulate High Heart Rate */}
          <button
            type="button"
            onClick={() => {
              setIsSimulatingAbnormal((prev) => !prev);
              showToast(
                !isSimulatingAbnormal
                  ? (lang === "hi" ? "⚠️ आपातकालीन अलर्ट सिम्युलेट किया गया (135 BPM)" : "⚠️ High heart rate alert triggered for demo")
                  : (lang === "hi" ? "वापस सामान्य रीडिंग रीसेट की गई" : "Reset back to normal vitals")
              );
            }}
            className="btn btn-secondary"
            style={{
              height: "42px",
              padding: "0 16px",
              fontSize: "0.85rem",
              borderRadius: "12px",
              color: isSimulatingAbnormal ? "#ef4444" : "var(--text-main)"
            }}
          >
            <AlertTriangle size={15} color={isSimulatingAbnormal ? "#ef4444" : "var(--primary)"} />
            <span>{isSimulatingAbnormal ? (lang === "hi" ? "रीडिंग नॉर्मल करें" : "Reset Normal") : (lang === "hi" ? "अलर्ट टेस्ट करें" : "Simulate Alert")}</span>
          </button>

          {onAskCopilot && (
            <button
              type="button"
              onClick={() =>
                onAskCopilot(
                  `My smartwatch is showing Heart Rate: ${liveReadings.heartRate} BPM, Blood Pressure: ${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg, and SpO2: ${liveReadings.spo2}%. Are these safe and what precautions should I follow?`
                )
              }
              className="btn btn-primary"
              style={{
                height: "42px",
                padding: "0 18px",
                fontSize: "0.88rem",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <MessageSquareHeart size={16} />
              <span>{lang === "hi" ? "AI से वॉच डेटा पूछें" : "Ask Copilot About Watch"}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 8. Switch / Pair Smartwatch Modal ── */}
      {isDeviceModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setIsDeviceModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "20px",
              padding: "26px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Bluetooth size={22} color="var(--primary)" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                  {lang === "hi" ? "स्मार्ट वॉच कनेक्ट करें" : "Pair a Smart Health Device"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDeviceModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "18px" }}>
              {lang === "hi"
                ? "नीचे दी गई लोकप्रिय स्मार्ट वॉच में से चुनें या अपने कंप्यूटर/फोन के ब्लूटूथ से कनेक्ट करें:"
                : "Select your smartwatch model from the verified list below or scan for nearby Bluetooth devices:"}
            </p>

            {/* Connecting Feedback Banner */}
            {isScanning && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", marginBottom: "12px", background: "var(--primary-soft)", borderRadius: "10px", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem" }}>
                <RefreshCw size={15} className="spin" />
                <span>{lang === "hi" ? "ब्लूटूथ डिवाइस से कनेक्ट हो रहा है..." : "Connecting & syncing device..."}</span>
              </div>
            )}

            {/* List of watches */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
              {AVAILABLE_DEVICES.map((d) => {
                const isCurrent = device.id === d.id && device.isConnected;
                return (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDevice(d)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: `1.5px solid ${isCurrent ? "var(--primary)" : "var(--border-color)"}`,
                      background: isCurrent ? "var(--primary-soft)" : "var(--bg-elevated)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Watch size={22} color={isCurrent ? "var(--primary)" : "var(--text-muted)"} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-highlight)" }}>
                          {d.name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {d.brand} • {d.type} • 🔋 {d.battery}%
                        </div>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="badge badge-good" style={{ fontSize: "0.74rem" }}>
                        <Check size={12} /> {lang === "hi" ? "कनेक्टेड" : "Connected"}
                      </span>
                    ) : (
                      <button className="btn btn-secondary" style={{ height: "32px", padding: "0 12px", fontSize: "0.8rem" }}>
                        {lang === "hi" ? "पेयर करें" : "Pair Device"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Real Web Bluetooth Scan Option */}
            <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <button
                type="button"
                onClick={handleRealBluetoothScan}
                className="btn btn-primary"
                style={{ width: "100%", height: "42px", borderRadius: "12px", fontSize: "0.9rem" }}
              >
                <Radio size={16} />
                <span>{lang === "hi" ? "आस-पास का ब्लूटूथ डिवाइस खोजें" : "Scan for Bluetooth Device"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. AI Live Anomaly Assessment Modal ── */}
      {isAnomalyModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={() => setIsAnomalyModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "var(--bg-card)",
              borderRadius: "20px",
              padding: "26px",
              border: `2px solid ${anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b"}`,
              boxShadow: anomalyStatus.severity === "critical"
                ? "0 20px 50px rgba(239, 68, 68, 0.3)"
                : "0 20px 50px rgba(245, 158, 11, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: anomalyStatus.severity === "critical" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <ShieldAlert size={26} color={anomalyStatus.severity === "critical" ? "#ef4444" : "#f59e0b"} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 900, margin: 0, color: "var(--text-highlight)" }}>
                      {lang === "hi" ? "एआई विटल्स विसंगति असेसमेंट" : "AI Clinical Anomaly Assessment"}
                    </h3>
                    <span
                      className={`badge ${anomalyStatus.severity === "critical" ? "badge-crit" : "badge-warn"}`}
                      style={{ fontSize: "0.72rem" }}
                    >
                      {anomalyStatus.severity === "critical" ? "CRITICAL TRIAGE" : "ELEVATED CONCERN"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {patient?.name ? `Patient: ${patient.name}` : "Patient"} • {device.name} • {syncTimeText}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAnomalyModalOpen(false)}
                className="btn btn-secondary"
                style={{ width: "32px", height: "32px", padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Deviation Metrics Table */}
            <div
              style={{
                background: "var(--bg-elevated)",
                borderRadius: "14px",
                padding: "16px",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-highlight)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Activity size={16} color="var(--primary)" />
                <span>{lang === "hi" ? "टेलीमेट्री विचलन (Telemetry Deviations):" : "Detected Telemetry Deviations:"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Heart Rate</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: liveReadings.heartRate > 100 || liveReadings.heartRate < 55 ? "#ef4444" : "var(--text-highlight)" }}>
                    {liveReadings.heartRate} <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>BPM</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: 60-100 BPM</div>
                </div>

                <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Blood Pressure</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: liveReadings.systolicBP >= 140 || liveReadings.diastolicBP >= 90 ? "#ef4444" : "var(--text-highlight)" }}>
                    {liveReadings.systolicBP}/{liveReadings.diastolicBP} <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>mmHg</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: &lt;120/80 mmHg</div>
                </div>

                <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Blood Oxygen (SpO2)</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: liveReadings.spo2 < 94 ? "#ef4444" : "var(--text-highlight)" }}>
                    {liveReadings.spo2}%
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: 95-100%</div>
                </div>
              </div>
            </div>

            {/* AI Clinical Diagnosis Context */}
            <div
              style={{
                background: anomalyStatus.severity === "critical" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)",
                border: `1px solid ${anomalyStatus.severity === "critical" ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ fontSize: "0.86rem", fontWeight: 800, color: anomalyStatus.severity === "critical" ? "#dc2626" : "#d97706", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} />
                <span>{lang === "hi" ? "मरीज के मेडिकल रिकॉर्ड के साथ एआई सहसंबंध:" : "PulseAI Clinical Record Correlation:"}</span>
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                {patient?.conditions && patient.conditions.length > 0 ? (
                  lang === "hi" ? (
                    <>
                      मरीज के पहले से दर्ज रोग <strong>({patient.conditions.map(c => typeof c === 'string' ? c : c.name).join(', ')})</strong> के आधार पर, यह रीडिंग हृदय और वैस्कुलर सिस्टम पर अत्यधिक दबाव का संकेत देती है। {anomalyStatus.clinicalNotes}
                    </>
                  ) : (
                    <>
                      Correlating with patient&apos;s diagnosed conditions <strong>({patient.conditions.map(c => typeof c === 'string' ? c : c.name).join(', ')})</strong>: Telemetry indicates acute strain. {anomalyStatus.clinicalNotes}
                    </>
                  )
                ) : (
                  anomalyStatus.clinicalNotes
                )}
              </div>
            </div>

            {/* 3-Step First-Aid & Protocol Recommendations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-highlight)" }}>
                {lang === "hi" ? "तत्काल प्राथमिक उपचार व कदम (Immediate First-Aid Protocol):" : "Immediate First-Aid & Patient Protocols:"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.82rem", background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px" }}>
                  <span style={{ background: "var(--primary-soft)", color: "var(--primary)", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>1</span>
                  <span>{lang === "hi" ? "तुरंत सभी शारीरिक गतिविधियां बंद करें, सीधे कुर्सी पर पीठ टिकाकर बैठें और तंग कपड़े ढीले करें।" : "Cease physical exertion immediately. Sit upright with back supported and loosen tight clothing."}</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.82rem", background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px" }}>
                  <span style={{ background: "var(--primary-soft)", color: "var(--primary)", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>2</span>
                  <span>{lang === "hi" ? "धीमी और गहरी सांसें लें (4 सेकंड सांस अंदर, 4 सेकंड बाहर) और कमरे में ताजी हवा आने दें।" : "Perform slow 4-4 diaphragmatic breathing and ensure access to fresh, well-ventilated air."}</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.82rem", background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px" }}>
                  <span style={{ background: "var(--primary-soft)", color: "var(--primary)", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>3</span>
                  <span>{lang === "hi" ? "यदि सीने में दर्द, चक्कर या सांस फूलने के लक्षण हों तो तुरंत इमरजेंसी 112 या परिवार को व्हाट्सएप अलर्ट भेजें।" : "If chest discomfort, dizziness, or shortness of breath occurs, trigger immediate emergency dispatch."}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
              <button
                type="button"
                onClick={handleShareWhatsAppAlert}
                className="btn btn-secondary"
                style={{
                  flex: "1 1 180px",
                  borderColor: "#22c55e",
                  color: "#22c55e",
                  fontSize: "0.85rem",
                  height: "40px"
                }}
              >
                <Share2 size={16} />
                <span>{lang === "hi" ? "व्हाट्सएप इमरजेंसी अलर्ट" : "Dispatch WhatsApp Alert"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAnomalyModalOpen(false);
                  if (onOpenEmergency) onOpenEmergency();
                  else window.open("tel:112");
                }}
                className="btn btn-primary"
                style={{
                  flex: "1 1 140px",
                  background: "#ef4444",
                  borderColor: "#dc2626",
                  fontSize: "0.85rem",
                  height: "40px"
                }}
              >
                <PhoneCall size={16} />
                <span>{lang === "hi" ? "इमरजेंसी 112 कॉल" : "Call Emergency 112"}</span>
              </button>

              {onAskCopilot && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAnomalyModalOpen(false);
                    onAskCopilot(
                      lang === "hi"
                        ? `मेरी स्मार्ट वॉच में विसंगति पाई गई है: पल्स ${liveReadings.heartRate} BPM, बीपी ${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg, SpO2 ${liveReadings.spo2}%। मुझे क्या करना चाहिए?`
                        : `Smartwatch telemetry anomaly detected: Pulse ${liveReadings.heartRate} BPM, BP ${liveReadings.systolicBP}/${liveReadings.diastolicBP} mmHg, SpO2 ${liveReadings.spo2}%. What clinical precautions should I take?`
                    );
                  }}
                  className="btn btn-secondary"
                  style={{
                    flex: "1 1 140px",
                    fontSize: "0.85rem",
                    height: "40px"
                  }}
                >
                  <MessageSquareHeart size={16} color="var(--primary)" />
                  <span>{lang === "hi" ? "एआई कोपायलट से पूछें" : "Consult AI Copilot"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsAnomalyModalOpen(false)}
                className="btn btn-secondary"
                style={{
                  height: "40px",
                  fontSize: "0.85rem",
                  padding: "0 18px"
                }}
              >
                {lang === "hi" ? "बंद करें" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
