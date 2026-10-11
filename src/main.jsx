import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Robust React + DOM Translation Guard: Prevents Google Translate / browser font node crashes
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, refNode) {
    if (refNode && refNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    const msg = error?.message || (typeof error === 'string' ? error : "");
    if (msg.includes("removeChild") || msg.includes("insertBefore") || msg.includes("Node") || msg.includes("NotFound")) {
      console.warn("[PulseAI] Suppressed benign translation DOM conflict:", msg);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const msg = error?.message || "";
    if (msg.includes("removeChild") || msg.includes("insertBefore") || msg.includes("Node") || msg.includes("NotFound")) {
      return;
    }
    console.error("PulseAI Root ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('pulseai_patients');
      localStorage.removeItem('pulseai_lang');
      localStorage.removeItem('pulseai_theme');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#090d16',
          color: '#e2e8f0',
          fontFamily: 'Outfit, system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '18px',
            padding: '32px 28px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🛡️</div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px', color: '#f87171' }}>
              PulseAI Health Copilot
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '18px', lineHeight: 1.5 }}>
              A UI rendering error occurred. You can reload the application or reset stored preferences to restore standard demo mode.
            </p>
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '12px 14px',
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#fda4af',
              marginBottom: '22px',
              textAlign: 'left',
              wordBreak: 'break-word',
              maxHeight: '110px',
              overflowY: 'auto'
            }}>
              {this.state.error?.message || "Unknown Runtime Error"}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Reset Stored Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Register Service Worker for PWA & Offline Clinical Emergency Access
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PulseAI PWA] Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PulseAI PWA] Service Worker registration failed:', err);
      });
  });
}

