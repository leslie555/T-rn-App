import request from '../utils/request'

// 获取业主合同列表
export function AppGetContractOwnerList(data) {
  return request({
    url: '/OwnerContract/OwnerContract/FindOwnerContractListPage',
    method: 'post',
    data
  })
}
// App获取业主合同列表
export function AppFindOwnerContractListPage(data) {
  return request({
    url: '/OwnerContract/OwnerContract/AppFindOwnerContractListPage',
    method: 'post',
    data
  })
}
// 获取业主电子签约合同列表
export function QueryOwnerElectronicList(data) {
  return request({
    url: '/OperateMethod/QueryOwnerElectronicList',
    method: 'post',
    data
  })
}

// 获取业主合同的 暂存& 待确认 & 快要到期 & 已到期 的合同数量
export function AppGetOwnerContractNumber(data) {
  return request({
    url: '/OwnerContract/OwnerContract/QueryOwnerContractNumber',
    method: 'post',
    data
  })
}

// 获取合同详情
export function AppGetContractOwnerDetail(data) {
  return request({
    url: '/OwnerContract/OwnerContract/ShowOwnerContractByID',
    method: 'post',
    data
  })
}

// 创建账单
export function getOwnerBill(data) {
  return request({
    url: '/CalculationMethod/GetOwnerBill',
    method: 'post',
    data
  })
}
// 新增合同
export function insertOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/InsertOwnerContract',
    method: 'post',
    data
  })
}

// 修改合同
export function editOwnerContract(data) {
  return request({
    url: '/OwnerContract/OwnerContract/EditOwnerContract',
    method: 'post',
    data
  })
}

// 搜索小区
export function searchCommunityList(data) {
  return request({
    url: '/HouseData/MCommunity/ShowMCommunityInfo',
    method: 'post',
    data
  })
}

// 查询树形财务栏目
export function QueryBillItem(data) {
  return request({
    url: '/SystemMethod/QueryBillItem',
    method: 'post',
    data
  })
}

// 删除业主合同
export function DeleteOwnerContractByIDs(data) {
  return request({
    url: '/OwnerContract/OwnerContract/DeleteOwnerContractByIDs',
    method: 'post',
    data
  })
}

// 业主退房
export function ownerCheckOut(data) {
  return request({
    url: '/OwnerContract/OwnerContract/OwnerCheckOut',
    method: 'post',
    data
  })
}

// 业主修改退房
export function ownerEditCheckOut(data) {
  return request({
    url: '/OwnerContract/OwnerContract/EditOwnerCheckOut',
    method: 'post',
    data
  })
}

// 租客退房
export function tenantCheckOut(data) {
  return request({
    url: '/TenantContract/TenantCheckOut',
    method: 'post',
    data
  })
}

// 租客修改退房
export function tenantEditCheckOut(data) {
  return request({
    url: '/TenantContract/EditTenantCheckOut',
    method: 'post',
    data
  })
}

// 撤回业主合同
export function WithDrawByID(data) {
  return request({
    url: '/OwnerContract/OwnerContract/WithDrawByID',
    method: 'post',
    data
  })
}

// 手机端业主合同签字
export function mobileOwnerSign(data) {
  return request({
    url: '/OwnerContract/OwnerContract/MobileOwnerSign',
    method: 'post',
    data
  })
}

// 签字阿里云认证
export function personALYAuth(data) {
  return request({
    url: '/FDD/FDD/ALYRealNameAuthentication',
    method: 'post',
    data
  })
}

// 签字个人认证
export function personAuth(data) {
  return request({
    url: '/FDD/FDD/Register',
    method: 'post',
    data
  })
}

// 认证后获取签署url
export function getFddAuthUrl(data) {
  return request({
    url: '/FDD/FDD/Extsign',
    method: 'post',
    data
  })
}

// 下载模板
export function getDownloadContract(data) {
  return request({
    url: '/FDD/FDD/DownLoadContract',
    method: 'post',
    data
  })
}

// 获取单条记账本数据
export function getBookKeepByID(data) {
  return request({
    url: '/Finance/QueryBookKeepByID',
    method: 'post',
    data
  })
}

// 新增记账
export function insertBookKeep(data) {
  return request({
    url: '/Finance/InsertBookKeep',
    method: 'post',
    data
  })
}

// 修改记账
export function editBookKeep(data) {
  return request({
    url: '/Finance/EditBookKeep',
    method: 'post',
    data
  })
}

// 删除记账
export function deleteBookKeepByIDs(data) {
  return request({
    url: '/Finance/DeleteBookKeepByIDs',
    method: 'post',
    data
  })
}

// 记账详情
export function BookKeepDetails(data) {
  return request({
    url: '/OperateMethod/SelectBookKeepByID',
    method: 'post',
    data
  })
}
// 记账详情--删除
export function RemoveBookKeepByIDs(data) {
  return request({
    url: '/OperateMethod/DeleteBookKeepByIDs',
    method: 'post',
    data
  })
}
// 记账详情--修改
export function UpdateBookKeepByIDs(data) {
  return request({
    url: '/OperateMethod/UpdateBookKeep',
    method: 'post',
    data
  })
}
//  存参数
export function AddRealNameAuthenticateNeed(data) {
  return request({
    url: '/FDD/FDD/AddRealNameAuthenticateNeed',
    method: 'post',
    data
  })
}
