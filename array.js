// 实现一个forEach函数，但是遇到一个为true的数据 就可以直接return出去，并将对应的数据返回
const forEachCanReturn = (array,fn) =>{
  for(let item of array){
    if(fn(item)) {
      return fn(item)
    }
  }
}

export default {
  forEachCanReturn
}