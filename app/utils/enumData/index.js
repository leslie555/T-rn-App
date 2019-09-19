/* eslint-disable eqeqeq */
import store from '../../redux/store/store'

// 根据枚举key获取枚举类型列表
function getEnumListByKey(key) {
    const allEnum = store.getState().enum.enumList
    const obj = allEnum['Enum' + key] || []
    return obj.slice()
}
// 根据枚举key 和 value获取name
function getEnumDesByValue(key, val) {
    const list = getEnumListByKey(key)
    const data = list.find(v => v.Value == val)
    return data ? data.Description : null
}
// 根据枚举key 和 name获取value
function  getEnumValueByDes(key, des) {
    const list = getEnumListByKey(key)
    const data = list.find(v => v.Description == des)
    return data ? data.Value : null
}

export {
    getEnumListByKey,
    getEnumDesByValue,
    getEnumValueByDes
}
