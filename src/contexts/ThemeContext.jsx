import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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

/*Purpose: Yeh file theme management system (dark/light mode toggle + global state sharing) ke liye use hoti hai.

Type: Yeh web-based frontend (React) ke liye hai, mainly browser apps ke liye.








 */