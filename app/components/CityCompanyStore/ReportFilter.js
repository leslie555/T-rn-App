import React, { Component } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import SinglePicker from '../../components/SinglePicker'
import IconFont from '../../utils/IconFont'
import { DisplayStyle, CommonColor } from '../../styles/commonStyles'

export default class ReportFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      selectedValue: 0,
      pickerData: []
    }
  }

  _onPickerConfirm = data => {
    const val = data.CompanyName
    if (val === '全部') {
      this.props.setShowing({
        text: this.props.title,
        selectedValue: data.KeyID,
        color: '#363636'
      })
      this.props.selected && this.props.selected(data)
    } else {
      this.props.setShowing({
        text: val,
        selectedValue: data.KeyID,
        color: CommonColor.color_primary
      })
      this.props.selected && this.props.selected(data)
    }
  }

  _onPress = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pickerData !== nextProps.pickerData) {
      const pickerData = [...nextProps.pickerData]
      pickerData.unshift({ CompanyName: '全部', KeyID: 0 })
      this.setState({
        pickerData
      })
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={styles.select_btn}
        disabled={this.props.disabled}
      >
        <Text style={[styles.select_text, { color: this.props.showing.color }]}>
          {this.props.showing.text.length > 5
            ? this.props.showing.text.slice(0, 4) + '...'
            : this.props.showing.text}
        </Text>
        <IconFont
          name='sanjiaoxing'
          size={10}
          color={this.props.showing.color}
        />
        <SinglePicker
          visible={this.state.visible}
          pickerData={this.state.pickerData}
          selectedValue={this.props.showing.selectedValue}
          onPickerConfirm={this._onPickerConfirm}
          option={{ label: 'CompanyName', value: 'KeyID' }}
          onPickerCancel={() =>
            this.setState({
              visible: false
            })
          }
          closeModal={() => {
            this.setState({ visible: false })
          }}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  select_btn: {
    ...DisplayStyle('row', 'center', 'center')
  },
  select_text: {
    fontSize: 15,
    marginRight: 3,
    color: CommonColor.color_text_primary
  }
})
