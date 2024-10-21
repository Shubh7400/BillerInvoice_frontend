/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "poppins-regular": ["Poppins-Regular", "sans-serif"],
        "poppins-bold": ["Poppins-Bold", "sans-serif"],
        "poppins-thin": ["Poppins-Thin", "sans-serif"],
      },
      colors: {
        colorDark: "#001d3d",
        colorMediumDark: "#003566",
        colorMedium: "#457b9d",
        colorLight: "#a8dadc",
        colorLightFont: "#f1faee",
        colorDarkFont: "#1d3557",
        colorCancelButton: " #e63946",
        colorNormalButton: "#ffb703",
        colorNormalButtonHover: "#fb8500",
        thirdColor: "#7873C9",
        thirdColorHover: "#6761cc",
        cubexoThemeColor: "#1bbc9b",
        colorPdf: "#5a51be",
      },
    },
  },
  plugins: [],
};
