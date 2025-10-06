import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeLabelFromNote } from '../../supabase/labels';

export default function useRemoveLabelFromNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ note_id, label, userId }: { note_id: string, label: string, userId: string }) => removeLabelFromNote(note_id, label, userId),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['notes']});
      queryClient.invalidateQueries({ queryKey: ['labels']}); 
    }
  });
}