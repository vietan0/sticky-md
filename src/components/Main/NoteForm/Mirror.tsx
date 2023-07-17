import { useEffect } from 'react';
import NoteDbData from '../../../types/NoteDbData';
import { RecordReturn } from '../../../hooks/useRecordingLabel';
import LabelSuggestions from './LabelSuggestions';

export default function Mirror({
  mirrorPos,
  setMirrorPos,
  isTitle,
  value,
  inputRef,
  formRef,
  record,
  existingNote,
}: {
  mirrorPos: {
    width: number;
    height: number;
    top: number;
  };
  setMirrorPos: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
      top: number;
    }>
  >;
  isTitle: boolean;
  value: string;
  inputRef: React.RefObject<HTMLTextAreaElement> | React.RefObject<HTMLInputElement>;
  formRef: React.RefObject<HTMLFormElement>;
  record: RecordReturn;
  existingNote?: NoteDbData;
}) {
  useEffect(() => {
    // 1. setup mirror div position
    function syncMirror() {
      if (inputRef.current && formRef.current) {
        const { width, height, top: textareaTop } = inputRef.current.getBoundingClientRect();
        const { top: formTop } = formRef.current.getBoundingClientRect();
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

    // // if editing existingNote, make cursor appear at the end
    // inputRef.current?.setSelectionRange(
    //   inputRef.current.value.length,
    //   inputRef.current.value.length,
    // );

    // sync position when resize
    window.addEventListener('resize', syncMirror);
    return () => {
      window.removeEventListener('resize', syncMirror);
    };
  }, [existingNote, formRef, inputRef, setMirrorPos]);

  return (
    <>
      <div
        id="mirror"
        style={mirrorPos}
        className={`${
          isTitle ? 'text-lg' : 'text-sm'
        } pointer-events-none absolute font-mono font-medium tracking-tight outline outline-1`}
      >
        {value.split('').map((char, i) => {
          return char === '#' && i === record.liveHashtagIndex ? (
            <span ref={record.liveHashtag} className="h-6 text-pink-400" key={i}>
              {char}
            </span>
          ) : (
            <span key={i} className="h-6 whitespace-pre-wrap font-mono">
              {char}
            </span>
          );
        })}
      </div>
      {record.isRecordingLabel && <LabelSuggestions record={record} />}
    </>
  );
}
