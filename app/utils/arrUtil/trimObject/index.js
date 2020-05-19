const reg = /[―—─━～﹣]/g
function trimObject(data, type = 0) {
  if (data instanceof Array) {
    data.forEach((item, index) => {
      if (typeof item === 'string') {
        data[index] = data[index].trim()
        data[index] = data[index].replace(reg, '-')
      } else {
        trimObject(item, type)
      }
    })
  }
  if (data instanceof Object) {
    Object.keys(data).forEach(function(key) {
      if (typeof data[key] === 'string') {
        data[key] = data[key].trim()
        data[key] = data[key].replace(reg, '-')
      } else {
        trimObject(data[key], type)
      }
    })
  }
}

export default trimObject
