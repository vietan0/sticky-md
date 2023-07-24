import { RecordButtonReturn } from '../../../hooks/useRecordLabelButton';
import { Bg_Color } from '../../../types/Bg_Color';
import NoteDbData from '../../../types/NoteDbData';
import BackgroundSwatches from './BackgroundSwatches';
import LabelSuggestions from './LabelSuggestions';
import UploadImages from './UploadImages';

type Props = {
  existingNote?: NoteDbData;
  buttonRecord: RecordButtonReturn;
  selectedBgColor: Bg_Color;
  setSelectedBgColor: React.Dispatch<React.SetStateAction<Bg_Color>>;
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  inNoteCard?: boolean;
  opacity?: string;
  updateNoteToDb: () => Promise<void>;
};
export default function Toolbar({
  existingNote,
  buttonRecord,
  selectedBgColor,
  setSelectedBgColor,
  imageUrls,
  setImageUrls,
  inNoteCard = false,
  opacity,
  updateNoteToDb,
}: Props) {
  const btnClasses = inNoteCard
    ? 'rounded-full bg-black/5 p-2 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 [&>svg]:h-[18px] [&>svg]:w-[18px]'
    : 'rounded-full bg-black/5 p-2 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10';

  return (
    <div
      className={`add-stuffs flex items-center transition-opacity duration-100 ${
        typeof opacity === 'string' ? opacity : ''
      } ${inNoteCard ? 'gap-1' : 'gap-2'}`}
    >
      <LabelSuggestions
        record={buttonRecord}
        btnClasses={btnClasses}
        inNoteCard={inNoteCard}
        updateNoteToDb={updateNoteToDb}
      />
      <BackgroundSwatches
        selectedColor={selectedBgColor}
        setSelectedColor={setSelectedBgColor}
        btnClasses={btnClasses}
        inNoteCard={inNoteCard}
        updateNoteToDb={updateNoteToDb}
        existingNote={existingNote}
      />
      <UploadImages
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        btnClasses={btnClasses}
        inNoteCard={inNoteCard}
        updateNoteToDb={updateNoteToDb}
      />
      {inNoteCard || (
        <button
          type="submit"
          className="ml-auto rounded-full bg-black/5 px-4 py-2 leading-5 text-neutral-700 hover:bg-black/10 focus:bg-black/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/20"
        >
          {existingNote ? 'Save' : 'Done'}
        </button>
      )}
    </div>
  );
}
