import { useEffect, useState, useContext } from 'react';
import { User } from 'firebase/auth';
import supabase from '../supabase/connect';
import NoteDbData from '../types/NoteDbData';
import { getAllNotes } from '../supabase/notes';
import { AllNotesContext, SearchContext, UserContext } from '.';

export default function AllNotesContextProvider({ children }: { children: JSX.Element }) {
  const currentUser = useContext(UserContext) as User;
  const { searchValue } = useContext(SearchContext);
  const [allNotes, setAllNotes] = useState<NoteDbData[]>([]);
  useEffect(() => {
    if (currentUser) {
      const fetchNotes = async () => {
        const fetchResult = await getAllNotes(currentUser.uid);
        if (fetchResult && fetchResult.length > 0)
          setAllNotes(
            fetchResult.filter((note: NoteDbData) => {
              return searchValue
                ? note.title.includes(searchValue) ||
                    note.content.includes(searchValue) ||
                    note.bg_color.includes(searchValue) ||
                    note.labels.some(label => label === searchValue)
                : note;
            }),
          );
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
  }, [currentUser, searchValue]);

  return <AllNotesContext.Provider value={allNotes}>{children}</AllNotesContext.Provider>;
}
