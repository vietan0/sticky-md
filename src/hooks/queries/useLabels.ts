import { useQuery } from '@tanstack/react-query';
import { getAllLabels } from '../../supabase/labels';

export default function useLabels(userId: string | undefined) {
  return useQuery({
    queryKey: ['labels'],
    queryFn: () => getAllLabels(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}
