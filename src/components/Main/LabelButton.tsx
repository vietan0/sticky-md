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
      className="relative flex self-start rounded-full bg-black/10 px-3 py-1 text-xs hover:pl-1 hover:pr-5 dark:bg-white/10"
    >
      <span>{label}</span>
      {hovering && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            removeLabel(label);
          }}
        >
          <Close className="absolute right-0 top-0 h-6 w-6 rounded-full bg-black/10 p-1 hover:bg-black/25 dark:bg-white/10 dark:hover:bg-white/25" />
        </div>
      )}
    </button>
  );
}
