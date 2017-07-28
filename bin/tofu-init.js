const cwd = process.cwd()

const fs = require('fs-extra')
const inquirer = require('inquirer')
const ora = require('ora')
const pacote = require('pacote')

const { resolveCwd } = require('../lib/utils')
const { log } = require('../lib/log')
const registerLogger = require('../lib/register-logger')

init()
registerLogger('init', process)

async function init () {
    const { templateType } = await selectTemplate()

    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: '确定要将项目创建在当前文件夹吗？'
    })

    if (!confirm) return

    const spinner = ora('正在下载模板文件...')
    let name, registry
    const dist = './'
    const registry = 'http://registry.npm.taobao.org'
    spinner.start()
    switch (templateType) {
        case 'PC':
            name = 'pitaya'
            break
        case 'electron':
            name = 'macadamia'
        default:
            break
    }
    await pacote.extract(name, dist, { registry })
    spinner.stop()
    afterDownload()
}

async function selectTemplate () {
    return await inquirer.prompt({
        name: 'templateType',
        message: '请选择新建的模板类型',
        type: 'list',
        default: 0,
        choices: [
            'PC'
        ]
    }).catch(err => {
        console.error('选择模板类型出错')
        console.error(err)
    })
}

/**
 * 下载之后做的事情
 * @param {String} dist 项目目录
 */
function afterDownload () {
    fs.removeSync(resolveCwd('.npmignore'))

    log();
    log('已完成项目的初始化:', 'green');
    log();
    log(`    在当前目录中新建了项目`, 'white');
    log();
    log('接下来你需要：', 'white');
    log();
    log('    npm install', 'white');
    log('    git init', 'white');
    log();
    log('然后你可以：', 'white');
    log();
    log('    - tofu server          运行开发服务', 'white');
    log('    - tofu build           打包项目', 'white');
    log('    - tofu update          更新框架以及命令行工具至最新版本', 'white');
    log();
}
