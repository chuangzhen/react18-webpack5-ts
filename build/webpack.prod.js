const path = require('path')

const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

const baseConfig = require('./webpack.base.js')

// 配置生成环境构建配置
module.exports = merge(baseConfig, {
    mode: 'production', // 会自动开启tree-shaking 和代码压缩以及其他优化

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    filter: (path) => {
                        return !path.includes('.html')
                    }
                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename:'static/css/[name].css'  // 指定生产环境抽离的css的路径
        })
    ],

    optimization:{
        minimizer:[
            new CssMinimizerWebpackPlugin() // 压缩css
        ]
    }
})