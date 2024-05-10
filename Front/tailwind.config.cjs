

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}',],
  darkMode: 'class',
  theme: {
    variant: {
      xsss: '266px',
      xss: '320px',
      xs: '366px',
      ss: '375px',
      sn: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      fontFamily: {
        sans: ['Roboto Condensed', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem', // Extra Small screens
        sm: '0.875rem', // Small screens
        md: '1rem', // Medium screens
        lg: '1.175rem', // Large screens
        xl: '1.575rem', // Extra Large screens
        '2xl': '2.5rem', // 2 Extra Large screens
      },
      colors: {
        green: {
          pri: '#00a651',
          sec: '#5cd3b7',
        },

        yellow: {
          pri: '#FAAF40',
          light: '#ffffe0',
        },

        white: {
          bg: '#f6f6f6',
          contents: '#c8c8c8',
          fg: '#fff',
          text: '#F5F5F5',
          input: '#bcbcbc',
          shadow: '#00a65100',
         
        },

        black: {
          bg: '#121212',
          fg: '#393939',
          contents: '#292929',
          text: '#1F2937',
          input: '#303134',
          border: '#dfe1e500', 
          shadow: '#171717',
          test2: '#393939',
          test3: '#282828',
          test4: '#212121',
        },
        shadow: {
          black: '0 1px 6px 0 #171717',
        },
      },
    },
  },

  variants: {},
  plugins: [

  ],
};
