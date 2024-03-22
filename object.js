// merge 属于浅复制 直接将newObj中的数据直接复制给obj
export const mergeByShallow = (obj, newObj) => {
  let a = JSON.stringify(newObj)
  let o = JSON.stringify(a)
  for(let key in newObj){
    obj[key] = newObj[key]
  }
}

/**
 *
 * @method 设置dom元素Style
 * @param {*} dom 元素 必填
 * @param {*} params 参数key-value
 */
export function setDomStyles(dom,params){
  if(dom){
    for(let key of Object.keys(params)){
      dom.style[key] = params[key]
    }
  }else{
    console.log('setDomStyle cant find params dom!')
  }
}

/**
 *
 * @method 设置dom元素Attribute
 * @param {*} dom 元素 必填
 * @param {*} params 参数key-value
 */
export function setDomAttrubites(dom,params){
  if(dom){
    for(let key of Object.keys(params)){
      dom.setAttribute(key,params[key])
    }
  }else{
    console.log('setDomStyle cant find params dom!')
  }
}


