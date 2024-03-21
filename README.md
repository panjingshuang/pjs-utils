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

