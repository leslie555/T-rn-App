import React from 'react'
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert
} from 'react-native'
import { dateFormat } from '../../../../utils/dateFormat'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { setOrderDetail } from '../../../../redux/actions/order'
import imgs from './reservationImgAssets'
import waitaudit from '../../Contract/ContractList/images/waitaudit.png'
import submit from '../../Contract/ContractList/images/submit.png'
import unpass from '../../Contract/ContractList/images/unpass.png'
import pass from '../../Contract/ContractList/images/pass.png'
import IconFont from '../../../../utils/IconFont'

const DEVICE_WIDTH = Dimensions.get('window').width

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statusText: {
        label: '',
        color: 'rgb(0,0,0)'
      }
    }
  }
  static defaultProps = {
    isOrder: false
  }
  getStatus() {
    let statusText = {}
    if (this.props.isOrder) {
      const status = this.props.item.OrderStatus
      switch (status) {
        case 1:
          statusText = {
            label: '待确认',
            color: 'rgb(255,153,0)'
          }
          break
        case 2:
          statusText = {
            label: '预定成功',
            color: 'rgb(56,158,242)'
          }
          break
        case 3:
          statusText = {
            label: '预定失败',
            color: 'rgb(255,90,90)'
          }
          break
        case 4:
          statusText = {
            label: '快到签约',
            color: '#67C23A'
          }
          break
        case 5:
          statusText = {
            label: '已取消',
            color: '#999'
          }
          break
        case 6:
          statusText = {
            label: '待付款',
            color: 'rgb(255,153,0)'
          }
          break
        case 7:
          statusText = {
            label: '已签约',
            color: '#18beac'
          }
          break
        case 8:
          statusText = {
            label: '已过期',
            color: '#999'
          }
          break
        case 9:
          statusText = {
            label: '已转定',
            color: 'rgb(56,158,242)'
          }
          break
        default:
          break
      }
    } else {
      const status = this.props.item.AppointmentStatus
      switch (status) {
        case 1:
          statusText = {
            label: '未看房',
            color: 'rgb(255,153,0)',
            imgUrl: 'nosee'
          }
          break
        case 2:
          statusText = {
            label: '已看房',
            color: 'rgb(56,158,242)',
            imgUrl: 'hassee'
          }
          break
        case 3:
          statusText = {
            label: '已过期',
            color: 'rgb(255,90,90)',
            imgUrl: 'hasoverdue'
          }
          break
        default:
          break
      }
    }
    return statusText
  }
  callPhone = () => {
    const phoneNum = this.props.item.OrderPhone
    Alert.alert('温馨提示', `是否联系${phoneNum}?`, [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => Linking.openURL(`tel:${phoneNum}`)
      }
    ])
  }
  _onPress = () => {
    this.props.navigation.navigate(
      this.props.isOrder ? 'AgentOrderDetail' : 'AddReservation'
    )
    this.props.dispatch(setOrderDetail(this.props.item))
  }
    _renderAuditImg() {
    const status = this.props.item.AuditStatus
    let src
    if (status === 0) {
      src = submit
    } else if (status === 1) {
      src = waitaudit
    } else if (status === 2) {
      src = pass
    } else if (status === 3) {
      src = unpass
    } else {
      src = ''
    }
    return <Image style={style.auditStatusImg} source={src} />
  }
  render() {
    const statusText = this.getStatus()
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={this._onPress}
        style={{
          ...style.container
        }}
      >
        <View style={style.headContainer}>
          <Text style={style.headTitle}>{this.props.item.HouseName}</Text>
          {this.props.isOrder && (
            <Text
              style={{
                ...style.headStatus,
                color: statusText.color
              }}
            >
              {statusText.label}
            </Text>
          )}
        </View>
        <View style={style.contentContainer}>
          <View style={style.rowContainer}>
            <Text style={style.itemTitle}>
              {this.props.isOrder ? '预定人' : '看房人姓名'}:{' '}
            </Text>
            <Text style={style.orderNameContainer}>
              {this.props.item.OrderName.slice(0, 5)}
            </Text>
            <Text style={style.itemText}>{this.props.item.OrderPhone}</Text>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={this.callPhone}
            >
              <IconFont name='call' size={24} color='#389ef2' />
            </TouchableOpacity>
          </View>
          <View style={style.rowContainer}>
            <Text style={style.itemTitle}>约定租期: </Text>
              <Text style={style.itemText}>
                {`${dateFormat(this.props.item.LeaseStartTime)} 至 ${dateFormat(
                  this.props.item.LeaseEndTime
                )}`}
              </Text>
          </View>
          <View style={style.spaceBetweenContainer}>
            <View style={style.itemContainer}>
              <Text style={style.itemTitle}>
              {this.props.isOrder ? '最晚签约日' : '看房时间'}:{' '}
            </Text>
            <Text style={style.itemText}>
              {this.props.isOrder
                ? dateFormat(this.props.item.LastSignDate)
                : dateFormat(this.props.item.AppointTime)}
            </Text>
            </View>
            <View style={style.itemContainer}>
              <Text style={style.itemTitle}>
                {this.props.isOrder ? '预定金额' : '看房人电话'}:{' '}
              </Text>
              <Text style={style.itemText}>
                {this.props.isOrder
                  ? this.props.item.OrderMoney
                  : this.props.item.CousterPhone}
              </Text>
            </View>
          </View>
          
        </View>
        {!this.props.isOrder && (
          <Image source={imgs[statusText.imgUrl]} style={style.statusImg} />
        )}
        {this._renderAuditImg()}
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  container: {
    ...DisplayStyle('column', 'center', 'flex-start'),
    height: 112,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_white,
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: '#cccccc'
  },
  headContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 60,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgb(238,238,238)'
  },
  headTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: CommonColor.color_text_primary,
    paddingTop: 8,
    paddingBottom: 8
  },
  headStatus: {
    fontSize: 14
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 3,
    width: DEVICE_WIDTH - 60,
    ...DisplayStyle('column', 'center', 'space-around')
  },
  rowContainer: {
    width: DEVICE_WIDTH - 60,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  spaceBetweenContainer: {
    width: DEVICE_WIDTH - 60,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  itemContainer: {
    ...DisplayStyle('row', 'center', 'center')
  },
  orderNameContainer: {
    fontSize: 12,
    color: '#999',
    width: 72
  },
  itemTitle: {
    fontSize: 12,
    color: '#363636'
  },
  itemText: {
    fontSize: 12,
    color: '#999'
  },
  statusImg: {
    position: 'absolute',
    width: 44,
    height: 40,
    right: 0,
    top: 0,
    resizeMode: 'cover'
  },
  auditStatusImg: {
    width: 40,
    height: 31,
    position: 'absolute',
    right: 15,
    bottom: 30
  }
})

export default connect()(withNavigation(ListItem))
