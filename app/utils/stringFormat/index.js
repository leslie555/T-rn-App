// 完成将 ToChineseNum， 可以将数字转换成中文大写的表示，限制最大值为九十九，例如 ToChinesNum(45)，返回 四十五。
function ToChinesNum(num) {
  const changeNum = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
  const unit = ['', '十']
  num = parseInt(num)
  const getResult = (temp) => {
    const strArr = temp.toString().split('')
    let newNum = ''
    if (strArr.length > 0 && strArr[0] === '0') {
      return ''
    }
    for (let i = 0; i < strArr.length; i++) {
      const n = parseInt(strArr[i])
      newNum += strArr.length === 1 ? changeNum[n]
        : i === 0 && temp === 10 ? ''
          // : i === 0 && temp % 10 === 0 && n === 1 ? ''
            : i === 0 && temp % 10 === 0 ? changeNum[strArr[0]]
              : i === 0 && n === 1 ? ''
                : i === 0 && n !== 1 ? changeNum[n]
                  : unit[1] + changeNum[n]
    }
    return newNum
  }
  return getResult(num)
}

export {
  ToChinesNum
}
