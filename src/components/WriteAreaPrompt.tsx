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
      onClick={(e) => {
        e.stopPropagation();
        setIsWriting(true);
      }}
      className="input-global max-w-lg resize-none rounded-lg p-4 focus:outline-none"
    />
  );
}
