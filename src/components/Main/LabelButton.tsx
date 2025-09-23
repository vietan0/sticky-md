import { Tooltip } from '@heroui/react';
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
      className={`
        relative flex self-start rounded-full bg-black/10 px-3 py-1 text-xs
        hover:pr-5 hover:pl-1
        dark:bg-white/10
      `}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      type="button"
    >
      <span>{label}</span>
      {hovering && (
        <Tooltip
          classNames={{
            content: 'z-50 rounded-sm bg-black/75 px-2 py-1 text-xs text-white dark:bg-black/90',
          }}
          closeDelay={0}
          content="Remove label"
          delay={500}
          placement="bottom"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              removeLabel(label);
            }}
          >
            <Close className={`
              absolute top-0 right-0 size-6 rounded-full bg-black/10 p-1
              hover:bg-black/25
              dark:bg-white/10 dark:hover:bg-white/25
            `}
            />
          </div>
        </Tooltip>
      )}
    </button>
  );
}
