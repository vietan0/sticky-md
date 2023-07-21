import { Bg_Color } from '../types/Bg_Color';

export default function getTwBgClasses(bg_color: Bg_Color) {
  let bgClasses;
  // can't interpolate because of tailwind
  // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
  switch (bg_color) {
    case 'blue':
      bgClasses = 'bg-card-blue-light dark:bg-card-blue-dark';
      break;
    case 'red':
      bgClasses = 'bg-card-red-light dark:bg-card-red-dark';
      break;
    case 'pink':
      bgClasses = 'bg-card-pink-light dark:bg-card-pink-dark';
      break;
    case 'yellow':
      bgClasses = 'bg-card-yellow-light dark:bg-card-yellow-dark';
      break;
    case 'green':
      bgClasses = 'bg-card-green-light dark:bg-card-green-dark';
      break;
    case '':
      bgClasses =
        'bg-white dark:bg-neutral-950 outline outline-1 outline-neutral-300 dark:outline-neutral-700';
      break;
  }

  return bgClasses;
}
