import { User } from 'firebase/auth';
import { DateTime } from 'luxon';
import { useContext, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { UserContext } from '../../../contexts';
import usePostDb from '../../../hooks/usePostDb';
import useRecordLabel from '../../../hooks/useRecordLabel';
import useRecordLabelButton from '../../../hooks/useRecordLabelButton';
import NoteDbData from '../../../types/NoteDbData';
import NoteUploadData from '../../../types/NoteUploadData';
import Ellipsis from '../../icons/Ellipsis';
import LabelButton from '../LabelButton';
import { Bg_Color } from '../../../types/Bg_Color';
import getTwBgClasses from '../../../utils/getTwBgClasses';
import LabelSuggestions from './LabelSuggestions';
import ToggleMdRaw from './ToggleMdRaw';
import BackgroundSwatches from './BackgroundSwatches';

export default function NoteForm({
  setFormOpen,
  existingNote,
}: {
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingNote?: NoteDbData;
}) {
  const currentUser = useContext(UserContext) as User;

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>(existingNote?.labels || []);

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
  };
  const { updateNoteToDb, insertNoteToDb } = usePostDb(noteUploadData, existingNote);

  function formClick(e: React.MouseEvent<HTMLFormElement, MouseEvent>) {
    e.stopPropagation();
    if (titleRecord.isRecordingLabel) titleRecord.setIsRecordingLabel(false);
    if (contentRecord.isRecordingLabel) contentRecord.setIsRecordingLabel(false);
  }
  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormOpen(false); // close NoteForm
    existingNote ? updateNoteToDb() : insertNoteToDb();
  }
  function formKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Escape') {
      setFormOpen(false); // close NoteForm
      existingNote ? updateNoteToDb() : insertNoteToDb();
    }
  }
  function removeLabel(target: string) {
    setLabelsToAdd((prev: string[]) => prev.filter((label) => label !== target));
  }

  return (
    <form
      ref={formRef}
      onClick={formClick}
      onSubmit={formSubmit}
      onKeyDown={formKeyDown}
      className={`${getTwBgClasses(
        existingNote ? existingNote.bg_color : selectedBgColor,
      )} mx-auto flex w-full max-w-xl flex-col gap-3 rounded-lg p-4 dark:outline dark:outline-1 dark:outline-neutral-700`}
    >
      <ToggleMdRaw
        isTitle
        value={title}
        inputRef={titleRef}
        formRef={formRef}
        record={titleRecord}
        existingNote={existingNote}
      >
        <input
          type="text"
          tabIndex={1}
          placeholder="Title"
          className="w-full bg-transparent font-mono text-lg font-medium tracking-tight placeholder:text-neutral-700 focus:outline-none dark:placeholder:text-neutral-400"
        />
      </ToggleMdRaw>
      <ToggleMdRaw
        value={content}
        inputRef={contentRef}
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
          className="w-full resize-none bg-transparent font-mono text-sm tracking-tight placeholder:text-neutral-700 focus:outline-none dark:placeholder:text-neutral-400"
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
      <div className="add-stuffs flex items-center gap-2">
        <LabelSuggestions record={buttonRecord} />
        <BackgroundSwatches selectedColor={selectedBgColor} setSelectedColor={setSelectedBgColor} />
        <div className="cursor-pointer rounded-full bg-black/5 p-2 hover:bg-black/10 focus:bg-black/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/20">
          <Ellipsis className="h-5 w-5 stroke-neutral-700 dark:stroke-neutral-200" />
        </div>
        <button
          type="submit"
          className="ml-auto rounded-full bg-black/5 px-4 py-2 leading-5 text-neutral-700 hover:bg-black/10 focus:bg-black/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/20"
        >
          {existingNote ? 'Save' : 'Done'}
        </button>
      </div>
    </form>
  );
}
