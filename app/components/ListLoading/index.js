import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CommonColor, DisplayStyle } from '../../styles/commonStyles'
import Spinner from 'react-native-spinkit'
import PropTypes from 'prop-types'

export default class ListLoading extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    withList: false // 是否和List组件配合使用
  }

  static propTypes = {
    withList: PropTypes.bool
  }

  render() {
    return (
      <View
        style={[
          style.spinnerContaner,
          this.props.withList ? { zIndex: -2 } : ''
        ]}
      >
        <Spinner
          style={style.spinner}
          isVisible={this.props.isVisible}
          size={60}
          type={'ThreeBounce'}
          color={CommonColor.color_primary}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  spinnerContaner: {
    ...DisplayStyle('row', 'center', 'center')
  },
  spinner: { marginTop: 5 }
})
