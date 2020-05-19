import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import { Header } from '../../../../../components'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { CommonColor, DisplayStyle } from '../../../../../styles/commonStyles'
import { Picker } from '../../../../../components'
import IconFont from '../../../../../utils/IconFont'
import RenderContent from './RenderContent'
import RenderTabBar from './RenderTabar'

export default class RankList extends Component {
  constructor(props) {
    super(props)
    const rankType = this.props.rankType || 0
    const { pickerTitle, markDateSelectedValue } = this.initPickerData()
    const {
      title,
      btnTexts,
      listHeadTitle,
      listKey,
      primaryKey,
    } = this.initRankData(rankType)
    this.hasDatePicker = this.ishasDatePicker(rankType)
    this.headerTitle = title
    this.btnTexts = btnTexts
    this.listHeadTitle = listHeadTitle
    this.listKey = listKey
    this.primaryKey = primaryKey
    this.state = {
      pickerTitle,
      markDateSelectedValue,
      markDateVisible: false,
      activePage: 0, // 头部tabBar切换
      activeBtn: this.initActiveBtn(rankType), //左右switch按钮切换
      activeSortWay: true, // 租金差排序方式
    }
    // this.lv = store.getState().user.userinfo.Lv
    this.isAgent = this.props.isAgent // 是否是经理
    const rightData = this.getRightData()
    this.show = rightData.show // 是否展示
    this.tabLabel = rightData.tabLabel
    this.tabValue = rightData.tabValue
  }

  static propTypes = {
    rankType: PropTypes.number.isRequired,
    request: PropTypes.func.isRequired,
    rankFormParam: PropTypes.string,
  }

  getRightData() {
    if (this.props.rankType === 7) {
      if (this.isAgent) {
        return {
          show: false,
          tabLabel: ['整租', '合租'],
          tabValue: [1, 2]
        }
      } else {
        return {
          show: true,
          tabLabel: ['成都', '重庆'],
          tabValue: ['5101XX', '5001XX']
        }
      }
    } else {
      return {
        show: true,
        tabLabel: ['成都', '重庆'],
        tabValue: ['5101XX', '5001XX']
      }
    }
  }
  
  initPickerData = () => {
    let pickerTitle = '',
      markDateSelectedValue = []
    let Year = new Date().getFullYear()
    let Month = new Date().getMonth() + 1
    markDateSelectedValue.push.apply(markDateSelectedValue, [
      Year + '年',
      Month + '月',
    ])
    Month < 10 ? (Month = '0' + Month) : Month
    pickerTitle = Year + '-' + Month
    return { pickerTitle, markDateSelectedValue }
  }

  initRankData(rankType) {
    switch (rankType) {
      case 0:
        return {
          title: '总房源排行榜',
          btnTexts: ['', ''],
          listHeadTitle: ['总数', '总数'],
          listKey: 'BossKeyAllHouseRank',
        }
      case 1:
        return {
          title: '出单排行榜',
          btnTexts: ['按当日出单', '按总出单'],
          listHeadTitle: ['数量', '数量'],
          listKey: 'BossKeySoldRank',
        }
      case 2:
        return {
          title: '空置率排行榜',
          btnTexts: ['按空置数', '按空置率'],
          listHeadTitle: ['数量', '比率'],
          listKey: 'BossKeyVacantRateRank',
        }
      case 3:
        return {
          title: '收租率排行榜',
          btnTexts: ['按当日收租率', '按总收租率'],
          listHeadTitle: ['比率', '比率'],
          listKey: 'BossKeyRentCollectRateRank',
        }
      case 4:
        return {
          title: '违约排行榜',
          btnTexts: ['按当日违约', '按总违约'],
          listHeadTitle: ['数量', '数量'],
          listKey: 'BossKeyBreakContractRank',
        }
      case 5:
        return {
          title: '续租排行榜',
          btnTexts: ['按当日续租', '按总续租'],
          listHeadTitle: ['数量', '数量'],
          listKey: 'BossKeyRenewRentRank',
        }
      case 6:
        return {
          title: '拿房排行榜',
          btnTexts: ['按当日拿房', '按总拿房'],
          listHeadTitle: ['数量', '数量'],
          listKey: 'BossKeyHouseInRank',
        }
      case 7:
        return {
          title: '租金差排行榜',
          btnTexts: ['整租', '合租'],
          // btnTexts: ['整租', '合租'],
          listHeadTitle: ['', ''],
          listKey: 'BossKeyRentPriceRank',
        }
      default:
        return
    }
  }

  initActiveBtn(rankType) {
    if ([1, 3, 7].indexOf(rankType) !== -1) {
      return 1
    } else {
      return 2
    }
  }

  markDateConfirm(data) {
    let pickerTitle = ''
    let markDateSelectedValue = []
    let dataMonth = data[1].slice(0, -1)
    dataMonth = dataMonth < 10 ? `${'0' + dataMonth}` : dataMonth
    pickerTitle = data[0].slice(0, -1) + '-' + dataMonth
    markDateSelectedValue.push.apply(markDateSelectedValue, data)
    this.setState({
      pickerTitle,
      markDateVisible: false,
      markDateSelectedValue,
    })
  }

  sortList = () => {
    this.setState({
      activeSortWay: !this.state.activeSortWay,
    })
  }

  ishasDatePicker = rankType => {
    const noDatePickerArr = [0, 2, 7]
    if (noDatePickerArr.indexOf(rankType) !== -1) {
      return false
    } else {
      return true
    }
  }

  setActiveBtn = number => {
    if (this.state.activeBtn === number) {
      return null
    } else {
      this.setState({
        activeBtn: number,
      })
    }
  }

  render() {
    const activeBtn = this.state.activeBtn
    const activeSortWay = this.state.activeSortWay
    return (
      <LinearGradient colors={['#3f47df', '#1488cc']} style={{ flex: 1 }}>
        <Header title={this.headerTitle} />
        <ScrollableTabView
          initialPage={0}
          tabBarTextStyle={{
            fontSize: 16,
          }}
          tabBarActiveTextColor={CommonColor.color_primary}
          tabBarInactiveTextColor={CommonColor.color_white}
          tabBarUnderlineStyle={{
            height: 0,
          }}
          renderTabBar={() => <RenderTabBar />}
          style={styles.tabView}
          onChangeTab={({ i, ref }) => {
            if (this.state.activePage === i) {
              return null
            } else {
              this.setState({
                activePage: i,
              })
            }
          }}
        >
          <RenderContent
            isAgent={this.isAgent}
            tabLabel={this.tabLabel[0]}
            cityCode={this.tabValue[0]}
            activePage={this.state.activePage}
            activeBtn={activeBtn}
            dateTime={this.state.pickerTitle}
            request={this.props.request}
            otherParm={this.props.otherParm}
            listKey={this.listKey}
            rankFormParam={this.props.rankFormParam}
            listHeadTitle={this.listHeadTitle[activeBtn - 1]}
            primaryKey={this.primaryKey}
            sortWay={activeSortWay ? 1 : 2}
            rankType={this.props.rankType}
            itemValue={this.props.itemValue}
            timeKey={this.props.timeKey}
          />
          <RenderContent
            isAgent={this.isAgent}
            tabLabel={this.tabLabel[1]}
            cityCode={this.tabValue[1]}
            activePage={this.state.activePage}
            activeBtn={activeBtn}
            dateTime={this.state.pickerTitle}
            request={this.props.request}
            otherParm={this.props.otherParm}
            rankFormParam={this.props.rankFormParam}
            listHeadTitle={this.listHeadTitle[activeBtn - 1]}
            primaryKey={this.primaryKey}
            sortWay={activeSortWay ? 1 : 2}
            rankType={this.props.rankType}
            listKey={this.listKey}
            itemValue={this.props.itemValue}
            timeKey={this.props.timeKey}
          />
        </ScrollableTabView>
        {this.props.rankType !== 0 && (
          <View style={[styles.selectors]}>
            {this.hasDatePicker && activeBtn === 2 ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ markDateVisible: true })
                }}
                style={[styles.select_btn]}
              >
                <Text style={[styles.select_text]}>
                  {this.state.pickerTitle}
                </Text>
                <IconFont
                  name="sanjiaoxing"
                  size={12}
                  color={'#dddddd'}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            ) : null}
            {this.props.rankType === 7 ? (
              <TouchableOpacity
                onPress={() => {
                  this.sortList()
                }}
                style={[styles.select_btn]}
              >
                <Text style={[styles.select_text]}>
                  {this.state.activeSortWay ? '正序' : '倒序'}
                </Text>
              </TouchableOpacity>
            ) : null}
            {this.show && <View style={styles.switch_btns_box}>
              <TouchableOpacity
                onPress={() => {
                  this.setActiveBtn(1)
                }}
                style={[
                  styles.switch_btn,
                  {
                    backgroundColor: activeBtn === 1 ? '#81c6fe' : '#ffffff',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.select_text,
                    { color: activeBtn === 1 ? '#ffffff' : '#999999' },
                  ]}
                >
                  {this.btnTexts[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setActiveBtn(2)
                }}
                style={[
                  styles.switch_btn,
                  {
                    backgroundColor: activeBtn === 2 ? '#81c6fe' : '#ffffff',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.select_text,
                    { color: activeBtn === 2 ? '#ffffff' : '#999999' },
                  ]}
                >
                  {this.btnTexts[1]}
                </Text>
              </TouchableOpacity>
            </View>}
          </View>
        )}
        {this.hasDatePicker && (
          <Picker
            visible={this.state.markDateVisible}
            type={'dateYearMonth'}
            selectedValue={this.state.markDateSelectedValue}
            onPickerConfirm={data => this.markDateConfirm(data)}
            closeModal={() => {
              this.setState({ markDateVisible: false })
            }}
          />
        )}
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  tabView: {
    margin: 12,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectors: {
    ...DisplayStyle('row', 'center', 'flex-end'),
    position: 'absolute',
    top: 140,
    right: 10,
    left: 0,
    marginBottom: 10,
  },
  select_text: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666666',
  },
  select_btn: {
    width: 100,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#dddddd',
    marginRight: 40,
    ...DisplayStyle('row', 'center', 'center'),
  },
  switch_btns_box: {
    width: 172,
    height: 30,
    borderColor: '#dddddd',
    borderRadius: 15,
    borderWidth: 1,
    ...DisplayStyle('row', 'center', 'space-between'),
    marginRight: 10,
  },
  switch_btn: {
    width: 84,
    height: 28,
    justifyContent: 'center',
    borderRadius: 20,
  },
})
