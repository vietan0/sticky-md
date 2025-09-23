import type { RecordReturn } from '../../../hooks/useRecordLabel';
import type NoteDbData from '../../../types/NoteDbData';
import { useEffect } from 'react';
import cn from '../../../utils/cn';
import LabelSuggestions from '../Toolbar/LabelSuggestions';

export default function Mirror({
  mirrorPos,
  setMirrorPos,
  isTitle,
  value,
  textAreaRef,
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
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  formRef: React.RefObject<HTMLFormElement>;
  record: RecordReturn;
  existingNote?: NoteDbData;
}) {
  useEffect(() => {
    // 1. setup mirror div position
    function syncMirror() {
      if (textAreaRef.current && formRef.current) {
        const { width, height, top: textareaTop } = textAreaRef.current.getBoundingClientRect();
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
  }, [existingNote, formRef, textAreaRef, setMirrorPos]);

  return (
    <div
      className={cn(
        isTitle ? 'text-lg' : 'text-sm',
        'pointer-events-none invisible absolute font-mono font-medium tracking-tight',
      )}
      id="mirror"
      style={mirrorPos}
    >
      {value.split('').map((char, i) => {
        return char === '#' && i === record.liveHashtagIndex
          ? (
              <span className="h-6 text-pink-500" key={i}>
                {char}
                <LabelSuggestions
                  btnClasses="rounded-full bg-black/5 p-2 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  inline
                  record={record}
                />
              </span>
            )
          : (
              <span className="h-6 font-mono whitespace-pre-wrap" key={i}>
                {char}
              </span>
            );
      })}
    </div>
  );
}
