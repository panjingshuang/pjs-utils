// 防抖函数
function deboundce(func, wait) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(context, args)
    }, wait)
  }
}
// 节流
function throttle(func, wait) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
// 冒泡排序
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j],arr[j+1]] = [arr[j+1],arr[j]] 
      }
    }
  }
  return arr
}
// 快排
function quickSort(arr){
  if(arr.length <= 1) return arr
  const left = [], right = [] , current = arr.splice(0,1)
  for(let i=0; i< arr.length;i++){
    if(arr[i]< current){
      left.push(arr[i])
    }else{
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(current,quickSort(right))
}
//插入排序
function insertSort(arr){
  let tem
  for(let i=0;i<arr.length;i++){
    tem = arr[i]
    for(let j=i; j>=0; j--){
      if(arr[j-1] > tem){
        arr[j] = arr[j-1]
      }else{
        arr[j] = tem
        break
      }
    }
  }
  return arr
}

console.log(insertSort([3,4,5,1,2,3,6,7]))
