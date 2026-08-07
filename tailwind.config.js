/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',


  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'slow-zoom': 'slowZoom 9s ease-out forwards',
      },
    },
  },
  plugins: [],
};
