import * as Popover from '@radix-ui/react-popover';
import { useContext } from 'react';
import Color from '../../icons/Color';
import { ThemeContext } from '../../../contexts';
import No from '../../icons/No';

function Swatch({ className, none }: { className?: string; none?: boolean }) {
  return (
    <div
      className={`${className} ${
        none && 'outline outline-1 outline-slate-300'
      } flex h-8 w-8 items-center justify-center rounded-full hover:outline hover:outline-1 hover:outline-slate-600 dark:hover:outline-slate-400`}
    >
      {none && <No className="h-5 w-5" />}
    </div>
  );
}

export default function BackgroundSwatches() {
  const { htmlHasDark } = useContext(ThemeContext);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          tabIndex={5}
          className="cursor-pointer rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-100 focus:bg-slate-200 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
          aria-label="Update dimensions"
        >
          <Color className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={16}
          className="rounded bg-white p-3 outline outline-1 outline-slate-400 dark:bg-slate-950 dark:outline-slate-700"
        >
          <div className="flex flex-row gap-2">
            <Swatch none />
            <Swatch className={htmlHasDark ? 'bg-card-blue-dark' : 'bg-card-blue-light'} />
            <Swatch className={htmlHasDark ? 'bg-card-red-dark' : 'bg-card-red-light'} />
            <Swatch className={htmlHasDark ? 'bg-card-pink-dark' : 'bg-card-pink-light'} />
            <Swatch className={htmlHasDark ? 'bg-card-yellow-dark' : 'bg-card-yellow-light'} />
            <Swatch className={htmlHasDark ? 'bg-card-green-dark' : 'bg-card-green-light'} />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
