import React, {Component} from 'react'
import {SelectAny} from '../../../components'
import {View} from 'react-native'
import {Container} from '../../../styles/commonStyles'

export default class SelectAnyScreen extends Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数 any  由SelectAny组件控制
  }

  render() {
    return (
        <View style={Container}>
          <SelectAny {...this.query} />
        </View>
    )
  }
}
