import { useState } from 'react';
import CustomMd from '../../CustomMd';

export default function ToggleMdRaw({
  isTitle = false,
  value,
  children,
}: {
  isTitle?: boolean;
  value: string;
  children: JSX.Element;
}) {
  const [editing, setEditing] = useState(value === '' ? true : false);

  const md = (
    <div className="cursor-pointer" onClick={() => setEditing(true)}>
      <CustomMd className="flex flex-col gap-2 text-[15px]">
        {isTitle ? `# ${value}` : value}
      </CustomMd>
    </div>
  );
  return editing ? children : md;
}
