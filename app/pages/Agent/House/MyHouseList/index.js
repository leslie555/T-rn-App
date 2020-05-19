import React, {Fragment} from 'react'
import {SelectMyHouseCount, SelectMyHouseList, ShowCompanyinfoCityCode} from '../../../../api/house'
import IconFont from '../../../../utils/IconFont'
import {findNodeByArr} from '../../../../utils/arrUtil'
import {Text, TouchableOpacity, View} from 'react-native'
import {Container} from '../../../../styles/commonStyles'
import {FullModal, Header, List, ListNumberBox, AddShopListSelector, SearchBar} from '../../../../components'
import CityData from '../../../../utils/Picker/areaData/cityData'
import ListItem from './ListItem'
import rootBackHandle from "../../../../utils/rootBackHandle";
import { connect } from 'react-redux'

class MyHouseList extends React.Component {
  constructor(props) {
    super(props)
    this.searchRef = null
    this.rootBackHandle = new rootBackHandle(this.props.navigation)
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Keyword: '',
        CityCode: '', // 区域城市码
        RentType: '全部', // 整合租 值： 全部，1,2
        HouseStatus: '全部', // 房源状态 ['全部', '待完善', '待租', '已定', '已租', '装修']
        IsHavephotos: '全部', /// 是否有照片: 全部;无照片;有照片
        AuditState: '全部', /// 审核状态:全部;待审核;已通过
        RentMoeny: '全部',  /// 价格  值: 全部;500-1000;1000-1500;1500-2000;2000-3000;3000以上
        RoomType: '全部', /// 户型  值： 全部,X,1,2,3,4
        FullIDNew: '', /// 区域全路径查询,
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
          type: 'title',
          title: '房源状态',
          data: [
            {
              title: '全部',
              value: '全部'
            },
            {
              title: '待完善',
              value: '待完善'
            },
            {
              title: '待租',
              value: '待租'
            },
            {
              title: '已定',
              value: '已定'
            },
            {
              title: '已租',
              value: '已租'
            },
            {
              title: '装修',
              value: '装修'
            }
          ]
        },
        {
          type: 'panel',
          title: '更多筛选',
          components: [
            {
              type: 'checkbox',
              title: '房源照片',
              data: [
                {
                  title: '全部',
                  value: '全部'
                },
                {
                  title: '无照片',
                  value: '无照片'
                },
                {
                  title: '有照片',
                  value: '有照片'
                }
              ]
            },
            {
              type: 'checkbox',
              title: '审核状态',
              data: [
                {
                  title: '全部',
                  value: '全部'
                },
                {
                  title: '待审核',
                  value: '待审核'
                },
                {
                  title: '已通过',
                  value: '已通过'
                }
              ]
            },
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
                },,
                {
                  title: '2000-3000',
                  value: '2000-3000'
                },
                {
                  title: '3000以上',
                  value: '3000以上'
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
      numberBoxConfig: [
        {
          key: 0,
          type: 'Rent',
          label: '待完善',
          value: 0
        },
        {
          key: 0,
          type: 'Audit',
          label: '待审核',
          value: 0,
        }
      ],
      isPageReady: false
    }
    // config 处理
    if(this.props.shopList.length > 0){
      this.state.listConfig[3].components.unshift({
        type: 'checkbox',
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
      },)
      this.state.listConfig.splice(1,1)
    }
    this.viewWillFocus = this.props.navigation.addListener(
        'willFocus',
        payload => {
          if (payload.state.params && payload.state.params.isRefresh === true) {
            this.props.navigation.setParams({ isRefresh: false })
            this.setState({
              form: {...this.state.form}
            })
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
    this.getNumber()
  }

  componentWillUnmount() {
    this.rootBackHandle.remove()
    this.viewWillFocus.remove()
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

  getNumber() {
    return SelectMyHouseCount().then(({Data}) => {
      this.state.numberBoxConfig[0].value = Data.EmptyCount || 0
      this.state.numberBoxConfig[1].value = Data.ToAuditCount || 0
      this.setState({
        numberBoxConfig: this.state.numberBoxConfig
      })
    })
  }

  renderContent() {
    const renderItem = ({item}) => {
      return <ListItem item={item}/>
    }
    return (
        <Fragment>
          <ListNumberBox
              data={this.state.numberBoxConfig}
              handleRentClick={(flag) => {
                this.fastSearch(2, flag ? 1 : 0)
                this.fastSearch(3, 1, flag ? null : 1)
              }}
              handleAuditClick={(flag) => {
                this.fastSearch(2, flag ? 0 : 1)
                this.fastSearch(3, 1, flag ? 1 : null)
              }}
          />
          <List
              request={SelectMyHouseList}
              form={this.state.form}
              setForm={form => this.setState({form})}
              listKey={'AgentMyHouseList'}
              renderItem={renderItem}
              requestFirst={false}
              onRefresh={()=>{
                this.getNumber()
              }}
          />
        </Fragment>
    )
  }

  onSelectMenu(index, subindex, data) {
    const num = this.props.shopList.length === 0 ? 0 : 1
    const form = {...this.state.form}
    form.parm.page = 1
    switch (index) {
      case 0:
        form.CityCode = data.value
        this.setState({form})
        break
      case 1-num:
        form.RentType = data.value
        this.setState({form})
        break
      case 2-num:
        form.HouseStatus = data.value
        this.setState({form})
        break
      case 3-num:
        data.forEach((item, index) => {
          if (!item.data) {
            item.data = {
              value: '全部'
            }
          }
          switch (index) {
            case 0+num:
              form.IsHavephotos = item.data.value
              break
            case 0:
              form.RentType = item.data.value
              break
            case 1+num:
              form.AuditState = item.data.value
              break
            case 2+num:
              form.RentMoeny = item.data.value
              break
            case 3+num:
              form.RoomType = item.data.value
              break
          }
        })
        this.setState({form})
        break
      case 3:
        form.FullIDNew = data.FullID || ''
        this.setState({form})
        break
      default:
        this.setState({form})
        break
    }
  }

  onRefresh() {
    this.getNumber()
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

  fastSearch(index, subIndex, panelIndex = 0) {
    this.searchRef.manuallySelect(index, subIndex, panelIndex)
  }

  render() {
    return (
        <View style={Container}>
          <FullModal visible={!this.state.isPageReady} loadingText="加载中..."/>
          <Header
              title='个人房源'
              hideLeft
              headerRight={
                <TouchableOpacity onPress={() => {
                  this.searchRef && this.searchRef.manuallyHide()
                  this.toggleSearchBar()
                }}>
                  <IconFont name='search' size={20} color='white'/>
                </TouchableOpacity>
              }>
            {this.state.searchBarVisible &&
            <SearchBar
                hideLeft
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
          <AddShopListSelector
              ref={(ref) => {
                this.searchRef = ref
              }}
              selectShop={2}
              config={this.state.listConfig}
              onSelectMenu={this.onSelectMenu.bind(this)}
              renderContent={this.renderContent.bind(this)}
          />
          }
        </View>
    )
  }
}
const mapToProps = state => {
  return {
    shopList: state.account.ShopListSelector || []
  }
}
export default connect(mapToProps)(MyHouseList)
