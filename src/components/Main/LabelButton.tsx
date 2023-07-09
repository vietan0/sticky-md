import { useState } from 'react';
import Close from '../icons/Close';

export default function LabelButton({
  label,
  removeLabel,
}: {
  label: string;
  removeLabel: (target: string) => void;
}) {
  const [hovering, setHovering] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative flex self-start rounded-full bg-slate-300 px-3 py-1 text-xs outline outline-1 outline-slate-400 hover:bg-slate-400 hover:pl-1 hover:pr-5 dark:bg-slate-900 dark:outline-slate-700 dark:hover:bg-slate-800"
    >
      <span>{label}</span>
      {hovering && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            removeLabel(label);
          }}
        >
          <Close className="absolute right-0 top-0 h-6 w-6 rounded-full bg-slate-400 p-1 outline outline-1 outline-slate-700 hover:bg-slate-500 dark:bg-slate-900 dark:hover:bg-slate-800" />
        </div>
      )}
    </button>
  );
}
