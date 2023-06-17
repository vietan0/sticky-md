import { useState } from 'react';
import Close from './icons/Close';

export default function LabelButton({ label }: { label: string }) {
  const [hovering, setHovering] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative flex self-start rounded-full bg-slate-900 px-2 py-1 text-xs outline outline-1 outline-slate-700 hover:bg-slate-800 hover:pr-7"
    >
      <span>{label}</span>
      {hovering && (
        <Close className="absolute right-0 top-0 h-6 w-6 rounded-full bg-slate-900 p-1 outline outline-1 outline-slate-700 hover:bg-slate-800" />
      )}
    </button>
  );
}
