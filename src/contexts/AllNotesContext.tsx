import { useEffect, useState, useContext } from 'react';
import { User } from 'firebase/auth';
import supabase from '../supabase/connect';
import NoteDbData from '../types/NoteDbData';
import { getAllNotes } from '../supabase/notes';
import { AllNotesContext, UserContext } from '.';

export default function AllNotesContextProvider({ children }: { children: JSX.Element }) {
  const currentUser = useContext(UserContext) as User;
  const [allNotes, setAllNotes] = useState<NoteDbData[]>([]);
  useEffect(() => {
    if (currentUser) {
      const fetchNotes = async () => {
        const fetchResult = await getAllNotes(currentUser.uid);
        if (fetchResult && fetchResult.length > 0) setAllNotes(fetchResult);
      };
      fetchNotes();
      supabase
        .channel('notes-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notes',
            filter: `user_id=eq.${currentUser.uid}`,
          },
          (_payload) => fetchNotes(), // listen for changes, refetch if there is one
        )
        .subscribe();
    }
  }, [currentUser]);

  return <AllNotesContext.Provider value={allNotes}>{children}</AllNotesContext.Provider>;
}
