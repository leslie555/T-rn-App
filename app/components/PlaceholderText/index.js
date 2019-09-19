import React, { Component } from 'react'
import Placeholder from 'rn-placeholder'
import { Text, View } from 'react-native'
import { DisplayStyle } from '../../styles/commonStyles'
export default class PlaceholderText extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Placeholder.Line
        style={{ marginTop: 5, marginBottom: 5 }}
        color='#eeeeee'
        width='80%'
        textSize={14}
        {...this.props}
      >
        <View
          style={{
            ...DisplayStyle('row', 'center', 'flex-start'),
            marginVertical: 5
          }}
        >
          <Text
            style={{
              marginRight: 5,
              color: '#363636',
              ...this.props.labelStyle
            }}
          >
            {this.props.label}
          </Text>
          <Text style={{ color: '#999', ...this.props.style }}>
            {this.props.children}
          </Text>
        </View>
      </Placeholder.Line>
    )
  }
}
