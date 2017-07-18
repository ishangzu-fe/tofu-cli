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
            use: ['css-loader', 'sass-loader']
        })
    } else {
        let loaders = [styleLoader, 'css-loader', 'sass-loader']
        if (inVue) {
            return loaders.join('!')
        } else {
            return loaders
        }
    }
}

module.exports = function (config) {
    const env = JSON.parse(config.env.NODE_ENV)
    const tofurc = require('../lib/get-config')()
    let eslintRules = {
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'brace-style': ['error', '1tbs'],
        'keyword-spacing': ['error', {
            'after': true
        }],
        'eqeqeq': 2,
        'no-console': process.env.NODE_ENV === 'production'
            ? 1 : 0,
        'no-debugger': process.env.NODE_ENV ===
            'production' ? 2 : 0
    }
    if (tofurc && tofurc.rules) {
        eslintRules = Object.assign({}, eslintRules, tofurc.rules)
    }

    return {
        entry: {
            app: resolveCwd('src/main.js'),
        },
        output: {
            path: resolveCwd('dist'),
            filename: '[name].js',
            publicPath: config.assetsPublicPath
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
                        ignorePattern: [],
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
                    loader: 'vue-html-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: getAssetsPath('img/[name].[hash:7].[ext]', config)
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: getAssetsPath('fonts/[name].[hash:7].[ext]', config)
                    }
                }
            ]
        }
    }
}