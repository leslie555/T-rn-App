import React, {Component} from 'react';
import {ActivityIndicator, Modal, Platform, StatusBar, Text, View} from 'react-native';
import styles from './style'
import PropTypes from 'prop-types';

export default class FullModal extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    loadingText: '',
    reverse: false
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否显示
    loadingText: PropTypes.string, // 加载文字
    reverse: PropTypes.bool // 是否颜色反转
  }

  render() {
    return (
        <Modal
            animationType={Platform.OS === 'ios' ? 'none' : 'fade'}        // 过渡效果
            transparent={true}              // 透明
            visible={this.props.visible}      // 是否显示
        >
          <View style={this.props.reverse ? styles.full_container_reverse : styles.full_container}>
            <ActivityIndicator size="large" color='#389ef2'/>
            <Text style={styles.loading_text}>{this.props.loadingText}</Text>
          </View>
        </Modal>
    )
  }
}
