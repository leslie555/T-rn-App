import React, {Component} from 'react'
import {
  Alert,
  Animated,
  Button,
  Clipboard,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import {DEVICE_WIDTH, DisplayStyle} from '../../styles/commonStyles'
import Modal from '../Modal'
import * as WeChat from "react-native-wechat";
import Toast from "react-native-root-toast";

const slideHeight = 200
export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowShadow: false,
      transformValue: new Animated.Value(slideHeight),
      showWechat: this.props.showWechat === undefined ? true : this.props.showWechat,
      showFriends: this.props.showFriends === undefined ? true : this.props.showFriends,
      showCopy: this.props.showCopy === undefined ? true : this.props.showCopy,
    }
  }

  openDialog() {
    this.setState({
      isShowShadow: true
    })
  }

  openSlide() {
    Animated.timing(
        // 随时间变化而执行动画
        this.state.transformValue, // 动画中的变量值
        {
          toValue: 0, // 透明度最终变为1，即完全不透明
          duration: 300 // 让动画持续一段时间
        }
    ).start()
  }

  closeDialog() {
    this.setState({
      transformValue: new Animated.Value(slideHeight),
      isShowShadow: false
    })
  }

  shareToWeChat(type) {
    if (!WeChat.isWXAppInstalled()) {
      Alert.alert(
          '温馨提示',
          '设备未安装微信！',
          [
            {text: '确定'},
          ],
          {cancelable: false}
      )
    } else {
      if (type === 0) {
        if (this.props.type === 'file') {
          WeChat.shareToSession({
            type: 'file',
            title: this.props.title, // WeChat app treat title as file name
            description: this.props.description,
            mediaTagName: 'word file',
            messageAction: undefined,
            messageExt: undefined,
            filePath: this.props.filePath,
            fileExtension: this.props.fileExtension
          });
        } else {
          WeChat.shareToSession({
            type: 'news',
            title: this.props.title,
            description: this.props.description,
            thumbImage: this.props.thumbImage,
            webpageUrl: this.props.webpageUrl
          })
        }
      } else {
        if (this.props.type === 'file') {
          WeChat.shareToTimeline({
            type: 'file',
            title: this.props.title, // WeChat app treat title as file name
            description: this.props.description,
            mediaTagName: 'word file',
            messageAction: undefined,
            messageExt: undefined,
            filePath: this.props.filePath,
            fileExtension: this.props.fileExtension
          });
        } else {
          WeChat.shareToTimeline({
            type: 'news',
            title: this.props.title,
            description: this.props.description,
            thumbImage: this.props.thumbImage,
            webpageUrl: this.props.webpageUrl
          })
        }
      }
      this.closeDialog()
    }
  }

  copyUrl() {
    Clipboard.setString(this.props.webpageUrl)
    Toast.show('已复制到剪切板', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM
    })
    this.closeDialog()
  }

  render() {
    return (
        <Modal
            transparent={true}
            visible={this.state.isShowShadow}
            noAnimate={true}
            onShow={() => {
              this.openSlide()
            }}
            onRequestClose={() => {
              this.closeDialog()
            }}>
          <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                alignItems: 'center'
              }}
              onPress={() => {
                this.closeDialog()
              }}
          />
          <Animated.View
              style={{
                transform: [{translateY: this.state.transformValue}],
                ...styles.share_slide
              }}
          >
            <View style={styles.share_box}>
              {this.state.showWechat &&
              <TouchableOpacity style={styles.share_box_item} onPress={() => {
                this.shareToWeChat(0)
              }}>
                <Image style={styles.share_box_item_img}
                       source={require('./images/icon-wechat.png')}/>
                <Text style={styles.share_box_item_text}>微信</Text>
              </TouchableOpacity>
              }
              {this.state.showFriends &&
              <TouchableOpacity style={styles.share_box_item} onPress={() => {
                this.shareToWeChat(1)
              }}>
                <Image style={styles.share_box_item_img}
                       source={require('./images/icon-friends.png')}/>
                <Text style={styles.share_box_item_text}>朋友圈</Text>
              </TouchableOpacity>
              }
              {this.state.showCopy &&
              <TouchableOpacity style={styles.share_box_item} onPress={() => {
                this.copyUrl()
              }}>
                <Image style={styles.share_box_item_img}
                       source={require('./images/icon-copy.png')}/>
                <Text style={styles.share_box_item_text}>复制</Text>
              </TouchableOpacity>
              }
            </View>
            <TouchableOpacity style={styles.share_cancel} onPress={() => {
              this.closeDialog()
            }}>
              <Text style={styles.share_cancel_text}>取消</Text>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
    )
  }
}

const styles = StyleSheet.create({
  share_slide: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    height: slideHeight,
    width: DEVICE_WIDTH,
    backgroundColor: '#f6f6f6'
  },
  share_box: {
    ...DisplayStyle('row', 'center', 'space-between'),
    height: slideHeight - 50,
  },
  share_box_item: {
    ...DisplayStyle('column', 'center', 'center'),
    flex: 1,
    height: slideHeight - 50,
  },
  share_box_item_text: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 12,
    marginTop: -5
  },
  share_box_item_img: {
    width: 50,
    height: 50
  },
  share_cancel: {
    height: 50,
    width: DEVICE_WIDTH,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    ...DisplayStyle('row', 'center', 'center')
  },
  share_cancel_text: {
    color: '#666',
    fontSize: 16
  }
})
