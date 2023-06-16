export default interface NoteDbData {
  content: string;
  created_at: string;
  labels: string[];
  last_modified_at: string;
  note_id: string;
  title: string;
  user_id: string;
}
