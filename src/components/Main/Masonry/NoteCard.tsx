import type { User } from 'firebase/auth';
import type { Bg_Color } from '../../../types/Bg_Color';
import type Dimension from '../../../types/Dimension';
import type NoteDbData from '../../../types/NoteDbData';
import type NoteUploadData from '../../../types/NoteUploadData';
import type Nudge from '../../../types/Nudge';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../contexts';
import usePostDb from '../../../hooks/usePostDb';
import useRecordLabelButton from '../../../hooks/useRecordLabelButton';
import { removeLabelFromNote } from '../../../supabase/labels';
import { deleteNote } from '../../../supabase/notes';
import bgVariantClass from '../../../utils/bgVariantClass';
import cn from '../../../utils/cn';
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      className={`
        absolute -top-3 -right-3 rounded-full bg-foreground/20 p-1
        hover:bg-foreground/40
      `}
      onClick={(e) => {
        e.stopPropagation();
        deleteNoteMutation.mutate(note_id);
      }}
      title="Delete note"
    >
      <Close className="size-4 stroke-white stroke-2" />
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
    <>
      <article
        className={cn(
          bgVariantClass[bg_color],
          `
            cursor-pointer rounded-lg transition-transform duration-75
            hover:outline-1 hover:outline-default-400
            dark:hover:outline-default-100
          `,
        )}
        onClick={onOpen}
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
        <div className="flex flex-col gap-3 p-4 pt-2">
          {title && (
            <CustomMd className={`
              max-h-20 overflow-y-auto text-lg font-semibold
              **:text-lg
            `}
            >
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
      <Modal
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          {onClose => <NoteForm existingNote={note} onClose={onClose} />}
        </ModalContent>
      </Modal>
    </>
  );
}
