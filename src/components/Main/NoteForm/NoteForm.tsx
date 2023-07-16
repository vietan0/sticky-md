import { useState, useContext, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { User } from 'firebase/auth';
import NoteDbData from '../../../types/NoteDbData';
import NoteUploadData from '../../../types/NoteUploadData';
import { UserContext } from '../../../contexts/UserContext';
import Color from '../../icons/Color';
import Ellipsis from '../../icons/Ellipsis';
import Label from '../../icons/Label';
import LabelButton from '../LabelButton';
import useRecordingLabel from '../../../hooks/useRecordingLabel';
import useSuggestionsWithSearch from '../../../hooks/useSuggestionsWithSearch';
import usePostDb from '../../../hooks/usePostDb';
import LabelSuggestionsWithSearch from './LabelSuggestionsWithSearch';
import Mirror from './Mirror';
import ToggleMdRaw from './ToggleMdRaw';

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

  const titleRecord = useRecordingLabel(
    title,
    setTitle,
    titleRef,
    setLabelsToAdd,
    formRef,
    existingNote,
  );
  const contentRecord = useRecordingLabel(
    content,
    setContent,
    contentRef,
    setLabelsToAdd,
    formRef,
    existingNote,
  );

  const noteUploadData: NoteUploadData = {
    title: title.trim(),
    content: content.trim(),
    labels: labelsToAdd,
    user_id: currentUser.uid,
  };
  const { updateNoteToDb, insertNoteToDb } = usePostDb(noteUploadData, existingNote);
  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormOpen(false); // close NoteForm
    existingNote ? updateNoteToDb() : insertNoteToDb();
  }
  function formKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Escape') existingNote ? updateNoteToDb() : insertNoteToDb();
  }

  const { labelSearchButton, searchingForLabel, setSearchingForLabel, suggestionWithSearchPos } =
    useSuggestionsWithSearch(formRef, labelsToAdd, existingNote);

  function removeLabel(target: string) {
    setLabelsToAdd((prev: string[]) => prev.filter((label) => label !== target));
  }

  return (
    <form
      ref={formRef}
      onClick={(e) => {
        e.stopPropagation();
        if (searchingForLabel) setSearchingForLabel(false);
      }}
      onSubmit={formSubmit}
      onKeyDown={formKeyDown}
      className="mx-auto flex w-full max-w-xl flex-col gap-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900"
    >
      <ToggleMdRaw isTitle value={title}>
        <input
          type="text"
          tabIndex={1}
          placeholder="Title"
          ref={titleRef}
          value={title}
          onKeyDown={titleRecord.handleKeyDown}
          onChange={titleRecord.handleChange}
          className="input-global font-mono text-lg font-medium tracking-tight focus:outline-none"
        />
      </ToggleMdRaw>
      <ToggleMdRaw value={content}>
        <TextareaAutosize
          minRows={2}
          maxRows={15}
          autoFocus
          tabIndex={2}
          placeholder="Write something…"
          ref={contentRef}
          value={content}
          onKeyDown={contentRecord.handleKeyDown}
          onChange={contentRecord.handleChange}
          className="input-global resize-none py-2 font-mono text-[14px] tracking-tight focus:outline-none"
        />
      </ToggleMdRaw>
      <Mirror
        value={title}
        inputRef={titleRef}
        form={formRef}
        existingNote={existingNote}
        record={titleRecord}
      />
      <Mirror
        value={content}
        inputRef={contentRef}
        form={formRef}
        existingNote={existingNote}
        record={contentRecord}
      />
      <div className="flex flex-wrap gap-2">
        {labelsToAdd.map((label) => (
          <LabelButton key={label} label={label} removeLabel={removeLabel} />
        ))}
      </div>
      <div className="add-stuffs flex items-center gap-2">
        <div
          ref={labelSearchButton}
          tabIndex={4}
          onClick={() => setSearchingForLabel((prev) => !prev)}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setSearchingForLabel((prev) => !prev);
          }}
          className="relative cursor-pointer rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-300 focus:bg-slate-300 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          <Label className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
        </div>
        {searchingForLabel && (
          <LabelSuggestionsWithSearch
            labelsToAdd={labelsToAdd}
            setLabelsToAdd={setLabelsToAdd}
            suggestionWithSearchPos={suggestionWithSearchPos}
            setSearchingForLabel={setSearchingForLabel}
          />
        )}
        <div
          tabIndex={5}
          className="cursor-pointer rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-300 focus:bg-slate-300 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          <Color className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
        </div>
        <div
          tabIndex={6}
          className="cursor-pointer rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-300 focus:bg-slate-300 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          <Ellipsis className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
        </div>
        <button
          type="submit"
          tabIndex={3}
          className="ml-auto rounded-full px-4 py-2 leading-5 text-slate-700 outline outline-1 outline-slate-300 hover:bg-slate-300 focus:bg-slate-300 dark:text-white dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          {existingNote ? 'Save' : 'Done'}
        </button>
      </div>
    </form>
  );
}
