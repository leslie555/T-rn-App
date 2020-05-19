import React, {Component} from 'react'
import style from './style'
import {Alert, Image, Linking, Text, TouchableOpacity, View} from 'react-native'
import {withNavigation} from 'react-navigation'
import {SelectNearHouseList} from '../../../../../../api/house'
import {ContainerLoading, AliImage} from '../../../../../../components'
import {getThumbImgUrl} from "../../../../../../utils/imgUnit";
import {getEnumDesByValue} from "../../../../../../utils/enumData";
import {priceFormat} from "../../../../../../utils/priceFormat";

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }
  }

  static defaultProps = {
    lng: 0,
    lat: 0,
    HouseID: 0
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lng !== nextProps.lng && nextProps.lng) {
      this.fetchData(nextProps)
    }
  }

  fetchData(item) {
    return SelectNearHouseList({
      parm: {
        page: 1,
        size: 2
      },
      Type: 1,
      Lng: item.lng,
      Lat: item.lat,
      Meter: 2000,
      HouseID: item.HouseID,
      IsHaveImage: 1
    }).then(({Data}) => {
      Data = Data.rows.map(x=>{
        x.RentTypeName = getEnumDesByValue('RentType', x.RentType)
        return x
      })
      this.setState({
        list: Data,
        loading: false
      })
    }).catch(() => {
      this.setState({
        list: [],
        loading: false
      })
    })
  }

  goDetail(item) {
    this.props.navigation.push('AgentHouseDetail', {
      HouseID: item.HouseID,
      HouseKey: item.HouseKey,
      ShareRentHouseID: item.HouseStatus === 5 ? item.HouseID : ''
    })
  }

  goNear() {
    this.props.navigation.push('AgentNearHouseList', {
      Lng: this.props.lng,
      Lat: this.props.lat,
      HouseID: this.props.HouseID
    })
  }

  render() {
    const {list, loading} = this.state
    return (
        <View style={style.near_container}>
          <ContainerLoading visible={loading}/>
          <View style={style.near_content}>
            {list.map((item, index) => {
              return (
                  <TouchableOpacity
                      activeOpacity={0.4}
                      onPress={() => {
                        this.goDetail(item)
                      }}
                      style={style.near_item}
                      key={index}
                  >
                    <AliImage source={{uri: getThumbImgUrl(item.ImageLocation)}} style={style.near_img}/>
                    <Text style={style.near_title} numberOfLines={2}>{item.RentTypeName} {item.HouseName}</Text>
                    <View style={style.content_price_box}>
                      <Text style={style.content_price}>{priceFormat(item.RentMoeny)}</Text>
                      <Text style={style.content_unit}> 元/月</Text>
                    </View>
                  </TouchableOpacity>
              )
            })}
          </View>
          {list.length>0&&
          <TouchableOpacity
              onPress={() => {
                this.goNear()
              }}
              style={style.near_more}
          >
            <Text style={style.near_more_text}>查看更多</Text>
          </TouchableOpacity>
          }
        </View>
    )
  }
}

export default withNavigation(ListItem)
