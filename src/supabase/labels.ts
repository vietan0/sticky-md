import LabelDbData from '../types/LabelDbData';
import supabase from './connect';
import { deleteNotesLabels, getNotesLabels } from './notes_labels';

async function getAllLabels(uid: string | undefined) {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .eq('user_id', uid)
    .order('label_name', { ascending: true });
  if (error) console.error(error);
  return data as LabelDbData[];
}

async function getLabelId(label_name: string, user_id: string) {
  const { data, error } = await supabase
    .from('labels')
    .select('label_id')
    .match({ label_name, user_id });

  if (error) console.error(error);
  if (data) return data[0].label_id;
}

async function getLabelIds(labelNames: string[], user_id: string) {
  const { data, error } = await supabase
    .from('labels')
    .select('label_id')
    .eq('user_id', user_id)
    .in('label_name', labelNames);
  if (error) console.error(error);
  return data?.map(({ label_id }: { label_id: string }) => label_id);
}

async function createLabels(newLabelsOnly: string[], user_id: string) {
  const { data, error } = await supabase
    .from('labels')
    .insert(newLabelsOnly.map((label_name) => ({ label_name, user_id })));
  if (error) console.error(error);
}

async function removeLabelFromNote(note_id: string, label_name: string, user_id: string) {
  // 1. delete label name from column 'labels' inside a row in table 'notes'
  const { data, error } = await supabase.from('notes').select('labels').eq('note_id', note_id);
  if (error) console.error(error);
  if (data) {
    const currentLabels = data[0].labels;
    const updatedLabels = currentLabels.filter((n: string) => n != label_name);
    await supabase.from('notes').update({ labels: updatedLabels }).eq('note_id', note_id).select();

    // 2. delete a row from join table 'notes_labels'
    await deleteNotesLabels(note_id, label_name, user_id);
    await cleanupUnusedLabel(label_name, user_id);
  }
}

async function deleteLabelByName(label_name: string, user_id: string) {
  const { error } = await supabase.from('labels').delete().match({ label_name, user_id });
  if (error) console.error(error);
}

async function deleteLabelById(label_id: string) {
  const { error } = await supabase.from('labels').delete().eq('label_id', label_id);
  if (error) console.error(error);
}

/**
 * If a label isn't used by any note, delete it from DB.
 * Run after: 
 * 1. A label is removed from a note.
 * 2. A note is deleted.
 */
async function cleanupUnusedLabel(label_name: string, user_id: string) {
  const labelId = await getLabelId(label_name, user_id);
  const notesLabelsWithThisLabelId = await getNotesLabels(labelId);
  if (notesLabelsWithThisLabelId && notesLabelsWithThisLabelId.length === 0) {
    await deleteLabelById(labelId);
  }
}

export {
  getAllLabels,
  getLabelId,
  getLabelIds,
  createLabels,
  removeLabelFromNote,
  deleteLabelByName,
  deleteLabelById,
  cleanupUnusedLabel
};
