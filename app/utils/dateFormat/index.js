/**
 * @file: index.
 * @intro: 时间格式化工具类.
 * @author: zzmhot.
 * @email: zzmhot@163.com.
 * @Date: 2017/4/28 15:55.
 * @Copyright(©) 2017 by zzmhot.
 *
 */

/**
 * 时间格式化函数
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 * @param {Date||number} date Date对象或者时间戳
 * @param {string} fmt 格式化字符串
 *        ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *        ("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @returns {string} 格式化后的字符串
 */
const dateFormat = (date, fmt) => {
  // 如果是时间戳的话那么转换成Date类型
  if (typeof date === 'number') {
    date = new Date(date)
  } else if (!date) {
    return ''
  } else if (typeof date === 'string') {
    if (date === '0001-01-01T00:00:00') {
      return ''
    }
    date = new Date(date.replace('T', ' ').replace(/-/g, '/'))
  }
  if (!fmt) {
    fmt = 'yyyy-MM-dd'
  }
  const o = {
    // 月份
    'M+': date.getMonth() + 1,
    // 日
    'd+': date.getDate(),
    // 小时
    'h+': date.getHours(),
    // 分
    'm+': date.getMinutes(),
    // 秒
    's+': date.getSeconds(),
    // 季度
    'q+': Math.floor((date.getMonth() + 3) / 3),
    // 毫秒
    S: date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 计算2个时间相差的年月
const diffTime = (time1, time2, type = 0) => {
  time1 = dateFormat(time1, 'yyyy-MM-dd')
  time2 = dateFormat(time2, 'yyyy-MM-dd')
  if (!time1 || !time2) {
    return ''
  }
  const time1Arr = time1.split('-')
  const time2Arr = time2.split('-')
  let diffMonth = Math.abs(
    (time2Arr[0] - time1Arr[0]) * 12 + (time2Arr[1] - time1Arr[1])
  )
  const time2Obj = new Date(time2)
  time2Obj.setDate(time2Obj.getDate() + 1)
  if (+time1Arr[2] === 1 && time2Obj.getDate() === 1) {
    diffMonth += 1
  }
  const time1Obj = new Date(time1)
  time1Obj.addMonths(diffMonth)
  let str = ''
  const strArr = ['', '', '']
  // 表示整年整月
  if (diffMonth >= 12) {
    if (diffMonth % 12 === 0) {
      str = `${diffMonth / 12}年`
      strArr[0] = diffMonth / 12
      strArr[1] = ''
      strArr[2] = ''
    } else {
      str = `${Math.floor(diffMonth / 12)}年${diffMonth % 12}个月`
      strArr[0] = Math.floor(diffMonth / 12)
      strArr[1] = diffMonth % 12
      strArr[2] = ''
    }
  } else if (diffMonth > 0) {
    str = `${diffMonth}个月`
    strArr[0] = ''
    strArr[1] = diffMonth
    strArr[2] = ''
  } else {
    strArr[0] = ''
    strArr[1] = ''
    strArr[2] = ''
  }
  if (time1Obj.getTime() === time2Obj.getTime()) {
    // return str
    console.log(time2Arr)
  } else {
    const diffDate = time2Arr[2] - time1Arr[2] + 1
    if (diffDate < 0) {
      diffMonth -= 1
      const time1ObjClone = new Date(time1)
      time1ObjClone.addMonths(diffMonth)
      if (diffMonth >= 12) {
        if (diffMonth % 12 === 0) {
          str = `${diffMonth / 12}年`
          strArr[0] = diffMonth / 12
          strArr[1] = ''
          strArr[2] = ''
        } else {
          str = `${Math.floor(diffMonth / 12)}年${diffMonth % 12}个月`
          strArr[0] = Math.floor(diffMonth / 12)
          strArr[1] = diffMonth % 12
          strArr[2] = ''
        }
      } else if (diffMonth > 0) {
        str = `${diffMonth}个月`
        strArr[0] = ''
        strArr[1] = diffMonth
        strArr[2] = ''
      } else {
        strArr[0] = ''
        strArr[1] = ''
        strArr[2] = ''
      }
      const calcTime =
        (time2Obj.getTime() - time1ObjClone.getTime()) / 3600000 / 24
      str += calcTime + '天'
      strArr[2] = calcTime
    } else {
      str += diffDate + '天'
      strArr[2] = diffDate
    }
  }
  return type === 0 ? str : strArr
}
// 显示时间转换
// 转换规则:
// 1分钟以内显示为：刚刚
// 1小时以内显示为：N分钟前
// 当天以内显示为：今天 N点N分（如：今天 22:33）
// 昨天时间显示为：昨天 N点N分（如：昨天 10:15)
// 当年以内显示为：N月N日 N点N分（如：02月03日 09:33）
// 今年以前显示为：N年N月N日 N点N分（如：2000年09月18日 15:59）
const timestampFormat = time => {
  if (!time) {
    return ''
  }
  const timestamp = parseInt(new Date(time).getTime() / 1000)

  function zeroize(num) {
    return (String(num).length === 1 ? '0' : '') + num
  }

  const curTimestamp = parseInt(new Date().getTime() / 1000) // 当前时间戳
  const timestampDiff = curTimestamp - timestamp // 参数时间戳与当前时间戳相差秒数

  const curDate = new Date(curTimestamp * 1000) // 当前时间日期对象
  const tmDate = new Date(timestamp * 1000) // 参数时间戳转换成的日期对象

  const Y = tmDate.getFullYear()
  const m = tmDate.getMonth() + 1
  const d = tmDate.getDate()
  const H = tmDate.getHours()
  const i = tmDate.getMinutes()

  if (timestampDiff < 60) {
    // 一分钟以内
    return '刚刚'
  } else if (timestampDiff < 3600) {
    // 一小时前之内
    return Math.floor(timestampDiff / 60) + '分钟前'
  } else if (
    curDate.getFullYear() === Y &&
    curDate.getMonth() + 1 === m &&
    curDate.getDate() === d
  ) {
    return '今天' + zeroize(H) + ':' + zeroize(i)
  } else {
    const newDate = new Date((curTimestamp - 86400) * 1000) // 参数中的时间戳加一天转换成的日期对象
    if (
      newDate.getFullYear() === Y &&
      newDate.getMonth() + 1 === m &&
      newDate.getDate() === d
    ) {
      return '昨天' + zeroize(H) + ':' + zeroize(i)
    } else if (curDate.getFullYear() === Y) {
      return m + '月' + d + '日 ' + zeroize(H) + ':' + zeroize(i)
    } else {
      return (
        Y +
        '年' +
        zeroize(m) +
        '月' +
        zeroize(d) +
        '日 ' +
        zeroize(H) +
        ':' +
        zeroize(i)
      )
    }
  }
}

// 数组转时间
const arrToTime = (arr, markType) => {
  if (!markType) {
    markType = '-'
  }
  let str = ''
  if (arr.length <= 3) {
    arr.forEach((ele, index) => {
      if (ele.length < 2) {
        str += '0'
      }
      if (index !== arr.length - 1) {
        str += ele
        str += markType
      } else {
        str += ele
      }
    })
  } else {
    arr.forEach((ele, index) => {
      if (ele.length < 2) {
        str += '0'
      }
      if (index < 2) {
        str += ele
        str += markType
      } else if (index === 2) {
        str += ele
        str += ' '
      } else if (index !== arr.length - 1) {
        str += ele
        str += ':'
      } else {
        str += ele
      }
    })
  }
  return str
}
export { dateFormat, diffTime, timestampFormat, arrToTime }
