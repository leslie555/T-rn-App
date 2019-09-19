function trimObject(data) {
  if (data instanceof Array) {
    data.forEach((item, index) => {
      if (typeof item === 'string') {
        data[index] = data[index].trim()
      } else {
        trimObject(item)
      }
    })
  }
  if (data instanceof Object) {
    Object.keys(data).forEach(function (key) {
      if (typeof data[key] === 'string') {
        data[key] = data[key].trim()
      } else {
        trimObject(data[key])
      }
    })
  }
}

export default trimObject
