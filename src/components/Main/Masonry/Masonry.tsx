import { useContext, useEffect, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import Dimension from '../../../types/Dimension';
import NoteDbData from '../../../types/NoteDbData';
import Nudge from '../../../types/Nudge';
import { UserContext } from '../../../contexts';
import supabase from '../../../supabase/connect';
import { getAllNotes } from '../../../supabase/notes';
import NoteCard from './NoteCard';

export default function Masonry() {
  const currentUser = useContext(UserContext) as User;
  const [allNotes, setAllNotes] = useState<NoteDbData[]>([]);
  const masonry = useRef<HTMLDivElement>(null);
  const [availableSpace, setAvailableSpace] = useState<number>(0);

  useEffect(() => {
    // 1. fetch data
    if (currentUser) {
      const fetchNotes = async () => {
        const fetchResult = await getAllNotes(currentUser.uid);
        if (fetchResult) setAllNotes(fetchResult);
        // if null, then there's error when fetching, redirect to 404 or something
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
    // 2. prepare layout
    const syncWidth = () => {
      const mainPadding = 32;
      setAvailableSpace(window.innerWidth - mainPadding * 2);
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
    availableSpace < breakpoints[0]
      ? 1
      : availableSpace < breakpoints[1]
      ? 2
      : availableSpace < breakpoints[2]
      ? 3
      : availableSpace < breakpoints[3]
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
  const [nudges, setNudges] = useState<Nudge[]>(
    allNotes.map(({ note_id }) => ({ left: 0, top: 0, note_id })),
  );

  useEffect(() => {
    setNudges((prev) => {
      const updated = [...prev];
      const previewUpdatedDims: Dimension[] = [];

      // handle delete card
      const deleteTargetIndex = prev.findIndex((dim) => {
        const ids = allNotes.map((n) => n.note_id);
        return !ids.includes(dim.note_id);
      });
      if (deleteTargetIndex !== -1) {
        updated.splice(deleteTargetIndex, 1);
      }

      for (let i = 0; i < allCardDims.length; i++) {
        // allNotes, allCardDims & nudges have the same order
        const rect = allCardDims[i];
        let nudge: Nudge = { left: 0, top: 0, note_id: rect.note_id };
        if (i > 0) {
          if (i < colNum) {
            // first row
            nudge = { left: lefts[i], top: 0, note_id: rect.note_id };
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

            nudge = {
              left: cardOnTop.left,
              top: cardOnTop.bottom - abs.top + gap,
              note_id: rect.note_id,
            };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colNum, allNotes, allCardDims]);

  const allCards = allNotes.map((note, i) => (
    <NoteCard
      note={note}
      colWidth={colWidth}
      setAllCardDims={setAllCardDims}
      i={i}
      nudge={nudges[i] || { left: 0, top: 0 }}
      allNotes={allNotes}
      lefts={lefts}
      abs={abs}
      key={note.note_id}
    />
  ));

  const [masonryHeight, setMasonryHeight] = useState(0);
  useEffect(() => {
    setMasonryHeight(() => {
      const bottoms = allCardDims.map((n) => n.bottom);
      const maxBottom = bottoms.length > 0 ? Math.max(...bottoms) - abs.top : 0;
      return maxBottom;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCardDims]);

  return (
    <div
      ref={masonry}
      id="masonry"
      style={{
        height: masonryHeight,
        width: colNum * colWidth + (colNum - 1) * gap,
        maxWidth: breakpoints[3],
      }}
      className="relative mx-auto duration-100"
    >
      {/* <UrlPreview url="https://www.youtube.com/" /> */}
      {allCards}
    </div>
  );
}
