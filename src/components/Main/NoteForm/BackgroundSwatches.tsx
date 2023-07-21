import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import Color from '../../icons/Color';
import No from '../../icons/No';
import { Bg_Color } from '../../../types/Bg_Color';

export default function BackgroundSwatches({
  selectedColor,
  setSelectedColor,
}: {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<Bg_Color>>;
}) {
  const coloredRadioItems = ['blue', 'red', 'pink', 'yellow', 'green'].map((n) => {
    const bgClass = `bg-card-${n}-light dark:bg-card-${n}-dark`;
    return (
      <RadioGroup.Item
        key={n}
        value={n}
        aria-label={n}
        className={`${bgClass} h-8 w-8 cursor-pointer rounded-full`}
      >
        <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-full after:w-full after:rounded-full after:outline after:outline-1 after:outline-slate-700 after:content-[''] dark:after:outline-slate-300" />
      </RadioGroup.Item>
    );
  });

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          tabIndex={5}
          className="rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-100 focus:bg-slate-200 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
        >
          <Color className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={16}
          className="flex flex-row gap-2 rounded bg-white p-3 outline outline-1 outline-slate-400 dark:bg-slate-950 dark:outline-slate-700"
        >
          <RadioGroup.Root
            className="flex gap-2"
            defaultValue={selectedColor}
            aria-label="Choose background color"
            onValueChange={(value: Bg_Color) => setSelectedColor(value)}
          >
            <RadioGroup.Item
              value=""
              aria-label="no color"
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline outline-1 outline-slate-400 dark:outline-slate-700"
            >
              <No className="h-5 w-5" />
              <RadioGroup.Indicator className="absolute flex h-full w-full items-center justify-center after:block after:h-full after:w-full after:rounded-full after:outline after:outline-1 after:outline-slate-700 after:content-[''] dark:after:outline-slate-300" />
            </RadioGroup.Item>
            {...coloredRadioItems}
          </RadioGroup.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
