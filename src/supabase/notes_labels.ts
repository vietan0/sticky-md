import supabase from './connect';

async function createNotesLabels(note_id: string, labelIds: string[], user_id: string) {
  const { data, error } = await supabase
    .from('notes_labels')
    .insert(labelIds.map((label_id) => ({ note_id, label_id, user_id })));
  if (error) console.error(error);
}

export { createNotesLabels };
