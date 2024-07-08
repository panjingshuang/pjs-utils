/**
 * @method 截图功能-截图容器获取对应的url地址,内容替换（不会将图片数据上传到服务器）
 * @param {canvas*,saveImgQuality,saveImgType,hiddenCompId,repalceId}
 */
export function canvasImgInLocal(params, onSuccess = (data) => { }) {
  if (!window.html2canvas) {
    console.log('function canvasImgInLocal need to introduce html2canvas.js!')
    return
  }
  let canvasDom = document.getElementById(params.canvasId)
  const el = canvasDom ? canvasDom : document.documentElement.body
  let hiddenCompIds = []
  if (params.hiddenCompIds) {
    hiddenCompIds = params.hiddenCompIds.split(',')
  }
  window.setTimeout(() => {
    window.html2canvas(el, {
      backgroundColor: params.saveImgBgColor || null,//设置图片背景为透明
      useCORS: true,
      async: true,
      logging: false,
      ignoreElements: (element) => {
        if (hiddenCompIds.length > 0 && element.id) {
          if (hiddenCompIds.indexOf(element.id) > -1) return true
        }
        return false
      }
    }).then((canvas) => {
      const canResultBase64 = getBase64ByType(canvas)
      const url = canResultBase64
      if (params.repalceId) {
        let repalceDom = document.getElementById(params.repalceId)
        if (repalceDom) {
          if (repalceDom instanceof HTMLImageElement) {
            repalceDom.src = url
          } else if (repalceDom instanceof HTMLCanvasElement) {
            let ctx = repalceDom.getContext('2d')
            ctx.drawImage(canvas, 0, 0)
          }
        } else {
          console.log('canvas repalce dom can not find!')
        }
      }
      onSuccess({ canvas, url })
    })
  }, params.timeOut || 0) // 延迟时间保证在元素绘制完成之后再执行操作
}

/**
 * @method canvas转换成Base64数据
 * @param {canvas*,saveImgQuality,saveImgType}
 * @return base64 图片数据
 */
export function getBase64ByType(canvas, saveImgType = 'png', saveImgQuality = 1) {
  if (saveImgType) {
    return canvas.toDataURL('image/' + saveImgType, Number(saveImgQuality))
  }
  return canvas.toDataURL()
}


/**
 * @method 九宫格抽奖动画
 * @param {*} params id lotteryList= [[,light],] ,itemWidth,itemHeight,ratio,thanksIndex,time,times
 * 
 */
export function onLotterty(params) {
  const indexMap = [0, 1, 2, 7, 8, 3, 6, 5, 4]
  var obj = {}
  let itemLists = [], sortLists = []
  let lotteryDom = null
  let lotteryDomLight = null
  let animateIndex = 0, intervalCb = null, animateAttenuationIndex = -1, timeoutCb = null
  // 初始化构建九宫格
  if (params.id) {
    let parentDom = document.getElementById(params.id)
    setDomStyles(parentDom, {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'flex-wrap': 'wrap',
    })
    if (parentDom) {
      if (parentDom.childNodes.length > 0) return
      for (let i = 0; i < 9; i++) {
        let dom = document.createElement('div')
        dom.setAttribute('lottery_index', indexMap[i])
        let width, height
        if (params.itemWidth) {
          width = getRealPx(params.itemWidth) + 'px'
          height = getRealPx(params.itemHeight) + 'px'
        } else {
          let offsetWidth = parseInt(parentDom.offsetWidth)
          let offsetHeight = parseInt(parentDom.offsetHeight)
          let ratio = params.ratio ? params.ratio : 0.99
          width = (offsetWidth / 3) * ratio + 'px'
          height = (offsetHeight / 3) * ratio + 'px'
        }
        setDomStyles(dom, {
          display: 'inline-block',
          position: 'relative',
          width: width,
          height: height,
          'flex-shrink': 1
        })
        // 这里冗余代码 可以节省下操作
        let light = document.createElement('img')
        let unlight = document.createElement('img')
        setDomStyles(light, {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'none',
          zIndex: 20
        })
        setDomStyles(unlight, {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        })

        if (params.lotteryList) {
          if (params.lotteryList[i]) {
            setDomAttrubites(light, {
              src: params.lotteryList[i][0],
              'lottery_status': 'light'
            })
            setDomAttrubites(unlight, {
              src: params.lotteryList[i][1],
              'lottery_status': 'unlight'
            })
          }
          dom.appendChild(light)
          dom.appendChild(unlight)
        } else {
          console.log('onLottery need params lotteryList!')
        }
        itemLists.push(dom)
        parentDom.appendChild(dom)
      }

    } else {
      console.log('onLottery params need id')
    }
  }
  params.time = !params.time || (params.time < 3) ? 3 : params.time
  params.times = !params.times || (params.times < 2) ? 2 : params.times

  if (itemLists.length) {
    let lists = itemLists.sort((a, b) => {
      let aIndex = parseInt(a.getAttribute('lottery_index'))
      let bIndex = parseInt(b.getAttribute('lottery_index'))
      return aIndex - bIndex
    })
    sortLists = [...lists]
    lotteryDom = sortLists.pop()
    lotteryDomLight = lotteryDom.childNodes[0]
    if (params.onclick) { // 判断是否已经绑定过了
      lotteryDomLight.addEventListener('click', emitClick)
    }
  }
  onReset()


  function emitClick(event) {
    event.preventDefault()
    event.stopPropagation()
    if (lotteryDom) {
      if (params.onclick) {
        setDomStyles(lotteryDomLight, { display: 'none' })
        let func = params.onclick
        func()
      }
    } else {
      console.log('emitClick cant find lottery dom!')
    }
  }


  function onStart(lotteryIndex, onSuccess = () => { }) {
    const len = sortLists.length
    const moveNum = len * params.times
    const milliseconds = parseInt(params.time * 1000 / moveNum)
    if(!params.isFirst){
      animateIndex = animateAttenuationIndex
    }else{
      animateIndex = 0
    }
    intervalCb = window.setInterval(() => {
      onDisplayDom(animateIndex % len)
      if (animateIndex >= moveNum) {
        window.clearInterval(intervalCb)
        animateAttenuationIndex = 0
        speedAttenuation(lotteryIndex, onSuccess)
      }
      animateIndex++
    }, milliseconds)
  }

  function onDisplayDom(index) {
    sortLists.forEach((item) => {
      let light = item.childNodes[0]
      setDomStyles(light, { display: 'none' })
    })
    if (index >= 0) {
      const displayDom = sortLists[index]
      setDomStyles(displayDom.childNodes[0], { display: 'block' })
    }
  }

  function speedAttenuation(lotteryIndex, onSuccess = () => { }) {
    if (lotteryIndex < 0) {
      lotteryIndex = params.thanksIndex
    }
    const len = sortLists.length
    const moveNum = len * (params.times - 2) + lotteryIndex
    onDisplayDom(animateIndex % len)
    if (moveNum == animateAttenuationIndex && moveNum == 0) {
      changeLotteryStatus()
      onSuccess()
    } else {
      const allTime = params.time * 1000
      //获取300到800的一个衰减数值
      const milliseconds = parseInt(params.time / 2 * 1000 / moveNum)
      const time = parseInt(easeOutCubic(animateAttenuationIndex * milliseconds, 300, 500, allTime))
      timeoutCb = window.setTimeout(() => {
        speedAttenuation(lotteryIndex, onSuccess)
        animateIndex++
        animateAttenuationIndex++
        if (animateAttenuationIndex >= moveNum) {
          onSuccess()
          changeLotteryStatus()
          window.clearTimeout(timeoutCb)
        }
      }, time)
    }
  }

  function changeLotteryStatus() {
    let style = {}
    if (params.LotteryTime >= 1) {
      style['display'] = 'block'
    } else {
      style['display'] = 'none'
    }
    setDomStyles(lotteryDomLight, style)
  }

  function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b
  }

  function onReset() {
    itemLists.forEach((item, index) => {
      let lotteryIndex = parseInt(item.getAttribute('lottery_index'))
      let light = item.childNodes[0]
      let unlight = item.childNodes[1]
      if (lotteryIndex == 8) { // 抽奖按钮
        if (params.LotteryTime >= 1) {
          setDomStyles(light, { 'display': 'block' })
        } else {
          setDomStyles(light, { 'display': 'none' })
        }
      } else {
        // 结束之后重置
        setDomStyles(light, { 'display': 'none' })
        setDomStyles(unlight, { 'display': 'block' })
      }
    })
  }

  function setLotteryTime(time) {
    params.LotteryTime = parseInt(time)
    changeLotteryStatus()
  }

  // function destroy() {
  //   // 销毁数据
  //   if (timeoutCb) window.clearTimeout(timeoutCb)
  //   if (intervalCb) window.clearInterval(intervalCb)
  //   itemLists = null
  //   sortLists = null
  //   lotteryDom = null
  //   animateIndex = 0
  //   animateAttenuationIndex = -1
  // }
  obj = {
    start: onStart,
    setLotteryTime: setLotteryTime,
  }
  return obj
}

/**
 * @method 扭蛋机抽奖动画
 * @param {*} params 
 */
export function TwistedEggMatter(params) {
  // 执行操作
  if (!params.id) {
    console.log('function TwistedEggMatter need params of id ')
    return null
  }
  if (!window.Matter) {
    console.log('function TwistedEggMatter need to introduce Matter.js!')
    return
  }
  const textures = params.imgs
  const bubbleWidth = getRealPx(params.ballWidth) * params.ratio
  // const bubbleHeight = parseInt(matterObj.ballHeight*matterObj.ratio)
  const conWidth = params.width
  const conHeight = params.height
  const gravityY = parseInt(params.gravityY)

  let matterCanvasStyle = document.documentElement.style
  // // 比例设置 这里需要重新处理下
  // matterCanvasStyle.setProperty(`--matter-canvas-scale`, 0.5)
  let Matter = window.Matter
  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite

  // create an engine
  let engine = Engine.create()

  // create a renderer
  let dom = document.getElementById(params.id)
  console.log(dom)
  let render = Render.create({
    element: dom,
    engine: engine,
    options: {
      width: getRealPx(conWidth),
      height: getRealPx(conHeight),
      wireframes: false,
      background: 'transparent',
    }
  })
  engine.world.gravity.x = 0
  engine.world.gravity.y = 0.5


  const bodys = []
  let i = -1
  let shapeAmount = textures.length
  // let xx = conWidth - (shapeAmount * bubbleWidth/2)
  // let yy = conHeight - (shapeAmount * bubbleHeight/2)
  // 这个位置是相对已400的时候的 所以现在需要重新设置下对应的元素位置
  let positionXs = [122.78585140770514, 209.3235376646257, 326.01634544621396, 101.52559109065926, 188.39323934095015, 282.38697650836866]
  let positionYs = [183.38542746227944, 230.06200548401105, 207.91038110198647, 279.55905905222403, 326.1084787517811, 296.24269011459813]

  for (let i = 0; i < shapeAmount; i++) {
    let x = (conWidth / 400 )  * positionXs[i]
    let y =  (conHeight / 400 )  * positionYs[i]
    let body = Bodies.circle(x,y, bubbleWidth / 2,
      {
        friction: 0.001, //摩擦力
        frictionAir: 0.005, //空气阻力
        restitution: 0.9, //反弹指数
        density: 0.05, //密度
        // isSleeping: true,
        render: {
          strokeStyle: 'red',
          lineWidth: 0,
          sprite: {
            texture: textures[i],
            xScale: params.scale ? params.scale : 0.9,
            yScale:  params.scale ? params.scale : 0.9,
          },
        }
      }
    )
    bodys.push(body)
  }

  // 圆形ground 这里宽高的问题
  let m = Math.min(conWidth, conHeight)
  let rat = 1 / 4.5 * 2
  let r = m * rat
  let parts = []
  let pegCount = 64
  const TAU = Math.PI * 2
  let segment, angle2, x2, y2, cx2, cy2, rect
  for (i = 0; i < pegCount; i++) {
    segment = TAU / pegCount
    angle2 = i / pegCount * TAU + segment / 2
    x2 = Math.cos(angle2)
    y2 = Math.sin(angle2)
    cx2 = x2 * r + conWidth / 2
    cy2 = y2 * r + conHeight / 2
    rect = addRect({
      x: cx2, y: cy2, w: 10 / 1000 * m, h: 400 / 1000 * m, options: {
        angle: angle2, isStatic: true, density: 1, render: {
          fillStyle: 'red',
          strokeStyle: 'transparent',
          lineWidth: 1
        }
      }
    })
    parts.push(rect)
  }

  function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
    let body = Bodies.rectangle(x, y, w, h, options)
    addBody(body)
    return body
  }

  function addBody(...bodies) {
    World.add(engine.world, ...bodies)
  }

  Composite.add(engine.world, bodys)

  // run the renderer
  Render.run(render)

  // 使渲染视图适合场景
  Render.lookAt(render, Composite.allBodies(engine.world))


  let runner

  function onStart(onSuccess = () => { }) {
    if (!runner) {
      runner = Runner.create()
      Runner.run(runner, engine)
    } else {
      Runner.run(runner, engine)
    }
    let balls = bodys
    let timeout = 0
    for (let i = 0; i < balls.length * 2; i++) {
      window.setTimeout(() => {
        randomBall(balls[i % balls.length])
      }, timeout)
      timeout += 100
    }
    window.setTimeout(() => {
      Runner.stop(runner)
      onSuccess()
    }, timeout * 3)
  }

  function randomBall(ball) {
    Matter.Body.applyForce(ball, ball.position, { x: 0, y: -Math.random() * gravityY })
  }


  function destroy() {

  }

  return {
    start: onStart
  }
}
var COMMON_WIDTH = 750
var COMMON_HEIGHT = 1334

var COMMON_WID_HEI = {
  width: COMMON_WIDTH,
  height: COMMON_HEIGHT,
  designScale: 2,
  adaptiveScale: 2,
  clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
  clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
}

COMMON_WID_HEI.adaptiveScale = COMMON_WID_HEI.width / COMMON_WID_HEI.clientWidth
/**
 *
 * @method 弹幕动效
 * @param {*} params
 */
export function Barrage(params){
  if(!params.id){
    console.log('function Barrage need id!')
    return
  }
  let className = "barrage"
  let className_ = "barrage-b"
  let parentDom = document.getElementById(params.id)
  setDomStyles(parentDom,{
    position: 'relative',
    overflow: 'hidden'
  })
  params.textSize = params.textSize || 20
  params.duration = params.duration || 10
  params.num = params.num  || 5
  params.duration =  params.duration || 12

  let comp
  if (!params.content) return 
  this.content = params.content
  getDom()
  window.setTimeout(()=>{
    initBarrage()
  },500)
  
  function _random(min,max){
    return Math.round(Math.random()*max + min);
  }


  function getTextDom(text, className, i) {
    let color
    let fontColor = params.fontColor
    let fontSize = params.textSize
    let left = parseInt(parentDom.clientWidth)
    if (Array.isArray(fontColor)) {
      let length = fontColor.length
      let index = random(0, length - 1)
      console.log(index)
      color = fontColor[index]
    } else {
      color = fontColor || 'black'
    }

    if (Array.isArray(fontSize)) {
      let length = fontSize.length
      let index = random(0, length - 1)
      fontSize = fontSize[index] / COMMON_WID_HEI.adaptiveScale
    } else {
      fontSize = fontSize / COMMON_WID_HEI.adaptiveScale
    }
    let randomTop = parseInt(parentDom.clientHeight)
    let everyHeight =  randomTop / params.num

    let style = {
      position: "absolute",
      top: (everyHeight * i) + 'px',
      left: left + 'px',
      fontSize: fontSize + 'px',
      whiteSpace: "nowrap",
      color,
    }
    
    let span = document.createElement('span')
    span.classList.add(className, 'barrage-item')
    setDomStyles(span,style)
    span.innerHTML = text
    return span
  }

  function getDom() {
    let count = content.length
    let comp, j

    time = (count / 2) / params.num
    if ((count / 2) % params.num != 0) {
      time += 1
    }

    for (j = 0; j < Math.ceil(count / 2); j++) {
      comp = getTextDom(content[j], className + '-' + Math.floor(j / params.num), j % params.num)
      parentDom.appendChild(comp)
    }

    for (let i = 0; i < Math.floor(count / 2); i++) {
      comp = getTextDom(content[i + j], className_ + '-' + Math.floor(i / params.num), i % params.num)
      parentDom.appendChild(comp)
    }
  }

  function initBarrage() {
    playAnim('.' + className + '-' + 0, 0, className)
    if (params.num > 1) {
      window.setTimeout(() => {
        playAnim('.' + className_ + '-' + 0, 0, className_)
      }, params.duration * 1000 / 2)
    }
  }

  function playAnim(className, i = 0, realName) {
    let duration = 10
    if( params && params.duration){
      duration = params.duration
    }
    window.gsap.to(className, {
      x: function (index) {
        let items = document.querySelectorAll(className)
        let clientWidth = parseFloat(items[index].clientWidth)
        let width = parseFloat(parentDom.clientWidth)
        let left = - (clientWidth + width)
        return left
      },
      duration: params.duration,
      ease: "none",
      yoyo: false,
      stagger: params.num,
      onComplete: function () {
        onFinished(realName, i)
        let nextIndex = i + 1
        if (nextIndex >= Math.floor(time)) {
          playAnim('.' + realName + '-' + 0, 0, realName)
        } else {
          playAnim('.' + realName + '-' + nextIndex, nextIndex, realName)
        }
      },
    })
  }

  function onFinished(className, i) {
    window.gsap.to('.' + className + '-' + i, {
      x: 0,
      y: 0,
      duration: 0,
      delay: 0,
    })
  }

  function destroy() {
    className = ""
    className_ = ""
    count = 0
    num = 0
    params = null
    fontFamily = ''
    let doms = document.getElementsByClassName("barrage-item")
    doms.forEach((dom) => {
      window.gsap.killTweensOf(dom)
    })
  }
  return {
    destroy
  }
}


/**
 *
 * @method 文本复制
 * @param {*} compId 组件Id
 * @param {*} success 成功回调
 * @param {*} fail 失败回调
 */
export async function clipboardCopy(compId, success,fail) {
  let dom = document.getElementById(compId)
  let text = ''
  if(dom){
    text = dom.innerHTML || dom.innerText
  }else{
    text = compId
  }
  if(copyExecCommand(text)){
    if(success){
      success(text)
    }
  }else{
    if(fail){
      fail()
    }
  }
  function copyExecCommand(text) {
    // Put the text to copy into a <span>
    const span = document.createElement('span')
    span.textContent = text

    // Preserve consecutive spaces and newlines
    span.style.whiteSpace = 'pre'
    span.style.webkitUserSelect = 'auto'
    span.style.userSelect = 'all'

    // Add the <span> to the page
    document.body.appendChild(span)

    // Make a selection object representing the range of text selected by the user
    const selection = window.getSelection()
    const range = window.document.createRange()
    selection.removeAllRanges()
    range.selectNode(span)
    selection.addRange(range)

    // Copy text to the clipboard
    let success = false
    try {
      success = window.document.execCommand('copy')
    } finally {
      // Cleanup
      selection.removeAllRanges()
      window.document.body.removeChild(span)
    }

    if (!success) throw makeError()
    return success
  }
}

// window.onload = function () {
//   let lotteryTime = 3
//   // let lotteryObj = onLotterty({
//   //   id: 'myLottery',
//   //   lotteryList: [
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //     ['./image/light/星穹50.png', './image/unlight/耳机.png'],
//   //   ],
//   //   itemWidth: 200,
//   //   itemHeight: 200,
//   //   ratio: 0.95,
//   //   thanksIndex: 5,
//   //   LotteryTime: lotteryTime, // 这个抽奖次数得放到哪里呢,
//   //   onclick: () => {
//   //     window.setTimeout(() => {
//   //       lotteryObj.start(4, function () {
//   //         lotteryTime = lotteryTime - 1
//   //         console.log('现在的抽奖次数' + lotteryTime)
//   //         lotteryObj.setLotteryTime(lotteryTime)
//   //       })
//   //     }, 100)
//   //   }
//   // })



//   // let btnDom = document.getElementById('btn')
//   // if (btnDom) {
//   //   btnDom.onclick = function () {
//   //     // canvasImgInLocal({
//   //     //   canvasId: 'boxs',
//   //     //   hiddenCompIds: 'box2',
//   //     //   repalceId: 'canvasDom',
//   //     //   saveImgType: 'png',
//   //     //   saveImgQuality: 0.8,
//   //     //   timeOut: 100
//   //     // }, function (url) {
//   //     //   console.log('执行成功' + url)
//   //     // })
//   //     let span = document.getElementById('copyText')
//   //     // 复制文本功能
//   //     clipboardCopy('copyText', function (text) {
//   //       console.log(text)
//   //     })
//   //   }
//   // }
//   // let twistedEggMatter = TwistedEggMatter({
//   //   id: 'eggMatter',
//   //   lotteryId: "lotterybtn",
//   //   imgs: [
//   //     './image/ball.png',
//   //     './image/ball.png',
//   //     './image/ball.png',
//   //     './image/ball.png',
//   //     './image/ball.png',
//   //     './image/ball.png',
//   //   ],
//   //   width: 400,
//   //   height: 400, // 转换成对应的rem
//   //   ballWidth: 100,
//   //   ballHeight: 100,
//   //   ratio: 0.8,
//   //   gravityY: ,
//   //   scale: 0.9
//   // })

//   // let btn = document.getElementById('lotterybtn')
//   // btn.onclick = function () {
//   //   twistedEggMatter.start(() => {
//   //     console.log('动效结束')
//   //   })
//   // }

//   // 弹幕
//   Barrage({
//     id: 'barrage',
//     content: [
//       "我就祝你，走过的每个年，都值得。",
//       "2022共祝我们有钱！有爱！有美食！",
//       "愿你成为自己的太阳",
//       "2022要金虎纳福、吉祥如意",
//       "2022年的你不退让，不将就",
//       "新的一年，你成为自己喜欢的样子",
//       "要大笑，要做梦，要与众不同",
//       "愿新年 胜旧年",
//       "希望可以自己一直可以有趣",
//       "希望2022的日子，三餐四季，温柔有趣",
//       "愿今后所有的担惊受怕，都只是虚惊一场", "新年愿望：人瘦点钱包鼓点，希望别再弄错了",
//       "2022让一起难受都过去吧，翻篇！",
//       "要永远年轻，永远热情，永远不听话",
//       "今年尽情玩耍，尽情学习，尽情长大",
//       "新年快乐！祝你多吃不胖，赚钱不停",
//       "祝你今天愉快，明天的愉快留给我明天祝福",
//       "吉吉利利，百事都如意", "愿你夜里有灯，梦里有人",
//       "2022年祝我自己金钱不胜数，干活不辛苦"
//     ],
//     textSize : [28,34],
//     duration : 12,
//     fontColor: ["#ffffff", "#ffbb00"],
//   })
// }

// 刮刮乐
// 刮刮乐
function ScratchCard(params = {}) {
  let { id, touchstart, touchend, touchmove, mask,zIndex } = params
  let father_element = document.getElementById(id)
  let width = father_element.getBoundingClientRect().width
  let height = father_element.getBoundingClientRect().height

  let canDraw = false

  let canvas = document.createElement('canvas')
  _setDomStyles(canvas,{
    'position':'absolute',
    'z-index': zIndex ? zIndex : 1
  })
  father_element.appendChild(canvas)
  if (canvas) {
    ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high"

    const img = new Image();
    img.src = mask;
    img.onload = () => {
      const dpr = window.devicePixelRatio;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.globalCompositeOperation = 'destination-out'
    }
    canvas.addEventListener('touchstart', function (e) {
      canDraw = true
      touchstart && touchstart()
    })
    canvas.addEventListener('touchend', function () {
      canDraw = false
      document.body.style.overflow = 'auto'
      if (touchend) touchend()
    })
    canvas.addEventListener('touchmove', function (e) {
      document.body.style.overflow = 'hidden'
      if (canDraw) {
        drawCircle(ctx, e)
      }
      if (canDraw && touchmove) touchmove()
    })
  }

  // 绘制操作
  function drawCircle(ctx, e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI, true)
    ctx.fill()
    ctx.closePath()
  }

  function setMask(url = 'https://n.sinaimg.cn/auto/20240704zero/page4/mask.png') {
    if(!canvas) return
    const img = new Image();
    img.src = url;
    img.onload = () => {
      ctx.globalCompositeOperation = 'source-over'
      const dpr = window.devicePixelRatio;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.drawImage(img, 0, 0, width * dpr, height * dpr)
      // Scale the context to ensure correct drawing operations
      ctx.scale(dpr, dpr);

      // Set the "drawn" size of the canvas
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.globalCompositeOperation = 'destination-out'
    }
  }


  // 做覆盖
  return {
    canvas,
    setMask
  }
}