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
    },
  },
  plugins: [],
};
