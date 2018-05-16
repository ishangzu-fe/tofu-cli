const { exec } = require('child_process')

module.exports = function(targetBranch) {
    return new Promise((resolve, reject) => {
        exec('git symbolic-ref --short -q HEAD', (err, stdout, stderr) => {
            const currentBranch = stdout.replace(/\s/g, '')
            if (targetBranch) {
                isBranchCorrect = currentBranch === targetBranch
            } else {
                isBranchCorrect = (currentBranch === 'master' || currentBranch === 'dev') || ~currentBranch.indexOf('release')
            }
            if (!isBranchCorrect) {
                console.error('请在 master 或 dev 分支打包')
                process.exit(0)
            } else {
                resolve()
            }
        })
    })
}
