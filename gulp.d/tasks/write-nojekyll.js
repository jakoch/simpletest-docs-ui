const fs = require('fs-extra')
const ospath = require('path')

// Exports a task factory: (dest) => () => Promise
module.exports =
  (dest = 'public') =>
  () => {
    const target = ospath.join(dest, '.nojekyll')
    // write an empty file (or overwrite if exists)
    return fs.outputFile(target, '')
  }
