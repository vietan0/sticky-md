import type { User } from 'firebase/auth';
import type { Bg_Color } from '../../../types/Bg_Color';
import type Dimension from '../../../types/Dimension';
import type NoteDbData from '../../../types/NoteDbData';
import type NoteUploadData from '../../../types/NoteUploadData';
import type Nudge from '../../../types/Nudge';
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../contexts';
import usePostDb from '../../../hooks/usePostDb';
import useRecordLabelButton from '../../../hooks/useRecordLabelButton';
import { removeLabelFromNote } from '../../../supabase/labels';
import { deleteNote } from '../../../supabase/notes';
import getTwBgClasses from '../../../utils/getTwBgClasses';
import shallowCompare from '../../../utils/shallowCompare';
import CustomMd from '../../CustomMd';
import Close from '../../icons/Close';
import LabelButton from '../LabelButton';
import LinkPreviews from '../LinkPreviews';
import ImagesContainer from '../NoteForm/ImagesContainer';
import NoteForm from '../NoteForm/NoteForm';
import Toolbar from '../Toolbar/Toolbar';

export default function NoteCard({
  note,
  colNum,
  colWidth,
  setAllCardDims,
  i,
  nudge,
  allNotes,
  lefts,
  abs,
}: {
  note: NoteDbData;
  colNum: number;
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
  const { title, content, labels, note_id, bg_color, image_urls } = note;
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>(labels);
  const buttonRecord = useRecordLabelButton(labelsToAdd, setLabelsToAdd);
  const [selectedBgColor, setSelectedBgColor] = useState<Bg_Color>(bg_color);
  const [imageUrls, setImageUrls] = useState<string[]>(image_urls);
  const [editFormOpen, setEditFormOpen] = useState(false);

  const noteUploadData: NoteUploadData = {
    title,
    content,
    labels: labelsToAdd,
    user_id: currentUser?.uid,
    bg_color: selectedBgColor,
    image_urls: imageUrls,
  };

  const { updateNoteToDb } = usePostDb(noteUploadData, note);
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: (note_id: string) => deleteNote(note_id),
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  const deleteLabelMutation = useMutation({
    mutationFn: (label: string) => removeLabelFromNote(note_id, label, currentUser.uid),
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  const deleteLabel = (label: string) => {
    deleteLabelMutation.mutate(label);
  };

  const labelButtons = labels.map(label => (
    <LabelButton key={nanoid()} label={label} removeLabel={deleteLabel} />
  ));

  const deleteButton = (
    <button
      className="delete-button absolute -right-3 -top-3 rounded-full bg-black/30 p-1 hover:bg-black/50 dark:bg-white/20 dark:hover:bg-white/40"
      onClick={(e) => {
        e.stopPropagation();
        deleteNoteMutation.mutate(note_id);
      }}
      title="Delte note"
    >
      <Close className="h-4 w-4 stroke-white stroke-2" />
    </button>
  );

  const card = useRef<HTMLDivElement>(null);

  function updateAllCardDims() {
    if (card.current) {
      const rect = card.current.getBoundingClientRect();

      setAllCardDims((prev) => {
        const dup = [...prev];

        // handle delete card
        const deleteTargetIndex = prev.findIndex((dim) => {
          const ids = allNotes.map(n => n.note_id);

          return !ids.includes(dim.note_id);
        });

        if (deleteTargetIndex !== -1)
          dup.splice(deleteTargetIndex, 1);

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

        if (shallowCompare(prev, dup))
          return prev;

        return dup;
      });
    }
  }

  function handleTransitionEnd(e: React.TransitionEvent<HTMLElement>) {
    // based on https://stackoverflow.com/a/73421669/17673377
    if (e.target === e.currentTarget)
      updateAllCardDims();
  }

  useEffect(() => {
    updateAllCardDims();
  }, [allNotes]);

  return (
    <Dialog.Root onOpenChange={setEditFormOpen} open={editFormOpen}>
      <Dialog.Trigger asChild>
        <article
          className={`${getTwBgClasses(
            bg_color,
          )} cursor-pointer rounded-lg transition-transform duration-75 hover:outline hover:outline-1 hover:outline-neutral-500 dark:hover:outline-neutral-500`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTransitionEnd={handleTransitionEnd}
          ref={card}
          style={{
            transform: colNum > 1 ? `translate(${nudge.left}px, ${nudge.top}px)` : '',
            width: colNum > 1 ? colWidth : '100%',
            position: colNum > 1 ? 'absolute' : 'initial',
          }}
        >
          <ImagesContainer imageUrls={image_urls} inNoteCard setImageUrls={setImageUrls} />
          <div className="NoteCard-main-content flex flex-col gap-3 p-4 pt-2">
            {title && (
              <CustomMd className="max-h-20 overflow-y-auto text-lg font-semibold [&_*]:text-lg">
                {title}
              </CustomMd>
            )}
            {content && (
              <CustomMd className="flex max-h-52 flex-col gap-2 overflow-y-auto text-[15px]">
                {content}
              </CustomMd>
            )}
            <div className="flex flex-wrap gap-2">{labelButtons}</div>
            <Toolbar
              buttonRecord={buttonRecord}
              existingNote={note}
              imageUrls={imageUrls}
              inNoteCard
              opacity={hover ? '' : 'opacity-0'}
              selectedBgColor={selectedBgColor}
              setImageUrls={setImageUrls}
              setSelectedBgColor={setSelectedBgColor}
              updateNoteToDb={updateNoteToDb}
            />
          </div>
          <LinkPreviews note={note} />
          {hover && deleteButton}
        </article>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-black/40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-30 w-full max-w-xl translate-x-[-50%] translate-y-[-50%] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <NoteForm existingNote={note} setFormOpen={setEditFormOpen} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
