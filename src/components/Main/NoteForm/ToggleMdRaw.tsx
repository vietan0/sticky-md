import { cloneElement, useState } from 'react';
import CustomMd from '../../CustomMd';
import { RecordReturn } from '../../../hooks/useRecordLabel';
import NoteDbData from '../../../types/NoteDbData';
import Mirror from './Mirror';

export default function ToggleMdRaw({
  isTitle = false,
  value,
  textAreaRef,
  record,
  children: childField,
}: {
  isTitle?: boolean;
  value: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  formRef: React.RefObject<HTMLFormElement>;
  record: RecordReturn;
  existingNote: NoteDbData | undefined;
  children: JSX.Element;
}) {
  const [editing, setEditing] = useState(value === '' ? true : false);

  const md = (
    <div className="cursor-pointer" onClick={() => setEditing(true)}>
      {isTitle ? (
        <CustomMd className="max-h-20 min-h-[28px] overflow-y-auto text-lg font-semibold [&_*]:text-ellipsis [&_*]:text-lg">
          {value}
        </CustomMd>
      ) : (
        <CustomMd className="flex max-h-52 min-h-[22.5px] flex-col gap-2 overflow-y-auto text-[15px]">
          {value}
        </CustomMd>
      )}
    </div>
  );

  const propsToPass: {
    value: string;
    ref: React.RefObject<HTMLInputElement> | React.RefObject<HTMLTextAreaElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onHeightChange?: (height: number) => void;
  } = {
    value,
    ref: textAreaRef,
    onChange: record.fieldChange,
  };

  const childFieldWithRef = cloneElement(childField, propsToPass);

  return editing ? childFieldWithRef : md;
}
