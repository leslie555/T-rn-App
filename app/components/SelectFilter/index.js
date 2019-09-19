import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { CommonColor, DisplayStyle } from '../../styles/commonStyles'
import IconFont from '../../utils/IconFont'
import Picker from '../Picker'

export default class SelectFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      text: this.props.defaultValue || this.props.title,
      textColor: CommonColor.color_text_primary,
      color: '#ddd',
      pickerData: []
    }
  }

  static defaultProps = {
    title: '',
    defaultValue: '',
    handler: () => {}
  }

  componentWillMount() {
    const pickerData = [...this.props.pickerData]

    pickerData.unshift({ label: '全部', value: '' })
    this.setState({
      pickerData
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue) {
      if (this.props.defaultValue !== nextProps.defaultValue) {
        const data = nextProps.pickerData.find(
          val => val.label === nextProps.defaultValue
        )
        this.onPickerConfirm(data)
      }
    }
  }

  _onPress() {
    //
    /* pickerInit({
      pickerData: this.state.pickerData,
      selectedValue: this.state.text,
      onPickerConfirm: data => {
        const val = data.label
        if (val === '全部') {
          this.setState({
            text: this.props.title,
            textColor: CommonColor.color_text_primary,
            color: '#999'
          })
        } else {
          this.setState({
            text: val,
            textColor: '#389ef2',
            color: '#389ef2'
          })
        }
        this.props.handler(data)
      }
    }) */
    const preVisibel = this.state.visible
    this.setState({
      visible: !preVisibel
    })
  }

  onPickerConfirm = data => {
    const val = data.label
    if (val === '全部') {
      this.setState({
        text: this.props.title,
        textColor: CommonColor.color_text_primary,
        color: '#ddd'
      })
    } else {
      this.setState({
        text: val,
        textColor: '#389ef2',
        color: '#389ef2'
      })
    }
    this.props.handler(data)
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this._onPress.bind(this)}
        style={style.topbarContainer}
      >
        <Text
          style={{
            ...style.text,
            color: this.state.textColor
          }}
        >
          {this.state.text}
        </Text>
        <IconFont name='sanjiaoxing' size={10} color={this.state.color} />
        <Picker
          pickerData={this.state.pickerData}
          selectedValue={this.state.text}
          onPickerConfirm={this.onPickerConfirm}
          visible={this.state.visible}
          closeModal={() => {
            this.setState({ visible: false })
          }}
        />
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  topbarContainer: {
    ...DisplayStyle('row', 'center', 'center')
  },
  text: {
    fontSize: 16,
    color: CommonColor.color_text_primary,
    marginRight: 5
  }
})
