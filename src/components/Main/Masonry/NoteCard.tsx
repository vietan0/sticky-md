import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { deleteNote } from '../../../supabase/notes';
import Dimension from '../../../types/Dimension';
import NoteDbData from '../../../types/NoteDbData';
import Close from '../../icons/Close';
import Ellipsis from '../../icons/Ellipsis';
import LabelButton from '../LabelButton';

export default function NoteCard({
  note,
  colWidth,
  colNum,
  gap,
  lefts,
  allCardDims,
}: {
  note: NoteDbData;
  colWidth: number;
  colNum: 1 | 2 | 3 | 4 | 5;
  gap: 12;
  lefts: number[];
  allCardDims: React.MutableRefObject<Dimension[]>;
}) {
  const [hover, setHover] = useState(false);
  const { title, content, labels, note_id } = note;

  const labelButtons = labels.map((label) => <LabelButton label={label} key={nanoid()} />);
  const deleteButton = (
    <button
      onClick={() => deleteNote(note_id)}
      className="delete-button absolute -right-3 -top-3 rounded-full bg-slate-300 p-1 outline outline-1 outline-slate-400 dark:bg-slate-800 dark:outline-slate-800"
    >
      <Close className="h-4 w-4" />
    </button>
  );

  // card positioning
  const ref = useRef<HTMLDivElement>(null);
  const [nudge, setNudge] = useState({
    left: 0,
    top: 0,
  });

  const abs = {
    left: 32,
    top: 200,
  } as const;

  useEffect(() => {
    if (ref.current) {
      // 1. Get rect
      const refRect = ref.current.getBoundingClientRect();
      // 2. Update to ref allCardDims
      const currIndex = allCardDims.current.findIndex((dim) => dim.note_id === note_id); // find index to update
      if (title === '2') {
        console.log("2nd note's bottom :>> ", refRect.bottom)
      }
      allCardDims.current[currIndex] = {
        bottom: refRect.bottom,
        height: refRect.height,
        left: refRect.left,
        right: refRect.right,
        top: refRect.top,
        width: refRect.width,
        x: refRect.x,
        y: refRect.y,
        note_id,
      };

      // 3. setNudge
      if (currIndex > 0) {
        setNudge(() => {
          if (currIndex >= colNum) {
            // subsequent rows
            const cardOnTop = allCardDims.current[currIndex - colNum]; // find card on top
            const top = cardOnTop.bottom - abs.top + gap;
            // Problem: with this logic,
            // current card use cardOnTop.bottom before cardOnTop finished moving to its new position
            return { left: lefts[currIndex % colNum], top };
          }
          return { left: lefts[currIndex], top: 0 }; // first row
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCardDims, colNum]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transform: `translate(${nudge.left}px, ${nudge.top}px)`,
        width: colWidth,
      }}
      className="NoteCard absolute left-0 top-0 flex max-h-[480px] flex-col gap-3 whitespace-pre-line rounded-lg bg-slate-200 p-4 pt-2 outline outline-1 outline-slate-300 duration-100 dark:bg-slate-900 dark:outline-slate-700"
    >
      {title && (
        <Md remarkPlugins={[remarkGfm]} className="markdown break-words font-semibold">
          {title}
        </Md>
      )}
      {content && (
        <Md remarkPlugins={[remarkGfm]} className="markdown break-words">
          {content}
        </Md>
      )}
      <pre>nudge: {JSON.stringify(nudge, null, 2)}</pre>
      {labelButtons}
      <div className="add-stuffs">
        <button className="rounded-full p-1 outline outline-1 outline-slate-400 dark:outline-slate-800">
          <Ellipsis className="h-5 w-5" />
        </button>
      </div>
      {hover && deleteButton}
    </div>
  );
}
