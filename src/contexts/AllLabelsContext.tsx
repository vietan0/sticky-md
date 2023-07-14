import { createContext, useEffect, useState, useContext } from 'react';
import { User } from 'firebase/auth';
import LabelDbData from '../types/LabelDbData';
import supabase from '../supabase/connect';
import { deleteLabelById, getAllLabels } from '../supabase/labels';
import { getNotesLabels } from '../supabase/notes_labels';
import { UserContext } from './UserContext';

export const AllLabelsContext = createContext<LabelDbData[]>([]);

export default function AllLabelsContextProvider({ children }: { children: JSX.Element }) {
  const currentUser = useContext(UserContext) as User;
  const [allLabels, setAllLabels] = useState<LabelDbData[]>([]);
  useEffect(() => {
    if (currentUser) {
      const fetchLabels = async () => {
        const fetchResult = await getAllLabels(currentUser.uid);
        if (fetchResult) setAllLabels(fetchResult);
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
          (_payload) => fetchLabels(), // listen for changes, refetch if there is one
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
