// "tailwindcss": "^3.4.10",
import { orange, green, purple, yellow, red, blue, pink, grey } from "@mui/material/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "tw-",
  theme: {
    extend: {
      colors: {
        green,
        purple,
        yellow,
        red,
        blue,
        pink,
        orange,
        grey,
        primary: blue[500],
        secondary: purple[500],
        text: {
          primary: "rgba(0, 0, 0, 0.87)",
          secondary: "rgba(0, 0, 0, 0.6)",
          disabled: "rgba(0, 0, 0, 0.38)"
        }
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
      },
      height: {
        'screen-minus-header': 'calc(100vh - 210px)',
        'screen-minus-toolbar': 'calc(100vh - 248px)'
      },
    },
  },
  plugins: [],
};
