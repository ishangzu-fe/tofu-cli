const program = require('commander')
const { execSync } = require('child_process')

program
    .option('-C, --no-compress', '不压缩')
    .option('-d, --delete', '压缩后删除 dist')
    .option('-b, --branch <branch>', '在指定分支上打包')
    .parse(process.argv)

require('../lib/check-branch')(program.branch).then(res => {
    require('../webpack/build')(program.compress, program.delete)
    require('../lib/register-logger')('build', process)
})
