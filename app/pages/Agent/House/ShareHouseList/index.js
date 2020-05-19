import React, {Fragment} from 'react'
import {SelectBusinessCircle, ShowStreetByCityCodeList, SelectShareHouseList, ShowCompanyinfoCityCode} from '../../../../api/house'
import IconFont from '../../../../utils/IconFont'
import {findNodeByArr} from '../../../../utils/arrUtil'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {Container} from '../../../../styles/commonStyles'
import {AddShopListSelector, ContainerLoading, Header, List, SearchBar} from '../../../../components'
import CityData from '../../../../utils/Picker/areaData/cityData'
import ListItem from './ListItem'
import styles from "./style"
import {connect} from 'react-redux'

class MyHouseList extends React.Component {
  constructor(props) {
    super(props)
    this.searchRef = null
    this.circleRef = null
    this.query = this.props.navigation.state.params || {} // 路由参数 type 1：我的收藏 其他：共享房源
    this.title = this.query.type === 1 ? '我的收藏' : '共享房源'
    this.cityName = ''
    this.circleData = {}
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 15
        },
        Keyword: '',
        CityCode: '', // 区域城市码
        BusinessCircle: '', // 商圈
        Street: '', // 街道
        RentType: '全部', // 整合租 值： 全部，1,2
        FullID: '', /// 门店全路径查询,
        FullIDNew: '', /// 区域全路径查询,
        RentMoeny: '全部',  /// 价格  值: 全部;500-1000;1000-1500;1500-2000;2000-3000,2000以上
        RoomType: '全部', /// 户型  值： 全部,X,1,2,3,4
        IsHaveImage: 0, /// 是否有图片 0:全部  1:有图片  2:无图片
        HouseStatus: '全部', /// 出租状态
      },
      listConfig: [
        {
          type: 'panel',
          title: '区域',
          customize: true,
          height: 430
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
                },
                {
                  title: '两室',
                  value: '2'
                },
                {
                  title: '三室',
                  value: '3'
                },
                {
                  title: '四室',
                  value: '4'
                },
                {
                  title: '五室及以上',
                  value: 'X'
                }
              ]
            },
            {
              type: 'checkbox',
              title: '是否有图',
              data: [
                {
                  title: '全部',
                  value: 0
                },
                {
                  title: '有图片',
                  value: 1
                },
                {
                  title: '无图片',
                  value: 2
                }
              ]
            },
            {
              type: 'checkbox',
              title: '出租状态',
              data: [
                {
                  title: '全部',
                  value: '全部'
                },
                {
                  title: '可租',
                  value: '可租'
                },
                {
                  title: '待租',
                  value: 2
                }
              ]
            }
          ]
        }
      ],
      cityList: [],
      circleList: [{
        title: '全部',
        value: ''
      }],
      cityIndex: 0,
      circleIndex: -1,
      circleLoading: false
    }
  }

  componentDidMount() {
    this.getAreaEnumData()
  }

  componentWillUnmount() {
    // this.willFocusSubscription.remove()
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
        result.unshift({
          title: '全部',
          value: ''
        })
        this.setState({
          cityList: result
        })
        // this.state.listConfig[0].data.push(...result)
      }
    })
  }

  getAreaCircle(cityCode, cityIndex) {
    this.circleRef.scrollTo({x: 0, y: 0, animated: true})
    if (cityIndex === 0) {
      this.setState({
        circleList: [{
          title: '全部',
          value: ''
        }]
      })
    } else {
      const circleData = this.circleData[cityCode + '']
      if (circleData) {
        this.setState({
          circleList: circleData
        })
      } else {
        this.setState({
          circleLoading: true
        })
        ShowStreetByCityCodeList({
          CityCode: cityCode
        }).then(({Data}) => {
          Data = Data.map(item => {
            return {
              title: item.Street,
              value: item.Street,
              disabled: false
            }
          })
          Data.unshift({
            title: '全部',
            value: '',
            disabled: false
          })
          this.circleData[cityCode + ''] = Data
          this.setState({
            circleList: Data
          })
        }).finally(() => {
            this.setState({
              circleLoading: false
            })
          })
        // SelectBusinessCircle({
        //   cityCode
        // }).then(({Data}) => {
        //   Data = Data.map(item => {
        //     item.BusinessCircle = item.BusinessCircle.replace(/小区$/, '')
        //     return {
        //       title: item.BusinessCircle,
        //       value: item.BusinessCircle,
        //       disabled: item.IsHave === 0
        //     }
        //   })
        //   Data.sort((a, b) => {
        //     return Number(a.disabled) - Number(b.disabled)
        //   })
        //   Data.unshift({
        //     title: '全部',
        //     value: '',
        //     disabled: false
        //   })
        //   this.circleData[cityCode + ''] = Data
        //   this.setState({
        //     circleList: Data
        //   })
        // }).finally(() => {
        //   this.setState({
        //     circleLoading: false
        //   })
        // })
      }
    }
  }

  renderContent() {
    const renderItem = ({item}) => {
      return <ListItem item={item} form={this.state.form}/>
    }
    return (
        <List
            request={SelectShareHouseList}
            form={this.state.form}
            setForm={form => this.setState({form})}
            listKey={'AgentShareHouseList'}
            renderItem={renderItem}
            requestFirst={false}
        />
    )
  }

  onSelectMenu(index, subindex, data) {
    console.log(index, subindex, data)
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
            case 2:
              form.IsHaveImage = item.data.value === '全部' ? 0 : item.data.value
              break
            case 3:
              form.HouseStatus = item.data.value
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

  cityClick(item, index) {
    if(this.state.circleLoading) return
    this.state.form.CityCode = item.value
    this.cityName = item.title
    // this.state.form.BusinessCircle = ''
    this.state.form.Street = ''
    this.setState({
      circleList: [],
      circleIndex: -1,
      cityIndex: index,
    })
    this.getAreaCircle(item.value, index)
  }

  circleClick(item, index, close, title) {
    if (item.disabled) return
    close()
    title(item.value || this.cityName)
    this.state.form.parm.page = 1
    // this.state.form.BusinessCircle = item.value
    this.state.form.Street = item.value
    this.setState({
      circleIndex: index,
      form: {...this.state.form}
    })
  }

  render() {
    return (
        <View style={Container}>
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

          <AddShopListSelector
              ref={(ref) => {
                this.searchRef = ref
              }}
              type={3}
              selectShop={3}
              config={this.state.listConfig}
              onSelectMenu={this.onSelectMenu.bind(this)}
              renderContent={this.renderContent.bind(this)}
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
                    <ContainerLoading visible={this.state.circleLoading}/>
                    <ScrollView style={styles.selectBoxScroll} ref={(ref) => {
                      this.circleRef = ref
                    }}>
                      {this.state.circleList.map((item, index) => {
                        return (<TouchableOpacity style={styles.selectBoxItem} activeOpacity={item.disabled ? 1 : .2}
                                                  key={index} onPress={() => {
                          this.circleClick(item, index, close, title)
                        }}>
                          <Text
                              style={[
                                styles.selectBoxItemText,
                                this.state.circleIndex === index ? styles.selectBoxItemTextActive : null,
                                index === 0 ? styles.selectBoxItemTextBold : null,
                                item.disabled ? styles.selectBoxItemTextDisabled : null
                              ]}>{item.title}</Text>
                        </TouchableOpacity>)
                      })}
                    </ScrollView>
                  </View>
                </View>
              }}
          />
        </View>
    )
  }
}

const mapToProps = state => {
  return {
    shopList: state.account.ShopListSelector2
  }
}
export default connect(mapToProps)(MyHouseList)
