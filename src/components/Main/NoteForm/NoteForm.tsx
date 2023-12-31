import { User } from 'firebase/auth';
import { DateTime } from 'luxon';
import { useContext, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../contexts';
import usePostDb from '../../../hooks/usePostDb';
import useRecordLabel from '../../../hooks/useRecordLabel';
import useRecordLabelButton from '../../../hooks/useRecordLabelButton';
import NoteDbData from '../../../types/NoteDbData';
import NoteUploadData from '../../../types/NoteUploadData';
import LabelButton from '../LabelButton';
import { Bg_Color } from '../../../types/Bg_Color';
import getTwBgClasses from '../../../utils/getTwBgClasses';
import Toolbar from '../Toolbar/Toolbar';
import LinkPreviews from '../LinkPreviews';
import ToggleMdRaw from './ToggleMdRaw';
import ImagesContainer from './ImagesContainer';

export default function NoteForm({
  setFormOpen,
  existingNote,
}: {
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingNote?: NoteDbData;
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
    setFormOpen(false); // close NoteForm
    if (existingNote) {
      // prevent duplicate requests
      if (!updateNoteMutation.isLoading) updateNoteMutation.mutate();
    } else {
      // prevent duplicate requests
      if (!createNoteMutation.isLoading) createNoteMutation.mutate();
    }
  }
  function removeLabel(target: string) {
    setLabelsToAdd((prev: string[]) => prev.filter((label) => label !== target));
  }

  return (
    <form
      ref={formRef}
      onClick={formClick}
      onSubmit={(e) => {
        e.preventDefault();
        formSubmit();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') formSubmit();
      }}
      className={`${getTwBgClasses(
        existingNote ? existingNote.bg_color : selectedBgColor,
      )} mx-auto flex max-h-[600px] overflow-y-auto w-full max-w-xl flex-col rounded-lg`}
    >
      {imageUrls.length > 0 && (
        <ImagesContainer
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          updateNoteToDb={updateNoteToDb}
        />
      )}
      <div className="NoteForm-main-content flex flex-col gap-3 p-4">
        <ToggleMdRaw
          isTitle
          value={title}
          textAreaRef={titleRef}
          formRef={formRef}
          record={titleRecord}
          existingNote={existingNote}
        >
          <TextareaAutosize
            minRows={1}
            maxRows={3}
            tabIndex={1}
            maxLength={400}
            placeholder="Title"
            className="max-h-20 w-full resize-none bg-transparent font-mono text-lg font-medium tracking-tight placeholder:text-neutral-700 focus:outline-none dark:placeholder:text-neutral-400"
          />
        </ToggleMdRaw>
        <ToggleMdRaw
          value={content}
          textAreaRef={contentRef}
          formRef={formRef}
          record={contentRecord}
          existingNote={existingNote}
        >
          <TextareaAutosize
            autoFocus
            minRows={2}
            maxRows={15}
            tabIndex={2}
            placeholder="Write something…"
            className="max-h-52 w-full resize-none bg-transparent font-mono text-sm tracking-tight placeholder:text-neutral-700 focus:outline-none dark:placeholder:text-neutral-400"
          />
        </ToggleMdRaw>
        <div className="mt-4 flex items-end justify-between gap-8">
          <div className="flex flex-wrap gap-2">
            {labelsToAdd.map((label) => (
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
              Edited {DateTime.fromISO(existingNote.last_modified_at).toRelative()}
            </p>
          )}
        </div>
        {existingNote && <LinkPreviews note={existingNote} inNoteCard={false} />}
        <Toolbar
          existingNote={existingNote}
          buttonRecord={buttonRecord}
          selectedBgColor={selectedBgColor}
          setSelectedBgColor={setSelectedBgColor}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          updateNoteToDb={updateNoteToDb}
        />
      </div>
    </form>
  );
}
