import request from '../utils/request'


// 我的审批批量审核
export function BatchExcuteAudit(data) {
    return request({
        url: '/ApplyAudit/BatchExcuteAudit',
        method: 'post',
        data
    })
}
