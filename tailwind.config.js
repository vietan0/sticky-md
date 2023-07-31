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
        'card-blue-light': 'hsl(220, 99%, 92%)',
        'card-red-light': 'hsl(0, 100%, 86%)',
        'card-pink-light': 'hsl(311, 56%, 90%)',
        'card-yellow-light': 'hsl(52, 100%, 75%)',
        'card-green-light': 'hsl(92, 80%, 80%)',
        'card-blue-dark': 'hsl(222, 60%, 10%)',
        'card-red-dark': 'hsl(0, 60%, 10%)',
        'card-pink-dark': 'hsl(296, 60%, 10%)',
        'card-yellow-dark': 'hsl(49, 60%, 10%)',
        'card-green-dark': 'hsl(102, 60%, 10%)',
        ...defaultTheme.colors,
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
