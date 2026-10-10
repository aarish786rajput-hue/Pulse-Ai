/**
 * AppContext — Global state provider for PulseAI
 *
 * Provides lang, theme, currentPatient, patients and actions
 * to every component without prop drilling.
 * Usage: import { useApp } from '../context/AppContext';
 */
import React, { createContext, useContext } from 'react';

export const AppContext = createContext(null);

/** Hook to access global app state anywhere in the component tree */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp() must be inside <AppContext.Provider>');
  return ctx;
}
