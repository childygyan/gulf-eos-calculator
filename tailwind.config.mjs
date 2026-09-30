/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Original brand palette: deep Gulf-night navy + desert gold.
        brand: {
          50: '#f4f6fb',
          100: '#e6ebf5',
          200: '#c3cede',
          300: '#9aabC9',
          400: '#6d82ac',
          500: '#4c6390',
          600: '#3a4e77',
          700: '#2c3c5e',
          800: '#1f2b45',
          900: '#141c30',
          950: '#0b1120',
        },
        gold: {
          50: '#fdf9ec',
          100: '#faf0d3',
          200: '#f5e0a3',
          300: '#efcb6c',
          400: '#e8b444',
          500: '#dda12e',
          600: '#c07f22',
          700: '#9a5f1e',
          800: '#7d4c1f',
          900: '#683f1e',
        },
      },
      fontFamily: {
        sans: [
          '"Segoe UI"',
          'Tahoma',
          '"Noto Kufi Arabic"',
          '"Noto Sans Arabic"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
