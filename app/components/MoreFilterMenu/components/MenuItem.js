import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class MenuItem extends React.Component {
  render() {
    return (
      <View style={style.menu_item}>
        <View style={style.menu_item_title}>
          <Text style={style.menu_item_title_text}>{this.props.title}</Text>
        </View>
        {this.props.children}
      </View>
    )
  }
}

const style = StyleSheet.create({
  menu_item: {
    marginBottom: 30
  },
  menu_item_title: {
    marginBottom: 20
  },
  menu_item_title_text: {
    color: '#999999',
    fontSize: 16
  }
})
