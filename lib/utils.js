const path = require('path')
const cwd = process.cwd()

exports.resolveCwd = (...p) => {
    return path.posix.join(cwd, ...p)
}