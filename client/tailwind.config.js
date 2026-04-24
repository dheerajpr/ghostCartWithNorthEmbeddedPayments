/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00E5FF',
        cyber: {
          bg: '#0A0A0F',
          surface: '#12121A',
          border: '#1E1E2E',
        }
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(0, 229, 255, 0.4)',
        'neon-border': '0 0 10px rgba(0, 229, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
