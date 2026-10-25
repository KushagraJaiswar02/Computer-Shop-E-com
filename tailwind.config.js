/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Restrained primary retail blue
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          accent: '#0284c7',
        },
        terracotta: {
          50: '#fdf6f4',
          100: '#fbece6',
          200: '#f7d8cc',
          300: '#efbba9',
          400: '#e3947b',
          500: '#cb6142', // Warm restrained terracotta accent
          600: '#b74b2d',
          700: '#973c24',
          800: '#7d3320',
          900: '#672e1e',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          650: '#334155',
          700: '#273449',
          750: '#202b3d', // Card border in dark mode
          800: '#1a2332', // Secondary / elevated dark surface
          850: '#131c2a', // Primary card dark surface
          900: '#0c121e', // Comfortable charcoal page background
          950: '#070b13', // Deep modal backdrop / high contrast
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'keycap': '0 2px 0 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'keycap-dark': '0 2px 0 0 rgba(255, 255, 255, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'keycap-pressed': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'soft-card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'wheel-glow': '0 0 40px -10px rgba(203, 97, 66, 0.25)',
        'wheel-glow-dark': '0 0 50px -10px rgba(224, 122, 95, 0.2)',
      },
      animation: {
        'ripple': 'ripple 0.4s cubic-bezier(0, 0.2, 0.8, 1) forwards',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
