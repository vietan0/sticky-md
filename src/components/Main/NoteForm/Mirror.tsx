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
            <LabelSuggestions
              record={record}
              btnClasses="rounded-full bg-black/5 p-2 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              inline
              existingNote={existingNote}
            />
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
