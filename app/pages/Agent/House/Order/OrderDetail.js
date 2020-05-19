import React, { Fragment } from 'react'
import { withNavigation } from 'react-navigation'
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native'
import { Container, DisplayStyle, _1PX } from '../../../../styles/commonStyles'
import {
  Separator,
  Header,
  ButtonGroup,
  FullModal
} from '../../../../components'
import { dateFormat } from '../../../../utils/dateFormat'
import { updateList } from '../../../../redux/actions/list'
import { CancelOrderInfo } from '../../../../api/tenant'
import { connect } from 'react-redux'
import { getEnumDesByValue } from '../../../../utils/enumData'
import dingjintiao from './images/dingjintiao.png'
import qianyue from './images/qianyue.png'
import xiugai from './images/xiugai.png'
import xuding from './images/xuding.png'
import zhuanding from './images/zhuanding.png'
import quxiao from './images/quxiao.png'
import quzhifu from './images/quzhifu.png'

const TitleColor = '#363636'
const TextColor = '#999'

const Item = props => {
  return (
    <View style={styles.rowContainer}>
      <Text style={{ color: TitleColor }}>{props.title}</Text>
      <Text style={{ color: TextColor }}>{props.children}</Text>
    </View>
  )
}

const Remark = props => {
  return <Text style={styles.remarkContainer}>{props.children}</Text>
}

/* const statusLabelEnum = {
  1: '待确认',
  2: '预定成功',
  3: '预定失败',
  4: '快到签约',
  5: '已取消',
  6: '待付款',
  7: '已签约',
  8: '已过期',
  9: '已转定'
} */

class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    let btnOptions = []
    this.item = this.props.orderDetail
    if (this.item.OrderStatus !== 5) {
      btnOptions.push({
        label: '取消预定',
        value: 'Cancel',
        imgSource: quxiao,
        color: '#4aa8f5'
      })
    }
    if (this.item.OrderStatus === 6) {
      // IsAgreeOrRefuse 是否是自己的预定,自己的预定不显示去收款按钮, 1不是,0是
      if (this.item.IsAgreeOrRefuse === 0 && this.item.AuditStatus === 2) {
        btnOptions.push({
          label: '去付款',
          value: 'Receive',
          imgSource: quzhifu,
          color: '#4aa8f5'
        })
      }
    } else if (this.item.OrderStatus === 2 && this.item.IsAgreeOrRefuse === 0) {
      btnOptions.push(
        ...[
          {
            label: '签约',
            value: 'SignContract',
            imgSource: qianyue,
            color: '#4aa8f5'
          },
          { label: '修改', value: 'Edit', imgSource: xiugai, color: '#4aa8f5' },
          {
            label: '修改',
            value: 'EditAgent',
            imgSource: xiugai,
            color: '#4aa8f5'
          },
          {
            label: '转定',
            value: 'Conversion',
            imgSource: zhuanding,
            color: '#4aa8f5'
          },
          {
            label: '续定',
            value: 'Continue',
            imgSource: xuding,
            color: '#4aa8f5'
          }
        ]
      )
    }
    if (
      this.item.OrderStatus === 2 ||
      this.item.OrderStatus === 7 ||
      this.item.OrderStatus === 9
    ) {
      btnOptions.push({
        label: '定金条',
        value: 'Print',
        imgSource: dingjintiao,
        color: '#4aa8f5'
      })
    }
    this.state = {
      btnOptions,
      loading: false
    }
  }

  /*   handleRefuseClick = () => {
    this.props.navigation.navigate('AgentAddOrderRemark', {
      isAgree: false,
      item: JSON.stringify(this.item)
    })
  } */
  /*   handleAgreeClick = () => {
    this.props.navigation.navigate('AgentAddOrderRemark', {
      isAgree: true,
      item: JSON.stringify(this.item)
    })
  } */
  handleCancelClick = () => {
    if (this.item.IsAgreeOrRefuse === 0) {
      // 本人的预定单不需要备注
      Alert.alert('温馨提示', '确定要取消该预定单吗?', [
        { text: '取消' },
        {
          text: '确认',
          onPress: () => {
            this.setState({
              loading: true
            })
            CancelOrderInfo({
              orderId: this.item.KeyID
            })
              .then(res => {
                if (res.Code === 0) {
                  this.props.dispatch(
                    updateList({
                      key: 'orderList',
                      KeyID: this.item.KeyID,
                      data: res.Data
                    })
                  )
                  this.props.navigation.navigate('AgentOrderList')
                }
              })
              .finally(() => {
                this.setState({
                  loading: false
                })
              })
          }
        }
      ])
    } else {
      this.props.navigation.navigate('AgentAddOrderRemark', {
        orderId: this.item.KeyID
      })
    }
  }
  handleSignContractClick = () => {
    this.props.navigation.navigate('AgentEditTenantContract', {
      OrderID: this.item.KeyID
    })
  }
  handleReceiveClick = () => {
    this.props.navigation.navigate('AgentSelectPayMode', {
      orderType: 3,
      billId: this.item.KeyID,
      totalAmount: this.item.OrderMoney
    })
  }
  handlePrintClick = () => {
    this.props.navigation.navigate('AgentSignUpDepositBar', {
      KeyID: this.item.KeyID
    })
  }
  handleEditClick = () => {
    this.props.navigation.navigate('AgentEditOrder', {
      type: 1,
      data: this.item
    })
  }
  handleEditAgentClick = () => {
    this.props.navigation.navigate('AgentEditOrder', {
      type: 1,
      data: this.item,
      isAgent: true
    })
  }
  handleConversionClick = () => {
    this.props.navigation.navigate('AgentEditOrder', {
      type: 2,
      data: this.item
    })
  }
  handleContinueClick = () => {
    this.props.navigation.navigate('AgentEditOrder', {
      type: 3,
      data: this.item
    })
  }
  render() {
    const { item } = this
    return (
      <View style={Container}>
        <Header title={'预定详情'} />
        <FullModal visible={this.state.loading} />
        <ScrollView style={styles.contentContainer}>
          <Item title={'房源名称'}>{item.HouseName}</Item>
          <Item title={'定金收据编号'}>{item.OrderMoneyNumber}</Item>
          <Item title={'定金'}>{item.OrderMoney + '元'}</Item>
          <Item title={'预定人'}>{item.OrderName}</Item>
          <Item title={'预定人电话'}>{item.OrderPhone}</Item>
          <Item title={'预定人身份证'}>{item.OrderCardID}</Item>

          <Item title={'约定租金'}>{item.ConvertionMoney + '元'}</Item>
          <Item title={'付款方式'}>{`押 1 付 ${item.PayModel}`}</Item>
          <Item title={'最晚付款日'}>{`提前 ${item.AdvanceMonth} 月付款`}</Item>
          <Item title={'最晚签约日'}>{dateFormat(item.LastSignDate)}</Item>
          <Item title={'约定租期'}>{`${dateFormat(
            item.LeaseStartTime
          )} 至 ${dateFormat(item.LeaseEndTime)}`}</Item>
          <Item title={'预定状态'}>
            {getEnumDesByValue('OrderStatus', item.OrderStatus)}
          </Item>
          <Item title={'审核状态'}>
            {getEnumDesByValue('AuditStatus', item.AuditStatus)}
          </Item>
          {item.OrderStatus === 5 && (
            <Fragment>
              <Item title={'付款状态'}>
                {item.InOrOutStatus === 2 ? '已付款' : '未付款'}
              </Item>
              <Separator label={'取消备注'} />
              <Remark>{item.AgrOrRefRemark || '无'}</Remark>
            </Fragment>
          )}
          <Item title={'提交时间'}>{dateFormat(item.OrderSubmitTime)}</Item>
          {/* <Item title={'提交人'}>{item.CreaterName}</Item> */}
          <Item title={'提交人姓名'}>{item.MangerName}</Item>
          <Item title={'提交人电话'}>{item.MangerPhone}</Item>
          <Item title={'服务费'}>{item.ServiceFee + '元'}</Item>
          <Separator label={'备注'} />
          <Remark>{item.Remark || '无'}</Remark>
        </ScrollView>
        <ButtonGroup
          options={this.state.btnOptions}
          permissionTag={'OrderList'}
          isIconContainer
          handleCancelClick={this.handleCancelClick}
          handleSignContractClick={this.handleSignContractClick}
          handleReceiveClick={this.handleReceiveClick}
          handlePrintClick={this.handlePrintClick}
          handleEditClick={this.handleEditClick}
          handleEditAgentClick={this.handleEditAgentClick}
          handleConversionClick={this.handleConversionClick}
          handleContinueClick={this.handleContinueClick}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  rowContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    height: 43,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: _1PX,
    borderBottomColor: '#eee'
  },
  remarkContainer: {
    textAlign: 'left',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff'
  }
})

const mapToProps = state => ({ orderDetail: state.order.orderDetail })

export default connect(mapToProps)(withNavigation(OrderDetail))
