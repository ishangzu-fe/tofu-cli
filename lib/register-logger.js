const path = require('path')
const fs = require('fs-extra')

module.exports = (cmd, process) => {
    if (cmd) cmd = '-' + cmd

    const file = path.posix.join(__dirname, '..', 'tofu-cli.log')
    fs.ensureFileSync(file)
    const stats = fs.lstatSync(file)
    const cTime = stats.ctime
    const diff = Date.now() - new Date(cTime.getFullYear(), cTime.getMonth(), cTime.getDate())
    if (diff >= 259200000) {
        fs.writeFileSync(file, '', { flag: 'w' })
    }

    process.on('unhandledRejection', (err) => {
        throw err
    })
    process.on('uncaughtException', (err) => {
        fs.writeFileSync(file,
            `[Error]Tofu${cmd}:${process.exitCode} (${new Date().toLocaleString()})\n` +
            `${err.stack}\n`,
            { flag: 'a' }
        )
        throw err
    })
    process.on('exit', code => {
        const state = code ? 'Error' : 'Success'
        fs.writeFileSync(
            file, `[${state}]Tofu${cmd}:${code} (${new Date().toLocaleString()})\n`,
            { flag: 'a' }
        )
    })
}