import React from 'react'
import createReactClass from 'create-react-class'
import { View, Text, Image, TouchableOpacity, PixelRatio } from 'react-native'
import Picker from '../../Picker'
import Toast from 'react-native-root-toast'
var WidgetMixin = require('../mixins/WidgetMixin')
var TimerMixin = require('react-timer-mixin')
module.exports = createReactClass({
  mixins: [TimerMixin, WidgetMixin],
  getInitialState() {
    return {
      visible: false,
      selectedValue: {},
      idx: 0
    }
  },
  componentDidMount() {
    this.getDefaultValidators({
      validator: args => {
        if (!args[0] || !args[1]) {
          return false
        }
        return true
      },
      message: '{TITLE} 不能为空'
    })
  },
  getDefaultProps() {
    return {
      type: 'DatePickerRangeWidget',
      required: true,
      disabled: false,
      cannotEqual: false,
      value: []
    }
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
  isSmallThan(time1, time2, cannotEqual) {
    // 开始时间是否晚于结束时间
    const operation = cannotEqual ? time1 >= time2 : time1 > time2
    if (operation) {
      Toast.show('开始时间不能晚于结束时间!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return true
    }
    return false
  },
  onPickerConfirm(pickedValue) {
    // console.log('date', pickedValue, pickedIndex)
    const match = pickedValue.map(v => v.slice(0, v.length - 1))
    const arr = match.map(v => (+v < 10 ? '0' + v : v))
    const selectDateStr = arr.join('-')

    const val1 = this.state.value[0]
    const val2 = this.state.value[1]
    if (this.idx === 0 && val2) {
      const time1 = new Date(selectDateStr).getTime()
      const time2 = new Date(val2).getTime()
      if (this.isSmallThan(time1, time2, this.props.cannotEqual)) return
    } else if (this.idx === 1 && val1) {
      const time1 = new Date(val1).getTime()
      const time2 = new Date(selectDateStr).getTime()
      if (this.isSmallThan(time1, time2, this.props.cannotEqual)) return
    }
    if (this.idx === 0) {
      this._onChange([selectDateStr, this.state.value[1] || ''])
      if (!this.state.value[1]) {
        this.onPressRight()
      }
    } else {
      this._onChange([this.state.value[0] || '', selectDateStr])
    }
  },
  _showDatePicker() {
    if (this.props.disabled) return
    let date = new Date()
    let selectedValue = this._handleDefaulValue(this.state.value[this.idx]) || [
      date.getFullYear() + '年',
      date.getMonth() + 1 + '月',
      date.getDate() + '日'
    ]
    this.setState({
      selectedValue,
      visible: true
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
  onPressLeft() {
    this.idx = 0
    this._showDatePicker()
  },
  onPressRight() {
    if (!this.state.value[0] && !this.state.value[1]) {
      this.idx = 0
      this._showDatePicker()
    } else {
      this.idx = 1
      this._showDatePicker()
    }
  },
  render() {
    getStateValue = idx => {
      if (this.state.value) {
        return this.state.value[idx] || '请选择'
      } else {
        return null
      }
    }
    return (
      <View style={this.getStyle('rowContainer')}>
        <View style={this.getStyle('row')}>
          {this._renderImage()}
          {this._renderStar()}
          <Text numberOfLines={1} style={this.getStyle('modalTitle')}>
            {this.props.title}
          </Text>
          <View style={this.getStyle('alignRight')}>
            <TouchableOpacity
              onPress={() => {
                // this.requestAnimationFrame(() => {
                this.onPressLeft()
                // })
              }}
              style={this.getStyle('alignRight')}
              underlayColor={this.getStyle('underlayColor').pop()}
            >
              <Text numberOfLines={1} style={[this.getStyle('modalValue'),getStateValue(0)==='请选择'?null:{color:'#333'}]}>
                {getStateValue(0)}
              </Text>
              {this.renderDisclosure()}
            </TouchableOpacity>
            <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 15 }}>
              至
            </Text>
            <TouchableOpacity
              onPress={() => {
                // this.requestAnimationFrame(() => {
                this.onPressRight()
                // })
              }}
              style={this.getStyle('alignRight')}
              underlayColor={this.getStyle('underlayColor').pop()}
            >
              <Text numberOfLines={1} style={[this.getStyle('modalValue'),getStateValue(1)==='请选择'?null:{color:'#333'}]}>
                {getStateValue(1)}
              </Text>
            </TouchableOpacity>
            {this.renderDisclosure()}
          </View>
          <Picker
            visible={this.state.visible}
            type={'date'}
            selectedValue={this.state.selectedValue}
            onPickerConfirm={this.onPickerConfirm}
            closeModal={() => {
              this.setState({ visible: false })
            }}
          />
        </View>
      </View>
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
    underlayColor: '#c7c7cc',
    row: {
      flexDirection: 'row',
      height: 44,
      alignItems: 'center'
    },
    disclosure: {
      // transform: [{rotate: '90deg'}],
      marginLeft: 5,
      marginRight: 5,
      width: 11,
      marginTop: 5
    },
    modalTitle: {
      flex: 1,
      fontSize: 15,
      color: '#000'
      // paddingLeft: 10
    },
    alignRight: {
      alignItems: 'flex-start',
      flexDirection: 'row'
      // width: 110,
    },
    modalValue: {
      fontSize: 15,
      color: '#999'
    }
  }
})
