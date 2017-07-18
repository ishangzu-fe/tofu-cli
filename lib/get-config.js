const fs = require('fs')
const { resolveCwd } = require('./utils')

module.exports = () => {
    if (fs.existsSync(resolveCwd('.tofurc'))) {
        try {
            return fs.readFileSync(resolveCwd('.tofurc'))
        } catch (err) {
            console.error('获取 tofurc 出错')
            console.error(err)
        }
    } else if (fs.existsSync(resolveCwd('.tofurc.js'))) {
        return require(resolveCwd('.tofurc.js'))
    } else if (fs.existsSync(resolveCwd('.tofurc.json'))) {
        return require(resolveCwd('.tofurc.json'))
    } else {
        return
    }
}
