import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { BarChart } from '../../../../components/Charts'
import style from './style'
import { dateFormat } from '../../../../utils/dateFormat'
import {
  Header,
  BossKeyHeader,
  SelectDateBanner,
  FullModal
} from '../../../../components'
import {
  SelectBossDefault, // 违约数量
  SelectDefaultNearlySevenDay, // 近七天违约
  SelectDefaultNearlySixMonth // 近6月违约
} from '../../../../api/bossKey'
class Default extends Component {
  constructor(props) {
    super(props)
    this.state = {
      TenantDayCount: [],
      TenantDayDate: [],
      TenantMonthCount: [],
      TenantMonthDate: [],
      OwnerDayCount: [],
      OwnerDayDate: [],
      OwnerMonthCount: [],
      OwnerMonthDate: [],
      TenantDataDefault: {
        DefaultCount: '',
        DefaultIncome: ''
      },
      OwnerDataDefault: {
        DefaultCount: '',
        DefaultIncome: ''
      },
      selectReport: 'date',
      FullID: '',
      CityCode: '',
      loadingVisible: true,
      ReportTimeType: 0, // 0:日报表   1:月报表    2:年报表
      StartTime: dateFormat(new Date())
    }
  }

  // 获取违约租客 业主数据
  defaultData = () => {
    const { FullID, CityCode, ReportTimeType, StartTime } = this.state
    const reqParam = {
      FullID: FullID,
      CityCode: CityCode,
      ReportTimeType: ReportTimeType,
      StartTime: StartTime
    }
     return Promise.all([
      SelectBossDefault({...reqParam, ContractType: 1}),
      SelectBossDefault({...reqParam, ContractType: 0})
    ]).then(([owner, tenant]) => {
        const ownerData = owner.Data
        const tenData = tenant.Data
        if (ownerData && tenData) {
          this.setState({
            OwnerDataDefault: ownerData,
            TenantDataDefault: tenData
           })
        } else {
          this.setState({ loadingVisible: false})
        }
      }
    )
  }
  // 获取7天，6月数据
  get7DayOwner = () => {
    return SelectDefaultNearlySevenDay({
      CityCode: this.state.CityCode,
      FullID: this.state.FullID,
      ContractType: 1
    }).then(({ Data }) => {
      const numArr = [], dateArr = []
      Data.map(item => {
        numArr.push(item.Num)
        dateArr.push(this.filterDateArr(item.Date))
      })
      this.setState({
        OwnerDayCount: numArr,
        OwnerDayDate: dateArr
      })
    })
  }
  get7DayTen = () => {
    return SelectDefaultNearlySevenDay({
      CityCode: this.state.CityCode,
      FullID: this.state.FullID,
      ContractType: 0
    }).then(({ Data }) => {
      const numArr = [], dateArr = []
      Data.map(item => {
        numArr.push(item.Num)
        dateArr.push(this.filterDateArr(item.Date))
      })
      this.setState({
        TenantDayCount: numArr,
        TenantDayDate: dateArr
      })
    })
  }
    // 近6月违约业主
  get6MonthOwner = () => {
    return SelectDefaultNearlySixMonth({
      CityCode: this.state.CityCode,
      FullID: this.state.FullID,
      ContractType: 1
    }).then(({ Data }) => {
      const numArr = [], dateArr = []
      Data.map(item => {
        numArr.push(item.Num)
        dateArr.push(item.Date)
      })
      this.setState({
        OwnerMonthCount: numArr,
        OwnerMonthDate: dateArr
      })
    })
  }
    // 近6月违约租客
  get6MonthTen = () => {
    return SelectDefaultNearlySixMonth({
      CityCode: this.state.CityCode,
      FullID: this.state.FullID,
      ContractType: 0
    }).then(({ Data }) => {
      const numArr = [], dateArr = []
      Data.map(item => {
        numArr.push(item.Num)
        dateArr.push(item.Date)
      })
      this.setState({
        TenantMonthCount: numArr,
        TenantMonthDate: dateArr
      })
    })
  }

  fetchData = async() => {
    this.setState({ loadingVisible: true })
    try{
      await Promise.all([this.defaultData(), this.get7DayOwner(), this.get7DayTen(), this.get6MonthOwner(), this.get6MonthTen()]) 
      this.setState({ loadingVisible: false })
      console.log('state', this.state)
    } catch(err) {
      this.setState({ loadingVisible: false })
    }
  }

  filterDateArr(date) {
    return date
  }
  getRouter(parms) {
    const {
      typeKey,
      routerList,
      CityCode,
      ReportTimeType,
      StartTime,
      ContractType,
      InOrOutType,
      FullID
    } = parms
    this.props.navigation.navigate(`${routerList}`, {
      typeKey,
      CityCode,
      ReportTimeType,
      StartTime,
      ContractType,
      InOrOutType,
      FullID
    })
  }
  handleChangeDate(date, type) {
    this.setState({ StartTime: dateFormat(date) }, () => {this.defaultData()})
  }
  getPickerData(index, subindex, data, num) {
    if (index === 0) {
      const ReportTimeType = subindex
      this.setState({
          ReportTimeType: ReportTimeType,
          StartTime: this.state.StartTime,
          selectReport: data.value
        }, () => { this.fetchData() })
    } else if (index === 1) {
      debugger
      if (typeof num === 'object' && num.data) {
        this.setState({ FullID: '', CityCode: data.value }, () => { this.fetchData() })
      } else {
        return false
      }
    } else if(index === 2) {
      debugger
      this.setState({ FullID: data.FullID, CityCode: '' }, () => { this.fetchData() })
    }
  }
  renderItemAll = () => {
    const { TenantDataDefault, OwnerDataDefault } = this.state
    return (
      <View style={style.main_list}>
        <SelectDateBanner
          type={this.state.selectReport}
          handleChange={this.handleChangeDate.bind(this)}
        />
        <ScrollView>
          <View style={style.container}>
            <View style={style.mr}>
              <View style={style.income_count}>
                <View style={style.text_border}>
                  <View
                    // onPress={this.getRouter.bind(this, {
                    //   routerList: 'BossIncomeExpendList',
                    //   InOrOutType: 1,
                    //   CityCode: this.state.CityCode,
                    //   FullID: this.state.FullID,
                    //   ContractType: 1,
                    //   StartTime: this.state.StartTime,
                    //   ReportTimeType: this.state.ReportTimeType
                    // })}
                  >
                    <View style={style.all_list}>
                      <Text style={style.text_color}>
                        {' '}
                        {`${TenantDataDefault.DefaultCount || '0'}件`}
                      </Text>
                      <Text>租客违约合计</Text>
                    </View>
                  </View>
                </View>
                <View style={style.text_border}>
                <View
                    // onPress={this.getRouter.bind(this, {
                    //   routerList: 'BossIncomeExpendList',
                    //   InOrOutType: 1,
                    //   CityCode: this.state.CityCode,
                    //   FullID: this.state.FullID,
                    //   ContractType: 0,
                    //   StartTime: this.state.StartTime,
                    //   ReportTimeType: this.state.ReportTimeType
                    // })}
                  >
                    <View style={style.all_list}>
                      <Text
                        style={style.text_color}
                      >{`${TenantDataDefault.DefaultReceive || '0'}元`}</Text>
                      <Text>租客违约收入</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.rect} />
            <View style={style.mr}>
              <View style={style.income_count}>
                <View style={style.text_border}>
                  <View
                    // onPress={this.getRouter.bind(this, {
                    //   routerList: 'BossIncomeExpendList',
                    //   InOrOutType: 1,
                    //   CityCode: this.state.CityCode,
                    //   FullID: this.state.FullID,
                    //   ContractType: 1,
                    //   StartTime: this.state.StartTime,
                    //   ReportTimeType: this.state.ReportTimeType
                    // })}
                  >
                    <View style={style.all_list}>
                      <Text style={style.text_color}>
                        {' '}
                        {`${OwnerDataDefault.DefaultCount || '0'}件`}
                      </Text>
                      <Text>业主违约合计</Text>
                    </View>
                  </View>
                </View>
                <View style={style.text_border}>
                <View
                    // onPress={this.getRouter.bind(this, {
                    //   routerList: 'BossIncomeExpendList',
                    //   InOrOutType: 1,
                    //   CityCode: this.state.CityCode,
                    //   FullID: this.state.FullID,
                    //   ContractType: 0,
                    //   StartTime: this.state.StartTime,
                    //   ReportTimeType: this.state.ReportTimeType
                    // })}
                  >
                    <View style={style.all_list}>
                      <Text
                        style={style.text_color}
                      >{`${OwnerDataDefault.DefaultReceive || '0'}元`}</Text>
                      <Text>业主违约收入</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.rect} />
            <BarChart
              title="近7天租客违约"
              unit="个"
              xAxisData={this.state.TenantDayDate}
              data={this.state.TenantDayCount}
              color={'rgb(132,204,201)'}
            />
            <View style={style.rect} />
            <BarChart
              title="近6月租客违约"
              unit="个"
              xAxisData={this.state.TenantMonthDate}
              data={this.state.TenantMonthCount}
              color={'rgb(137,171,219)'}
            />
            <View style={style.rect} />
            <BarChart
              title="近7天业主违约"
              unit="个"
              xAxisData={this.state.OwnerDayDate}
              data={this.state.OwnerDayCount}
              color={'rgb(132,204,201)'}
            />
            <View style={style.rect} />
            <BarChart
              title="近6月业主违约"
              unit="个"
              xAxisData={this.state.OwnerMonthDate}
              data={this.state.OwnerMonthCount}
              color={'rgb(137,171,219)'}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
  render() {
    return (
      <View style={style.fl}>
        <FullModal visible={this.state.loadingVisible} type={2} />
        <Header title={'违约'} />
        <BossKeyHeader
          renderItem={this.renderItemAll}
          type={[1,2]}
          selectShop={3}
          getPickerData={(index, subindex, data, num) => {
            this.getPickerData(index, subindex, data, num)
          }}
        />
      </View>
    )
  }
}
export default Default
