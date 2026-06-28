/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4AF37',
          600: '#C9A84C',
          700: '#B8860B',
          800: '#92690A',
          900: '#6B4F07',
        },
        frost: {
          50: 'rgba(255,255,255,0.95)',
          100: 'rgba(255,255,255,0.85)',
          200: 'rgba(255,255,255,0.60)',
          300: 'rgba(255,255,255,0.30)',
          400: 'rgba(255,255,255,0.15)',
          500: 'rgba(255,255,255,0.08)',
          600: 'rgba(255,255,255,0.04)',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
        'gold-shine': 'linear-gradient(90deg, #B8860B 0%, #FFD700 40%, #D4AF37 60%, #B8860B 100%)',
        'dark-base': 'linear-gradient(135deg, #0A0805 0%, #1A1208 50%, #0D0A06 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(212,175,55,0.2)',
        'gold-md': '0 0 25px rgba(212,175,55,0.3)',
        'gold-lg': '0 0 50px rgba(212,175,55,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212,175,55,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(212,175,55,0.5)' },
        },
      },
    },
  },
  plugins: [],
};
