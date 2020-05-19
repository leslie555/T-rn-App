import React, { Component, Fragment } from 'react'
import {
  Alert,
  Button,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import styles from './style'
import { withNavigation } from 'react-navigation'
import uuid from '../../utils/uuid'
import { getThumbImgUrl } from '../../utils/imgUnit'
import { ImageViewer } from '..'
import IconFont from '../../utils/IconFont'
import store from '../../redux/store/store'
import { removeUploadImg } from '../../redux/actions/uploadImg'
import Toast from "react-native-root-toast";
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker'
import { MakeAutograph, imageUpDirect } from '../../api/system'
import { AliImage, FullModal } from '../../components'

class UploadFileSingle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      index: 0,
      loadingText: '图片上传中...',
      loading: false
    }
    this.uuid = uuid()
    this.maxLength = this.props.maxLength || 20
    this.limitSize = this.props.limitSize || 20
    this.signInfo = {}
    this.didBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // console.debug('willFocus ', payload);
        if (this.props.single) return
        const imgs =
          store.getState().uploadImg[this.props.type][this.uuid] || []
        if (imgs.length > 0) {
          this.props.onChange &&
            this.props.onChange([...this.props.list, ...imgs])
          this.removeUploadImg()
        }
      }
    )
  }

  componentWillMount() {
    console.log(1)
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove()
  }

  addImage() {
    if(this.props.list.length>=this.maxLength) {
      Toast.show(`一次最多上传${this.maxLength}张，请删除后再添加`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    if (this.props.single) {
      this.ActionSheet.show()
    }else {
      this.props.navigation.navigate('AgentUploadImage', {
        type: this.props.type,
        id: this.uuid,
        maxLength: this.maxLength,
        limitSize: this.limitSize
      })
    }
  }

  deleteImage(index) {
    // const index = this.props.list.findIndex(x=>x.KeyID===id)
    this.props.list.splice(index, 1)
    this.props.onChange && this.props.onChange(this.props.list)
  }

  setCover(index) {
    const item = this.props.list[index]
    this.props.list.splice(index, 1)
    this.props.list.unshift(item)
    this.props.onChange && this.props.onChange(this.props.list)
  }

  removeUploadImg() {
    store.dispatch(
      removeUploadImg({
        type: this.props.type
      })
    )
  }

  openImageViewer(index) {
    this.setState({
      visible: true,
      index
    })
  }

  closeImageViewer() {
    this.setState({
      visible: false
    })
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
        this.uploadSingle(image)
      })
    } else if (idx === 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        compressImageQuality: 0.8,
        mediaType: 'photo'
      }).then(images => {
        this.uploadSingle(images)
      })
    }
  }

  uploadSingle(file) {
    this.setState({
      loading: true
    })
    this.getSignature().then(sign=>{
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
      this.uploadOSSSingle(file.path, {
        ...sign,
        key: newKey
      }).then(()=>{
        imageUpDirect({
          imageUploads: [{
            ImageLocation: '/' + newKey,
            UniqueCode: ''
          }]
        }).then((res) => {
          this.setState({
            loading: false
          })
          this.props.onChange &&
                this.props.onChange(res.Data)
        }).catch((e) => {
          this.setState({
            loading: false
          })
          Toast.show('上传失败，请重新上传1!', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        })
      }).catch(() => {
        this.setState({
          loading: false
        })
        Toast.show('上传失败，请重新上传0!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
      })
    }).catch(() => {
      this.setState({
        loading: false
      })
      Toast.show('上传失败，请重新上传2!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    })
  }

  getSignature() {
    return new Promise((resolve, reject) => {
      debugger
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
    return (
      <Fragment>
        <ImageViewer
          data={this.props.list}
          visible={this.state.visible}
          index={this.state.index}
          onClose={() => this.closeImageViewer()}
        ></ImageViewer>
          {this.props.list.map((v, i) => {
            return (
              <View style={styles.upload_image_box} key={i}>
                <TouchableOpacity
                  onPress={() => {
                    this.openImageViewer(i)
                  }}
                >
                  <AliImage
                    style={styles.upload_image}
                    source={{ uri: getThumbImgUrl(v.ImageLocation) }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.upload_del_btn}
                  onPress={() => this.deleteImage(i)}
                >
                  <IconFont name="jiahao1" size={12} color="#fff"></IconFont>
                </TouchableOpacity>
                {this.props.busType === 1 && i > 0 && (
                  <TouchableOpacity
                    style={styles.upload_cover_btn}
                    onPress={() => this.setCover(i)}
                  >
                    <Text style={styles.upload_cover_btn_text}>设为封面</Text>
                  </TouchableOpacity>
                )}
                {this.props.busType === 1 && i === 0 && (
                  <Image
                    style={styles.cover_image}
                    source={require('./images/bookPaper.png')}
                  />
                )}
              </View>
            )
          })}
          {this.props.single&&this.props.list.length > 0?null : <TouchableOpacity
            style={{...styles.upload_btn,marginRight: this.props.single?20:0}}
            onPress={() => this.addImage()}
          >
            <IconFont name="jiahao" size={this.props.btnText ? 24 : 46} color="#eeeeee"></IconFont>
            {this.props.btnText && <Text style={styles.upload_btn_text}>{this.props.btnText}</Text>}
          </TouchableOpacity>
          }
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
          <FullModal
            loadingText={this.state.loadingText}
            visible={this.state.loading}
          />
      </Fragment>
    )
  }
}

export default withNavigation(UploadFileSingle)
