@app
tailwindcss-mock

@http
get /dynamic

@plugins
tailwindcss
  src ../../..

@tailwindcss
src src/my-styles.css
build public/foo/style.css
minify true
