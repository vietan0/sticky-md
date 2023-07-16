import { useContext, useEffect, useRef, useState } from 'react';
import { AllLabelsContext } from '../contexts/AllLabelsContext';
import LabelDbData from '../types/LabelDbData';
import NoteDbData from '../types/NoteDbData';

export type RecordReturn = {
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  liveHashtagIndex: number;
  liveHashtag: React.RefObject<HTMLSpanElement>;
  focusedLabelIndex: number;
  labelsList: (string | LabelDbData)[];
  addToLabelList: (label_name: string) => void;
  suggestionPos: {
    left: number;
    top: number;
  };
};
export default function useRecordingLabel(
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  inputRef: React.RefObject<HTMLTextAreaElement> | React.RefObject<HTMLInputElement>,
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>,
  formRef: React.RefObject<HTMLFormElement>,
  existingNote?: NoteDbData,
) {
  // should work for both <input> and <textarea>
  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [extractedLabel, setExtractedLabel] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === '#') setIsRecordingLabel(true);
    if (isRecordingLabel) {
      if (e.key === 'Escape' || e.key === ' ') setIsRecordingLabel(false);
      if (e.key === 'Backspace' && value.charAt(value.length - 1) === '#')
        setIsRecordingLabel(false);
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        setIsRecordingLabel(false);
        setLabelsToAdd((prev: string[]) => {
          // add label to list
          // suggested label have higher priority over extracted label
          if (extractedLabel) {
            // when there's text after # and LabelSuggestion is showing
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
        setValue((prev: string) => prev.slice(0, liveHashtagIndex));
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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value);
    const nextCursorIndex = inputRef.current?.selectionStart as number; // cursor after typed
    setCursorIndex(nextCursorIndex);
    setLiveHashtagIndex((prev) => {
      if (isRecordingLabel) {
        if (prev === -1) {
          return nextCursorIndex >= 1 ? nextCursorIndex - 1 : prev;
        } else return prev;
      } else return -1;
    });
  };

  const addToLabelList = (label_name: string) => {
    // only to use in <LabelSuggestions>
    setLabelsToAdd((prev) => (prev.includes(label_name) ? prev : [...prev, label_name]));
    setIsRecordingLabel(false);
    setValue((prev: string) => prev.slice(0, liveHashtagIndex));
    inputRef.current?.focus();
  };

  useEffect(() => {
    // listen to cursor
    if (inputRef.current) {
      inputRef.current.addEventListener('selectionchange', () => {
        setCursorIndex(inputRef.current?.selectionStart as number);
      });
    }
  }, [inputRef]);

  useEffect(() => {
    // update extractedLabel
    setExtractedLabel(() =>
      isRecordingLabel ? value.slice(liveHashtagIndex + 1, value.length) : '',
    );
  }, [isRecordingLabel, value, liveHashtagIndex]);

  useEffect(() => {
    // update focused row in LabelSuggestions
    setFocusedLabelIndex(0);
  }, [labelsList.length]);

  useEffect(() => {
    if (cursorIndex <= liveHashtagIndex) setIsRecordingLabel(false);
  }, [cursorIndex, liveHashtagIndex]);

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
    handleKeyDown,
    handleChange,
    liveHashtagIndex,
    liveHashtag,
    focusedLabelIndex,
    labelsList,
    addToLabelList,
    suggestionPos,
  };
}
