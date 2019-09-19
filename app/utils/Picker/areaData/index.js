import CityData from './cityData'
function findNextByCode(city, code) {
  const next = city.find(val => {
    return val.value === code
  })
  return next
}
function findNextByName(city, name) {
  const next = city.find(val => {
    return val.name === name
  })
  return next
}

/**
 *
 * @param {String|Number} code 根据最后一位城市码获取到所有城市码数组
 */
const getCodeArrByCode = code => {
  if (!code) return []
  code = code + ''
  const pCode = code.slice(0, 2) + '0000'
  const cCode = code.slice(0, 4) + '00'
  return [pCode, cCode, code]
}
/**
 *
 * @param {String|Number|Array} code 根据城市码找到对应的城市名
 */
const getCityNameByCode = (code, type) => {
  if (!code || !code.length) return ''
  const codeArr =
    Object.prototype.toString.call(code) === '[object Array]'
      ? code
      : getCodeArrByCode(code)
  let cityName = ''
  const cityNameArr = []
  let next = CityData // 找到的下一级数据
  codeArr.forEach(val => {
    if (next) {
      next = findNextByCode(next, val)
      cityName += next.name + ' '
      cityNameArr.push(next.name)
      next = next.children
    }
  })
  return type === 0 ? cityName : cityNameArr
}

const getCityCodeByNameArr = (nameArr, type = 0) => {
  const codeArr = []
  let next = CityData // 找到的下一级数据
  nameArr.forEach(val => {
    if (next) {
      next = findNextByName(next, val)
      codeArr.push(next.value)
      next = next.children
    }
  })
  return type === 0 ? codeArr[codeArr.length - 1] : codeArr
}

export { CityData, getCityNameByCode, getCodeArrByCode, getCityCodeByNameArr }
