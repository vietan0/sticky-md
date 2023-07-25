import { useState } from 'react';
import Trash from '../../icons/Trash';
import TooltipWrapper from '../../TooltipWrapper';

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
      className="relative flex-auto"
    >
      <img src={url} alt="" className="h-full w-full object-contain" />
      {hover && !inNoteCard && (
        <TooltipWrapper asChild content="Remove image">
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
        </TooltipWrapper>
      )}
    </a>
  );
}

type ImagesContainerProps = {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  inNoteCard?: boolean;
};
export default function ImagesContainer({
  imageUrls,
  setImageUrls,
  inNoteCard = false,
}: ImagesContainerProps) {
  return (
    <div className={`images flex max-h-40 overflow-hidden rounded-t-lg`}>
      {imageUrls.map((url) => (
        <ImageView url={url} setImageUrls={setImageUrls} inNoteCard={inNoteCard} key={url} />
      ))}
    </div>
  );
}
