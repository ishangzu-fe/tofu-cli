#! /usr/bin/env node

const program = require('commander')

const registerLogger = require('../lib/register-logger')
const checkHasInited = require('../lib/check-init')
const checkVersion = require('../lib/check-version')
const { resolveCwd } = require('../lib/utils')

main()

async function main () {
    if (process.argv[2] !== 'lint') await beforeInit()

    program.version(require('../package').version)
    .usage('<command> [options]')
    .command('init', '创建一个基于tofu的项目')
    .command('server', '运行开发服务')
    .command('build', '打包项目')
    .command('update', '更新框架以及命令行工具至最新版本')
    .command('lint', '校验 JS 代码')
    .parse(process.argv)

    registerLogger('', process)
}

async function beforeInit () {
    if (process.argv[2] !== 'init') {
        checkHasInited()

        const packageJson = require(resolveCwd('package.json'))
        if (packageJson.dependencies && packageJson.dependencies['i-tofu'])
            await checkVersion('i-tofu')()
    }
    await checkVersion('tofu-cli')()
}
