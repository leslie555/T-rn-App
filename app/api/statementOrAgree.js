import request from '../utils/request'

// 新增合同解除同意书
export function AddConsentTerminateContract(data) {
    return request({
        url: '/OwnerContract/OwnerContract/AddConsentTerminateContract',
        method: 'post',
        data
    })
}

// 合同解除同意书详情
export function ConsentTerminateContractDetail(data) {
  return request({
      url: '/OwnerContract/OwnerContract/ShowConsentTerminateContractByID',
      method: 'post',
      data
  })
}

// 修改合同解除同意书
export function UpdateConsentTerminateContract(data) {
    return request({
        url: '/OwnerContract/OwnerContract/UpdateConsentTerminateContract',
        method: 'post',
        data
    })
}

// 合同解除同意书列表查询
export function ShowConsentTerminateContractList(data) {
    return request({
        url: '/OwnerContract/OwnerContract/ShowConsentTerminateContractList',
        method: 'post',
        data
    })
}

// 合同解除同意书列表查询
export function SelectConsentTerminateContractSignInfo(data) {
    return request({
        url: '/OwnerContract/OwnerContract/SelectConsentTerminateContractSignInfo',
        method: 'post',
        data
    })
}
