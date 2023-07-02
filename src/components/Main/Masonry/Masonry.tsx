import { User } from 'firebase/auth';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import supabase from '../../../supabase/connect';
import { getAllNotes } from '../../../supabase/notes';
import Dimension from '../../../types/Dimension';
import NoteDbData from '../../../types/NoteDbData';
import Nudge from '../../../types/Nudge';
import NoteCard from './NoteCard';

export default function Masonry() {
  const currentUser = useContext(UserContext) as User;
  const [allNotes, setAllNotes] = useState<NoteDbData[]>([]);
  const masonry = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // 1. fetch data
    const fetchDB = async () => {
      const fetchResult = await getAllNotes(currentUser.uid);
      if (fetchResult) setAllNotes(fetchResult);
      // if null, then there's error when fetching, redirect to 404 or something
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

  const abs = {
    left: 32,
    top: 200,
  } as const;
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
    .map((_, i) => colWidth * i + gap * i); // [ 0, 252, 504, 756, 1008 ]

  const [allCardDims, setAllCardDims] = useState<Dimension[]>(
    // initialize
    allNotes.map(
      ({ note_id }): Dimension => ({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        note_id,
      }),
    ),
  );
  // store nudge amount for each card
  const [nudges, setNudges] = useState<Nudge[]>(allNotes.map(() => ({ left: 0, top: 0 })));

  useEffect(() => {
    setNudges((prev) => {
      const updated = [...prev];
      const previewUpdatedDims: Dimension[] = [];

      for (let i = 0; i < allCardDims.length; i++) {
        // allNotes, allCardDims & nudges have the same order
        const rect = allCardDims[i];
        let nudge: Nudge = { left: 0, top: 0 };
        if (i > 0) {
          if (i < colNum) {
            // first row
            nudge = { left: lefts[i], top: 0 };
          } else {
            // subsequent rows
            const lowestCards = lefts.map((left) => {
              const bottomsOfSameCol = previewUpdatedDims
                .filter((dim) => dim.left === left + abs.left)
                .map((dim) => dim.bottom);

              const lowestCardOfEachCol = Math.max(...bottomsOfSameCol);
              return { left, bottom: lowestCardOfEachCol };
            });

            const cardOnTop = lowestCards.find((obj, _, a) => {
              // in possible cardOnTops (card with blank space below),
              // return one with smallest bottom
              const smallestBottom = Math.min(...a.map((obj) => obj.bottom));
              if (obj.bottom === smallestBottom) return obj;
              // TS complains that find() could return undefined, but with this logic it cannot
            }) as { left: number; bottom: number };

            nudge = { left: cardOnTop.left, top: cardOnTop.bottom - abs.top + gap };
          }

          // add changes to rect (must resemble position returned from getBoundingClientRect(),
          // which means calculate from 0, 0)
          rect.left = nudge.left + abs.left;
          rect.right = nudge.left + abs.left + rect.width;
          rect.top = nudge.top + abs.top;
          rect.bottom = nudge.top + abs.top + rect.height;
        }
        // push preview updated position to previewUpdatedDims
        previewUpdatedDims.push(rect);
        updated[i] = nudge;
      }

      return updated;
    });
  }, [colNum, allNotes, allCardDims]);

  const allCards = allNotes.map((note, i) => (
    <NoteCard
      note={note}
      colWidth={colWidth}
      setAllCardDims={setAllCardDims}
      i={i}
      nudge={nudges[i] || { left: 0, top: 0 }}
      key={note.note_id}
    />
  ));

  return (
    <div ref={masonry} id="masonry" className="relative mx-auto">
      {allCards}
    </div>
  );
}
