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

export { getAllLabels };
