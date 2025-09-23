import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { getImageUrl, uploadImage } from '../../../supabase/storage';
import Photo from '../../icons/Photo';

export default function UploadImages({
  imageUrls,
  setImageUrls,
  btnClasses,
  inNoteCard = false,
  updateNoteToDb,
}: {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  btnClasses: string;
  inNoteCard?: boolean;
  updateNoteToDb: () => Promise<void>;
}) {
  const ghostInput = useRef<HTMLInputElement>(null);

  function triggerUpload(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    if (ghostInput.current)
      ghostInput.current.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files as Iterable<File> | ArrayLike<File>);

    const newUrls = list.map(async (file) => {
      const filename = (await uploadImage(file)) as string;
      const result = await getImageUrl(filename);

      return result;
    });

    Promise.all(newUrls).then(urls => setImageUrls((prev: string[]) => [...urls, ...prev]));
  }

  const queryClient = useQueryClient();

  const imageMutation = useMutation({
    mutationFn: updateNoteToDb,
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  useEffect(() => {
    if (inNoteCard)
      imageMutation.mutate();
    // if <UploadImages> is in <NoteCard>,
    // changes to imageUrls should send Supabase request immediately
  }, [imageUrls]);

  return (
    <>
      <button className={btnClasses} onClick={triggerUpload} title="Add images">
        <Photo className={`
          size-5 stroke-neutral-700
          dark:stroke-neutral-200
        `}
        />
      </button>
      <input
        accept="image/*"
        className="invisible absolute top-[-9999px] left-[-9999px]"
        multiple
        onChange={handleFileChange}
        onClick={e => e.stopPropagation()}
        ref={ghostInput}
        type="file"
      />
    </>
  );
}
