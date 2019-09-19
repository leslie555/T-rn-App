import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Button,
  Dimensions
} from 'react-native'
import Interactable from 'react-native-interactable'

const Screen = Dimensions.get('window')
const toUpper = str => str.substring(0, 1).toUpperCase() + str.substring(1)

export default class SideMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false
    }
    this.SideMenuWidth = (Screen.width / 5) * 4
    this.RemainingWidth = Screen.width - this.SideMenuWidth
    this.directionReverse = this.props.direction === 'left' ? 'right' : 'left'
    this.initialPosition =
      this.props.direction === 'left' ? -this.SideMenuWidth : this.SideMenuWidth
    this.opacity = 0
  }
  static defaultProps = {
    isOpen: false,
    menu: null,
    direction: 'right',
    onOpen: () => {},
    onClose: () => {},
    offSet: 0
  }
  componentWillReceiveProps(nextProps) {
    const { direction } = nextProps
    const velocity = direction === 'left' ? 2000 : -2000
    if (nextProps.isOpen !== this.props.isOpen) {
      if (nextProps.isOpen) {
        this.opacity = 1
        this.setState({
          isModalVisible: true,
          height: Screen.height+80
        })
        this.refs['menuInstance'].setVelocity({
          x: +velocity
        })
      } else {
        this.refs['menuInstance'].setVelocity({
          x: -velocity
        })
      }
    }
  }
  onSnap = ({ nativeEvent }) => {
    if (nativeEvent.index === 0) {
      // 0为打开 1为关闭
      this.props.onOpen()
    } else {
      this.setState({
        isModalVisible: false
      })
      this.opacity = 0
      this.props.onClose()
    }
  }

  onStop=({nativeEvent})=>{
    if(!(nativeEvent.x===0&&nativeEvent.y===0)){
      console.log(Screen.height-80)
      this.setState({
        height: Screen.height-80
      })
    }
  }

  render() {
    const { direction } = this.props
    return (
      <View
        style={[
          styles.sideMenuContainer,
          {
            transform: [{ translateX: this.props.offSet }],
            width: Screen.width + this.RemainingWidth,
            opacity: this.opacity,
            [direction]: -this.RemainingWidth,
            justifyContent: direction === 'left' ? 'flex-start' : 'flex-end',
            height: this.state.height
          }
        ]}
        pointerEvents='box-none'
      >
        {this.state.isModalVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.refs['menuInstance'].snapTo({
                index: 1
              })
            }}
            style={[styles.modal, { [direction]: this.RemainingWidth,height: this.state.height }]}
          />
        )}
        <Interactable.View
          onSnap={this.onSnap}
          onStop={this.onStop}
          ref='menuInstance'
          horizontalOnly={true}
          snapPoints={[{ x: 0 }, { x: this.initialPosition }]}
          style={{ zIndex: 1001 }}
          boundaries={{
            [this.directionReverse]: 0
          }}
          initialPosition={{
            x: this.initialPosition
          }}
        >
          <View
            style={[
              styles.sideMenu,
              { [`padding${toUpper(direction)}`]: this.RemainingWidth }
            ]}
          >
            {this.props.menu}
          </View>
        </Interactable.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sideMenuContainer: {
    position: 'absolute',
    top: 0,
    height: Screen.height+80,
    width: Screen.width,
    flexDirection: 'row',
    zIndex: 1002
  },
  sideMenu: {
    left: 0,
    width: Screen.width,
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  modal: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: Screen.height+80,
    zIndex: 1000,
    width: Screen.width
  }
})
