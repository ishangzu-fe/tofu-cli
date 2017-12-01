const cwd = process.cwd()

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const inquirer = require('inquirer')
const ora = require('ora')
// const pacote = require('pacote')
const download = require('download')

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
    const dist = './'
    spinner.start()
    switch (templateType) {
        case 'PC':
            name = 'pitaya'
            break
        default:
            break
    }
    await download('http://192.168.0.192:8083/isz-pc/tofu-template/repository/archive.zip?ref=dev&private_token=AKM616C1BgXy1SMownRG', dist, { extract: true })
    const absoluteCWD = path.resolve(cwd)
    const files = fs.readdirSync(absoluteCWD)
    let dirname
    for (file of files) {
        if (/^tofu\-template.*$/.test(file)) {
            dirname = file
        }
    }
    const currentPath = path.join(absoluteCWD, dirname)
    fs.moveSync(currentPath, absoluteCWD)

    // git init
    try {
        execSync('git init')
        const preCommitPath = path.join(absoluteCWD, '.git/hooks/pre-commit')
        fs.createFileSync(preCommitPath)
        fs.writeFileSync(preCommitPath, '#!/bin/sh\nexec tofu lint')
        fs.chmodSync(preCommitPath, 0755)
    } catch(err) {
        console.log('Git init failed！')
        console.error(err)
    }

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
