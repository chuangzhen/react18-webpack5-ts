## 创建 基于 react18-webpack5-ts的项目模板
### 1. 初始化配置&创建目录结构
*   npm init -y
*   创建readme.md 文件
*   按以下项目模板创建目录结构和对应的文件
```bash
├── build
|   ├── webpack.base.js # 公共配置
|   ├── webpack.dev.js  # 开发环境配置
|   └── webpack.prod.js # 打包环境配置
├── public
│   └── index.html # html模板
├── src
|   ├── App.tsx 
│   └── index.tsx # react应用入口页面
├── tsconfig.json  # ts配置
└── package.json
```
*   安装webpack 和 react 相关依赖及 类型依赖
```javascript
// react相关包需要在生产环境使用，-S
npm i  react react-dom -S
// webpack typescript 等工具包，只需要在开发环境使用 -D 
npm i webpack webpack-cli @types/webpack @types/react @types/react-dom  typescript  -D

```
*   添加public/index.html的内容
```html
<!-- vscode 在.html文件内输入 html 选择弹出的html:5选项，自动生成html模板，添加id为root的根容器div -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>react18-webpack5-ts-template</title>
</head>
<body>
    <!-- 根容器的节点id -->
    <div id="root"></div>
</body>
</html>
```

*   添加tsconfig.json 配置
```json
{
    "compilerOptions":{
        "target": "ESNext",
        "lib": [  // 用于指定包含在编译中的库文件
            "DOM",
            "DOM.Iterable",
            "ESNext"
        ],
        "allowJs": false, // 是否允许编译js文件
        // "checkJs": true,   // 是否检查和报告js文件的错误，必须指定allowJs开启才行
        // "declaration": true,  // 编译ts文件时是否生成 .d.ts 类型声明文件，不可与allowJs同时为true
        "sourceMap": true,  // 是否生成.map为文件
        "isolatedModules": true, // 每个文件都编译成单独的文件，不可以与decoration一起使用
        "noEmit": true,   // 不生成编译文件
        "removeComments": true, // 指定编译后是否把注释删掉
        "module": "ESNext",  // 指定要使用的模块标准  有commonjs exnext  es6 ...
        "strict": true, // 开启所有的类型检查
        "skipLibCheck": false,
        "esModuleInterop": false,  //  开启的时候用于解决 esm 有default到处属性，而 cjs umd等模块语法没有default的报错
        "allowSyntheticDefaultImports": true, //指定允许从没有默认导出的模块中默认导入
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "Node",  // 模块查找策略，有classic  node ， bounder ，
        "resolveJsonModule": true,  //  是否解析json模块
        "jsx": "react", // react18这里也可以改成react-jsx
    },
    "include":["./src"]   // 指定要编译的文件路径
}

```
*   添加src/App.tsx 首页内容(随意)

*   添加src/index.tsx 根容器内容

```javascript
import React from "react";
import { creatRoot } from 'react-dom/client'

import App from './App'

const root = document.getElementById('root')
if (root) {
    // 开启批处理机制
    creatRoot(root).render(<App />)
}

```

### 2.配置webpack 基础 react + ts环境

##### 2.1 配置基础的公共的webpack.base.js
```javascript
// webpack.base.js
// npm i @babel/preset-react @babel/preset-typescript babel-loader @babel/core -D
// npm i html-webpack-plugin -D

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
        extension: ['.ts', '.tsx', 'js', '.jsx'],

        // 配置路径别名  ,让模块引入变得简单
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
    },

    // 配置插件，webpack 在构建的不同声明周期的钩子函数中会执行不同的插件
    plugins: [
        // 将webpack构建后的资源注入到该插件生成的html文件中
        new HtmlWebpackPlugin({
            // 复制template路径下的文件作为模板
            template: path.resolve(__dirname,'../public/index.html'),
            // 将script 注入到body中，自动注入静态资源
            inject:true
        })

    ]

}

```


##### 2.2 配置基础的开发环境的webpack.dev.js
```javascript
// npm i webpack-dev-server npm i webpack-dev-server  -D  -D


const path = require('path')
// 合并两个配置对象   npm i webpack-merge -D
const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base.js')


module.exports = merge(baseConfig, {
    // 设置开发模式
    mode: 'development',
    // eval 形成执行代码，dataUrl的形式引入sourcemap  cheap 定位到行  module 定位模块位置
    devtool: "eval-cheap-module-source-map", // 源码调试模式，

    // 设置本地开发服务器，可以启动热更新（有文件修改时本地会自动刷新）
    // npm i webpack-dev-server  -D
    devServer: {
        port: 3000, // 服务端口号
        comppress: false, // gzip不压缩,开发环境不开启，加快热跟新速度
        hot: true,// 开启热更新功能,本地服务会刷新页面--【webpack5 的模块热替换可以实现不用刷新，自动更新的效果】
        historyApiFallback: true, //解决histort 404文件，碰到404错误时，会加载index.html文件
        static: {
            directory: path.resolve(__dirname, '../public') // 压缩并托管静态文件
        }
    }
})

```

*   配置package.json 中的dev指令

```javascript 
// package.json

"scripts":{
    //...
    "dev": "webpack-dev-server -c build/webpack.dev.js"
}

// npm run dev就可以启动本地服务了
// 可以访问本地服务 http://localhost:3000/

```

##### 2.3 配置生产环境的webpack.prod.js
```javascript
// build/webpack.prod.js

const {merge} = require('webpack-merge')

const baseConfig = require('./webpack.base.js')

// 配置生成环境构建配置
module.exports = merge(baseConfig, {
    mode: 'production', // 会自动开启tree-shaking 和代码压缩以及其他优化
})

```

*    配置package.json 中的build构建指令
```javascript
"scripts":{
    //...

    "build":"webpack -c build/webpack.prod.js"
}

// 执行 npm run build 会执行webpack/prod.js 的构建配置
// 生成目录
// dist                    
// ├── static
// |   ├── js
// |     ├── main.js
// ├── index.html

```

### 3.webpack常用基础功能配置

##### 3.1 配置环境变量

##### 3.2 处理css 和 less 或者scss 文件

##### 3.3 处理css3前缀

##### 3.4 babel预处理js兼容

##### 3.5 babel处理非标准语法，如装饰器

##### 3.6 复制public文件夹

##### 3.7 处理图片类型文件

##### 3.8 处理字体和媒体类型文件


### 4. 配置模块热替换


### 5. 优化 构建速度


### 6. 优化构建后的结果文件






