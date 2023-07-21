import { Bg_Color } from '../types/Bg_Color';

export default function getTwBgClasses(bg_color: Bg_Color) {
  const bgClasses = bg_color
    ? `bg-card-${bg_color}-light dark:bg-card-${bg_color}-dark `
    : 'bg-white dark:bg-slate-950'; 

  return bgClasses
}