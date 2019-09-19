import React, { Component } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { CommonColor, DisplayStyle } from '../../styles/commonStyles'
import IconFont from '../../utils/IconFont'

export default class MoreFilter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.handleMoreFilter}
        style={style.wrap}
      >
        <Text
          style={{
            ...style.text,
            color: this.props.isActive
              ? CommonColor.color_primary
              : CommonColor.color_text_primary
          }}
        >
          更多筛选
        </Text>
        <IconFont
          name='sanjiaoxing'
          size={10}
          color={this.props.isActive ? CommonColor.color_primary : '#ddd'}
        />
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  wrap: {
    ...DisplayStyle('row', 'center', 'center')
  },
  text: {
    fontSize: 16,
    color: CommonColor.color_text_primary,
    marginRight: 5
  }
})
