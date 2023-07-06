import { Root, Viewport, Scrollbar, Thumb } from '@radix-ui/react-scroll-area';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useContext, useEffect, useState } from 'react';
import { AllLabelsContext } from '../../../contexts/AllLabelsContext';
import LabelDbData from '../../../types/LabelDbData';
import labelExists from '../../../utils/labelExists';
import Check from '../../icons/Check';
import Plus from '../../icons/Plus';

export default function LabelSuggestionsWithSearch({
  labelsToAdd,
  setLabelsToAdd,
  suggestionWithSearchPos,
  setSearchingForLabel,
}: {
  labelsToAdd: string[];
  setLabelsToAdd: (value: React.SetStateAction<string[]>) => void;
  suggestionWithSearchPos: { left: number; top: number };
  setSearchingForLabel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const allLabels = useContext(AllLabelsContext);
  const [focusedLabelIndex, setFocusedLabelIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  const filteredLabels = allLabels.filter(({ label_name }) => label_name.match(searchValue));
  let labelsList = [...filteredLabels] as (LabelDbData | string)[];
  if (searchValue) {
    labelsList = [...filteredLabels, searchValue];
  }
  const contentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      // hit 'Tab' will add label to list
      if (searchValue) {
        setLabelsToAdd((prev: string[]) => {
          // suggested label have higher priority over searchValue
          const target = labelsList.length > 0 ? labelsList[focusedLabelIndex] : searchValue;
          if (typeof target === 'string') {
            return prev.includes(target) ? prev : [...prev, target];
          } else {
            return prev.includes(target.label_name) ? prev : [...prev, target.label_name];
          }
        });
      } else {
        // when there's no searchValue
        const target = labelsList[focusedLabelIndex] as LabelDbData;
        if (!labelsToAdd.includes(target.label_name)) {
          setLabelsToAdd((prev) =>
            prev.includes(target.label_name) ? prev : [...prev, target.label_name],
          );
        } else {
          setLabelsToAdd((prev) =>
            prev.filter((existingLabel) => existingLabel !== target.label_name),
          );
        }
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already first, cycle up to last index
        (prev: number) => (prev === 0 ? labelsList.length - 1 : prev - 1),
      );
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedLabelIndex(
        // if already last, cycle to top
        (prev: number) => (prev >= labelsList.length - 1 ? 0 : prev + 1),
      );
    }
    if (e.key === 'Escape') {
      e.stopPropagation();
      setSearchingForLabel(false);
    }
  };
  const regularLabelButton = (label_name: string, i: number) => (
    <label
      key={label_name}
      onClick={(e) => e.stopPropagation()}
      className={`${
        focusedLabelIndex === i && 'bg-slate-200 dark:bg-slate-800'
      } flex cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800`}
    >
      <Checkbox.Root
        checked={labelsToAdd.includes(label_name)}
        onCheckedChange={(checked) => {
          if (checked) {
            setLabelsToAdd((prev) => (prev.includes(label_name) ? prev : [...prev, label_name]));
          } else {
            setLabelsToAdd((prev) => prev.filter((existingLabel) => existingLabel !== label_name));
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
        setLabelsToAdd((prev) => (prev.includes(label_name) ? prev : [...prev, label_name]))
      }
      className={`${
        focusedLabelIndex === i && 'bg-slate-200 dark:bg-slate-800'
      } flex items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800`}
    >
      <Plus className="h-4 w-4" />
      <span>
        Create &apos;<span className="font-bold">{label_name}</span>&apos;
      </span>
    </button>
  );

  const labelElems = labelsList.map((elem, i) => {
    if (typeof elem === 'string') {
      if (!labelExists(elem, allLabels)) return addNewLabelButton(elem, i);
    } else return regularLabelButton(elem.label_name, i);
  });

  useEffect(() => {
    function toggleSearchingForLabel() {
      setSearchingForLabel(false);
    }
    document.addEventListener('click', toggleSearchingForLabel);

    return () => {
      document.removeEventListener('click', toggleSearchingForLabel);
    };
  }, [setSearchingForLabel]);

  return (
    <Root
      style={{ position: 'absolute', ...suggestionWithSearchPos }} // to override Radix
      className="z-10 max-h-64 w-48 overflow-hidden rounded bg-slate-100 outline outline-1 outline-slate-400 dark:bg-slate-900 dark:outline-slate-700"
    >
      <Viewport className="h-full w-full rounded">
        <input
          autoFocus
          type="text"
          value={searchValue}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={contentKeyDown}
          placeholder="Search for labels…"
          className="input-global border-b-2 border-slate-300 px-4 py-2 text-left text-[13px] focus:outline-none dark:border-slate-700
          "
        />
        <div className="grid grid-cols-1 divide-y divide-slate-300 pb-1 dark:divide-slate-700">
          {labelElems}
        </div>
      </Viewport>
      <Scrollbar
        orientation="vertical"
        className="flex touch-none select-none bg-slate-100 p-0.5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col dark:bg-slate-900"
      >
        <Thumb className="relative flex-1 rounded-full bg-slate-400 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] dark:bg-slate-600" />
      </Scrollbar>
    </Root>
  );
}
