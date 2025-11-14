/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        italian: {
          red: '#B22222',
          green: '#009246',
          cream: '#FFF8E7',
        },
      },
    },
  },
  plugins: [],
};
