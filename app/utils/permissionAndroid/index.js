import {PermissionsAndroid,Platform} from "react-native";

export function permissionsWES(){
  return new Promise((resolve,reject)=>{
    if(Platform.OS === 'ios'){
      resolve()
    }else {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(data => {
        if (!data) {
          PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: '提示',
                message:
                    '是否允许访问您设备上的照片、媒体内容和文件',
                buttonNeutral: '稍后提示',
                buttonNegative: '取消',
                buttonPositive: '确定',
              }
          ).then(data=>{
            if (data === PermissionsAndroid.RESULTS.GRANTED) {
              resolve()
            } else {
              reject(new Error('用户拒绝'))
            }
          }).catch(err=>{
            reject(new Error(err))
          })
        }else {
          resolve()
        }
      }).catch(err=>{
        reject(new Error(err))
      })
    }
  })
}
