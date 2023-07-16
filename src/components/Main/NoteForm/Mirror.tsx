import { useEffect, useState } from 'react';
import NoteDbData from '../../../types/NoteDbData';
import { RecordReturn } from '../../../hooks/useRecordingLabel';
import LabelSuggestions from './LabelSuggestions';

export default function Mirror({
  value,
  inputRef,
  form,
  record,
  existingNote,
}: {
  value: string;
  inputRef: React.RefObject<HTMLTextAreaElement> | React.RefObject<HTMLInputElement>;
  form: React.RefObject<HTMLFormElement>;
  record: RecordReturn,
  existingNote?: NoteDbData;
}) {
  const [mirrorPos, setMirrorPos] = useState({ width: 0, height: 0, top: 0 });
  useEffect(() => {
    // initial render
    // 1. setup mirror div position
    function syncMirror() {
      if (inputRef.current && form.current) {
        const { width, height, top: textareaTop } = inputRef.current.getBoundingClientRect();
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
    inputRef.current?.setSelectionRange(
      inputRef.current.value.length,
      inputRef.current.value.length,
    );

    // sync position when resize
    window.addEventListener('resize', syncMirror);
    return () => {
      window.removeEventListener('resize', syncMirror);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const mirroredContent = value.split('').map((char, i) => {
    return char === '#' && i === record.liveHashtagIndex ? (
      <span ref={record.liveHashtag} className="h-6" key={i}>
        {char}
      </span>
    ) : (
      <span key={i} className="h-6 whitespace-pre-wrap">
        {char}
      </span>
    );
  });

  return (
    <>
      <div id="mirror" style={mirrorPos} className="pointer-events-none invisible absolute py-2">
        {mirroredContent}
      </div>
      <LabelSuggestions
        focusedLabelIndex={record.focusedLabelIndex}
        labelsList={record.labelsList}
        addToLabelList={record.addToLabelList}
        suggestionPos={record.suggestionPos}
      />
    </>
  );
}
