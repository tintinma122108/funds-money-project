/**
 * Design Tokens
 * Extracted from Figma Design System
 * https://www.figma.com/design/Oi18J2FpwvtskMMH0geuFo/app-ui-token
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    brand: '#00afbc',
    blue: '#2479f0',
    'blue-hover': '#4094fb',
    'blue-10%': '#2479f01a',
    purple: '#b32fe7',
    'purple-hover': '#cc5bf9',
    'purple-20%': '#b32fe733',
    orange: '#fa8c16',
    'orange-20%': '#fa8c1633',
  },

  // Secondary Colors
  secondary: {
    cyan: '#00afbc',
    'cyan-hover': '#00cad5',
    magenta: '#eb2f96',
  },

  // Semantic Colors - Buy/Sell
  buy: {
    default: '#ea365a',
    hover: '#f5627f',
    '10%': '#ea365a1a',
    '20%': '#ea365a33',
    'reverse-text': '#cf2245',
  },
  sell: {
    default: '#00afbc',
    hover: '#00cad5',
    '10%': '#00b0bd1a',
    '20%': '#00b0bd33',
    'reverse-text': '#0098a6',
  },

  // Semantic Colors - Status
  semantic: {
    error: '#cf2245',
    success: '#129757',
    warning: '#fa8c16',
    info: '#2479f0',
    brand: '#00afbc',
    blue: '#2479f0',
  },

  // Neutral Colors
  neutral: {
    black: '#000000',
    white: '#ffffff',
    'always-black': '#000000',
    'always-white': '#ffffff',
  },

  // Text Colors
  text: {
    primary: '#1a1b1c',
    secondary: '#3a3b3e',
    tertiary: '#6e7073',
    description: '#adaeb4',
    disabled: '#cfd0d4',
    brand: '#00afbc',
    error: '#cf2245',
    blue: '#2479f0',
    'disable-text': '#cfd0d4',
    'disable-trade-text': '#ffffffe5',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f5f6f6',
    tertiary: '#e5e6e8',
    disabled: '#eff0f2',
    'pop-ups': '#ffffff',
    mask: '#00000080',
  },

  // Border Colors
  border: {
    primary: '#0000000a',
    secondary: '#00000014',
    tertiary: '#0000001f',
    'border-50': '0.5px solid #0000000a',
    'border-100': '1px solid #0000000a',
    'border-133': '1.33px solid #0000000a',
    'border-150': '1.5px solid #0000000a',
    'border-200': '2px solid #0000000a',
  },

  // Color Palette - Red
  red: {
    1: '#fff0f3',
    2: '#ffd7df',
    3: '#ffb0c0',
    4: '#ff859e',
    5: '#f5627f',
    6: '#ea365a',
    7: '#cf2245',
    8: '#a71c38',
    9: '#771428',
    10: '#5c0c1d',
  },

  // Color Palette - Blue
  blue: {
    1: '#e6f4ff',
    2: '#bae0ff',
    3: '#91caff',
    4: '#69b1ff',
    5: '#4094fb',
    6: '#2479f0',
    7: '#1a64dd',
    8: '#154db6',
    9: '#113584',
    10: '#0a1e53',
  },

  // Color Palette - Cyan
  cyan: {
    1: '#dbffff',
    2: '#b2fcfd',
    3: '#85edf6',
    4: '#45dbe6',
    5: '#00cad5',
    6: '#00afbc',
    7: '#0098a6',
    8: '#04717b',
    9: '#034c54',
  },

  // Color Palette - Purple
  purple: {
    1: '#faeeff',
    2: '#f2d3ff',
    3: '#e8afff',
    4: '#da80fe',
    5: '#cc5bf9',
    6: '#b32fe7',
    7: '#9418c6',
    8: '#740f9d',
    9: '#540873',
    10: '#3a0550',
  },

  // Color Palette - Orange
  orange: {
    1: '#fff7e6',
    2: '#ffe7ba',
    3: '#ffd591',
    4: '#ffc069',
    5: '#ffa940',
    6: '#fa8c16',
    7: '#d46b08',
    8: '#ad4e00',
    9: '#873800',
    10: '#612500',
  },

  // Color Palette - Green
  green: {
    1: '#ddfced',
    2: '#a9f1ce',
    3: '#75e2ae',
    4: '#4bcc8e',
    5: '#2ab471',
    6: '#129757',
    7: '#177849',
    8: '#0b5e36',
    9: '#064627',
    10: '#032d19',
  },

  // Color Palette - Magenta
  magenta: {
    1: '#fff0f6',
    2: '#ffd6e7',
    3: '#ffadd2',
    4: '#ff85c0',
    5: '#f759ab',
    6: '#eb2f96',
    7: '#c41d7f',
    8: '#9e1068',
    9: '#75044a',
    10: '#4d0433',
  },

  // Color Palette - Volcano
  volcano: {
    1: '#fff2e8',
    2: '#ffd8bf',
    3: '#ffbb96',
    4: '#fb986b',
    5: '#fa7845',
    6: '#f3521c',
    7: '#d4380d',
    8: '#ad2102',
    9: '#741803',
    10: '#5f0f05',
  },

  // Transparency
  transparency: {
    t4: '#0000000a',
    t6: '#0000000f',
    'white-w12': '#ffffff1f',
    'black-b25': '#00000040',
  },

  // Button Text Colors
  buttonText: {
    'red-reverse': '#cf2245',
    'cyan-reverse': '#0098a6',
    'orange-reverse': '#d46b08',
    disable: '#cfd0d4',
    'disable-trade': '#ffffffe5',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: ['PingFang HK', 'sans-serif'],
    mono: ['Inter', 'monospace'],
  },

  fontSize: {
    // XXXS
    xxxs: {
      size: '9px',
      lineHeight: '14px',
      weight: 400,
      family: 'PingFang HK',
    },
    // XXS
    xxs: {
      size: '10px',
      lineHeight: '14px',
      weight: 400,
      family: 'PingFang HK',
    },
    'xxs-medium': {
      size: '10px',
      lineHeight: '14px',
      weight: 500,
      family: 'PingFang HK',
    },
    // XS
    xs: {
      size: '11px',
      lineHeight: '16px',
      weight: 400,
      family: 'PingFang HK',
    },
    'xs-medium': {
      size: '11px',
      lineHeight: '16px',
      weight: 500,
      family: 'PingFang HK',
    },
    // S
    s: {
      size: '12px',
      lineHeight: '18px',
      weight: 400,
      family: 'PingFang HK',
    },
    's-medium': {
      size: '12px',
      lineHeight: '18px',
      weight: 500,
      family: 'PingFang HK',
    },
    's-num-medium': {
      size: '12px',
      lineHeight: '18px',
      weight: 500,
      family: 'Inter',
    },
    // Body
    body: {
      size: '14px',
      lineHeight: '20px',
      weight: 400,
      family: 'PingFang HK',
    },
    'body-medium': {
      size: '14px',
      lineHeight: '20px',
      weight: 500,
      family: 'PingFang HK',
    },
    'body-semibold': {
      size: '14px',
      lineHeight: '20px',
      weight: 600,
      family: 'PingFang HK',
    },
    'body-num-medium': {
      size: '14px',
      lineHeight: '20px',
      weight: 500,
      family: 'Inter',
    },
    // Body 15
    body15: {
      size: '15px',
      lineHeight: '22px',
      weight: 400,
      family: 'PingFang HK',
    },
    'body15-medium': {
      size: '15px',
      lineHeight: '22px',
      weight: 500,
      family: 'PingFang HK',
    },
    // H7
    h7: {
      size: '16px',
      lineHeight: '24px',
      weight: 400,
      family: 'PingFang HK',
    },
    'h7-medium': {
      size: '16px',
      lineHeight: '24px',
      weight: 500,
      family: 'PingFang HK',
    },
    'h7-semibold': {
      size: '16px',
      lineHeight: '24px',
      weight: 600,
      family: 'PingFang HK',
    },
    'h7-num-semibold': {
      size: '16px',
      lineHeight: '24px',
      weight: 600,
      family: 'Inter',
    },
    // H6
    h6: {
      size: '18px',
      lineHeight: '26px',
      weight: 500,
      family: 'PingFang HK',
    },
    'h6-semibold': {
      size: '18px',
      lineHeight: '26px',
      weight: 600,
      family: 'PingFang HK',
    },
    // H5
    'h5-num-semibold': {
      size: '20px',
      lineHeight: '28px',
      weight: 600,
      family: 'Inter',
    },
    // H3
    'h3-num-bold': {
      size: '28px',
      lineHeight: '40px',
      weight: 700,
      family: 'Inter',
    },
    // H2
    'h2-num-bold': {
      size: '32px',
      lineHeight: '46px',
      weight: 700,
      family: 'Inter',
    },
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: '0px',
  2: '2px',
  4: '4px',
  6: '6px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
} as const;

// Tailwind spacing scale (extended)
export const spacingScale = {
  ...spacing,
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
  80: '80px',
  96: '96px',
  128: '128px',
  160: '160px',
  192: '192px',
  224: '224px',
  256: '256px',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0px',
  4: '4px',
  6: '6px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  32: '32px',
  999: '999px', // Full round
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  large: '0 8px 16px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  // From Figma
  figmaLarge: {
    type: 'drop-shadow',
    color: '#00000014',
    offset: { x: 0, y: 8 },
    radius: 32,
    spread: 0,
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const designTokens = {
  colors,
  typography,
  spacing: spacingScale,
  borderRadius,
  shadows,
  breakpoints,
} as const;

export default designTokens;

