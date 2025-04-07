/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: '#ffffff', // light mode background
        dark: '#0f172a',  // dark mode background
        foregroundLight: '#000000',
        foregroundDark: '#f8fafc',
      },
    },
  },
  plugins: [],
};
