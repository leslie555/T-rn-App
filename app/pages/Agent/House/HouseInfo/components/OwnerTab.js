import React from 'react'
import { ScrollView, Text } from 'react-native'
import { FindOwnerInfo } from '../../../../../api/house'
import { ImagePreview } from '../../../../../components'
import Item from './Item'
import Panel from './Panel'
import Row from './Row'
import { getEnumDesByValue } from '../../../../../utils/enumData'
import { dateFormat, diffTime } from '../../../../../utils/dateFormat'
import { cn } from 'nzh'

export default class OwnerTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredInfo: {},
      ImageUploadList: [],
      OwnerContract: {},
      OwnerEquipmentList: []
    }
    this.isReady = false
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  componentWillMount() {
    const { houseKey } = this.props
    FindOwnerInfo({
      houseKey
    }).then(res => {
      const equipment = res.Data.OwnerEquipmentList.map(v => {
        if (v.EquipmentNumber > 1) {
          return `${v.EquipmentName}*${v.EquipmentNumber}`
        } else {
          return v.EquipmentName
        }
      })
      this.setState({
        ImageUploadList: res.Data.ImageUploadList,
        OwnerEquipmentList: equipment.join('、'),
        OwnerContract: res.Data.OwnerContract
      })
      this.filterContract(res.Data.OwnerContract)
    })
  }
  filterContract(contract) {
    const filteredInfo = {}
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
    // 最晚付款
    filteredInfo.LastPayTime =
      contract.PayTimeType == 0
        ? '提前' + contract.PayDays + '天支付租金'
        : contract.PayTimeType == 1
        ? '固定' + contract.PayDays + '号支付租金（每期第一个月）'
        : '固定' + contract.PayDays + '号支付租金（每期提前一个月)'
    this.isReady = true
    this.setState({
      filteredInfo
    })
  }
  render() {
    const { houseInfo } = this.props
    const {
      filteredInfo,
      ImageUploadList,
      OwnerEquipmentList,
      OwnerContract
    } = this.state
    const contract = OwnerContract
    if (!this.isReady) return null
    return (
      <ScrollView>
        <Panel label={'基本信息'}>
          <Row>
            <Item label={'姓 名'}>{contract.OwnerName}</Item>
          </Row>
          <Row>
            <Item label={'身份证号'}>{contract.OwnerIDCard}</Item>
          </Row>
          <Row>
            <Item label={'房源地址'}>{houseInfo.location}</Item>
          </Row>
          <Row>
            <Item label={'面 积'}>{houseInfo.houseArea + 'm²'}</Item>
            <Item label={'户 型'}>{`${houseInfo.RoomCount}室${
              houseInfo.HallCount
            }厅`}</Item>
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
            <Item label={'拿 房 价'}>{contract.InitialPrice + '元'}</Item>
            <Item label={'押 金'}>{contract.HouseDeposit + '元'}</Item>
          </Row>
          <Row>
            <Item label={'托管周期'}>
              {`${dateFormat(contract.HostStartTime)}至${dateFormat(
                contract.HostEndTime
              )}  (${diffTime(contract.HostStartTime, contract.HostEndTime)})`}
            </Item>
          </Row>
          <Row>
            <Item label={'付款模式'}>{`${filteredInfo.StagingModel}  ${
              filteredInfo.PayModel
            }  ${filteredInfo.NoPayMonth}`}</Item>
          </Row>
          <Row>
            <Item label={'付款周期'}>
              {getEnumDesByValue('PayCycle', contract.PayCycle)}
            </Item>
          </Row>
          <Row>
            <Item label={'免租期限'}>{contract.FreeDays + '个月'}</Item>
            <Item label={'少付金额'}>{contract.PayLessMoney + '元'}</Item>
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
            <Item label={'最晚付款'}>{filteredInfo.LastPayTime}</Item>
          </Row>
          <Row>
            <Item label={'收款方式'}>
              {getEnumDesByValue('CollectionType', contract.CollectionType)}
            </Item>
            {contract.CollectionType == 2 ||
              (contract.CollectionType == 3 && (
                <Item label={'收款姓名'}>{contract.ReceivePeopleName}</Item>
              ))}
            {contract.CollectionType == 4 && (
              <Item label={'转款账户'}>{contract.ReceiveAccount}</Item>
            )}
          </Row>
          <Row>
            {contract.CollectionType == 2 ||
              (contract.CollectionType == 3 && (
                <Item label={'收款账号'}>{contract.ReceiveAccount}</Item>
              ))}
            {contract.CollectionType == 4 && (
              <Item label={'银行账号'}>{contract.BankAccount}</Item>
            )}
          </Row>
          <Row>
            {contract.CollectionType == 4 && (
              <Item label={'银行名称'}>{contract.BankName}</Item>
            )}
          </Row>
        </Panel>
        <Panel label='其他'>
          <Row>
            <Item label={'水表底数'}>{contract.WaterNumber || '无'}</Item>
            <Item label={'电表底数'}>{contract.ElectricityNumber || '无'}</Item>
          </Row>
          <Row>
            <Item label={'气表底数'}>{contract.GasNumber || '无'}</Item>
            <Item label={'水卡卡号'}>{contract.WaterCardNumber || '无'}</Item>
          </Row>
          <Row>
            <Item label={'电卡卡号'}>
              {contract.ElectricityCardNumber || '无'}
            </Item>
            <Item label={'气卡卡号'}>{contract.GasCardNumber || '无'}</Item>
          </Row>
          <Row>
            <Item label={'房屋设备'}>{OwnerEquipmentList}</Item>
          </Row>
        </Panel>
        <Panel label='附加条款'>
          <Text>{contract.ContractRemark || '无'}</Text>
        </Panel>
        <Panel label='图片'>
          <ImagePreview imgSrc={ImageUploadList} />
        </Panel>
      </ScrollView>
    )
  }
}
