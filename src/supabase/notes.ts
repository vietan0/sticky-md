import NoteUploadData from '../types/NoteUploadData';
import supabase from './connect';

async function getAllNotes(uid: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  if (error) console.error(error);
  return data;
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

async function deleteNote(id: string) {
  const { data, error } = await supabase.from('notes').delete().eq('note_id', id);
}

export { getAllNotes, getNote, createNote, updateNote, deleteNote };
