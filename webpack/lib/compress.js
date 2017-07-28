const fs = require('fs-extra')
const path = require('path')
const cp = require('child_process')
const cwd = process.cwd()

const archiver = require('archiver')

const { resolveCwd } = require('./utils')
const { log, logSuccess } = require('../../lib/log')

const output = fs.createWriteStream(resolveCwd('dist.zip'))
const archive = archiver('zip', {
    zlib: {
        level: 0 // 压缩等级 1-9
    }
})

archive.on('error', function (err) {
    log('压缩文件出错', 'red')
    throw err
})

archive.pipe(output)

module.exports = (deleteDist) => {
    const dist = path.posix.join(require('os').userInfo().homedir, 'Desktop', 'dist.zip')

    output.on('close', function () {
        fs.rename(resolveCwd('dist.zip'), dist, (err) => {
            if (err) {
                log('移动 dist.zip 文件出错，请在当前文件夹查看打包好的压缩包', 'red')
                throw err
            } else {
                log(`\n已经将打包好的文件移动到桌面，请查看 ${dist}\n`, 'yellow')

                if (deleteDist) {
                    fs.removeSync(resolveCwd('./dist'))
                }
            }
        })
    })

    archive.directory('./dist')
    archive.finalize()
}
