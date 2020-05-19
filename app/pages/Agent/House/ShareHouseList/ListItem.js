import React, {Component} from 'react'
import style from './style'
import {Alert, Image, Linking, Text, TouchableOpacity, View} from 'react-native'
import {getEnumDesByValue} from '../../../../utils/enumData'
import {withNavigation} from 'react-navigation'
import {connect} from 'react-redux'
import {priceFormat} from '../../../../utils/priceFormat'
import {getThumbImgUrl} from "../../../../utils/imgUnit";
import {AliImage} from "../../../../components";

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
    this.props.navigation.navigate('AgentHouseDetail', {
      HouseID: item.HouseID,
      HouseKey: item.HouseKey,
      ShareRentHouseID: item.HouseStatus === 5 ? item.HouseID : ''
    })
  }

  goNear() {
    const item = this.props.item
    this.props.navigation.navigate('AgentNearHouseList', {
      Lng: item.Lng,
      Lat: item.Lat,
      HouseID: item.HouseID
    })
  }

  render() {
    const {item} = this.props
    return (
        <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              this.goDetail()
            }}
            style={style.container}
        >
          <AliImage source={{uri: getThumbImgUrl(item.ImageLocation)}} style={style.left_img}/>
          <View style={style.right_content}>
            <View style={style.content_top}>
              <Text style={style.content_title} numberOfLines={2}>{this.state.RentTypeName} {item.HouseName}</Text>
              <View style={style.content_agent}>
                <Text style={style.agent_title}>管房人：</Text>
                <Text
                    style={style.agent_text}>{item.TubUserName ? `${item.TubUserName} ${item.TubUserPhone}` : `无`}</Text>
              </View>
              <Text
                  style={{
                    ...style.content_status,
                    color: this.state.HouseStatus.color
                  }}
              >
                {this.state.HouseStatus.label}
              </Text>
            </View>
            <View style={style.content_bottom}>
              <View style={style.content_price_box}>
                <Text style={style.content_price}>{priceFormat(item.RentMoeny)}</Text>
                <Text style={style.content_unit}> 元/月</Text>
              </View>
              <TouchableOpacity
                  style={style.content_btn}
                  onPress={() => {
                    this.goNear()
                  }}>
                <Text style={style.content_btn_text}>附近房源</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    )
  }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(withNavigation(ListItem))
