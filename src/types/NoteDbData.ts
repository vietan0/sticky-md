import { Bg_Color } from './Bg_Color';

export default interface NoteDbData {
  title: string;
  content: string;
  labels: string[];
  bg_color: Bg_Color;
  image_urls: string[];
  created_at: string;
  last_modified_at: string;
  note_id: string;
  user_id: string;
}
