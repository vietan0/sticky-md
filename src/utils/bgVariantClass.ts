import type { Bg_Color } from '../types/Bg_Color';

// Can't interpolate because of https://tailwindcss.com/docs/content-configuration#dynamic-class-names
export default {
  'blue': 'bg-card-blue-light dark:bg-card-blue-dark',
  'red': 'bg-card-red-light dark:bg-card-red-dark',
  'pink': 'bg-card-pink-light dark:bg-card-pink-dark',
  'yellow': 'bg-card-yellow-light dark:bg-card-yellow-dark',
  'green': 'bg-card-green-light dark:bg-card-green-dark',
  '': 'bg-white dark:bg-neutral-950 outline-1 outline-neutral-300 dark:outline-neutral-700',
} as Record<Bg_Color, string>;
