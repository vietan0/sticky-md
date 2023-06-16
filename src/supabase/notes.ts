import NoteUploadData from '../types/NoteUploadData';
import supabase from './connect';

async function getAllNotes(uid: string) {
  const { data, error } = await supabase.from('notes').select('*').eq('user_id', uid);
  if (error) console.error(error);
  return data;
}
async function getNote(id: string) {
  const { data, error } = await supabase.from('notes').select('*').eq('note_id', id);
  return data[0];
}
async function createNote(noteUploadData: NoteUploadData) {
  const { error } = await supabase.from('notes').insert(noteUploadData);
  if (error) console.error(error);
}
async function deleteNote(id: string) {
  const { data, error } = await supabase.from('notes').delete().eq('note_id', id);
}

export { getAllNotes, getNote, createNote, deleteNote };
