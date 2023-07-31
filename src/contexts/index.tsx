import { createContext } from 'react';
import LabelDbData from '../types/LabelDbData';
import { auth } from '../firebase/auth';

export const UserContext = createContext(auth.currentUser);
export const AllLabelsContext = createContext<LabelDbData[]>([]);
export const SearchContext = createContext<{
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}>({
  searchValue: '',
  setSearchValue: () => {
    /*  */
  },
});
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
