const token = name => `rgb(var(--color-${name}) / <alpha-value>)`;
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: token('background'), surface: { DEFAULT: token('surface'), elevated: token('surface-elevated'), soft: token('surface-soft') },
        border: token('border'), control: token('control-border'), main: token('text'), muted: token('text-muted'),
        primary: { DEFAULT: token('primary'), hover: token('primary-hover') }, 'on-primary': token('on-primary'), 'on-semantic': token('on-semantic'), accent: token('accent-text'),
        success: { DEFAULT: token('success'), ink: token('success-text') }, warning: { DEFAULT: token('warning'), ink: token('warning-text') },
        danger: { DEFAULT: token('danger'), ink: token('danger-text') }, info: { DEFAULT: token('info'), ink: token('info-text') },
        price: token('price'), 'discount-badge': token('discount-badge'), focus: token('focus-ring'),
        inverse: { DEFAULT: token('inverse'), ink: token('inverse-text'), muted: token('inverse-muted') },
        overlay: token('overlay'), media: { DEFAULT: token('media-surface'), ink: token('media-text') },
      },
      fontFamily: { sans: ['var(--font-body)'], heading: ['var(--font-heading)'], mono: ['var(--font-mono)'] },
      fontSize: Object.fromEntries(['xs','sm','base','lg','xl','2xl','3xl','4xl','5xl'].map(size => [size, [`var(--text-${size})`, { lineHeight: size === 'xs' || size === 'sm' || size === 'base' ? 'var(--leading-body)' : 'var(--leading-heading)' }]])),
      borderRadius: { sm: 'var(--radius-xs)', DEFAULT: 'var(--radius-xs)', md: 'var(--radius-sm)', lg: 'var(--radius-md)', xl: 'var(--radius-lg)', '2xl': 'var(--radius-xl)', '3xl': 'var(--radius-2xl)', full: 'var(--radius-pill)' },
      boxShadow: { xs: 'var(--shadow-soft)', sm: 'var(--shadow-soft)', DEFAULT: 'var(--shadow-soft)', md: 'var(--shadow-elevated)', lg: 'var(--shadow-elevated)', xl: 'var(--shadow-modal)', '2xl': 'var(--shadow-modal)', keycap: 'var(--shadow-keycap)', 'keycap-dark': 'var(--shadow-keycap)', 'keycap-pressed': 'var(--shadow-pressed)', 'soft-card': 'var(--shadow-soft)', elevated: 'var(--shadow-elevated)', 'wheel-glow': 'var(--shadow-glow)', 'wheel-glow-dark': 'var(--shadow-glow)' },
      animation: { ripple: 'ripple 0.4s cubic-bezier(0, 0.2, 0.8, 1) forwards', 'subtle-pulse': 'subtlePulse 3s ease-in-out infinite' },
      keyframes: { ripple: { '0%': { transform: 'scale(0)', opacity: '.5' }, '100%': { transform: 'scale(2.5)', opacity: '0' } }, subtlePulse: { '0%,100%': { opacity: '.4' }, '50%': { opacity: '.8' } } },
    },
  },
  plugins: [],
};
