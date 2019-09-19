import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { DisplayStyle } from '../../styles/commonStyles'
import Picker from '../Picker'
import Toast from 'react-native-root-toast'
import deepClone from '../../utils/deepClone'

const COLOR_HIGH = '#389ef2'
const COLOR_NORMAL = '#6c6c6c'

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
    if (!t1 || !t2) return true
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
    if (val) {
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
    const tempPanelSelected = deepClone(this.props.tempPanelSelected)
    if (this.pickerIndex === 0) {
      const startTime = this.getFormatDate(val)
      if (
        this.validateTime(
          startTime,
          tempPanelSelected[this.props.subindex].data.endTime
        )
      ) {
        tempPanelSelected[this.props.subindex].data.startTime = startTime
      }
    } else {
      const endTime = this.getFormatDate(val)
      if (
        this.validateTime(
          tempPanelSelected[this.props.subindex].data.startTime,
          endTime
        )
      ) {
        tempPanelSelected[this.props.subindex].data.endTime = endTime
      }
    }
    this.props.setPanelSelected(tempPanelSelected)
  }
  openPicker = idx => {
    const val =
      idx === 0
        ? this.props.tempPanelSelected[this.props.subindex].data.startTime
        : this.props.tempPanelSelected[this.props.subindex].data.endTime
    this.pickerIndex = idx
    this.setState({
      visible: true,
      selectedValue: this.getDefaultDate(val)
    })
  }
  render() {
    return (
      <View style={styles.checkBoxContainer}>
        <View style={styles.checkBoxTitle}>
          <Text style={styles.checkBoxTitleText}>{this.props.title}</Text>
        </View>
        <View style={styles.menu_item_datepiker}>
          <TouchableOpacity
            onPress={() => {
              this.openPicker(0)
            }}
          >
            <Text>
              {this.props.tempPanelSelected[this.props.subindex].data
                .startTime || '开始时间'}
            </Text>
          </TouchableOpacity>
          <Text>-</Text>
          <TouchableOpacity
            onPress={() => {
              this.openPicker(1)
            }}
          >
            <Text>
              {this.props.tempPanelSelected[this.props.subindex].data.endTime ||
                '结束时间'}
            </Text>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menu_item_datepiker: {
    width: 255,
    height: 40,
    margin: 5,
    paddingHorizontal: 20,
    borderColor: '#eee',
    borderRadius: 5,
    borderWidth: 1,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  checkBoxContainer: {
    marginBottom: 5
  },
  checkBoxTitle: {
    paddingBottom: 10
  },
  checkBoxTitleText: {
    color: COLOR_NORMAL,
    fontSize: 12
  }
})
