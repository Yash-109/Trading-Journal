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
        dark: {
          bg: '#0a0e14',
          card: '#151922',
          hover: '#1a1f2b',
          border: '#2d3748',
        },
        gold: {
          500: '#f59e0b',
          600: '#d97706',
        },
        profit: '#10b981',
        loss: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
