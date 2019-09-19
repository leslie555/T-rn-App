import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { CommonColor, DisplayStyle } from '../../styles/commonStyles'

const DEVICE_WIDTH = Dimensions.get('window').width
export default class EmptyList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={style.separator}>
        <Text style={{ color: 'rgb(153,153,153)', fontSize: 13 }}>
          {this.props.label}
        </Text>
      </View>
    )
  }
}
const style = StyleSheet.create({
  separator: {
    height: 30,
    width: DEVICE_WIDTH,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_text_bg,
    ...DisplayStyle('row', 'center', 'flex-start')
  }
})
