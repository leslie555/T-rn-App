/* eslint-disable eqeqeq */
export default function(arr = [], key) {
  /*
   *  arr  需要分组的数组
   *  key  按照key字段来分组
   * */
  const res = {}
  if (!key || !arr.length) return res
  arr.forEach(val => {
    if (!res[val[key]]) {
      res[val[key]] = [val]
    } else {
      res[val[key]].push(val)
    }
  })
  return res
}
