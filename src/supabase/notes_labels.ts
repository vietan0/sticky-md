import supabase from './connect';

async function createNotesLabels(note_id: string, labels: string[]) {
  const { data, error } = await supabase
    .from('notes_labels')
    .insert(labels.map((label_name) => ({ note_id, label_name })));
  if (error) console.error(error);
}

export { createNotesLabels };
