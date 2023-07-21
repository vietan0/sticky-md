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

  const [selectedBgColor, setSelectedBgColor] = useState<Bg_Color>('');

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
      )} mx-auto flex w-full max-w-xl flex-col gap-3 rounded-lg p-4 outline outline-1 outline-slate-200 drop-shadow dark:outline-slate-800`}
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
          className="w-full bg-transparent font-mono text-lg font-medium tracking-tight placeholder:text-slate-700 focus:outline-none dark:placeholder:text-slate-400"
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
          className="w-full resize-none bg-transparent font-mono text-sm tracking-tight placeholder:text-slate-700 focus:outline-none dark:placeholder:text-slate-400"
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
        <div
          tabIndex={6}
          className="cursor-pointer rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-100 focus:bg-slate-200 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          <Ellipsis className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
        </div>
        <button
          type="submit"
          tabIndex={3}
          className="ml-auto rounded-full px-4 py-2 leading-5 text-slate-700 outline outline-1 outline-slate-300 hover:bg-slate-100 focus:bg-slate-200 dark:text-white dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          {existingNote ? 'Save' : 'Done'}
        </button>
      </div>
    </form>
  );
}
