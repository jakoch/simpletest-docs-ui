const vfs = require('vinyl-fs')
const path = require('node:path')

module.exports = (previewSrcDir, destDir) => () => {
  const srcGlob = '**/*.{png,svg}'
  return vfs
    .src(srcGlob, { base: previewSrcDir, cwd: previewSrcDir, allowEmpty: true })
    .pipe(vfs.dest(path.join(destDir, 'img')))
}
