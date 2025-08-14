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
    extend: {
      colors: {
        'overlay-light': 'rgba(0,0,0,0.03)',
        'overlay-medium': 'rgba(0,0,0,0.05)',
        'overlay-blue': 'rgba(161,206,220,0.2)',
        'overlay-blue-light': 'rgba(161,206,220,0.3)',
        'overlay-pulse': 'rgba(25,118,210,0.1)',
        'success': '#4caf50',
        'error': '#f44336',
        'bonus': '#2196f3',
        'warning': '#ffa726',
        'danger': '#ff6b6b'
      },
      spacing: {
        'digit': '120px',
        'pulse': '80px',
        'logo-h': '178px',
        'logo-w': '290px'
      },
      borderRadius: {
        'digit': '60px',
        'pulse': '40px'
      },
      fontSize: {
        'digit-lg': '48px',
        'digit-sm': '16px',
        'pulse': '32px'
      },
      letterSpacing: {
        'seq': '4px'
      }
    }
  },
  plugins: []
};

export default config;
