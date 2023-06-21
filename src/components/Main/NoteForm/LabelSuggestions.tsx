import { Root, Viewport, Scrollbar, Thumb } from '@radix-ui/react-scroll-area';
import { useContext } from 'react';
import { AllLabelsContext } from '../../../contexts/AllLabelsContext';
import LabelDbData from '../../../types/LabelDbData';
import labelExists from '../../../utils/labelExists';
import Plus from '../../icons/Plus';

export default function LabelSuggestions({
  focusedLabelIndex,
  labelsList,
  addToLabelList,
  suggestionPos,
}: {
  focusedLabelIndex: number;
  labelsList: (LabelDbData | string)[];
  addToLabelList: (label_name: string) => void;
  suggestionPos: { left: number; top: number };
}) {
  const allLabels = useContext(AllLabelsContext);
  const regularLabelButton = (label: string, i: number) => (
    <button
      key={label}
      type="button"
      onClick={() => addToLabelList(label)}
      className={`${
        focusedLabelIndex === i && 'bg-slate-800'
      } px-4 py-2 text-left text-[13px] hover:bg-slate-800 focus:outline-none`}
    >
      {label}
    </button>
  );
  const addNewLabelButton = (label: string, i: number) => (
    <button
      key={label}
      type="button"
      onClick={() => addToLabelList(label)}
      className={`${
        focusedLabelIndex === i && 'bg-slate-800'
      } flex items-center gap-2 px-4 py-2 text-left text-[13px] hover:bg-slate-800 focus:outline-none`}
    >
      <Plus className="h-4 w-4" />
      <span>
        Create &apos;<span className="font-bold">{label}</span>&apos;
      </span>
    </button>
  );
  const labelElems = labelsList.map((elem, i) => {
    if (typeof elem === 'string') {
      if (!labelExists(elem, allLabels)) return addNewLabelButton(elem, i);
    } else return regularLabelButton(elem.label_name, i);
  });

  return (
    <Root
      style={{ position: 'absolute', ...suggestionPos }} // to override Radix
      className={`max-h-64 w-48 overflow-hidden rounded bg-slate-100 ${
        labelElems.length > 0 ? 'outline' : ''
      } outline-1 outline-slate-400 dark:bg-slate-900 dark:outline-slate-700`}
    >
      <Viewport className="h-full w-full rounded">
        <div className="grid grid-cols-1 divide-y divide-slate-700 py-1">{labelElems}</div>
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
