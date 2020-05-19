import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  BackHandler,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  Text
} from 'react-native'
import { StatusBarHeight } from '../../styles/commonStyles'
import Interactable from 'react-native-interactable'
import PropTypes from 'prop-types'

const ISIOS = Platform.OS === 'ios'
const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
)
const Screen = Dimensions.get('window')
const ScreenHeight = Screen.height - StatusBarHeight

class MenuPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opacityValue: new Animated.Value(0),
      visible: false
    }
  }
  static propTypes = {
    height: PropTypes.number,
    containerStyle: PropTypes.object
  }
  static defaultProps = {
    height: 380,
    containerStyle: {}
  }
  onStop = e => {
    if (Math.floor(e.nativeEvent.y) === Math.floor(ScreenHeight)) {
      this.setState({
        visible: false
      })
    }
  }
  open = () => {
    this.setState(
      {
        visible: true
      },
      () => {
        this.refs['menuInstance'].snapTo({
          index: 1
        })
      }
    )
  }
  close = () => {
    this.refs['menuInstance'].snapTo({
      index: 0
    })
  }
  render() {
    const { height, containerStyle, children } = this.props
    const { visible } = this.state
    return (
      <Modal
        visible={visible}
        animationType='none'
        transparent
        onRequestClose={this.close}
      >
        <View style={styles.menuPanelContainer}>
          <Animated.Text
            onPress={() => {
              this.close()
            }}
            style={{
              ...styles.bg,
              opacity: this.state.opacityValue.interpolate({
                inputRange: [ScreenHeight - height, ScreenHeight],
                outputRange: [1, 0]
              })
            }}
          ></Animated.Text>
          <Interactable.View
            style={{
              width: Screen.width,
              height,
              backgroundColor: '#fff'
            }}
            ref='menuInstance'
            onStop={this.onStop}
            verticalOnly={true}
            animatedNativeDriver={true}
            snapPoints={[{ y: ScreenHeight }, { y: ScreenHeight - height }]}
            boundaries={{
              top: ScreenHeight - height,
              bottom: ScreenHeight,
              bounce: 0
            }}
            initialPosition={{ y: ScreenHeight }}
            animatedValueY={this.state.opacityValue}
          >
            {children}
          </Interactable.View>
        </View>
      </Modal>
    )
  }
}

class MenuPanelIOS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  static propTypes = {
    height: PropTypes.number,
    containerStyle: PropTypes.object
  }
  static defaultProps = {
    height: 380,
    containerStyle: {}
  }
  open = () => {
    this.setState({
      visible: true
    })
  }
  close = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    const { height, containerStyle, children } = this.props
    const { visible } = this.state
    return (
      <Modal visible={visible} animationType='slide' transparent>
        <View style={styles.menuPanelContainer}>
          <Text
            onPress={() => {
              this.close()
            }}
            style={styles.bg}
          ></Text>
          <View
            style={[
              {
                width: Screen.width,
                height,
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#fff'
              },
              containerStyle
            ]}
          >
            {children}
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  menuPanelContainer: {
    flex: 1
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)'
  }
})

export default ISIOS ? MenuPanelIOS : MenuPanel
