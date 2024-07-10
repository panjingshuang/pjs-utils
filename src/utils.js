// 获取真实的px
export function getRealPx(value){
  let dom = document.documentElement
  if(dom.style['font-size']){
    let fontSize  = parseInt(dom.style['font-size'])

    var clientWidth = Math.min(dom.clientWidth, 750); 
    if (!clientWidth) return;
    let realValue = (fontSize / 100)  * parseInt(value) 
    return realValue
  }else{
    console.log('getPxtoRem cant find html style font-size !')
  }
  return null
}

export function random(min, max) {
  return Math.round(Math.random() * max + min);
}