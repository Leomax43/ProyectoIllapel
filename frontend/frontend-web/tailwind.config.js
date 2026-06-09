/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
      colors: {
        // Registramos tus colores hexadecimales para poder usarlos con palabras
        'ucn-dark': '#1a3a5c',
        'ucn-blue': '#2563a0',
        'ucn-light': '#aac8e8',
        'ucn-bg': '#f5f5f2',
        'ucn-gray': '#444444',
      },
    },
  },
  plugins: [],
}