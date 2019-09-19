/*
 *  fetch 模拟 axios
 * */

import {baseURL} from '../../config'
import storage from '../../utils/storage'
import {logFrontOutAction} from '../../redux/actions/user'
import store from '../../redux/store/store'
import NavigationService from '../../router/NavigationService'
import Toast from "react-native-root-toast";
import {trimObject} from "../../utils/arrUtil";

// 引入 请求数据组件
const timeout = 50000
// 引入
// 工具函数
const toParam = function (obj) {
  var param = ''
  for (const name in obj) {
    if (typeof obj[name] !== 'function') {
      param += '&' + name + '=' + encodeURI(obj[name])
    }
  }
  return param
}

const request = function (options) {
  return new Promise((resolve, reject) => {
    trimObject(options.data)
    trimObject(options.param)
    storage.get('token').then(token => {
      let url = baseURL + options.url + `?Token=${token || '666'}`
      if (options.method === 'get') {
        options.method = 'GET'
        url += toParam(options.param)
      } else {
        options.method = 'POST'
        options.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
        options.body = JSON.stringify(options.data)
      }
      fetch(url, options).then(res => {
        const {ok, _bodyText} = res
        const data = JSON.parse(_bodyText)
        if (ok) {
          if (data.Code === 0) {
            return resolve(data)
          } else if (data.Code === 1) {
            Toast.show(data.Msg || '请求失败，请稍后再试！', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
          } else {
            console.log('登录过期')
            // 登录过期
            store.dispatch(logFrontOutAction())
            Toast.show('登录过期,请重新登录!', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            NavigationService.navigate('Auth')
          }
          return reject(new Error('error'))
        } else {
          Toast.show('请求失败,请检查网络!', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return reject(new Error('error'))
        }
      }).catch((err) => {
        Toast.show('请求失败,请检查网络!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return reject(new Error('error'))
      })
    })
  })
}
const timeoutRequest = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, timeout)
  })
}
export default function (options) {
  return new Promise((resolve, reject) => {
    Promise.race([request(options), timeoutRequest()]).then(
        res => {
          return resolve(res)
        },
        err => {
          if (err && err.message === 'timeout') {
            Toast.show('请求超时,请检查网络!', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
          } else {
            //
          }
          return reject(err || {})
        }
    )
  })
}
