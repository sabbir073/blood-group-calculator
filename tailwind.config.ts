import type { Config } from 'tailwindcss';

const config: Config = {
  /* <-- THIS is the critical line */
  darkMode: 'class',

  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: { extend: {} },

  plugins: [],
};

export default config;
