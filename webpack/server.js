require('./lib/check-versions')()

const ora = require('ora')
const Koa = require('koa')
const app = new Koa()

const merge = require('webpack-merge')
const staticMiddleware = require('koa-static')
const webpackMiddleware = require('koa-webpack')
const proxyMiddleware = require('koa-proxies')
const historyFallback = require('koa2-history-api-fallback')

const { resolveCwd, isPlainObject } = require('./lib/utils')

const tofurc = require('../lib/get-config')()
let webpackConfig = require('./webpack.dev')
if (tofurc && tofurc.webpack && isPlainObject(tofurc.webpack)) {
    webpackConfig = merge(webpackConfig, tofurc.webpack)
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
        app.use(proxyMiddleware(path, proxyTable[path]))
    })
}

module.exports = (port) => {
    const spinner = new ora('等待 webpack 打包完成...')
    spinner.start()

    port = port || (tofurc && tofurc.port) || 8080
    const host = (tofurc && tofurc.href) || 'localhost'
    const url = `http://${host}:${port}`

    app.listen(port)

    webpackMiddlewareInstance.dev.waitUntilValid(() => {
        spinner.stop()
        require('opn')(url)
    })
}
