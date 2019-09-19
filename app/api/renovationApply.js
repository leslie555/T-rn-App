import request from '../utils/request'

// 装修申请项目配置 - 显示所有类别
export function ShowAllRenovationApply(data) {
  return request({
    url: '/CompanyMethod/ShowAllRenovationApply',
    method: 'post',
    data
  })
}
// 装修申请项目配置 - 显示所有项目
export function ShowRenovationProject(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationProject',
    method: 'post',
    data
  })
}
// 新增装修申请
export function AddRenovationApplyRecord(data) {
  return request({
    url: '/CompanyMethod/AddRenovationApplyRecord',
    method: 'post',
    data
  })
}

// 修改装修申请
export function UpdateRenovationApplyRecord(data) {
  return request({
    url: '/CompanyMethod/UpdateRenovationApplyRecord',
    method: 'post',
    data
  })
}
