import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native'
import isIphoneX from '../utils/screenUtil/isIphoneX'
// 头部高度
const APPBAR_HEIGHT = 44
export const StatusBarHeight = StatusBar.currentHeight || (isIphoneX() ? 44 : 20) // 安卓顶部状态栏的高度 IOS为20/44
export const FANAL_HEIGHT = APPBAR_HEIGHT + StatusBarHeight

export const DEVICE_WIDTH = Dimensions.get('window').width
export const DEVICE_HEIGHT = Dimensions.get('window').height + StatusBarHeight
export const _1PX = 1 / PixelRatio.get()

const CommonColor = {
  color_white: '#fff',
  color_black: '#000',
  color_success: '#33cc99',
  color_warning: '#ffcc00',
  color_danger: '#ff5a5a',
  color_info: '#d7d7d7',
  color_primary: '#389ef2',
  color_text_primary: '#363636',
  color_text_regular: '#606266',
  color_text_secondary: '#909399',
  color_text_placeholder: '#c0c4cc',
  color_text_bg: '#eeeeee'
}

const Container = {
  flex: 1,
  backgroundColor: CommonColor.color_text_bg
}

const DisplayStyle = (a, b, c) => {
  return {
    flexDirection: a,
    alignItems: b,
    justifyContent: c
  }
}

export {
  CommonColor,
  Container,
  DisplayStyle
}
