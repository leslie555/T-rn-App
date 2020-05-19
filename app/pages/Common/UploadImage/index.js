import React, {Component} from 'react'
import {Header, ImageViewer, AliImage} from '../../../components'
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native'
import {CommonColor, Container, DEVICE_WIDTH, DisplayStyle} from '../../../styles/commonStyles'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker'
import {ProgressButton} from 'react-native-progress-button'
import {baseURL} from '../../../config/index'
import storage from '../../../utils/storage'
import uuid from '../../../utils/uuid'
import {connect} from 'react-redux'
import {setUploadImg} from '../../../redux/actions/uploadImg'
import Toast from "react-native-root-toast";
import IconFont from "../../../utils/IconFont";
import { MakeAutograph, imageUpDirect } from '../../../api/system'

class UploadImageScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      imgArr: [],
      imgIdx: 0,
      viewData: [],
      showImageView: false,
      loading: false
    }
    this.maxLength = this.props.navigation.getParam('maxLength', 20)
    this.limitSize = this.props.navigation.getParam('limitSize', 20)
    this.scrollRef = null
    this.url = ''
    this.signInfo = {}
  }

  componentWillMount() {
    const path = this.props.navigation.getParam('path', '')
    if (path) {
      this.setState({path})
    }

    storage.get('token').then(token => {
      this.url = `${baseURL}/SystemMethod/imageUp?Token=${token}`
    })
  }

  uploadImage(url, imgAry) {
    let formData = new FormData() // 因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
    for (var i = 0; i < imgAry.length; i++) {
      let file = {
        uri: imgAry[i],
        type: 'application/octet-stream',
        name: 'image.png'
      } //这里的key(uri和type和name)不能改变,
      formData.append('file', file) //这里的files就是后台需要的key
    }
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
  }

  onPress = () => {
    if(this.state.imgArr.length>=this.maxLength){
      Toast.show(`一次最多上传${this.maxLength}张，请删除后再添加`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.ActionSheet.show()
  }

  onActionSheetPress(idx) {
    // idx:0=>拍照,1=>从图库选取
    if (idx === 0) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
        compressImageQuality: 0.9,
        cropperChooseText: '选取',
        cropperCancelText: '取消'
      }).then(image => {
        const imgArr = [...this.state.imgArr]
        imgArr.push(image)
        const viewData = imgArr.map((x) => {
          return {
            ImageLocation: x.path
          }
        })
        this.setState({
          imgArr,
          viewData
        })
      })
    } else if (idx === 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: true,
        maxFiles: this.maxLength,
        compressImageQuality: 0.8,
        mediaType: 'photo'
      }).then(images => {
        const imgArr = [...this.state.imgArr]
        // 去重和去掉大图片
        let flag = false
        images = images.filter(x=>{
          console.log(x.size)
          const sizeFlag = x.size>this.limitSize*1024*1024
          if(sizeFlag){
            flag = true
          }
          return imgArr.findIndex(y=>y.path===x.path)===-1&&!sizeFlag
        })
        if(flag){
          Toast.show(`已过滤大于${this.limitSize}m的图片`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        }
        if(imgArr.length+images.length>this.maxLength){
          images.length = this.maxLength -imgArr.length
          !flag&&Toast.show(`一次最多上传${this.maxLength}张`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        }
        imgArr.push(...images)
        const viewData = imgArr.map((x) => {
          return {
            ImageLocation: x.path
          }
        })
        this.setState({
          imgArr,
          viewData
        })
      })
    }
  }

  openImageView(index) {
    // Alert.alert('温馨提示', this.state.imgArr[0].path, [
    //   {text: '确认', onPress: () =>{}}
    // ])
    this.setState({
      showImageView: true,
      imgIdx: index
    })
  }

  deleteImage(index) {
    this.state.imgArr.splice(index, 1)
    this.state.viewData.splice(index, 1)
    this.setState({
      imgArr: this.state.imgArr,
      viewData: this.state.viewData
    })
  }

  onContinuePress = async (event, buttonState, progress) => {
    if (this.state.loading) return
    const {navigation} = this.props
    if (this.state.imgArr.length === 0) {
      Toast.show('请先添加图片!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.setState({
      loading: true
    })
    console.log(this.state.imgArr)
    this.uploadAll(this.state.imgArr)
    // let res = await this.uploadImage(
    //     this.url,
    //     this.state.imgArr.map(v => v.path)
    // )
    // try {
    //   this.setState({
    //     loading: false
    //   })
    //   res = JSON.parse(res._bodyInit)
    //   Alert.alert('温馨提示', '图片上传成功', [
    //     {
    //       text: '确认', onPress: () => {
    //         this.props.dispatch(
    //             setUploadImg({
    //               type: navigation.getParam('type', 'EditOwnerContract'),
    //               id: navigation.getParam('id', 666),
    //               data: res.Data
    //             })
    //         )
    //         this.props.navigation.goBack()
    //       }
    //     }
    //   ], {cancelable: false})
    // } catch (error) {
    //   Toast.show('上传失败，请重新上传!', {
    //     duration: Toast.durations.SHORT,
    //     position: Toast.positions.BOTTOM
    //   })
    // }
    // let res = JSON.parse(
    //   `[{"KeyID":63881,"UniqueCode":"","ImageLocation":"/funrenting/636921541519977249","IsDelete":0,"AddTime":"0001-01-01T00:00:00","AddUser":null,"ModifyUser":null,"ModifyStatus":0},{"KeyID":63880,"UniqueCode":"","ImageLocation":"/funrenting/636921541517374193","IsDelete":0,"AddTime":"0001-01-01T00:00:00","AddUser":null,"ModifyUser":null,"ModifyStatus":0}]`
    // )
    // this.props.dispatch(
    //   setUploadImg({
    //     type: navigation.getParam('type', 'EditOwnerContract'),
    //     id: navigation.getParam('id', 666),
    //     data: res
    //   })
    // )
  }

  uploadAll(imgs) {
    // 上传所有图片
    this.getSignature().then(sign => {
      const promiseArr = []
      const imgArr = []
      imgs.forEach((file) => {
        let mime = ''
        switch(file.mime) {
          case 'image/jpeg':
            mime = '.jpg'
            break
          case 'image/jpg':
            mime = '.jpg'
            break
          case 'image/png':
            mime = '.png'
            break
        }
        const newKey = sign.dir + new Date().getTime() + `_` + uuid() + mime
        // file.name = newKey // TODO
        promiseArr.push(
          this.uploadOSSSingle(file.path, {
            ...sign,
            key: newKey
          })
        )
        imgArr.push({
          ImageLocation: '/' + newKey,
          UniqueCode: ''
        })
      })
      Promise.all(promiseArr).then(() => {
        // 图片上传并保存
        imageUpDirect({
          imageUploads: imgArr
        }).then((res) => {
          Alert.alert('温馨提示', '图片上传成功', [
            {
              text: '确认', onPress: () => {
                this.props.dispatch(
                    setUploadImg({
                      type: this.props.navigation.getParam('type', 'EditOwnerContract'),
                      id: this.props.navigation.getParam('id', 666),
                      data: res.Data
                    })
                )
                this.props.navigation.goBack()
              }
            }
          ], {cancelable: false})
        }).catch((e) => {
          Toast.show('上传失败，请重新上传1!', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        })
      }).catch(() => {
        Toast.show('上传失败，请重新上传0!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
      })
    })
  }

  getSignature() {
    return new Promise((resolve, reject) => {
      if (this.signInfo.key) {
        resolve({ ...this.signInfo })
      } else {
        MakeAutograph()
          .then(({ Data }) => {
            this.signInfo = JSON.parse(Data)
            console.log(this.signInfo)
            resolve({ ...this.signInfo })
          })
          .catch(e => {
            reject(e)
          })
      }
    })
  }

  uploadOSSSingle(fileUri, sign) {
    return new Promise((resolve,reject) => {
      const param = new FormData()
      param.append('key', sign.key)
      param.append('policy', sign.policy)
      param.append('OSSAccessKeyId', sign.accessid)
      param.append('success_action_status', '200')
      param.append('callback', sign.callback)
      param.append('signature', sign.signature)
      param.append('file', {
        uri: fileUri,
        type: 'application/octet-stream',
        name: 'image.png'
      })
      try {
        fetch(sign.host, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: param
        }).then(() => {
          resolve()
        })
      } catch(e) {
        console.log(e)
        reject(e)
      }
    })
  }

  render() {
    const images = this.state.imgArr.map((val, idx) => {
      return (
          <TouchableOpacity
              style={style.imgContainer}
              onPress={() => {
                this.openImageView(idx)
              }}
              key={idx}
          >
            <AliImage
                style={style.imageItem}
                source={{
                  uri: `${val.path}`
                }}
            />
            <TouchableOpacity style={style.upload_del_btn} onPress={() => this.deleteImage(idx)}>
              <IconFont name='jiahao1' size={12} color='#fff'/>
            </TouchableOpacity>
          </TouchableOpacity>
      )
    })
    return (
        <View style={{...Container}}>
          <Header title={'上传图片'}/>
          <ImageViewer data={this.state.viewData} visible={this.state.showImageView} index={this.state.imgIdx}
                       onlyView={true} onClose={() => {
            this.setState({
              showImageView: false
            })
          }}/>
          <View style={style.contentContainer}>
            <ScrollView
                ref={ref => this.scrollRef = ref}
                style={{flex: 1}}
            >
              <View style={style.scrollContainer}>
                <TouchableHighlight
                    underlayColor={'#c7c7cc'}
                    onPress={() => {
                      this.onPress()
                    }}
                    style={style.plusContainer}
                >
                  <Text style={{fontSize: 30}}>+</Text>
                </TouchableHighlight>
                {images}
              </View>
            </ScrollView>
          </View>

          <View style={style.bottomContainer}>
            <ProgressButton
                text={this.state.loading ? '上传中...' : '点击上传'}
                onPress={this.onContinuePress}
            />
          </View>

          <ActionSheet
              ref={o => (this.ActionSheet = o)}
              title={'选择图片'}
              options={['拍照', '从图库选取', '取消']}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={idx => {
                this.onActionSheetPress(idx)
              }}
          />
        </View>
    )
  }
}

const style = StyleSheet.create({
  contentContainer: {
    width: DEVICE_WIDTH - 10,
    flex: 1,
    margin: 5,
    backgroundColor: CommonColor.color_white,
    borderRadius: 10
  },
  scrollContainer: {
    flex: 1,
    flexWrap: 'wrap',
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    paddingBottom: 20
  },
  bottomContainer: {
    width: DEVICE_WIDTH,
    ...DisplayStyle('row', 'center', 'center'),
    height: 100
  },
  plusContainer: {
    width: 110,
    height: 110,
    marginLeft: 5,
    marginTop: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#c0ccda',
    backgroundColor: '#fbfdff',
    ...DisplayStyle('row', 'center', 'center'),
    borderRadius: 10
  },
  imgContainer: {
    marginLeft: 5,
    marginTop: 5,
    width: 110,
    height: 110,
    ...DisplayStyle('row', 'center', 'center'),
    borderRadius: 10,
    backgroundColor: '#aaa'
  },
  imageItem: {resizeMode: 'cover', height: 110, width: 110, borderRadius: 10},
  upload_del_btn: {
    ...DisplayStyle('row', 'center', 'center'),
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    backgroundColor: '#333',
    borderRadius: 20,
    opacity: .7
  },
})

export default connect()(UploadImageScreen)
