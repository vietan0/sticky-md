import { useState, useContext, useRef } from 'react';
import { User } from 'firebase/auth';
import { Root, Viewport, Scrollbar, Thumb, Corner } from '@radix-ui/react-scroll-area';
import NoteUploadData from '../types/NoteUploadData';
import { UserContext } from '../contexts/UserContext';
import { createNote } from '../supabase/notes';
import { AllLabelsContext } from '../contexts/AllLabelsContext';
import Color from './icons/Color';
import Ellipsis from './icons/Ellipsis';
import LabelButton from './LabelButton';
import Label from './icons/Label';
import ContentArea from './ContentArea';

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

  const formHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNote(noteUploadData); // submit
  };

  const formHandleEscape = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      if (!labelsPopupOpen) {
        createNote(noteUploadData); // submit
        setIsWriting(false); // close WriteArea
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

  const extractedLabelIsUnique = allLabels.some(({ label_name }) => label_name === extractedLabel);

  const addNewLabelButton = (
    <button
      type="button"
      onClick={() => addToLabelList(extractedLabel)}
      className="px-4 py-2 text-left text-[13px] hover:bg-slate-700 focus:bg-slate-800 focus:outline-none"
    >
      + Add <span className="font-bold">{extractedLabel}</span>
    </button>
  );

  const labelsPopup = (
    <Root
      style={{ position: 'absolute' }} // to override Radix
      className="left-80 top-20 max-h-64 w-48 overflow-hidden rounded bg-slate-100 outline outline-1 outline-slate-400 drop-shadow dark:bg-slate-900 dark:outline-slate-700"
    >
      <Viewport className="h-full w-full rounded">
        <div autoFocus className="grid grid-cols-1 divide-y divide-slate-700 py-1">
          {allLabels
            .filter(({ label_name }) => label_name.match(extractedLabel))
            .map(({ label_name }) => (
              <button
                key={label_name}
                type="button"
                onClick={() => addToLabelList(label_name)}
                className="px-4 py-2 text-left text-[13px] hover:bg-slate-700 focus:bg-slate-800 focus:outline-none"
              >
                {label_name}
              </button>
            ))}
          {extractedLabel && !extractedLabelIsUnique && addNewLabelButton}
        </div>
      </Viewport>
      <Scrollbar
        orientation="vertical"
        className="flex touch-none select-none bg-slate-100 p-0.5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col dark:bg-slate-900"
      >
        <Thumb className="relative flex-1 rounded-full bg-slate-400  before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] dark:bg-slate-600" />
      </Scrollbar>
      <Corner className="bg-slate-800" />
    </Root>
  );

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
        labelsPopupOpen={labelsPopupOpen}
        setLabelsPopupOpen={setLabelsPopupOpen}
        contentHashtagPos={contentHashtagPos}
        setContentHashtagPos={setContentHashtagPos}
        contentArea={contentArea}
      />
      {labelsPopupOpen && labelsPopup}
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
