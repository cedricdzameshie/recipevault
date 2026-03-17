/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rv: {
          cream: "#F7F6E5",
          teal: "#76D2DB",
          coral: "#DA4848",
          plum: "#36064D",
        },
      },
    },
  },
  plugins: [],
};
