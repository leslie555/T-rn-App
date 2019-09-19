import request from '../utils/request'
export function AppselectShareHouseInfoListPaging(data) {
  return request({
    url: '/MCommunity/AppselectShareHouseInfoListPaging',
    method: 'post',
    data
  })
}

// 查询共享房源详情
export function selectShareHouseInfoListByID(data) {
  return request({
    url: '/MCommunity/selectShareHouseInfoListByID',
    method: 'post',
    data
  })
}

// 查询共享房源详情  3.0
export function selectShareHouseDetail(data) {
  return request({
    url: '/OperateMethod/SelectShareHouseByID',
    method: 'post',
    data
  })
}

// 查询个人房源详情  3.0
export function selectMyHouseDetail(data) {
  return request({
    url: '/OperateMethod/SelectHouseByID',
    method: 'post',
    data
  })
}

// 一键发布
export function ReleaseHouse(data) {
  return request({
      url: '/MCommunity/ReleaseHouse',
      method: 'post',
      data
  })
}

// 查询城市数组
export function ShowCompanyinfoCityCode(data = {}) {
  return request({
    url: '/SystemMethod/ShowCompanyinfoCityCode',
    method: 'post',
    data
  })
}

// 拿房测算
export function InOfHouse(data) {
  return request({
    url: '/CalculationMethod/InOfHouse',
    method: 'post',
    data
  })
}

// 出房测算
export function OutOfHouse(data) {
  return request({
    url: '/CalculationMethod/OutOfHouse',
    method: 'post',
    data
  })
}

// 出房查询
export function Investment(data) {
  return request({
    url: '/CalculationMethod/Investment',
    method: 'post',
    data
  })
}

// 查询房态图列表
export function SelectHouseInfoListApp(data) {
  return request({
    url: '/HouseData/MCommunity/SelectHouseInfoListApp',
    method: 'post',
    data
  })
}

// 查询房源详情
export function houseInfoListByID(data) {
  return request({
    url: '/OperateMethod/houseInfoListByID',
    method: 'post',
    data
  })
}

// 完善房源
export function perfectingHousingEditApp(data) {
  return request({
    url: '/OperateMethod/perfectingHousingEditApp',
    method: 'post',
    data
  })
}

// 装修新增
export function AddFitment(data) {
  return request({
    url: '/Fitment/AddFitment',
    method: 'post',
    data
  })
}

// 装修修改
export function EditFitment(data) {
  return request({
    url: '/Fitment/EditFitment',
    method: 'post',
    data
  })
}

// 装修查询
export function FindFitment(data) {
  return request({
    url: '/Fitment/FindFitment',
    method: 'post',
    data
  })
}

// 共享房源
// 收藏
export function addEnshrine(data) {
  return request({
    url: '/OperateMethod/addEnshrine',
    method: 'post',
    data
  })
}

// 取消收藏
export function delEnshrine(data) {
  return request({
    url: '/OperateMethod/delEnshrine',
    method: 'post',
    data
  })
}

export function AppselectEnshrine(data) {
  return request({
    url: '/MCommunity/AppselectEnshrine',
    method: 'post',
    data
  })
}

// 小区列表查询
export function ShowMCommunityInfo(data) {
  return request({
    url: '/MCommunity/ShowMCommunityInfo',
    method: 'post',
    data
  })
}

// 搜索房源
export function searchHouseList(data) {
  return request({
    url: '/HouseData/MCommunity/selectHouseList',
    method: 'post',
    data
  })
}

// 搜索房源设备
export function searchHouseConfig(data) {
  return request({
    url: '/HouseData/MCommunity/selectHouseFacilities',
    method: 'post',
    data
  })
}
// 查询房东信息
export function FindOwnerInfo(data) {
  return request({
    url: '/HouseData/MCommunity/FindOwnerInfo',
    method: 'post',
    data
  })
}
// 查询租客信息
export function FindTenantInfo(data) {
  return request({
    url: '/HouseData/MCommunity/FindTenantInfo',
    method: 'post',
    data
  })
}
// 个人房源列表3.0
export function SelectMyHouseList(data) {
  return request({
    url: '/OperateMethod/SelectHouseList',
    method: 'post',
    data
  })
}
// 共享房源列表3.0
export function SelectShareHouseList(data) {
  return request({
    url: '/OperateMethod/SelectShareHouseList',
    method: 'post',
    data
  })
}
// 个人房源列表数量3.0
export function SelectMyHouseCount(data) {
  return request({
    url: '/OperateMethod/ShowHouseCount',
    method: 'post',
    data
  })
}

// 查看装修申请列表
export function SelectRenovationApplyList(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationApplyRecord',
    method: 'post',
    data
  })
}

// 查看详情
export function SelectRenovationApplyDetail(data) {
  return request({
    url: '/CompanyMethod/ShowRenovationRecordDetails',
    method: 'post',
    data
  })
}

// 提交装修申请
export function SubmitRenovationApplication(data) {
  return request({
    url: "/CompanyMethod/UDRenovationApplyRecordStatus",
    method: "post",
    data,
  })
}

// 删除装修申请
export function DeleteRenovationApplication(data) {
  return request({
    url: "/CompanyMethod/UDRenovationApplyRecordStatus",
    method: "post",
    data,
  })
}

// 撤回装修申请
export function WithdrawRenovationApplication(data) {
  return request({
    url: "/CompanyMethod/Withdraw",
    method: "post",
    data,
  })
}
// 审批装修申请
export function ApprovalRenovationApplication(data) {
  return request({
    url: "/CompanyMethod/RenovationApplyApproval",
    method: "post",
    data,
  })
}




