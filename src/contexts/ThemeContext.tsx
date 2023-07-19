import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/auth';

export const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'os';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'os'>>;
}>({
  theme: 'os',
  setTheme: () => {
    /*  */
  },
});

export default function ThemeContextProvider({ children }: { children: JSX.Element }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'os'>('os');

  // state to localStorage
  useEffect(() => {
    if (theme === 'light') localStorage.setItem('theme', 'light');
    if (theme === 'dark') localStorage.setItem('theme', 'dark');
    if (theme === 'os') localStorage.removeItem('theme');
    window.dispatchEvent(new Event('storage'));
  }, [theme]);

  // localStorage to <html>
  useEffect(() => {
    function localStorageChange() {
      const themeInLocal = localStorage.getItem('theme');
      console.log('themeInLocal', themeInLocal);
      if (themeInLocal) {
        if (themeInLocal === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else {
        // if there's no theme then check prefers-color-scheme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
          document.documentElement.classList.add('dark');
      }
    }

    window.addEventListener('storage', localStorageChange);
    return () => {
      window.removeEventListener('storage', localStorageChange);
    };
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
