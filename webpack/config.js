const { resolveCwd } = require('./lib/utils')
// const config = require(resolveCwd('./config.js'));
const config = require(resolveCwd('./.tofurc.js'))

module.exports = {
    dev: {
        env: { NODE_ENV: '"development"' },
        port: config.port,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: config.proxy
    },
    build: {
        env: { NODE_ENV: '"production"' },
        index: resolveCwd('./dist/index.html'),
        assetsRoot: resolveCwd('./dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true
    }
}
