/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'text': {
        light: '#021d0d',
        dark: '#ddfdea'
      },

      'background': {
        light: {
          DEFAULT: '#DDFDEA',
          '1dp': '#D2F0DE',
          '2dp': '#CDEBD9',
          '3dp': '#CCE9D8',
          '4dp': '#C9E6D5',
          '6dp': '#C5E1D0',
          '8dp': '#C2DECE',
          '12dp': '#BED9C9',
          '16dp': '#BCD7C7',
          '24dp': '#B9D4C4',
        },
        dark: {
          DEFAULT: '#021D0D',
          '1dp': '#0F2919',
          '2dp': '#142D1E',
          '3dp': '#162F20',
          '4dp': '#193123',
          '6dp': '#1E3628',
          '8dp': '#21382A',
          '12dp': '#263D2F',
          '16dp': '#263D2F',
          '24dp': '#263D2F',
        }
      },

      'primary': {
        light: '#55f696',
        dark: '#55f696'
      },

      'secondary': {
        light: '#c9fdde',
        dark: '#022c13'
      },

      'accent': {
        light: '#055b27',
        dark: '#0dec66'
      }
    },
    fontFamily: {
      'headings': ['var(--font-kanit)', 'sans-serif'],
      'texts': ['var(--font-rubik)', 'sans-serif']
    }
  },
  plugins: [],
}
