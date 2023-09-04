// webpack.base.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 预设执行的顺序从右往左，先解析ts再处理jsx
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },

        ]
    },

    // 配置resolve 模块解析
    resolve: {
        // 模块在import require 引入文件时，可以省略后缀，webpack会从头开始依次解析extensions数组配置的文件后缀类型，匹配上则跳过后续
        // 也不要配太多类型，查找匹配文件类型也要费时间内存
        extensions: ['.js','.ts', '.tsx'],

        // 配置路径别名  ,让模块引入变得简单
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
    },

    // 配置插件，webpack 在构建的不同声明周期的钩子函数中会执行不同的插件
    plugins: [
        // npm i html-webpack-plugin -D 将webpack构建后的资源注入到该插件生成的html文件中
        new HtmlWebpackPlugin({
            // 复制template路径下的文件作为模板
            template: path.resolve(__dirname,'../public/index.html'),
            // 将script 注入到body中，自动注入静态资源
            inject:true
        })

    ]

}