import {
  checkUpdate,
  currentVersion,
  downloadUpdate,
  isFirstTime,
  markSuccess,
  packageVersion,
  switchVersion
} from './react-native-update'
import {Alert, Linking, NativeAppEventEmitter, Platform} from 'react-native'
import _updateConfig from '../../../update.json'
import {setUpdateStatus} from "../../redux/actions/appUpdate"
import store from '../../redux/store/store'
import DownloadModal from './DownloadModal'

const {appKey} = _updateConfig[Platform.OS]

const checkAppUpdate = function (type = 0) {
  if (type === 0 && __DEV__) return
  if (isFirstTime) {
    markSuccess()
  }
  checkUpdate(appKey)
      .then(info => {
        if (info.expired) {
          downloadWithOpenLink(info)
        } else if (info.upToDate) {
          if (type !== 0) {
            Alert.alert('提示', '当前已是最新版本.');
          }
        } else {
          Alert.alert(
              '提示',
              '检查到新的版本' + info.name + ',是否下载?\n' + info.description,
              [
                {
                  text: '是',
                  onPress: () => {
                    doUpdate(info)
                  }
                }
              ],
              {cancelable: false}
          )
        }
      })
      .catch(err => {
        if (type !== 0) {
          Alert.alert('提示', '网络原因，检测更新失败.')
        }
      })
}

const downloadWithOpenLink = function (info) {
  Alert.alert(
      '提示',
      '您的应用版本已更新,请前往应用商店下载新的版本',
      [
        {
          text: '确定',
          onPress: () => {
            downloadWithOpenLink(info)
            // Linking.openURL(realDownloadUrl[Platform.OS])
            info.downloadUrl && Linking.openURL(info.downloadUrl)
          }
        }
      ],
      {cancelable: false}
  )
}

const doUpdate = function (info) {
  store.dispatch(setUpdateStatus(1))
  // 拿不到progress  gg
  // NativeAppEventEmitter.addListener('RCTHotUpdateDownloadProgress',(params)=>{
  //   // store.dispatch(setUpdateProgress(1))
  //   Toast.show(JSON.stringify(params)||`123`, {
  //     duration: Toast.durations.SHORT,
  //     position: Toast.positions.BOTTOM
  //   })
  // })
  info.platform = Platform.OS
  // Alert.alert(`提示`,JSON.stringify(info))
  downloadUpdate(info)
      .then(hash => {
        store.dispatch(setUpdateStatus(2))
        setTimeout(() => {
          store.dispatch(setUpdateStatus(0))
          switchVersion(hash)
        }, 1000)
      })
      .catch(err => {
        store.dispatch(setUpdateStatus(0))
        Alert.alert('提示', '更新失败,请重启应用重试，如果还是不能更新，请联系管理员。')
      })
}

export {
  checkAppUpdate,
  packageVersion,
  currentVersion,
  DownloadModal
}
