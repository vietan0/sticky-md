import NoteDbData from '../types/NoteDbData';
import NoteUploadData from '../types/NoteUploadData';
import supabase from './connect';
import { cleanupUnusedLabel } from './labels';

async function getAllNotes(uid: string | undefined) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  if (error) console.error(error);
  return data as NoteDbData[];
}

async function getNote(id: string) {
  const { data, error } = await supabase.from('notes').select('*').eq('note_id', id);
  if (error) console.error(error);
  if (data) return data[0];
}

async function createNote(noteUploadData: NoteUploadData) {
  const { data, error } = await supabase.from('notes').insert(noteUploadData).select();
  if (error) console.error(error);
  return data;
}

async function updateNote(id: string, changedFields: object) {
  const { data, error } = await supabase
    .from('notes')
    .update(changedFields)
    .eq('note_id', id)
    .select();
}

async function deleteNote(id: string, userId: string) {
  const { data, error } = await supabase.from('notes').delete().eq('note_id', id).select();
  if (error) console.error(error);
  if (data) {
    const deletedNote = data[0] as NoteDbData;
    const { labels } = deletedNote;
    labels.forEach((label) => {
      cleanupUnusedLabel(label, userId);
    })
  }
}

export { getAllNotes, getNote, createNote, updateNote, deleteNote };
