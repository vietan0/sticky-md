import { useState, useContext, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getAllNotes } from '../supabase/notes';
import { UserContext } from '../contexts/UserContext';
import NoteDbData from '../types/NoteDbData';
import supabase from '../supabase/connect';
import NoteCard from './NoteCard';

export default function Masonry() {
  const currentUser = useContext(UserContext) as User;
  const [allNotes, setAllNotes] = useState<NoteDbData[]>([]);
  useEffect(() => {
    const fetchDB = async () => {
      const allNotes = (await getAllNotes(currentUser.uid)) as NoteDbData[];
      setAllNotes(allNotes);
    };
    fetchDB();

    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        (payload) => fetchDB(), // listen for changes, refetch if there is one
      )
      .subscribe();
  }, [currentUser]);

  const allNotesRendered = allNotes.map((note) => <NoteCard note={note} key={note.note_id} />);

  return (
    <div
      id="masonry"
      className="grid w-full grid-cols-3 gap-4"
    >
      {allNotesRendered}
    </div>
  );
}
