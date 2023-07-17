import { useContext, useEffect, useRef, useState } from 'react';
import { AllLabelsContext } from '../contexts/AllLabelsContext';
import LabelDbData from '../types/LabelDbData';
import NoteDbData from '../types/NoteDbData';

export type RecordReturn = {
  fieldKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  fieldChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  searchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setExtractedLabel: React.Dispatch<React.SetStateAction<string>>;
  labelsToAdd: string[];
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  labelsList: (string | LabelDbData)[];
  suggestionPos: { left: number; top: number };
  focusedLabelIndex: number;
  isRecordingLabel: boolean;
  setIsRecordingLabel: React.Dispatch<React.SetStateAction<boolean>>;
  liveHashtagIndex: number;
  liveHashtag: React.RefObject<HTMLSpanElement>;
};
export default function useRecordingLabel(
  setValue: React.Dispatch<React.SetStateAction<string>>,
  inputRef: React.RefObject<HTMLTextAreaElement> | React.RefObject<HTMLInputElement>,
  formRef: React.RefObject<HTMLFormElement>,
  labelsToAdd: string[],
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>,
  existingNote?: NoteDbData,
) {
  // should work for both <input> and <textarea>
  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [extractedLabel, setExtractedLabel] = useState('');
  const [liveHashtagIndex, setLiveHashtagIndex] = useState(-1);
  const [focusedLabelIndex, setFocusedLabelIndex] = useState(0);
  const [suggestionPos, setSuggestionPos] = useState({ left: 0, top: 0 });

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
  if (extractedLabel) labelsList = [...filteredLabels, extractedLabel];

  const fieldKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === '#') setIsRecordingLabel(true);
  };
  const fieldChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value);
    const cursorIndex = inputRef.current?.selectionStart as number; // cursor after typed
    setLiveHashtagIndex(cursorIndex - 1);
  };
  const searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      // discard popup, focus back outside
      e.preventDefault();
      e.stopPropagation();
      setIsRecordingLabel(false);
      inputRef.current?.focus();
    }
    if (e.key === 'Tab' || e.key === 'Enter') {
      // accept label, focus back outside
      e.preventDefault();
      setLabelsToAdd((prev: string[]) => {
        // suggested label have higher priority over extracted label
        if (extractedLabel) {
          // when there's text after # and <LabelSuggestions /> is showing
          const target = labelsList.length > 0 ? labelsList[focusedLabelIndex] : extractedLabel;
          if (typeof target === 'string') {
            return prev.includes(target) ? prev : [...prev, target];
          } else {
            return prev.includes(target.label_name) ? prev : [...prev, target.label_name];
          }
        } else {
          // when only # is typed and there's no text after it
          const target = labelsList[focusedLabelIndex] as LabelDbData;
          return prev.includes(target.label_name) ? prev : [...prev, target.label_name];
        }
      });
      setIsRecordingLabel(false);
      inputRef.current?.focus();
    }
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
    // update focused row in LabelSuggestions
    setFocusedLabelIndex(0);
  }, [labelsList.length]);

  const liveHashtag = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // update position of # span based on liveHashtag's position
    if (liveHashtag.current && formRef.current) {
      const { right: hashtagRight, bottom: hashtagBottom } =
        liveHashtag.current.getBoundingClientRect();
      const { top: formTop, left: formLeft } = formRef.current.getBoundingClientRect();

      setSuggestionPos(
        existingNote
          ? { left: hashtagRight - formLeft, top: hashtagBottom - formTop }
          : { left: hashtagRight, top: hashtagBottom },
      );
    } else setSuggestionPos({ left: 0, top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveHashtagIndex]);
  return {
    // for outside fields
    fieldKeyUp,
    fieldChange,
    // for <LabelSuggestions />
    searchKeyDown,
    setExtractedLabel,
    labelsToAdd,
    setLabelsToAdd,
    labelsList,
    suggestionPos,
    focusedLabelIndex,
    // for <Mirror />
    isRecordingLabel, // also <NoteForm />
    setIsRecordingLabel, // also <NoteForm />
    liveHashtagIndex,
    liveHashtag,
  };
}
