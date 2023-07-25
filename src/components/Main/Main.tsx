import { useState, useEffect } from 'react';
import AllNotesContextProvider from '../../contexts/AllNotesContext';
import AllLabelsContextProvider from '../../contexts/AllLabelsContext';
import Masonry from './Masonry/Masonry';
import NoteForm from './NoteForm/NoteForm';
import NotePrompt from './NoteForm/NotePrompt';

export default function Main() {
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    function toggleformOpen() {
      setFormOpen(false);
    }
    document.addEventListener('click', toggleformOpen);

    return () => {
      document.removeEventListener('click', toggleformOpen);
    };
  }, []);

  return (
    <AllNotesContextProvider>
      <AllLabelsContextProvider>
        <main className="flex flex-col gap-8 p-8">
          {formOpen ? (
            <NoteForm setFormOpen={setFormOpen} />
          ) : (
            <NotePrompt setFormOpen={setFormOpen} />
          )}
          <Masonry />
        </main>
      </AllLabelsContextProvider>
    </AllNotesContextProvider>
  );
}
