import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import cn from '../../../utils/cn';
import Trash from '../../icons/Trash';

interface ImageViewProps {
  url: string;
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  inNoteCard: boolean;
}

function ImageView({ url, setImageUrls, inNoteCard }: ImageViewProps) {
  const [hover, setHover] = useState(false);

  return (
    <a
      className={cn(
        'relative flex-auto',
        inNoteCard && 'pointer-events-none',
      )}
      href={url}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      rel="noreferrer"
      target="_blank"
    >
      <img alt="" className="size-full object-cover" src={url} />
      {hover && !inNoteCard && (
        <button
          className={`
            absolute top-3 right-3 rounded-full bg-black/30 p-2
            hover:bg-black/50
            dark:bg-black/40 dark:hover:bg-black/60
          `}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setImageUrls(prev => prev.filter(urlInPrev => urlInPrev !== url));
          }}
        >
          <Trash className="size-5 stroke-white stroke-2" />
        </button>
      )}
    </a>
  );
}

interface ImagesContainerProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  updateNoteToDb?: () => Promise<void>;
  inNoteCard?: boolean;
}

export default function ImagesContainer({
  imageUrls,
  setImageUrls,
  updateNoteToDb,
  inNoteCard = false,
}: ImagesContainerProps) {
  const queryClient = useQueryClient();

  const imageMutation = useMutation({
    mutationFn: updateNoteToDb,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  useEffect(() => {
    if (updateNoteToDb)
      imageMutation.mutate();
    // changes to imageUrls should send Supabase request immediately
  }, [imageUrls]);

  return (
    <div className="flex overflow-hidden rounded-t-lg">
      {imageUrls.map(url => (
        <ImageView inNoteCard={inNoteCard} key={url} setImageUrls={setImageUrls} url={url} />
      ))}
    </div>
  );
}
