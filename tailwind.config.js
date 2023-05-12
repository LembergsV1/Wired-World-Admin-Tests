/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",   
  ],
  theme: {
    extend: {
      colors: {
        primary: '#047ce7',
        highlight: '#ADD8E6',
        bg: '#EDAEC0',
        AAA: '#fa9a81',
      }
    },
  },
  plugins: [],
}

