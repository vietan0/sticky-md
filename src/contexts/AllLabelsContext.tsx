import { User } from 'firebase/auth';
import { createContext, useEffect, useState, useContext } from 'react';
import { getAllLabels } from '../supabase/labels';
import LabelDbData from '../types/LabelDbData';
import { UserContext } from './UserContext';

export const AllLabelsContext = createContext<LabelDbData[]>([]);

export default function AllLabelsContextProvider({ children }: { children: JSX.Element }) {
  const currentUser = useContext(UserContext) as User;
  const [allLabels, setAllLabels] = useState<LabelDbData[]>([]);
  useEffect(() => {
    const fetchDB = async () => {
      const result = (await getAllLabels(currentUser.uid)) as LabelDbData[];
      setAllLabels(result);
    };
    fetchDB();
  }, [currentUser]);

  return <AllLabelsContext.Provider value={allLabels}>{children}</AllLabelsContext.Provider>;
}
