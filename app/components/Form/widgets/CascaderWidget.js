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
      selectedValue: {},
      label: '请选择',
      pickerData: []
    }
  },
  getDefaultProps() {
    return {
      type: 'PickerWidget',
      required: true,
      value: [],
      disabled: false,
      separator: '>',
      mapKey: {
        children: 'children',
        label: 'label',
        value: 'value',
      }
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.getLabel(nextProps)
    }
  },
  componentDidMount() {
    this.getLabel(this.props)
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
  getLabel(nextProps){
    let value = nextProps.value
    let next = this.props.data
    let mapKey = this.props.mapKey
    let selectedValue = []
    if (value) {
      value.forEach(val => {
        const item = next.find(v => v[mapKey.value] === val)
        selectedValue.push(item[mapKey.label])
        next = item[mapKey.children]
      })
    }
    this.setState({
      label: selectedValue.join(this.props.separator) || '请选择'
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
  onPickerConfirm(dataArr, idxArr) {
    // console.log('date', pickedValue, pickedIndex)
    const {mapKey} = this.props
    this.setState({
      label: dataArr.join(this.props.separator)
    })
    debugger
    const valArr = []
    let item
    let next = this.props.data
    idxArr.forEach(val => {
      item = next[val]
      valArr.push(item[mapKey.value])
      next = item[mapKey.children]
    })
    this._onChange(valArr)
    this.props.onSelect && this.props.onSelect(item)
  },
  _showPicker() {
    const pickerData = []
    const {data, mapKey} = this.props
    const {value} = this.state
    for (let i = 0; i < data.length; i++) {
      const _data = {}
      let nameArr = []
      if (data[i][mapKey.children]) {
        nameArr = data[i][mapKey.children].map(val => val[mapKey.label])
      }
      _data[data[i][mapKey.label]] = nameArr
      pickerData.push(_data)
    }
    const selectedValue = []
    let next = data
    if (value) {
      value.forEach(val => {
        const item = next.find(v => v[mapKey.value] === val)
        selectedValue.push(item[mapKey.label])
        next = item[mapKey.children]
      })
    }
    this.setState({
      selectedValue,
      visible: true,
      pickerData
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
              <Text numberOfLines={1} style={[this.getStyle('modalValue'),this.state.label==='请选择'?null:{color:'#333'}]}>
                {this.state.label}
              </Text>
            </View>
            {this.renderDisclosure()}
            <Picker
                visible={this.state.visible}
                type={'cascader'}
                pickerData={this.state.pickerData}
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
