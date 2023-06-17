import { SubmitHandler, useForm } from 'react-hook-form';
import { useState, useContext, useRef } from 'react';
import { User } from 'firebase/auth';
import { Root, Viewport, Scrollbar, Thumb, Corner } from '@radix-ui/react-scroll-area';
import NoteUploadData from '../types/NoteUploadData';
import { UserContext } from '../contexts/UserContext';
import { createNote } from '../supabase/notes';
import { AllLabelsContext } from '../contexts/AllLabelsContext';
import Color from './icons/Color';
import Ellipsis from './icons/Ellipsis';
import LabelButton from './LabelButton';
import Label from './icons/Label';

export default function WriteArea({ setIsWriting }: { setIsWriting: (val: boolean) => void }) {
  const currentUser = useContext(UserContext) as User;
  const allLabels = useContext(AllLabelsContext);
  const [labelsToAdd, setLabelsToAdd] = useState<string[]>([]);
  const [labelRecording, setLabelRecording] = useState('');
  const contentArea = useRef<HTMLTextAreaElement | null>(null);
  const [labelsPopupOpen, setLabelsPopupOpen] = useState(false);
  const { register, handleSubmit } = useForm<{ title: string; content: string }>();
  const { ref, onBlur, ...rest } = register('content');

  const onSubmit: SubmitHandler<{ title: string; content: string }> = (formData) => {
    const noteUploadData: NoteUploadData = {
      ...formData,
      labels: labelsToAdd,
      user_id: currentUser.uid,
    };
    createNote(noteUploadData);
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      if (!labelsPopupOpen) {
        handleSubmit(onSubmit)();
        setIsWriting(false);
      } else setLabelsPopupOpen(false);
    }
  };

  const openLabelsPopup = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '#') {
      console.log(window.getSelection());
      setLabelsPopupOpen(true);
    }
  };

  const labelsPopup = (
    <Root
      style={{ position: 'absolute' }} // to override Radix
      className="left-20 top-20 h-56 w-48 overflow-hidden rounded bg-slate-100 outline outline-1 outline-slate-400 dark:bg-slate-900 dark:outline-slate-700"
    >
      <Viewport className="h-full w-full rounded">
        <div className="grid grid-cols-1 divide-y divide-slate-700 py-1">
          {allLabels.map(({ label_name }) => (
            <button
              key={label_name}
              onClick={() => {
                setLabelsToAdd((prev) => [...prev, label_name]);
                setLabelsPopupOpen(false);
              }}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter') {
              //     setLabelsToAdd((prev) => [...prev, label_name]);
              //     setLabelsPopupOpen(false);
              //   }
              // }}
              className="px-4 py-2 text-left text-[13px] hover:bg-slate-700 focus:bg-slate-800 focus:outline-none"
            >
              {label_name}
            </button>
          ))}
        </div>
      </Viewport>
      <Scrollbar
        orientation="vertical"
        className="flex touch-none select-none bg-slate-100 p-0.5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col dark:bg-slate-900"
      >
        <Thumb className="relative flex-1 rounded-full bg-slate-400  before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] dark:bg-slate-600" />
      </Scrollbar>
      <Corner className="bg-slate-800" />
    </Root>
  );

  return (
    <form
      action=""
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleEscape}
      className="relative mx-auto mb-8 flex max-w-lg flex-col gap-2 rounded-lg bg-slate-100 p-4 dark:bg-slate-900"
    >
      <input
        type="text"
        placeholder="Title"
        {...register('title')}
        className="input-global font-semibold focus:outline-none"
      />
      <textarea
        rows={3}
        autoFocus
        {...rest}
        // onBlur={(e) => {
        //   setLabelsPopupOpen(false)
        // }}
        ref={(e) => {
          ref(e);
          contentArea.current = e; // you can still assign to ref
        }}
        onKeyDown={openLabelsPopup}
        placeholder="Write something…"
        className="input-global resize-none py-2 focus:outline-none"
      />
      <div id="labels" className="flex gap-2">
        {labelsToAdd.map((label) => (
          <LabelButton key={label} label={label} />
        ))}
      </div>
      {labelsPopupOpen && labelsPopup}
      <div id="add-stuffs" className="flex items-center gap-2">
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
