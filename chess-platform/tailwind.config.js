/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#080810',
          card:     '#101018',
          elevated: '#16161f',
          border:   'rgba(255,255,255,0.07)',
        },
        gold: {
          DEFAULT: '#e9c46a',
          light:   '#f4d78a',
          dark:    '#c9a440',
        },
      },
      // Extend opacity so non-standard /3 /4 /8 /12 /35 work in @apply
      opacity: {
        2:  '0.02',
        3:  '0.03',
        4:  '0.04',
        6:  '0.06',
        8:  '0.08',
        12: '0.12',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        kids:    ['Nunito', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      animation: {
        'fade-in':   'fadeIn .2s ease-out',
        'slide-up':  'slideUp .3s cubic-bezier(.16,1,.3,1)',
        'float':     'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' },to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      minHeight: { screen: ['100vh', '100dvh'] },
    },
  },
  plugins: [],
}
