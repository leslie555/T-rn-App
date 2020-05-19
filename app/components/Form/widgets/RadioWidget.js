import React from 'react'
import createReactClass from 'create-react-class'
import { Image, PixelRatio, Text, TouchableHighlight, View } from 'react-native'
import { CheckBox } from '../../index'

var WidgetMixin = require('../mixins/WidgetMixin')
var TimerMixin = require('react-timer-mixin')
module.exports = createReactClass({
  mixins: [TimerMixin, WidgetMixin],
  getInitialState() {
    return {
      current: this.props.value
    }
  },
  getDefaultProps() {
    return {
      type: 'RadioWidget',
      required: true,
      value: '',
      disabled: false,
      renderRight: true,
      rightTextStyle: {}
    }
  },
  componentWillReceiveProps(nextProps) {
    if(this.props.value !== nextProps.value) {
      this.setState({
        current: nextProps.value
      })
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
  renderPlaceHolder() {
    return <View style={{ width: 28 }} />
  },
  onPress(value) {
    if (this.props.disabled) return
    this.setState({
      current: value
    })
    this._onChange(value)
  },
  render() {
    return this.props.options.map(v => {
      return (
        <TouchableHighlight
          key={v.value}
          onPress={() => {
            // this.requestAnimationFrame(() => {
            this.onPress(v.value)
            // })
          }}
          underlayColor={this.getStyle('underlayColor').pop()}
          {...this.props} // mainly for underlayColor
          style={this.getStyle('rowContainer')}
        >
          <View style={this.getStyle('row')}>
            {this._renderImage()}
            {this._renderStar()}
            <CheckBox
              type={1}
              isChecked={v.value == this.state.current}
              onClick={() => {
                this.onPress(v.value)
              }}
            ></CheckBox>
            <Text
              style={[this.getStyle('modalTitle'), { marginLeft: 10 }]}
            >
              {v.label}
            </Text>
            {v.renderRight}
          </View>
        </TouchableHighlight>
      )
    })
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
      minHeight: 44,
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
      fontSize: 13,
      color: '#777'
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
