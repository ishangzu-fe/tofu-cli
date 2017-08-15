const program = require('commander')

program
    .option('-C, --no-compress', '不压缩')
    .option('-d, --delete', '压缩后删除 dist')
    .option('-a, --analysis', '分析打包结果')
    .parse(process.argv)

require('../webpack/build')(program.compress, program.delete, program.analysis)
require('../lib/register-logger')('build', process)
