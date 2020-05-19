import React from 'react'
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'

import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import { dateFormat, diffTime } from '../../../../../utils/dateFormat'
import { cn } from 'nzh'
import outOfTime from '../images/out-of-time.png'
import recieved from '../images/recieved.png'
import unrecieve from '../images/unrecieve.png'
import unpay from '../images/unpay.png'
import paid from '../images/paid.png'
import waitRecieve from '../images/waitRecieve.png'
import { priceFormat } from '../../../../../utils/priceFormat'

export default class SignUpTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bill: [],
      billCount: 0
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
    const { isOwner } = this.props
    const bill = isOwner ? data.OwnerBill : data.TenantBill
    let billCount = 0
    bill.forEach(v => {
      billCount += v.BillAmount
    })
    this.setState({
      bill,
      billCount
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
            账单合计(元): {priceFormat(this.state.billCount)}
          </Text>
        </View>
        {this.state.bill.map((val, idx) => {
          const billDetail = this.props.isOwner
            ? val.OwnerBillDetail
            : val.TenantBillDetail
          const allBill = billDetail.reduce(
            (pre, cur) => {
              return {
                allBillIn: pre.allBillIn + (cur.InOrOut === 1 ? cur.Amount : 0),
                allBillOut:
                  pre.allBillOut + (cur.InOrOut === 2 ? cur.Amount : 0)
              }
            },
            {
              allBillIn: 0,
              allBillOut: 0
            }
          )
          let icon = null
          if (val.IsActual === 0) {
            // 未收/付
            const delta =
              new Date(val.ReceivablesDate).getTime() - new Date().getTime()
            if (delta > 0) {
              icon = this.props.isOwner ? unpay : unrecieve
            } else {
              icon = outOfTime
            }
          } else if (val.IsActual === 1) {
            // 待收
            icon = this.props.isOwner ? paid : recieved
          } else if (val.IsActual === 2) {
            icon = waitRecieve
          }
          return (
            <View style={style.billContainer} key={idx}>
              <View
                style={{
                  ...style.billRow,
                  borderBottomColor: '#eee',
                  borderBottomWidth: 1
                }}
              >
                <Text style={style.bold}>账期{cn.encodeS(idx + 1)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ ...style.bold, marginRight: 8 }}>
                    ￥{priceFormat(val.BillAmount)}
                  </Text>
                  {icon === outOfTime && (
                    <Text style={style.outOfTimeText}>
                      逾期
                      {diffTime(val.ReceivablesDate, new Date())}
                    </Text>
                  )}
                </View>
              </View>
              <View style={style.billRow}>
                <Text>应付款日: {dateFormat(val.ReceivablesDate)}</Text>
                <Text>
                  收入{priceFormat(allBill.allBillIn)}-支出{priceFormat(allBill.allBillOut)}
                </Text>
              </View>
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
    height: 90,
    width: DEVICE_WIDTH - 30,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_white,
    borderRadius: 5
  },
  billRow: {
    height: 45,
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 60
  },
  bold: {
    fontWeight: 'bold',
    color: '#363636',
    fontSize: 16
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 35,
    height: 35
  },
  outOfTimeText: {
    color: 'rgb(255,90,90)',
    fontSize: 13,
    marginRight: 10
  }
})
