import { useState, useRef, useEffect } from 'react';

export default function ContentArea({
  content,
  setContent,
  extractedLabel,
  setExtractedLabel,
  labelsToAdd,
  setLabelsToAdd,
  isRecordingLabel,
  setIsRecordingLabel,
  labelsPopupOpen,
  setLabelsPopupOpen,
  contentHashtagPos,
  setContentHashtagPos,
  contentArea,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
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
      if (extractedLabel) {
        // hit 'Tab' will add label to list
        e.preventDefault();
        setLabelsToAdd(
          (prev: string[]) => (prev.includes(extractedLabel) ? prev : [...prev, extractedLabel]),
          // ternary is to avoid duplicates
        );
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
  };

  useEffect(() => {
    // only runs on mount
    contentArea.current.focus();
    contentArea.current.addEventListener('selectionchange', () => {
      // cursorPos doesn't help anything right now, can remove
      setCursorPos(contentArea.current.selectionStart);
    });
  }, []);

  useEffect(() => {
    if (isRecordingLabel) {
      setExtractedLabel(content.slice(contentHashtagPos + 1, content.length));
    }
  }, [contentHashtagPos, cursorPos, content, setExtractedLabel, isRecordingLabel]);

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
