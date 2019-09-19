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
