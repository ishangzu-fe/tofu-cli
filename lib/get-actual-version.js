const { spawn } = require('child_process')

module.exports = function (packageName) {
    return new Promise((resolve, reject) => {
        const child = spawn(`npm`, ['view', packageName, 'version'], {
            stdio: 'pipe'
        })

        child.stdout.on('data', msg => {
            resolve(msg.toString())
        })
    })
}
