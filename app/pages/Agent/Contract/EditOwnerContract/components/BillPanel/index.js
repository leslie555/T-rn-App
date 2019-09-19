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

  initBillData(data) {
    this.billRef.initData(data)
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

  validate() {
    return this.billRef.validate()
  }

  render() {
    return (
        <View style={styles.bill_box}>
          <ScrollableTabView style={styles.tab_page_wrap} initialPage={0}
                             scrollWithoutAnimation={true}
                             tabBarUnderlineStyle={{height: 2, backgroundColor: '#289ef2'}}
                             tabBarBackgroundColor={`#fff`}
                             tabBarActiveTextColor={`#389ef2`}
                             tabBarInactiveTextColor={`#999`}
                             tabBarTextStyle={{fontSize: 16, position: 'relative', top: 4}}
                             renderTabBar={() => <DefaultTabBar/>}
                             prerenderingSiblingsNumber={1}
          >
            <View style={{flex: 1}} tabLabel="账单费用">
              <BillList {...this.props}
                        ref={(refSteps) => {
                          this.billRef = refSteps
                        }}
              />
            </View>
            <View style={{flex: 1}} tabLabel="记账费用">
              <BookKeeping {...this.props} ref={(refSteps) => {
                this.bookRef = refSteps
              }}/>
            </View>
          </ScrollableTabView>
        </View>
    )
  }
}
