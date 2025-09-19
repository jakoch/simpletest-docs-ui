const fs = require('fs-extra')
const path = require('node:path')

module.exports = (srcDir, destDir) => () => {
  const src = path.join(srcDir, 'img')
  const dest = path.join(destDir, 'img')
  return fs.pathExists(src).then(exists => (exists ? fs.copy(src, dest) : Promise.resolve()))
}
