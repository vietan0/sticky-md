import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import Color from '../../icons/Color';
import No from '../../icons/No';
import { Bg_Color } from '../../../types/Bg_Color';
import getTwBgClasses from '../../../utils/getTwBgClasses';

export default function BackgroundSwatches({
  selectedColor,
  setSelectedColor,
}: {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<Bg_Color>>;
}) {
  const bgColors: Bg_Color[] = ['blue', 'red', 'pink', 'yellow', 'green']
  const coloredRadioItems = bgColors.map((color) => {
    return (
      <RadioGroup.Item
        key={color}
        value={color}
        aria-label={color}
        className={`${getTwBgClasses(color)} h-8 w-8 cursor-pointer rounded-full`}
      >
        <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-full after:w-full after:rounded-full after:outline after:outline-1 after:outline-neutral-700 after:content-[''] dark:after:outline-neutral-300" />
      </RadioGroup.Item>
    );
  });

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          tabIndex={5}
          className="rounded-full p-2 bg-black/5 hover:bg-black/10 focus:bg-black/20 dark:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:focus:bg-white/20"
        >
          <Color className="h-5 w-5 stroke-neutral-700 dark:stroke-neutral-200" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={16}
          className="flex flex-row gap-2 rounded bg-white p-3 outline outline-1 outline-neutral-400 dark:bg-neutral-950 dark:outline-neutral-700"
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
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline outline-1 outline-neutral-400 dark:outline-neutral-700"
            >
              <No className="h-5 w-5" />
              <RadioGroup.Indicator className="absolute flex h-full w-full items-center justify-center after:block after:h-full after:w-full after:rounded-full after:outline after:outline-1 after:outline-neutral-700 after:content-[''] dark:after:outline-neutral-300" />
            </RadioGroup.Item>
            {...coloredRadioItems}
          </RadioGroup.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}