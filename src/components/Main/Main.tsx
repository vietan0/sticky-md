import { useState, useEffect } from 'react';
import AllLabelsContextProvider from '../../contexts/AllLabelsContext';
import Masonry from './Masonry/Masonry';
import NoteForm from './NoteForm/NoteForm';
import NotePrompt from './NoteForm/NotePrompt';

export default function Main() {
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    function toggleIsWriting() {
      setIsWriting(false);
    }
    document.addEventListener('click', toggleIsWriting);

    return () => {
      document.removeEventListener('click', toggleIsWriting);
    };
  }, []);

  return (
    <AllLabelsContextProvider>
      <main className="p-8">
        {isWriting ? (
          <NoteForm setIsWriting={setIsWriting} />
        ) : (
          <NotePrompt setIsWriting={setIsWriting} />
        )}
        <Masonry />
      </main>
    </AllLabelsContextProvider>
  );
}
