import { Animated } from 'react-native'
const listOnScroll = option => {
  return e => {
    const y = e.nativeEvent.contentOffset.y
    const delta = y - option.startY
    if (
      (y < option.headerHeight && option.isHeaderShow) ||
      (Math.abs(delta) < 80 && y > option.headerHeight)
    )
      return

    if (delta > 0 && option.isHeaderShow) {
      Animated.timing(option.animation, {
        toValue: 0,
        useNativeDriver: true
      }).start()
      option.isHeaderShow = false
    } else if (!option.isHeaderShow && delta < 0) {
      Animated.timing(option.animation, {
        toValue: 1,
        useNativeDriver: true
      }).start()
      option.isHeaderShow = true
    }
  }
}

export default listOnScroll
