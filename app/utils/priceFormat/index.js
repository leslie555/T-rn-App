// 价格转换 默认保留2位小数
const priceFormat = function(num, fixed = 2) {
  var result = parseFloat(num)
  if (isNaN(result)) {
    // console.log('formatPrice传递参数错误，请检查！')
    return num
  }
  result = Math.round(num * Math.pow(10, fixed)) / Math.pow(10, fixed)
  var s_x = result.toString()
  var pos_decimal = s_x.indexOf('.')
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }
  while (s_x.length <= pos_decimal + fixed) {
    s_x += '0'
  }
  return s_x
}

// 价格转大写
/**
 * @return {string}
 */
function ToCapChinese(n) {
  if (n === undefined || n === null || n === '' || n === 0) {
    return '零元整'
  }
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
  let unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分'
  let str = ''
  n += '00'
  const p = n.indexOf('.')
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2)
  }
  unit = unit.substr(unit.length - n.length)
  for (let i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
  return str.replace(/零([仟佰拾角])/g, '零').replace(/(零)+/g, '零').replace(/零([兆万亿元])/g, '$1').replace(/([兆亿])万/g, '$1').replace(/([京兆])亿/g, '$1').replace(/(京)兆/g, '$1').replace(/([京兆亿仟佰拾])(万?)(.)仟/g, '$1$2零$3仟').replace(/^元零?|零分/g, '').replace(/([元角])$/g, '$1整')
}

// 保留万元的单位
 function ToChangeWan(num) {
   var num = num / 10000
   var result = num.toFixed(2)
   return result + '万'
 }
export {
  priceFormat,
  ToCapChinese,
  ToChangeWan
}
