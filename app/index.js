// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  * @lint-ignore-every XPLATJSCOPYRIGHT1
//  */

import React from 'react'
import AppContainer from './router/AppRouter'
import { YellowBox, View, Dimensions, StatusBar, Platform } from 'react-native'
import { Provider } from 'react-redux'
import store from './redux/store/store'
import * as wechat from 'react-native-wechat'
import ErrorUtils from 'ErrorUtils'
import navigation from './router/NavigationService'
import storage from './utils/storage'
import './utils/initUtil.js'
import {addAppExceptionLog} from './api/system.js'

if (!__DEV__) {
  // 捕获异常
  ErrorUtils.setGlobalHandler(function(err) {
    storage.remove('token')
    storage.remove('userinfo')
    storage.remove('enum')
    addAppExceptionLog({
      context: err.message +'割割割'+err.stack,
      isError: true
    })
    navigation.navigate('Auth')
  })
  global.console = { // 发布环境移除所有console
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {}
  }
}
// 忽略所有警告
console.ignoredYellowBox = [
  'Warning: BackAndroid is deprecated. Please use BackHandler instead.',
  'source.uri should not be an empty string',
  'Invalid props.style key'
]
console.disableYellowBox = true // 关闭全部黄色警告

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest

const { width } = Dimensions.get('window')

export default class App extends React.Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('#00000000', true)
    }
  }
  componentDidMount() {
    wechat.registerApp('wx8f1b14015f1f307d')
  }
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}
