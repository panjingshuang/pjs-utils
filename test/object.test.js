import { mergeByShallow } from '../bin/index.js'


test('merge function',()=>{
  expect(mergeByShallow({
    age: 10,
    name:'zhangsan',
    list: [{name:2}]
  },{name:'护理',list:[{name:'zhangsan'}]}))
})