import { useContext, useEffect, useRef, useState } from 'react';
import { AllLabelsContext } from '../contexts';
import LabelDbData from '../types/LabelDbData';
import NoteDbData from '../types/NoteDbData';

export type RecordButtonReturn = {
  searchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setExtractedLabel: React.Dispatch<React.SetStateAction<string>>;
  labelsToAdd: string[];
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  labelsList: (string | LabelDbData)[];
  suggestionPos: { left: number; top: number };
  focusedLabelIndex: number;
  isRecordingLabel: boolean;
  setIsRecordingLabel: React.Dispatch<React.SetStateAction<boolean>>;
  triggerButtonRef: React.RefObject<HTMLSpanElement>;
  formRef: React.RefObject<HTMLFormElement>;
};
export default function useRecordLabelButton(
  formRef: React.RefObject<HTMLFormElement>,
  labelsToAdd: string[],
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>,
) {
  // use a button to trigger popup
  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [extractedLabel, setExtractedLabel] = useState('');
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
  const searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      // discard popup, focus back outside
      e.preventDefault();
      e.stopPropagation();
      setIsRecordingLabel(false);
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

  const triggerButtonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // update position of LabelSuggestions based on triggerButton's position
    function syncSuggestionPos() {
      if (triggerButtonRef.current && formRef.current) {
        const { left: btnLeft, bottom: btnBottom } =
          triggerButtonRef.current.getBoundingClientRect();
        const { left: formLeft, top: formTop } = formRef.current.getBoundingClientRect();

        setSuggestionPos({ left: btnLeft - formLeft, top: btnBottom - formTop + 16 });
      }
    }
    syncSuggestionPos();

    window.addEventListener('resize', syncSuggestionPos);
    return () => {
      window.removeEventListener('resize', syncSuggestionPos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // for <LabelSuggestions /> directly, no <Mirror />
    searchKeyDown,
    setExtractedLabel,
    labelsToAdd,
    setLabelsToAdd,
    labelsList,
    suggestionPos,
    focusedLabelIndex,
    isRecordingLabel,
    setIsRecordingLabel,
    triggerButtonRef,
    formRef,
  };
}
