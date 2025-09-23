import { useDisclosure } from '@heroui/react';
import { useEffect } from 'react';
import Masonry from './Masonry/Masonry';
import NoteForm from './NoteForm/NoteForm';
import NotePrompt from './NoteForm/NotePrompt';

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    document.addEventListener('click', onClose);

    return () => {
      document.removeEventListener('click', onClose);
    };
  }, []);

  return (
    <main className="mt-20 flex flex-col gap-8 p-8">
      {isOpen ? <NoteForm onClose={onClose} /> : <NotePrompt onOpen={onOpen} />}
      <Masonry />
    </main>
  );
}
