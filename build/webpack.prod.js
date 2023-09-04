const {merge} = require('webpack-merge')

const baseConfig = require('./webpack.base.js')

// 配置生成环境构建配置
module.exports = merge(baseConfig, {
    mode: 'production', // 会自动开启tree-shaking 和代码压缩以及其他优化
})