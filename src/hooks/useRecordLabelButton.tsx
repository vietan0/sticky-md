import { useContext, useEffect, useState } from 'react';
import { AllLabelsContext } from '../contexts';
import LabelDbData from '../types/LabelDbData';

export type RecordButtonReturn = {
  searchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setExtractedLabel: React.Dispatch<React.SetStateAction<string>>;
  labelsToAdd: string[];
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  labelsList: (string | LabelDbData)[];
  focusedLabelIndex: number;
  isRecordingLabel: boolean;
  setIsRecordingLabel: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function useRecordLabelButton(
  labelsToAdd: string[],
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>,
) {
  // use a button to trigger popup
  const allLabels = useContext(AllLabelsContext);
  const [isRecordingLabel, setIsRecordingLabel] = useState(false);
  const [extractedLabel, setExtractedLabel] = useState('');
  const [focusedLabelIndex, setFocusedLabelIndex] = useState(0);

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

  return {
    searchKeyDown,
    setExtractedLabel,
    labelsToAdd,
    setLabelsToAdd,
    labelsList,
    focusedLabelIndex,
    isRecordingLabel,
    setIsRecordingLabel,
  };
}
