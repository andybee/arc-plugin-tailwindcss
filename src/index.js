const { dirname, resolve } = require('path')
const { mkdir } = require('fs/promises')
const { updater } = require('@architect/utils')

const cp = require('./cp')
const getPluginConfig = require('./config')
const tailwind = require('./cli')

const configTemplatePath = `${__dirname}/tailwind.config.default.js`
const inputStyleSheetTemplatePath = `${__dirname}/tailwind.default.css`
const configPath = 'tailwind.config.js'

let watcherProcess
const update = updater('TailwindCSS')

module.exports = {
  sandbox: {
    start: async ({ arc, inventory }) => {
      const {
        src: inputStyleSheetPath,
        build: outputStyleSheetPath,
      } = getPluginConfig(arc)
      const { cwd } = inventory.inv._project

      // create tailwind config file if it doesn't exist
      await cp(configTemplatePath, resolve(cwd, configPath))

      // create base stylesheet if it doesn't exist
      await mkdir(dirname(resolve(cwd, inputStyleSheetPath)), { recursive: true })
      await cp(inputStyleSheetTemplatePath, resolve(cwd, inputStyleSheetPath))

      // create path to built stylesheet if it doesn't exist
      await mkdir(dirname(resolve(cwd, outputStyleSheetPath)), { recursive: true })

      // start tailwind's watcher
      update.start('Starting watcher...')
      watcherProcess = await tailwind.startWatcher(
        resolve(cwd, inputStyleSheetPath),
        resolve(cwd, outputStyleSheetPath),
        { configPath: resolve(cwd, configPath), update }
      )
      update.done('Started watcher')
    },
    end: () => {
      update.start('Stopping watcher...')
      watcherProcess.kill()
      update.done('Stopped watcher')
    },
  },
  deploy: {
    start: async ({ arc, inventory }) => {
      const {
        src: inputStyleSheetPath,
        build: outputStyleSheetPath,
        minify,
      } = getPluginConfig(arc)
      const { cwd } = inventory.inv._project

      // create tailwind config file if it doesn't exist
      await cp(configTemplatePath, resolve(cwd, configPath))

      // create base stylesheet if it doesn't exist
      await mkdir(dirname(inputStyleSheetPath), { recursive: true })
      await cp(inputStyleSheetTemplatePath, inputStyleSheetPath)

      // create path to built stylesheet if it doesn't exist
      await mkdir(dirname(outputStyleSheetPath), { recursive: true })

      // use tailwind to build output spreadsheet for deployment
      update.start('Building CSS for deployment...')
      await tailwind.buildStyleSheet(
        inputStyleSheetPath,
        outputStyleSheetPath,
        { configPath: resolve(cwd, configPath), minify, update }
      )
    },
  },
}
