/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8ecf4', 100: '#c5cfe4', 200: '#9eafd2',
          300: '#778fc0', 400: '#5a77b3', 500: '#3d5fa6',
          600: '#36569e', 700: '#2d4a94', 800: '#24408a',
          900: '#132d79', 950: '#0d1f4f',
        },
        crimson: {
          50: '#fce8e8', 100: '#f7c6c6', 200: '#f19f9f',
          300: '#ea7878', 400: '#e55a5a', 500: '#df3b3b',
          600: '#C1273A', 700: '#b52020', 800: '#9f1414', 900: '#7a0000',
        },
      },
      fontFamily: { sans: ['"Inter"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
