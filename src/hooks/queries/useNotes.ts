import { useQuery } from '@tanstack/react-query';
import { getAllNotes } from '../../supabase/notes';

export default function useNotes(userId: string | undefined) {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => getAllNotes(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}
