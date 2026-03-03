import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // TizzyZone 色彩系统
        fuschia: {
          100: '#EF5DA8',
          80: '#F178B6',
          60: '#FCDDEC',
        },
        iris: {
          100: '#5D5FEF',
          80: '#7879F1',
          60: '#A5A6F6',
        },
        // 功能色彩
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#A78BFA',
        // 中性色彩
        background: {
          primary: '#0B1221',
          secondary: '#0F172A',
        },
        text: {
          primary: '#E5E7EB',
          secondary: '#94A3B8',
        },
        // 焦点色
        focus: '#22D3EE',
      },
      fontFamily: {
        sans: ['var(--font-work-sans)', 'sans-serif'],
      },
      fontSize: {
        'h1': ['34px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'body': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'default': '12px',
        'small': '8px',
      },
      transitionDuration: {
        'default': '200ms',
      },
      boxShadow: {
        'low': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'medium': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      backdropBlur: {
        'glass': '8px',
      },
      maxWidth: {
        'mobile': '100%',
        'tablet': '720px',
        'desktop': '1200px',
      },
    },
  },
  plugins: [],
}

export default config