import { Bg_Color } from './Bg_Color';

export default interface NoteDbData {
  content: string;
  created_at: string;
  labels: string[];
  last_modified_at: string;
  note_id: string;
  title: string;
  user_id: string;
  bg_color: Bg_Color;
}
