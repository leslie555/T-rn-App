/* eslint-disable eqeqeq */
export default function(compareA = {}, compareB = {}, ignoreArr = []) {
  /*
  *  compareA  {KeyID:1,a:111,b:123} {KeyID:1,a:111,b:123}
  *  compareB  {KeyID:2,a:222,c:456} {KeyID:1,a:111,c:456}
  *  output     false                     true
  *  说明 两个对象中相同key的值都相等就说明对象相同
  *  应用场景 修改表单的时候 判断是否修改过
  * */
  let flag = false
  for (const key in compareA) {
    if (compareB.hasOwnProperty(key)) {
      if (compareB[key] != compareA[key] && ignoreArr.findIndex(x => x === key) === -1) {
        debugger
        flag = true
        break
      }
    }
  }
  return flag
}
