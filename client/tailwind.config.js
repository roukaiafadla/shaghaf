/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
     
        brand: {
          50: '#fff1ef',
          100: '#ffe1dd',
          200: '#ffc4bc',
          300: '#ffa295',
          400: '#ff8a7a',
          500: '#FE6F61', // primary coral
          600: '#e2554a',
          700: '#b8423a',
          800: '#8f332e',
          900: '#6b2622',
        },
        teal: {
          50: '#e6f2f2',
          100: '#cce5e5',
          200: '#99cbcb',
          300: '#66b1b1',
          400: '#339898',
          500: '#008080', // secondary teal
          600: '#006666',
          700: '#004d4d',
          800: '#003333',
          900: '#001a1a',
        },
        gold: {
          50: '#fffdf0',
          100: '#fffbe0',
          200: '#fff6c2',
          300: '#ffef94',
          400: '#ffe666',
          500: '#FFD700', // rare accent (ratings, small highlights)
          600: '#e6c200',
          700: '#b39700',
          800: '#806c00',
          900: '#4d4100',
        },
      },
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'pop-in': 'pop-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
