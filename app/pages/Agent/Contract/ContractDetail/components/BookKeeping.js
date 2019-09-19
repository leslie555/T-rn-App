import React from 'react'
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'

import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import billIn from '../images/bill-in.png'
import billOut from '../images/bill-out.png'
import { priceFormat } from '../../../../../utils/priceFormat'

export default class BookKeeping extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bookKeeping: [],
      bookKeepCount: 0
    }
  }
  componentWillMount() {
    this._filterData(this.props.data, this.props.isReady)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.isReady !== nextProps.isReady) {
      this._filterData(nextProps.data, nextProps.isReady)
    }
  }
  _filterData(data, isReady) {
    if (!isReady) return
    let bookKeepCount = 0
    data.BookKeep.forEach(v => {
      bookKeepCount += v.Amount
    })
    this.setState({
      bookKeeping: data.BookKeep,
      bookKeepCount
    })
  }
  render() {
    return (
      <ScrollView contentContainerStyle={style.contentContainer}>
        <View
          style={{
            ...style.headContainer,
            height: 48
          }}
        >
          <Text style={{ fontSize: 16 }}>
            记账合计(元): {priceFormat(this.state.bookKeepCount)}
          </Text>
        </View>
        {this.state.bookKeeping.map((val, idx) => {
          const icon = val.InOrOut === 1 ? billIn : billOut
          return (
            <View style={style.bookItem} key={idx}>
              <Text style={{ fontSize: 16 }}>{val.BillProjectName} </Text>
              <Text style={{ fontSize: 16 }}>{priceFormat(val.Amount)}</Text>
              <Image style={style.image} source={icon} />
            </View>
          )
        })}
      </ScrollView>
    )
  }
}
const style = StyleSheet.create({
  contentContainer: {
    ...DisplayStyle('column', 'center', 'flex-start')
  },
  headContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    height: 113,
    width: DEVICE_WIDTH,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_white,
    marginBottom: 15
  },
  billContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    marginBottom: 15,
    height: 45,
    width: DEVICE_WIDTH - 30,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_white,
    borderRadius: 5
  },
  bookItem: {
    height: 45,
    marginTop: 15,
    width: DEVICE_WIDTH - 30,
    paddingLeft: 30,
    paddingRight: 15,
    ...DisplayStyle('row', 'center', 'space-between'),
    backgroundColor: CommonColor.color_white,
    borderRadius: 5
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 35,
    height: 35
  }
})
