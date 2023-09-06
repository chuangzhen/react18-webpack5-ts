// webpack.base.js

const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    // 配置入口文件
    entry: path.join(__dirname, '../src/index.tsx'),

    // 配置打包后的文件输出路径
    output: {
        filename: 'static/js/[name].js', // 输出的js文件的地址
        path: path.join(__dirname, '../dist'), // 打包结果输出路径
        clean: true, // 每次构建都会清理dist 目录，webpack4需要配置clean-webpack-plugin
        publicPath: '/'  //打包后文件的公共前缀

    },

    // 配置loader 对模块的源代（文件）码进行转换
    module: {
        rules: [
            // 配置loader解析ts和jsx
            // npm i @babel/preset-react @babel/preset-typescript babel-loader @babel/core -D
            // @babel/preset-typescript  将ts转换成js  ， @babel/preset-react 识别jsx语法， 搭配核心包 babel-loader @babel/core
            {
                test: /.(ts|tsx)$/,
                use: ['thread-loader', 'babel-loader']
            },


            // 解析css less
            {
                test: /.(css|less)$/,
                include: [path.resolve(__dirname, '../src')],
                use: [
                    // 生产环境才抽离css
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 自动增加css3 前缀
                    'postcss-loader',
                    'less-loader'
                ]
            },

            // 解析图片文件类型
            {
                test: /.(jpg|png|jpeg|gif|svg)$/,
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb以内的文件用 base64的形式注入代码，超过复制到资源包内
                    }
                },
                generator: {
                    filename: 'static/images/[name][ext]' // 指定超过大小的图片被输出的目录和文件名
                }
            },
            // 处理字体文件
            {
                test: /.(woff2?|eot|ttf|otf)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: 'static/fonts/[name][ext]'
                }
            },
            // 处理媒体文件
            {
                test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: 'static/media/[name][ext]'
                }
            },
        ]
    },

    // 配置resolve 模块解析
    resolve: {
        // 模块在import require 引入文件时，可以省略后缀，webpack会从头开始依次解析extensions数组配置的文件后缀类型，匹配上则跳过后续
        // 也不要配太多类型，查找匹配文件类型也要费时间内存
        extensions: ['.js', '.ts', '.tsx'],

        // 配置路径别名  ,让模块引入变得简单
        alias: {
            '@': path.resolve(__dirname, '../src')
        },

        // 限制webpack查找第三方模块的范围，使用pnpm不要设置这个，有幽灵依赖问题
        modules: [path.resolve(__dirname, '../node_modules')]
    },

    // 配置插件，webpack 在构建的不同声明周期的钩子函数中会执行不同的插件
    plugins: [
        // npm i html-webpack-plugin -D 将webpack构建后的资源注入到该插件生成的html文件中
        new HtmlWebpackPlugin({
            // 复制template路径下的文件作为模板
            template: path.resolve(__dirname, '../public/index.html'),
            // 将script 注入到body中，自动注入静态资源
            inject: true
        }),

        // 要转成json字符粗,再注入环境变量到全局环境变量process.env.xxx里,
        new webpack.DefinePlugin({
            "process.env.NODE_EVN": JSON.stringify(process.env.NODE_ENV),
            "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV)
        })


    ],
    // 开启缓存策略
    cache: {
        type: 'filesystem',
        buildDependencies: {
            // This makes all dependencies of this file - build dependencies
            config: [__filename],
            // 默认情况下 webpack 与 loader 是构建依赖。来获取最新配置以及所有依赖项
        },
    }

}