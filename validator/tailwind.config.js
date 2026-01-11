/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          950: '#030303',
        },
        invento: {
          yellow: '#f5c842',
          red: '#dc2626',
          darkRed: '#991b1b',
        },
      },
    },
  },
  plugins: [],
};
