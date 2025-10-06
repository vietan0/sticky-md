import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLabelById } from '../../supabase/labels';

export default function useDeleteLabelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (label_id: string) => deleteLabelById(label_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });
}