import request from '../utils/request'
import packageJson from '../../package.json'
// 登陆
export function Login(username, password) {
  return request({
    url: '/SystemMethod/LoginVersion',
    method: 'post',
    data: {
      LoginCode: username,
      LoginPwd: password,
      Version: packageJson.version
    }
  })
}
// 登出
export function Logout(data) {
  return request({
    url: '/SystemMethod/ExitLogin',
    method: 'post',
    data
  })
}
// 获取所有枚举
export function getAllEnumData(data = {}) {
  return request({
    url: '/System/SystemMethod/GetEnums',
    method: 'post',
    data
  })
}
