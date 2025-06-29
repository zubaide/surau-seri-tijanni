/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./admin/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        'masjid-gold': '#FFD700',
      },
      fontFamily: {
        'digital': ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
