import { useEffect, useState } from 'react';
import { ThemeContext } from '.';

export default function ThemeProvider({ children }: { children: JSX.Element }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'os'>(() => {
    // must check localStorage before init theme
    if (localStorage.getItem('theme') === 'light') return 'light';
    if (localStorage.getItem('theme') === 'dark') return 'dark';
    else return 'os';
  });
  const [htmlHasDark, setHtmlHasDark] = useState(
    document.documentElement.classList.contains('dark'),
  );

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
      if (themeInLocal) {
        if (themeInLocal === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else {
        // no localStorage settings -> use system's settings
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
          document.documentElement.classList.add('dark');
      }
      setHtmlHasDark(document.documentElement.classList.contains('dark'));
    }

    // manually call once because listener hasn't been added yet
    localStorageChange();

    // listening after
    window.addEventListener('storage', localStorageChange);
    return () => {
      window.removeEventListener('storage', localStorageChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, htmlHasDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
