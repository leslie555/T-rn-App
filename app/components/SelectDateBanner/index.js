import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform
} from 'react-native'
import { LocaleConfig, CalendarList } from 'react-native-calendars'
import MonthSelectorCalendar from './MonthSelectorCalendar'
import Interactable from 'react-native-interactable'
import { DEVICE_WIDTH } from '../../styles/commonStyles'
import PropTypes from 'prop-types'
import calendarIcon from './images/rili.png'
import MenuPanel from '../MenuPanel'
import { dateFormat } from '../../utils/dateFormat'
import moment from 'moment'
const LOCALECONFIG = {
  monthNames: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ],
  monthNamesShort: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ],
  dayNames: ['周天', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天'
}
LocaleConfig.locales['zh'] = LOCALECONFIG
LocaleConfig.defaultLocale = 'zh'

const Screen = Dimensions.get('window')
const itemHeight = 52
const itemWidth = DEVICE_WIDTH / 6
const highlight = '#389ef2'
const normalColor = '#363636'

export default class SelectDateBanner extends Component {
  constructor(props) {
    super(props)
    const initSelected = props.initSelected
      ? new Date(props.initSelected)
      : new Date()
    this.state = {
      snapPoints: [],
      itemList: [],
      selectedDate: new Date(dateFormat(initSelected)), // 去除小时分钟的干扰
      selectedMonth: new Date(`${dateFormat(initSelected, 'yyyy-MM')}-01`),
      selectedYear: new Date(`${initSelected.getFullYear()}-01-01`)
    }
    this.InteractableView = null
    this.MenuPanel = null
  }
  static propTypes = {
    type: PropTypes.string, // date/month/year
    handleChange: PropTypes.func, // 返回(data, type)
    initSelected: PropTypes.string // 默认选中 '2016-06-03'
  }
  static defaultProps = {
    type: 'date',
    initSelected: ''
  }
  componentWillMount() {
    this.initData(this.props.type)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      const item =
        nextProps.type === 'date'
          ? this.state.selectedDate
          : nextProps.type === 'month'
          ? this.state.selectedMonth
          : this.state.selectedYear
      this.props.handleChange && this.props.handleChange(item, nextProps.type) // 切换type时传出去切换后的数据
      this.initData(nextProps.type, () => {
        if (Platform.OS === 'android') {
          this.InteractableView.snapTo({
            index: nextProps.type !== 'year' ? 10 : 3
          })
        } else {
          // 兼容IOS切换至年份滚动错误的问题
          setTimeout(() => {
            this.InteractableView.snapTo({
              index: nextProps.type !== 'year' ? 10 : 3
            })
          }, 100)
        }
      })
    }
  }
  onPressItem = (item, index) => {
    this.InteractableView.snapTo({
      index
    })
    this.updateSelectedState(item)
  }
  updateSelectedState = (item, cb) => {
    if (this.props.type === 'date') {
      this.setState(
        {
          selectedDate: item
        },
        cb
      )
    } else if (this.props.type === 'month') {
      this.setState(
        {
          selectedMonth: item
        },
        cb
      )
    } else if (this.props.type === 'year') {
      this.setState(
        {
          selectedYear: item
        },
        cb
      )
    }
    this.props.handleChange && this.props.handleChange(item, this.props.type)
  }
  /* onStop = e => {
    const idx = -(Math.round(e.nativeEvent.x / itemWidth) - 2) // 选中的日期在itemList中的idx
    if (this.props.type === 'date') {
      this.setState({
        selectedDate: this.state.itemList[idx]
      })
    } else if (this.props.type === 'month') {
      this.setState({
        selectedMonth: this.state.itemList[idx]
      })
    }
    this.props.handleChange &&
      this.props.handleChange(this.state.itemList[idx], this.props.type)
  } */
  onDayPress = data => {
    const selectedDate = new Date(data.timestamp)
    this.updateSelectedState(selectedDate, () => {
      const index = this.state.itemList.findIndex(val => {
        return (
          selectedDate.getFullYear() === val.getFullYear() &&
          selectedDate.getMonth() === val.getMonth() &&
          selectedDate.getDate() === val.getDate()
        )
      })
      if (index === -1) {
        this.initData(this.props.type, () => {
          this.InteractableView.snapTo({
            index: 10
          })
        })
      } else {
        this.InteractableView.snapTo({
          index
        })
      }
      this.MenuPanel.close()
    })
  }
  onMonthPress = data => {
    const selectedMonth = data
    this.updateSelectedState(selectedMonth, () => {
      const index = this.state.itemList.findIndex(val => {
        return (
          selectedMonth.getFullYear() === val.getFullYear() &&
          selectedMonth.getMonth() === val.getMonth()
        )
      })
      if (index === -1) {
        this.initData(this.props.type, () => {
          this.InteractableView.snapTo({
            index: 10
          })
        })
      } else {
        this.InteractableView.snapTo({
          index
        })
      }
      this.MenuPanel.close()
    })
  }

  initData(type, cb) {
    const date = this.state.selectedDate
    const month = this.state.selectedMonth
    const year = new Date(`${new Date().getFullYear()}-01-01`) // 年份的初始化数据不变
    const snapPoints = []
    const itemList = []
    if (type === 'date' || type === 'month') {
      for (let i = 0; i > -21; i--) {
        snapPoints.push({
          x: (i + 2) * itemWidth,
          id: -i + 2 + '',
          damping: 0.5
        })
      }
    }
    if (type === 'date') {
      for (let i = -10; i < 11; i++) {
        itemList.push(new Date(date.getTime() + i * 1000 * 60 * 60 * 24))
      }
    }
    if (type === 'month') {
      for (let i = -10; i < 11; i++) {
        itemList.push(
          moment(month)
            .add(i, 'M') // 加i个月
            .toDate()
        )
      }
    }
    if (type === 'year') {
      for (let i = 0; i > -7; i--) {
        snapPoints.push({
          x: (i + 2) * itemWidth,
          id: -i + 2 + '',
          damping: 0.5
        })
      }
      for (let i = -3; i < 4; i++) {
        itemList.push(
          moment(year)
            .add(i, 'y') // 加i年
            .toDate()
        )
      }
    }
    this.setState(
      {
        // 日历拖动的每个方块的宽度
        snapPoints,
        // 日历时间
        itemList
      },
      cb
    )
  }
  renderContent(item) {
    const now = new Date()
    const { type } = this.props
    const isSelected = this.isSelectedItem(item)
    if (type === 'date') {
      const isToday =
        item.getFullYear() === now.getFullYear() &&
        item.getMonth() === now.getMonth() &&
        item.getDate() === now.getDate()
      return (
        <Fragment>
          <Text
            style={{
              fontSize: 16,
              color: isSelected ? '#fff' : isToday ? highlight : normalColor
            }}
          >
            {dateFormat(item, 'MM-dd')}
          </Text>
          <Text style={{ color: isSelected ? '#fff' : normalColor }}>
            {LOCALECONFIG.dayNames[item.getDay()]}
          </Text>
        </Fragment>
      )
    } else if (type === 'month') {
      const isNowMonth =
        item.getFullYear() === now.getFullYear() &&
        item.getMonth() === now.getMonth()
      return (
        <Text
          style={{
            fontSize: 14,
            color: isSelected ? '#fff' : isNowMonth ? highlight : normalColor
          }}
        >
          {/* {LOCALECONFIG.monthNames[item.getMonth()]} */}
          {dateFormat(item, 'yyyy-MM')}
        </Text>
      )
    } else if (type === 'year') {
      const isNowYear = item.getFullYear() === now.getFullYear()
      return (
        <Text
          style={{
            fontSize: 14,
            color: isSelected ? '#fff' : isNowYear ? highlight : normalColor
          }}
        >
          {item.getFullYear() + '年'}
        </Text>
      )
    }
  }
  isSelectedItem(item) {
    const { type } = this.props
    const { selectedDate, selectedMonth, selectedYear } = this.state
    if (type === 'date') {
      return (
        item.getFullYear() === selectedDate.getFullYear() &&
        item.getMonth() === selectedDate.getMonth() &&
        item.getDate() === selectedDate.getDate()
      )
    } else if (type === 'month') {
      return (
        item.getFullYear() === selectedMonth.getFullYear() &&
        item.getMonth() === selectedMonth.getMonth()
      )
    } else if (type === 'year') {
      return item.getFullYear() === selectedYear.getFullYear()
    }
  }
  render() {
    const { type } = this.props
    const { snapPoints, itemList, selectedDate } = this.state
    const midSnapPointIdx = this.state.snapPoints.length >> 1
    let midSnapPoint = this.state.snapPoints[midSnapPointIdx].x // 选择月和日默认选中最中间的
    if (type === 'year') {
      const index =
        midSnapPointIdx -
        (new Date().getFullYear() - this.state.selectedYear.getFullYear())
      midSnapPoint = this.state.snapPoints[index].x // 选择年根据默认值设置
    }
    return (
      <View style={{ ...styles.container, overflow: 'hidden' }}>
        <View
          style={{
            ...styles.container,
            width: snapPoints.length * itemWidth
          }}
        >
          {/* <View style={styles.selected} pointerEvents={'none'}></View> */}
          <Interactable.View
            ref={InteractableView => {
              this.InteractableView = InteractableView
            }}
            horizontalOnly={true}
            // onStop={this.onStop}
            snapPoints={snapPoints}
            initialPosition={{
              x: midSnapPoint
            }}
          >
            <View
              style={{
                ...styles.banner,
                width: snapPoints.length * itemWidth
              }}
            >
              {itemList.map((v, i) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.onPressItem(v, i)
                    }}
                    key={v.getTime()}
                  >
                    <View
                      style={[
                        styles.item,
                        this.isSelectedItem(v) ? styles.selected : null
                      ]}
                    >
                      {this.renderContent(v)}
                    </View>
                  </TouchableWithoutFeedback>
                )
              })}
            </View>
          </Interactable.View>

          {type !== 'year' && (
            <View style={styles.expandBtnContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.MenuPanel.open()
                }}
              >
                <View style={styles.expandBtn}>
                  <Image source={calendarIcon}></Image>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <MenuPanel
            height={(Screen.height * 3) / 4}
            ref={MenuPanel => {
              this.MenuPanel = MenuPanel
            }}
          >
            {type === 'date' ? (
              <CalendarList
                futureScrollRange={47 - new Date().getMonth()}
                pastScrollRange={new Date().getMonth() + 36}
                onDayPress={this.onDayPress}
                scrollEnabled={true}
                showScrollIndicator={true}
                markedDates={{
                  [dateFormat(selectedDate)]: {
                    selected: true
                  }
                }}
                current={dateFormat(selectedDate)}
              />
            ) : (
              <MonthSelectorCalendar
                onMonthPress={this.onMonthPress}
                selectedMonth={this.state.selectedMonth}
              />
            )}
          </MenuPanel>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: itemHeight,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  banner: {
    height: itemHeight,
    flexDirection: 'row'
  },
  item: {
    width: itemWidth,
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    borderRadius: 8,
    backgroundColor: '#389ef299'
  },
  expandBtnContainer: {
    position: 'absolute',
    width: DEVICE_WIDTH / 6,
    height: itemHeight,
    left: DEVICE_WIDTH - itemWidth,
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOffset: { w: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 5
    // elevation: 2
  },
  expandBtn: {
    width: DEVICE_WIDTH / 6,
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
