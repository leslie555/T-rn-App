import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { DisplayStyle, DEVICE_WIDTH, _1PX } from '../../styles/commonStyles'

export default class EmptyList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrap}>
          <Image
            style={{ width: 231, height: 139 }}
            source={require('./images/network_err.png')}
          />
          <Text style={styles.tip}>{this.props.text}</Text>
          <TouchableOpacity onPress={this.props.refresh}>
            <Text style={styles.btnText}>重新加载</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...DisplayStyle('column', 'center', 'center'),
    flex: 1,
    backgroundColor: '#fff'
  },
  contentWrap: {
    ...DisplayStyle('column', 'center', 'space-between'),
    width: DEVICE_WIDTH,
    height: 225
  },
  tip: {
    color: '#999',
    fontSize: 12
  },
  btnText: {
    color: '#3ca0f3',
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 90,
    height: 30,
    borderColor: '#46abfd',
    borderRadius: 5,
    borderWidth: _1PX
  }
})
