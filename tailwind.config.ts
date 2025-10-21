import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f9f6',
          100: '#d8f0e4',
          200: '#b0e0c9',
          300: '#84cfae',
          400: '#4fb689',
          500: '#2f9d71',
          600: '#1f7956',
          700: '#1a6047',
          800: '#174d3b',
          900: '#123629'
        }
      },
      boxShadow: {
        card: '0 10px 25px -15px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
