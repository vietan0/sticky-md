import { useState, useContext, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import NoteUploadData from '../../../types/NoteUploadData';
import { UserContext } from '../../../contexts/UserContext';
import { createNote } from '../../../supabase/notes';
import { AllLabelsContext } from '../../../contexts/AllLabelsContext';
import LabelDbData from '../../../types/LabelDbData';
import labelExists from '../../../utils/labelExists';
import { createLabels } from '../../../supabase/labels';
import { createNotesLabels } from '../../../supabase/notes_labels';
import NoteDbData from '../../../types/NoteDbData';
import Color from '../../icons/Color';
import Ellipsis from '../../icons/Ellipsis';
import LabelButton from '../LabelButton';
import Label from '../../icons/Label';
import LabelSuggestions from './LabelSuggestions';

export default function NoteForm({ setIsWriting }: { setIsWriting: (val: boolean) => void }) {
  const currentUser = useContext(UserContext) as User;
  const [title, setTitle] = useState('');

  const contentArea = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [liveHashtagIndex, setLiveHashtagIndex] = useState(-1);

  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>([]);
  const [extractedLabel, setExtractedLabel] = useState('');

  const noteUploadData: NoteUploadData = {
    title,
    content,
    labels: labelsToAdd,
    user_id: currentUser.uid,
  };

  async function uploadToDb() {
    if (noteUploadData.title || noteUploadData.content) {
      const result = (await createNote(noteUploadData)) as NoteDbData[];
      const { note_id } = result[0];

      const newLabels = noteUploadData.labels.filter((label) => !labelExists(label, allLabels));
      createLabels(newLabels, noteUploadData.user_id);
      if (noteUploadData.labels.length > 0) {
        // if has labels, update join table
        createNotesLabels(note_id, noteUploadData.labels);
      }
    }
    setIsWriting(false); // close NoteForm
  }

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    uploadToDb();
  };

  const formKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      isRecordingLabel ? setIsRecordingLabel(false) : uploadToDb();
    }
  };

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const addToLabelList = (label_name: string) => {
    setLabelsToAdd((prev) => (prev.includes(label_name) ? prev : [...prev, label_name]));
    setIsRecordingLabel(false);
    setContent((prev: string) => prev.slice(0, liveHashtagIndex));
    contentArea.current?.focus();
  };

  const filteredLabels = allLabels.filter(({ label_name }) => label_name.match(extractedLabel));
  let labelsList = [...filteredLabels] as (LabelDbData | string)[];
  if (extractedLabel) {
    labelsList = [...filteredLabels, extractedLabel];
  }
  const [focusedLabelIndex, setFocusedLabelIndex] = useState(0);

  const [cursorIndex, setCursorIndex] = useState(0);
  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCursorIndex((prev: number) =>
      contentArea.current ? contentArea.current.selectionStart : prev,
    );
  };

  const contentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '#') setIsRecordingLabel(true);
    if (e.key === 'Backspace') {
      if (content.charAt(content.length - 1) === '#') setIsRecordingLabel(false);
    }
    if ((e.key === 'Tab' || e.key === 'Enter') && isRecordingLabel) {
      e.preventDefault();
      // hit 'Tab' will add label to list
      if (extractedLabel) {
        // when there's text after # and LabelSuggestion is showing
        setLabelsToAdd((prev: string[]) => {
          // suggested label have higher priority over extracted label
          const target = labelsList.length > 0 ? labelsList[focusedLabelIndex] : extractedLabel;
          if (typeof target === 'string') {
            return prev.includes(target) ? prev : [...prev, target];
          } else {
            return prev.includes(target.label_name) ? prev : [...prev, target.label_name];
          }
        });
        setIsRecordingLabel(false);
        setContent((prev: string) => prev.slice(0, liveHashtagIndex));
      } else {
        // when only # is typed and there's no text after it
        setLabelsToAdd((prev: string[]) => {
          const target = labelsList[focusedLabelIndex] as LabelDbData;
          return prev.includes(target.label_name) ? prev : [...prev, target.label_name];
        });
        setIsRecordingLabel(false);
        setContent((prev: string) => prev.slice(0, liveHashtagIndex));
      }
    }
    if (e.key === 'Escape' || e.key === ' ') setIsRecordingLabel(false);

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already first, cycle up to last index
        (prev: number) => (prev === 0 ? labelsList.length - 1 : prev - 1),
      );
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already last, cycle to top
        (prev: number) => (prev >= labelsList.length - 1 ? 0 : prev + 1),
      );
    }
  };

  useEffect(() => {
    if (cursorIndex <= liveHashtagIndex) setIsRecordingLabel(false);
  }, [cursorIndex, liveHashtagIndex]);

  useEffect(() => {
    // update extractedLabel
    setExtractedLabel((_prev: string) => {
      return isRecordingLabel ? content.slice(liveHashtagIndex + 1, content.length) : '';
    });
  }, [isRecordingLabel, content, liveHashtagIndex]);

  useEffect(() => {
    // update liveHashtagIndex
    setLiveHashtagIndex(isRecordingLabel ? cursorIndex : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordingLabel]);

  useEffect(() => {
    // update focused row in LabelSuggestions
    setFocusedLabelIndex(0);
  }, [labelsList.length]);

  const [mirrorStyles, setMirrorStyles] = useState({ left: 0, top: 0, width: 0, height: 0 });
  useEffect(() => {
    // initial render
    // 1. setup mirror div position
    const { x, y, width, height } = contentArea.current?.getBoundingClientRect() as DOMRect;
    setMirrorStyles({ left: x, top: y, width, height });

    // 2. listen to cursor
    contentArea.current?.addEventListener('selectionchange', () => {
      setCursorIndex((prev: number) =>
        contentArea.current ? contentArea.current.selectionStart : prev,
      );
    });
  }, []);

  const liveHashtag = useRef<HTMLSpanElement>(null);
  const mirroredContent = content.split('').map((char, i) => {
    return char === '#' && i === liveHashtagIndex ? (
      <span ref={liveHashtag} className="outline outline-1 outline-pink-500" key={i}>
        {char}
      </span>
    ) : (
      <span key={i}>{char}</span>
    );
  });

  const [suggestionPos, setSuggestionPos] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // update position of # span based on liveHashtagIndex
    if (liveHashtag.current) {
      const { left, top, width, height } = liveHashtag.current.getBoundingClientRect();
      setSuggestionPos({ left: left + width, top: top + height });
    }
  }, [liveHashtagIndex]);

  return (
    <form
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={formSubmit}
      onKeyDown={formKeyDown}
      className="mx-auto mb-8 flex max-w-xl flex-col gap-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900"
    >
      <input
        type="text"
        tabIndex={1}
        placeholder="Title"
        value={title}
        onChange={titleChange}
        className="input-global font-semibold focus:outline-none"
      />
      <textarea
        rows={3}
        autoFocus
        tabIndex={2}
        placeholder="Write something…"
        ref={contentArea}
        value={content}
        onChange={contentChange}
        onKeyDown={contentKeyDown}
        className="input-global resize-none py-2 focus:outline-none"
      />
      <div
        id="mirror"
        style={mirrorStyles}
        className="pointer-events-none invisible absolute whitespace-pre py-2"
      >
        {mirroredContent}
      </div>
      <LabelSuggestions
        focusedLabelIndex={focusedLabelIndex}
        labelsList={labelsList}
        addToLabelList={addToLabelList}
        suggestionPos={suggestionPos}
      />
      <div id="labels" className="flex gap-2">
        {labelsToAdd.map((label) => (
          <LabelButton key={label} label={label} />
        ))}
      </div>
      <div className="add-stuffs flex items-center gap-2">
        <button
          type="button"
          tabIndex={4}
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800 focus:bg-slate-800"
        >
          <Label className="h-5 w-5" />
        </button>
        <button
          type="button"
          tabIndex={5}
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800 focus:bg-slate-800"
        >
          <Color className="h-5 w-5" />
        </button>
        <button
          type="button"
          tabIndex={6}
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800 focus:bg-slate-800"
        >
          <Ellipsis className="h-5 w-5" />
        </button>
        <button
          type="submit"
          tabIndex={3}
          className="ml-auto rounded-full px-4 py-2 leading-5 outline outline-1 outline-slate-800 hover:bg-slate-800 focus:bg-slate-800"
        >
          Done
        </button>
      </div>
    </form>
  );
}
