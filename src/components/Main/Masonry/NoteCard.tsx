import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import Measure from 'react-measure';
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
  allNotes,
}: {
  note: NoteDbData;
  colWidth: number;
  colNum: 1 | 2 | 3 | 4 | 5;
  gap: 12;
  lefts: number[];
  allCardDims: React.MutableRefObject<Dimension[]>;
  allNotes: NoteDbData[];
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
  const [bounds, setBounds] = useState<Dimension>({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    note_id,
  });

  const [nudge, setNudge] = useState({
    left: 0,
    top: 0,
  });

  const [widthHack, setWidthHack] = useState(0);

  const abs = {
    left: 32,
    top: 200,
  } as const;

  useEffect(() => {
    setWidthHack(1); // hack to trigger onResize on:
    // colNum changes
    // allNotes changes
  }, [colNum, allNotes]);

  return (
    <Measure
      bounds
      onResize={(contentRect) => {
        // 1. Get initial rendered dimensions in contentRect.bounds
        if (contentRect.bounds && allCardDims.current.length > 0) {
          // 2. Update to ref allCardDims
          const currIndex = allCardDims.current.findIndex((dim) => dim.note_id === note_id); // find index to update
          allCardDims.current[currIndex] = { ...contentRect.bounds, note_id };
          setBounds({ ...contentRect.bounds, note_id });

          if (currIndex > 0) {
            setNudge(() => {
              // 3. Nudge based on index
              if (currIndex >= colNum) {
                // subsequent rows
                const cardOnTop = allCardDims.current[currIndex - colNum]; // find card on top
                const top = cardOnTop.top + cardOnTop.height - abs.top + gap;
                return { left: lefts[currIndex % colNum], top };
              }
              return { left: lefts[currIndex], top: 0 }; // first row
            });
          }
          setWidthHack(0);
        }
      }}
    >
      {({ measureRef }) => (
        <div
          ref={measureRef}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            transform: `translate(${nudge.left}px, ${nudge.top}px)`,
            width: colWidth + widthHack,
          }}
          className="NoteCard absolute left-0 top-0 flex max-h-[480px] flex-col gap-3 whitespace-pre-line rounded-lg bg-slate-200 p-4 pt-2 outline outline-1 outline-slate-300 dark:bg-slate-900 dark:outline-slate-700"
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
          <pre>{JSON.stringify(bounds, null, 2)}</pre>
          {labelButtons}
          <div className="add-stuffs">
            <button className="rounded-full p-1 outline outline-1 outline-slate-400 dark:outline-slate-800">
              <Ellipsis className="h-5 w-5" />
            </button>
          </div>
          {hover && deleteButton}
        </div>
      )}
    </Measure>
  );
}
