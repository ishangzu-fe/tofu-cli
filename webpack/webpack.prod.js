const path = require('path')
const cwd = process.cwd()

const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('./config').build
const baseWebpackConfig = require('./webpack.base')(config)

function getAssetsPath(_path) {
    return path.posix.join(config.assetsSubDirectory, _path)
}

const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.assetsRoot,
        filename: getAssetsPath('js/[name].[chunkhash].js'),
        chunkFilename: getAssetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.env
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: getAssetsPath('css/[name].css')
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: config.index,
            template: 'template.html',
            inject: true,
            minify: {
                removeComments: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks (module, count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(process.cwd(), 'node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(cwd, 'static'),
            to: config.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

module.exports = webpackConfig