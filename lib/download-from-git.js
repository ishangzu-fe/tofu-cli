const download = require('download-git-repo')

module.exports = async (src, dist, clone) => {
    return new Promise((resolve, reject) => {
        download(src, dist, { clone }, err => {
            if (err) throw err
            resolve()
        })
    }).catch(err => {
        console.error('下载模板文件出错')
        console.error(err)
    })
}