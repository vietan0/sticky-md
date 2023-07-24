import * as linkify from 'linkifyjs';
import { useEffect, useState } from 'react';
import Globe from '../icons/Globe';
import NoteDbData from '../../types/NoteDbData';

type Data = {
  url: string;
  title: string;
  description: string;
  favicon: string;
  image: string;
};
function LinkCard({ url }: { url: string }) {
  const [data, setData] = useState<Data>({
    url: '',
    title: '',
    description: '',
    favicon: '',
    image: '',
  });
  const { title, favicon, image } = data;
  useEffect(() => {
    async function get() {
      const res = await fetch(`/api?url=${url}`);
      const data = await res.json();
      setData(data);
    }
    get();
  }, [url]);

  return (
    <a className="flex h-14">
      {image ? (
        <div className="flex h-14 flex-shrink-0 basis-14 bg-white/30 dark:bg-white/[.07]">
          <img src={image} alt="" className="object-cover" />
        </div>
      ) : favicon ? (
        <div className="flex h-14 flex-shrink-0 basis-14 items-center justify-center bg-white/30 dark:bg-white/[.07]">
          <img src={favicon} alt="" className="flex-grow object-cover" />
        </div>
      ) : (
        <div className="flex h-14 flex-shrink-0 basis-14 items-center justify-center bg-white/30 dark:bg-white/[.07]">
          <Globe className="h-6 w-6 opacity-50" />
        </div>
      )}
      <div className="flex w-auto min-w-0 flex-grow flex-col justify-center gap-px bg-white/60 p-2 px-[10px] pr-4 dark:bg-white/[0.13]">
        <p className="truncate text-sm font-medium">{title || '…'}</p>
        <p className="truncate text-xs opacity-60">{new URL(url).origin}</p>
      </div>
    </a>
  );
}

export default function LinkPreviews({
  note,
  inNoteCard = true,
}: {
  note: NoteDbData;
  inNoteCard?: boolean;
}) {
  const links = [...linkify.find(note.title, 'url'), ...linkify.find(note.content, 'url')].map(
    ({ href }) => href,
  );
  const noDups = Array.from(new Set(links));
  const linkCards = noDups.map((link) => <LinkCard url={link} key={link} />);

  return (
    <div className={`overflow-hidden rounded-md ${inNoteCard ? 'rounded-t-none' : ''}`}>
      {linkCards}
    </div>
  );
}
