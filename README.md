## [`arc-plugin-tailwindcss`](https://www.npmjs.com/package/arc-plugin-tailwindcss)

> TailwindCSS workflow integration for Architect

## Install

Into your existing Architect project:

```sh
npm i arc-plugin-tailwindcss --save-dev
```

Add the following to your Architect project manifest (usually `app.arc`):

```arc
@plugins
arc-plugin-tailwindcss
```

## Usage

Now, simply author HTTP Lambdas in the `src` tree and HTML or client-side JavaScript in `public` with TailwindCSS utility classes:

```js
// src/http/get-index/index.js
exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'content-type': 'text/html; charset=utf8'
  },
  body: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="/style.css" rel="stylesheet">
    </head>
    <body>
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
    </body>
    </html>
  `,
})
```

The above function will trigger TailwindCSS to generate a CSS file includes the `text-3xl`, `font-bold` and `underline` utility classes.

When working locally, Sandbox runs the TailwindCSS CLI which automatically detects changes to your functions and public HTML and client-side JavaScript and updates the CSS file for you.

## Configuration

### `tailwind.config.js`

This plugin will create a new `tailwind.config.js` for you if one does not already exist at the root of the project.

### Project manifest settings

The following higher-level settings are also available in your Architect project manifest:
- `src` - configure the source CSS file location; defaults to `src/styles/tailwind.css`
  - If the file does not exist on Sandbox startup, a default CSS file will be created
- `build` - configure the build file location; defaults to `public/style.css`
  - Note: make sure you add this directory to your `.gitignore`
- `minify` - enable minification of your CSS file on deployment; defaults to `true`

Example:

```arc
@tailwindcss
# Read base CSS file `./src/my-styles.css`
src src/my-styles.css

# Output CSS file to `./public/foo/styles.css`
build public/foo/style.css

# Minify the CSS file prior to deployment
minify true
```
