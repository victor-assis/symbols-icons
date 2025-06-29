import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [forms],
} satisfies Config
