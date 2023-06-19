import { useState, useContext, useRef } from 'react';
import { User } from 'firebase/auth';
import NoteUploadData from '../types/NoteUploadData';
import { UserContext } from '../contexts/UserContext';
import { createNote } from '../supabase/notes';
import { AllLabelsContext } from '../contexts/AllLabelsContext';
import LabelDbData from '../types/LabelDbData';
import labelExists from '../utils/labelExists';
import { createLabels } from '../supabase/labels';
import Color from './icons/Color';
import Ellipsis from './icons/Ellipsis';
import LabelButton from './LabelButton';
import Label from './icons/Label';
import ContentArea from './ContentArea';
import LabelSuggestions from './LabelSuggestions';

export default function WriteArea({ setIsWriting }: { setIsWriting: (val: boolean) => void }) {
  const currentUser = useContext(UserContext) as User;
  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [labelsPopupOpen, setLabelsPopupOpen] = useState(false);
  const [title, setTitle] = useState('');

  const contentArea = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [contentHashtagPos, setContentHashtagPos] = useState(-1);
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>([]);
  const [extractedLabel, setExtractedLabel] = useState('');

  const noteUploadData: NoteUploadData = {
    title,
    content,
    labels: labelsToAdd,
    user_id: currentUser.uid,
  };

  function uploadToDb() {
    if (noteUploadData.title !== '' || noteUploadData.content !== '') {
      createNote(noteUploadData);
      const newLabels = noteUploadData.labels.filter((label) => !labelExists(label, allLabels));
      createLabels(newLabels, noteUploadData.user_id);
      setIsWriting(false); // close WriteArea
    }
  }

  const formHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    uploadToDb();
  };

  const formHandleEscape = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      if (!labelsPopupOpen) {
        uploadToDb();
      } else setLabelsPopupOpen(false);
    }
  };

  const titleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const addToLabelList = (label_name: string) => {
    setLabelsToAdd(
      (prev) => (prev.includes(label_name) ? prev : [...prev, label_name]),
      // ternary is to avoid duplicates
    );
    setIsRecordingLabel(false);
    setLabelsPopupOpen(false);
    setContent((prev: string) => prev.slice(0, contentHashtagPos));
    setExtractedLabel('');
    contentArea.current?.focus();
  };

  const filteredLabels = allLabels.filter(({ label_name }) => label_name.match(extractedLabel));
  let labelsList = [...filteredLabels] as (LabelDbData | string)[];
  if (extractedLabel) {
    labelsList = [...filteredLabels, extractedLabel];
  }
  const [focusedLabelIndex, setFocusedLabelIndex] = useState(0);

  return (
    <form
      action=""
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={formHandleSubmit}
      onKeyDown={formHandleEscape}
      className="relative mx-auto mb-8 flex max-w-xl flex-col gap-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900"
    >
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={title}
        onChange={titleHandleChange}
        className="input-global font-semibold focus:outline-none"
      />
      <ContentArea
        content={content}
        setContent={setContent}
        extractedLabel={extractedLabel}
        setExtractedLabel={setExtractedLabel}
        labelsToAdd={labelsToAdd}
        setLabelsToAdd={setLabelsToAdd}
        isRecordingLabel={isRecordingLabel}
        setIsRecordingLabel={setIsRecordingLabel}
        setLabelsPopupOpen={setLabelsPopupOpen}
        contentHashtagPos={contentHashtagPos}
        setContentHashtagPos={setContentHashtagPos}
        contentArea={contentArea}
        focusedLabelIndex={focusedLabelIndex}
        setFocusedLabelIndex={setFocusedLabelIndex}
        labelsList={labelsList}
      />
      {labelsPopupOpen && (
        <LabelSuggestions
          focusedLabelIndex={focusedLabelIndex}
          labelsList={labelsList}
          addToLabelList={addToLabelList}
        />
      )}
      <div id="labels" className="flex gap-2">
        {labelsToAdd.map((label) => (
          <LabelButton key={label} label={label} />
        ))}
      </div>
      <div className="add-stuffs flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          <Label className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          <Color className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          <Ellipsis className="h-5 w-5" />
        </button>
        <button
          type="submit"
          className="ml-auto rounded-full px-4 py-2 leading-5 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </form>
  );
}
