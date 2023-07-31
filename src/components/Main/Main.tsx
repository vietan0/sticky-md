import { useState, useEffect } from 'react';
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
    <main className="flex flex-col mt-20 gap-8 p-8">
      {formOpen ? (
        <NoteForm setFormOpen={setFormOpen} />
      ) : (
        <NotePrompt setFormOpen={setFormOpen} />
      )}
      <Masonry />
    </main>
  );
}
