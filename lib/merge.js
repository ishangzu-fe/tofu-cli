const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

const { resolveCwd } = require('./utils')

const TEXT_FILE_EXT = [
    '.js', '.json', '.css', '.scss', '.sass', '.html',
    '.log', '.xml', '.vue'
]
const textFileTypes = new Set(TEXT_FILE_EXT)
const isTextFile = function (type) {
    return textFileTypes.has(type)
}

module.exports = (target, empty, src) => {
    const srcStats = fs.lstatSync(src)
    const srcExt = path.extname(src)

    if (isTextFile(srcExt) || !srcExt || srcStats.isDirectory()) {
        if (fs.existsSync(target) && !srcStats.isDirectory()) {
            try {
                const child = execSync(`git merge-file ${target} ${empty} ${src}`)
            } catch (err) {
                const rst = fs.readFileSync(target, { encoding: 'utf-8' })
                const conflictRE = /\>{6,}/
                const hasConflict = conflictRE.test(rst)

                if (hasConflict) return false
                else throw err
            }
        } else {
            fs.copySync(src, target)
        }
    } else {
        fs.copySync(src, target)
    }

    return true
}


