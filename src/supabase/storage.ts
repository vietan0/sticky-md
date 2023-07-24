import { nanoid } from 'nanoid';
import supabase from './connect';

async function uploadImage(file: File) {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(`${nanoid()}-${file.name}`, file, { cacheControl: '3600', upsert: false });
  if (error) console.error(error);
  return data?.path;
}
async function getImageUrl(filename: string) {
  const { data } = supabase.storage.from('images').getPublicUrl(filename);
  return data.publicUrl;
}

export { uploadImage, getImageUrl };
