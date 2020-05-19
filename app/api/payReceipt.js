import request from '../utils/request'

export function GetPaymentListNew(data) {
    return request({
        url: '/System/FinanceNew/QueryPaymentNew',
        method: 'post',
        data
    })
}

// 修改过后的查询新的收款单列表的数据
export function GetReceiveListNew(data) {
    return request({
        url: '/System/FinanceNew/QueryReceiptNew',
        method: 'post',
        data
    })
}

// 添加收款单（新）
export function AddReceiveSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddReceiptNew',
    method: 'post',
    data
  })
}

// 修改收款单接口（新）
export function EditReceiveSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddReceiptNew',
    method: 'post',
    data
  })
}

// 添加付款单的接口（新）
export function AddPaymentSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddPaymentNew',
    method: 'post',
    data
  })
}

// 修改付款单接口(新)
export function EditPaymentSingleNew(data) {
  return request({
    url: '/System/FinanceNew/AddPaymentNew',
    method: 'post',
    data
  })
}

// 根据搜索的房源拉取账单列表数据（新）
export function GetBillListData(data) {
  return request({
    url: '/System/FinanceNew/QueryHouseBillList',
    method: 'post',
    data
  })
}

// 付款账户列表应用
export function GetPaymentAccount(data) {
  return request({
    url: '/VirtualCapital/QueryAccountByBusinessID',
    method: 'post',
    data
  })
}

// 获取付款单详情的接口(新)
export function GetPaymentDetailsNew(data) {
  return request({
    url: '/System/FinanceNew/QueryPaymentNewSinge',
    method: 'post',
    data
  })
}

// 获取收款单详情的接口(新)
export function GetReceiptDetailsNew(data) {
  return request({
    url: '/System/FinanceNew/QueryReceiptNewSinge',
    method: 'post',
    data
  })
}

// 核销收付款单(新)
export function VerificationNew(data) {
  return request({
    url: '/System/FinanceNew/NewVerification',
    method: 'post',
    data
  })
}

// 删除收款单
export function DeleteReceiptNew(data) {
  return request({
    url: '/System/FinanceNew/DeleteReceiptNew',
    method: 'post',
    data
  })
}

// 删除付款单
export function DeletePaymentNew(data) {
  return request({
    url: '/System/FinanceNew/DeletePaymentNew',
    method: 'post',
    data
  })
}
