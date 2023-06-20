import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import NoteDbData from '../../../types/NoteDbData';
import { deleteNote } from '../../../supabase/notes';
import LabelButton from '../LabelButton';
import Ellipsis from '../../icons/Ellipsis';
import Close from '../../icons/Close';

export default function NoteCard({ note }: { note: NoteDbData }) {
  const [hover, setHover] = useState(false);
  const { title, content, labels, note_id } = note;

  const labelButtons = labels.map((label) => <LabelButton label={label} key={nanoid()} />);
  const deleteButton = (
    <button
      onClick={() => deleteNote(note_id)}
      className="delete-button absolute -right-3 -top-3 rounded-full bg-slate-800 p-1 outline outline-1 outline-slate-800"
    >
      <Close className="h-4 w-4" />
    </button>
  );
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="NoteCard relative flex flex-col gap-3 whitespace-pre-line rounded-lg p-4 pt-2 outline outline-1 outline-slate-700"
    >
      <Md remarkPlugins={[remarkGfm]} className="break-words font-semibold">
        {title}
      </Md>
      <Md remarkPlugins={[remarkGfm]} className="break-words ">
        {content}
      </Md>
      {labelButtons}
      <div className="add-stuffs">
        <button className="rounded-full p-1 outline outline-1 outline-slate-800">
          <Ellipsis className="h-5 w-5" />
        </button>
      </div>
      {hover && deleteButton}
    </div>
  );
}
