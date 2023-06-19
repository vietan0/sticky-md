import { Root, Viewport, Scrollbar, Thumb } from '@radix-ui/react-scroll-area';
import { useContext } from 'react';
import { AllLabelsContext } from '../contexts/AllLabelsContext';
import Plus from './icons/Plus';

export default function LabelSuggestions({
  extractedLabel,
  filteredLabels,
  focusedLabelIndex,
  addToLabelList,
}: {
  extractedLabel: string;
  filteredLabels: string[];
  focusedLabelIndex: number;
  addToLabelList: (label_name: string) => void;
}) {
  const allLabels = useContext(AllLabelsContext);
  const extractedLabelIsUnique = !allLabels.some(({ label_name }) => label_name === extractedLabel);

  const labelElems = filteredLabels.map((label_name, i) => (
    <button
      key={label_name}
      type="button"
      onClick={() => addToLabelList(label_name)}
      className={`${
        focusedLabelIndex === i && 'bg-slate-800'
      } px-4 py-2 text-left text-[13px] hover:bg-slate-800 focus:outline-none`}
    >
      {label_name}
    </button>
  ));

  const addNewLabelButton = (
    <button
      type="button"
      onClick={() => addToLabelList(extractedLabel)}
      className="flex items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-slate-800 focus:outline-none"
    >
      <Plus className="h-4 w-4" />
      <span>
        Create &apos;<span className="font-bold">{extractedLabel}</span>&apos;
      </span>
    </button>
  );
  return (
    <Root
      style={{ position: 'absolute' }} // to override Radix
      className="left-80 top-20 max-h-64 w-48 overflow-hidden rounded  bg-slate-100 outline outline-1 outline-slate-400 dark:bg-slate-900 dark:outline-slate-700"
    >
      <Viewport className="h-full w-full rounded">
        <div className="grid grid-cols-1 divide-y divide-slate-700 py-1">
          {labelElems}
          {extractedLabel && extractedLabelIsUnique && addNewLabelButton}
        </div>
      </Viewport>
      <Scrollbar
        orientation="vertical"
        className="flex touch-none select-none bg-slate-100 p-0.5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col dark:bg-slate-900"
      >
        <Thumb className="relative flex-1 rounded-full bg-slate-400  before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] dark:bg-slate-600" />
      </Scrollbar>
    </Root>
  );
}
