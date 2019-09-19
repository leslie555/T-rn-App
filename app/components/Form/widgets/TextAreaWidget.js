import React from 'react'
import createReactClass from 'create-react-class'
import { View, TextInput, PixelRatio, Dimensions } from 'react-native'

const WidgetMixin = require('../mixins/WidgetMixin.js')
const DEVICE_WIDTH = Dimensions.get('window').width

module.exports = createReactClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'TextAreaWidget',
      disabled: false
    }
  },

  render() {
    return (
      <View style={this.getStyle('textAreaRow')}>
        <TextInput
          style={this.getStyle('textArea')}
          editable={!this.props.disabled}
          multiline={true}
          placeholder={this.props.disabled ? '无' : '请在此输入备注'}
          {...this.props}
          onFocus={() => this.props.onFocus(true)}
          onChangeText={this._onChange}
          value={this.state.value}
        />
      </View>
    )
  },

  defaultStyles: {
    textAreaRow: {
      backgroundColor: '#FFF',
      minHeight: 120,
      borderBottomWidth: 1,
      borderColor: '#eee',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10
    },
    textArea: {
      fontSize: 15,
      width: DEVICE_WIDTH,
      paddingLeft: 10,
      flex: 1,
      textAlignVertical: 'top',
      textAlign: 'left'
    }
  }
})
