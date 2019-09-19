import React from 'react'
import createReactClass from 'create-react-class'
import { View, Text, TouchableHighlight, Image, PixelRatio } from 'react-native'
import {
  getCityNameByCode,
  getCityCodeByNameArr
} from '../../../utils/Picker/areaData'
import Picker from '../../Picker'

var WidgetMixin = require('../mixins/WidgetMixin')
var TimerMixin = require('react-timer-mixin')
module.exports = createReactClass({
  mixins: [TimerMixin, WidgetMixin],
  getInitialState() {
    return {
      visible: false,
      selectedValue: {}
    }
  },
  getDefaultProps() {
    return {
      type: 'AreaPickerWidget',
      required: true,
      value: '',
      disabled: false
    }
  },
  componentWillMount() {
    this.state.selectedValue = getCityNameByCode(this.props.value) || []
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
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      let selectedValue = getCityNameByCode(nextProps.value) || []
      this.setState({
        selectedValue
      })
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
  onPickerConfirm(pickedValue) {
    this.setState({
      selectedValue: pickedValue
    })
    const codeArr = getCityCodeByNameArr(pickedValue)
    this._onChange(codeArr)
    // console.log('date', pickedValue, pickedIndex)
  },
  _showAreaPicker() {
    this.setState({
      visible: true
    })
  },
  onPress() {
    if (this.props.disabled) return
    this._showAreaPicker()
  },
  getShowText() {
    const { selectedValue } = this.state
    if (selectedValue && selectedValue.length) {
      return selectedValue.join(' ')
    } else {
      return '请选择'
    }
  },
  render() {
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
        <View style={this.getStyle('row')}>
          {this._renderImage()}
          {this._renderStar()}
          <Text numberOfLines={1} style={this.getStyle('modalTitle')}>
            {this.props.title}
          </Text>
          <View style={this.getStyle('alignRight')}>
            <Text numberOfLines={1} style={this.getStyle('modalValue')}>
              {this.getShowText()}
            </Text>
          </View>
          {this.renderDisclosure()}
          <Picker
            visible={this.state.visible}
            type={'area'}
            selectedValue={this.state.selectedValue}
            onPickerConfirm={this.onPickerConfirm}
            closeModal={() => {
              this.setState({ visible: false })
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
    underlayColor: '#c7c7cc',
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
