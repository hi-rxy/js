'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const webpack = require('webpack')
const name = defaultSettings.title || 'vue Admin Template' // page title
const timestamp = new Date().getTime()
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */

    // 部署应用包时的基本 URL 设置为空字符串 ('') 或是相对路径 ('./')，所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。
    publicPath: '/',
    // 输出文件目录 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)
    outputDir: 'dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的目录 项目打包之后，静态资源会放在这个文件下
    assetsDir: 'static',
    // 是否开启eslint保存检测 值 true|false|'error'
    lintOnSave: false,//process.env.NODE_ENV === 'development',
    // 如果你不需要生产环境的 source map,可以将其设置为 false 以加速生产环境构建
    productionSourceMap: false,
    //
    //
    //   Webpack相关配置
    //
    //
    devServer: {
        port: port,
        // open: true,
        // overlay: {
        //   warnings: false,
        //   errors: true
        // },
        // before: require('./mock/mock-server.js')
        disableHostCheck: true,

        // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。这个问题可以通过vue.config.js中的devServer.proxy选项来配置。
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_BASE_TARGET_API,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
            // "/api": {
            //   target: process.env.VUE_APP_BASE_TARGET_API,
            //   changeOrigin: true,
            //   pathRewrite: {
            //     "^/api": "/api"
            //   }
            // },
            '/jwt': {
                target: process.env.VUE_APP_BASE_TARGET_API,
                changeOrigin: true,
                pathRewrite: {
                    '^/jwt': '/jwt'
                }
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src') // 将项目根目录中，src的路径配置为别名@
            }
        },
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `static/js/[name].${process.env.VUE_APP_VERSION}.${timestamp}.js`,
            chunkFilename: `static/js/[name].${process.env.VUE_APP_VERSION}.${timestamp}.js`
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             prependData: `@import "@/styles/common.scss";`
    //         }
    //     }
    // },

    // chainWebpack 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack(config) {
        // it can improve the speed of the first screen, it is recommended to turn on preload
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                // to ignore runtime.js
                // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial'
            }
        ])

        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial' // only package third parties that are initially dependent
                            },
                            elementUI: {
                                name: 'chunk-elementUI', // split elementUI into a single package
                                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                            },
                            commons: {
                                name: 'chunk-commons',
                                test: resolve('src/components'), // can customize your rules
                                minChunks: 3, //  minimum common number
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    })
                    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
