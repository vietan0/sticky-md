import type { RecordReturn } from '../../../hooks/useRecordLabel';
import type { RecordButtonReturn } from '../../../hooks/useRecordLabelButton';
import type NoteDbData from '../../../types/NoteDbData';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { useContext, useEffect, useRef, useState } from 'react';
import { AllLabelsContext } from '../../../contexts';
import labelExists from '../../../utils/labelExists';
import Check from '../../icons/Check';
import Label from '../../icons/Label';
import Plus from '../../icons/Plus';

export default function LabelSuggestions({
  record,
  btnClasses,
  inline = false,
  existingNote,
  inNoteCard = false,
  updateNoteToDb,
}: {
  record: RecordReturn | RecordButtonReturn;
  btnClasses: string;
  inline?: boolean;
  existingNote?: NoteDbData;
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

  const regularLabelButton = (label_name: string, i: number) => (
    <label
      className={`${
        record.focusedLabelIndex === i && 'bg-neutral-200 dark:bg-neutral-900'
      } flex cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-neutral-200 focus:outline-hidden dark:hover:bg-neutral-900`}
      key={label_name}
      onClick={e => e.stopPropagation()}
    >
      <Checkbox.Root
        checked={record.labelsToAdd.includes(label_name)}
        className="flex h-3 w-3 appearance-none items-center justify-center rounded-xs outline-solid outline-1 outline-neutral-500"
        onCheckedChange={(checked) => {
          if (checked) {
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
      >
        <Checkbox.Indicator>
          <Check className="h-3 w-3" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span>{label_name}</span>
    </label>
  );

  const addNewLabelButton = (label_name: string, i: number) => (
    <button
      className={`${
        record.focusedLabelIndex === i && 'bg-neutral-200 dark:bg-neutral-800'
      } flex items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-neutral-200 focus:outline-hidden dark:hover:bg-neutral-900`}
      key={label_name}
      onClick={() =>
        record.setLabelsToAdd(prev => (prev.includes(label_name) ? prev : [...prev, label_name]))}
      type="button"
    >
      <Plus className="h-4 w-4" />
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

    return regularLabelButton(elem.label_name, i);
  });

  const content = (
    <Popover.Content
      align="start"
      className="POPOVER_CONTENT z-40 max-h-64 w-48 overflow-y-scroll rounded-sm bg-white outline-solid outline-1 outline-neutral-300 dark:bg-neutral-950 dark:outline-neutral-700"
      sideOffset={inline ? 0 : 16}
    >
      <input
        autoFocus
        className="w-full border-b-2 border-neutral-300 bg-white px-4 py-2 text-left text-[13px] placeholder:text-neutral-500 focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-950"
        onChange={handleChange}
        onClick={e => e.stopPropagation()}
        onKeyDown={record.searchKeyDown}
        placeholder="Search for labels…"
        type="text"
        value={value}
      />
      <div className="grid grid-cols-1 divide-y divide-neutral-300 pb-1 dark:divide-neutral-700">
        {labelElems}
      </div>
    </Popover.Content>
  );

  const portaled = <Popover.Portal>{content}</Popover.Portal>;
  let renderedContent = portaled;
  // if use button and NoteForm is editing --> remove portal
  if (!inline && existingNote)
    renderedContent = content;

  return (
    <Popover.Root defaultOpen={inline}>
      <Popover.Trigger asChild={!inline}>
        {!inline && (
          <button className={btnClasses} onClick={e => e.stopPropagation()} title="Add labels">
            <Label className="h-5 w-5 stroke-neutral-700 dark:stroke-neutral-200" />
          </button>
        )}
      </Popover.Trigger>
      {renderedContent}
    </Popover.Root>
  );
}
