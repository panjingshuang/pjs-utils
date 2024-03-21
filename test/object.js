import { mergeByShallow } from '../index.js'

function mergeByShallowTest() {
  const obj = {
    age: 10,
    name:'zhangsan',
    list: [{name:2}]
  }
  mergeByShallow(obj,{name:'护理',list:[{name:'zhangsan'}]})
  console.log(obj)
}

mergeByShallowTest()
