import React, {Component} from 'react'
import {Alert, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import billListStyles from '../BillList/style'
import styles from './style'
import {priceFormat} from "../../../../../../utils/priceFormat";
import uuid from "../../../../../../utils/uuid";
import store from "../../../../../../redux/store/store";
import {removeBookKeep} from "../../../../../../redux/actions/bookKeep";

export default class BookKeeping extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      total: 0
    }
    this.didBlurSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          debugger
          const bookKeep = store.getState().bookKeep.data
          if (!bookKeep) return
          const index = this.state.list.findIndex(v => v.uuid === bookKeep.uuid)
          if (index === -1) {
            this.state.list.push(bookKeep)
          } else {
            this.state.list.splice(index, 1, bookKeep)
          }
          this.setState({
            list: this.state.list
          })
          this.recAmount()
          store.dispatch(
              removeBookKeep()
          )
        }
    )
  }

  render() {
    return (
        <ScrollView
            style={styles.book_box}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
            scrollEventThrottle={0}
        >
          <View style={billListStyles.bill_list_content}>
            <View style={billListStyles.bill_total}>
              <Text style={billListStyles.head_text}>记账合计（元）：{priceFormat(this.state.total)}</Text>
              <TouchableOpacity onPress={() => this.handleBillAdd()} style={billListStyles.add_bill_btn_box}>
                <Text style={billListStyles.add_bill_btn_text}>记一笔账</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.book_list}>
            {this.state.list.map((item, index) => {
              return (
                  <View style={styles.book_list_item} key={index}>
                    <Text style={styles.book_list_text}>{item.BillProjectName}</Text>
                    <View style={styles.book_list_box}>
                      <Text style={styles.book_list_text1}>{priceFormat(item.Amount)}</Text>
                      <TouchableOpacity onPress={() => this.handleBillEdit(item)} style={styles.add_bill_btn_box}>
                        <Text style={styles.add_bill_btn_text}>修改</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handleBillDelete(index)}
                                        style={[styles.add_bill_btn_box, styles.add_bill_btn_box_red]}>
                        <Text style={[styles.add_bill_btn_text, styles.add_bill_btn_text_red]}>删除</Text>
                      </TouchableOpacity>
                    </View>
                    {item.InOrOut == 1 && <Image style={styles.book_list_icon}
                                                 source={require('../../images/bill-in.png')}/>}
                    {item.InOrOut == 2 && <Image style={styles.book_list_icon}
                                                 source={require('../../images/bill-out.png')}/>}
                  </View>
              )
            })}
          </View>
        </ScrollView>
    )
  }

  initData(data) {
    this.setState({
      list: data
    })
    this.recAmount()
  }

  handleBillAdd() {
    debugger
    this.props.navigation.navigate('AgentAddBookKeeping', {
      data: {
        uuid: uuid(),
        editType: 0,
        RentType: this.props.houseInfo.RentType || 1,
        HouseName: this.getHouseName()
      },
      busType: this.props.type
    })
  }

  handleBillEdit(item) {
    debugger
    item.uuid = uuid()
    this.props.navigation.navigate('AgentAddBookKeeping', {
      data: {
        ...item,
        RentType: this.props.houseInfo.RentType || 1,
        HouseName: this.getHouseName()
      },
      busType: this.props.type,
      editType: 1
    })
  }

  handleBillDelete(index) {
    Alert.alert('温馨提示', '确认要删除该记账吗？', [
      {
        text: '取消', onPress: () => {
        }
      },
      {
        text: '确认', onPress: () => {
          this.state.list.splice(index, 1)
          this.setState({
            list: this.state.list
          })
          this.recAmount()
        }
      }
    ], {cancelable: false})
  }

  recAmount() {
    let sum = 0
    this.state.list.map(cItem => {
      if (cItem.InOrOut === 2) {
        sum -= +cItem.Amount
      } else {
        sum += +cItem.Amount
      }
    })
    this.setState({
      total: sum
    })
  }

  getHouseName() {
    debugger
    if (this.props.houseInfo.HouseName) return this.props.houseInfo.HouseName
    let HouseName = this.props.communityInfo.CommunityName + this.props.houseInfo.Building + '-'
    if (this.props.houseInfo.UnitNumber) {
      HouseName += this.props.houseInfo.UnitNumber + '-'
    }
    HouseName += this.props.houseInfo.RoomNumber
    return HouseName
  }

  getValue() {
    return this.state.list
  }
}
