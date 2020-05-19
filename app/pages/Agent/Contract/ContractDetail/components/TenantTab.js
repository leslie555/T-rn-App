import React, { Component, Fragment } from 'react'
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
      filteredInfo: {},
      LivePeopleInfoList: []
    }
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this._filterData(nextProps.data)
    }
  }
  _filterData(data) {
    console.log(data)
    const { TenantContractInfo, LivePeopleInfoList } = data
    const filteredInfo = {}
    filteredInfo.TenantName = TenantContractInfo.TenantName // 租客姓名
    filteredInfo.TenantPhone = TenantContractInfo.TenantPhone // 租客电话
    filteredInfo.TenantCard = TenantContractInfo.TenantCard // 租客身份证
    filteredInfo.TenantSex = getEnumDesByValue('Sex', TenantContractInfo.TenantSex) // 租客性别
    filteredInfo.Email = TenantContractInfo.Email // 电子邮箱
    filteredInfo.EmergencyContactName = TenantContractInfo.EmergencyContactName // 紧急联系人姓名
    filteredInfo.EmergencyContactPhone =
      TenantContractInfo.EmergencyContactPhone // 紧急联系人电话
    filteredInfo.AgentName = TenantContractInfo.AgentName // 代办人姓名
    filteredInfo.AgentPhone = TenantContractInfo.AgentPhone // 代办人电话
    filteredInfo.AgentIDCard = TenantContractInfo.AgentCard // 代办人身份证
    filteredInfo.WeChatNumber = TenantContractInfo.WeChatNumber // 微信号
    filteredInfo.MarryStatus = TenantContractInfo.MarryStatus // 婚姻状况
    filteredInfo.Profession = TenantContractInfo.Profession // 职业
    filteredInfo.Nation = TenantContractInfo.Nation // 民族
    filteredInfo.PermanentAddress = TenantContractInfo.PermanentAddress // 户籍地址
    this.setState({
      filteredInfo,
      LivePeopleInfoList
    })
  }
  _renderTenantInfo() {
    const { filteredInfo } = this.state
    return (
      <View
        style={{
          ...style.rowContainer,
          borderBottomColor: '#eee',
          borderBottomWidth: 1,
          paddingBottom: 15
        }}
      >
        {/* <PlaceholderText
          width='30%'
          labelStyle={{ fontWeight: 'bold' }}
          label={filteredInfo.TenantName}
          onReady={this.props.isReady}
        /> */}
        <PlaceholderText label={'租客:'} onReady={this.props.isReady}>
          {filteredInfo.TenantName || '无'}  {filteredInfo.TenantPhone || '无'}
        </PlaceholderText>
        <PlaceholderText label={'身份证号:'} onReady={this.props.isReady}>
          {filteredInfo.TenantCard || '无'}
        </PlaceholderText>
        <PlaceholderText label={'性别:'} onReady={this.props.isReady}>
          {filteredInfo.TenantSex || '无'}
        </PlaceholderText>
        <PlaceholderText label={'民族:'} onReady={this.props.isReady}>
          {filteredInfo.Nation || '无'}
        </PlaceholderText>
        <PlaceholderText label={'电子邮箱:'} onReady={this.props.isReady}>
          {filteredInfo.Email || '无'}
        </PlaceholderText>
        <PlaceholderText label={'微信号:'} onReady={this.props.isReady}>
          {filteredInfo.WeChatNumber || '无'}
        </PlaceholderText>
        <PlaceholderText label={'婚姻状况:'} onReady={this.props.isReady}>
          {getEnumDesByValue('MarryStatus',filteredInfo.MarryStatus) || '无'}
        </PlaceholderText>
        <PlaceholderText label={'职业:'} onReady={this.props.isReady}>
          {filteredInfo.Profession || '无'}
        </PlaceholderText>
        <PlaceholderText label={'户籍地址:'} onReady={this.props.isReady}>
          {filteredInfo.PermanentAddress || '无'}
        </PlaceholderText>
      </View>
    )
  }
  render() {
    const isReady = this.props.isReady
    const { filteredInfo } = this.state
    return (
      <ScrollView>
        <View>
          {this._renderTenantInfo()}
          <View style={{ ...style.rowContainerRent }}>
            {
              this.state.LivePeopleInfoList.map((item, index) => {
                return(
                  <Fragment key={index}>
                    <PlaceholderText label={this.state.LivePeopleInfoList.length === 1 ? '合租人:' : `合租人${(index + 1)}:`} onReady={isReady} width='30%'>
                    {`${item.LiverName || '无'}   ${
                      item.LiverPhone
                    }`}
                  </PlaceholderText>
                  {
                    index !== 0 ? <PlaceholderText label={'关系:'} onReady={isReady}>
                      {getEnumDesByValue('Relationship', item.Relationship) || '无'}
                    </PlaceholderText> : null
                  }
                  <PlaceholderText label={'身份证号:'} onReady={isReady}>
                    {item.CardID || '无'}
                  </PlaceholderText>
                  </Fragment>
                )
              })
            }
          </View>
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
      </ScrollView>
    )
  }
}
const style = StyleSheet.create({
  rowContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    width: DEVICE_WIDTH,
    padding: 15,
    backgroundColor: CommonColor.color_white,
  },
  rowContainerRent: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    width: DEVICE_WIDTH,
    padding: 15,
    backgroundColor: CommonColor.color_white,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  }
})
