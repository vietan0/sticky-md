import { useCallback, useEffect, useRef, useState } from 'react';
import NoteDbData from '../types/NoteDbData';

export default function useSuggestionsWithSearch(
  formRef: React.RefObject<HTMLFormElement>,
  labelsToAdd: string[],
  existingNote?: NoteDbData,
) {
  const labelSearchButton = useRef<HTMLDivElement>(null);
  const [searchingForLabel, setSearchingForLabel] = useState(false);
  const [suggestionWithSearchPos, setSuggestionWithSearchPos] = useState({ left: 0, top: 0 });

  const syncSuggestionWithSearchPos = useCallback(() => {
    // position LabelSuggestionsWithSearch relative to its trigger button
    if (labelSearchButton.current && formRef.current) {
      const { left, bottom } = labelSearchButton.current.getBoundingClientRect();
      const { top: formTop, left: formLeft } = formRef.current.getBoundingClientRect();
      setSuggestionWithSearchPos(
        existingNote
          ? { left: left - formLeft, top: bottom - formTop + 16 }
          : { left, top: bottom + 16 },
      );
    }
  }, [existingNote, formRef]);

  useEffect(() => {
    window.addEventListener('resize', syncSuggestionWithSearchPos);
    return () => {
      window.removeEventListener('resize', syncSuggestionWithSearchPos);
    };
  }, [syncSuggestionWithSearchPos]);

  useEffect(() => {
    syncSuggestionWithSearchPos();
  }, [labelsToAdd, syncSuggestionWithSearchPos]);
  return { labelSearchButton, searchingForLabel, setSearchingForLabel, suggestionWithSearchPos };
}
