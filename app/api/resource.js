import request from '../utils/request'

// 公私客列表查询
export function SelectOwnerHouseInfoList(data) {
  return request({
    url: '/Resources/Resources/SelectOwnerHouseInfoList',
    method: 'post',
    data
  })
}

// export function AddOwnerHouseInfo(data) {
//   return request({
//     url: '/Resources/Resources/AddOwnerHouseInfo',
//     method: 'post',
//     data
//   })
// }
export function AddOwnerHouseInfo(data) {
  return request({
    url: '/OperateMethod/AddOwnerHouseInfo',
    method: 'post',
    data
  })
}

export function EditOwnerHouseInfo(data) {
  return request({
    url: '/Resources/Resources/EditOwnerHouseInfo',
    method: 'post',
    data
  })
}

// 租客
// 公私客列表查询
export function ShowTenantResourcesList(data) {
  return request({
    url: '/Resources/Resources/ShowTenantResourcesList',
    method: 'post',
    data
  })
}

export function AddAssign(data) {
  return request({
    url: '/Resources/Resources/AddAssign',
    method: 'post',
    data
  })
}

export function DelOwnerHouseInfo(data) {
  return request({
    url: '/Resources/Resources/DelOwnerHouseInfo',
    method: 'post',
    data
  })
}

export function AddFollowUp(data) {
  return request({
    url: '/Resources/Resources/AddFollowUp',
    method: 'post',
    data
  })
}

export function FindFollowUp(data) {
  return request({
    url: '/Resources/Resources/FindFollowUp',
    method: 'post',
    data
  })
}

export function ChangePubOrPrivate(data) {
  return request({
    url: '/Resources/Resources/ChangePubOrPrivate',
    method: 'post',
    data
  })
}
export function OwnerChangePubOrPrivate(data) {
  return request({
    url: '/OperateMethod/OwnerChangePubOrPrivate',
    method: 'post',
    data
  })
}



// 新增租客私客
export function AddTenantResources(data) {
  return request({
    url: '/Resources/Resources/AddTenantResources',
    method: 'post',
    data
  })
}

// 编辑租客私客
export function EditTenantResources(data) {
  return request({
    url: '/Resources/Resources/EditTenantResources',
    method: 'post',
    data
  })
}

// 查询跟进详情
export function ShowFollowUpList(data) {
  return request({
    url: '/Resources/Resources/ShowFollowUpList',
    method: 'post',
    data
  })
}

// 添加租客跟进
export function AddTenantFollowUp(data) {
  return request({
    url: '/Resources/Resources/AddTenantFollowUp',
    method: 'post',
    data
  })
}

// 添加租客指派
export function AddTenantAssign(data) {
  return request({
    url: '/Resources/Resources/AddTenantAssign',
    method: 'post',
    data
  })
}

// 删除租客资源
export function DelTenantResources(data) {
  return request({
    url: '/Resources/Resources/DelTenantResources',
    method: 'post',
    data
  })
}

// 公客转私客
export function ChangeTenantPubOrPrivate(data) {
  return request({
    url: '/Resources/Resources/ChangeTenantPubOrPrivate',
    method: 'post',
    data
  })
}

//App3.0公客私客查询列表
export function QueryOwnerHouseInfoList(data) {
  return request({
    url: '/OperateMethod/SelectOwnerHouseInfoList',
    method: 'post',
    data
  })
}
