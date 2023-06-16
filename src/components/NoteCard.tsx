import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { nanoid } from 'nanoid';
import NoteDbData from '../types/NoteDbData';
import Label from './Label';

export default function NoteCard({ note }: { note: NoteDbData }) {
  const {title, content, labels } = note;

  const labelDivs = labels.map(label => <Label label={label} key={nanoid()}/>)

  return (
    <div className="NoteCard h-60 w-72 whitespace-pre-line rounded-lg p-4 outline outline-1 outline-slate-700">
      <Md remarkPlugins={[remarkGfm]} >{title}</Md>
      <Md remarkPlugins={[remarkGfm]} >{content}</Md>
      {labelDivs}
      <pre>{JSON.stringify(note, null, 2)}</pre>
    </div>
  );
}
