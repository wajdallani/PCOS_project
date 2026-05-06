/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-lavender': '#B5A1E5',
        'soft-pink': '#F4C3D4',
        'deep-lavender': '#7B5FA5',
        'ai-accent': '#4B2E83',
        'bg-color': '#F6F7FB',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(181, 161, 229, 0.15)',
        'glow': '0 0 15px rgba(181, 161, 229, 0.5)',
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
