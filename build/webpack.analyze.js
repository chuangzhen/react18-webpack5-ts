const prodConfig = require('./webpack.prod.js')

const { merge } = require('webpack-merge')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasureWebpackPlugin() //实例化分析插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// smp.wrap(config) 函数包裹待分析配置对象
module.exports = smp.wrap(merge(prodConfig, {

    plugins:[

        new BundleAnalyzerPlugin() // 配置分析打包结果插件
    ]
}))