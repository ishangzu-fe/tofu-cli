const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const { resolveCwd } = require('./lib/utils')

const getAssetsPath = (_path, config) => {
    return resolveCwd(config.assetsSubDirectory, _path)
}
const resolveCur = function (...p) {
    return path.resolve(__dirname, ...p)
}

const getCssLoaders = (env, inVue) => {
    let styleLoader = inVue ? 'vue-style-loader' : 'style-loader'

    if (env === 'production') {
        return ExtractTextPlugin.extract({
            fallback: styleLoader,
            use: ['css-loader',{
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: path.posix.join(__dirname, 'postcss.config.js')
                    },
                    plugins: (loader) => [
                        require('autoprefixer')()
                    ]
                }
            }, 'sass-loader']
        })
    } else {
        return [styleLoader, 'css-loader', {
            loader: 'postcss-loader',
            options: {
                config: {
                    path: path.posix.join(__dirname, 'postcss.config.js')
                },
                plugins: (loader) => [
                    require('autoprefixer')()
                ]
            }
        }, 'sass-loader']
    }
}

module.exports = function (config) {
    const env = JSON.parse(config.env.NODE_ENV)
    const tofurc = require('../lib/get-config')()
    let entries = {
        app:resolveCwd('src/main.js'),
        vendor:['vue','vue-router','vuex'],
        tofu:['i-tofu','tofu-http']
    }

    let eslintRules = require('./rules')
    if (tofurc) {
        if(tofurc.rules){ // enlint规则
            eslintRules = Object.assign({}, eslintRules, tofurc.rules)
        }

        if(tofurc.entries){
            entries = Object.assign({},entries,tofurc.entries);
        }
    }
    // 配置 ESLint 忽略的文件
    const eslintIgnore = []
    if (tofurc.eslint && tofurc.eslint.ignore) {
        tofurc.eslint.ignore.forEach(p => {
            eslintIgnore.push(path.join('src', p))
        })
    }

    return {
        entry:entries,
        output: {
            path: resolveCwd('dist'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: config.assetsPublicPath,
            // library: 'dataAnalysis',
            // libraryTarget: 'window'
        },
        resolveLoader: {
            modules: [resolveCur("../node_modules"), "node_modules"]
        },
        resolve: {
            modules: [resolveCur("../node_modules"), "node_modules"],
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.common.js'
            }
        },
        module: {
            rules: [
                {
                    test: /\.(vue|js(x)?)$/,
                    enforce: 'pre',
                    loader: 'eslint-loader',
                    include: [resolveCwd('src')],
                    options: {
                        ignorePattern: eslintIgnore,
                        formatter: require("eslint-friendly-formatter"),
                        useEslintrc: false,
                        parser: 'babel-eslint',
                        parserOptions: {
                            sourceType: 'module'
                        },
                        env: ['browser'],
                        plugins: [
                            'html'
                        ],
                        rules: eslintRules
                    }
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: getCssLoaders(env, true)
                        }
                    }
                },
                {
                    test: /\.(css|scss)$/,
                    use: getCssLoaders(env)
                },
                {
                    test: /\.js(x)?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.html$/,
                    exclude: [resolveCwd('template.html')],
                    loader: 'vue-html-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/font/[name].[hash:7].[ext]'
                    }
                }
            ]
        }
    }
}
