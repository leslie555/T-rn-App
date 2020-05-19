import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { DEVICE_WIDTH, DisplayStyle } from '../../styles/commonStyles'
import PropTypes from 'prop-types'

const highlight = '#389ef2'
// const normalColor = '#363636'
const ItemHeight = 80
const ItemWidth = DEVICE_WIDTH / 3
const TitleHeight = 80
const MONTHS = [
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
]

export default class SelectDateBanner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemList: []
    }
  }
  static propTypes = {
    selectedMonth: PropTypes.object,
    onMonthPress: PropTypes.func
  }
  static defaultProps = {
    selectedMonth: new Date(),
    onMonthPress: () => {}
  }
  componentWillMount() {
    this.initData()
  }
  initData() {
    const year = new Date().getFullYear()
    const itemList = []
    for (let i = -3; i < 4; i++) {
      itemList.push(year + i + '')
    }
    this.setState({
      itemList
    })
  }
  // 年份选中 居中
  getInitialScrollIndex = () => {
    return this.state.itemList.findIndex(
      v => v === this.props.selectedMonth.getFullYear() + ''
    )
  }
  onPress = (year, month) => {
    const selected = `${year}-${
      month + 1 > 9 ? month + 1 : '0' + (month + 1)
    }-01`
    this.props.onMonthPress(new Date(selected))
  }
  renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTitleContainer}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold'
            }}
          >
            {item}
          </Text>
        </View>
        <View style={styles.itemContentContainer}>
          {MONTHS.map((v, i) => {
            const now = new Date()
            // 月份选中
            const selected =
              this.props.selectedMonth.getFullYear() === +item &&
              this.props.selectedMonth.getMonth() === i
            const isNowMonth =
              now.getFullYear() === +item && now.getMonth() === i
            return (
              <TouchableOpacity
                style={styles.itemMonth}
                key={v}
                onPress={() => {
                  this.onPress(item, i)
                }}
              >
                <View
                  style={{
                    ...styles.itemMonthWrap,
                    backgroundColor: selected ? highlight : '#fff'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: selected
                        ? '#fff'
                        : isNowMonth
                        ? highlight
                        : '#363636'
                    }}
                  >
                    {v}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }
  render() {
    const { itemList } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          ref={FlatList => {
            this.FlatList = FlatList
          }}
          initialScrollIndex={this.getInitialScrollIndex()}
          data={itemList}
          getItemLayout={(data, index) => ({
            length: ItemHeight * 4 + TitleHeight,
            offset: (ItemHeight * 4 + TitleHeight) * index,
            index
          })}
          keyExtractor={item => item + ''}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    flex: 1
  },
  itemContainer: {
    height: ItemHeight * 4 + TitleHeight,
    flex: 1
  },
  itemTitleContainer: {
    height: TitleHeight,
    paddingLeft: 50,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  itemContentContainer: {
    height: ItemHeight * 4,
    flex: 1,
    flexWrap: 'wrap',
    ...DisplayStyle('row', 'flex-start', 'flex-start')
  },
  itemMonth: {
    width: ItemWidth,
    height: ItemHeight,
    ...DisplayStyle('row', 'center', 'center')
  },
  itemMonthWrap: {
    width: Math.min(ItemWidth, ItemHeight),
    height: Math.min(ItemWidth, ItemHeight),
    backgroundColor: 'red',
    ...DisplayStyle('row', 'center', 'center')
  }
})
