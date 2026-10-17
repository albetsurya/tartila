/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#F0FDF4',
          100: '#DCFCEC',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        teal: {
          50: '#E0F2FE',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#0CA678',
          900: '#0F6B5E',
        },
        coral: {
          50: '#FFF8F5',
          100: '#FFE8E0',
          200: '#FFD1C5',
          300: '#FFB8A1',
          400: '#FF9966',
          500: '#FF6B6B',
          600: '#E63946',
          700: '#F15A24',
          800: '#DC2626',
          900: '#A80F0F',
        },
        background: '#F0FDF4',
        card: '#FFFFFF',
        border: '#E2E8F0',
      },
      fontFamily: {
        display: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
