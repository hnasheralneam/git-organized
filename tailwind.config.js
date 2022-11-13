/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './views/*.{html,ejs,js}',
      './views/project/*.{html,ejs,js}',
      './views/partials/*.{html,ejs,js}',
      './scripts/*.{html,ejs,js}',
      './scripts/project/*.{html,ejs,js}'
   ],
   theme: {
      extend: {
         fontFamily: {
            'nunito': ['Nunito', 'sans-serif'],
            'notosansmono': ['Noto Sans Mono', 'monospace'],
         }
      }
   },
   plugins: [],
}
