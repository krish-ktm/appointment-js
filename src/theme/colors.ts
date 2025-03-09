// Color Psychology for Healthcare:
// - Blue: Trust, stability, professionalism, calmness
// - Green: Health, growth, harmony, nature
// - White: Cleanliness, purity, medical excellence
// - Soft Purple: Luxury, comfort, premium care
// - Warm accents: Approachability, comfort, warmth

// Primary colors (Trustworthy Blues)
export const primary = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49'
};

// Secondary colors (Healing Greens)
export const secondary = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16'
};

// Accent colors (Calming Purple)
export const accent = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764'
};

// Gradient combinations
export const gradients = {
  primary: {
    // Trustworthy & Professional
    light: 'from-blue-500/90 via-blue-400/90 to-sky-400/90',
    dark: 'from-blue-600 via-blue-500 to-sky-500',
    hover: 'from-blue-600 via-blue-500 to-sky-600'
  },
  secondary: {
    // Subtle Healing
    light: 'from-green-500/5 via-transparent to-blue-500/5',
    dark: 'from-green-600/10 via-transparent to-blue-600/10'
  },
  text: {
    // Professional & Approachable
    primary: 'from-blue-600 via-blue-700 to-sky-700',
    secondary: 'from-blue-400 to-sky-400'
  }
};

// Background colors
export const background = {
  light: 'from-blue-50 to-white',
  dark: 'from-gray-900 to-gray-950',
  overlay: 'bg-black/50'
};

// Text colors
export const text = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  muted: 'text-gray-500',
  light: 'text-white',
  lightMuted: 'text-white/90',
  accent: 'text-blue-600'
};

// Border colors
export const border = {
  light: 'border-gray-100',
  medium: 'border-gray-200',
  accent: 'border-blue-100/50',
  accentHover: 'hover:border-blue-200/50'
};

// Shadow configurations
export const shadow = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  primary: 'shadow-blue-500/20',
  primaryHover: 'hover:shadow-blue-500/40'
};

// Status colors (Medical Context)
export const status = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100'
  },
  error: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-100'
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100'
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100'
  }
};

// Button variants
export const button = {
  primary: `
    bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 
    text-white 
    hover:from-blue-700 hover:via-blue-600 hover:to-sky-600
    shadow-lg shadow-blue-500/20 
    hover:shadow-blue-500/40
  `,
  secondary: `
    bg-white/20 
    backdrop-blur-md 
    text-white 
    hover:bg-white/30
  `,
  outline: `
    border border-gray-200 
    text-gray-700 
    hover:bg-gray-50
  `
};

// Form element styles (Clean & Professional)
export const form = {
  input: {
    base: `
      border-gray-200 
      focus:ring-2 
      focus:ring-blue-500/20 
      focus:border-blue-500
    `,
    hover: 'hover:border-blue-400'
  },
  select: {
    base: `
      border-gray-200 
      focus:ring-2 
      focus:ring-blue-500/20 
      focus:border-blue-500
    `
  }
};