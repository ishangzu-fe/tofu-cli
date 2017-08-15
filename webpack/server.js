require('./lib/check-versions')()

const proc = require('child_process')
const ora = require('ora')
const Koa = require('koa')
const app = new Koa()

const merge = require('webpack-merge')
const staticMiddleware = require('koa-static')
const webpackMiddleware = require('koa-webpack')
const proxy = require('koa-proxies')
const historyFallback = require('koa2-history-api-fallback')

const { resolveCwd, isPlainObject } = require('./lib/utils')

const tofurc = require('../lib/get-config')()

module.exports = (port, peace) => {
    let webpackConfig = require('./webpack.dev')
    if (peace) {
        webpackConfig.module.rules.shift()
    }

    const config = require('./config').dev
    const webpack = require('webpack')
    const compiler = webpack(webpackConfig)

    const staticPath = resolveCwd(config.assetsPublicPath)
    app.use(staticMiddleware(staticPath))
    app.use(historyFallback())
    const webpackMiddlewareInstance = webpackMiddleware({
        compiler,
        hot: { log: false },
        dev: {
            quiet: true,
            publicPath: webpackConfig.output.publicPath
        }
    })
    app.use(webpackMiddlewareInstance)

    if (tofurc && tofurc.proxy) {
        const proxyTable = tofurc.proxy
        Object.keys(proxyTable).forEach(path => {
            app.use(proxy(path, proxyTable[path]))
        })
    }

    const spinner = new ora('等待 webpack 打包完成...')
    spinner.start()

    port = port || (tofurc && tofurc.port) || 8080
    const host = (tofurc && tofurc.href) || 'localhost'

    const server = app.listen(port)
    server.on('error', err => {
        if (err.code === 'EADDRINUSE') {
            port += 1
            app.listen(port)
        } else {
            throw err
        }
    })

    webpackMiddlewareInstance.dev.waitUntilValid(() => {
        spinner.stop()

        if (tofurc._meta.type === 'electron') {
            const child = proc.spawn(
                process.platform === 'win32' ? 'npm.cmd' : 'npm',
                ['run', 'dev'],
                { stdio: 'inherit' }
            )
            child.on('close', function (code) {
                process.exit(code)
            })
        } else {
            const url = `http://${host}:${port}`
            require('opn')(url)
        }
    })
}
