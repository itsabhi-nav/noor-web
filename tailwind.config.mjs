/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F3EC',
        parchment: '#EFE8DB',
        stone2: '#E5DDCE',
        ink: '#16130E',
        charcoal: '#221E18',
        smoke: '#6E675C',
        line: '#DCD2C0',
        oxblood: '#86281C',
        oxblooddeep: '#5C1A11',
        olive: '#4A5240',
        oxblood: '#5E1F1B',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { mega: '0.32em' },
    },
  },
  plugins: [],
};
