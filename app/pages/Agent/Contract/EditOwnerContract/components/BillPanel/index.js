import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import './style';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import BillList from '../BillList'
import BookKeeping from '../BookKeeping'

export default class BillPanel extends React.Component {
  constructor(props) {
    super(props)
    this.billRef = null
    this.bookRef = null
  }

  initBillData(data,arr) {
    this.billRef.initData(data,arr)
  }

  initBookData(data) {
    this.bookRef.initData(data)
  }

  getBillValue() {
    return this.billRef.getValue()
  }

  getBookValue() {
    return this.bookRef.getValue()
  }

  validateHoliday() {
    return this.billRef.validateHoliday(...arguments)
  }

  validate() {
    return this.billRef.validate()
  }

  render() {
    return (
        <View style={styles.bill_box}>
            <BillList {...this.props}
                      ref={(refSteps) => {
                        this.billRef = refSteps
                      }}
            />
        </View>
    )
  }
}
