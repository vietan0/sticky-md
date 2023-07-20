import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Roboto Mono', 'IBM Plex Mono', 'JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      screens: {
        xs: '400px',
        ...defaultTheme.screens,
      },
      colors: {
        'card-blue-light': 'hsl(220, 99%, 88%)',
        'card-red-light': 'hsl(0, 78%, 84%)',
        'card-pink-light': 'hsl(311, 76%, 87%)',
        'card-yellow-light': 'hsl(52, 91%, 73%)',
        'card-green-light': 'hsl(92, 72%, 70%)',
        'card-blue-dark': 'hsl(222, 50%, 23%)',
        'card-red-dark': 'hsl(0, 39%, 22%)',
        'card-pink-dark': 'hsl(296, 25%, 22%)',
        'card-yellow-dark': 'hsl(49, 22%, 19%)',
        'card-green-dark': 'hsl(102, 18%, 18%)',
        ...defaultTheme.colors,
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
