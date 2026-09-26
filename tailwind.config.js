/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#07080D',
          900: '#0D0E18',
          850: '#111320',
          800: '#16192A',
          750: '#1D2136',
          700: '#262B44',
          600: '#383F63',
          border: '#282D4A',
          muted: '#6272A4',
        },
        sakura: {
          light: '#FF92D0',
          DEFAULT: '#FF79C6',
          dark: '#E053A6',
          glow: 'rgba(255, 121, 198, 0.45)',
        },
        cyan: {
          neon: '#8BE9FD',
          glow: 'rgba(139, 233, 253, 0.45)',
        },
        purple: {
          neon: '#BD93F9',
          glow: 'rgba(189, 147, 249, 0.45)',
        },
        green: {
          neon: '#50FA7B',
        },
        yellow: {
          neon: '#F1FA8C',
        },
        orange: {
          neon: '#FFB86C',
        },
        dota: {
          red: '#E03E2D',
          darkRed: '#7A1C14',
          gold: '#F0B232',
          bg: '#0F1217',
          surface: '#151A22',
          slot: '#1A212B',
          border: '#2A3442',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'sakura-sm': '0 0 10px rgba(255, 121, 198, 0.3)',
        'sakura-md': '0 0 20px rgba(255, 121, 198, 0.4)',
        'sakura-lg': '0 0 35px rgba(255, 121, 198, 0.5)',
        'cyan-sm': '0 0 10px rgba(139, 233, 253, 0.3)',
        'cyan-md': '0 0 20px rgba(139, 233, 253, 0.4)',
        'purple-sm': '0 0 10px rgba(189, 147, 249, 0.3)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
        'dota-slot': 'inset 0 0 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glowPulse: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
