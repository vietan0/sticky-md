import { useEffect } from 'react';
import NoteDbData from '../../../types/NoteDbData';
import { RecordReturn } from '../../../hooks/useRecordLabel';
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
    React.SetStateAction<{ width: number; height: number; top: number }>
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
        setMirrorPos({ width, height, top: textareaTop - formTop });
      }
    }
    syncMirror();

    // 2. sync position when resize
    window.addEventListener('resize', syncMirror);
    return () => {
      window.removeEventListener('resize', syncMirror);
    };
  }, [existingNote, formRef, inputRef, setMirrorPos]);

  return (
    <div
      id="mirror"
      style={mirrorPos}
      className={`${
        isTitle ? 'text-lg' : 'text-sm'
      } pointer-events-none invisible absolute font-mono font-medium tracking-tight`}
    >
      {value.split('').map((char, i) => {
        return char === '#' && i === record.liveHashtagIndex ? (
          <span className="h-6 text-pink-500" key={i}>
            {char}
            <LabelSuggestions record={record} inline />
          </span>
        ) : (
          <span className="h-6 whitespace-pre-wrap font-mono" key={i}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
