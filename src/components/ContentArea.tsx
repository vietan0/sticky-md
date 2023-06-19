import { useState, useRef, useEffect } from 'react';
import LabelDbData from '../types/LabelDbData';

export default function ContentArea({
  content,
  setContent,
  extractedLabel,
  setExtractedLabel,
  labelsToAdd,
  setLabelsToAdd,
  isRecordingLabel,
  setIsRecordingLabel,
  setLabelsPopupOpen,
  contentHashtagPos,
  setContentHashtagPos,
  contentArea,
  focusedLabelIndex,
  setFocusedLabelIndex,
  filteredLabels,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  extractedLabel: string;
  setExtractedLabel: React.Dispatch<React.SetStateAction<string>>;
  labelsToAdd: string[];
  setLabelsToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  isRecordingLabel: boolean;
  setIsRecordingLabel: React.Dispatch<React.SetStateAction<boolean>>;
  setLabelsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contentHashtagPos: number;
  setContentHashtagPos: React.Dispatch<React.SetStateAction<number>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentArea: any;
  focusedLabelIndex: number;
  setFocusedLabelIndex: React.Dispatch<React.SetStateAction<number>>;
  filteredLabels: string[];
}) {
  const [spacePos, setSpacePos] = useState(-1);
  const [cursorPos, setCursorPos] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setContentHashtagPos(e.target.value.lastIndexOf('#')); // -1 if not exist
    setSpacePos(e.target.value.lastIndexOf(' ')); // -1 if not exist
    setCursorPos(contentArea.current.selectionStart);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '#') {
      setIsRecordingLabel(true);
      setLabelsPopupOpen(true);
    }
    if (e.key === 'Backspace') {
      if (content.charAt(content.length - 1) === '#') {
        setIsRecordingLabel(false);
        setLabelsPopupOpen(false);
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (extractedLabel) {
        // hit 'Tab' will add label to list
        {
          setLabelsToAdd((prev: string[]) => {
            // suggested label have higher priority over extracted label
            const accepted =
              filteredLabels.length > 0 ? filteredLabels[focusedLabelIndex] : extractedLabel;
            return prev.includes(accepted) ? prev : [...prev, accepted];
          });
        }
        setIsRecordingLabel(false);
        setLabelsPopupOpen(false);
        setContent((prev: string) => prev.slice(0, contentHashtagPos));
        setExtractedLabel('');
      } else {
        setLabelsToAdd((prev: string[]) => {
          const accepted = filteredLabels[focusedLabelIndex];
          return prev.includes(accepted) ? prev : [...prev, accepted];
        });
        setIsRecordingLabel(false);
        setLabelsPopupOpen(false);
        setContent((prev: string) => prev.slice(0, contentHashtagPos));
        setExtractedLabel('');
      }
    }
    if (e.key === 'Escape' || e.key === ' ') {
      // stop recording label
      setIsRecordingLabel(false);
      setLabelsPopupOpen(false);
      setExtractedLabel('');
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already first, cycle up to last index
        (prev: number) => (prev === 0 ? filteredLabels.length - 1 : prev - 1),
      );
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already last, cycle to top
        (prev: number) => (prev >= filteredLabels.length - 1 ? 0 : prev + 1),
      );
    }
  };

  useEffect(() => {
    // only runs on mount
    contentArea.current.focus();
    contentArea.current.addEventListener('selectionchange', () => {
      // cursorPos doesn't help anything right now, can remove
      setCursorPos(contentArea.current.selectionStart);
    });
  }, [contentArea]);

  useEffect(() => {
    if (isRecordingLabel) {
      setExtractedLabel(content.slice(contentHashtagPos + 1, content.length));
    }
  }, [contentHashtagPos, cursorPos, content, setExtractedLabel, isRecordingLabel]);

  useEffect(() => {
    // update focused row
    setFocusedLabelIndex(0);
  }, [filteredLabels.length, setFocusedLabelIndex]);

  return (
    <>
      <textarea
        ref={contentArea}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write something…"
        rows={3}
        className="input-global resize-none py-2 focus:outline-none"
      />
      <div id="info">
        <p className="font-mono">
          isRecordingLabel:{' '}
          <span className="text-amber-500">{isRecordingLabel ? 'true' : 'false'}</span>
        </p>
        <p className="font-mono">
          contentHashtagPos: <span className="text-pink-500">{contentHashtagPos}</span>
        </p>
        <p className="font-mono">
          cursorPos: <span className="text-pink-500">{cursorPos}</span>
        </p>
        <p className="font-mono">
          spacePos: <span className="text-pink-500">{spacePos}</span>
        </p>
        <p className="font-mono">
          extractedLabel: <span className="text-pink-500">&apos;{extractedLabel}&apos;</span>
        </p>
        <p className="font-mono">
          labelsToAdd: <span className="text-pink-500">{JSON.stringify(labelsToAdd)}</span>
        </p>
      </div>
    </>
  );
}
