export default function NotePrompt({ setFormOpen }: { setFormOpen: (val: boolean) => void }) {
  return (
    <textarea
      rows={1}
      tabIndex={1}
      placeholder="Write something…"
      onFocus={(e) => {
        e.stopPropagation();
        setFormOpen(true);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setFormOpen(true);
      }}
      className="mx-auto block w-full max-w-xl resize-none rounded-lg bg-white p-4 font-mono tracking-tight outline outline-1 outline-neutral-300 placeholder:text-neutral-700 focus:outline-none dark:bg-neutral-950 dark:outline-neutral-700 dark:placeholder:text-neutral-400"
    />
  );
}
