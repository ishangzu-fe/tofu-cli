const program = require('commander')
const inquirer = require('inquirer')

const registerLogger = require('../lib/register-logger')

program
    .option('-p, --port <port>', '指定端口')
    .parse(process.argv)

launchServer()
registerLogger('server', process)

function launchServer () {
    let port
    if (program.port) {
        port = program.port
    }
    require('../webpack/server.js')(port)
}
