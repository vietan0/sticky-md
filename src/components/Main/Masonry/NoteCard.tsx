import { useContext, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { nanoid } from 'nanoid';
import { User } from 'firebase/auth';
import Dimension from '../../../types/Dimension';
import NoteDbData from '../../../types/NoteDbData';
import Nudge from '../../../types/Nudge';
import { UserContext } from '../../../contexts';
import { removeLabelFromNote } from '../../../supabase/labels';
import { deleteNote } from '../../../supabase/notes';
import CustomMd from '../../CustomMd';
import Close from '../../icons/Close';
import Ellipsis from '../../icons/Ellipsis';
import LabelButton from '../LabelButton';
import NoteForm from '../NoteForm/NoteForm';
import getTwBgClasses from '../../../utils/getTwBgClasses';

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
  const currentUser = useContext(UserContext) as User;
  const [hover, setHover] = useState(false);
  const { title, content, labels, note_id, bg_color } = note;

  const [editFormOpen, setEditFormOpen] = useState(false);

  const deleteLabel = (label: string) => {
    removeLabelFromNote(note_id, label, currentUser.uid);
  };

  const labelButtons = labels.map((label) => (
    <LabelButton label={label} removeLabel={deleteLabel} key={nanoid()} />
  ));
  const deleteButton = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteNote(note_id);
      }}
      className="delete-button absolute -right-3 -top-3 rounded-full bg-neutral-200 p-1 outline outline-1 outline-neutral-400 hover:bg-neutral-300 dark:bg-neutral-800 dark:outline-neutral-800 dark:hover:bg-neutral-700"
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
    <Dialog.Root open={editFormOpen} onOpenChange={setEditFormOpen}>
      <Dialog.Trigger asChild>
        <article
          ref={card}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate(${nudge.left}px, ${nudge.top}px)`,
            width: colWidth,
          }}
          className={`${getTwBgClasses(bg_color)} NoteCard absolute flex max-h-[480px] cursor-pointer flex-col gap-3 rounded-lg p-4 pt-2 duration-75 hover:outline hover:outline-1 hover:outline-neutral-500`}
        >
          {title && (
            <h1 className="text-lg font-semibold [&_*]:text-lg">
              <CustomMd>{title}</CustomMd>
            </h1>
          )}
          {content && <CustomMd className="flex flex-col gap-2 text-[15px]">{content}</CustomMd>}
          <div className="flex flex-wrap gap-2">{labelButtons}</div>
          <div className="add-stuffs">
            <button className="rounded-full p-1 bg-black/5 hover:bg-black/10 dark:text-white dark:bg-white/5 dark:hover:bg-white/10">
              <Ellipsis className="h-5 w-5" />
            </button>
          </div>
          {hover && deleteButton}
        </article>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/40" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <NoteForm setFormOpen={setEditFormOpen} existingNote={note} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}