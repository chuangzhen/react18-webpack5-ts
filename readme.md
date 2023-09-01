## 创建 基于 react18-webpack5-ts的项目模板
#### 1. 初始化配置&创建目录结构
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
        
    },
    "include":["./src"]
}

```