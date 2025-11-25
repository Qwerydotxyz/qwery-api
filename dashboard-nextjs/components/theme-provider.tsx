'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>('dark'); // Always dark mode
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // FORCE dark mode - always apply dark class
    document.documentElement.classList.add('dark');
    
    // Save to localStorage so it persists
    localStorage.setItem('theme', 'dark');
    
    console.log('🌑 Dark mode is now permanent');
  }, []);

  const toggleTheme = () => {
    // Disabled - always stay dark
    console.log('Theme is locked to dark mode');
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
