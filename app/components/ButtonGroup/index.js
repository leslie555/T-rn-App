import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH
} from '../../styles/commonStyles'
import Button from './Button'
import { getButtons } from '../../utils/buttonPermission'
export default class ButtonGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      permittedBtns: []
    }
  }
  static defaultProps = {
    options: [],
    isIconContainer: false
  }
  componentDidMount() {
    getButtons(this.props.permissionTag).then(btns => {
      let permittedBtns = this.props.options
      if (this.props.permissionTag) {
        const btnEActionNames = btns.map(v => v.EActionName)
        permittedBtns = this.props.options.filter(v =>
          btnEActionNames.includes(v.value)
        )
      }
      this.setState({
        permittedBtns
      })
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      getButtons(nextProps.permissionTag).then(btns => {
        let permittedBtns = this.props.options
        if (nextProps.permissionTag) {
          const btnEActionNames = btns.map(v => v.EActionName)
          permittedBtns = nextProps.options.filter(v =>
            btnEActionNames.includes(v.value)
          )
        }
        this.setState({
          permittedBtns
        })
      })
    }
  }
  getButtons(len) {
    if (this.props.isIconContainer) {
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
    const { isIconContainer } = this.props
    const { permittedBtns } = this.state
    const len = permittedBtns.length
    const btnStyle = this.getButtons(len)
    const buttons = permittedBtns.map((val, idx) => (
      <Button
        isIconContainer={isIconContainer}
        title={val.label}
        color={val.color}
        imgSource={val.imgSource}
        iconName={val.iconName}
        btnStyle={{ ...btnStyle, ...val.style }}
        isLoading={this.props['is' + val.value + 'Loading']}
        isDisabled={val.isDisabled}
        onPress={() => {
          this.props['handle' + val.value + 'Click']()
        }}
        key={idx}
      />
    ))
    return permittedBtns.length ? (
      <View
        style={[
          isIconContainer ? style.hasIconContainer : style.detail_page_bottom,
          this.props.btnConStyle
        ]}
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
