import { useContext } from 'react';
import { Root, Viewport } from '@radix-ui/react-scroll-area';
import LabelDbData from '../../../types/LabelDbData';
import { AllLabelsContext } from '../../../contexts/AllLabelsContext';
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
  const regularLabelButton = (label_name: string, i: number) => (
    <button
      key={label_name}
      type="button"
      onClick={() => addToLabelList(label_name)}
      className={`${
        focusedLabelIndex === i && 'bg-slate-200 dark:bg-slate-800'
      } px-4 py-2 text-left text-[13px] hover:bg-slate-200 focus:outline-none dark:hover:bg-slate-800`}
    >
      {label_name}
    </button>
  );
  const addNewLabelButton = (label_name: string, i: number) => (
    <button
      key={label_name}
      type="button"
      onClick={() => addToLabelList(label_name)}
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

  let visibility = '';
  if (suggestionPos.left === 0 || labelElems.length === 0) {
    visibility = 'invisible';
  }

  return (
    <Root
      style={{ position: 'absolute', ...suggestionPos }} // to override Radix
      className={`${visibility} z-10 max-h-64 w-48 overflow-y-scroll rounded bg-slate-100 outline outline-1 outline-slate-400 dark:bg-slate-900 dark:outline-slate-700`}
    >
      <Viewport className="h-full w-full rounded">
        <div className="grid grid-cols-1 divide-y divide-slate-300 py-1 dark:divide-slate-700">
          {labelElems}
        </div>
      </Viewport>
    </Root>
  );
}
