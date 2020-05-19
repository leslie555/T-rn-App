import React, {Component, Fragment} from 'react';
import {ActivityIndicator, Image, Modal, Platform, StatusBar, Text, View} from 'react-native';
import styles from './style'
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview'

export default class FullModal extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    loadingText: '',
    reverse: false,
    type: 1
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否显示
    loadingText: PropTypes.string, // 加载文字
    reverse: PropTypes.bool, // 是否颜色反转
    type: PropTypes.number // 类型 2 为计算动画
  }

  render() {
    return (
        <Modal
            animationType={Platform.OS === 'ios' ? 'none' : 'fade'}        // 过渡效果
            transparent={true}              // 透明
            visible={this.props.visible}      // 是否显示
        >
          <View style={[this.props.reverse ? styles.full_container_reverse : styles.full_container,this.props.type===2?styles.full_container_2:null]}>
            {this.props.type === 1 && <Fragment>
              <ActivityIndicator size="large" color='#389ef2'/>
              <Text style={styles.loading_text}>{this.props.loadingText}</Text>
            </Fragment>}
            {this.props.type === 2 &&
            <View style={styles.web_loading}>
              <WebView
                  style={{flex: 1,backgroundColor: 'rgba(0,0,0,0)'}}
                  originWhitelist={['*']}
                  mixedContentMode='always'
                  source={{
                    html: `<img style="width: 40%;margin-left: 30%" src="https://www.51tanwo.com/phone/loading_1.gif">`
                  }}
              />
            </View>
            }
          </View>
        </Modal>
    )
  }
}
