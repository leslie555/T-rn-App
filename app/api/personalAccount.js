import request from '../utils/request'

// 转介绍(租客or房东)
export function QueryIntroductionList(data) {
    return request({
        url: '/OperateMethod/QueryIntroductionList',
        method: 'post',
        data
    })
}


// 业主违约
export function SelectWholeDefault(data) {
    return request({
        url: '/OperateMethod/SelectWholeDefault',
        method: 'post',
        data
    })
}


//收入记账和支出记账
export function SelectBookKeepPage(data) {
    return request({
        url: '/OperateMethod/SelectBookKeepPage',
        method: 'post',
        data
    })
}



export function SelectBookKeepByID(data) {
    return request({
        url: '/OperateMethod/SelectBookKeepByID',
        method: 'post',
        data
    })
}