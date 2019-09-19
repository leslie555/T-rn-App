import request from '../utils/request'

export function getAllEnumData(data = {}) {
  return request({
    url: '/System/SystemMethod/GetEnums',
    method: 'post',
    data
  })
}

// 根据Code获取ImageList
export function getImageListByCode(data = {}) {
  return request({
    url: '/SystemMethod/FindCodeImageUpload',
    method: 'post',
    data
  })
}

// 根据员工姓名或电话和公司id获取员工List
export function getEmployeeInfoList(data = {}) {
  return request({
    url: '/SystemMethod/EmployeeInfoList',
    method: 'post',
    data
  })
}

// 拿房成本
export function StateOwnerContract(data) {
  return request({
    url: '/MCommunity/StateOwnerContract',
    method: 'post',
    data
  })
}

// 出房成本
export function StateTenContract(data) {
  return request({
    url: '/MCommunity/StateTenContract',
    method: 'post',
    data
  })
}

// 装修成本
export function StateFitment(data) {
  return request({
    url: '/MCommunity/StateFitment',
    method: 'post',
    data
  })
}

// 装修成本
export function getAllContacts(data) {
  return request({
    url: '/SystemMethod/showTelephonedirectory',
    method: 'post',
    data
  })
}

// 搜索所有小店
export function getAllSmallCompany(data) {
  return request({
    url: '/CompanyMethod/ShowSmallCompany',
    method: 'post',
    data
  })
}

// app 记录错误日志
export function addAppExceptionLog(data) {
  return request({
    url: '/SystemMethod/AppExceptionLog',
    method: 'post',
    data
  })
}
