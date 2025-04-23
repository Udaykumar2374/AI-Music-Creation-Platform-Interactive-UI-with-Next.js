/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Enables dark/light theme toggling

  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(5px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },

  plugins: [],
};
