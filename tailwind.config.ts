import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./App.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
