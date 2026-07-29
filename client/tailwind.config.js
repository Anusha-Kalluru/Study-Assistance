/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#5B5FEF', // Brand primary indigo color requested
          700: '#4a4edc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
