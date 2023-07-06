import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { deleteNote } from '../../../supabase/notes';
import NoteDbData from '../../../types/NoteDbData';
import Close from '../../icons/Close';
import Ellipsis from '../../icons/Ellipsis';
import LabelButton from '../LabelButton';
import Dimension from '../../../types/Dimension';
import Nudge from '../../../types/Nudge';

export default function NoteCard({
  note,
  colWidth,
  setAllCardDims,
  i,
  nudge,
  allNotes,
  lefts,
  abs,
}: {
  note: NoteDbData;
  colWidth: number;
  setAllCardDims: React.Dispatch<React.SetStateAction<Dimension[]>>;
  i: number;
  nudge: Nudge;
  allNotes: NoteDbData[];
  lefts: number[];
  abs: {
    readonly left: 32;
    readonly top: 200;
  };
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

  const card = useRef<HTMLDivElement>(null);

  function handleTransitionEnd() {
    if (card.current) {
      const rect = card.current.getBoundingClientRect();

      setAllCardDims((prev) => {
        const dup = [...prev];

        // handle delete card
        const deleteTargetIndex = prev.findIndex((dim) => {
          const ids = allNotes.map((n) => n.note_id);
          return !ids.includes(dim.note_id);
        });
        if (deleteTargetIndex !== -1) {
          dup.splice(deleteTargetIndex, 1);
        }

        let left = 0;
        for (let i = lefts.length - 1; i >= 0; i--) {
          if (rect.left >= lefts[i]) {
            left = lefts[i] + abs.left * (i + 1);
            break;
          }
        }
        dup[i] = {
          bottom: i === 0 ? rect.height + abs.top : rect.bottom,
          height: rect.height,
          left,
          right: rect.right,
          top: i === 0 ? abs.top : rect.top,
          width: rect.width,
          note_id,
        };
        return dup;
      });
    }
  }

  useEffect(() => {
    handleTransitionEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNotes]);

  return (
    <div
      ref={card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTransitionEnd={handleTransitionEnd}
      style={{
        transform: `translate(${nudge.left}px, ${nudge.top}px)`,
        width: colWidth,
      }}
      className="NoteCard absolute flex max-h-[480px] flex-col gap-3 whitespace-pre-line rounded-lg bg-slate-200 p-4 pt-2 outline outline-1 outline-slate-300 duration-100 dark:bg-slate-900 dark:outline-slate-700"
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
