
const path = require('path')
// 合并两个配置对象   npm i webpack-merge -D
const {merge} = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const baseConfig = require('./webpack.base.js')


module.exports = merge(baseConfig, {
    // 设置开发模式
    mode: 'development',
    // eval 形成执行代码，dataUrl的形式引入sourcemap  cheap 定位到行  module 定位模块位置
    devtool: "eval-cheap-module-source-map", // 源码调试模式-定位行，

    // 设置本地开发服务器，可以启动热更新（有文件修改时本地会自动刷新）
    // npm i webpack-dev-server  -D
    devServer: {
        port: 3000, // 服务端口号
        compress: false, // gzip不压缩,开发环境不开启，加快热跟新速度
        hot: true,// 开启热更新功能
        historyApiFallback: true, //解决histort 404文件，碰到404错误时，会加载index.html文件
        static: {
            directory: path.resolve(__dirname, '../public') // 压缩并托管静态文件
        },
        proxy: {
            '/api': {
                // target: 'https://react-nodejs-chatgpt-tutorial.vercel.app',
                target: 'http://localhost:8000',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            },
        }
    },

    plugins:[
        new ReactRefreshWebpackPlugin()
    ]
}) 