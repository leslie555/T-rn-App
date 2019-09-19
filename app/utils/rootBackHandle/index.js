import {BackHandler, Platform} from "react-native";
import Toast from "react-native-root-toast";

export default class rootBackHandle {
  constructor(navigation) {
    this.navigation = navigation
    this.timer = null
    this.backHandler = null
    this.backCount = 0
    this.backHandlerStatus = 0 // 0 remove 1 register
    this.didFocusSubscription = null
    this.willBlurSubscription = null
    this.init()
  }

  init() {
    this.didFocusSubscription = this.navigation.addListener(
        'didFocus',
        payload => {
          // console.log('init')
          this.backCount = 0
          this.backHandlerStatus = 1
          this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.backHandlerStatus === 0) return
            if (this.timer) clearTimeout(this.timer)
            this.backCount++
            this.timer = setTimeout(() => {
              this.backCount--
            }, Toast.durations.SHORT)
            if (this.backCount < 2) {
              Toast.show(`再按一次退出`, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
              })
              return true
            }
            return false
          })
        }
    )
    this.willBlurSubscription = this.navigation.addListener(
        'willBlur',
        payload => {
          this.remove(1)
        }
    )
  }

  remove(type = 0) {
    // console.log('remove')
    if (this.timer) clearTimeout(this.timer)
    this.backHandlerStatus = 0
    this.backHandler&&this.backHandler.remove()
    if (type === 0) {
      this.didFocusSubscription.remove()
      this.willBlurSubscription.remove()
    }
  }
}
