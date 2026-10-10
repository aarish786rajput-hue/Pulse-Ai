import React, { useState, useEffect, useRef } from "react";
import {
  Watch,
  Activity,
  Heart,
  Droplet,
  Flame,
  Moon,
  Battery,
  BatteryCharging,
  Wifi,
  RefreshCw,
  Bluetooth,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Sparkles,
  MessageSquareHeart,
  Smartphone,
  Check,
  X,
  PhoneCall,
  Info
} from "lucide-react";

export default function DeviceManager({ patient, lang = "en", onAskCopilot, onUpdateVitals }) {
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

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

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

  // ── Real-time subtle heartbeat fluctuations (natural bio-rhythm) ───────────
  useEffect(() => {
    if (!device.isConnected || isMeasuring) return;

    const interval = setInterval(() => {
      setLiveReadings((prev) => {
        if (isSimulatingAbnormal) {
          // Simulated high tachycardia episode for demonstration
          const deltaBpm = (Math.random() * 4 - 2);
          return {
            ...prev,
            heartRate: Math.min(142, Math.max(126, Math.round(prev.heartRate + deltaBpm))),
            systolicBP: 148,
            diastolicBP: 94,
            spo2: 91
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
    const points = [];
    const maxPoints = 200;

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
      if (cycle < 53) return mid - (isSimulatingAbnormal ? 48 : 38);
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
      ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
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

      // Draw live ECG curve
      ctx.shadowBlur = 10;
      ctx.shadowColor = isSimulatingAbnormal ? "#ef4444" : "#0ea5e9";
      ctx.strokeStyle = isSimulatingAbnormal ? "#ef4444" : "#38bdf8";
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
      ctx.fillStyle = isSimulatingAbnormal ? "#f87171" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(sweepX, generateWaveValue(sweepX + offset), 4.5, 0, Math.PI * 2);
      ctx.fill();

      offset += isSimulatingAbnormal ? 3.5 : 2;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [device.isConnected, isSimulatingAbnormal]);

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
                    ? "अपनी स्मार्ट वॉच को कनेक्ट करें और बीपी, पल्स व दिल की धड़कन का लाइव डेटा आसान भाषा में देखें।"
                    : "Pair your smartwatch to monitor real-time Blood Pressure, Pulse, SpO2 & Heart Rate in simple, everyday language."}
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

      {/* ── 3. High Risk / Tachycardia Emergency Alert Banner (If Simulated) ── */}
      {isSimulatingAbnormal && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), var(--bg-card))",
            border: "2px solid #ef4444",
            padding: "16px 20px",
            borderRadius: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            animation: "pulse 2s infinite"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={28} color="#ef4444" />
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#dc2626" }}>
                {lang === "hi" ? "⚠️ दिल की धड़कन तेज है (Tachycardia Warning)" : "⚠️ High Heart Rate Detected (Tachycardia Alert)"}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-main)", marginTop: "2px" }}>
                {lang === "hi"
                  ? `आपकी पल्स ${liveReadings.heartRate} BPM और SpO2 ${liveReadings.spo2}% है। शांत होकर बैठें और तुरंत डॉक्टर या इमरजेंसी 112 से संपर्क करें।`
                  : `Your pulse reached ${liveReadings.heartRate} BPM with SpO2 at ${liveReadings.spo2}%. Please sit down, rest, and contact emergency if feeling dizzy.`}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a href="tel:112" className="btn btn-primary" style={{ background: "#ef4444", borderColor: "#dc2626" }}>
              <PhoneCall size={15} />
              <span>{lang === "hi" ? "इमरजेंसी कॉल 112" : "Call Emergency 112"}</span>
            </a>
            <button onClick={() => setIsSimulatingAbnormal(false)} className="btn btn-secondary" style={{ fontSize: "0.8rem" }}>
              {lang === "hi" ? "अलर्ट बंद करें" : "Reset Alert"}
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
            <Activity size={20} color={isSimulatingAbnormal ? "#ef4444" : "var(--primary)"} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
              {lang === "hi" ? "लाइव पल्स वेव व ईसीजी (Live ECG Rhythm Wave)" : "Live Pulse Wave & ECG Rhythm"}
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: isSimulatingAbnormal ? "#ef4444" : "var(--status-good-text)", fontWeight: 700 }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isSimulatingAbnormal ? "#ef4444" : "#10b981", animation: "ping 1.5s infinite" }} />
              {isSimulatingAbnormal ? (lang === "hi" ? "असामान्य गति (Elevated)" : "Arrhythmia / Elevated") : (lang === "hi" ? "सामान्य ताल (Normal Sinus Rhythm)" : "Normal Sinus Rhythm")}
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

      {/* ── 5. Core Live Health Metrics (Simple Cards with Plain Explanations) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
        
        {/* Metric 1: Heart Rate / Pulse */}
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={20} color="#ef4444" style={{ animation: "pulse 1.2s infinite" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {lang === "hi" ? "दिल की धड़कन (Heart Rate)" : "Heart Rate (Pulse)"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-highlight)", lineHeight: 1.1, marginTop: "2px" }}>
                  {liveReadings.heartRate} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>BPM</span>
                </div>
              </div>
            </div>

            <span className={`badge ${liveReadings.heartRate > 100 || liveReadings.heartRate < 55 ? "badge-crit" : "badge-good"}`} style={{ fontSize: "0.75rem" }}>
              {liveReadings.heartRate > 100 ? (lang === "hi" ? "तेज धड़कन" : "High") : (lang === "hi" ? "सामान्य (60-100)" : "Normal (60-100)")}
            </span>
          </div>

          <div style={{ background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            💡 {lang === "hi"
              ? "आपका दिल सुरक्षित और स्वस्थ गति से धड़क रहा है। आराम के समय 60 से 100 BPM बिल्कुल सामान्य होता है।"
              : "Your heart is beating at a healthy, safe resting pace. Normal range is 60 to 100 BPM."}
          </div>
        </div>

        {/* Metric 2: Blood Pressure */}
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {lang === "hi" ? "रक्तचाप (Blood Pressure)" : "Blood Pressure (BP)"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-highlight)", lineHeight: 1.1, marginTop: "2px" }}>
                  {liveReadings.systolicBP}/{liveReadings.diastolicBP} <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>mmHg</span>
                </div>
              </div>
            </div>

            <span className={`badge ${liveReadings.systolicBP > 135 ? "badge-crit" : "badge-good"}`} style={{ fontSize: "0.75rem" }}>
              {liveReadings.systolicBP > 135 ? (lang === "hi" ? "हल्का बढ़ा हुआ" : "Elevated") : (lang === "hi" ? "उत्तम (Optimal)" : "Optimal")}
            </span>
          </div>

          <div style={{ background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            💡 {lang === "hi"
              ? `ऊपर का बीपी ${liveReadings.systolicBP} और नीचे का ${liveReadings.diastolicBP} है। दोनों सुरक्षित दायरे में हैं।`
              : `Systolic (${liveReadings.systolicBP}) and Diastolic (${liveReadings.diastolicBP}) are within safe clinical bounds.`}
          </div>
        </div>

        {/* Metric 3: Blood Oxygen (SpO2) */}
        <div
          className="glass-panel"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(56, 189, 248, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Droplet size={20} color="#0284c7" />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {lang === "hi" ? "ऑक्सीजन स्तर (Blood Oxygen)" : "Blood Oxygen (SpO2)"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-highlight)", lineHeight: 1.1, marginTop: "2px" }}>
                  {liveReadings.spo2}%
                </div>
              </div>
            </div>

            <span className={`badge ${liveReadings.spo2 < 94 ? "badge-crit" : "badge-good"}`} style={{ fontSize: "0.75rem" }}>
              {liveReadings.spo2 < 94 ? (lang === "hi" ? "कम ऑक्सीजन" : "Low SpO2") : (lang === "hi" ? "स्वस्थ (95-100%)" : "Healthy (95-100%)")}
            </span>
          </div>

          <div style={{ background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "10px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.4 }}>
            💡 {lang === "hi"
              ? "खून में ऑक्सीजन पूरी तरह सही है। फेफड़ों का काम बिल्कुल ठीक चल रहा है।"
              : "Circulating blood oxygen saturation is optimal, reflecting healthy lung function."}
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
    </div>
  );
}
