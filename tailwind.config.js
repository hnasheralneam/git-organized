/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   './views/*.{html,ejs,js,jsx}',
   './views/partials/*.{html,ejs,js,jsx}',
   './assets/Scripts/*.{html,ejs,js,jsx}'
 ],
  theme: {
    fontFamily: {
      'nunito': ['Nunito', 'sans-serif'],
    },
    extend: {}
  },
  plugins: [],
}
