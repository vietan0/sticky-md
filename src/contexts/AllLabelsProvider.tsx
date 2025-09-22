import type { User } from 'firebase/auth';
import type LabelDbData from '../types/LabelDbData';
import { useContext, useEffect, useState } from 'react';
import { AllLabelsContext, UserContext } from '.';
import supabase from '../supabase/connect';
import { deleteLabelById, getAllLabels } from '../supabase/labels';
import { getNotesLabels } from '../supabase/notes_labels';

export default function AllLabelsProvider({ children }: { children: JSX.Element }) {
  const currentUser = useContext(UserContext) as User;
  const [allLabels, setAllLabels] = useState<LabelDbData[]>([]);

  /* code for supabase realtime update: notes
    supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${currentUser.uid}`,
        },
        async (_payload) => await getAllNotes(currentUser.uid), // listen for changes, refetch if there is one
      )
      .subscribe();
   */

  useEffect(() => {
    if (currentUser) {
      const fetchLabels = async () => {
        const fetchResult = await getAllLabels(currentUser.uid);
        if (fetchResult)
          setAllLabels(fetchResult);
      };

      fetchLabels();

      supabase
        .channel('labels-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'labels',
            filter: `user_id=eq.${currentUser.uid}`,
          },
          _payload => fetchLabels(), // listen for changes, refetch if there is one
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notes_labels',
            filter: `user_id=eq.${currentUser.uid}`,
          },
          async (payload) => {
            const deletedLabelId = payload.old.label_id;
            const notesLabelsWithThisLabelId = await getNotesLabels(deletedLabelId);

            if (notesLabelsWithThisLabelId && notesLabelsWithThisLabelId.length === 0) {
              // if there's no row in `notes_labels` with this label_id
              // then there is no note with this label
              // delete label from `labels`
              await deleteLabelById(deletedLabelId);
            }
          },
        )
        .subscribe();
    }
  }, [currentUser]);

  return <AllLabelsContext.Provider value={allLabels}>{children}</AllLabelsContext.Provider>;
}
