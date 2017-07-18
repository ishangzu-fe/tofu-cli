const fs = require('fs')
const cwd = process.cwd()
const path = require('path')
const { log } = require('./log')

/**
 * 检查是否已经初始化：
 * 1.npm
 * 2.git
 */

module.exports = () => {
    let packageJson
    try {
        packageJson = require(path.posix.join(cwd, 'package.json'))
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            log('Please init package.json!\nPlease init package.json!\nPlease init package.json!', 'red')
            log('Sorry, important things should be mentioned three times...')
            process.exit(1)
        } else {
            throw err
        }
    }

    if (!fs.existsSync(path.posix.join(cwd, '.git'))) {
        log('Please init git!\nPlease init git!\nPlease init git!', 'red')
        log('Sorry, important things should be mentioned three times...')
        process.exit(1)
    }
}
