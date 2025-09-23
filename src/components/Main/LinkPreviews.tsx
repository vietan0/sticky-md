import type NoteDbData from '../../types/NoteDbData';
import * as linkify from 'linkifyjs';
import { useEffect, useState } from 'react';
import cn from '../../utils/cn';
import Globe from '../icons/Globe';

interface Data {
  url: string;
  title: string;
  description: string;
  favicon: string;
  image: string;
}

function LinkCard({ url, note }: { url: string; note: NoteDbData }) {
  const [data, setData] = useState<Data>({
    url: '',
    title: '',
    description: '',
    favicon: '',
    image: '',
  });

  const { title, description, favicon, image } = data;

  useEffect(() => {
    async function get() {
      const res = await fetch(
        `https://sticky-md-scraper.onrender.com/api?url=${url}`,
        { mode: 'cors' },
      );

      const data = await res.json();
      setData(data);
    }

    get();
  }, [url]);

  return (
    <a
      className={cn(
        note.bg_color ? 'bg-white/60' : 'bg-black/5',
        `
          relative flex h-14 border-t-2 border-black/10
          hover:bg-transparent
          dark:border-white/10 dark:bg-white/13
        `,
      )}
      href={url}
      onClick={e => e.stopPropagation()}
      rel="noreferrer"
      target="_blank"
    >
      {image
        ? (
            <div className={`
              flex h-14 shrink-0 basis-14 bg-white/30
              dark:bg-white/[.07]
            `}
            >
              <img alt="" className="object-cover" src={image} />
            </div>
          )
        : favicon
          ? (
              <div className={`
                flex h-14 shrink-0 basis-14 items-center justify-center bg-white/30
                dark:bg-white/[.07]
              `}
              >
                <img alt="" className="grow object-cover" src={favicon} />
              </div>
            )
          : (
              <div className={`
                flex h-14 shrink-0 basis-14 items-center justify-center bg-white/30
                dark:bg-white/[.07]
              `}
              >
                <Globe className="size-6 opacity-50" />
              </div>
            )}
      <div className="flex w-auto min-w-0 grow flex-col justify-center gap-px p-2 px-[10px] pr-4">
        <p className="truncate text-sm font-medium">{title || description || '…'}</p>
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
  const linkCards = noDups.map(link => <LinkCard key={link} note={note} url={link} />);

  return (
    <div className={cn(
      'overflow-hidden rounded-md',
      inNoteCard && 'rounded-t-none',
    )}
    >
      {linkCards}
    </div>
  );
}
