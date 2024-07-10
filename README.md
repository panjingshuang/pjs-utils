# pjs-utils
just to store my tools function make my code work more simple

- install
```javascript
npm install @panjingshuang/pjs-utils
```
- use
```javascript
  import { forEachCanReturn } from '@panjingshuang/pjs-utils'
  
  const array = [{
      id: 2
    }, {
      id: 4
    }, {
      id: 5
    }]
    const item = forEachCanReturn(array, (item) => {
      if (item.id > 3) return item
    })
    console.log(item)
```

- 选择构建工具的过程，为什么不适用webpack而是用rollup呢？
- 将文件输出成cjs格式的话 需要注意文件后缀名称需要变成.cjs来进行区分，否则的话在node环境中可能被认为是es格式

在构建过程中遇到的问题
1. 选择webpack 还是 rollup？
2. rollup对目录下的所有文件分别进行build操作？
3. rollup的基本使用和基础规则
4. eslint一直无法正常下载
5. eslint的使用
6. babel的使用是如何操作呢？
7. jest单元测试的使用

npm包的创建流程


在配置eslint的时候遇到的问题
1. No ESLint configuration found 
- 在项目根目录下添加一个.eslintrc.cjs文件
2. Cannot read config
-  文件名称应该是.eslintrc.cjs，但是之前写的是.js后缀导致出现这种问题

运行npm run test的时候，也就是执行jest的时候
1. You appear to be using a native ECMAScript module configuration file, which is only supported when running Babel asynchronously.
- 需要将将.babelrc.js文件换成.babelrc.cjs