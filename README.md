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


