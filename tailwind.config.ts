import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        signature: ['var(--font-signature)', 'cursive'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.8rem',
        'base': '0.9rem',
        'lg': '1rem',
        'xl': '1.1rem',
        '2xl': '1.35rem',
        '3xl': '1.7rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.25rem',
      },
      colors: {
        // Light mode colors
        'light-bg': '#e6e7ee',
        'light-shadow-dark': '#a3b1c6',
        'light-shadow-light': '#ffffff',
        'light-text': '#44476a',
        'light-accent': '#000000', // Changed to black
        // Dark mode colors
        'dark-bg': '#1a1f36',
        'dark-shadow-dark': '#101426',
        'dark-shadow-light': '#242b48',
        'dark-text': '#e6e7ee',
        'dark-accent': '#ffffff', // Changed to white for dark mode
      },
      boxShadow: {
        'neu-light': '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff',
        'neu-light-inset': 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff',
        'neu-dark': '3px 3px 6px #101426, -3px -3px 6px #242b48',
        'neu-dark-inset': 'inset 2px 2px 4px #101426, inset -2px -2px 4px #242b48',
      },
    },
  },
  plugins: [],
};

export default config;
