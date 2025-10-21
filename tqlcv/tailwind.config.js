/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 🎨 LIQUID GLASS - TYPOGRAPHY
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'Roboto', 'sans-serif'],
        'display': ['SF Pro Display', 'Inter', '-apple-system', 'sans-serif'],
        'body': ['SF Pro Text', 'Inter', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
      },

      // 🎨 GMAIL-STYLE FLAT COLORS
      colors: {
        // Google Blue Accent (replaces Apple Blue)
        apple: {
          blue: '#1A73E8',
          'blue-dark': '#1557B0',
          'blue-light': '#4285F4',
        },

        // Gmail Gray Scale
        gmail: {
          gray: {
            50: '#F9FAFB',
            100: '#F1F3F4',
            200: '#E8EAED',
            300: '#DADCE0',
            400: '#BDC1C6',
            500: '#80868B',
            600: '#5F6368',
            700: '#3C4043',
            800: '#202124',
            900: '#000000',
          },
        },

        // Light Mode Palette (Gmail style)
        light: {
          bg: '#FFFFFF',
          'bg-secondary': '#F9FAFB',
          text: '#202124',
          'text-secondary': '#5F6368',
          'text-tertiary': '#80868B',
          border: '#E8EAED',
          'border-strong': '#DADCE0',
        },

        // Dark Mode Palette (keep for future)
        dark: {
          bg: '#1C1C1E',
          'bg-secondary': '#2C2C2E',
          text: '#FFFFFF',
          'text-secondary': '#E5E5E7',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-strong': 'rgba(255, 255, 255, 0.15)',
        },
      },

      // 🎨 LIQUID GLASS - BLUR & EFFECTS
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '20px',
        'xl': '40px',
        '2xl': '60px',
      },

      // 🎨 LIQUID GLASS - BORDER RADIUS
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },

      // 🎨 LIQUID GLASS - SHADOWS
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'glass-xl': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'inner-glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'apple': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },

      // 🎨 LIQUID GLASS - ANIMATIONS
      animation: {
        'fade-in': 'fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'glass-shimmer': 'glass-shimmer 2s ease-in-out infinite',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glass-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },

      // 🎨 LIQUID GLASS - TRANSITIONS
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },

      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}
