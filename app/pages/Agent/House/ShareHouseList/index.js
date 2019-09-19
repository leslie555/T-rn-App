import React, {Fragment} from 'react'
import {SelectShareHouseList, ShowCompanyinfoCityCode} from '../../../../api/house'
import IconFont from '../../../../utils/IconFont'
import {findNodeByArr} from '../../../../utils/arrUtil'
import {Text, TouchableOpacity, View} from 'react-native'
import {Container} from '../../../../styles/commonStyles'
import {FullModal, Header, List, ListSelector, SearchBar} from '../../../../components'
import CityData from '../../../../utils/Picker/areaData/cityData'
import ListItem from './ListItem'
import {TopMenuItem} from "../../../../components/ListSelector";
import {showSelectAny} from "../../../../components/SelectAny/util";

export default class MyHouseList extends React.Component {
  constructor(props) {
    super(props)
    this.searchRef = null
    this.query = this.props.navigation.state.params || {} // 路由参数 type 1：我的收藏 其他：共享房源
    this.title = this.query.type === 1 ? '我的收藏': '共享房源'
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Keyword: '',
        CityCode: '', // 区域城市码
        RentType: '全部', // 整合租 值： 全部，1,2
        FullID: '', /// 门店全路径查询,
        RentMoeny: '全部',  /// 价格  值: 全部;500-1000;1000-1500;1500-2000;2000以上
        RoomType: '全部', /// 户型  值： 全部,X,1,2,3,4
        isMyEnshrine: this.query.type === 1 ? 1: 0
      },
      listConfig: [
        {
          type: 'title',
          title: '区域',
          data: [
            {
              title: '全部',
              value: ''
            }
          ]
        },
        {
          type: 'title',
          title: '出租方式',
          data: [
            {
              title: '全部',
              value: '全部'
            },
            {
              title: '整租',
              value: '1'
            },
            {
              title: '合租',
              value: '2'
            }
          ]
        },
        {
          type: 'customize', // 自定义组件
          componentKey: 'store'
        },
        {
          type: 'panel',
          title: '更多筛选',
          components: [
            {
              type: 'checkbox',
              title: '价格',
              data: [
                {
                  title: '全部',
                  value: '全部'
                },
                {
                  title: '0-1000',
                  value: '0-1000'
                },
                {
                  title: '1000-1500',
                  value: '1000-1500'
                },
                {
                  title: '1500-2000',
                  value: '1500-2000'
                },
                {
                  title: '2000以上',
                  value: '2000以上'
                }
              ]
            },
            {
              type: 'checkbox',
              title: '户型',
              data: [
                {
                  title: '全部',
                  value: '全部'
                },
                {
                  title: '一室',
                  value: '1'
                }, ,
                {
                  title: '两室',
                  value: '2'
                }, ,
                {
                  title: '三室',
                  value: '3'
                }, ,
                {
                  title: '四室',
                  value: '4'
                }, ,
                {
                  title: '五室及以上',
                  value: 'X'
                }
              ]
            }
          ]
        }
      ],
      isPageReady: false,
      storeLabel: '门店',
      storeVisible: false
    }
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          // 门店数据拦截
          if (payload.state.params && payload.state.params.storeInfo) {
            const item = JSON.parse(payload.state.params.storeInfo)
            if (!item.FullID) item.FullID = ''
            if (item.FullID !== this.state.form.FullID) {
              const obj = {
                form: {
                  ...this.state.form,
                  FullID: item.FullID
                }
              }
              if (item.isReset) {
                obj.storeLabel = '门店'
                obj.storeVisible = false
              } else {
                obj.storeLabel = item.CompanyName.length > 4 ? (item.CompanyName.slice(0, 4) + '..') : item.CompanyName
                // obj.storeVisible = true
                obj.storeVisible = false
              }
              this.setState(obj)
            }
          }
        }
    )
  }

  componentDidMount() {
    this.getAreaEnumData().finally(() => {
      this.setState({
        isPageReady: true
      })
    })
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove()
  }

  getAreaEnumData() {
    return ShowCompanyinfoCityCode().then(({Data}) => {
      const oldCityCode = !Data ? '510102' : Data
      var newProvince = oldCityCode.slice(0, 2) + '0000'
      var newCityCode = oldCityCode.slice(0, 4) + '00'
      const provinceList = CityData.find(ele => {
        return ele.value === newProvince
      })
      const CityList = provinceList.children.find(ele => {
        return ele.value === newCityCode
      })
      if (CityList && CityList.children.length > 0) {
        const result = CityList.children.map((item, index) => {
          return {
            title: item.name,
            value: item.value
          }
        })
        this.state.listConfig[0].data.push(...result)
      }
    })
  }

  renderContent() {
    const renderItem = ({item}) => {
      return <ListItem item={item}/>
    }
    return (
        <List
            request={SelectShareHouseList}
            form={this.state.form}
            setForm={form => this.setState({form})}
            listKey={'AgentShareHouseList'}
            renderItem={renderItem}
            primaryKey={'HouseID'}
        />
    )
  }

  onSelectMenu(index, subindex, data) {
    const form = {...this.state.form}
    form.parm.page = 1
    switch (index) {
      case 0:
        form.CityCode = data.value
        this.setState({form})
        break
      case 1:
        form.RentType = data.value
        this.setState({form})
        break
      case 2:
        // form.HouseStatus = data.value
        // this.setState({form})
        break
      case 3:
        data.forEach((item, index) => {
          if (!item.data) {
            item.data = {
              value: '全部'
            }
          }
          switch (index) {
            case 0:
              form.RentMoeny = item.data.value
              break
            case 1:
              form.RoomType = item.data.value
              break
          }
        })
        this.setState({form})
        break
      default:
        break
    }
  }

  toggleSearchBar() {
    this.setState({
      searchBarVisible: !this.state.searchBarVisible
    })
  }

  searchByKeyword(text) {
    this.state.form.parm.page = 1
    this.state.form.Keyword = text
    this.setState({
      form: {...this.state.form}
    })
  }

  selectStore() {
    showSelectAny({
      apiType: 4,
      path: 'AgentShareHouseList',
      returnKey: 'storeInfo'
    })
  }

  render() {
    const customComponent = {
      store: (
          <TopMenuItem
              customize
              label={this.state.storeLabel}
              selected={this.state.storeVisible}
              onPress={this.selectStore.bind(this)}
          />
      )
    }
    return (
        <View style={Container}>
          <FullModal visible={!this.state.isPageReady} loadingText="加载中..."/>
          <Header
              title={this.title}
              headerRight={
                <TouchableOpacity onPress={() => {
                  this.searchRef.manuallyHide()
                  this.toggleSearchBar()
                }}>
                  <IconFont name='search' size={20} color='white'/>
                </TouchableOpacity>
              }>
            {this.state.searchBarVisible &&
            <SearchBar
                placeholder={'请输入房源名称/房间号/小区名称'}
                onChangeText={(text) => {
                  this.searchByKeyword(text)
                }}
                onCancel={(text) => {
                  this.toggleSearchBar()
                  text && this.searchByKeyword('')
                }}
                onClear={() => {
                  this.searchByKeyword('')
                }}
            />}
          </Header>
          {this.state.isPageReady &&
          <ListSelector
              ref={(ref) => {
                this.searchRef = ref
              }}
              config={this.state.listConfig}
              onSelectMenu={this.onSelectMenu.bind(this)}
              renderContent={this.renderContent.bind(this)}
              customComponent={customComponent}
          />
          }
        </View>
    )
  }
}
