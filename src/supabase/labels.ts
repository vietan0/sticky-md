import supabase from './connect';

async function getAllLabels(uid: string) {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .eq('user_id', uid)
    .order('label_name', { ascending: true });
  if (error) console.error(error);
  return data;
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

export { getAllLabels, getLabelIds, createLabels };
