// 删除数组中某个满足条件的数据
const spliceArr = function(arr, callback) {
  arr.some((item, index) => {
    if (callback(item)) {
      arr.splice(index, 1)
      spliceArr(arr, callback)
      return true
    }
  })
}
export default function(arr, callback) {
  if (typeof arr === 'object') {
    spliceArr(arr, callback)
  }
}
