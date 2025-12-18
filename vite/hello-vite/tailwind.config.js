/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    'text-gray-800',
    'text-gray-700',
    'text-gray-600',
    'text-gray-500',
    'text-gray-400',
    'text-blue-700',
    'text-blue-600',
    'text-white',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

