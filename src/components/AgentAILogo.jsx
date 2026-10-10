import React from "react";

/**
 * AgentAILogo — Distinctive 4-pointed radiant Agent AI star emblem
 * Matching the CureCheck reference image with glowing neural intelligence.
 */
export default function AgentAILogo({ 
  size = 24, 
  color = "#ffffff", 
  glow = true, 
  className = "",
  style = {} 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: "block",
        flexShrink: 0,
        filter: glow ? "drop-shadow(0 0 6px rgba(255, 255, 255, 0.65))" : "none",
        ...style
      }}
    >
      {/* Primary 4-pointed Radiant Agent Sparkle Star */}
      <path
        d="M12 2C12.3 6.8 15.2 9.7 20 10C15.2 10.3 12.3 13.2 12 18C11.7 13.2 8.8 10.3 4 10C8.8 9.7 11.7 6.8 12 2Z"
        fill={color}
      />
      {/* Top-Right Intelligence Accent Spark */}
      <path
        d="M19 14.5C19.15 16.6 20.25 17.7 22.4 17.85C20.25 18 19.15 19.1 19 21.2C18.85 19.1 17.75 18 15.6 17.85C17.75 17.7 18.85 16.6 19 14.5Z"
        fill={color}
        opacity="0.9"
      />
      {/* Bottom-Left Minor Satellite Spark */}
      <path
        d="M6 3.5C6.1 4.7 6.65 5.25 7.9 5.35C6.65 5.45 6.1 6 6 7.2C5.9 6 5.35 5.45 4.1 5.35C5.35 5.25 5.9 4.7 6 3.5Z"
        fill={color}
        opacity="0.85"
      />
      {/* Neural Core Spark Center */}
      <circle cx="12" cy="10" r="1.3" fill="#38bdf8" />
    </svg>
  );
}
