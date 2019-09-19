import request from '../utils/request'
// 首页备忘录查询
export function FindMemo(data) {
  return request({
    url: '/SystemMethod/FindMemo',
    method: 'post',
    data
  })
}

// 今日消息
export function ShowMessagePush(data) {
  return request({
      url: '/MessagePush/ShowMessagePush',
      method: 'post',
      data
  })
}

// 首页数据查询
export function HomePageData(data) {
  return request({
    url: '/SystemMethod/HomePage',
    method: 'post',
    data
  })
}
