import React, {Component} from 'react'
import {Platform, TouchableOpacity, View} from 'react-native'
import {Modal} from '../../components'
import {
  areaPickerInit,
  cascaderInit,
  datePickerInit,
  hidePicker,
  pickerInit,
  showPicker,
  timePickerInit,
  dateYearMonthInit
} from '../../utils/Picker'

export default class Picker extends Component {
  constructor(props) {
    super(props)
    this.picker = () => {
    }
  }

  static defaultProps = {
    visible: false,
    type: 'default'
  }

  componentWillMount() {
    switch (this.props.type) {
      case 'date':
        this.picker = datePickerInit
        break
      case 'dateYearMonth':
        this.picker = dateYearMonthInit
        break
      case 'time':
        this.picker = timePickerInit
        break
      case 'area':
        this.picker = areaPickerInit
        break
      case 'cascader':
        this.picker = cascaderInit
        break
      default:
        this.picker = pickerInit
        break
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.visible !== this.props.visible
  }

  componentDidUpdate() {
    if (this.props.visible) {

    } else {
      hidePicker()
    }
  }

  onShowPicker() {
    this.picker({
      ...this.props,
      onPickerConfirm: (data, idx) => {
        this.props.closeModal()
        this.props.onPickerConfirm && this.props.onPickerConfirm(data, idx)
      },
      onPickerConfirmCloseModal: (data, idx) => {
        this.props.closeModal()
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
  }

  render() {
    return (
        <Modal
            animationType={Platform.OS == 'ios' ? 'none' : 'fade'} // 过渡效果
            transparent={true} // 透明
            visible={this.props.visible} // 是否显示
            onRequestClose={() => {
              this.props.closeModal()
            }} // android必须实现
            onShow={() => {
              this.onShowPicker()
            }}
        >
          <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
