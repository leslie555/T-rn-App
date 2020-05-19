import React, { Component } from 'react'
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  Image
} from 'react-native'
import { dateFormat } from '../../../../utils/dateFormat'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import waitaudit from './images/waitaudit.png'
import submit from './images/submit.png'
import unpass from './images/unpass.png'
import pass from './images/pass.png'
import IconFont from '../../../../utils/IconFont'

const DEVICE_WIDTH = Dimensions.get('window').width

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      RentLeaseStatus: {
        label: '',
        color: 'rgb(0,0,0)'
      }
    }
    this.EnumLeaseStatus = []
    this.EnumRentLeaseStatus = []
  }
  static defaultProps = {
    isOwner: false,
    isSignUpOnline: false // 是否是电子签约
  }
  componentWillMount() {
    // 获取枚举
    this.EnumLeaseStatus = this.props.enumList.EnumLeaseStatus.map(val => ({
      label: val.Description,
      value: val.Value
    }))
    this.EnumRentLeaseStatus = this.props.enumList.EnumRentLeaseStatus.map(
      val => ({
        label: val.Description,
        value: val.Value
      })
    )
    const status = this.props.isOwner
      ? this.props.item.LeaseStatus
      : this.props.item.RentLeaseStatus
    const statusEnum = this.props.isOwner
      ? this.EnumLeaseStatus
      : this.EnumRentLeaseStatus
    const statusText = statusEnum.find(v => v.value === status)
    this.filterStatusText(statusText)
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item)) {
      const status = nextProps.isOwner
        ? nextProps.item.LeaseStatus
        : nextProps.item.RentLeaseStatus
      const statusEnum = nextProps.isOwner
        ? this.EnumLeaseStatus
        : this.EnumRentLeaseStatus
      const statusText = statusEnum.find(v => v.value === status)
      this.filterStatusText(statusText)
    }
  }
  filterStatusText(statusText) {
    switch (statusText.value) {
      case 1:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: 'rgb(255,153,0)'
          }
        })
        break
      case 2:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: 'rgb(255,90,90)'
          }
        })
        break
      case 3:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: 'rgb(56,158,242)'
          }
        })
        break
      case 4:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: 'rgb(153,153,153)'
          }
        })
        break
      /* case 5:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: 'rgb(56,158,242)'
          }
        })
        break */

      default:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: 'rgb(56,158,242)'
          }
        })
        break
    }
  }
  _onPress = () => {
    const { item } = this.props
    if (this.props.isSignUpOnline) {
      if (this.props.isOwner) {
        this.props.navigation.navigate('AgentContractSign', {
          Mobile: item.OwnerPhone,
          IDCard: item.OwnerIDCard,
          Name: item.OwnerName,
          Img: item.CardIDFront && item.CardIDFront.length>0 ? item.CardIDFront[0].ImageLocation : '',
          ContractID: item.KeyID,
          type: 0
        })
      } else {
        this.props.navigation.navigate('AgentContractSign', {
          Mobile: item.TenantPhone,
          IDCard: item.TenantCard,
          Name: item.TenantName,
          Img: item.CardIDFront && item.CardIDFront.length>0 ? item.CardIDFront[0].ImageLocation : '',
          ContractID: item.KeyID,
          type: 1
        })
      }
    } else {
      this.props.navigation.navigate('AgentContractDetail', {
        id: this.props.item.KeyID,
        isOwner: this.props.isOwner
      })
    }
  }
  callPhone = () => {
    const phoneNum = this.props.isOwner
      ? this.props.item.OwnerPhone
      : this.props.item.TenantPhone
    Alert.alert('温馨提示', `是否联系${phoneNum}?`, [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => Linking.openURL(`tel:${phoneNum}`)
      }
    ])
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
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={this._onPress}
        style={style.container}
      >
        <View style={style.headContainer}>
          <Text style={style.headTitle}>
            {this.props.item.HouseName && (this.props.item.HouseName.length < 20
              ? this.props.item.HouseName
              : (this.props.item.HouseName.slice(0, 18) + '...'))}
          </Text>
          <Text
            style={{
              ...style.headStatus,
              color: this.state.RentLeaseStatus.color
            }}
          >
            {this.state.RentLeaseStatus.label}
          </Text>
        </View>
        <View style={style.contentContainer}>
          <View style={style.rowContainer}>
            <Text style={style.itemTitle}>
              {this.props.isOwner ? '托管时间' : '租期'}:{'  '}
            </Text>
            <Text style={style.itemText}>
              {this.props.isOwner
                ? dateFormat(this.props.item.HostStartTime) +
                  ' 至 ' +
                  dateFormat(this.props.item.HostEndTime)
                : dateFormat(this.props.item.StartTime) +
                  ' 至 ' +
                  dateFormat(this.props.item.EndTime)}
            </Text>
          </View>
          <View style={style.rowContainer}>
            <Text style={style.itemTitle}>
              {this.props.isOwner ? '业主' : '租客'}:{'  '}
            </Text>
            <Text style={style.itemText}>
              {this.props.isOwner
                ? this.props.item.OwnerName +
                  '    ' +
                  this.props.item.OwnerPhone
                : this.props.item.TenantName +
                  '    ' +
                  this.props.item.TenantPhone}
            </Text>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={this.callPhone}
            >
              <IconFont name='call' size={24} color='#389ef2' />
            </TouchableOpacity>
          </View>
        </View>
        {this._renderAuditImg()}
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  container: {
    ...DisplayStyle('column', 'center', 'center'),
    height: 100,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_white,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
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
    paddingTop: 10,
    paddingBottom: 10
  },
  headStatus: {
    fontSize: 14
  },
  contentContainer: {
    flex: 1,
    width: DEVICE_WIDTH - 60,
    ...DisplayStyle('column', 'flex-start', 'center')
  },
  rowContainer: {
    width: DEVICE_WIDTH - 60,
    height: 22,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  itemTitle: {
    fontSize: 12,
    color: '#363636'
  },
  itemText: {
    fontSize: 12,
    color: '#999'
  },
  auditStatusImg: {
    width: 40,
    height: 31,
    position: 'absolute',
    right: 15,
    bottom: 10
  }
})

const mapToProps = state => ({ enumList: state.enum.enumList })
export default connect(mapToProps)(withNavigation(ListItem))
