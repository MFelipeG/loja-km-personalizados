/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          50: '#FAF7F2',
          100: '#F5EFEB',
          200: '#EAE1D7',
          300: '#D8C6B6',
          400: '#BAA18D',
          500: '#9E806B',
          600: '#7F624E',
          700: '#644A39',
          800: '#4D3628',
          900: '#38261B',
        },
        brand: {
          light: '#C79A73',
          DEFAULT: '#6F4E37',
          dark: '#4A3121',
          cream: '#FAF6F0',
          leather: '#845334',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tactile': '0 4px 20px -2px rgba(111, 78, 55, 0.08), 0 2px 6px -1px rgba(111, 78, 55, 0.04)',
        'magnet': '0 8px 24px -4px rgba(45, 30, 20, 0.18), 0 2px 6px -1px rgba(45, 30, 20, 0.08)',
        'fridge': 'inset 0 1px 3px rgba(255, 255, 255, 0.6), 0 10px 30px -5px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
