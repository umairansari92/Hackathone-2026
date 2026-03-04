/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Theme (Teal & Medical)
        'clinical': {
          // Light Theme
          'light': {
            'bg': '#F5F7FA',           // App background
            'surface': '#FFFFFF',      // Main container
            'surface-2': '#FFFFFF',    // Nested cards
            'hover': '#F1F5F9',        // Hover state
            'border': '#E2E8F0',       // Main border
            'border-subtle': '#F1F5F9', // Subtle divider
            'text-primary': '#0F172A', // Primary text
            'text-secondary': '#64748B', // Secondary text
            'text-muted': '#94A3B8',   // Muted text
            'text-disabled': '#CBD5E1', // Disabled text
          },
          // Dark Theme
          'dark': {
            'bg': '#0B1220',           // App background
            'surface': '#111827',      // Main container
            'surface-2': '#1F2937',    // Nested cards
            'hover': '#243041',        // Hover state
            'border': '#1F2937',       // Main border
            'border-subtle': '#243041', // Subtle divider
            'text-primary': '#F8FAFC', // Primary text
            'text-secondary': '#CBD5E1', // Secondary text
            'text-muted': '#94A3B8',   // Muted text
            'text-disabled': '#64748B', // Disabled text
          }
        },
        // Primary Brand Color (Teal)
        'brand': {
          'primary': '#0EA5A4',   // Primary accent
          'hover': '#0D9488',     // Hover state
          'light': '#CCFBF1',     // Light background
          'dark': '#14B8A6',      // Dark mode accent
        },
        // Semantic Colors
        'status': {
          'success': '#10B981',   // Success
          'warning': '#F59E0B',   // Warning
          'danger': '#EF4444',    // Danger
          'info': '#0284C7',      // Info
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '36px',
      },
      fontFamily: {
        'sans': ['Inter', 'Geist Sans', 'system-ui', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'light-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'light-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'light-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dark-md': '0 4px 6px -1px rgb(0 0 0 / 0.3)',
        'dark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.3)',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        // Light mode base styles
        '@layer base': {
          ':root': {
            '--bg': '#F5F7FA',
            '--surface': '#FFFFFF',
            '--text-primary': '#0F172A',
            '--text-secondary': '#64748B',
            '--border': '#E2E8F0',
            '--accent': '#0EA5A4',
          },
          '.dark': {
            '--bg': '#0B1220',
            '--surface': '#111827',
            '--text-primary': '#F8FAFC',
            '--text-secondary': '#CBD5E1',
            '--border': '#1F2937',
            '--accent': '#14B8A6',
          },
        },
      });
    },
  ],
}
