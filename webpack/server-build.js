require('./lib/check-versions')()

const Koa = require('koa')
const app = new Koa()

const staticMiddleware = require('koa-static')
const proxyMiddleware = require('koa-proxies')
const historyFallback = require('koa2-history-api-fallback')

const { resolveCwd } = require('./lib/utils')

const staticPath = resolveCwd('dist')
app.use(staticMiddleware(staticPath))
app.use(historyFallback())

const tofurc = require('../lib/get-config')()
if (tofurc && tofurc.proxy) {
    const proxyTable = tofurc.proxy
    Object.keys(proxyTable).forEach(path => {
        app.use(proxyMiddleware(path, proxyTable[path]))
    })
}

app.listen(3000)
require('opn')('http://localhost:3000')
console.log('正在监听 3000 端口')
