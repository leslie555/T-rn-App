import React, { Component } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

export default class ListFooterComponent extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // console.log(this.props,'test')
  }

  render() {
    return (
      <View style={{}}>
        {this.props.list.length !== 0 ? (
          this.props.isAll ? (
            <Text style={{ color: '#999', marginTop: 10, textAlign: 'center' }}>
              {'--已加载全部--'}
            </Text>
          ) : (
            <View style={{ alignContent: 'center' }}>
              <ActivityIndicator color={'#999'} size='small' animating={true} />
              <Text style={{ textAlign: 'center' }}>加载更多...</Text>
            </View>
          )
        ) : null}
      </View>
    )
  }
}
