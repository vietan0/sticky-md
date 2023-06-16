import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { dbCreate } from '../firebase/db';
import NoteData from '../types/NoteData';
import getDateNow from '../utils/getDate';
import Color from './icons/Color';
import Ellipsis from './icons/Ellipsis';
import Label from './icons/Label';

export default function WriteArea({ setIsWriting }: { setIsWriting: (val: boolean) => void }) {
  const [labels, setLabels] = useState<string[]>([]);
  const { register, handleSubmit } = useForm<{ title: string; content: string }>();
  const onSubmit: SubmitHandler<{ title: string; content: string }> = (formData) => {
    const now = getDateNow();
    const noteData: NoteData = {
      ...formData,
      labels,
      createdAt: now,
      lastModifiedAt: now,
    };
    dbCreate(noteData);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      handleSubmit(onSubmit)();
      setIsWriting(false);
    }
  };

  return (
    <form
      action=""
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      className="max-w-lg overflow-hidden rounded-lg bg-slate-900"
    >
      <input
        type="text"
        placeholder="Title"
        {...register('title')}
        className="input-global p-4 pb-2 font-semibold focus:outline-none"
      />
      <textarea
        rows={3}
        autoFocus
        placeholder="Write something…"
        {...register('content')}
        className="input-global resize-none px-4 py-2 focus:outline-none"
      />
      <div id="add-stuffs" className="flex items-center gap-2 p-4">
        <button
          type="button"
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          <Label className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          <Color className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          <Ellipsis className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="ml-auto rounded-full px-4 py-2 leading-5 outline outline-1 outline-slate-800 hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </form>
  );
}
