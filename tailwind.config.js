/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        foreground: 'var(--foreground)',
        'foreground-secondary': 'var(--foreground-secondary)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        border: 'var(--border)',
        hover: 'var(--hover)',
      },
    },
  },
  plugins: [],
}
