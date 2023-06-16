import { useState, useContext, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getAllNotes } from '../supabase/notes';
import { UserContext } from '../contexts/UserContext';
import NoteDbData from '../types/NoteDbData';
import NoteCard from './NoteCard';

export default function Masonry() {
  const currentUser = useContext(UserContext) as User;
  const [allNotes, setAllNotes] = useState<Array<NoteDbData>>([]);
  useEffect(() => {
    const fetchDB = async () => {
      const allNotes = (await getAllNotes(currentUser.uid)) as NoteDbData[];
      setAllNotes(allNotes);
    };
    fetchDB();
  }, [currentUser]);

  const allNotesRendered = allNotes.map((note) => <NoteCard note={note} key={note.note_id}/>);

  return (
    <div id="masonry" className="h-[300px] w-full rounded-lg outline outline-slate-800">
      {allNotesRendered}
    </div>
  );
}
