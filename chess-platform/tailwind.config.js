/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#f7f6f3',
          surface:  '#ffffff',
          elevated: '#ffffff',
          alt:      '#efede8',
          border:   '#e7e5e4',
        },
        chess: {
          DEFAULT: '#166534',
          light:   '#15803d',
          hover:   '#14532d',
          subtle:  '#f0fdf4',
          muted:   '#dcfce7',
        },
        gold: {
          DEFAULT: '#d97706',
          light:   '#fbbf24',
          dark:    '#b45309',
        },
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
        'fade-in':    'fadeIn .2s ease-out',
        'slide-up':   'slideUp .3s cubic-bezier(.16,1,.3,1)',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shake':      'shake .4s ease-in-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                               to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' },            '50%': { transform: 'translateY(-8px)' } },
        shake:   { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
      },
      minHeight: { screen: ['100vh', '100dvh'] },
    },
  },
  plugins: [],
}
