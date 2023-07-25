import { Bg_Color } from '../types/Bg_Color';

export default function getTwBgClasses(bg_color: Bg_Color) {
  let bgClasses;
  // can't interpolate because of tailwind
  // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
  switch (bg_color) {
    case 'blue':
      bgClasses =
        'bg-card-blue-light border-t-2 border-card-blue-light dark:border-card-blue-dark dark:bg-card-blue-dark';
      break;
    case 'red':
      bgClasses =
        'bg-card-red-light border-t-2 border-card-red-light dark:border-card-red-dark dark:bg-card-red-dark';
      break;
    case 'pink':
      bgClasses =
        'bg-card-pink-light border-t-2 border-card-pink-light dark:border-card-pink-dark dark:bg-card-pink-dark';
      break;
    case 'yellow':
      bgClasses =
        'bg-card-yellow-light border-t-2 border-card-yellow-light dark:border-card-yellow-dark dark:bg-card-yellow-dark';
      break;
    case 'green':
      bgClasses =
        'bg-card-green-light border-t-2 border-card-green-light dark:border-card-green-dark dark:bg-card-green-dark';
      break;
    case '':
      bgClasses =
        'bg-white dark:bg-neutral-950 outline outline-1 outline-neutral-300 dark:outline-neutral-700';
      break;
  }

  return bgClasses;
}
