import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'emerald' | 'navy' | 'crimson' | 'teal' | 'dark';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  badge: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  bgGradient: string;
  heroGradient: string;
  navbarBorder: string;
  btnPrimary: string;
  btnPrimaryHover: string;
  btnAccent: string;
  activeRing: string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Official Nedian (Emerald & Crimson)',
    badge: 'bg-emerald-600',
    primary: '#15803d', // Emerald-700
    primaryHover: '#166534', // Emerald-800
    primaryLight: '#ecfdf5', // Emerald-50
    accent: '#b91c1c', // Red-700 (matching EDIAN)
    accentLight: '#fef2f2',
    bgGradient: 'from-emerald-950 via-slate-900 to-green-950',
    heroGradient: 'from-emerald-100/90 via-emerald-50/50 to-slate-100/80',
    navbarBorder: 'border-emerald-100',
    btnPrimary: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-700/20',
    btnPrimaryHover: 'hover:bg-emerald-800',
    btnAccent: 'bg-red-700 text-white hover:bg-red-800 shadow-red-700/20',
    activeRing: 'ring-emerald-500',
  },
  navy: {
    id: 'navy',
    name: 'Royal Navy & Gold',
    badge: 'bg-blue-800',
    primary: '#1e3a8a', // Blue-900
    primaryHover: '#172554',
    primaryLight: '#eff6ff',
    accent: '#d97706', // Amber-600
    accentLight: '#fffbeb',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    heroGradient: 'from-blue-100/90 via-sky-50/60 to-slate-100/80',
    navbarBorder: 'border-blue-100',
    btnPrimary: 'bg-blue-800 text-white hover:bg-blue-900 shadow-blue-800/20',
    btnPrimaryHover: 'hover:bg-blue-900',
    btnAccent: 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20',
    activeRing: 'ring-blue-600',
  },
  crimson: {
    id: 'crimson',
    name: 'Bold Crimson & Slate',
    badge: 'bg-red-700',
    primary: '#b91c1c', // Red-700
    primaryHover: '#991b1b',
    primaryLight: '#fef2f2',
    accent: '#15803d', // Emerald-700
    accentLight: '#f0fdf4',
    bgGradient: 'from-red-950 via-slate-900 to-rose-950',
    heroGradient: 'from-rose-100/90 via-red-50/60 to-slate-100/80',
    navbarBorder: 'border-rose-100',
    btnPrimary: 'bg-red-700 text-white hover:bg-red-800 shadow-red-700/20',
    btnPrimaryHover: 'hover:bg-red-800',
    btnAccent: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-700/20',
    activeRing: 'ring-red-500',
  },
  teal: {
    id: 'teal',
    name: 'Cyber Cyan & Teal',
    badge: 'bg-cyan-600',
    primary: '#0e7490', // Cyan-700
    primaryHover: '#155e75',
    primaryLight: '#ecfeff',
    accent: '#059669', // Emerald-600
    accentLight: '#ecfdf5',
    bgGradient: 'from-cyan-950 via-slate-900 to-teal-950',
    heroGradient: 'from-teal-100/90 via-cyan-50/60 to-slate-100/80',
    navbarBorder: 'border-cyan-100',
    btnPrimary: 'bg-cyan-700 text-white hover:bg-cyan-800 shadow-cyan-700/20',
    btnPrimaryHover: 'hover:bg-cyan-800',
    btnAccent: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20',
    activeRing: 'ring-cyan-500',
  },
  dark: {
    id: 'dark',
    name: 'Obsidian Midnight (Dark Mode)',
    badge: 'bg-slate-900',
    primary: '#10b981', // Emerald-500
    primaryHover: '#059669',
    primaryLight: '#0f172a',
    accent: '#f43f5e', // Rose-500
    accentLight: '#1e293b',
    bgGradient: 'from-black via-slate-950 to-neutral-950',
    heroGradient: 'from-slate-950 via-slate-900 to-zinc-950',
    navbarBorder: 'border-slate-800',
    btnPrimary: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20',
    btnPrimaryHover: 'hover:bg-emerald-500',
    btnAccent: 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20',
    activeRing: 'ring-emerald-400',
  },
};

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'emerald',
  setTheme: () => {},
  config: THEME_CONFIGS.emerald,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeColor>('emerald');

  const setTheme = (newTheme: ThemeColor) => {
    setThemeState(newTheme);
    localStorage.setItem('nedian_theme', newTheme);
  };

  const config = THEME_CONFIGS[theme];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--color-primary', config.primary);
    document.documentElement.style.setProperty('--color-primary-hover', config.primaryHover);
    document.documentElement.style.setProperty('--color-accent', config.accent);
  }, [theme, config]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
