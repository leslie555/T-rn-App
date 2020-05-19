import React, { Component } from 'react'
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'

import { View, StyleSheet, ScrollView } from 'react-native'
import { PlaceholderText } from '../../../../../components'
import { getEnumDesByValue } from '../../../../../utils/enumData'
export default class OwnerTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredInfo: {}
    }
  }
  componentWillMount() { }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this._filterData(nextProps.data)
    }
  }
  _filterData(data) {
    const { OwnerContract, HouseInfo } = data
    const filteredInfo = {}
    if (!data.OwnerInfos.length) {
      // 兼容之前老数据OwnerInfo为空的情况
      filteredInfo.OwnerInfos = [
        // 业主信息
        {
          OwnerIDCard: OwnerContract.OwnerIDCard,
          OwnerName: OwnerContract.OwnerName,
          OwnerPhone: OwnerContract.OwnerPhone
        }
      ]
    } else {
      filteredInfo.OwnerInfos = data.OwnerInfos
    }
    filteredInfo.CollectionType = OwnerContract.CollectionType
    filteredInfo.CollectionTypeDES = getEnumDesByValue(
      // 收款方式
      'PaymentMethod',
      OwnerContract.CollectionType
    )
    filteredInfo.ReceivePeopleName = OwnerContract.ReceivePeopleName // 收款人姓名
    filteredInfo.ReceiveAccount = OwnerContract.ReceiveAccount // 收款账号
    filteredInfo.BankName = OwnerContract.BankName // 银行名称
    filteredInfo.BankAccount = OwnerContract.BankAccount // 银行账号
    filteredInfo.OpenBankName = OwnerContract.OpenBankName // 开户行
    filteredInfo.EmergencyContactName = OwnerContract.EmergencyContactName // 紧急联系人姓名
    filteredInfo.EmergencyContactPhone = OwnerContract.EmergencyContactPhone // 紧急联系人电话
    filteredInfo.AgentName = OwnerContract.AgentName // 代办人姓名
    filteredInfo.AgentPhone = OwnerContract.AgentPhone // 代办人电话
    filteredInfo.AgentIDCard = OwnerContract.AgentIDCard // 代办人身份证
    filteredInfo.ContractAddress = OwnerContract.ContractAddress // 通讯地址
    filteredInfo.Postcode = OwnerContract.Postcode // 邮编
    filteredInfo.Email = OwnerContract.Email // 电子邮箱
    filteredInfo.ProductionLicenseAddress = OwnerContract.ProductionLicenseAddress // 产权地址
    filteredInfo.MortgageStatus = OwnerContract.MortgageStatus // 抵押状况
    filteredInfo.OwnershipStatus = OwnerContract.OwnershipStatus // 权属状况
    filteredInfo.ProductionLicenseNumber = OwnerContract.ProductionLicenseNumber // 所有权证书编号
    filteredInfo.RoomCount = OwnerContract.RoomCount // 房产类型
    filteredInfo.HallCount = OwnerContract.HallCount
    filteredInfo.AgentAddress = OwnerContract.AgentAddress
    filteredInfo.HouseArea = HouseInfo.HouseArea
    this.setState({
      filteredInfo
    })
  }
  _renderOwnerInfo() {
    return this.state.filteredInfo.OwnerInfos.map((val, idx) => {
      return (
        <View
          key={idx}
          style={{
            ...style.rowContainer,
            // height: 78,
            borderBottomColor: '#eee',
            borderBottomWidth: 1
          }}
        >
          <PlaceholderText
            label={
              '业主' +
              (this.state.filteredInfo.OwnerInfos.length > 1 ? idx + 1 : '') +
              ':'
            }
            onReady={this.props.isReady}
          >
            {`${val.OwnerName}   ${val.OwnerPhone}`}
          </PlaceholderText>
          <PlaceholderText label={'身份证号:'} onReady={this.props.isReady}>
            {val.OwnerIDCard || '无'}
          </PlaceholderText>
          <PlaceholderText label={'性别:'} onReady={this.props.isReady}>
            {getEnumDesByValue(
              'Sex',
              val.OwnerSex
            )}
          </PlaceholderText>
          <PlaceholderText label={'通信地址:'} onReady={this.props.isReady}>
            {(idx === 0 ? this.state.filteredInfo.ContractAddress : val.ContractAddress) || '无'}
          </PlaceholderText>
        </View>
      )
    })
  }
  render() {
    const isReady = this.props.isReady
    const { filteredInfo } = this.state
    return (
      <ScrollView>
        {isReady && this._renderOwnerInfo()}
        <View
          style={{
            ...style.rowContainer,
            borderBottomColor: '#eee',
            borderBottomWidth: 1
          }}
        >
          <PlaceholderText label={'房产类型:'} onReady={this.props.isReady}>
          {this.state.filteredInfo.RoomCount>0 ? (this.state.filteredInfo.RoomCount +'室') : '无'} {this.state.filteredInfo.HallCount>0 ? (this.state.filteredInfo.HallCount +'厅'):''}
          </PlaceholderText>
          <PlaceholderText label={'房屋面积:'} onReady={this.props.isReady}>
            {this.state.filteredInfo.HouseArea || '无'}
          </PlaceholderText>
          <PlaceholderText label={'邮编:'} onReady={this.props.isReady}>
            {this.state.filteredInfo.Postcode || '无'}
          </PlaceholderText>
          <PlaceholderText label={'电子邮箱:'} onReady={this.props.isReady}>
            {this.state.filteredInfo.Email || '无'}
          </PlaceholderText>
          <PlaceholderText label={'产权地址:'} onReady={this.props.isReady}>
            {this.state.filteredInfo.ProductionLicenseAddress || '无'}
          </PlaceholderText>
          <PlaceholderText label={'抵押状况:'} onReady={this.props.isReady}>
            {getEnumDesByValue('MortgageStatus',this.state.filteredInfo.MortgageStatus) || '无'}
          </PlaceholderText>
          <PlaceholderText label={'权属状况:'} onReady={this.props.isReady}>
            {getEnumDesByValue('OwnershipStatus',this.state.filteredInfo.OwnershipStatus) || '无'}
          </PlaceholderText>
          <PlaceholderText label={'所有权证书编号:'} onReady={this.props.isReady}>
            {this.state.filteredInfo.ProductionLicenseNumber || '无'}
          </PlaceholderText>
        </View>
        <View
          style={{
            ...style.rowContainer,
            borderBottomColor: '#eee',
            borderBottomWidth: 1
          }}
        >
          <PlaceholderText label={'收款方式:'} onReady={isReady} width='30%'>
            {filteredInfo.CollectionTypeDES || '无'}
          </PlaceholderText>
          {(filteredInfo.CollectionType == 2 ||
            filteredInfo.CollectionType == 3) && (
              <PlaceholderText label={'收款人姓名:'} onReady={isReady}>
                {filteredInfo.ReceivePeopleName || '无'}
              </PlaceholderText>
            )}
          {(filteredInfo.CollectionType == 2 ||
            filteredInfo.CollectionType == 3) && (
              <PlaceholderText label={'收款账号:'} onReady={isReady}>
                {filteredInfo.ReceiveAccount || '无'}
              </PlaceholderText>
            )}
          {filteredInfo.CollectionType == 4 && (
            <PlaceholderText label={'转款账户:'} onReady={isReady}>
              {filteredInfo.ReceiveAccount || '无'}
            </PlaceholderText>
          )}
          {filteredInfo.CollectionType == 4 && (
            <PlaceholderText label={'银行名称:'} onReady={isReady}>
              {filteredInfo.BankName || '无'}
            </PlaceholderText>
          )}
          {filteredInfo.CollectionType == 4 && (
            <PlaceholderText label={'银行账号:'} onReady={isReady}>
              {filteredInfo.BankAccount || '无'}
            </PlaceholderText>
          )}
          {filteredInfo.CollectionType == 4 && (
            <PlaceholderText label={'开户行:'} onReady={isReady}>
              {filteredInfo.OpenBankName || '无'}
            </PlaceholderText>
          )}
        </View>
        {/* wu */}
        {/* <View style={{
          ...style.rowContainer,
          borderBottomColor: '#eee',
          borderBottomWidth: 1
        }}>
          <PlaceholderText label={'产权共有人:'} onReady={isReady} width='30%'>
            {`${filteredInfo.EmergencyContactName || '无'}   ${
              filteredInfo.EmergencyContactPhone
              }`}
          </PlaceholderText>
          <PlaceholderText label={'身份证号:'} onReady={isReady}>
            {filteredInfo.Email || '无'}
          </PlaceholderText>
          <PlaceholderText label={'通讯地址:'} onReady={isReady}>
            {filteredInfo.AgentIDCard || '无'}
          </PlaceholderText>
        </View> */}
        <View style={{ ...style.rowContainer }}>
          {/* <PlaceholderText label={'邮编:'} onReady={isReady}>
            {filteredInfo.Postcode || '无'}
          </PlaceholderText>
          <PlaceholderText label={'电子邮箱:'} onReady={isReady}>
            {filteredInfo.Email || '无'}
          </PlaceholderText> */}
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
          <PlaceholderText label={'通讯地址:'} onReady={isReady}>
            {filteredInfo.AgentAddress || '无'}
          </PlaceholderText>
        </View>
      </ScrollView>
    )
  }
}
const style = StyleSheet.create({
  rowContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    width: DEVICE_WIDTH,
    padding: 15,
    lineHeight: 50,
    backgroundColor: CommonColor.color_white
  }
})
