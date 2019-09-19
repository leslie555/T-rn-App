
import request from '../utils/request'
// ------ 水电气抄表 --------
// 新增一条抄表数据
export function GetNewTableDatas(data) {
  return request({
    url: '/UtilityHistory/InsertUtilityInfoAPP',
    method: 'post',
    data
  })
}

// 查询水电气列表数据
export function GetAllTableDatas(data) {
  return request({
    url: '/UtilityHistory/SelectHistoryByPageAPP',
    method: 'post',
    data
  })
}

// 获取读数用量单价的接口
export function GetUnitNumberAndPrice(data) {
  return request({
    url: '/UtilityHistory/SelectHistoryByHouseIDAPP',
    method: 'post',
    data
  })
}

// ------------维修申请接口----------
// 查询维修列表
export function SelectRepairApplyList(data) {
  return request({
    url: '/CompanyMethod/SelectMaintainAppPage',
    method: 'post',
    data
  })
}

// 查询维修详情
export function QueryRepairApplyDetail(data) {
  return request({
    url: "/CompanyMethod/SelectMaintainDetailByID",
    method: "post",
    data,
  })
}

// 详情页面提交维修申请
export function CommitRepairApply(data) {
  return request({
    url: "/CompanyMethod/SubmitMainEntity",
    method: "post",
    data,
  })
}

// 删除维修申请
export function DeleteRepairApply(data) {
  return request({
    url: '/CompanyMethod/DeleteMainEntityByID',
    method: 'post',
    data
  })
}

// 撤回维修申请
export function WithdrawRepairApply(data) {
  return request({
    url: '/CompanyMethod/WithdrawMainEntity',
    method: 'post',
    data
  })
}

// ------------保洁申请接口----------
// 查询保洁列表
export function SelectCleaningApplyList(data) {
  return request({
    url: '/CompanyMethod/QueryCleaningList',
    method: 'post',
    data,
  })
}

// 查询保洁申请详情
export function QueryCleaningApplyDetail(data) {
  return request({
    url: "/CompanyMethod/QueryCleningDetails",
    method: "post",
    data,
  })
}

// 提交保洁申请
export function CommitCleaningApply(data) {
  return request({
    url: "/CompanyMethod/SubmitCleaningApplication",
    method: "post",
    data,
  })
}

// 删除保洁申请
export function DeleteCleaningApply(data) {
  return request({
    url: '/CompanyMethod/DelCleaningApplication',
    method: 'post',
    data
  })
}

// 撤回保洁申请
export function WithdrawCleaningApply(data) {
  return request({
    url: "/CompanyMethod/WithdrawCleaningApplication",
    method: "post",
    data,
  })
}

// 新增维修申请
export function InsertMaintain(data) {
  return request({
    url: '/CompanyMethod/InsertMaintain',
    method: 'post',
    data
  })
}

// 修改维修申请
export function EditMaintainApply(data) {
  return request({
    url: '/CompanyMethod/EditMaintainApply',
    method: 'post',
    data
  })
}

// 新增保洁申请
export function AddCleaning(data) {
  return request({
    url: '/CompanyMethod/AddCleaning',
    method: 'post',
    data
  })
}

// 修改保洁申请
export function EditCleaningApplication(data) {
  return request({
    url: '/CompanyMethod/EditCleaningApplication',
    method: 'post',
    data
  })
}

