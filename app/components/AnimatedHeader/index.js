import React, { Component } from 'react'
import { Animated } from 'react-native'
import { DEVICE_WIDTH } from '../../styles/commonStyles'
export default class AnimatedHeader extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Animated.View
        style={{
          // opacity: this.animation, // 将透明度指定为动画变量值
          width: DEVICE_WIDTH,
          height: this.props.headerHeight,
          transform: [
            {
              translateY: this.props.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-this.props.headerHeight, 0] // 0 : 150, 0.5 : 75, 1 : 0
              })
            }
          ]
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
