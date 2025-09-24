import { useQuery } from '@tanstack/react-query';
import { getAllNotes } from '../supabase/notes';

export default function useNotes(userId: string | undefined) {
  return useQuery({
    queryKey: ['notes', userId],
    queryFn: () => {
      if (!userId)
        throw new Error(`userId is ${userId}`);

      return getAllNotes(userId);
    },
  });
}
