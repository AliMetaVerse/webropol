/**
 * Webropol Design System - Design Tokens
 * Central repository for all design values
 */

export const designTokens = {
  // Colors
  colors: {
    // Primary brand (primary)
    primary: {
      50:  '#eefbfd',
      100: '#d5f4f8',
      200: '#b0e8f1',
      300: '#79d6e7',
      400: '#3fbcd5',
      500: '#209fba', // Main primary (updated)
      600: '#1d809d',
      700: '#1e6880',
      800: '#215669',
      900: '#204859',
      950: '#102e3c'
    },

    // NOTE: 'secondary' (blue) palette removed — components now use `primary` (primary) as secondary fallback.

    neutral: {
      0:   '#ffffff',
      50:  '#f9fafa',
      100: '#f3f4f4',
      200: '#e6e7e8',
      300: '#d1d5d6',
      400: '#b5bbbd',
      500: '#9ba2a4',
      600: '#787f81',
      700: '#61686a',
      800: '#515557',
      900: '#45484a',
      950: '#272a2b'
    },
    // Accent palette (from screenshot)
    accent: {
      50:  '#fff4ed',
      100: '#ffe5d4',
      200: '#ffc8a8',
      300: '#ffa271',
      400: '#ff8429',
      500: '#ff6429',
      600: '#ef4f07',
      700: '#c61e08',
      800: '#9d1a0f',
      900: '#7e1910',
      950: '#440806'
    },
    // Success / Green (full scale)
    success: {
      50:  '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    // Warning / Amber
    warning: {
      50:  '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    // Error / Red (full scale)
    error: {
      50:  '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },
    // Royal Violet palette
    royalViolet: {
      50:  '#F1E9FB',
      100: '#D5BEF4',
      200: '#BA92EC',
      300: '#9E67E5',
      400: '#8C50E0',
      500: '#823BDD',
      600: '#6922C4',
      700: '#511A98',
      800: '#3A136D',
      900: '#230B41',
      950: '#0C0416'
    },
    // Royal Turquoise palette
    royalTurquoise: {
      50:  '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
      950: '#083344'
    },
    // Royal Blue palette
    royalBlue: {
      50:  '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B'
    }
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif']
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem' // 30px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem'     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // Transitions
  transition: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms'
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-Index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50'
  }
};

// Component-specific tokens
export const componentTokens = {
  button: {
    borderRadius: 'xl', // 12px
    fontWeight: 'semibold',
    transition: 'all 200ms ease',
    sizes: {
      sm: { padding: '6px 12px', fontSize: 'sm' },
      md: { padding: '10px 24px', fontSize: 'sm' },
      lg: { padding: '12px 32px', fontSize: 'base' },
      xl: { padding: '16px 40px', fontSize: 'lg' }
    }
  },
  card: {
    borderRadius: '2xl', // 16px
    padding: '24px',
    shadow: 'card',
    border: '1px solid rgba(203, 213, 225, 0.3)'
  },
  modal: {
    borderRadius: '2xl',
    shadow: '2xl',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    backdropBlur: '4px'
  },
  input: {
    borderRadius: 'xl',
    padding: '12px 16px',
    fontSize: 'sm',
    borderWidth: '1px'
  }
};

export default designTokens;
