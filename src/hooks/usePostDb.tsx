import { useContext, useMemo } from 'react';
import { User } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../contexts';
import { createNote, deleteNote, updateNote } from '../supabase/notes';
import { createLabels, getLabelId, getLabelIds, removeLabelFromNote } from '../supabase/labels';
import { createNotesLabels } from '../supabase/notes_labels';
import NoteDbData from '../types/NoteDbData';
import NoteUploadData from '../types/NoteUploadData';
import labelExists from '../utils/labelExists';
import shallowCompare from '../utils/shallowCompare';
import useLabels from './queries/useLabels';

export default function usePostDb(noteUploadData: NoteUploadData, existingNote?: NoteDbData) {
  const currentUser = useContext(UserContext);
  const { data: labels } = useLabels(currentUser?.uid);
  const allLabels = useMemo(() => {
    return labels || [];
  }, [labels]);

  const queryClient = useQueryClient();
  async function updateNoteToDb() {
    if (!existingNote || !currentUser) return;
    const {
      title,
      content,
      note_id,
      labels: existingLabels,
      bg_color,
      image_urls: existingImageUrls,
    } = existingNote as NoteDbData;
    if (
      noteUploadData.title !== title ||
      noteUploadData.content !== content ||
      noteUploadData.bg_color !== bg_color ||
      !shallowCompare(noteUploadData.labels, existingLabels) ||
      !shallowCompare(noteUploadData.image_urls, existingImageUrls)
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
        if (newLabels.length > 0) { 
          await createLabels(newLabels, currentUser.uid);
        }
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
            await removeLabelFromNote(note_id, existingLabel, currentUser.uid);
            await queryClient.invalidateQueries({ queryKey: ['notes']});
            await queryClient.invalidateQueries({ queryKey: ['labels']});
          }
        });
      } else {
        await deleteNote(note_id, currentUser?.uid);
      }
    }
  }

  async function insertNoteToDb() {
    if (currentUser && (noteUploadData.title || noteUploadData.content)) {
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
