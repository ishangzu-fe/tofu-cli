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

async function init() {
    const { templateType } = await selectTemplate()
    const projectName = process.argv[2];
    let absoluteCWD = path.resolve(cwd);
    let projectPath;


    if (!projectName) {
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '确定要将项目创建在当前文件夹吗？'
        })

        if (!confirm) return
        projectPath = absoluteCWD;
    } else {
        projectPath = path.join(absoluteCWD, projectName);
        // fs.mkdirpSync(projectName);
    }

    const spinner = ora('正在下载模板文件...')
    const dist = './';
    let url, reg;
    spinner.start()
    switch (templateType) {
        case 'PC':
            name = 'pitaya';
            reg = /^tofu\-template.*$/
            // 注意private_token目前是绑定的hujin0327@126.com
            url = 'http://122.225.206.74:9677/isz-pc/tofu-template/repository/archive.zip?ref=dev&private_token=3j_shUaB2V8uHk1qSaSd'
            break;
        case 'Mobile':
            name = 'mobile';
            reg = /^mobile\-template.*$/
            url = 'http://122.225.206.74:9677/isz-pc/mobile-template/repository/archive.zip?ref=master&private_token=3j_shUaB2V8uHk1qSaSd';
        default:
            break
    }
    await download(url, dist, { extract: true })
    const files = fs.readdirSync(absoluteCWD)
    let dirname
    for (file of files) {
        if (reg.test(file)) {
            dirname = file
        }
    }
    const currentPath = path.join(absoluteCWD, dirname)
    fs.moveSync(currentPath, projectPath)

    // git init
    try {
        let exec = '';
        if (projectName) {
            exec = 'cd ' + projectName + '\n';
        }

        execSync(exec + 'git init')

        const preCommitPath = path.join(projectPath, '.git/hooks/pre-commit')
        fs.createFileSync(preCommitPath)
        fs.writeFileSync(preCommitPath, '#!/bin/sh\nexec tofu lint')
        fs.chmodSync(preCommitPath, 0755)
    } catch (err) {
        console.log('Git init failed！')
        console.error(err)
    }

    spinner.stop()
    afterDownload()

}

async function selectTemplate() {
    return await inquirer.prompt({
        name: 'templateType',
        message: '请选择新建的模板类型',
        type: 'list',
        default: 0,
        choices: [
            'PC',
            'Mobile'
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
function afterDownload() {
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
