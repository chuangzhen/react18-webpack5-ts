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
``` javascript
// npm i cross-env -D  
// 搭配 webpack.DefinePlugin 将环境变量注入到代码中

// package.json   
"scripts":{
    "dev:dev":"cross-env NODE_ENV=development BASE_ENV=development webpack-dev-server -c build/webpack.dev.js ",
    "dev:test":"cross-env NODE_ENV=development BASE_ENV=test webpack-dev-server -c build/webpack.dev.js ",
    "dev:pre":"cross-env NODE_ENV=development BASE_ENV=pre webpack-dev-server -c build/webpack.dev.js ",
    "dev:prod":"cross-env NODE_ENV=development BASE_ENV=production webpack-dev-server -c build/webpack.dev.js ",

    "build:dev":"cross-env NODE_ENV=production BASE_ENV=development webpack -c build/webpack.prod.js ",
    "build:test":"cross-env NODE_ENV=production BASE_ENV=test webpack -c build/webpack.prod.js ",
    "build:pre":"cross-env NODE_ENV=production BASE_ENV=pre webpack -c build/webpack.prod.js ",
    "build:prod":"cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.prod.js "

    // NODE_ENV 区分是开发环境还是生产环境   BASE_ENV 区分是哪个环境的api及其他变量
}

```

```javascript
// webpack.base.js
// 要转成json字符粗,再注入环境变量到全局环境变量process.env.xxx里,
    new webpack.DefinePlugin({
        "process.env.NODE_EVN": JSON.stringify(process.env.NODE_ENV),
        "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV)
    })

    // 这样就可以在页面内里通过 process.env.NODE_ENV/BASE_ENV 访问到注入的环境变量的值了
```

##### 3.2 处理css 和 less 或者scss 文件
*   添加App.css App.less 文件,若干样式，在App.tsx 引入,
```javascript
// 出现如下报错等
ERROR in ./src/App.less 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders> .h3{
|     font-size: 30px;
|     font-weight: bold;
 @ ./src/App.tsx 3:0-20
 @ ./src/index.tsx 3:0-24 7:60-63
```
*   webpack 默认只识别js，识别不了css和less，需要对应的loader来解析css和less
*   npm i style-loader css-loader  less-loader less -D
```javascript
// webpack.base.js
module:{
    rules:[
        //...
        
        // 解析less css
        // 将less转换成css,再将css转换成style样式注入html中的style标签
        {
            test: /.(less|css)$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    'autoprefixe'
                                ],
                            ],
                        },
                    }
                },                
                'less-loader'
            ]
        },

    ]
}

```
*   同理需要使用scss，需要安装  sass sass-loader ，其他同less， 参考webpack [ https://webpack.docschina.org/loaders/sass-loader/ ]

##### 3.3 处理css3前缀
*   有些css3 语法需要兼容低版本浏览器，可以通过插件来自动给css3样式加上前缀
*   npm i postcss-loader  autoprefixer -D
*   具体实现参考 3.2， 执行npm run build:dev 打包构建后，就会将css less 等文件打包进man.js里
*   【后续会抽离和压缩css 待处理】

##### 3.4 babel预处理js兼容
*   有一些浏览器不兼容识别 一些最新的js标准语法或者非标准语法，则需要使用到babel来转换成低版本可识别的标准语法
*   npm i babel-loader @babel/core @babel/preset-env core-js -D
*   具体可以参考这个文章[babel 那些事 <https://juejin.cn/post/6992371845349507108> ]
    *   babel-loader 加载最新的js代码转换成es5
    *   @babel/core  babel编译的核心包
    *   @babel/preset-env  banebn编译的预设，可以转换最新的js语法
    *   core-js  使用低版本js语法模拟高版本的库
```javascript
            {
                test: /.(ts|tsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 预设执行的顺序从右往左，先解析ts再处理jsx,最后使用babel转换高版本的js语法成为低版本的es5语法
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                                    // "targets": {
                                    //  "chrome": 35,
                                    //  "ie": 9
                                    // },
                                    "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                                    "corejs": 3, // 配置使用core-js低版本
                                },
                            ],


                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },

```
*   为了避免webpack配置过大，可以把babel的配置移出到 babel.confog.js文件中
```javascript
// babel.config.js 
// 预设执行的顺序从右往左，先解析ts再处理jsx
module.exports = {
    presets: [

        [
            '@babel/preset-env',
            {
                // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                // "targets": {
                //  "chrome": 35,
                //  "ie": 9
                // },
                "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                "corejs": 3, // 配置使用core-js低版本
            },
        ],


        '@babel/preset-react',
        '@babel/preset-typescript'
    ]
}

```
*   修改webpack.base.js 中关于babel的配置
```javascript
{
    // ...
    module:{
        rules:[
            {
                test:/.(ts|tsx)/,
                use:'babel-loader'
            }
        
            // ...
        ]

    }
}

```

##### 3.5 babel处理非标准语法，如装饰器
*   创建 src/components/Class.tsx 组件，并在App.tsx引入使用
*   关于装饰器的知识点，详情可参考[<https://blog.csdn.net/z_e_n_g/article/details/131099112>]

```javascript
// src/components/Class.tsx
import React, { PureComponent } from "react";


// 类装饰器  接受参数-类本身
function addAge(Target: Function) {
    // 为类Class 添加属性age和对应的值
    Target.prototype.age = 18
}

// 使用类装饰器
@addAge
class Class extends PureComponent {
    age?: number

    render() {

        return <div>
            <h4>这是类组件--age=={ this.age }</h4>
        </div>
    }
}

export default Class
```

*   要支持装饰器，需要配置ts装饰器支持
``` javascript 
// tsconfig.json
{
    "compilerOptions":{
        // 开启装饰器支持使用
        "experimentalDecorators":true
    }
}

```

*   装饰器语法事非标准语法，需要babel支持转换
```javascript 
// 有报错ERROR in ./src/components/Class.tsx
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: D:\study\demo\react18-webpack5-ts-template\src\components\Class.tsx: Support for the experimental syntax 'decorators' isn't currently enabled (11:1):
   9 |
  10 | // 使用类装饰器
> 11 | @addAge
     | ^
  12 | class Class extends PureComponent {
  13 |     age?: number
  14 |

Add @babel/plugin-proposal-decorators (https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-decorators) to the 'plugins' section of your Babel 
config to enable transformation.

```

*   npm i @babel/plugin-proposal-decorators -D
*   并且配置babel.config.js
```javascript
module.exports = {
    //...

    "plugins":[
       ['@babel/plugin-proposal-decorators',{'legacy':true}]
    ]
}

```
*   到这就可以使用装饰器了
  
##### 3.6 复制public文件夹
*   本地开发时，public文件夹内的静态资源文件通过devServer托管了，打包生产环境时，就需要把public中需要的文件复制一份到dist内,就不需要webpack静心解析。
*   npm i copy-webpack-plugin -D
*   添加 public/favicon.ico图标

```javascript
// webpack.prod.js
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    filter: (path) => {
                        // 过滤掉index.html , 在webpack.base.js 中已经被引用过了
                        return !path.includes('.html')
                    }
                }
            ]
        })
    ]
}

```
*   执行 npm run build:dev 后，会将public中的favicon.ico 文件复制到dist目录下

```html

<!-- 在index.html 中 使用绝对路径引入favicon.ico -->
<head>
     <!-- 绝对路径引入图标文件 -->
  <link data-n-head="ssr" rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
```

#### 3.7 处理 alias 路径引用别名配置
*   配置webpack 中的  resolve.alias对象

```javascript
    // webpack.base.js
    module.exports = {
        resolve:{
            alias:{
                // 引用文件时，@会指向 src目录下的路径
                "@":path.resolve(__dirname,'../src')
            }
        }
    }
```
*   同时需要配置tsconfig.json
```json
// tsconfig.json

{
    "compilerOptions":{
        "baseUrl": ".",  //用于设置解析非相对模块名称的基本目录
        "paths": { //用于设置模块名到基于 baseUrl 的路径映射,与baseUrl搭配，基于baseUrl
            "@/*": [
                "src/*"
            ]
        }
    }
}
```
*   这样就可以通过 @/xxx  来访问src下的文件了

##### 3.8 处理图片类型文件
*   webpack 5 内置插件 使用，asset-module 来处理图片，字体，媒体文件等其他类型的文件，webpack 4 需借助 file-loader url-loader 等
*   参考 asset-module \[<https://webpack.docschina.org/guides/asset-modules/>]
*   创建 src/assets/images 目录并存放几张大小不一的图片，并在App.tsx  App.css中引用
*   当出现引用图片  找不到模块“./assets/imgs/zhitiao.jpg ”或其相应的类型声明,需要创建 images.d.ts 类型声明文件，具体参考代码【我没碰到】

```javascript
// webpack.base.js
module.exports = {
    module:{
        rules:[
            //...
            // 解析图片文件类型
            {
                test: /.(jpg|png|jpeg|gif|svg)$/,
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondiction: {
                        maxSize: 8 * 1024 // 8kb以内的文件用 base64的形式注入代码，超过复制到资源包内
                    }
                },
                generator:{
                    filename:'static/imgs/[name][ext]' // 指定超过大小的图片被输出的目录和文件名
                }
            }
        ]
    }
}

```

*   本地结果： 可以看到 小的图片时base64格式引入，大的时绝对路径引入
*   构建结果： 超过限制的图片被输出到dist.static.iamges 下，小的生产base64注入js中


##### 3.9 处理字体和媒体类型文件
*   同3.8 处理图片资源
```javascript
// webpack.base.js
module.exports = {
    module:{
        rules:[
            //...
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
    }
}

```


### 4. 配置模块热更新
##### 4.1 前边配置了webpack-dev-server 通过开始devServer.hot 开启了模块热替换
*   webpack5 内置了热替换功能，webpack4 还需要搭配HotModuleReplacementPlugin 使用
*   但是这只是针对css less 等注入到代码中的样式的变更不需要刷新，修改App.tsx 时，本地页面还是会刷新
#### 4.2 处理在不刷新页面的情况下，更新react组件并保留组件状态
*   npm i @pmmmwh/react-refresh-webpack-plugin react-refresh -D
*   @pmmmwh/react-refresh-webpack-plugin 依赖react-refresh ，所有一并安装
*   配置react 热更新插件，并修改webpack.dev.js
```javascript
// webpack.dev.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    plugins:[
        new ReactRefreshWebpackPlugin()
    ]
}

```
*   为babel 配置react-refresh属性插件，修改babel.config.js
```javascript
// babel.config.js
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    "plugins":[
        isDev &&require.resolve('react-refresh/babel') //  开发模式才启动react热更新插件
    ].filter(Boolean) // 过滤空值
}
```

*   修改 App.tsx 增加count 状态 和修改状态的按钮，测试修改App.tsx时，页面是否刷新，是否保持react组件状态

```javascript
// src/App.tsx
// ...

const App = () => {
    const [count, AddCount] = useState<number>(0)

    return <div>
        <h2 className="h2">webpack5-react-ts</h2>
        <h3 className="h3">count--+{count}</h3>
        <button onClick={() => AddCount(count => count + 1)}>add count</button>
        {/* ... */}
    </div>
}

```
*   至此可以无感知更新开发环境

### 5. 优化 构建速度

#### 5.1 耗时分析
*   npm i speed-measure-webpack-plugin -D
*   新增配置 webpack.analyze.js 
*   开启耗时插件,只分析生产环境的配置结果
```javascript

const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasureWebpackPlugin()
const {merge} = require('webpack-merge')
const prodConfig  = require('./webpack.prod.js')

// smp.wrap()函数包裹需要被分析的webpack 配置对象
module.exports =smp.wrap(merge(prodConfig,{

    plugins:[
        new SpeedMeasureWebpackPlugin()
    ]
}))
```

*   修改package.json 的scripts 添加 分析脚本指令
```json
{
    "scripts":{
        "analyze":"cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.analyze.js"
    }
}
```
*   执行  npm run analyze 
``` bash
结果：
 SMP  ⏱
General output time took 3.35 secs

 SMP  ⏱  Plugins
HtmlWebpackPlugin took 0.125 secs
CopyPlugin took 0.023 secs
DefinePlugin took 0.003 secs

 SMP  ⏱  Loaders
babel-loader took 0.826 secs
  module count = 3
modules with no loaders took 0.706 secs
  module count = 176
css-loader, and
postcss-loader, and
less-loader took 0.695 secs
  module count = 2
html-webpack-plugin took 0.011 secs
  module count = 1
style-loader, and
css-loader, and
postcss-loader, and
less-loader took 0.01 secs
  module count = 2
```

#### 5.2 持久化缓存
*   webpack 4 有babel-loader cache-loader 等其他的缓存策略，但是webpack5内置了缓存策略
*   开启 cache.type = 'filesystem' 即可开启webpack5缓存策略，更具体策略参考
    *   \[<https://webpack.docschina.org/configuration/cache/>]
    *   \[<https://segmentfault.com/a/1190000041726881?sort=votes>]

```javascript
// webpack.base.js
module.exports = {

    cache:{
        type:'filesystem',
        buildDependencies: {
        // This makes all dependencies of this file - build dependencies
        config: [__filename],
        // 默认情况下 webpack 与 loader 是构建依赖。来获取最新配置以及所有依赖项
        },
    }
}

```
```bash
结果： 开启后速度快90%
开启前： General output time took 4.53 secs
开启后： General output time took 0.449 secs
```


#### 5.3 多线程解析loader
*   npm i thread-loader -D
*   开启多线程也需要时间消化性能，所有多线程适用于较大型项目
*   thread-loader 不支持 mini-css-extract-plugin ，所有也不支持css多线程解析
*   在需要开启多线程解析的loader配置对象中，需要将thread-loader放置在其他loader之前，其他loader会被放置到一个独立的worker池中运行
```javascript
// webpack.base.js

module.exports = {
    // ...
    module:{
        rules:[

            {
                test:/.(ts|tsx)$/,
                // babel-loader比较费事，开启多线程解析
                use:['thread-loader','babel-loader']
            }
        ]
    }
}


```

#### 5.4 缩小loader作用范围
*   通过 include exclude 来限制loader的作用范围
    *   include : [path] 只接解析该选项内的路径的文件
    *   exclude : [path] 不解析选项内的路径，优先级更高
*   给css less 限制include只解析src内的，抽离postcss-loader的配置项到 postcss.config.js内
*   还可以将css 和less的loader配置拆分，更精准解析不同的样式文件
```javascript
// webpack.base.js

module.exports = {
    module:{
        rules:[
             {
                test: /.(css|less)$/,
                include:[path.resolve(__dirname,'../src')],
                use: [
                    'style-loader',
                    'css-loader',
                    // 自动增加css3 前缀
                    'postcss-loader',
                    'less-loader'
                ]
            },
        ]
    }
}

```

#### 5.5 缩小模块搜索范围
*    resolve.modules 告诉webpack ，解析模块（require/import 引用）时，该去指定的目录下查找，不要超出指定范围，避免出现本地当前项目没有安装模块，父级目录安装没报错，发布到线上后找不到模块出错的问题。
*    详情查找：\[<https://webpack.docschina.org/configuration/resolve/#resolvemodules>]
```javascript
// webpack.base.js

module.exports = {
    // 使用pnpm不要设置这个，有幽灵依赖问题
    resolve:{
        modules:[path.resolve(__dirname,'../node_modules')]
    }
}

```

#### 5.6 devtool配置
*   **本地开发中**，当出现错误的时候，会定位错误在devServer编译后的代码上，而不是源代码
*   source-map 映射编译后代码和源码关系，有助于明确的错误定位，webpack5通过devtool属性开启source-map 功能
*   生产环境不建议使用source-map，暴露源码，也增加文件内存
*   devtool的命名规则是： **^(inline-|hidden-|eval-)?(nosources-)?(cheap-?(module-))source-map$**

| 关键字 | 描述                                     |
| ------ | ---------------------------------------- |
| inline | 代码内通过dataUrl引入SourceMap           |
| hidden | 生成SourceMap ,但不使用                  |
| eval   | 以eval执行，通过dataUrl形式引入SourceMap |
| cheap  | 只定位到行，不定位到列                   |
| module | 展示源码中的错误位置                     |

*   开发环境source-map 配置建议是 **eval-cheap-module-source-map**
*   参考\[<http://www.noobyard.com/article/p-ggbfqdrx-dw.html>]


### 6. 优化构建后的结果文件

#### 6.1 webpack包分析工具
*   npm i webpack-bundle-analyzer -D
*   修改webpack.analyze.js
```javascript
// webpack.analyze.js

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// smp.wrap(config) 函数包裹待分析配置对象
module.exports = smp.wrap(merge(prodConfig, {

    plugins:[

        new BundleAnalyzerPlugin() // 配置分析打包结果插件
    ]
})) 

// 运行  npm run analyze 后， 跳转 http://127.0.0.1:8888/可以看到构建后的各个包大小和关系
```
#### 6.2 抽离css
*   npm i mini-css-extract-plugin -D
*   基于webpack5，可以为每个包含css的js，创建一个抽离的css文件，支持css和source-map 的按需加载，与css-loader搭配使用
*   修改 webpack.base.js 中的css相关的loader
```javascript
//webpack.base.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV ==='development'
module.exports = {
    //...

    module:{
        rules:[
            {
                test: /.(css|less)$/,
                include: [path.resolve(__dirname, '../src')],
                use: [
                    // 开发环境不需要抽离css
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 自动增加css3 前缀
                    'postcss-loader',
                    'less-loader'
                ]
            },
        ]
    }
}
```
*   修改 webpack.prod.js 实例化 mini-css-extract-plugin 插件，设置css要抽离输出的路径
``` javascript
// webpack.prod.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    plugins:[
        //...

        new MiniCssExtractPlugin({
            filename:'static/css/[name].css'
        })
    ]
}

// 执行 npm run build:dev
// dist/static 出现css目录以及main.css文件
// 但是css文件没有压缩
```

#### 6.3 压缩css
*   npm i css-minimizer-webpacl-plugin
*   通过optimization.minimizer 实例化压缩css插件
*   修改 webpack.prod.js
```javascript
// webpack.prod.js
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
    //...
     optimization:{
        minimizer:[
            new CssMinimizerWebpackPlugin() // 压缩css
        ]
    }
}
// dist/static/main.css 被压缩了，
// 但是 dist/static/js/main.js 压缩效果失效

```

#### 6.4 压缩js
#### 6.5 合理配置打包文件hash
#### 6.6 分割第三方包和公共模块
#### 6.7 tree-shaking 清理未引用js
#### 6.8 tree-shaking 清理未引用css
#### 6.9 资源懒加载
#### 6.10 资源预加载
#### 6.11 打包生成gzip压缩文件






