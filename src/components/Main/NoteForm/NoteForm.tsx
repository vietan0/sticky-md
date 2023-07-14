import { useState, useContext, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { User } from 'firebase/auth';
import LabelDbData from '../../../types/LabelDbData';
import NoteDbData from '../../../types/NoteDbData';
import NoteUploadData from '../../../types/NoteUploadData';
import { UserContext } from '../../../contexts/UserContext';
import { AllLabelsContext } from '../../../contexts/AllLabelsContext';
import { createLabels, getLabelId, getLabelIds } from '../../../supabase/labels';
import { createNote, updateNote } from '../../../supabase/notes';
import { createNotesLabels, deleteNotesLabels } from '../../../supabase/notes_labels';
import labelExists from '../../../utils/labelExists';
import Color from '../../icons/Color';
import Ellipsis from '../../icons/Ellipsis';
import Label from '../../icons/Label';
import LabelButton from '../LabelButton';
import md from '../../../utils/simple-markdown-config';
import LabelSuggestions from './LabelSuggestions';
import LabelSuggestionsWithSearch from './LabelSuggestionsWithSearch';

export default function NoteForm({
  setFormOpen,
  existingNote,
}: {
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingNote?: NoteDbData;
}) {
  const currentUser = useContext(UserContext) as User;
  const [title, setTitle] = useState(existingNote?.title || '');

  const form = useRef<HTMLFormElement>(null);
  const contentArea = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(existingNote?.content || '');
  const [liveHashtagIndex, setLiveHashtagIndex] = useState(-1);

  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>(existingNote?.labels || []);
  const [extractedLabel, setExtractedLabel] = useState('');

  const noteUploadData: NoteUploadData = {
    title: title.trim(),
    content: content.trim(),
    labels: labelsToAdd,
    user_id: currentUser.uid,
  };

  async function updateNoteToDb() {
    const { title, content, note_id, labels: existingLabels } = existingNote as NoteDbData;
    if (
      noteUploadData.title !== title ||
      noteUploadData.content !== content ||
      noteUploadData.labels !== existingLabels
    ) {
      // only do this if there's something changed
      // 1. update to notes
      await updateNote(note_id, { ...noteUploadData, last_modified_at: new Date().toISOString() });
      // 2. update to labels
      const newLabels = labelsToAdd.filter((label) => !labelExists(label, allLabels));
      await createLabels(newLabels, currentUser.uid);
      // 3. update to notes_labels
      // these labels aren't in note before editing (but exist in Supabase)
      const newLabelsOfNote = labelsToAdd.filter((newLabel) => !existingLabels.includes(newLabel));
      // get their ids to insert new rows to notes_labels
      newLabelsOfNote.forEach(async (newLabel) => {
        const label_id = await getLabelId(newLabel, currentUser.uid);
        await createNotesLabels(note_id, [label_id], currentUser.uid);
      });
      existingLabels.forEach(async (existingLabel) => {
        if (!labelsToAdd.includes(existingLabel)) {
          // an old label was removed --> delete from notes_labels
          await deleteNotesLabels(note_id, existingLabel, currentUser.uid);
        }
      });
    }
  }

  async function insertNoteToDb() {
    if (noteUploadData.title || noteUploadData.content) {
      // 1. insert to notes
      const result = (await createNote(noteUploadData)) as NoteDbData[];
      const { note_id } = result[0];

      if (labelsToAdd.length > 0) {
        // 2. insert to labels
        const newLabels = labelsToAdd.filter((label) => !labelExists(label, allLabels));
        await createLabels(newLabels, noteUploadData.user_id);

        // 3. insert to notes_labels
        const labelIds = (await getLabelIds(labelsToAdd, currentUser.uid)) as string[];
        await createNotesLabels(note_id, labelIds, noteUploadData.user_id);
      }
    }
  }

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormOpen(false); // close NoteForm
    existingNote ? updateNoteToDb() : insertNoteToDb();
  };

  const formKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      if (isRecordingLabel) setIsRecordingLabel(false);
      else {
        existingNote ? updateNoteToDb() : insertNoteToDb();
      }
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

  const filteredLabels = allLabels.filter(({ label_name }) => {
    const backslashMatches = extractedLabel.match(/\\+$/);
    if (backslashMatches) {
      // if last character is a backslash
      const backslashCount = backslashMatches[0].length;
      // if there's an odd number of backslash (which mean unescaped), make it even by adding another one right after
      if (backslashCount % 2 === 1) return label_name.match(extractedLabel + '\\');
    }
    return label_name.match(extractedLabel);
  });
  let labelsList = [...filteredLabels] as (LabelDbData | string)[];
  if (extractedLabel) {
    labelsList = [...filteredLabels, extractedLabel];
  }
  const [focusedLabelIndex, setFocusedLabelIndex] = useState(0);

  const [cursorIndex, setCursorIndex] = useState(0);
  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const newCursorIndex = contentArea.current?.selectionStart as number;
    setCursorIndex(newCursorIndex);
    setLiveHashtagIndex((prev) => {
      if (prev === -1) {
        if (isRecordingLabel) return newCursorIndex >= 1 ? newCursorIndex - 1 : 0;
        return -1;
      }
      return isRecordingLabel ? prev : -1;
    });
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

    if (e.key === 'ArrowUp' && isRecordingLabel) {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already first, cycle up to last index
        (prev: number) => (prev === 0 ? labelsList.length - 1 : prev - 1),
      );
    }
    if (e.key === 'ArrowDown' && isRecordingLabel) {
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
    setExtractedLabel(() =>
      isRecordingLabel ? content.slice(liveHashtagIndex + 1, content.length) : '',
    );
  }, [isRecordingLabel, content, liveHashtagIndex]);

  useEffect(() => {
    // update focused row in LabelSuggestions
    setFocusedLabelIndex(0);
  }, [labelsList.length]);

  const [mirrorPos, setMirrorPos] = useState({ width: 0, height: 0, top: 0 });
  useEffect(() => {
    // initial render
    // 1. setup mirror div position
    function syncMirror() {
      if (contentArea.current && form.current) {
        const { width, height, top: textareaTop } = contentArea.current.getBoundingClientRect();
        const { top: formTop } = form.current.getBoundingClientRect();
        // when normal, mirror's (0, 0) is document's corner
        // when in dialog, mirror's (0, 0) is form's corner (because of how Radix works)
        setMirrorPos({
          width,
          height,
          top: existingNote ? textareaTop - formTop : textareaTop,
        });
      }
    }
    syncMirror();

    // if editing existingNote, make cursor appear at the end
    contentArea.current?.setSelectionRange(
      contentArea.current.value.length,
      contentArea.current.value.length,
    );

    // sync position when resize
    window.addEventListener('resize', syncMirror);

    // 2. listen to cursor
    contentArea.current?.addEventListener('selectionchange', () => {
      setCursorIndex((prev: number) =>
        contentArea.current ? contentArea.current.selectionStart : prev,
      );
    });

    return () => {
      window.removeEventListener('resize', syncMirror);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liveHashtag = useRef<HTMLSpanElement>(null);
  const mirroredContent = content.split('').map((char, i) => {
    return char === '#' && i === liveHashtagIndex ? (
      <span ref={liveHashtag} className="h-6" key={i}>
        {char}
      </span>
    ) : (
      <span key={i} className="h-6 whitespace-pre-wrap">
        {char}
      </span>
    );
  });

  const [suggestionPos, setSuggestionPos] = useState({ left: 0, top: 0 });
  function syncSuggestionWithSearchPos() {
    // position LabelSuggestionsWithSearch relative to its trigger button
    if (labelSearchButton.current && form.current) {
      const { left, bottom } = labelSearchButton.current.getBoundingClientRect();
      const { top: formTop, left: formLeft } = form.current.getBoundingClientRect();
      setSuggestionWithSearchPos(
        existingNote
          ? { left: left - formLeft, top: bottom - formTop + 16 }
          : { left, top: bottom + 16 },
      );
    }
  }
  useEffect(() => {
    // update position of # span based on liveHashtag's position
    if (liveHashtag.current && form.current) {
      const { right: hashtagRight, bottom: hashtagBottom } =
        liveHashtag.current.getBoundingClientRect();
      const { top: formTop, left: formLeft } = form.current.getBoundingClientRect();

      setSuggestionPos(
        existingNote
          ? { left: hashtagRight - formLeft, top: hashtagBottom - formTop }
          : { left: hashtagRight, top: hashtagBottom },
      );
    } else setSuggestionPos({ left: 0, top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveHashtagIndex]);

  const labelSearchButton = useRef<HTMLDivElement>(null);
  const [searchingForLabel, setSearchingForLabel] = useState(false);
  const [suggestionWithSearchPos, setSuggestionWithSearchPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    window.addEventListener('resize', syncSuggestionWithSearchPos);
    return () => {
      window.removeEventListener('resize', syncSuggestionWithSearchPos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    syncSuggestionWithSearchPos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelsToAdd]);

  function removeLabel(target: string) {
    setLabelsToAdd((prev: string[]) => prev.filter((label) => label !== target));
  }

  const [displayMd, setDisplayMd] = useState(true);
  let renderedContent;
  if (existingNote) {
    // open form from card
    // 1. markdown -- click --> raw
    if (displayMd)
      renderedContent = (
        <div className="md-content cursor-pointer" onClick={() => setDisplayMd(false)}>
          {md(content)}
        </div>
      );
    else renderedContent = (
      <TextareaAutosize
        minRows={2}
        maxRows={20}
        autoFocus
        tabIndex={2}
        placeholder="Write something…"
        ref={contentArea}
        value={content}
        onChange={contentChange}
        onKeyDown={contentKeyDown}
        onHeightChange={(height) => {
          setMirrorPos((prev) => ({
            ...prev,
            height,
          }));
        }}
        className="input-global resize-none py-2 font-mono text-[14px] focus:outline-none"
      />
    );
  } else {
    // writing new card
    // raw rightaway, no markdown
    renderedContent = (
      <TextareaAutosize
        minRows={2}
        maxRows={15}
        autoFocus
        tabIndex={2}
        placeholder="Write something…"
        ref={contentArea}
        value={content}
        onChange={contentChange}
        onKeyDown={contentKeyDown}
        onHeightChange={(height) => {
          setMirrorPos((prev) => ({
            ...prev,
            height,
          }));
        }}
        className="input-global resize-none py-2 font-mono text-[14px] focus:outline-none"
      />
    );
  }
  return (
    <form
      ref={form}
      onClick={(e) => {
        e.stopPropagation();
        if (searchingForLabel) setSearchingForLabel(false);
      }}
      onSubmit={formSubmit}
      onKeyDown={formKeyDown}
      className="mx-auto flex w-full max-w-xl flex-col gap-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900"
    >
      <input
        type="text"
        tabIndex={1}
        placeholder="Title"
        value={title}
        onChange={titleChange}
        className="input-global font-semibold focus:outline-none"
      />
      {renderedContent}
      <div id="mirror" style={mirrorPos} className="pointer-events-none invisible absolute py-2">
        {mirroredContent}
      </div>
      <LabelSuggestions
        focusedLabelIndex={focusedLabelIndex}
        labelsList={labelsList}
        addToLabelList={addToLabelList}
        suggestionPos={suggestionPos}
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
