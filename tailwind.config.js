/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#e8ecf4',
          100: '#c5cfe4',
          200: '#9eafd2',
          300: '#778fc0',
          400: '#5a77b3',
          500: '#3d5fa6',
          600: '#36569e',
          700: '#2d4a94',
          800: '#24408a',
          900: '#132d79',
          950: '#0d1f4f',
        },
        crimson: {
          50:  '#fce8e8',
          100: '#f7c6c6',
          200: '#f19f9f',
          300: '#ea7878',
          400: '#e55a5a',
          500: '#df3b3b',
          600: '#cc2e2e',
          700: '#b52020',
          800: '#9f1414',
          900: '#7a0000',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(13, 31, 79, 0.10)',
        'card-hover': '0 8px 40px rgba(13, 31, 79, 0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-in-left': 'slideInLeft 0.6s ease-out both',
        'slide-in-right': 'slideInRight 0.6s ease-out both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
