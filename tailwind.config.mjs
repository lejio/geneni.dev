/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        zerox: ["ZeroxProtoNerdFont", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "msu-green": {
          DEFAULT: "#18453B",
          light: "#8FD4A8",
        },
      },
    },
  },
  plugins: [],
};
