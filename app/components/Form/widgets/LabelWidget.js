import React from 'react'
import createReactClass from 'create-react-class'
import { Image, PixelRatio, Text, TouchableHighlight, View } from 'react-native'

var WidgetMixin = require('../mixins/WidgetMixin')
var TimerMixin = require('react-timer-mixin')
module.exports = createReactClass({
  mixins: [TimerMixin, WidgetMixin],
  getInitialState() {
    return {}
  },
  getDefaultProps() {
    return {
      type: 'LabelWidget',
      required: true,
      value: '',
      disabled: false,
      renderRight: true,
      rightTextStyle: {}
    }
  },
  componentDidMount() {
    this.getDefaultValidators({
      validator: args => {
        if (!args) {
          return false
        }
        return true
      },
      message: '{TITLE} 不能为空'
    })
  },
  renderDisclosure() {
    return (
      <Image
        style={this.getStyle('disclosure')}
        resizeMode={'contain'}
        source={require('../icons/arrow.png')}
      />
    )
  },
  renderPlaceHolder() {
    return <View style={{ width: 28 }} />
  },
  onPress() {
    if (this.props.disabled) return
    this.props.onLabelPress && this.props.onLabelPress()
  },
  render() {
    const content = (
      <View style={this.getStyle('row')}>
        {this._renderImage()}
        {this._renderStar()}
        <Text numberOfLines={1} style={this.getStyle('modalTitle')}>
          {this.props.title}
        </Text>
        <View style={this.getStyle('alignRight')}>
          {this.props.rightItem || (
            <Text
              numberOfLines={1}
              style={[
                this.getStyle('modalValue'),
                this.props.value && this.props.value !== '请选择'
                  ? { color: '#333' }
                  : null,
                this.props.rightTextStyle,
                this.props.disabled ? { color: '#888' } : null
              ]}
            >
              {this.props.value || '请选择'}
            </Text>
          )}
        </View>
        {this.props.renderRight
          ? this.renderDisclosure()
          : this.renderPlaceHolder()}
      </View>
    )
    if (this.props.onLabelPress) {
      return (
        <TouchableHighlight
          onPress={() => {
            // this.requestAnimationFrame(() => {
            this.onPress()
            // })
          }}
          underlayColor={this.getStyle('underlayColor').pop()}
          {...this.props} // mainly for underlayColor
          style={this.getStyle('rowContainer')}
        >
          {content}
        </TouchableHighlight>
      )
    }
    return <View style={this.getStyle('rowContainer')}>{content}</View>
  },
  defaultStyles: {
    rowImage: {
      height: 20,
      width: 20,
      marginLeft: 10
    },
    rowContainer: {
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderColor: '#eee'
    },
    underlayColor: '#eee',
    row: {
      flexDirection: 'row',
      height: 44,
      alignItems: 'center'
    },
    disclosure: {
      // transform: [{rotate: '90deg'}],
      marginLeft: 10,
      marginRight: 10,
      width: 6
    },
    modalTitle: {
      flex: 1,
      fontSize: 15,
      color: '#000'
      // paddingLeft: 10
    },
    alignRight: {
      alignItems: 'flex-end'
      // width: 110,
    },
    modalValue: {
      fontSize: 15,
      color: '#999'
    }
  }
})
