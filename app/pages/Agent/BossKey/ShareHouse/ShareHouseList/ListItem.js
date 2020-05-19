import React, {Component} from 'react'
import style from './style'
import {Alert, Image, Linking, Text, TouchableOpacity, View} from 'react-native'
import {getEnumDesByValue} from '../../../../../utils/enumData'
import {withNavigation} from 'react-navigation'
import {connect} from 'react-redux'
import {priceFormat} from '../../../../../utils/priceFormat'

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      RentTypeName: '',
      HouseStatusName: ''
    }
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
    this.setState({
      HouseStatusName: getEnumDesByValue('HouseStatus', item.HouseStatus),
      RentTypeName: getEnumDesByValue('RentType', item.RentType)
    })
  }

  goDetail() {
    debugger
    const item = this.props.item
    this.props.navigation.navigate('BossShareHouseDetail', {
      HouseID: item.HouseID,
      HouseKey: item.HouseKey,
      IsBoss: true
    })
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
                  color: '#ffb658'
                }}
            >
              {`待租`}
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
          </View>
        </TouchableOpacity>
    )
  }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(withNavigation(ListItem))
