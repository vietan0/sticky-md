import { useContext } from 'react';
import { User } from 'firebase/auth';
import { UserContext, AllLabelsContext } from '../contexts';
import { createNote, deleteNote, updateNote } from '../supabase/notes';
import { createLabels, getLabelId, getLabelIds } from '../supabase/labels';
import { createNotesLabels, deleteNotesLabels } from '../supabase/notes_labels';
import NoteDbData from '../types/NoteDbData';
import NoteUploadData from '../types/NoteUploadData';
import labelExists from '../utils/labelExists';

export default function usePostDb(noteUploadData: NoteUploadData, existingNote?: NoteDbData) {
  const currentUser = useContext(UserContext) as User;
  const allLabels = useContext(AllLabelsContext);

  async function updateNoteToDb() {
    const { title, content, note_id, labels: existingLabels, bg_color } = existingNote as NoteDbData;
    if (
      noteUploadData.title !== title ||
      noteUploadData.content !== content ||
      noteUploadData.labels !== existingLabels ||
      noteUploadData.bg_color !== bg_color
    ) {
      // only do this if there's something changed
      if (noteUploadData.title || noteUploadData.content) {
        // only edit note if title or content exists, else delete note
        // 1. update to notes
        await updateNote(note_id, {
          ...noteUploadData,
          last_modified_at: new Date().toISOString(),
        });
        // 2. update to labels
        const newLabels = noteUploadData.labels.filter((label) => !labelExists(label, allLabels));
        await createLabels(newLabels, currentUser.uid);
        // 3. update to notes_labels
        // these labels aren't in note before editing (but exist in Supabase)
        const newLabelsOfNote = noteUploadData.labels.filter(
          (newLabel) => !existingLabels.includes(newLabel),
        );
        // get their ids to insert new rows to notes_labels
        newLabelsOfNote.forEach(async (newLabel) => {
          const label_id = await getLabelId(newLabel, currentUser.uid);
          await createNotesLabels(note_id, [label_id], currentUser.uid);
        });
        existingLabels.forEach(async (existingLabel) => {
          if (!noteUploadData.labels.includes(existingLabel)) {
            // an old label was removed --> delete from notes_labels
            await deleteNotesLabels(note_id, existingLabel, currentUser.uid);
          }
        });
      }
      else {
        // delete note
        await deleteNote(note_id);
      }
    }
  }

  async function insertNoteToDb() {
    if (noteUploadData.title || noteUploadData.content) {
      // only create note if title or content exists
      // 1. insert to notes
      const result = (await createNote(noteUploadData)) as NoteDbData[];
      const { note_id } = result[0];

      if (noteUploadData.labels.length > 0) {
        // 2. insert to labels
        const newLabels = noteUploadData.labels.filter((label) => !labelExists(label, allLabels));
        await createLabels(newLabels, noteUploadData.user_id);

        // 3. insert to notes_labels
        const labelIds = (await getLabelIds(noteUploadData.labels, currentUser.uid)) as string[];
        await createNotesLabels(note_id, labelIds, noteUploadData.user_id);
      }
    }
  }
  return { updateNoteToDb, insertNoteToDb };
}
