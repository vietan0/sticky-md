import { useEffect, SetStateAction, Dispatch, ChangeEvent, KeyboardEvent } from 'react';
import LabelDbData from '../../../types/LabelDbData';

export default function ContentArea({
  content,
  setContent,
  extractedLabel,
  setExtractedLabel,
  setLabelsToAdd,
  isRecordingLabel,
  setIsRecordingLabel,
  contentHashtagPos,
  setContentHashtagPos,
  contentArea,
  focusedLabelIndex,
  setFocusedLabelIndex,
  labelsList,
}: {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  extractedLabel: string;
  setExtractedLabel: Dispatch<SetStateAction<string>>;
  setLabelsToAdd: Dispatch<SetStateAction<string[]>>;
  isRecordingLabel: boolean;
  setIsRecordingLabel: Dispatch<SetStateAction<boolean>>;
  contentHashtagPos: number;
  setContentHashtagPos: Dispatch<SetStateAction<number>>;
  contentArea: React.RefObject<HTMLTextAreaElement>;
  focusedLabelIndex: number;
  setFocusedLabelIndex: Dispatch<SetStateAction<number>>;
  labelsList: (LabelDbData | string)[];
}) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setContentHashtagPos(e.target.value.lastIndexOf('#')); // -1 if not exist
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
        setContent((prev: string) => prev.slice(0, contentHashtagPos));
        setExtractedLabel('');
      } else {
        // when only # is typed and there's no text after it
        setLabelsToAdd((prev: string[]) => {
          const target = labelsList[focusedLabelIndex] as LabelDbData;
          return prev.includes(target.label_name) ? prev : [...prev, target.label_name];
        });
        setIsRecordingLabel(false);
        setContent((prev: string) => prev.slice(0, contentHashtagPos));
        setExtractedLabel('');
      }
    }
    if (e.key === 'Escape' || e.key === ' ') {
      // stop recording label
      setIsRecordingLabel(false);
      setExtractedLabel('');
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
    contentArea.current?.focus();
  }, [contentArea]);

  useEffect(() => {
    if (isRecordingLabel) setExtractedLabel(content.slice(contentHashtagPos + 1, content.length));
  }, [isRecordingLabel, setExtractedLabel, content, contentHashtagPos]);

  useEffect(() => {
    // update focused row
    setFocusedLabelIndex(0);
  }, [labelsList.length, setFocusedLabelIndex]);

  return (
    <textarea
      ref={contentArea}
      value={content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Write something…"
      rows={3}
      tabIndex={2}
      className="input-global resize-none py-2 focus:outline-none"
    />
  );
}
