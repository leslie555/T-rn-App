import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Modal from '../Modal'
import { hidePicker, showPicker, pickerInit } from '../../utils/Picker'

export default class SingerPicker extends Component {
  constructor(props) {
    super(props)
    this.picker = () => {}
    this.selectedValue = ''
  }

  static defaultProps = {
    visible: false
  }

  componentWillReceiveProps(nextProps) {
    let option = nextProps.option
    if (!option) {
      option = {
        label: 'label',
        value: 'value'
      }
    }
    if (this.props.selectedValue || this.props.selectedValue === 0) {
      const item =
        nextProps.pickerData.find(
          x => x[option.value] === nextProps.selectedValue
        ) || {}
      this.selectedValue = item[option.label]
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.visible !== this.props.visible
  }

  componentDidUpdate() {
    if (this.props.visible) {
      setTimeout(() => {
        pickerInit({
          ...this.props,
          selectedValue: this.selectedValue,
          onPickerConfirm: (data, idx) => {
            this.props.closeModal()
            this.props.onPickerConfirm && this.props.onPickerConfirm(data, idx)
          },
          onPickerCancel: (data, idx) => {
            this.props.closeModal()
            this.props.onPickerCancel && this.props.onPickerCancel(data, idx)
          },
          onPickerSelect: (data, idx) => {
            this.props.onPickerSelect && this.props.onPickerSelect(data, idx)
          }
        })
        showPicker()
      }, 100)
    } else {
      setTimeout(hidePicker, 100)
    }
  }

  render() {
    return (
      <Modal
        animationType={'fade'} // 过渡效果
        transparent={true} // 透明
        visible={this.props.visible} // 是否显示
        onRequestClose={() => {
          this.props.closeModal()
        }} // android必须实现
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            this.props.closeModal()
            // showPicker()
          }}
        />
      </Modal>
    )
  }
}
