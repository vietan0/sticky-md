export default function NotePrompt({
  setIsWriting,
}: {
  setIsWriting: (val: boolean) => void;
}) {
  return (
    <textarea
      rows={1}
      tabIndex={1}
      placeholder="Write something…"
      onFocus={(e) => {
        e.stopPropagation();
        setIsWriting(true);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsWriting(true);
      }}
      className="input-global mx-auto block max-w-xl resize-none rounded-lg p-4 focus:outline-none"
    />
  );
}
