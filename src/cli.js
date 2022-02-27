const { exec, spawn } = require('child_process')

/**
 * Spawns the TailwindCSS CLI in watcher mode, for use during local development.
 * Returns the process handle.
 */
exports.startWatcher = function startTailwindCSSWatcher (inputPath, outputPath, options = {}) {
  const { configPath, update } = options
  const watcherProcess = spawn(
    'npx',
    [
      'tailwindcss',
      ...configPath !== undefined ? [ '-c', configPath ] : [],
      '-i',
      inputPath,
      '-o',
      outputPath,
      '-w'
    ]
  )
  watcherProcess.stdout.on('data', (data) => { update?.status(String(data).trim()) })
  watcherProcess.on('exit', (code) => {
    if (code === null) return
    update?.err(`TailwindCSS CLI closed unexpectedly with code ${code}`)
    process.exit(code)
  })
  // wait for initial build to confirm watcher started successfully
  let firstBuild = true
  return new Promise((resolve) => {
    watcherProcess.stderr.on('data', (data) => {
      const line = String(data).trim()
      // make the usual "Rebuilding..."/"Done in" flow look more Arc-like
      if (line === 'Rebuilding...') {
        update?.start(line)
        return
      }
      if (line.startsWith('Done in ')) {
        if (firstBuild) {
          firstBuild = false
          update?.done(line.replace('Done in ', 'Built in ').slice(0, -1))
          resolve(watcherProcess)
          return
        }
        update?.done(line.replace('Done in ', 'Rebuilt in ').slice(0, -1))
        return
      }
      update?.status(line)
    })
  })
}

/**
 * Calls the TailwindCSS CLI to build and minifiy the stylesheet, for use during a deployment.
 */
exports.buildStyleSheet = (inputPath, outputPath, options = {}) => new Promise((resolve, reject) => {
  const { configPath, update, minify } = options
  exec(
    [
      'npx',
      'tailwindcss',
      ...configPath ? [ '-c', configPath ] : [],
      '-i',
      inputPath,
      '-o',
      outputPath,
      ...minify ? [ '-m' ] : [],
    ].join(' '),
    (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      if (update) {
        const stdoutString = stdout?.toString() || ''
        const stderrString = stderr?.toString() || ''
        const output = `${stdoutString + stderrString}`
          .trim()
          .split('\n')
          .filter(Boolean)
        output.forEach((line) => {
          if (line.startsWith('Done in ')) {
            update.done(line.replace('Done in ', 'Built in ').slice(0, -1))
            return
          }
          update.status(line)
        })
      }
      resolve()
    }
  )
})
