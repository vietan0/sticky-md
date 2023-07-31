import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Trash from '../../icons/Trash';

type ImageViewProps = {
  url: string;
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  inNoteCard: boolean;
};
function ImageView({ url, setImageUrls, inNoteCard }: ImageViewProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${inNoteCard ? 'pointer-events-none' : ''} relative flex-auto`}
    >
      <img src={url} alt="" className="h-full w-full object-cover" />
      {hover && !inNoteCard && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setImageUrls((prev) => prev.filter((urlInPrev) => urlInPrev !== url));
          }}
          className="delete-button absolute right-3 top-3 rounded-full bg-black/30 p-2 hover:bg-black/50 dark:bg-black/40 dark:hover:bg-black/60"
        >
          <Trash className="h-5 w-5 stroke-white stroke-2" />
        </button>
      )}
    </a>
  );
}

type ImagesContainerProps = {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  updateNoteToDb?: () => Promise<void>;
  inNoteCard?: boolean;
};
export default function ImagesContainer({
  imageUrls,
  setImageUrls,
  updateNoteToDb,
  inNoteCard = false,
}: ImagesContainerProps) {
  const queryClient = useQueryClient();
  const imageMutation = useMutation({
    mutationFn: updateNoteToDb,
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  useEffect(() => {
    if (updateNoteToDb) imageMutation.mutate();
    // changes to imageUrls should send Supabase request immediately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrls]);

  return (
    <div className="flex rounded-t-lg">
      {imageUrls.map((url) => (
        <ImageView url={url} setImageUrls={setImageUrls} inNoteCard={inNoteCard} key={url} />
      ))}
    </div>
  );
}
