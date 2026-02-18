import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0d1117',
        surface:  '#161b22',
        surface2: '#1c2128',
        border:   '#30363d',
        accent:   '#58a6ff',
        green:    '#3fb950',
        yellow:   '#e3b341',
        red:      '#f78166',
        purple:   '#d2a8ff',
        muted:    '#8b949e',
      },
      fontFamily: {
        mono:    ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
};

export default config;
