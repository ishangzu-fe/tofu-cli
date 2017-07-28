const http = require('http')
const assert = require('assert')

const semver = require('semver')
const chalk = require('chalk')
const ora = require('ora')

const { resolveCwd } = require('./utils')
const {
    log,
    logSuccess,
    logBoundary,
    logLine
} = require('../lib/log')
const getActualVersion = require('./get-actual-version')

module.exports = (projectName) => (async function () {
    assert(projectName, "Please specify the project's name")

    const cliPackageJson = require('../package')

    let localVersion =
        projectName === 'tofu-cli'
            ? cliPackageJson.version
            : await getActualVersion(projectName)

    const spinner = ora(`正在检查 ${projectName} 版本，请稍候...`)
    spinner.start()

    return new Promise((resolve, reject) => {
        if (!semver.satisfies(process.version, cliPackageJson.engines.node)) {
            spinner.stop()
            log(`    你必须升级Node版本至 >=${cliPackageJson.engines.node}.x 才能使用tofu-cli`, 'red')
            reject()
        }

        http.get(`http://registry.npm.taobao.org/${projectName}`, res => {
            if (res.statusCode !== 200) log('获取版本信息失败', 'red')

            let data = ''
            res.on('data', chunk => {
                data += chunk
            })
            res.on('end', () => {
                spinner.stop()

                const latestVersion = JSON.parse(data)['dist-tags'].latest

                let rst
                if (semver.gtr(localVersion, latestVersion)) {
                    log()
                    logBoundary('yellow')
                    log()
                    log(`  ${projectName} 有更新`, 'yellow')
                    log()
                    logLine([
                        { message: '  latest:    '},
                        { message: latestVersion, color: 'green' }
                    ])
                    logLine([
                        { message: '  installed: ' },
                        { message: localVersion, color: 'red' }
                    ])
                    log()
                    log(`  你可以在结束后输入 'tofu update' 来更新 ${projectName}`, 'white')
                    log()
                    logBoundary('yellow')
                    log()
                }

                resolve(rst)
            })
        }).on('error', err => {
            log(`获取 ${projectName} 版本信息失败`, 'red')
            console.error(err)
        })
    })
})
