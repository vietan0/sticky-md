import { useState, useContext, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { getAllNotes } from '../../../supabase/notes';
import { UserContext } from '../../../contexts/UserContext';
import NoteDbData from '../../../types/NoteDbData';
import supabase from '../../../supabase/connect';
import Dimension from '../../../types/Dimension';
import NoteCard from './NoteCard';

export default function Masonry() {
  const currentUser = useContext(UserContext) as User;
  const [allNotes, setAllNotes] = useState<NoteDbData[] | null>([]);
  const masonry = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // 1. fetch data
    const fetchDB = async () => {
      const allNotes = await getAllNotes(currentUser.uid);
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
        (_payload) => fetchDB(), // listen for changes, refetch if there is one
      )
      .subscribe();

    // 2. prepare layout
    const syncWidth = () => {
      if (masonry.current) {
        setWidth(masonry.current.getBoundingClientRect().width);
      }
    };
    syncWidth();
    window.addEventListener('resize', syncWidth);

    return () => {
      window.removeEventListener('resize', syncWidth);
    };
  }, [currentUser]);

  const gap = 12;
  const colWidth = 240;
  const breakpoints = Array(4)
    .fill(0)
    .map((_, i) => colWidth * (i + 2) + gap * (i + 1)); // [ 504, 768, 1032, 1296 ]
  const colNum =
    width < breakpoints[0]
      ? 1
      : width < breakpoints[1]
      ? 2
      : width < breakpoints[2]
      ? 3
      : width < breakpoints[3]
      ? 4
      : 5;
  const lefts = Array(colNum)
    .fill(0)
    .map((_, i) => colWidth * i + gap * i);

  const cols = Array(colNum)
    .fill(0)
    .map((_, i) => (
      <div
        key={i}
        id={`col-${i}`}
        style={{ position: 'absolute', width: colWidth, height: 20, left: lefts[i] }}
        className="col outline outline-1 outline-pink-500"
      ></div>
    ));

  // cards positioning
  const allCardDims = useRef<Dimension[]>([]);
  useEffect(() => {
    if (allNotes)
      allCardDims.current = allNotes.map(
        ({ note_id }): Dimension => ({
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          bottom: 0,
          right: 0,
          note_id,
        }),
      );
  }, [allNotes]);

  const allCards = allNotes?.map((note) => (
    <NoteCard
      note={note}
      colWidth={colWidth}
      colNum={colNum}
      gap={gap}
      lefts={lefts}
      allCardDims={allCardDims}
      allNotes={allNotes}
      key={note.note_id}
    />
  ));

  return (
    <div ref={masonry} id="masonry" className="relative mx-auto">
      {allCards}
    </div>
  );
}
