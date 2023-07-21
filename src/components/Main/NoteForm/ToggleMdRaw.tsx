import { cloneElement, useState } from 'react';
import CustomMd from '../../CustomMd';
import { RecordReturn } from '../../../hooks/useRecordLabel';
import NoteDbData from '../../../types/NoteDbData';
import Mirror from './Mirror';

export default function ToggleMdRaw({
  isTitle = false,
  value,
  inputRef,
  formRef,
  record,
  existingNote,
  children: childField,
}: {
  isTitle?: boolean;
  value: string;
  inputRef: React.RefObject<HTMLInputElement> | React.RefObject<HTMLTextAreaElement>;
  formRef: React.RefObject<HTMLFormElement>;
  record: RecordReturn;
  existingNote: NoteDbData | undefined;
  children: JSX.Element;
}) {
  const [editing, setEditing] = useState(value === '' ? true : false);
  const [mirrorPos, setMirrorPos] = useState({ width: 0, height: 0, top: 0 });

  const md = (
    <div className="cursor-pointer" onClick={() => setEditing(true)}>
      {isTitle ? (
        <h1 className="min-h-[28px] text-lg font-semibold [&_*]:text-lg">
          <CustomMd>{value}</CustomMd>
        </h1>
      ) : (
        <CustomMd className="flex flex-col gap-2 text-[15px] min-h-[22.5px]">{value}</CustomMd>
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
    ref: inputRef,
    onChange: record.fieldChange,
  };
  if (!isTitle) {
    // if it's textarea
    propsToPass.onHeightChange = (height: number) => setMirrorPos((prev) => ({ ...prev, height }));
  }

  const childFieldWithRef = cloneElement(childField, propsToPass);

  return editing ? (
    <>
      {childFieldWithRef}
      <Mirror
        mirrorPos={mirrorPos}
        setMirrorPos={setMirrorPos}
        isTitle={isTitle}
        value={value}
        inputRef={inputRef}
        formRef={formRef}
        record={record}
        existingNote={existingNote}
      />
    </>
  ) : (
    md
  );
}
