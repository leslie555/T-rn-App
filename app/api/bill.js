import request from '../utils/request'

// 获取聚合支付账单列表
export function QueryAggPaymentList(data) {
    return request({
        url: '/Tool/Tool/QueryAggPaymentList',
        method: 'post',
        data
    })
}

// 获取聚合支付详情
export function GetAggPaymentDetail(data) {
    return request({
        url: '/Tool/Tool/GetAggPaymentDetail',
        method: 'post',
        data
    })
}

// 记账本添加记账
export function InsertBookKeep(data) {
    return request({
        url: '/OperateMethod/InsertBookKeep',
        method: 'post',
        data
    })
}

// 记账本修改记账
export function UpdateBookKeep(data) {
    return request({
        url: '/OperateMethod/UpdateBookKeep',
        method: 'post',
        data
    })
}

