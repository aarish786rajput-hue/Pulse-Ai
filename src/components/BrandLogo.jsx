import React from "react";

/**
 * HeartPulseIcon — Exact Medical Heart + ECG Waveform emblem matching the PulseAI brand identity.
 * Features a precision-engineered symmetric heart outline with a QRS heartbeat pulse traversing the center.
 */
export function HeartPulseIcon({ size = 36, color = null, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
        filter: "drop-shadow(0 2px 6px rgba(13, 148, 136, 0.28))"
      }}
    >
      <defs>
        <linearGradient id="pulseHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="45%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Heart Outline: Smooth rounded lobes and sharp bottom apex */}
      <path
        d="M18 10.2C13.8 4.2 6.2 5.2 5 12.8C4 18.6 10.8 24.6 18 30.6C25.2 24.6 32 18.6 31 12.8C29.8 5.2 22.2 4.2 18 10.2Z"
        stroke={color || "url(#pulseHeartGrad)"}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(13, 148, 136, 0.08)"
      />

      {/* ECG Heartbeat Waveform cutting through the center */}
      <path
        d="M4.5 17.5H11.5L14.2 10.5L18 25L21.8 10.5L24.5 17.5H31.5"
        stroke={color || "url(#pulseHeartGrad)"}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * LogoIcon — Standalone responsive emblem for headers, navbars and avatar cards
 */
export function LogoIcon({ size = 36, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      <HeartPulseIcon size={size} />
    </div>
  );
}

/**
 * BrandLogo — Full Brand mark with Heart-Pulse emblem, PulseAI Typography and Subtitle
 */
export default function BrandLogo({
  size = 38,
  isOpen = true,
  appName = "PulseAI",
  subtitle = null,
  badge = null
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        justifyContent: isOpen ? "flex-start" : "center",
        padding: isOpen ? "0" : "4px 0"
      }}
      title={`${appName} - Your personal health companion`}
    >
      <LogoIcon size={size} />

      {isOpen && (
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "1.26rem",
                fontWeight: 800,
                fontFamily: "var(--font-heading)",
                color: "var(--text-highlight)",
                letterSpacing: "-0.02em"
              }}
            >
              {appName.endsWith("AI") ? (
                <>
                  {appName.slice(0, -2)}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #0d9488, #06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    AI
                  </span>
                </>
              ) : (
                appName
              )}
            </span>
            {badge && (
              <span
                className="badge badge-primary"
                style={{
                  fontSize: "0.64rem",
                  padding: "2px 6px",
                  fontWeight: 700,
                  letterSpacing: "0.04em"
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
