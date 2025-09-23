export default function NotePrompt({ onOpen }: { onOpen: () => void }) {
  return (
    <textarea
      className={`
        mx-auto block w-full max-w-xl resize-none rounded-lg bg-white p-4 font-mono tracking-tight
        outline-1 outline-neutral-300 outline-solid
        placeholder:text-neutral-700
        focus:outline-hidden
        dark:bg-neutral-950 dark:outline-neutral-700 dark:placeholder:text-neutral-400
      `}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onFocus={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      placeholder="Write something…"
      rows={1}
      tabIndex={1}
    />
  );
}
