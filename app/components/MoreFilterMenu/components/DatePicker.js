import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { DisplayStyle } from '../../../styles/commonStyles'
import Picker from '../../Picker'
import Toast from 'react-native-root-toast'

export default class Datepicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      selectedValue: ''
    }
  }
  getFormatDate(val) {
    const match = val.map(v => v.slice(0, v.length - 1))
    const arr = match.map(v => (+v < 10 ? '0' + v : v))
    return arr.join('-')
  }
  validateTime(t1, t2) {
    if (t1 === '开始时间' || t2 === '结束时间') return true
    if (new Date(t1) > new Date(t2)) {
      Toast.show('开始时间不能晚于结束时间!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    return true
  }
  getDefaultDate(val) {
    if (val !== '开始时间' && val !== '结束时间') {
      let arr = val.split('-')
      arr[0] += '年'
      arr[1] = +arr[1] + '月'
      arr[2] = +arr[2] + '日'
      return arr
    } else {
      const date = new Date()
      return [
        date.getFullYear() + '年',
        date.getMonth() + 1 + '月',
        date.getDate() + '日'
      ]
    }
  }
  onPickerConfirm = val => {
    if (this.pickerIndex === 0) {
      const startTime = this.getFormatDate(val)
      if (this.validateTime(startTime, this.props.endTime)) {
        this.props.setStartTime(startTime)
      }
    } else {
      const endTime = this.getFormatDate(val)
      if (this.validateTime(this.props.startTime, endTime)) {
        this.props.setEndTime(endTime)
      }
    }
  }
  openPicker = idx => {
    const val = idx === 0 ? this.props.startTime : this.props.endTime
    this.pickerIndex = idx
    this.setState({
      visible: true,
      selectedValue: this.getDefaultDate(val)
    })
  }
  render() {
    return (
      <View style={style.menu_item_datepiker}>
        <TouchableOpacity
          onPress={() => {
            this.openPicker(0)
          }}
        >
          <Text>{this.props.startTime}</Text>
        </TouchableOpacity>
        <Text>-</Text>
        <TouchableOpacity
          onPress={() => {
            this.openPicker(1)
          }}
        >
          <Text>{this.props.endTime}</Text>
        </TouchableOpacity>
        <Picker
          visible={this.state.visible}
          type={'date'}
          onPickerConfirm={this.onPickerConfirm}
          selectedValue={this.state.selectedValue}
          closeModal={() => {
            this.setState({ visible: false })
          }}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  menu_item_datepiker: {
    width: 255,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#eee',
    borderRadius: 5,
    borderWidth: 1,
    ...DisplayStyle('row', 'center', 'space-between')
  }
})
