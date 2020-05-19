import React, { Component } from 'react'
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'

import { View, StyleSheet } from 'react-native'
import { PlaceholderText } from '../../../../../components'
import { getEnumDesByValue } from '../../../../../utils/enumData'

export default class OwnerTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredInfo: {}
    }
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this._filterData(nextProps.data)
    }
  }
  _filterData(data) {
    const { TenantContractInfo } = data
    const filteredInfo = {}
    filteredInfo.TenantName = TenantContractInfo.TenantName // 租客姓名
    filteredInfo.TenantPhone = TenantContractInfo.TenantPhone // 租客电话
    filteredInfo.TenantCard = TenantContractInfo.TenantCard // 租客身份证
    filteredInfo.EmergencyContactName = TenantContractInfo.EmergencyContactName // 紧急联系人姓名
    filteredInfo.EmergencyContactPhone =
      TenantContractInfo.EmergencyContactPhone // 紧急联系人电话
    filteredInfo.AgentName = TenantContractInfo.AgentName // 代办人姓名
    filteredInfo.AgentPhone = TenantContractInfo.AgentPhone // 代办人电话
    filteredInfo.AgentIDCard = TenantContractInfo.AgentCard // 代办人身份证
    this.setState({
      filteredInfo
    })
  }
  _renderTenantInfo() {
    const { filteredInfo } = this.state
    return (
      <View
        style={{
          ...style.rowContainer,
          borderBottomColor: '#eee',
          borderBottomWidth: 1
        }}
      >
        <PlaceholderText
          width='30%'
          labelStyle={{ fontWeight: 'bold' }}
          label={filteredInfo.TenantName}
          onReady={this.props.isReady}
        />
        <PlaceholderText label={'手机号码:'} onReady={this.props.isReady}>
          {filteredInfo.TenantPhone || '无'}
        </PlaceholderText>
        <PlaceholderText label={'身份证号:'} onReady={this.props.isReady}>
          {filteredInfo.TenantCard || '无'}
        </PlaceholderText>
      </View>
    )
  }
  render() {
    const isReady = this.props.isReady
    const { filteredInfo } = this.state
    return (
      <View>
        {this._renderTenantInfo()}
        <View style={{ ...style.rowContainer }}>
          <PlaceholderText label={'紧急联系人:'} onReady={isReady} width='30%'>
            {`${filteredInfo.EmergencyContactName || '无'}   ${
              filteredInfo.EmergencyContactPhone
            }`}
          </PlaceholderText>
          <PlaceholderText label={'代办人:'} onReady={isReady}>
            {`${filteredInfo.AgentName || '无'}   ${filteredInfo.AgentPhone}`}
          </PlaceholderText>
          <PlaceholderText label={'代办人身份证号:'} onReady={isReady}>
            {filteredInfo.AgentIDCard || '无'}
          </PlaceholderText>
        </View>
      </View>
    )
  }
}
const style = StyleSheet.create({
  rowContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    width: DEVICE_WIDTH,
    padding: 15,
    backgroundColor: CommonColor.color_white
  }
})
