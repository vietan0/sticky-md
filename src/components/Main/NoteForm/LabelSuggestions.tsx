import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useContext, useEffect, useRef, useState } from 'react';
import Label from '../../icons/Label';
import { RecordReturn } from '../../../hooks/useRecordLabel';
import { RecordButtonReturn } from '../../../hooks/useRecordLabelButton';
import { AllLabelsContext } from '../../../contexts';
import labelExists from '../../../utils/labelExists';
import Check from '../../icons/Check';
import Plus from '../../icons/Plus';

export default function LabelSuggestions({
  record,
  inline = false,
}: {
  record: RecordReturn | RecordButtonReturn;
  inline?: boolean;
}) {
  const allLabels = useContext(AllLabelsContext);
  const [value, setValue] = useState('');
  const renderCount = useRef(1);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.startsWith(' ')) {
      // prevent starting with space
      setValue(e.target.value.trim());
    } else setValue(e.target.value);
    renderCount.current += 1;
  }

  useEffect(() => {
    record.setExtractedLabel(value);
  }, [record, value]);

  const regularLabelButton = (label_name: string, i: number) => (
    <label
      key={label_name}
      onClick={(e) => e.stopPropagation()}
      className={`${
        record.focusedLabelIndex === i && 'bg-slate-200 dark:bg-slate-900'
      } flex cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-900`}
    >
      <Checkbox.Root
        checked={record.labelsToAdd.includes(label_name)}
        onCheckedChange={(checked) => {
          if (checked) {
            record.setLabelsToAdd((prev) =>
              prev.includes(label_name) ? prev : [...prev, label_name],
            );
          } else {
            record.setLabelsToAdd((prev) =>
              prev.filter((existingLabel) => existingLabel !== label_name),
            );
          }
        }}
        className="flex h-3 w-3 appearance-none items-center justify-center rounded-sm outline outline-1 outline-slate-500"
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
      key={label_name}
      type="button"
      onClick={() =>
        record.setLabelsToAdd((prev) => (prev.includes(label_name) ? prev : [...prev, label_name]))
      }
      className={`${
        record.focusedLabelIndex === i && 'bg-slate-200 dark:bg-slate-800'
      } flex items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-900`}
    >
      <Plus className="h-4 w-4" />
      <span>
        Create &apos;<span className="font-bold">{label_name}</span>&apos;
      </span>
    </button>
  );

  const labelElems = record.labelsList.map((elem, i) => {
    if (typeof elem === 'string') {
      if (!labelExists(elem, allLabels)) return addNewLabelButton(elem, i);
    } else return regularLabelButton(elem.label_name, i);
  });

  return (
    <Popover.Root defaultOpen={inline} open={record.isRecordingLabel}>
      <Popover.Trigger asChild={!inline}>
        {!inline && (
          <button
            tabIndex={4}
            onClick={() => record.setIsRecordingLabel((prev) => !prev)}
            className="rounded-full p-2 outline outline-1 outline-slate-300 hover:bg-slate-100 focus:bg-slate-200 dark:outline-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
          >
            <Label className="h-5 w-5 stroke-slate-700 dark:stroke-slate-200" />
          </button>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={inline ? 0 : 16}
          onPointerDownOutside={() => record.setIsRecordingLabel(false)}
          className="POP-CONTENT max-h-64 w-48 overflow-y-scroll rounded bg-white outline outline-1 outline-slate-300 dark:bg-slate-950 dark:outline-slate-700"
        >
          <input
            autoFocus
            type="text"
            value={value}
            onClick={(e) => e.stopPropagation()}
            onChange={handleChange}
            onKeyDown={record.searchKeyDown}
            placeholder="Search for labels…"
            className="w-full border-b-2 border-slate-300 bg-white px-4 py-2 text-left text-[13px] placeholder:text-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
          />
          <div className="grid grid-cols-1 divide-y divide-slate-300 pb-1 dark:divide-slate-700">
            {labelElems}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
