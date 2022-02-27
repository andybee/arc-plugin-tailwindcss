const defaultInputStyleSheetPath = './src/styles/tailwind.css'
const defaultOutputStyleSheetPath = './public/style.css'

/**
 * Builds arc config params array in to an object.
 */
module.exports = (arc) => (arc.tailwindcss || []).reduce(
  (params, [ key, value ]) => ({
    ...params,
    [key]: value,
  }),
  {
    src: defaultInputStyleSheetPath,
    build: defaultOutputStyleSheetPath,
    minify: true,
  },
)
