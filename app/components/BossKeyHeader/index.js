import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { AddShopListSelector } from '../../components'
import styles from "./bossStyle"
import { getAllSmallCompany } from '../../api/system'
import PropTypes from 'prop-types';

export default class bossKeyHeader extends React.Component {

  static propTypes = {
    renderItem: PropTypes.func,  //类容
    type: PropTypes.array, // 1 报表  2城市区域 3 门店  4已收 5已付 [1,2,4]
    config: PropTypes.object, //自定义添加
    returnData: PropTypes.array, // 其他页面进入展示数据（收租率 转到 应收）
    getPickerData: PropTypes.func // 返回的函数 和数据
  }

  constructor(props) {
    super(props)
    this.searchRef = null
    this.circleRef = null
    this.cityName = '成都'
    this.citySeleceIndex = 0
    // 0 成都  1 重庆
    this.cityNum = 0
    this.allHeaderData = [
      {
        type: 'title',
        title: '日报表',
        selectedIndex: 0,
        data: [
          {
            title: '日报表',
            value: 'date'
          },
          {
            title: '月报表',
            value: 'month'
          },
          {
            title: '年报表',
            value: 'year'
          }
        ]
      },
      {
        type: 'panel',
        title: '区域',
        customize: true,
        height: 430
      },
      {
        type: 'title',
        title: '状态',
        selectedIndex: 0,
        data: [
          {
            title: '全部',
            value: '0'
          },
          {
            title: '已收',
            value: '1'
          },
          {
            title: '未收',
            value: '2'
          },
          {
            title: '逾期',
            value: '3'
          }
        ]
      },
      {
        type: 'title',
        title: '状态',
        data: [
          {
            title: '全部',
            value: '0'
          },
          {
            title: '已付',
            value: '1'
          },
          {
            title: '未付',
            value: '2'
          },
          {
            title: '逾期',
            value: '3'
          }
        ]
      }
    ]
    this.state = {
      // 返回给莫俊的组件的数据
      listConfig: [],
      cityList: [{
        value: '5101XX', title: '成都'
      },
      {
        value: '5001XX', title: '重庆'
      }],
      // 城市 index
      cityIndex: 0,
      // 区域index
      circleIndex: -1,
      shopStoreArr: [],
      // 成都门店
      cdNameArr: [],
      // 重庆门店
      cqNameArr: [],
      // 门店选中的index
      shopStoreIndex: -1,
      areaArrCd: [
        {
          value: '5101XX', title: '全成都', company: '成都满东房地产经纪有限公司'
        }, {
          value: '510104', title: '锦江区', company: '成都满东房地产经纪有限公司'
        },
        {
          value: '510108', title: '成华区', company: '成都蜗牛壳房地产经纪有限公司'
        },
        {
          value: '510105', title: '青羊区', company: '成都拉菲房地产经纪有限责任公司'
        },
        {
          value: '510106', title: '金牛区', company: '成都至臻新意科技有限公司'
        },
        {
          value: '510107', title: '武侯区', company: '成都南立凌远房地产经纪有限责任公司\t'
        },
        {
          value: '510100', title: '成都其他区', company: '成都至臻新意科技有限公司'
        }],
      areaArrCq: [{
        value: '5001XX', title: '全重庆', company: '重庆青逸青公寓管理有限责任公司'
      }, {
        value: '500105', title: '江北区', company: '重庆青逸青公寓管理有限责任公司'
      },
      {
        value: '500106', title: '沙坪坝区', company: '重庆大琦公寓管理有限责任公司'
      },
      {
        value: '500112', title: '渝北区', company: '重庆逢阳房地产经纪有限责任公司'
      },
      {
        value: '500108', title: '南岸区', company: '重庆松子公寓管理有限公司'
      },
      {
        value: '500100', title: '重庆其他区', company: '重庆青逸青公寓管理有限责任公司'
      }]
    }
  }
  componentWillMount() {
    // returnData 判断是不是别的页面返回来的东西  （空置率跳转到应收）
    if (this.props.returnData !== undefined && this.props.returnData.lenght !== 0) {
      const Arr = this.props.returnData
      const Arr1 = Arr.find(res =>{
        return res.id === 1
      })
      const Arr4 = Arr.find(res =>{
        return res.id === 4
      })
      this.allHeaderData[0].selectedIndex = Arr1.title === '日报表' ? 0 : Arr1.title === '月报表' ? 1 : 2
      this.allHeaderData[2].selectedIndex = Arr4.title === '全部' ? 0 : Arr4.title === '已收' ? 1 : 2
      // 选中的城市 后面接的区域
      const Arr2 = Arr.find(res =>{
        return res.id === 2
      })
      Arr2.obj.data === '重庆' ?
      this.setState({
        circleList: this.state.areaArrCq
      }):this.setState({
        circleList: this.state.areaArrCd
      })
      // if(Arr2.obj.data === '重庆') {
      //   this.setState({
      //     circleList: this.state.areaArrCq
      //   })
      // }else {
      //   this.setState({
      //     circleList: this.state.areaArrCd
      //   })
      // }
    }
    //  添加到listConfig 数据
    if(this.props.type.length !== 0) {
      for(let i = 0; i < this.props.type.length; i++){
          this.state.listConfig.push(this.allHeaderData[this.props.type[i] - 1])
      }
      if(this.props.config !== undefined) {
        this.state.listConfig.push(this.props.config)
      }
      // this.setState({
      //   listConfig: this.state.listConfig
      // })
    }
    // 如果不是其他页面跳转过来  则默认为成都的区域
    if(this.props.returnData === undefined){
      this.setState({
        circleList: this.state.areaArrCd
      })
    }
  }
  componentDidMount() {
    // this.fetchData()
    this.returnFun()
  }
  fetchData() {
    const cd = {
      pageParam: {
        page: 1,
        size: 999
      },
      CityName: '成都'
    }
    const cq = {
      pageParam: {
        page: 1,
        size: 999
      },
      CityName: '重庆'
    }
    // 调用门店的接口
    Promise.all([getAllSmallCompany(cd),getAllSmallCompany(cq)]).then((data) => {
      const cdNameArr = data[0].Data.rows
      const cqNameArr = data[1].Data.rows
      this.setState({
        shopStoreArr: cdNameArr,
        cdNameArr,
        cqNameArr
      },()=>{
        // 其它页面进入  title和subindex改变
        this.returnFun()
      })
    })
  }
  // 其它页面进入  title和subindex改变
  returnFun() {
    debugger
    if(this.props.returnData !== undefined){
      if(this.props.returnData.length !== 0){
       const Arr = this.props.returnData
       const Arr2 = Arr.find(res =>{
         return res.id === 2
       })
       this.setState({
         circleIndex: Arr2.subIndex,
         cityIndex: Arr2.obj.subindex
       })
       this.searchRef.manuallySetTitle(Arr2.title, 1)
      }
   }
  }
  // 选择城市过后，展示对应的区域数据
  getAreaCircle(cityCode, cityIndex) {
    this.circleRef.scrollTo({ x: 0, y: 0, animated: true })
    var circleList
    if (cityCode === '5101XX') {
      circleList = this.state.areaArrCd
      this.cityNum = 0
    } else {
      circleList = this.state.areaArrCq
      this.cityNum = 1
    }
    // 改变对应的下标
    this.setState({
      circleIndex: -1,
      cityIndex,
      circleList
    })
  }
  // 日报表或者状态  返回的数据
  onSelectMenu(index, subindex, data) {
    if (this.props.selectShop === index + 1) {
      const markIndex = this.props.type.indexOf(2)
      if (markIndex > -1) {
        this.searchRef && this.searchRef.manuallySetTitle('区域', markIndex)
      }
    }
    this.props.getPickerData(index, subindex, data)
  }
  // 城市点击选择 和  返回数据
  cityClick(item, index) {
    this.cityName = item.title
    this.citySeleceIndex = index
    // 点击城市  取消门店
    item.title === '成都' ?
    this.setState({
      shopStoreArr: this.state.cdNameArr,
      shopStoreIndex: -1
    }):this.setState({
      shopStoreArr: this.state.cqNameArr,
      shopStoreIndex: -1
    })
    // if(item.title === '成都') {
    //   this.setState({
    //     shopStoreArr: this.state.cdNameArr,
    //     shopStoreIndex: -1
    //   })
    // } else {
    //   this.setState({
    //     shopStoreArr: this.state.cqNameArr,
    //     shopStoreIndex: -1
    //   })
    // }
    // 判断 1日报表  和 3门店 来判断
    // if(this.props.type.indexOf(1) !== -1){
    //   if(this.props.type.indexOf(3) !== -1){
    //     this.searchRef.manuallySetTitle('门店', 2)
    //   }else{
    //     this.searchRef.manuallySetTitle('门店', 1)
    //   }
    // }else{
    //   if(this.props.type.indexOf(3) !== -1){
    //     this.searchRef.manuallySetTitle('门店', 1)
    //   }else{
    //     this.searchRef.manuallySetTitle('门店', 2)
    //   }
    // }
    // 有 1 有 3 门店的位子在2
    // this.props.type.indexOf(1) !== -1 && this.props.selectShop ? this.searchRef.manuallySetTitle('组织', 2): ''
    // 没 1 有 3 门店的位子在1
    // this.props.type.indexOf(1) === -1 && this.props.selectShop ? this.searchRef.manuallySetTitle('组织', 1): ''
    // 返回选择城市的数据 getPickerData第四个参数为1表示选区域如果选左边成都或者重庆不会调接口 选子级区域选完调接口
    this.props.getPickerData(this.props.type.indexOf(2), index, item ,1)
    // 选择城市过后，展示对应的区域数据
    this.getAreaCircle(item.value, index)
  }
  // 区域选择 和 返回数据
  circleClick(item, index, close, title) {
    close()
    if(item.title === '全部') {
      title(this.cityName)
    }else{
      title(item.title || this.cityName)
    }
    this.setState({
      circleIndex: index,
    })
    // 返回城市的数据
    var cityObj = {
      index: this.props.type.indexOf(2),
      subindex: this.citySeleceIndex,
      data: this.cityName || '成都'
    }
    this.props.getPickerData(this.props.type.indexOf(2), index, item, cityObj)
    // 目前 二种类型 type 2，3 和type 1,2,3 需要 点击区域   返回门店title
    if(this.props.type.length === 1 && this.props.type.indexOf(2) !== -1 && this.props.selectShop){
      debugger
      this.searchRef.manuallySetTitle({
        1: '组织',
        0: item.title
      })
      this.searchRef.BtnReset()
    }
    if(this.props.type.length === 2 && this.props.type.indexOf(1) !== -1 && this.props.type.indexOf(2) !== -1&& this.props.selectShop){
      debugger
      this.searchRef.manuallySetTitle({
        2: '组织',
        1: item.title
      })
      this.searchRef.BtnReset()
    }
  }

  render() {
    return (
      <View style={{zIndex: -2, flex: 1}}>
        <AddShopListSelector
          ref={(ref) => {
            this.searchRef = ref
          }}
          type={3}
          selectShop={this.props.selectShop || 0}
          config={this.state.listConfig}
          onSelectMenu={this.onSelectMenu.bind(this)}
          renderContent={this.props.renderItem}
          renderCustomPanel={(close, title) => {
              return <View style={styles.selectBox}>
                <View style={styles.selectBoxLeft}>
                  <ScrollView style={styles.selectBoxScroll}>
                    {this.state.cityList.map((item, index) => {
                      return (<TouchableOpacity style={styles.selectBoxItem} key={index} onPress={() => {
                        this.cityClick(item, index)
                      }}>
                        <Text
                          style={this.state.cityIndex === index ? styles.selectBoxItemTextActive : styles.selectBoxItemText}>{item.title}</Text>
                      </TouchableOpacity>)
                    })}
                  </ScrollView>
                </View>
                <View style={styles.selectBoxRight}>
                  <ScrollView style={styles.selectBoxScroll} ref={(ref) => {
                    this.circleRef = ref
                  }}>
                    {this.state.circleList.map((item, index) => {
                      return (<TouchableOpacity style={styles.selectBoxItem} key={index} onPress={() => {
                        this.circleClick(item, index, close, title)
                      }}>
                        <Text
                          style={this.state.circleIndex === index ? styles.selectBoxItemTextActive : styles.selectBoxItemText}>{item.title}</Text>
                      </TouchableOpacity>)
                    })}
                  </ScrollView>
                </View>
              </View>
            }
          }
        />
      </View>
    )
  }
}
