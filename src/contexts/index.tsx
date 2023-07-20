import { createContext } from 'react';
import { User } from 'firebase/auth';
import LabelDbData from '../types/LabelDbData';

export const UserContext = createContext<User | 'loading' | null>(null);
export const AllLabelsContext = createContext<LabelDbData[]>([]);
export const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'os';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'os'>>;
  htmlHasDark: boolean;
}>({
  theme: 'os',
  setTheme: () => {
    /*  */
  },
  htmlHasDark: false,
});
