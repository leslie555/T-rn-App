import request from '../utils/request'

// 获取支付宝/微信二维码
export function GetPayCode(data) {
  return request({
    url: '/Individual/HuiFu/GetBookKeepPayCode',
    method: 'post',
    data
  })
}

// 查看是否支付成功
export function QueryPayStatus(data) {
  return request({
    url: '/Individual/HuiFu/QueryPayStatus',
    method: 'post',
    data
  })
}

// 聚合支付生成二维码接口
export function GetPayCodeBatch(data) {
  return request({
    url: '/Tool/Tool/GetPayCodeBatch',
    method: 'post',
    data
  })
}
// 费用报销列表
export function ShowReimbursement(data) {
  return request({
    url: '/SystemMethod/ShowReimbursement',
    method: 'post',
    data
  })
}
// 费用报销详情
export function ShowReimbursementDetails(data) {
  return request({
    url: '/SystemMethod/ShowReimbursementDetails',
    method: 'post',
    data
  })
}
// 费用报销新增
export function AddReimbursement(data) {
  return request({
    url: '/SystemMethod/AddReimbursement',
    method: 'post',
    data
  })
}
// 费用报销修改
export function EditReimbursement(data) {
  return request({
    url: '/SystemMethod/EditReimbursement',
    method: 'post',
    data
  })
}
