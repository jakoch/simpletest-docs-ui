module.exports = {
  content: [
    './src/**/*.{html,js,css,hbs,adoc}',
    './preview-src/**/*.{html,adoc}',
    './public/**/*.{html,hbs}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent-color, #2563eb)',
      },
    },
  },
  plugins: [],
}
