/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0F1E',
          secondary: '#0D1428',
        },
        cyan: {
          DEFAULT: '#00D4FF',
          dark: '#0099CC',
          bright: '#33E5FF',
        },
        surface: 'rgba(255,255,255,0.06)',
        foreground: '#F0F4FF',
        muted: '#8896B3',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      backdropBlur: {
        xs: '4px',
        '2xl': '40px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-cyan': 'pulse-cyan 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
            filter: 'blur(4px)',
          },
          to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(0,212,255,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
