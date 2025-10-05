import { Bg_Color } from '../types/Bg_Color';

export default function getTwBgClasses(bg_color: Bg_Color) {
  const commonClasses = 'outline outline-2';
  let colorClasses;

  // can't interpolate because of tailwind
  // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
  switch (bg_color) {
    case 'blue':
      colorClasses =
        'bg-card-blue-light dark:bg-card-blue-dark outline-card-blue-light dark:outline-card-blue-dark';
      break;
    case 'red':
      colorClasses =
        'bg-card-red-light dark:bg-card-red-dark outline-card-red-light dark:outline-card-red-dark';
      break;
    case 'pink':
      colorClasses =
        'bg-card-pink-light dark:bg-card-pink-dark outline-card-pink-light dark:outline-card-pink-dark';
      break;
    case 'yellow':
      colorClasses =
        'bg-card-yellow-light dark:bg-card-yellow-dark outline-card-yellow-light dark:outline-card-yellow-dark';
      break;
    case 'green':
      colorClasses =
        'bg-card-green-light dark:bg-card-green-dark outline-card-green-light dark:outline-card-green-dark';
      break;
    case '':
      colorClasses =
        'bg-white dark:bg-neutral-950 outline-neutral-300 dark:outline-neutral-700';
      break;
  }

  const bgClasses = commonClasses + ' ' + colorClasses;

  return bgClasses;
}
