/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f2',
          100: '#ffe8e1',
          500: '#EF3F09',
          600: '#d63405',
          700: '#b22702',
        }
      }
    },
  },
  plugins: [],
}
