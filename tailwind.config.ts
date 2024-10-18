import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  safelist: ['dark'],
  theme: {
    extend: {
      colors: {
        background: '#0A0D15',
        foreground: '#0A0D15',
      },
    },
  },
  plugins: [],
};
export default config;
