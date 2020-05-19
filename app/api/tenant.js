import request from '../utils/request'

// 房源预定
export function InsertOrderInfo(data) {
  return request({
    url: '/OperateMethod/InsertOrderInfo',
    method: 'post',
    data
  })
}
// 获取合同到期事件
export function SelectExceptLastSignDate(data) {
  return request({
    url: '/OrderInfo/SelectExceptLastSignDate',
    method: 'post',
    data
  })
}
// 修改房源预定
export function UpdateOrderInfo(data) {
  return request({
    url: '/OperateMethod/UpdateOrderInfo',
    method: 'post',
    data
  })
}
// 续定房源预定
export function OrderMoneyExtension(data) {
  return request({
    url: '/OrderInfo/OrderMoneyExtension',
    method: 'post',
    data
  })
}
// 转定房源预定
export function TurnOrderinfo(data) {
  return request({
    url: '/OrderInfo/TurnOrderinfo',
    method: 'post',
    data
  })
}

// 同意或拒绝预定
export function AgreeOrRefuseOrder(data) {
  return request({
    url: '/OperateMethod/AgreeOrRefuseOrder',
    method: 'post',
    data
  })
}
// 取消预定
export function CancelOrderInfo(data) {
  return request({
    url: '/OperateMethod/CancelOrderInfo',
    method: 'post',
    data
  })
}
// 返回当前房子的信息和角标
export function GetHouseBadgeInfo(data) {
  return request({
    url: '/OperateMethod/DelHosueinfoOrd',
    method: 'post',
    data
  })
}

// 预定单修改接口
export function EditOderList(data) {
  return request({
    url: '/TenantBusiness/OrderInfo/UpdateOrderInfo',
    method: 'post',
    data
  })
}
// 预定单删除接口
export function DeleteOrder(data) {
  return request({
    url: '/TenantBusiness/OrderInfo/DeleteOrderInfoByID',
    method: 'post',
    data
  })
}

export function deleteTenantContractByIDs(data) {
  return request({
    url: '/TenantContract/DeleteTenantContractByIDs',
    method: 'post',
    data
  })
}

export function tenantWithDrawByID(data) {
  return request({
    url: '/TenantContract/WithDrawByID',
    method: 'post',
    data
  })
}

// 房源预约
export function AddAppointmentInfo(data) {
  return request({
    url: '/AppointmentInfo/AddAppointmentInfo',
    method: 'post',
    data
  })
}

// 已看房模拟接口
export function SeeHouse(data) {
  return request({
    url: '/AppointmentInfo/UpdateAppontById',
    method: 'post',
    data
  })
}

// 预定列表
export function GetOderList(data) {
  return request({
    url: '/OperateMethod/SelectOrderInfoByPage',
    method: 'post',
    data
  })
}
// 获取租客合同列表
export function AppGetContractTenantList(data) {
  return request({
    url: '/TenantContract/FindTenantContractListPage',
    method: 'post',
    data
  })
}
// 获取租客电子签约合同列表
export function QueryTenantElectronicList(data) {
  return request({
    url: '/OperateMethod/QueryTenantElectronicList',
    method: 'post',
    data
  })
}
// App获取租客合同列表
export function AppFindTenantContractListPage(data) {
  return request({
    url: '/TenantContract/AppFindTenantContractListPage',
    method: 'post',
    data
  })
}
// 获取租客合同详情
export function AppGetContractTenantDetail(data) {
  return request({
    url: '/TenantContract/ShowTenantContractInfoByTenantID',
    method: 'post',
    data
  })
}
// 获取租客合同的 暂存& 待确认 & 快要到期 & 已到期 的合同数量
export function AppGetTenantContractNumber(data) {
  return request({
    url: '/TenantContract/QueryTenantContractNumber',
    method: 'post',
    data
  })
}
// --获取预约列表----
export function GetReserveList(data) {
  return request({
    url: '/AppointmentInfo/FindAppointListPage',
    method: 'post',
    data
  })
}

// 获取合同详情
export function getContractDetail(data) {
  return request({
    url: '/TenantContract/ShowTenantContractInfoByTenantID',
    method: 'post',
    data
  })
}

// 创建账单
export function getTenantBill(data) {
  return request({
    url: '/CalculationMethod/GetNewTenantBill',
    method: 'post',
    data
  })
}
// 新增合同
export function insertTenantContract(data) {
  return request({
    url: '/TenantContract/InsertTenantContract',
    method: 'post',
    data
  })
}

// 修改合同
export function editTenantContract(data) {
  return request({
    url: '/TenantContract/EditTenantContract',
    method: 'post',
    data
  })
}

// 手机端租客合同签字
export function mobileTenantSign(data) {
  return request({
    url: '/TenantContract/MobileTenantSign',
    method: 'post',
    data
  })
}

//获取空置房源信息
export function mobileGetVanantHouse(data) {
  return request({
    url: '/SystemMethod/ShowOrganizationList',
    method: 'post',
    data
  })
}

// 合同PDF接口
export function viewPDFContract(data) {
  return request({
    url: '/FDD/FDD/ViewContract',
    method: 'post',
    data
  })
}

// 查询房源合同状态
export function QueryHouseContractStatus(data) {
  return request({
    url: '/TenantContract/QueryHouseIsHaveTenantContract',
    method: 'post',
    data
  })
}

// 添加转租协议
export function InsertSubletAgreement(data) {
  return request({
    url: '/TenantAfterSale/InsertSubletAgreement',
    method: 'post',
    data
  })
}

// 修改转租协议
export function EditSubletAgreement(data) {
  return request({
    url: '/TenantAfterSale/EditSubletAgreement',
    method: 'post',
    data
  })
}

// 查询转租协议
export function QuerySubletAgreement(data) {
  return request({
    url: '/TenantAfterSale/QuerySubletAgreement',
    method: 'post',
    data
  })
}

// 转租协议提交审核
export function SubmitSubletApproval(data) {
  return request({
    url: '/TenantAfterSale/SubmitSubletApproval',
    method: 'post',
    data
  })
}

// 退房协议提交审核
export function SubmitCheckoutApproval(data) {
  return request({
    url: '/TenantAfterSale/SubmitTenCheckOutAudit',
    method: 'post',
    data
  })
}

// 退房查询签字
export function SearchCheckOutSign(data) {
  return request({
    url: '/TenantAfterSale/SelectTenCheckOutSignInfo',
    method: 'post',
    data
  })
}

// 转租查询签字
export function SearchAfterSaleSign(data) {
  return request({
    url: '/TenantAfterSale/QuerySubletSignInfo',
    method: 'post',
    data
  })
}

// 租客合同退房清单
export function InsertTenCheckOutAgreement(data) {
  return request({
    url: '/TenantAfterSale/InsertTenCheckOutAgreement',
    method: 'post',
    data
  })
}
// 租客合同退房清单(详情)
export function SelectTenCheckOutAgreement(data) {
  return request({
    url: '/TenantAfterSale/SelectTenCheckOutAgreement',
    method: 'post',
    data
  })
}
// 租客合同退房清单(修改)
export function UpdateTenCheckOutAgreement(data) {
  return request({
    url: '/TenantAfterSale/UpdateTenCheckOutAgreement',
    method: 'post',
    data
  })
}
