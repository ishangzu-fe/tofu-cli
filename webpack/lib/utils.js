/**
 * 参考 vue 2.3.4
 *
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
exports.isPlainObject = function (obj) {
    return toString.call(obj) === '[object Object]'
}

const path = require('path')
const cwd = process.cwd()
exports.resolveCwd = function (...p) {
    return path.posix.join(cwd, ...p)
}
