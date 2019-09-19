import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH
} from '../../styles/commonStyles'
import Button from './Button'
export default class ButtonGroup extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    options: [],
    hasIcon: false
  }
  getButtons(len) {
    if (this.props.hasIcon) {
      const width = DEVICE_WIDTH / len
      return {
        width,
        height: 50,
        backgroundColor: CommonColor.color_white
      }
    } else {
      switch (len) {
        case 1:
          return {
            width: 345
          }
        case 2:
          return {
            width: 165
          }
        default:
          return {
            width: 108
          }
      }
    }
  }
  render() {
    const { options } = this.props
    const len = options.length
    const btnStyle = this.getButtons(len)
    const buttons = options.map((val, idx) => (
      <Button
        title={val.label}
        hasIcon={this.props.hasIcon}
        color={val.color}
        require={val.require}
        iconName={val.iconName}
        btnStyle={{ ...btnStyle, ...val.style }}
        isLoading={this.props['is' + val.value + 'Loading']}
        isDisabled={val.isDisabled}
        hasImage={this.props.hasImage}
        onPress={() => {
          this.props['handle' + val.value + 'Click']()
        }}
        key={idx}
      />
    ))
    return options.length ? (
      <View
        style={[
          this.props.hasIcon ? style.hasIconContainer : style.detail_page_bottom, this.props.btnConStyle]
        }
      >
        {buttons}
      </View>
    ) : null
  }
}

const style = StyleSheet.create({
  detail_page_bottom: {
    width: DEVICE_WIDTH,
    height: 75,
    paddingTop: 15,
    backgroundColor: CommonColor.color_white,
    ...DisplayStyle('row', 'center', 'space-around'),
    borderTopColor: '#ededed',
    borderTopWidth: 1
    /*     position: 'absolute',
    bottom: 0,
    left: 0 */
  },
  hasIconContainer: {
    width: DEVICE_WIDTH,
    height: 50,
    backgroundColor: CommonColor.color_white,
    ...DisplayStyle('row', 'center', 'center'),
    borderTopColor: '#ededed',
    borderTopWidth: 1
  }
})
