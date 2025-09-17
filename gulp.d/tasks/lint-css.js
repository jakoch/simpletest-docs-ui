'use strict'

const stylelint = require('stylelint')

/**
 * Lint CSS using the stylelint Node API.
 * files: glob or array of globs to pass to stylelint
 * returns a function that accepts the gulp `done` callback
 */
module.exports = (files) => async (done) => {
  try {
    const result = await stylelint.lint({ files, formatter: 'string' })
    // Print output if any
    if (result.output) console.log(result.output)
    // If stylelint reports errors, signal failure to gulp
    if (result.errored) {
      const err = new Error('stylelint found errors')
      // attach results for debugging
      err.results = result.results
      return done(err)
    }
    return done()
  } catch (err) {
    return done(err)
  }
}
