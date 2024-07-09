import { mergeByShallow } from '../index.js'


test('merge function',()=>{
  export(mergeByShallow([obj = {
    age: 10,
    name:'zhangsan',
    list: [{name:2}]
  },{name:'护理',list:[{name:'zhangsan'}]}))
})