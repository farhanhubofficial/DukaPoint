/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      boxShadow: {
        'custom-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.2)',
        'custom-color': '0 4px 6px rgba(255, 0, 0, 0.5)',
      },
      screens:{
       
        'sm': '690px',
        'lg': '1228px',
        
        'sm641':'641px'
        

      }
    },
  },
  plugins: [],
}


