import type { User } from 'firebase/auth';
import type { Bg_Color } from '../../../types/Bg_Color';
import type NoteDbData from '../../../types/NoteDbData';
import type NoteUploadData from '../../../types/NoteUploadData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useContext, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { UserContext } from '../../../contexts';
import usePostDb from '../../../hooks/usePostDb';
import useRecordLabel from '../../../hooks/useRecordLabel';
import useRecordLabelButton from '../../../hooks/useRecordLabelButton';
import bgVariantClass from '../../../utils/bgVariantClass';
import cn from '../../../utils/cn';
import LabelButton from '../LabelButton';
import LinkPreviews from '../LinkPreviews';
import Toolbar from '../Toolbar/Toolbar';
import ImagesContainer from './ImagesContainer';
import ToggleMdRaw from './ToggleMdRaw';

export default function NoteForm({
  existingNote,
  onClose,
}: {
  existingNote?: NoteDbData;
  onClose: () => void;
}) {
  const currentUser = useContext(UserContext) as User;
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>(existingNote?.labels || []);
  const [imageUrls, setImageUrls] = useState<string[]>(existingNote?.image_urls || []);
  const titleRecord = useRecordLabel(setTitle, titleRef, labelsToAdd, setLabelsToAdd);
  const contentRecord = useRecordLabel(setContent, contentRef, labelsToAdd, setLabelsToAdd);
  const buttonRecord = useRecordLabelButton(labelsToAdd, setLabelsToAdd);
  const [selectedBgColor, setSelectedBgColor] = useState<Bg_Color>(existingNote?.bg_color || '');

  const noteUploadData: NoteUploadData = {
    title: title.trim(),
    content: content.trim(),
    labels: labelsToAdd,
    user_id: currentUser.uid,
    bg_color: selectedBgColor,
    image_urls: imageUrls,
  };

  const { insertNoteToDb, updateNoteToDb } = usePostDb(noteUploadData, existingNote);
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: insertNoteToDb,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      // refetch labels too (later)
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNoteToDb,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      // refetch labels too (later)
    },
  });

  function formClick(e: React.MouseEvent<HTMLFormElement, MouseEvent>) {
    e.stopPropagation();
  }

  function formSubmit() {
    onClose();

    if (existingNote) {
      // prevent duplicate requests
      if (!updateNoteMutation.isLoading)
        updateNoteMutation.mutate();
    }
    else {
      // prevent duplicate requests
      if (!createNoteMutation.isLoading)
        createNoteMutation.mutate();
    }
  }

  function removeLabel(target: string) {
    setLabelsToAdd((prev: string[]) => prev.filter(label => label !== target));
  }

  return (
    <form
      className={cn(
        bgVariantClass[existingNote ? existingNote.bg_color : selectedBgColor],
        `mx-auto flex max-h-[600px] w-full max-w-xl flex-col overflow-y-auto rounded-lg`,
      )}
      onClick={formClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape')
          formSubmit();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        formSubmit();
      }}
      ref={formRef}
    >
      {imageUrls.length > 0 && (
        <ImagesContainer
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          updateNoteToDb={updateNoteToDb}
        />
      )}
      <div className="flex flex-col gap-3 p-4">
        <ToggleMdRaw
          existingNote={existingNote}
          formRef={formRef}
          isTitle
          record={titleRecord}
          textAreaRef={titleRef}
          value={title}
        >
          <TextareaAutosize
            className={`
              max-h-20 w-full resize-none bg-transparent font-mono text-lg font-medium
              tracking-tight
              placeholder:text-neutral-700
              focus:outline-hidden
              dark:placeholder:text-neutral-400
            `}
            maxLength={400}
            maxRows={3}
            minRows={1}
            placeholder="Title"
            tabIndex={1}
          />
        </ToggleMdRaw>
        <ToggleMdRaw
          existingNote={existingNote}
          formRef={formRef}
          record={contentRecord}
          textAreaRef={contentRef}
          value={content}
        >
          <TextareaAutosize
            autoFocus
            className={`
              max-h-52 w-full resize-none bg-transparent font-mono text-sm tracking-tight
              placeholder:text-neutral-700
              focus:outline-hidden
              dark:placeholder:text-neutral-400
            `}
            maxRows={15}
            minRows={2}
            placeholder="Write something…"
            tabIndex={2}
          />
        </ToggleMdRaw>
        <div className="mt-4 flex items-end justify-between gap-8">
          <div className="flex flex-wrap gap-2">
            {labelsToAdd.map(label => (
              <LabelButton key={label} label={label} removeLabel={removeLabel} />
            ))}
          </div>
          {existingNote && (
            <p
              className="min-w-fit text-right text-xs"
              title={DateTime.fromISO(existingNote.last_modified_at).toLocaleString(
                DateTime.DATETIME_MED,
              )}
            >
              Edited
              {' '}
              {DateTime.fromISO(existingNote.last_modified_at).toRelative()}
            </p>
          )}
        </div>
        {existingNote && <LinkPreviews inNoteCard={false} note={existingNote} />}
        <Toolbar
          buttonRecord={buttonRecord}
          existingNote={existingNote}
          imageUrls={imageUrls}
          selectedBgColor={selectedBgColor}
          setImageUrls={setImageUrls}
          setSelectedBgColor={setSelectedBgColor}
          updateNoteToDb={updateNoteToDb}
        />
      </div>
    </form>
  );
}
