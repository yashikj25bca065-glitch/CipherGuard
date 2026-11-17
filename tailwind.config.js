/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#070b14",
          card: "rgba(11, 20, 38, 0.75)",
          cardBorder: "rgba(42, 70, 115, 0.35)",
          cyan: "#00f0ff",
          blue: "#0070f3",
          purple: "#8a2be2",
          red: "#ff2a5f",
          green: "#00ff88",
          orange: "#ff8c00"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.25)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.25)',
        'glow-red': '0 0 20px rgba(255, 42, 95, 0.25)',
        'glow-blue': '0 0 20px rgba(0, 112, 243, 0.25)',
        'glow-purple': '0 0 20px rgba(138, 43, 226, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'scan': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
