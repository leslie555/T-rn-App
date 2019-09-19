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

const statusLabelEnum = {
  1: '待确认',
  2: '预定成功',
  3: '预定失败',
  4: '快到签约',
  5: '已取消',
  6: '待付款',
  7: '已签约'
}

class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    const item = this.props.navigation.getParam('item', {})
    let btnOptions = []
    this.item = JSON.parse(item)
    if (this.item.OrderStatus === 6) {
      // IsAgreeOrRefuse 是否是自己的预定,自己的预定不显示去收款按钮, 1不是,0是
      btnOptions = [{ label: '取消预定', value: 'Cancel' }]
      if (this.item.IsAgreeOrRefuse === 0) {
        btnOptions.push({
          label: '去付款',
          value: 'Receive'
        })
      }
    } else if (this.item.OrderStatus === 2 && this.item.IsAgreeOrRefuse === 0) {
      btnOptions = [{ label: '签约', value: 'SignUp' }]
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
  handleSignUpClick = () => {
    this.props.navigation.navigate('AgentEditTenantContract', {
      OrderID: this.item.KeyID
    })
  }
  handleReceiveClick = () => {
    debugger
    this.props.navigation.navigate('AgentSelectPayMode', {
      orderType: 3,
      billId: this.item.KeyID,
      totalAmount: this.item.OrderMoney
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
          <Item title={'定金'}>{item.OrderMoney + '元'}</Item>
          <Item title={'预定人电话'}>{item.OrderPhone}</Item>
          <Item title={'最晚签约日'}>{dateFormat(item.LastSignDate)}</Item>
          <Item title={'约定租金'}>{item.ConvertionMoney + '元'}</Item>
          <Item title={'约定租期'}>{`${dateFormat(
            item.LeaseStartTime
          )} 至 ${dateFormat(item.LeaseEndTime)}`}</Item>
          <Item title={'预定状态'}>{statusLabelEnum[item.OrderStatus]}</Item>
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
          <Item title={'提交人'}>{item.CreaterName}</Item>
          <Separator label={'备注'} />
          <Remark>{item.Remark || '无'}</Remark>
        </ScrollView>
        <ButtonGroup
          options={this.state.btnOptions}
          handleCancelClick={this.handleCancelClick}
          handleSignUpClick={this.handleSignUpClick}
          handleReceiveClick={this.handleReceiveClick}
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

export default connect()(withNavigation(OrderDetail))
