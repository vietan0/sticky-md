import { useState } from 'react';

export default function Main() {
  // const mdContent = `## Just a link: [React](https://reactjs.com)\nTest strikethrough: ~~completed~~`;
  const [writingNote, setWritingNote] = useState(false);

  const writingNoteArea = (
    <form action="" className="max-w-lg m-auto">
      <input type="text" name="title" />
      <textarea name="" rows={3} placeholder="Add note..." className="input-global p-4" />
      <button>Add</button>
    </form>
  );

  return <main className="p-8"></main>;
}
