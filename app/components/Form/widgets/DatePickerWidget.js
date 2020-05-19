import React from 'react'
import createReactClass from 'create-react-class'
import {
  View,
  Text,
  TouchableHighlight,
  Navigator,
  Image,
  TouchableOpacity,
  PixelRatio
} from 'react-native'
import Picker from '../../Picker'

var WidgetMixin = require('../mixins/WidgetMixin')
var TimerMixin = require('react-timer-mixin')
module.exports = createReactClass({
  mixins: [TimerMixin, WidgetMixin],
  getInitialState() {
    return {
      visible: false,
      timeVisible: false,
      selectedValue: {},
      selectedTimeValue: {}
    }
  },
  getDefaultProps() {
    return {
      type: 'DatePickerWidget',
      required: true,
      value: '',
      disabled: false
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
        source={require('../icons/disclosure.png')}
      />
    )
  },
  onPickerConfirm(pickedValue) {
    // console.log('date', pickedValue, pickedIndex)
    const match = pickedValue.map(v => v.slice(0, v.length - 1))
    const arr = match.map(v => (+v < 10 ? '0' + v : v))
    const data = arr.join('-')
    this._onChange(data)
  },
  _showDatePicker() {
    let date = new Date()
    let selectedValue = this._handleDefaulValue(this.state.value) || [
      date.getFullYear() + '年',
      date.getMonth() + 1 + '月',
      date.getDate() + '日'
    ]
    this.setState({
      selectedValue,
      visible: true
    })
  },
  onTimePickerConfirm(pickedValue) {
    const min = +pickedValue[1]
    const sec = +pickedValue[2]
    const str = ` ${
      pickedValue[0] === '下午'
        ? +pickedValue[1] + 12
        : min < 10
        ? '0' + min
        : min
    }:${sec < 10 ? '0' + sec : sec}`
    this._onChange(str)
    // console.log('date', pickedValue, pickedIndex)
  },
  _showTimePicker() {
    let date = new Date()

    let selectedTimeValue = [
      date.getHours() > 11 ? '下午' : '上午',
      date.getHours() === 12 ? 12 : date.getHours() % 12,
      date.getMinutes()
    ]
    this.setState({
      selectedTimeValue,
      timeVisible: true
    })
  },
  _handleDefaulValue(val) {
    if (typeof val === 'string') {
      if (!val) return undefined
      else {
        let arr = val.split('-')
        arr[0] += '年'
        arr[1] = +arr[1] + '月'
        arr[2] = +arr[2] + '日'
        return arr
      }
    } else {
      return undefined
    }
  },
  onPress() {
    if (this.props.disabled) return
    if (this.props.pickTime) {
      this._showTimePicker()
    } else {
      this._showDatePicker()
    }
  },
  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.requestAnimationFrame(() => {
            this.onPress()
          })
        }}
        underlayColor={this.getStyle('underlayColor').pop()}
        {...this.props} // mainly for underlayColor
        style={this.getStyle('rowContainer')}
      >
        <View style={this.getStyle('row')}>
          {this._renderImage()}
          {this._renderStar()}
          <Text numberOfLines={1} style={this.getStyle('modalTitle')}>
            {this.props.title}
          </Text>
          <View style={this.getStyle('alignRight')}>
            <Text
              numberOfLines={1}
              style={[
                this.getStyle('modalValue'),
                this.state.value ? { color: '#333' } : null,
                this.props.disabled ? { color: '#888' } : null
              ]}
            >
              {this.state.value || '请选择'}
            </Text>
          </View>
          {this.renderDisclosure()}
          <Picker
            visible={this.state.visible}
            type={'date'}
            selectedValue={this.state.selectedValue}
            onPickerConfirm={this.onPickerConfirm}
            closeModal={() => {
              this.setState({ visible: false })
            }}
          />
          <Picker
            visible={this.state.timeVisible}
            type={'time'}
            selectedValue={this.state.selectedTimeValue}
            onPickerConfirm={this.onTimePickerConfirm}
            closeModal={() => {
              this.setState({ timeVisible: false })
            }}
          />
        </View>
      </TouchableHighlight>
    )
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
      width: 11
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
