const program = require('commander')
const inquirer = require('inquirer')

const registerLogger = require('../lib/register-logger')

program
    .option('-p, --port <port>', '指定端口')
    .option('-b, --build', '测试构建的包')
    .option('-P, --peace')
    .parse(process.argv)

launchServer()
registerLogger('server', process)

function launchServer () {
    let port
    if (program.port) {
        port = program.port
    }
    if (program.build) {
        require('../webpack/server-build.js')
    } else {
        require('../webpack/server.js')(port, program.peace)
    }
}
