import React, {Component} from 'react'
import style from './style'
import {Alert, Image, Linking, Text, TouchableOpacity, View} from 'react-native'
import {getEnumDesByValue} from '../../../../utils/enumData'
import {withNavigation} from 'react-navigation'
import {connect} from 'react-redux'
import {priceFormat} from '../../../../utils/priceFormat'
import {dateFormat} from '../../../../utils/dateFormat'

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      RentTypeName: '',
      HouseStatus: {}
    }
    this.EnumBadgeType = [
      {
        label: '待租',
        value: 'empty',
        color: '#ffb658',
        mark: '空置：'
      },
      {
        label: '已定',
        value: 'order',
        color: '#57cef5',
        mark: '最晚签约日：'
      },
      {
        label: '已租',
        value: 'tarnent',
        color: '#389ef2',
        mark: '租客到期：'
      },
      {
        label: '装修',
        value: 'draw',
        color: '#33cc99',
        mark: '装修结束：'
      },
      {
        label: '待完善',
        value: 'edit',
        color: '#ff5a5a'
      },
      {
        label: '待审核',
        value: 'ToAudit',
        color: '#ff8b58'
      },
    ]
  }

  static defaultProps = {
    item: {}
  }

  componentWillMount() {
    this.filterData(this.props.item)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item)) {
      this.filterData(nextProps.item)
    }
  }

  filterData(item) {
    const statusObj = this.EnumBadgeType.find(v => v.value === item.Badge)
    this.setState({
      RentTypeName: getEnumDesByValue('RentType', item.RentType),
      HouseStatus: statusObj || {}
    })
  }

  goDetail() {
    const item = this.props.item
    if(item.Badge==='edit'){
      this.props.navigation.navigate('AgentEditHouse', {
        HouseID: item.HouseID,
        HouseName: item.HouseName,
        Badge: item.Badge,
        HouseKey: item.HouseKey,
        path: 'AgentMyHouseList'
      })
    }else{
      this.props.navigation.navigate('AgentHouseDetail', {
        HouseID: item.HouseID,
        Badge: item.Badge,
        HouseKey: item.HouseKey,
        isMine: true,
        path: 'AgentMyHouseList'
      })
    }
  }

  render() {
    return (
        <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              this.goDetail()
            }}
            style={style.container}
        >
          <View style={style.headContainer}>
            <View style={style.headTitle}>
              <Text style={style.headTitleLeft}>
                {this.props.item.HouseName.length < 18
                    ? this.props.item.HouseName
                    : this.props.item.HouseName.slice(0, 16) + '...'}
              </Text>
              <Text style={style.headTitleRight}>{this.state.RentTypeName}</Text>
            </View>
            <Text
                style={{
                  ...style.headStatus,
                  color: this.state.HouseStatus.color
                }}
            >
              {this.state.HouseStatus.label}
            </Text>
          </View>
          <View style={style.contentContainer}>
            <View style={style.rowContainer}>
              <View style={style.rowLeft}>
                <Text style={style.itemTitle}>管房人：</Text>
                <Text style={style.itemText}>{this.props.item.TubUserName?`${this.props.item.TubUserName} ${this.props.item.TubUserPhone}`:`无`}</Text>
              </View>
              <View style={style.rowRight}>
                <Text style={style.itemText}>{this.props.item.RentMoeny>0&&`${priceFormat(this.props.item.RentMoeny)}元/月`}</Text>
              </View>
            </View>
            <View style={style.rowContainer}>
              <View style={style.rowLeft}>
                <Text style={style.itemTitle}>业主到期：</Text>
                <Text style={style.itemText}>{dateFormat(this.props.item.OwnerEndTime)}</Text>
              </View>
              {this.state.HouseStatus.mark &&
              <View style={style.rowRight}>
                <Text style={style.itemTitle}>{this.state.HouseStatus.mark}</Text>
                <Text style={style.itemText}>{this.props.item.Meg}</Text>
              </View>}
            </View>
          </View>
        </TouchableOpacity>
    )
  }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(withNavigation(ListItem))
