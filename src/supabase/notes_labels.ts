import supabase from './connect';
import { getLabelId } from './labels';

async function createNotesLabels(note_id: string, labelIds: string[], user_id: string) {
  const { data, error } = await supabase
    .from('notes_labels')
    .insert(labelIds.map((label_id) => ({ note_id, label_id, user_id })));
  if (error) console.error(error);
}

async function getNotesLabels(label_id: string) {
  const { data, error } = await supabase
    .from('notes_labels')
    .select('*')
    .eq('label_id', label_id);

  if (error) console.error(error);
  if (data) return data;
}

async function deleteNotesLabels(note_id: string, label_name: string, user_id: string) {
  const label_id = await getLabelId(label_name, user_id);
  const { error } = await supabase.from('notes_labels').delete().match({ note_id, label_id });
  if (error) console.error(error);
}
export { createNotesLabels, getNotesLabels, deleteNotesLabels };
