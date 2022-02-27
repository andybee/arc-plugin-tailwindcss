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
      <link href="/foo/style.css" rel="stylesheet">
    </head>
    <body>
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
    </body>
    </html>
  `,
})
