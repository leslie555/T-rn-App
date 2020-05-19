import React, { Fragment } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'
// import { ShowStaffRelationIntoByEmployeeID } from '../../api/bossKey'
import ListSelector from '../ListSelector/index'
import styles from './style'
import storage from '../../utils/storage'
//redux
import { connect } from 'react-redux'

class AddShopListSelector extends React.Component {
  static propTypes = {
    onSelectMenu: PropTypes.func, //返回来的数据
    config: PropTypes.array, // 展示的数据
    renderContent: PropTypes.func, //组件View
    customComponent: PropTypes.object, // 组件View
    selectShop: PropTypes.number //门店在哪个位子
  }

  constructor(props) {
    super(props)
    // 0 出现全部  1 不出现全部，出现一个单线  2 不出现门店
    this.selectJudge = 1
    this.state = {
      shopStoreArrAll: [],
      // 选中的idnex
      selectOneIndex: 0,
      // 选中的数据
      selectOneData: {
        SysName: '全部',
        KeyID: 'One',
        PID: 'One'
      },
      // 列表数据
      shopStoreArrOne: [],

      selectTwoIndex: 0,
      selectTwoData: {},
      shopStoreArrTwo: [],

      selectThreeIndex: 0,
      selectThreeData: {},
      shopStoreArrThree: [],

      selectFourIndex: 0,
      selectFourData: {},
      shopStoreArrFour: []
    }
    this.ListSelector = null
  }

  static propTypes = {
    type: PropTypes.number
  }

  static defaultProps = {
    type: 1
  }

  firstClick(item, index, close, title) {
    console.log(item, index)
    // 点一次出现 再点一次下一级消失
    if (index === this.state.selectOneIndex) {
      this.setState({
                selectOneIndex: '',
        selectOneData: {
          SysName: '全部',
          KeyID: 'One',
          PID: 'One'
        },
        shopStoreArrTwo: [],
        // 第二个的
        selectTwoIndex: 0,
        selectTwoData: {},
        shopStoreArrThree: [],

        // 第三个数据 回原位
        selectThreeIndex: 0,
        selectThreeData: {},
        shopStoreArrFour: [],
        // 第四个回原位
        selectFourIndex: 0,
        selectFourData: {}
      })
    } else {
      var KeyID = item.KeyID
      var arr = []
      this.state.shopStoreArrAll.forEach(list => {
        if (KeyID === list.PID) {
          arr.push(list)
        }
      })
      const arrTwo = {
        SysName: '全部',
        KeyID: 'Two',
        PID: 'Two'
      }
      arr.unshift(arrTwo)
      // 如果选中的是全部，则下一级为空
      if (item.KeyID === 'One') {
        arr = []
      }
      this.setState(
        {
          shopStoreArrTwo: arr,
          selectOneIndex: index,
          selectOneData: item,
          // 点击下一个回原位
          selectTwoIndex: 0,
          selectTwoData: {},
          shopStoreArrThree: [],

          // 第三个数据 回原位
          selectThreeIndex: 0,
          selectThreeData: {},
          shopStoreArrFour: [],
          // 第四个回原位
          selectFourIndex: 0,
          selectFourData: {}
        },
        () => {
          console.log(this.state.selectOneData)
        }
      )
    }
  }
  secondClick(item, index, close, title) {
    if (index === this.state.selectTwoIndex) {
      this.setState({
        selectTwoIndex: '',
        selectTwoData: {},
        shopStoreArrThree: [],

        // 第三个数据 回原位
        selectThreeIndex: 0,
        selectThreeData: {},
        shopStoreArrFour: [],
        // 第四个回原位
        selectFourIndex: 0,
        selectFourData: {}
      })
    } else {
      var KeyID = item.KeyID
      var arr = []
      this.state.shopStoreArrAll.forEach(list => {
        if (KeyID === list.PID) {
          arr.push(list)
        }
      })
      const arrTwo = {
        SysName: '全部',
        KeyID: 'Three',
        PID: 'Three'
      }
      arr.unshift(arrTwo)
      // 如果选中的是全部，则下一级为空
      if (item.KeyID === 'Two') {
        arr = []
      }
      this.setState(
        {
          shopStoreArrThree: arr,
          selectTwoIndex: index,
          selectTwoData: item,
          // 第三个数据 回原位
          selectThreeIndex: 0,
          selectThreeData: {},
          shopStoreArrFour: [],
          // 第四个回原位
          selectFourIndex: 0,
          selectFourData: {}
        },
        () => {
          console.log(this.state.selectTwoData)
        }
      )
    }
  }
  thirdClick(item, index, close, title) {
    if (index === this.state.selectThreeIndex) {
      this.setState({
        selectThreeIndex: '',
        selectThreeData: {},
        shopStoreArrFour: [],
        // 第四个回原位
        selectFourIndex: 0,
        selectFourData: {}
      })
    } else {
      var KeyID = item.KeyID
      var arr = []
      this.state.shopStoreArrAll.forEach(list => {
        if (KeyID === list.PID) {
          arr.push(list)
        }
      })
      const arrTwo = {
        SysName: '全部',
        KeyID: 'Four',
        PID: 'Four'
      }
      arr.unshift(arrTwo)
      // 如果选中的是全部，则下一级为空
      if (item.KeyID === 'Three') {
        arr = []
      }
      this.setState(
        {
          shopStoreArrFour: arr,
          selectThreeIndex: index,
          selectThreeData: item,
          // 第四个回原位
          selectFourIndex: 0,
          selectFourData: {}
        },
        () => {
          console.log(this.state.selectThreeData)
        }
      )
    }
  }
  fourClick(item, index, close, title) {
    if (index === this.state.selectFourIndex) {
      this.setState({
        selectFourIndex: '',
        selectFourData: {}
      })
    } else {
      this.setState(
        {
          selectFourIndex: index,
          selectFourData: item
        },
        () => {
          console.log(this.state.selectFourData)
        }
      )
    }
  }
  BtnReset(close, title) {
    // 0 出现全部  1 不出现全部，出现一个单线  2 不出现门店
    if (this.selectJudge === 1) {
      // 获取第一个
      var arr = []
      this.state.shopStoreArrAll.forEach(item => {
        if (item.PID === 0) {
          arr.push(item)
        }
      })
      // 获取第二个
      const arr1 = []
      this.state.shopStoreArrAll.forEach(list => {
        if (this.state.shopStoreArrAll[0].KeyID === list.PID) {
          arr1.push(list)
        }
      })
      const arrTwo = {
        SysName: '全部',
        KeyID: 'Two',
        PID: 'Two'
      }
      arr1.unshift(arrTwo)
      this.setState({
        // 第二个重置变化
        selectTwoData: arrTwo,
        selectTwoIndex: 0,
        shopStoreArrTwo: arr1,
        // 第一个重置变化
        selectOneData: arr[0],
        selectOneIndex: 0,

        // 第三个数据 回原位
        selectThreeIndex: 0,
        selectThreeData: {},
        shopStoreArrThree: [],
        // 第四个回原位
        selectFourIndex: 0,
        selectFourData: {},
        shopStoreArrFour: []
      })
    } else if (this.selectJudge === 0) {
      this.setState({
        selectOneIndex: 0,
        selectOneData: {
            SysName: '全部',
          KeyID: 'One',
          PID: 'One'
        },
        shopStoreArrTwo: [],
        // 第二个的
        selectTwoIndex: 0,
        selectTwoData: {},
        shopStoreArrThree: [],

        // 第三个数据 回原位
        selectThreeIndex: 0,
        selectThreeData: {},
        shopStoreArrFour: [],
        // 第四个回原位
        selectFourIndex: 0,
        selectFourData: {}
      })
    }
  }
  BtnSure(close, title) {
    const data = []
    // 记录点击每一个的index
    const dataIndex = [
      this.state.selectOneIndex,
      this.state.selectTwoIndex,
      this.state.selectThreeIndex,
      this.state.selectFourIndex
    ]
    // if(this.state.selectOneData.SysName !== '全部' && JSON.stringify(this.state.selectFourData) !== '{}'){
    // }
    data.push(this.state.selectOneData)
    if (
      this.state.selectTwoData.SysName !== '全部' &&
      JSON.stringify(this.state.selectTwoData) !== '{}'
    ) {
      data.push(this.state.selectTwoData)
    }
    if (
      this.state.selectThreeData.SysName !== '全部' &&
      JSON.stringify(this.state.selectThreeData) !== '{}'
    ) {
      data.push(this.state.selectThreeData)
    }
    if (
      this.state.selectFourData.SysName !== '全部' &&
      JSON.stringify(this.state.selectFourData) !== '{}'
    ) {
      data.push(this.state.selectFourData)
    }
    close()
    title(data[data.length - 1].SysName)
    this.onSelectMenu(
      this.props.selectShop - 1,
      dataIndex,
      data[data.length - 1]
    )
  }
  componentWillMount() {
    // 0 出现全部  1 不出现全部，出现一个单线  2 不出现门店
    // console.log(this.props.config, this.props.accountList, this.props.userinfo)
    // 不传selectShop  代表不需要门店
    if (!this.props.selectShop) {
      return
    }
    // 如果没有 数组为0 则代表不展示门店
    if (this.props.type === 1 && this.props.accountList.length === 0) {
      return
    }
    if (this.props.type === 2 && this.props.accountList2.length === 0) {
      return
    }
    if (this.props.type === 1 && this.props.userinfo.IsRequired) {
      this.selectJudge = 1
    } else {
      this.selectJudge = 0
    }
    if (this.selectJudge === 1 || this.selectJudge === 0) {
      this.state.shopStoreArrAll =
        this.props.type === 1 ? this.props.accountList : this.props.accountList2
      const item = {
        type: 'panel',
        title: '组织',
        customize: true,
        height: 460,
        key: 'shopStore'
      }
      this.props.config.splice(this.props.selectShop - 1, 0, item)
    }
  }
  componentDidMount() {
    if (this.props.type === 1 && this.props.accountList.length === 0) {
      this.onSelectMenu(-1)
      return
    }
    if (this.props.type === 3 && this.props.accountList2.length === 0) {
      this.onSelectMenu(-1)
      return
    }
    // storage.get('userinfo').then(res =>{
    //     // 有默认值为true
    //     if(!res.IsRequired){
    //         this.selectJudge = 1
    //     }else{
    //         this.selectJudge = 0
    //     }
    // })
    this.getShopData()
    // storage.get('AddShopListSelector').then(res =>{
    //     this.state.shopStoreArrAll = res
    //     console.log(this.state.shopStoreArrAll)
    //     this.getShopData()
    // })
  }
  returnSelectJudge() {
    if (this.state.shopStoreArrAll.length === 0) {
      return 2
    } else {
      return this.selectJudge
    }
  }
  getShopData() {
    var arr = []
    this.state.shopStoreArrAll.forEach(item => {
      if (item.PID === 0) {
        arr.push(item)
      }
    })
    // 0 出现全部  1 不出现全部，出现一个单线  2 不出现门店
    if (this.selectJudge === 1) {
      const arr1 = []
      this.state.shopStoreArrAll.forEach(list => {
        if (arr[0].KeyID === list.PID) {
          arr1.push(list)
        }
      })
      const arrTwo = {
        SysName: '全部',
        KeyID: 'Two',
        PID: 'Two'
      }
      arr1.unshift(arrTwo)
      this.setState({
        selectTwoData: arrTwo,
        selectTwoIndex: 0,
        shopStoreArrTwo: arr1
      })
    } else if (this.selectJudge === 0) {
      const arrOne = {
        SysName: '全部',
        KeyID: 'One',
        PID: 'One'
      }
      arr.unshift(arrOne)
    }
    this.setState({
      selectOneData: arr[0],
      shopStoreArrOne: arr
      // shopStoreArrAll: Data,
    })
    this.onSelectMenu(this.props.selectShop - 1, [0, 0, 0, 0], arr[0])
  }

  manuallyHide = () => {
    this.ListSelector.manuallyHide()
  }
  onSelectMenu = (index, subindex, data) => {
    const num = this.state.shopStoreArrAll.length > 0 ? 1 : 0
    if (num === 0) {
      this.props.onSelectMenu(index, subindex, data)
    } else {
      let markIndex = index
      if (index === this.props.selectShop - 1) {
        markIndex = this.props.config.length - 1
      } else if (index > this.props.selectShop - 1) {
        markIndex = index - 1
      }
      this.props.onSelectMenu(markIndex, subindex, data)
    }
  }
  manuallySetTitle = (title, index) => {
    this.ListSelector.manuallySetTitle(title, index)
  }
  manuallySelect = (index, subselected, panelIndex) => {
    if (this.state.shopStoreArrAll.length && index < this.props.selectShop) {
      index = index + 1
    }
    this.ListSelector.manuallySelect(index, subselected, panelIndex)
  }

  render() {
    return (
      <View style={{ zIndex: -2, flex: 1 }}>
        <ListSelector
          ref={ListSelector => (this.ListSelector = ListSelector)}
          config={this.props.config}
          onSelectMenu={this.onSelectMenu}
          renderContent={this.props.renderContent}
          customComponent={this.props.customComponent}
          renderCustomPanel={this.props.renderCustomPanel}
          renderCustomPanelMap={{
            shopStore: (close, title) => {
              return (
                <View style={styles.BoxshopAll}>
                  <View style={styles.selectBox}>
                    <View style={styles.selectBoxLeft}>
                      <ScrollView style={styles.selectBoxScroll}>
                        {this.state.shopStoreArrOne.map((item, index) => {
                          return (
                            <TouchableOpacity
                              style={styles.selectBoxItem}
                              key={index}
                              onPress={() => {
                                this.firstClick(item, index)
                              }}
                            >
                              <Text
                                style={
                                  this.state.selectOneIndex === index
                                    ? styles.selectBoxItemTextActive
                                    : styles.selectBoxItemText
                                }
                              >
                                {item.SysName}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </ScrollView>
                    </View>
                    <View style={styles.selectBoxRight}>
                      <ScrollView
                        style={styles.selectBoxScroll}
                        ref={ref => {
                          this.circleRef = ref
                        }}
                      >
                        {this.state.shopStoreArrTwo.map((item, index) => {
                          return (
                            <TouchableOpacity
                              style={styles.selectBoxItem}
                              key={index}
                              onPress={() => {
                                this.secondClick(item, index, close, title)
                              }}
                            >
                              <Text
                                style={
                                  this.state.selectTwoIndex === index
                                    ? styles.selectBoxItemTextActive
                                    : styles.selectBoxItemText
                                }
                              >
                                {item.SysName}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </ScrollView>
                    </View>
                    {this.state.shopStoreArrThree.length > 1 ? (
                      <View style={styles.selectBoxRight}>
                        <ScrollView
                          style={styles.selectBoxScroll}
                          ref={ref => {
                            this.circleRefThree = ref
                          }}
                        >
                          {this.state.shopStoreArrThree.map((item, index) => {
                            return (
                              <TouchableOpacity
                                style={styles.selectBoxItem}
                                key={index}
                                onPress={() => {
                                  this.thirdClick(item, index, close, title)
                                }}
                              >
                                <Text
                                  style={
                                    this.state.selectThreeIndex === index
                                      ? styles.selectBoxItemTextActive
                                      : styles.selectBoxItemText
                                  }
                                >
                                  {item.SysName}
                                </Text>
                              </TouchableOpacity>
                            )
                          })}
                        </ScrollView>
                      </View>
                    ) : null}
                    {this.state.shopStoreArrFour.length > 1 ? (
                      <View style={styles.selectBoxRight}>
                        <ScrollView
                          style={styles.selectBoxScroll}
                          ref={ref => {
                            this.circleRefThree = ref
                          }}
                        >
                          {this.state.shopStoreArrFour.map((item, index) => {
                            return (
                              <TouchableOpacity
                                style={styles.selectBoxItem}
                                key={index}
                                onPress={() => {
                                  this.fourClick(item, index, close, title)
                                }}
                              >
                                <Text
                                  style={
                                    this.state.selectFourIndex === index
                                      ? styles.selectBoxItemTextActive
                                      : styles.selectBoxItemText
                                  }
                                >
                                  {item.SysName}
                                </Text>
                              </TouchableOpacity>
                            )
                          })}
                        </ScrollView>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.shopStoreBtn}>
                    <TouchableOpacity
                      onPress={() => {
                        this.BtnReset(close, title)
                      }}
                      style={styles.shopStoreBtn_nextC}
                    >
                      <Text>重置</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.BtnSure(close, title)
                      }}
                      style={styles.shopStoreBtn_nextS}
                    >
                      <Text style={styles.shopStoreBtn_nextS_Text}>确定</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }
          }}
        />
      </View>
    )
  }
}

const mapToProps = state => {
  return {
    accountList: state.account.ShopListSelector,
    accountList2: state.account.ShopListSelector2,
    userinfo: state.user.userinfo
  }
}
export default connect(mapToProps, null, null, {
  forwardRef: true
})(AddShopListSelector)
