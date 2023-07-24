import { Bg_Color } from './Bg_Color';

export default interface NoteUploadData {
  title: string;
  content: string;
  labels: string[];
  user_id: string;
  bg_color: Bg_Color;
  image_urls: string[];
}
