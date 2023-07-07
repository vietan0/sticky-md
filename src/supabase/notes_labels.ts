import supabase from './connect';

async function createNotesLabels(note_id: string, labelIds: string[], user_id: string) {
  const { data, error } = await supabase
    .from('notes_labels')
    .insert(labelIds.map((label_id) => ({ note_id, label_id, user_id })));
  if (error) console.error(error);
}

async function getLabelId(label_name: string, user_id: string) {
  const { data, error } = await supabase
    .from('labels')
    .select('label_id')
    .match({ label_name, user_id });

  if (error) console.error(error);
  if (data) return data[0].label_id;
}

async function deleteNotesLabels(note_id: string, label_name: string, user_id: string) {
  const label_id = await getLabelId(label_name, user_id);
  const { error } = await supabase.from('notes_labels').delete().match({ note_id, label_id });
  if (error) console.error(error);
}
export { createNotesLabels, getLabelId, deleteNotesLabels };
