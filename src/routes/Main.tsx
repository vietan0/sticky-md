import { useState, useEffect } from 'react';
import WriteArea from '../components/WriteArea';
import WriteAreaPrompt from '../components/WriteAreaPrompt';
import Masonry from '../components/Masonry';

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
    <main className="p-8">
      {isWriting ? <WriteArea setIsWriting={setIsWriting}/> : <WriteAreaPrompt setIsWriting={setIsWriting} />}
      <Masonry />
    </main>
  );
}
