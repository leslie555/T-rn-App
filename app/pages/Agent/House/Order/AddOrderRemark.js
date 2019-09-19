import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Container, DEVICE_WIDTH } from '../../../../styles/commonStyles'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'
import {
  Header,
  Separator,
  ButtonGroup,
  FullModal
} from '../../../../components'
import {CancelOrderInfo, GetHouseBadgeInfo} from '../../../../api/tenant'
import { updateList } from '../../../../redux/actions/list'
import { connect } from 'react-redux'

class AddOrderRemark extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      loading: false
    }
    this.path = this.props.navigation.getParam('path', 'AgentOrderList')
    this.orderId = this.props.navigation.getParam('orderId', 0)
  }
  _onChange = val => {
    this.setState({
      text: val
    })
  }
  handleConfirmClick = () => {
    const form = {
      orderId: this.orderId,
      remark: this.state.text
    }
    this.setState({
      loading: true
    })
    CancelOrderInfo(form)
      .then(res => {
        if (res.Code === 0) {
          this.props.dispatch(
            updateList({
              key: 'orderList',
              KeyID: this.item.KeyID,
              data: res.Data
            })
          )
          if(this.path === 'AgentHouseDetail'){
            const query = this.props.navigation.state.params || {}
            GetHouseBadgeInfo({
              HouseID: query.HouseID
            }).then(({Data})=>{
              // 需要修改个人房源列表中的数据
              this.props.dispatch(
                  updateList({
                    primaryKey: 'HouseName',
                    KeyID: query.HouseName,
                    key: 'AgentMyHouseList',
                    data: {
                      Badge: Data.Badge,
                      Meg: Data.Meg
                    }
                  })
              )
            })
            this.props.navigation.navigate(this.path,{
              isRefresh: true
            })
          }else{
            this.props.navigation.navigate(this.path)
          }
        }
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      })
  }
  render() {
    return (
      <View style={Container}>
        <Header title={'备注'} />
        <FullModal visible={this.state.loading} />
        <View style={styles.remarkContainer}>
          <Separator label={'备注'} />
          <TextInput
            style={styles.textArea}
            multiline={true}
            placeholder={'请在此输入拒绝备注'}
            onChangeText={this._onChange}
            value={this.state.value}
          />
        </View>
        <ButtonGroup
          options={[{ label: '确认', value: 'Confirm' }]}
          handleConfirmClick={this.handleConfirmClick}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textArea: {
    fontSize: 15,
    width: DEVICE_WIDTH,
    paddingLeft: 10,
    height: 180,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    textAlign: 'left'
  },
  remarkContainer: {
    flex: 1
  }
})

export default connect()(withNavigation(AddOrderRemark))
