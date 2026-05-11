/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'be-vietnam': ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        primary: '#3F7B28',
        'primary-light': '#E7EBE9',
        'text-main': '#242424',
        'text-placeholder': '#707071',
        'input-border': '#E0E1E2',
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 0 4px rgba(182, 192, 187, 0.25)',
        option: '0px 0px 2px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
