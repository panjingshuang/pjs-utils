// merge 属于浅复制 直接将newObj中的数据直接复制给obj
export const mergeByShallow = (obj, newObj) => {
  let a = JSON.stringify(newObj)
  let o = JSON.stringify(a)
  for(let key in newObj){
    obj[key] = newObj[key]
  }
}