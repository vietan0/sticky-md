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
      className="mx-auto block w-full max-w-xl resize-none rounded-lg bg-white dark:bg-slate-950 p-4 font-mono tracking-tight outline outline-1 outline-slate-200 drop-shadow focus:outline-none dark:outline-slate-800"
    />
  );
}
