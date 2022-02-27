const sandbox = require('@architect/sandbox')
const test = require('tape')
const { existsSync, readFileSync, rmSync } = require('fs')

const { join } = require('path')

const port = 6666
const mock = join(process.cwd(), 'test', 'mock')
let cwd
let artefacts
// const url = path => `http://localhost:${port}/${path}`

const reset = () => artefacts.map(path => rmSync(path, { recursive: true, force: true }))

/**
 * Ideally these tests would also exercise the watcher method
 * However, running / terminating the Sandbox in a child process is a bit onerous so let's consider it a TODO
 */
test('Start Sandbox (default project)', async t => {
  t.plan(1)
  cwd = join(mock, 'defaults')
  artefacts = [
    join(cwd, 'public', 'style.css'),
    join(cwd, 'src', 'styles'),
    join(cwd, 'tailwind.config.js'),
  ]
  reset()
  await sandbox.start({ cwd, port, quiet: true })
  t.pass('Started Sandbox')
})

test('Config files copied', async t => {
  t.plan(2)
  t.ok(existsSync(join(cwd, 'tailwind.config.js')), 'Found Tailwind configuration')
  t.ok(existsSync(join(cwd, 'src', 'styles', 'tailwind.css')), 'Found base StyleSheet')
})

test('StyleSheet built', async t => {
  t.plan(2)
  const styleSheetPath = join(cwd, 'public', 'style.css')
  t.ok(existsSync(styleSheetPath), 'Found built StyleSheet')
  const styleSheet = readFileSync(styleSheetPath).toString()
  const lines = styleSheet.split('\n').filter(Boolean).length
  t.ok(lines > 1, 'StyleSheet is not minified')
})

test('Shut down Sandbox', async t => {
  t.plan(1)
  await sandbox.end()
  reset()
  t.pass('Shut down Sandbox')
})

test('Start Sandbox (custom project)', async t => {
  t.plan(1)
  cwd = join(mock, 'custom')
  artefacts = [
    join(cwd, 'public', 'foo'),
    join(cwd, 'src', 'my-styles.css'),
    join(cwd, 'tailwind.config.js'),
  ]
  reset()
  await sandbox.start({ cwd, port, quiet: true })
  t.pass('Started Sandbox')
})

test('Config files copied', async t => {
  t.plan(2)
  t.ok(existsSync(join(cwd, 'tailwind.config.js')), 'Found Tailwind configuration')
  t.ok(existsSync(join(cwd, 'src', 'my-styles.css')), 'Found base StyleSheet')
})

test('StyleSheet built', async t => {
  t.plan(2)
  const styleSheetPath = join(cwd, 'public', 'foo', 'style.css')
  t.ok(existsSync(styleSheetPath), 'Found built StyleSheet')
  const styleSheet = readFileSync(styleSheetPath).toString()
  const lines = styleSheet.split('\n').filter(Boolean).length
  t.ok(lines > 1, 'StyleSheet is not minified')
})

test('Shut down Sandbox', async t => {
  t.plan(1)
  await sandbox.end()
  reset()
  t.pass('Shut down Sandbox')
})
