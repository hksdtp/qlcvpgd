/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      colors: {
        gmail: {
          red: '#ea4335',
          blue: '#4285f4',
          green: '#34a853',
          yellow: '#fbbc04',
          gray: {
            50: '#f8f9fa',
            100: '#f1f3f4',
            200: '#e8eaed',
            300: '#dadce0',
            400: '#bdc1c6',
            500: '#9aa0a6',
            600: '#80868b',
            700: '#5f6368',
            800: '#3c4043',
            900: '#202124',
          }
        }
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
        'modal-appear': 'modal-appear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ios-bounce': 'ios-bounce 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'card-lift': 'card-lift 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      }
    },
  },
  plugins: [],
}
