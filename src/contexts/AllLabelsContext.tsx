import { User } from 'firebase/auth';
import { createContext, useEffect, useState, useContext } from 'react';
import { getAllLabels } from '../supabase/labels';
import LabelDbData from '../types/LabelDbData';
import supabase from '../supabase/connect';
import { UserContext } from './UserContext';

export const AllLabelsContext = createContext<LabelDbData[]>([]);

export default function AllLabelsContextProvider({ children }: { children: JSX.Element }) {
  const currentUser = useContext(UserContext) as User;
  const [allLabels, setAllLabels] = useState<LabelDbData[]>([]);
  useEffect(() => {
    const fetchDB = async () => {
      const fetchResult = await getAllLabels(currentUser.uid);
      if (fetchResult) setAllLabels(fetchResult);
    };
    fetchDB();
    supabase
      .channel('labels-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'labels',
          filter: `user_id=eq.${currentUser.uid}`,
        },
        (payload) => {
          console.log(payload);
          fetchDB();
        }, // listen for changes, refetch if there is one
      )
      .subscribe();
  }, [currentUser]);

  return <AllLabelsContext.Provider value={allLabels}>{children}</AllLabelsContext.Provider>;
}
