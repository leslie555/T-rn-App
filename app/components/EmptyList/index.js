import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

export default class EmptyList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{alignItems: 'center',marginTop: 140}}>
        <Image
          style={{ width: 231, height: 140 }}
          source={require('./images/nomsg.png')}
        />
        <Text style={{color: '#999',marginTop: 20}}>{this.props.text}</Text>
      </View>
    )
  }
}
