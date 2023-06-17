export default function WriteAreaPrompt({
  setIsWriting,
}: {
  setIsWriting: (val: boolean) => void;
}) {
  return (
    <textarea
      name=""
      rows={1}
      placeholder="Write something…"
      onFocus={(e) => {
        e.stopPropagation();
        setIsWriting(true);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsWriting(true);
      }}
      className="input-global mx-auto mb-8 block max-w-lg resize-none rounded-lg p-4 focus:outline-none"
    />
  );
}
