import type { Bg_Color } from '../../../types/Bg_Color';
import type NoteDbData from '../../../types/NoteDbData';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import bgVariantClass from '../../../utils/bgVariantClass';
import cn from '../../../utils/cn';
import Color from '../../icons/Color';
import No from '../../icons/No';

export default function BackgroundSwatches({
  selectedColor,
  setSelectedColor,
  btnClasses,
  updateNoteToDb,
  existingNote,
}: {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<Bg_Color>>;
  btnClasses: string;
  updateNoteToDb: () => Promise<void>;
  existingNote?: NoteDbData;
}) {
  const queryClient = useQueryClient();

  const colorMutation = useMutation({
    mutationFn: updateNoteToDb,
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  useEffect(() => {
    if (existingNote)
      colorMutation.mutate();
    // changes to selectedColor should send Supabase request immediately
  }, [selectedColor]);

  const bgColors: Bg_Color[] = ['', 'blue', 'red', 'pink', 'yellow', 'green'];

  const coloredRadioItems = bgColors.map(color => (
    <Button
      className={cn(bgVariantClass[color], color === selectedColor && `border border-primary`,
      )}
      isDisabled={colorMutation.isLoading}
      isIconOnly
      key={color}
      onPress={() => setSelectedColor(color)}
      radius="full"
      size="sm"
    >
      {color ? null : <No className="w-6 stroke-default-500" />}
    </Button>
  ));

  return (
    <Popover
      classNames={{
        content: cn(`
          z-40 flex-row gap-1 p-3 outline-1 outline-default-400
          dark:bg-neutral-950
        `),
      }}
      placement="bottom-start"
      radius="sm"
    >
      <PopoverTrigger>
        <button className={btnClasses} title="Change color">
          <Color className={`
            size-5 stroke-neutral-700
            dark:stroke-neutral-200
          `}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        {...coloredRadioItems}
      </PopoverContent>
    </Popover>
  );
}
