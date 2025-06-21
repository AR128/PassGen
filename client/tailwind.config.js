/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the files that Tailwind should scan for utility classes.
  // This helps PurgeCSS remove unused styles in production builds.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Look in all .js, .jsx, .ts, .tsx files inside the src folder
    "./public/index.html",       // Also check the main HTML file
  ],
  theme: {
    extend: {
      // Custom fonts setup
      fontFamily: {
        // 'Inter' is already imported in index.html,
        // but defining it here ensures Tailwind generates the correct classes
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
