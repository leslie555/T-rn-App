import React from 'react'
import createReactClass from 'create-react-class'
import {Image, Navigator, PixelRatio, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native'
import Picker from '../../Picker'

var WidgetMixin = require('../mixins/WidgetMixin')
var TimerMixin = require('react-timer-mixin')
module.exports = createReactClass({
  mixins: [TimerMixin, WidgetMixin],
  getInitialState() {
    return {
      visible: false,
      timeVisible: false,
      selectedValue: '',
      data: []
    }
  },
  getDefaultProps() {
    return {
      type: 'PickerWidget',
      required: true,
      value: '',
      disabled: false,
      data: [],
      mapKey: {
        label: 'label',
        value: 'value'
      }
    }
  },
  componentWillMount() {
    const {mapKey} = this.props
    let data = this.props.data.map(val => ({
      label: val[mapKey.label],
      value: val[mapKey.value]
    }))
    let selectedValue = this.props.data.find(
        val => val[mapKey.value] === this.props.value
    )
    selectedValue = selectedValue ? selectedValue[mapKey.label] : ''
    this.setState({
      data,
      selectedValue
    })
  },
  componentDidMount() {
    this.getDefaultValidators({
      validator: args => {
        if (args === '请选择') {
          return false
        }
        return true
      },
      message: '{TITLE} 不能为空'
    })
  },
  componentWillReceiveProps(nextProps) {
    const {mapKey} = this.props
    let flag = false //只修改data的情况
    if (this.props.data !== nextProps.data) {
      let data = nextProps.data.map(val => ({
        label: val[mapKey.label],
        value: val[mapKey.value]
      }))
      this.setState({
        data
      })
      flag = true
    }
    if (this.props.value !== nextProps.value || flag) {
      let selectedValue = nextProps.data.find(
          val => val[mapKey.value] === nextProps.value
      )
      selectedValue = selectedValue ? selectedValue[mapKey.label] : ''
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
  onPickerConfirm(data) {
    // console.log('date', pickedValue, pickedIndex)
    this.setState({selectedValue: data.label})
    this._onChange(data.value)
    this.props.onPickerConfirm && this.props.onPickerConfirm(data.value, data)
  },
  _showPicker() {
    this.setState({
      visible: true
    })
  },
  onPress() {
    if (this.props.disabled) return
    this._showPicker()
  },
  render() {
    return (
        <TouchableHighlight
            onPress={() => {
              this.onPress()
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
              <Text numberOfLines={1} style={[this.getStyle('modalValue'),this.state.selectedValue?{color:'#333'}:null]}>
                {this.state.selectedValue || '请选择'}
              </Text>
            </View>
            {this.renderDisclosure()}
            <Picker
                visible={this.state.visible}
                pickerData={this.state.data}
                selectedValue={this.state.selectedValue}
                onPickerConfirm={this.onPickerConfirm}
                closeModal={() => {
                  this.setState({visible: false})
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
