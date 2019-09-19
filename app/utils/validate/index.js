// 验证电话号码格式
const validatePhoneNumber = function (val) {
  if (!val) return true
  const reg = /^1[3-9]\d{9}$/
  return reg.test(val)
}

// 验证数字格式
const validateNumber = function (val, options) {
  if (!val) return true
  val = +val
  if (isNaN(val)) return false
  if (options) {
    if (options.min !== undefined) {
      if (val < options.min) return false
    }
    if (options.max !== undefined) {
      if (val > options.max) return false
    }
    if (options.int) {
      if (Math.floor(val) !== val) return false
    }
  }
  return true
}

export {
  validatePhoneNumber,
  validateNumber
}
