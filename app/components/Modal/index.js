import React, { Component } from 'react'
import {View, Modal, TouchableOpacity, StatusBar, Platform} from 'react-native'
import { DEVICE_WIDTH, StatusBarHeight } from '../../styles/commonStyles'
export default class Picker extends Component {
  constructor(props) {
    super(props)
    this.picker = () => {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible&&!this.props.noAnimate) {
      this.setStatusBar(nextProps.visible)
    }
  }
  setStatusBar(visible) {
    if (visible) {
      if( Platform.OS === "android"&&!this.props.noAnimate) {
        StatusBar.setBackgroundColor('rgba(0,0,0,0.8)', true)
      }
    } else {
      if( Platform.OS === "android"&&!this.props.noAnimate) {
        StatusBar.setBackgroundColor('#00000000', true)
      }
    }
    // StatusBar.setHidden(visible)
  }
  render() {
    return (
      <Modal {...this.props}>
        {/*   {this.props.visible && (
          <View
            style={{
              width: DEVICE_WIDTH,
              height: StatusBarHeight,
              backgroundColor: '#fff',
              position: 'absolute',
              top: -StatusBarHeight,
              left: 0,
              zIndex: 999
            }}
          />
        )} */}
        {this.props.children}
      </Modal>
    )
  }
}
