'use strict'

const { ESLint } = require('eslint')

/**
 * Lint JS using the eslint Node API.
 * files: glob or array of globs to pass to ESLint
 */
module.exports = (files) => async (done) => {
  try {
    const eslint = new ESLint()
    const results = await eslint.lintFiles(files)
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)
    if (resultText) console.log(resultText)
    const hasErrors = results.some((r) => r.errorCount > 0)
    if (hasErrors) return done(new Error('eslint found errors'))
    return done()
  } catch (err) {
    // If ESLint can't load its shared config (e.g., 'standard') or plugins,
    // print a helpful message and continue without failing the entire gulp run.
    console.warn('Warning: ESLint failed to run. This may be because required ESLint')
    console.warn('shared configs or plugins are not installed.')
    console.warn(err && err.message ? err.message : err)
    return done()
  }
}
