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
        tomato : "#1c1b1b"
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out',
        gradient: 'gradient 3s ease-in-out infinite', // Add the gradient animation here
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%', backgroundColor: '#6ee7b7' }, // starting color (light green)
          '50%': { backgroundPosition: '100% 50%', backgroundColor: '#9333ea' }, // middle color (purple)
          '100%': { backgroundPosition: '0% 50%', backgroundColor: '#6ee7b7' }, // ending color (light green)
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
