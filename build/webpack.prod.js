const path = require('path')

const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const globAll = require('glob-all')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const baseConfig = require('./webpack.base.js')



// 配置生成环境构建配置
module.exports = merge(baseConfig, {
    mode: 'production', // 会自动开启tree-shaking 和代码压缩以及其他优化

    plugins: [
        // 复制public的静态资源
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

        // 抽离css
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css'  // 指定生产环境抽离的css的路径
        }),

        // 清理净化未使用到的css
        new PurgeCSSPlugin({
            safelist: {
                standard: [/^ant-/, /^safe-/],// 白名单列表，跳过以ant- safe-开头的类名和id
            },
            // 通过globAll.sync（arr） 通过查找arr数组内元素指定的路径文件
            paths: globAll.sync([
                `${path.resolve(__dirname, '../src')}/**/*.tsx`,
                `${path.resolve(__dirname, '../src')}/**/*.jsx`,
                `${path.resolve(__dirname, '../public')}/index.html`,
            ])
        }),

        // 生成gzip
        new CompressionWebpackPlugin({
            test: /.(js|css)$/, // 只生成css,js压缩文件
            filename: '[path][base].gz', // 文件命名
            algorithm: 'gzip', // 压缩格式,默认是gzip
            test: /.(js|css)$/, // 只生成css,js压缩文件
            threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
            minRatio: 0.8 // 压缩率,默认值是 0.8
        })

    ],
    // 优化项
    optimization: {
        // 压缩
        minimizer: [
            new CssMinimizerWebpackPlugin(), // 压缩css

            new TerserWebpackPlugin({ // js压缩
                parallel: true, // 开启多线程
                terserOptions: {
                    compress: {
                        pure_funcs: ["console.log"] // 压缩时，过滤删除该函数
                    }
                }
            })
        ],

        // 分割代码
        splitChunks: {
            cacheGroups: {// 区分不同的缓存组
                venders: {
                    test: /node_modules/, // 匹配node_modules目录的文件
                    name: 'venders',  // 分割后的chunk包命名，chunkhash会自动加上
                    minChunks: 1, // 拆分前必须共享模块的最新chunks数
                    chunks: 'initial', // 只提取初始化时能获取到的，不管异步
                    minSize: 0, // 代码提交大于0便提取出来
                    priority: 1, // 提取优先级，模块会被提取到优先级高的chunks组种，默认-20
                },
                commons: {
                    name: 'commons',
                    minChunks: 2, // 有被2个地方共享使用到就提取出来
                    chunks: 'initial', // 提取初始化能获取的模块，忽略异步
                    minSize: 0, //代码超过0bytes就提取
                }
            }
        }

    }
})