const program = require('commander')

program
    .option('-C, --no-compress', '不压缩')
    .option('-d, --delete', '压缩后删除 dist')
    .parse(process.argv)

require('../webpack/build')(program.compress, program.delete)
require('../lib/register-logger')('build', process)
