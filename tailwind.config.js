/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#05060F',
        surface: '#0B0E1D',
        panel: '#0F1329',
        line: '#1E2444',
        'line-soft': '#161A33',
        signal: {
          blue: '#4C7CF3',
          'blue-dim': '#2C4A99',
          violet: '#9D5CFF',
          'violet-dim': '#5B3599',
          cyan: '#5EEAD4',
        },
        ink: {
          DEFAULT: '#E7EAF6',
          muted: '#8B93B8',
          faint: '#565D80',
        },
      },
      fontFamily: {
        mono: ['var(--font-jbmono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        glow: '0 0 0 1px rgba(76,124,243,0.25), 0 0 24px rgba(76,124,243,0.12)',
        'glow-violet': '0 0 0 1px rgba(157,92,255,0.25), 0 0 24px rgba(157,92,255,0.14)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
