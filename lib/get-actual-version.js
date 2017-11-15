const { spawn } = require('child_process')

module.exports = function (packageName) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm',  ['view', packageName, 'version'], {
            stdio: 'pipe'
        })

        child.stdout.on('data', msg => {
            resolve(msg.toString())
        })
    })
}
