import { useEffect, useRef } from 'react';
import Photo from '../../icons/Photo';
import TooltipWrapper from '../../TooltipWrapper';
import { getImageUrl, uploadImage } from '../../../supabase/storage';

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
  updateNoteToDb?: () => Promise<void>;
}) {
  const ghostInput = useRef<HTMLInputElement>(null);
  function triggerUpload(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    if (ghostInput.current) ghostInput.current.click();
  }
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files);
    const newUrls = list.map(async (file) => {
      const filename = (await uploadImage(file)) as string;
      const result = await getImageUrl(filename);
      return result;
    });
    Promise.all(newUrls).then((urls) => setImageUrls((prev: string[]) => [...urls, ...prev]));
  }

  useEffect(() => {
    if (inNoteCard && updateNoteToDb) updateNoteToDb();
    // if <UploadImages> is in <NoteCard>,
    // changes to imageUrls should send Supabase request immediately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrls]);

  const uploadButton = (
    <>
      <button className={btnClasses} onClick={triggerUpload}>
        <Photo className="h-5 w-5 stroke-neutral-700 dark:stroke-neutral-200" />
      </button>
      <input
        ref={ghostInput}
        type="file"
        accept="image/*"
        multiple
        onClick={(e) => e.stopPropagation()}
        onChange={handleFileChange}
        className="invisible absolute left-[-9999px] top-[-9999px]"
      />
    </>
  );

  return (
    <>
      <button className={btnClasses} title="Add images" onClick={triggerUpload}>
        <Photo className="h-5 w-5 stroke-neutral-700 dark:stroke-neutral-200" />
      </button>
      <input
        ref={ghostInput}
        type="file"
        accept="image/*"
        multiple
        onClick={(e) => e.stopPropagation()}
        onChange={handleFileChange}
        className="invisible absolute left-[-9999px] top-[-9999px]"
      />
    </>
  );
}
