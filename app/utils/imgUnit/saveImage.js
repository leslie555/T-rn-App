import {Alert, CameraRoll, Platform} from "react-native";
import RNFS from "react-native-fs";
import {permissionsWES} from "../../utils/permissionAndroid";

export default function saveImage(uri, type = 'jpg', str = '') {
  if (!uri) return null;
  return new Promise((resolve, reject) => {
    permissionsWES().then(() => {
      let dirs = Platform.OS === 'ios' ? (type === 'jpg' ? RNFS.LibraryDirectoryPath : RNFS.DocumentDirectoryPath) : (type === 'jpg' ? RNFS.ExternalStorageDirectoryPath : RNFS.ExternalDirectoryPath); //外部文件，共享目录的绝对路径（仅限android）
      const downloadDest = `${dirs}/${str}${((Math.random() * 10000000) | 0)}.${type}`;
      const formUrl = uri;
      const options = {
        fromUrl: formUrl,
        toFile: downloadDest,
        background: true,
        begin: (res) => {
          console.log('begin');
          console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
        },
      };
      try {
        const ret = RNFS.downloadFile(options);
        ret.promise.then(res => {
          debugger
          console.log('success', res);
          console.log('file://' + downloadDest)
          if (type === 'jpg') {
            var promise = CameraRoll.saveToCameraRoll(downloadDest);
            promise.then(function (result) {
              Alert.alert(
                  '温馨提示',
                  '图片保存成功',
                  [
                    {text: '确定'},
                  ],
                  {cancelable: false}
              )
              resolve(result);
            }).catch(function (error) {
              Alert.alert(
                  '温馨提示',
                  '图片保存失败',
                  [
                    {text: '确定'},
                  ],
                  {cancelable: false}
              )
              reject(new Error(error))
            });
          } else if (type === 'pdf') {
            resolve(downloadDest)
          }
        }).catch(err => {
          reject(new Error(err))
        });
      } catch (e) {
        reject(new Error(e))
      }
    }).catch(e => {
      reject(new Error(e))
    })
  })
}
