/* eslint-disable eqeqeq */
export default function(oldData, newData, diffKey = []) {
  /*
  *  ModifyStatus  0：未改 1：新增 2：修改 3：删除
  *  oldData  [{KeyID:1,a:111},{KeyID:2,a:222},{KeyID:3,a:333}]
  *  newData  [{KeyID:1,a:111},{KeyID:2,a:444},{KeyID:'',a:555}]
  *  diffKey  ['a'] 需要对比的字段名 不传就不会生成未改状态
  *  output  [{"ModifyStatus":0,"KeyID":1,"a":111},{"ModifyStatus":2,"KeyID":2,"a":444},{"ModifyStatus":1,"KeyID":"","a":555},{"ModifyStatus":3,"KeyID":3,"a":333}]
  * */
  const cloneArr = []
  newData.map(v => {
    const obj = {}
    if (!v.KeyID) {
      // 没有KeyID说明是新增的
      obj.ModifyStatus = 1
    } else {
      const item = oldData.find(c => c.KeyID === v.KeyID)
      if (item) {
        // 对比两个对象的diffKey 看是否全部一致
        let flag = true
        diffKey.map(c => {
          if (v[c] != item[c]) flag = false
        })
        if (flag && diffKey.length > 0) {
          obj.ModifyStatus = 0
        } else {
          obj.ModifyStatus = 2
        }
      } else {
        // 找不到相当于新增
        obj.ModifyStatus = 1
      }
    }
    cloneArr.push({ ...v, ...obj })
  })
  oldData.map(v => {
    const item = newData.find(c => c.KeyID === v.KeyID)
    if (!item) {
      cloneArr.push({ ...v, ModifyStatus: 3 })
    }
  })
  return cloneArr
}
