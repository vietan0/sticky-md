import supabase from './connect';

async function createUser(id: string) {
  const { error } = await supabase.from('users').insert({ user_id: id });
  if (error) console.error(error);
}

export { createUser };
