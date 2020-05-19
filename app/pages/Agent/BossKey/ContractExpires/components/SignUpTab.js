import React from 'react'
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'

import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Separator, ImagePreview } from '../../../../../components'
import { getEnumDesByValue } from '../../../../../utils/enumData'
import { dateFormat, diffTime } from '../../../../../utils/dateFormat'
import { cn } from 'nzh'
import IconFont from '../../../../../utils/IconFont'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { viewPDFContract } from '../../../../../api/tenant'
import { withNavigation } from 'react-navigation'

const Item = props => {
  const textStyle = { color: '#999'}
  if(!props.rightIcon){
    textStyle.flex = 1
  }
  return (
    <View
      style={{
        ...DisplayStyle('row', 'center', 'flex-start'),
        marginVertical: 5,
        width: props.width || DEVICE_WIDTH - 30
      }}
    >
      <Text style={{ color: '#363636', marginRight: 5, ...props.labelStyle }}>
        {props.label}
      </Text>
      <Text style={{...textStyle, ...props.textStyle }}>
        {props.children}
      </Text>
      {props.rightIcon}
    </View>
  )
}

class SignUpTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredInfo: {}
    }
  }
  componentWillMount() {
    this._filterData(this.props.data, this.props.isReady)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.isReady !== nextProps.isReady) {
      this._filterData(nextProps.data, nextProps.isReady)
    }
  }
  _filterData(data, isReady) {
    if (!isReady) return
    const { isOwner } = this.props
    const contract = isOwner ? data.OwnerContract : data.TenantContractInfo // 合同的数据
    const contractOperate = isOwner
      ? data.OwnerContractOperate
      : data.TenantContractOperate // 合同操作相关数据
    const filteredInfo = {}
    // 合同ID
    filteredInfo.KeyID = contract.KeyID
    // 合同状态
    filteredInfo.ContractStatus = isOwner
      ? contractOperate.LeaseStatus
      : contractOperate.RentLeaseStatus
    // 合同编号
    filteredInfo.ContractNumber = contract.ContractNumber
    // 合同类型
    filteredInfo.PaperType = contract.PaperType
    filteredInfo.PaperTypeDes = getEnumDesByValue(
      'PaperType',
      contract.PaperType
    )
    // 托管时间或租期
    const sTime = isOwner ? contract.HostStartTime : contract.StartTime
    const eTime = isOwner ? contract.HostEndTime : contract.EndTime
    filteredInfo.HostTime = `${dateFormat(sTime)} 至 ${dateFormat(
      eTime
    )} (${diffTime(sTime, eTime)})`
    // 拿房价格或租金
    filteredInfo.InitialPrice = isOwner
      ? contract.InitialPrice
      : contract.HouseRent
    // 押金
    filteredInfo.HouseDeposit = contract.HouseDeposit
    // 付款周期或付款方式
    filteredInfo.PayCycle = isOwner
      ? getEnumDesByValue('PayCycle', contract.PayCycle)
      : `押  ${cn.encodeS(contract.DepositModel)}  付  ${cn.encodeS(
          contract.PayModel
        )} `
    if (isOwner) {
      // 付款模式
      filteredInfo.StagingModel = getEnumDesByValue(
        'StagingModel',
        contract.StagingModel
      )
      filteredInfo.NoPayMonth =
        contract.PayModel === 2 ? contract.NoPayMonth + '个月' : ''
      const modelEnum = [
        { label: '无', value: 0 },
        { label: '首付10%', value: 1 },
        { label: '第一年不付', value: 2 }
      ]
      filteredInfo.PayModel = modelEnum.find(
        v => v.value === contract.PayModel
      ).label
      // 免租期限
      filteredInfo.FreeDays = contract.FreeDays + '个月'
      // 水卡号
      filteredInfo.WaterCardNumber = contract.WaterCardNumber
      // 电卡号
      filteredInfo.ElectricityCardNumber = contract.ElectricityCardNumber
      // 气卡号
      filteredInfo.GasCardNumber = contract.GasCardNumber
    } else {
      // 签约时间
      filteredInfo.SignTime = dateFormat(contractOperate.SignTime)
      // 出房人
      filteredInfo.OutRoominfoList = data.OutRoominfoList.map(
        v => v.UserName
      ).join('  ')
      // 租金包含费用
      filteredInfo.RentIncludeCost = JSON.parse(
        contract.RentIncludeCost || '[]'
      )
        .map(val => {
          return `${getEnumDesByValue('RentIncludeCost', val.KeyID)} (${
            val.Price
          }元/月)`
        })
        .join(', ')
    }
    // 下期收租日
    filteredInfo.ContractNextPayDate = isOwner
      ? dateFormat(contractOperate.NextPayDate)
      : dateFormat(contractOperate.NextPayTime)
    // 最晚付款日
    filteredInfo.LastPayTime =
      contract.PayTimeType == 0
        ? '提前' + contract.PayDays + '天支付租金'
        : contract.PayTimeType == 1
        ? '固定' + contract.PayDays + '号支付租金（每期第一个月）'
        : '固定' + contract.PayDays + '号支付租金（每期提前一个月)'
    // 拿房人
    // 审核状态
    filteredInfo.AuditStatus = contractOperate.AuditStatus

    filteredInfo.AuditStatusDes = getEnumDesByValue(
      'AuditStatus',
      contractOperate.AuditStatus
    )
    // 审核人
    filteredInfo.AuditorName = contractOperate.AuditorName
    // 审核时间
    filteredInfo.AuditTime = dateFormat(contractOperate.AuditTime)
    // 备注
    filteredInfo.AuditRemark = contractOperate.AuditRemark
    // 水表度数
    filteredInfo.WaterNumber = isOwner
      ? contract.WaterNumber
      : contract.WaterBaseNumber
    // 电表度数
    filteredInfo.ElectricityNumber = isOwner
      ? contract.ElectricityNumber
      : contract.ElectricityBaseNumber
    // 气度数
    filteredInfo.GasNumber = isOwner
      ? contract.GasNumber
      : contract.GasBaseNumber
    // 附加条款
    filteredInfo.ContractRemark = isOwner
      ? contract.ContractRemark
      : contract.TenantContractRemark
    // 图片
    filteredInfo.ImageUpload = data.ImageUpload
    // 家具清单
    if (data.TenantConTractQuipment) {
      let str = ''
      data.TenantConTractQuipment.forEach((x, i) => {
        str += `${x.QuipmentName}*${x.Number}${i < data.TenantConTractQuipment.length - 1 ? `、` : ''}`
      })
      filteredInfo.TenantEquipmentStr = str
    }
    // 装修情况
    console.log(data.TenDecoration,data.Decoration)
    if (data.TenDecoration && data.Decoration) {
      const list = []
      let str = ''
      data.Decoration.forEach(x => {
        if (x.PDecoration && x.PDecoration.length > 0) {
          let cStr = ''
          x.PDecoration.forEach((y, yi) => {
            if (data.TenDecoration.find(z => z.DecorationID === y.KeyID)) {
              if (!list[x.KeyID]) {
                list[x.KeyID] = true
                cStr += `${x.Name}(${y.Name}、`
              } else {
                cStr += `${y.Name}、`
              }
            }
            if (yi === x.PDecoration.length - 1 && cStr.length > 0) {
              cStr = cStr.slice(0, -1) + ')、'
            }
          })
          str += cStr
        }
      })
      if (str.length > 0) {
        str = str.slice(0, -1)
      }
      filteredInfo.TenDecorationStr = str
    }
    if(data.OwnerEquipments) {
      let str = ''
      data.OwnerEquipments.forEach((x, i) => {
        str += `${x.EquipmentName}*${x.EquipmentNumber}${i < data.OwnerEquipments.length - 1 ? `、` : ''}`
      })
      filteredInfo.ContractEquipments = str
    }
    this.setState({
      filteredInfo
    })
  }
  handlePDFClick = () => {
    this.props.navigation.navigate('AgentViewContractPDF', { id: this.state.filteredInfo.KeyID,type: this.props.isOwner ? 1 : 2})
  }
  render() {
    const isReady = this.props.isReady
    const  isOwner  = !!this.props.isOwner
    const { filteredInfo } = this.state
    return (
      <ScrollView>
        <View
          style={{
            ...style.headContainer
          }}
        >
          <View
            style={{
              ...DisplayStyle('row', 'center', 'flex-start')
            }}
          >
            <Item
              label={'合同编号:'}
              labelStyle={{ fontWeight: 'bold' }}
              textStyle={{ fontWeight: 'bold', color: '#363636' }}
              rightIcon={filteredInfo.PaperType === 0 &&
              filteredInfo.AuditStatus === 2 && (
                  <TouchableOpacity
                      style={{ marginLeft: 10 }}
                      onPress={this.handlePDFClick}
                  >
                    <IconFont name={'PDFtubiao'} size={20} color={'#ff9900'} />
                  </TouchableOpacity>
              )}
            >
              {filteredInfo.ContractNumber}
            </Item>

          </View>
          <Item label={'合同类型:'}> {filteredInfo.PaperTypeDes}</Item>
          <Item label={isOwner ? '托管时间:' : '租期:'}>
            {isReady && filteredInfo.HostTime}
          </Item>
          <View style={style.headStatusContainer}>
            <Item
              width={(DEVICE_WIDTH - 30) / 2}
              label={isOwner ? '拿房价:' : '租金:'}
            >
              {isReady && filteredInfo.InitialPrice + '元/月'}
            </Item>
            <Item width={(DEVICE_WIDTH - 30) / 2} label={'押金:'}>
              {' '}
              {filteredInfo.HouseDeposit + '元/月'}
            </Item>
          </View>
        </View>
        <View
          style={{
            ...style.headContainer
          }}
        >
          {/* <Item>租金包含费用:      {'  '}</Item> */}
          <Item label={isOwner ? '付款周期:' : '付款方式:'}>
            {isReady && filteredInfo.PayCycle}
          </Item>
          {isOwner ? (
            <Item label={'付款模式:'}>
              {isReady &&
                `${filteredInfo.StagingModel}  ${filteredInfo.PayModel}  ${
                  filteredInfo.NoPayMonth
                }`}
            </Item>
          ) : (
            <Item label={'签约时间:'}> {isReady && filteredInfo.SignTime}</Item>
          )}
          {isOwner ? (
            <Item label={'免租期限:'}> {isReady && filteredInfo.FreeDays}</Item>
          ) : (
            <Item label={'出房人:'}>
              {(isReady && filteredInfo.OutRoominfoList) || '无'}
            </Item>
          )}
        </View>
        <View
          style={{
            ...style.headContainer
          }}
        >
          <Item label={'下期收租日:'}>
            {isReady && filteredInfo.ContractNextPayDate}
          </Item>
          <Item label={'最晚付款日:'}>
            {isReady && filteredInfo.LastPayTime}
          </Item>
        </View>
        {!isOwner && (
          <View
            style={{
              ...style.headContainer
            }}
          >
            <Item label={'租金包含费用:'} style={{ lineHeight: 25 }}>
              {(isReady && filteredInfo.RentIncludeCost) || '无'}
            </Item>
          </View>
        )}
        <View
          style={{
            ...style.headContainer
          }}
        >
          <Item label={'审核状态:'}>
            {' '}
            {isReady && filteredInfo.AuditStatusDes}
          </Item>
          <Item label={'审核人:'}> {isReady && filteredInfo.AuditorName}</Item>
          <Item label={'审核时间:'}> {isReady && filteredInfo.AuditTime}</Item>
          <Item label={'备注:'}> {filteredInfo.AuditRemark || '无'}</Item>
        </View>
        <View
          style={{
            ...style.headContainer
          }}
        >
          <Item label={'水表度数:'} style={style.detailText}>
            {(isReady && filteredInfo.WaterNumber) || '-'}吨
          </Item>
          <Item label={'电表度数:'} style={style.detailText}>
            {(isReady && filteredInfo.ElectricityNumber) || '-'}度
          </Item>
          <Item label={'气表度数:'} style={style.detailText}>
            {(isReady && filteredInfo.GasNumber) || '-'}立方米
          </Item>
          {isOwner && (
            <Item label={'水卡号:'} style={style.detailText}>
              {filteredInfo.WaterCardNumber || '无'}
            </Item>
          )}
          {isOwner && (
            <Item label={'电卡号:'} style={style.detailText}>
              {filteredInfo.ElectricityCardNumber || '无'}
            </Item>
          )}
          {isOwner && (
            <Item label={'气卡号:'} style={style.detailText}>
              {filteredInfo.GasCardNumber || '无'}
            </Item>
          )}
        </View>
        {!isOwner&&<Separator label={'装修情况'} />}
        {!isOwner&&
        <View style={style.remarkContainer}>
          <Text>{(isReady && filteredInfo.TenDecorationStr) || '无'}</Text>
        </View>}
        {!isOwner&&<Separator label={'家具清单'} />}
        {!isOwner&&
        <View style={style.remarkContainer}>
          <Text>{(isReady && filteredInfo.TenantEquipmentStr) || '无'}</Text>
        </View>}
        {isOwner&&<Separator label={'房屋设备'} />}
        {isOwner&&
        <View style={style.remarkContainer}>
          <Text>{(isReady && filteredInfo.ContractEquipments) || '无'}</Text>
        </View>}
        <Separator label={'附加条款'} />
        <View style={style.remarkContainer}>
          <Text>{(isReady && filteredInfo.ContractRemark) || '无'}</Text>
        </View>
        <Separator label={'图片'} />
        <View style={style.imgContainer}>
          <ImagePreview imgSrc={isReady ? filteredInfo.ImageUpload : []} />
        </View>
      </ScrollView>
    )
  }
}
const style = StyleSheet.create({
  headContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    width: DEVICE_WIDTH,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_white,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  headStatusContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 30
  },
  remarkContainer: {
    ...DisplayStyle('column', 'flex-start', 'center'),
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 15,
    // height: 100,
    width: DEVICE_WIDTH,
    backgroundColor: CommonColor.color_white
  },
  imgContainer: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    width: DEVICE_WIDTH,
    marginBottom: 30,
    backgroundColor: CommonColor.color_white
  },
  detailText: {
    marginTop: 5,
    marginBottom: 5
  }
})

export default withNavigation(SignUpTab)
