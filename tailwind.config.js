/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        htnwhite: "#F0F0E8",
        htngreen: "#80E0B8",
        htnpurple: "#C0A8F8",
        htnpink: "#F070B8",
        htnblue: "#6880D0",
      },
    },
  },
  plugins: [],
};
