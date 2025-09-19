const fs = require('fs-extra')
const path = require('node:path')

module.exports = (srcDir, destDir) => () => {
  const copyLayouts = fs.copy(
    path.join(process.cwd(), 'src', 'layouts'),
    path.join(process.cwd(), destDir, 'layouts'),
    { overwrite: true }
  )
  const copyPartials = fs.copy(
    path.join(process.cwd(), 'src', 'partials'),
    path.join(process.cwd(), destDir, 'partials'),
    { overwrite: true }
  )
  const copyHelpers = fs.copy(
    path.join(process.cwd(), 'src', 'helpers'),
    path.join(process.cwd(), destDir, 'helpers'),
    { overwrite: true }
  )
  return Promise.all([copyLayouts, copyPartials, copyHelpers])
}
