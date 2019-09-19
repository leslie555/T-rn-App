import React from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { FindTenantInfo } from '../../../../../api/house'
import { ImagePreview } from '../../../../../components'
import Item from './Item'
import Panel from './Panel'
import Row from './Row'
import { getEnumDesByValue } from '../../../../../utils/enumData'
import { dateFormat, diffTime } from '../../../../../utils/dateFormat'
import { cn } from 'nzh'
import { DisplayStyle, DEVICE_WIDTH } from '../../../../../styles/commonStyles'

export default class OwnerTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredInfo: {},
      ImageUploadList: [],
      TenantContractInfo: {},
      OutRoominfoList: [],
      isEmpty: false
    }
    this.isReady = false
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  componentWillMount() {
    const { HouseID } = this.props
    FindTenantInfo({
      HouseID
    }).then(res => {
      if (!res.Data.TenantContractInfo) {
        this.isReady = true
        this.setState({
          isEmpty: true
        })
        return
      }
      const outRoom = res.Data.OutRoominfoList.map(
        v => `${v.UserName} (${v.Tel})`
      )
      this.setState({
        ImageUploadList: res.Data.ImageUploadList,
        TenantContractInfo: res.Data.TenantContractInfo,
        OutRoominfoList: outRoom.join(',')
      })
      this.filterContract(res.Data.TenantContractInfo)
    })
  }
  filterContract(contract) {
    const filteredInfo = {}
    // 最晚付款
    filteredInfo.LastPayTime =
      contract.PayTimeType == 0
        ? '提前' + contract.PayDays + '天支付租金'
        : contract.PayTimeType == 1
        ? '固定' + contract.PayDays + '号支付租金（每期第一个月）'
        : '固定' + contract.PayDays + '号支付租金（每期提前一个月)'
    // 租金包含费用
    filteredInfo.RentIncludeCost = JSON.parse(contract.RentIncludeCost || '[]')
      .map(val => {
        return `${getEnumDesByValue('RentIncludeCost', val.KeyID)} (${
          val.Price
        }元)`
      })
      .join(', ')
    this.isReady = true
    this.setState({
      filteredInfo
    })
  }
  render() {
    const {
      filteredInfo,
      ImageUploadList,
      TenantContractInfo,
      OutRoominfoList
    } = this.state
    const contract = TenantContractInfo
    if (!this.isReady) return null
    return this.state.isEmpty ? (
      <View style={style.emptyContainer}>
        <Text style={style.emptyText}>暂无租客</Text>
      </View>
    ) : (
      <ScrollView>
        <Panel label={'基本信息'}>
          <Row>
            <Item label={'姓 名'}>{contract.TenantName}</Item>
            <Item label={'电 话'}>{contract.TenantPhone}</Item>
          </Row>
          <Row>
            <Item label={'身份证号'}>{contract.TenantCard}</Item>
          </Row>
          <Row>
            <Item label={'出房人'}>{OutRoominfoList || '无'}</Item>
          </Row>
        </Panel>
        <Panel label='签约信息'>
          <Row>
            <Item label={'合同编号'}>{contract.ContractNumber}</Item>
          </Row>
          <Row>
            <Item label={'合同类型'}>
              {getEnumDesByValue('PaperType', contract.PaperType)}
            </Item>
          </Row>
          <Row>
            <Item label={'租 金'}>{contract.HouseRent + '元'}</Item>
            <Item label={'押 金'}>{contract.HouseDeposit + '元'}</Item>
          </Row>
          <Row>
            <Item label={'租期'}>
              {`${dateFormat(contract.StartTime)}至${dateFormat(
                contract.EndTime
              )}  (${diffTime(contract.StartTime, contract.EndTime)})`}
            </Item>
          </Row>
          <Row>
            <Item label={'付款方式'}>
              {`押${cn.encodeS(contract.DepositModel)}付${cn.encodeS(
                contract.PayModel
              )}`}
            </Item>
          </Row>
          <Row>
            <Item label={'租金包含'}>
              {filteredInfo.RentIncludeCost || '无 '}
            </Item>
          </Row>
          <Row>
            <Item label={'递增方式'}>
              {getEnumDesByValue('IncreaseType', contract.IncreaseType)}
            </Item>
          </Row>
          {contract.IncreaseType !== 0 && (
            <Row>
              <Item label={'递增次数'}>
                {`${cn.encodeS(contract.IncreaseFrequency)} 次 (第${
                  contract.IncreaseNum
                }年)、 ${contract.IncreaseMoney}/年`}
              </Item>
            </Row>
          )}
          <Row>
            <Item label={'分期方式'}>
              {getEnumDesByValue('TenantStageType', contract.TenantStageType)}
            </Item>
          </Row>
          {contract.TenantStageType !== 0 && (
            <Row>
              <Item label={'分期起止'}>{`${dateFormat(
                contract.PayStageStartTime
              )}至${dateFormat(contract.PayStageEndTime)}`}</Item>
            </Row>
          )}
          <Row>
            <Item label={'最晚付款'}>{filteredInfo.LastPayTime}</Item>
          </Row>
        </Panel>
        <Panel label='其他'>
          <Row>
            <Item label={'水表底数'}>{contract.WaterBaseNumber || '无'}</Item>
            <Item label={'电表底数'}>
              {contract.ElectricityBaseNumber || '无'}
            </Item>
          </Row>
          <Row>
            <Item label={'气表底数'}>{contract.GasBaseNumber || '无'}</Item>
          </Row>
        </Panel>
        <Panel label='附加条款'>
          <Text>{contract.TenantContractRemark || '无'}</Text>
        </Panel>
        <Panel label='图片'>
          <ImagePreview imgSrc={ImageUploadList} />
        </Panel>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  emptyContainer: {
    ...DisplayStyle('row', 'center', 'center'),
    width: DEVICE_WIDTH,
    height: 300
  },
  emptyText: {
    color: '#666',
    fontSize: 20
  }
})
