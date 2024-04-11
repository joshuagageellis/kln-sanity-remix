/* eslint perfectionist/sort-objects: 0 */
function calcRem(value) {
  return `${value  / 16}rem`;
}

module.exports = {
  plugins: {
    'postcss-import': {}, 
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-preset-env': {
      features: {'nesting-rules': false},
    },
    'postcss-functions': {
      functions: {
        // Add your functions here
        calcRem,
        typeScale: function (minValue, maxValue) {
          return `max(
            ${calcRem(minValue)},
            calc(
              ${calcRem(minValue)} + (${maxValue} - ${minValue}) * var(--fluid-fluid-bp)
            )
          )`;
        },
        vw: function (value) {
          return `calc(${value} / 14.4) * 1vw`;
        },
      },
    },
  },
};
