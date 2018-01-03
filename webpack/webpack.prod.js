const path = require('path')
const { resolveCwd, isPlainObject } = require('./lib/utils')

const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = require('./config').build
let baseWebpackConfig = require('./webpack.base')(config)

function getAssetsPath(_path) {
    return path.posix.join(config.assetsSubDirectory, _path)
}

const tofurc = require('../lib/get-config')()

let chunks = ['vendor','tofu']
if (tofurc && tofurc.webpack && isPlainObject(tofurc.webpack)) {
    baseWebpackConfig = merge(baseWebpackConfig, tofurc.webpack)
}

if(tofurc && tofurc.entries){
    for(let item in tofurc.entries){
        if(item != 'app'){
            chunks.push(item);
        }
    }
}

chunks.push('manifest');

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
        new UglifyJsPlugin({
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: getAssetsPath('css/[name].[contenthash].css')
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            title: require(resolveCwd('config')).title,
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
            names: chunks,
            minChunks:2
        }),
        new CopyWebpackPlugin([{
            from: resolveCwd('static'),
            to: config.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})
module.exports = webpackConfig;
