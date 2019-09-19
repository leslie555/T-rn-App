import request from '../utils/request'

// 获取报修列表
export function getRepairTableList(data) {
    return request({
        url: '/TenantBusiness/MRepairInfo/ShowMRepairInfo',
        method: 'post',
        data
    })
}
// 查询报修详情
export function FindRepAirInfo(data) {
    return request({
        url: '/TenantBusiness/MRepairInfo/FindRepAirInfo',
        method: 'post',
        data
    })
}

// 新增报修
export function addRepairTableList(data = {}) {
  return request({
    url: '/TenantBusiness/MRepairInfo/AddMRepairInfo',
    method: 'post',
    data
  })
}

// 修改报修
export function editRepairItem(data = {}) {
  return request({
    url: '/TenantBusiness/MRepairInfo/EditMRepairInfo',
    method: 'post',
    data
  })
}