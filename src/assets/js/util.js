export function formatDate(timeStamp) {
  timeStamp = timeStamp*1000
  var time = new Date(timeStamp)
  var y = time.getFullYear()
  var M = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
  var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  var m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  var s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
  return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
}

export function toArray(obj){
  let arr = []
  for(let key in obj){
    let info = {}
    info[key] = obj[key]
    arr.push(info)
  }
  return arr
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
      return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
