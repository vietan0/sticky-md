import type { RecordReturn } from '../../../hooks/useRecordLabel';
import type { RecordButtonReturn } from '../../../hooks/useRecordLabelButton';
import { Checkbox, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { AllLabelsContext } from '../../../contexts';
import cn from '../../../utils/cn';
import labelExists from '../../../utils/labelExists';
import Label from '../../icons/Label';
import Plus from '../../icons/Plus';

export default function LabelSuggestions({
  record,
  btnClasses,
  inline = false,
  inNoteCard = false,
  updateNoteToDb,
}: {
  record: RecordReturn | RecordButtonReturn;
  btnClasses: string;
  inline?: boolean;
  inNoteCard?: boolean;
  updateNoteToDb?: () => Promise<void>;
}) {
  const allLabels = useContext(AllLabelsContext);
  const [value, setValue] = useState('');
  const renderCount = useRef(1);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.startsWith(' ')) {
      // prevent starting with space
      setValue(e.target.value.trim());
    }
    else {
      setValue(e.target.value);
    }

    renderCount.current += 1;
  }

  useEffect(() => {
    record.setExtractedLabel(value);
  }, [record, value]);

  useEffect(() => {
    if (inNoteCard && updateNoteToDb)
      updateNoteToDb();
    // if <LabelSug> is in <NoteCard>,
    // changes to labelsToAdd should send Supabase request immediately
  }, [record.labelsToAdd]);

  const regularLabelButton = (label_name: string) => (
    <Checkbox
      classNames={{
        base: 'max-w-none m-0 hover:bg-default-100',
      }}
      color="default"
      isSelected={record.labelsToAdd.includes(label_name)}
      key={label_name}
      onValueChange={(isSelected) => {
        if (isSelected) {
          const updated = record.labelsToAdd.includes(label_name)
            ? record.labelsToAdd
            : [...record.labelsToAdd, label_name];

          record.setLabelsToAdd(updated);
        }
        else {
          const updated = record.labelsToAdd.filter(
            existingLabel => existingLabel !== label_name,
          );

          record.setLabelsToAdd(updated);
        }
      }}
      size="sm"
    >
      {label_name}
    </Checkbox>
  );

  const addNewLabelButton = (label_name: string, i: number) => (
    <button
      className={cn(
        record.focusedLabelIndex === i && `
          bg-neutral-200
          dark:bg-neutral-800
        `,
        `
          flex items-center gap-2 p-2 text-left text-[13px]
          hover:bg-neutral-200
          focus:outline-hidden
          dark:hover:bg-neutral-900
        `,
      )}
      key={label_name}
      onClick={() =>
        record.setLabelsToAdd(prev => (prev.includes(label_name) ? prev : [...prev, label_name]))}
      type="button"
    >
      <Plus className="size-4" />
      <span>
        Create &apos;
        <span className="font-bold">{label_name}</span>
        &apos;
      </span>
    </button>
  );

  const labelElems = record.labelsList.map((elem, i) => {
    if (typeof elem === 'string') {
      return labelExists(elem, allLabels) ? null : addNewLabelButton(elem, i);
    }

    return regularLabelButton(elem.label_name);
  });

  return (
    <Popover
      classNames={{
        base: cn('overflow-hidden rounded-small border border-default-400'),
        content: cn('items-stretch rounded-none bg-default-50 p-0'),
      }}
      placement="bottom-start"
    >
      <PopoverTrigger>
        {!inline && (
          <button className={btnClasses} onClick={e => e.stopPropagation()} title="Add labels">
            <Label className={`
              size-5 stroke-neutral-700
              dark:stroke-neutral-200
            `}
            />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <input
          autoFocus
          className={`
            w-full border-b-2 border-default-200 bg-white px-3 py-2 text-[13px]
            placeholder:text-neutral-500
            focus:outline-hidden
            dark:bg-neutral-950
          `}
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
          onKeyDown={record.searchKeyDown}
          placeholder="Search for labels…"
          type="text"
          value={value}
        />
        <div className="flex flex-col divide-y divide-default-200 pb-1">
          {labelElems}
        </div>
      </PopoverContent>
    </Popover>
  );
}
