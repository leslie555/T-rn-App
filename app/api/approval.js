import request from '../utils/request'


// 我的审批批量审核
export function BatchExcuteAudit(data) {
    return request({
        url: '/ApplyAudit/BatchExcuteAudit',
        method: 'post',
        data
    })
}

// 采购部审核列表
export function CGBApprovalList(data) {
  return request({
    url: '/CompanyMethod/CGBApprovalList',
    method: 'post',
    data
  })
}
// 采购部审核按钮
export function CGBApprovalOperation(data) {
  return request({
    url: '/CompanyMethod/CGBApprovalOperation',
    method: 'post',
    data
  })
}
