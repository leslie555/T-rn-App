import request from '../utils/request'

// 修改密码
export function ModifyPwd(data) {
  return request({
    url: '/SystemMethod/ModifyPwd',
    method: 'post',
    data
  })
}

// 查询消息列表
export function ShowMessagePush(data) {
  return request({
    url: '/System/MessagePush/ShowMessagePush',
    method: 'post',
    data
  })
}

// 信息详细内容查询
export function FindMessagePush(data) {
  return request({
    url: '/MessagePush/FindMessagePush',
    method: 'post',
    data
  })
}

// 查询未读消息条数
export function FindReadCount(data) {
  return request({
    url: '/System/MessagePush/FindReadCount',
    method: 'post',
    data
  })
}

// 查询今日备忘录
export function FindMemoTodayList(data) {
  return request({
    url: '/SystemMethod/FindMemoTodayList',
    method: 'post',
    data
  })
}

// 查询非今日备忘录
export function FindMemoList(data) {
  return request({
    url: '/SystemMethod/FindMemoList',
    method: 'post',
    data
  })
}

// 查询备忘录详情
export function FindMemo(data) {
  return request({
    url: '/SystemMethod/FindMemo',
    method: 'post',
    data
  })
}
// 新增备忘录
export function InsertMemo(data) {
  return request({
    url: '/SystemMethod/InsertMemo',
    method: 'post',
    data
  })
}

// 修改备忘录
export function EditMemo(data) {
  return request({
    url: '/SystemMethod/EditMemo',
    method: 'post',
    data
  })
}

// 删除备忘录
export function DelMemoByID(data) {
  return request({
    url: '/SystemMethod/DelMemoByID',
    method: 'post',
    data
  })
}

// 意见反馈
export function Addopinion(data) {
  return request({
    url: '/SystemMethod/Addopinion',
    method: 'post',
    data
  })
}

// 查看审批列表
export function QueryApplyList(data) {
    return request({
        url:  '/system/ApplyAudit/QueryApplyList',
        method: 'post',
        data
    })
}

// 查看审批详情
export function QueryApplyByID(data) {
    return request({
        url:  '/Tool/Tool/QueryApplyByID',
        method: 'post',
        data
    })
}

// 租客&业主违约近六月主页面
export function QueryAgentBreachContract(data) {
    return request({
      url: '/OperateMethod/SelectWholeDefault',
      method: 'post',
      data
    })
}

// 租客&业主违约列表
export function QueryAgentBreachList(data) {
    return request({
      url: '/OperateMethod/SelectDefault',
      method: 'post',
      data
    })
}

// 租客到期
export function QueryAgentTenantExpire(data) {
    return request({
      url: '/OperateMethod/QueryTenantExpiresList',
      method: 'post',
      data
    })
}
