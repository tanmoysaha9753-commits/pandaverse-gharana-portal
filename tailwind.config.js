/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pandaverse: {
          50: '#fdf6f0',
          100: '#faeadd',
          200: '#f4d0b8',
          300: '#ecb38a',
          400: '#e08d52',
          500: '#d4762e',
          600: '#c06224',
          700: '#9e4c1e',
          800: '#7d401f',
          900: '#66371d',
        },
      },
    },
  },
  plugins: [],
};
