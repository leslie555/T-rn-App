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

// 同意免租说明书--列表
export function QueryAgreeRentFreeList(data) {
    return request({
      url: '/OwnerContract/OwnerContract/QueryAgreeRentFreeList',
      method: 'post',
      data
    })
}

// 同意免租说明书--详情
export function AgreeRentFreeDetail(data) {
    return request({
      url: '/OwnerContract/OwnerContract/QueryAgreeRentFreeInfo',
      method: 'post',
      data
    })
}

// 同意免租说明书--新增
export function InsertAgreeRentFree(data) {
  return request({
    url: '/OwnerContract/OwnerContract/InsertAgreeRentFree',
    method: 'post',
    data
  })
}

// 同意免租说明书--修改
export function UpdateAgreeRentFree(data) {
    return request({
      url: '/OwnerContract/OwnerContract/UpdateAgreeRentFree',
      method: 'post',
      data
    })
}

// 同意免租说明书-签字查询
export function QueryOwnerBookSignInfo(data) {
    return request({
      url: '/OwnerContract/OwnerContract/QueryOwnerBookSignInfo',
      method: 'post',
      data
    })
}

// 同意免租说明书-暂存
export function TempAgreeRentFreeInfo(data) {
    return request({
      url: '/OwnerContract/OwnerContract/TempAgreeRentFreeInfo',
      method: 'post',
      data
    })
}