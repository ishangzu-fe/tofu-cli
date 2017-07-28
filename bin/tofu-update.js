const fs = require('fs-extra')
const path = require('path')
const { exec, spawn } = require('child_process')
const cwd = process.cwd()

const program = require('commander')
const inquirer = require('inquirer')
const ora = require('ora')
const semver = require('semver')
const klaw = require('klaw-sync')

const { log } = require('../lib/log')
const registerLogger = require('../lib/register-logger')
const merge = require('../lib/merge')
const pacote = require('pacote')
const getConfig = require('../lib/get-config')
const { resolveCwd } = require('../lib/utils')

program
    .option('-a, --all', '更新全部')
    .parse(process.argv)

if (program.all) {
    updateAll()
} else {
    updateFiles()
}

registerLogger('update', process)
process.on('exit', () => {
    fs.removeSync(resolveCwd('temp'))
})

async function updateAll () {
    updateFiles()
    await updateDeps('--save', 'i-tofu')
    await updateDeps('-g', 'tofu-cli')
}

async function updateFiles () {
    const spinner = ora('正在做更新前检查...').start()

    await checkGit()

    try {
        await pacote.extract(
            'pitaya',
            './temp',
            { registry: 'http://registry.npm.taobao.org' }
        )
    } catch (err) {
        console.error('下载模板出错，请重试')
        console.error(err)
    }

    // Load need update list
    let needUpdateFiles
    needUpdateFiles = loadList()
    if (!needUpdateFiles.length) {
        spinner.stop()
        console.info('没有需要更新的文件')
        return
    }

    spinner.stop()
    const { ignoreFiles } = await inquirer.prompt([
        {
            type: 'checkbox',
            message: '确认需要更新的文件（勾选取消更新）',
            name: 'ignoreFiles',
            choices: needUpdateFiles.map(file => {
                return { name: file }
            }),
            pageSize: 20
        }
    ]).catch(err => {
        console.err(err)
    })

    needUpdateFiles = reduceList(needUpdateFiles, ignoreFiles)
    let needDeleteFiles = []
    let fatalList = []
    needUpdateFiles = needUpdateFiles.reduce((rst, file) => {
        // 处理需要删除的文件
        if (/^\!/.test(file)) {
            needDeleteFiles.push(file)
            return rst
        }

        const target = resolveCwd(file)
        const src = resolveCwd('temp', file)

        try {
            fs.lstatSync(src).isFile()
                ? rst.push(file)
                : (rst = rst.concat(klaw(target).map(obj => {
                    return path.relative(cwd, obj.path).replace(/^temp\//, '')
                })))
        } catch (err) {
            fatalList.push(target)
        }

        return rst
    }, [])

    // traverse, merge and detect conflict
    spinner.start('正在更新文件...')
    let conflictFiles = []
    needUpdateFiles.forEach(file => {
        try {
            const src = resolveCwd('temp', file)
            const target = resolveCwd(file)
            const empty = resolveCwd('temp', 'any')
            fs.ensureFileSync(empty)
            const result = merge(target, empty, src)
            if (!result) conflictFiles.push(file)
        } catch (err) {
            fatalList.push(file)
        }
    })
    needDeleteFiles.forEach(file => {
        fs.removeSync(resolveCwd(file))
    })
    spinner.succeed('更新文件完成').stop()
    if (conflictFiles.length)
        log('\n以下文件有冲突，请手动修复：', 'red')
        conflictFiles.forEach(f => log(`  ${f}`, 'red'))

    if (fatalList.length)
        log('\n以下文件更新失败，请手动更新：', 'red')
        fatalList.forEach(f => log(`  ${f}`, 'red'))

    /**
     * Check working tree if is clear
     */
    function checkGit () {
        return new Promise((resolve, reject) => {
            const child = spawn('git', ['status'])

            child.stdout.on('data', data => {
                if (!~data.toString().indexOf('working tree clean')) {
                    throw new Error('请先提交尚未提交的修改')
                }
            })

            child.stderr.on('data', data => {
                console.error(data)
            })

            child.on('close', code => {
                resolve()
            })
        })
    }

    /**
     * Load needed files list.
     */
    function loadList () {
        let rst
        let tofurc

        try {
            tofurc = require(resolveCwd('temp/.tofurc.js'))
        } catch (err) {
            console.error('读取更新文件列表出错，请重试')
            console.error(err)
        }

        const config = getConfig()
        if (!config) return tofurc.updateList

        const newUpdateList = tofurc.updateList
        const oldUpdateList = config.updateList

        if (oldUpdateList && !Array.isArray(oldUpdateList))
            throw new Error('.tofurc 中的 ignore 选项必须是数组类型')

        if (tofurc && newUpdateList && Array.isArray(newUpdateList)) {
            if (tofurc._meta && config._meta) {
                if (tofurc._meta.type !== config._meta.type) return []

                const newVersion = semver.valid(tofurc._meta.version)
                const oldVersion = semver.valid(config._meta.version)
                if (!newVersion || !oldVersion) throw new Error('配置文件版本信息无效')

                if (semver.gt(newVersion, oldVersion)) {
                    if (semver.minor(newVersion) > semver.minor(oldVersion)
                        || semver.major(newVersion) > semver.major(oldVersion)
                    ) {
                        return newUpdateList
                    } else {
                        return oldUpdateList
                    }
                } else {
                    return []
                }
            } else {
                throw new Error('配置文件缺少 _meta')
            }
        } else {
            return []
        }
    }

    function reduceList (origin, ignore) {
        console.assert(Array.isArray(origin) && Array.isArray(ignore),
            'It must be array type'
        )

        return origin.reduce((pv, cv) => {
            if (!~ignore.indexOf(cv)) pv.push(cv)
            return pv
        }, [])
    }
}

function updateDeps (dep, option) {
    const spinner = ora(`正在更新 ${dep} ...`).start()
    return Promise((resolve, reject) => {
        const child = spawn(`npm install ${option} ${dep}`)

        child.stdout.on('data', data => {
            console.log(`stdout: ${data}`)
        })

        child.stderr.on('data', data => {
            console.error(data)
        })

        child.on('close', code => {
            spinner.succeed(`更新 ${dep} 成功`).stop()
            resolve()
        })
    })
}
