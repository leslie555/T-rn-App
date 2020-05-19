import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import {
  Header,
  SelectDateBanner,
  FullModal,
  BossKeyHeader,
} from '../../../../components'
import {
  DisplayStyle,
  CommonColor,
  Container,
} from '../../../../styles/commonStyles'
import {
  GetBossKeyRentRateHead,
  // GetBossKeyRentRateMonthsReport,
  QueryRentRateSevenDaysChart,
  QueryRentRateSixMonthsChart
} from '../../../../api/bossKey'
import { BarChart } from '../../../../components/Charts'
import { dateFormat } from '../../../../utils/dateFormat'

class BossRentRate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingVisible: false,
      type: 'date',
      parm: {
        CityCode: '5101XX',
        ReportTimeType: 0,
        TimerShaft: this.initDate(),
        // EndTime: "",
        FullID: '',
      },
      RentRateLB: '', // 收租率
      PaidSetNum: '', //已收
      UnPaidSetNum: '', // 未收
      daysXAxisData: [], // 近7天报表横坐标数据
      daysData: [], // 近7天报表统计数据
      monthsXAxisData: [], // 近6个月报表横坐标数据
      monthsData: [], // 近6个月报表统计数据
    }
    this.routeParm = this.initRouteParm()
    this.zoneTitle = '成都'
  }

  componentDidMount() {
    this.fetchData()
  }

  initRouteParm = () => {
    return [
      {
        id: 1,
        value: 'date',
        subIndex: 0,
        title: '日报表',
        time: this.initDate(),
      },
      {
        id: 2,
        value: '5101XX',
        subIndex: -1,
        title: '全成都',
        obj: { index: 1, subIndex: 0, data: '成都' },
      },
      { id: 4, value: 0, title: '状态' },
    ]
  }

  // 初始化日期date Y是年 M是月 D是日
  initDate() {
    let Y = new Date().getFullYear()
    let M = new Date().getMonth() + 1
    if (M < 10) {
      M = '0' + M
    }
    let D = new Date().getDate()
    if (D < 10) {
      D = '0' + D
    }
    const StartTime = Y + '-' + M + '-' + D
    return StartTime
  }

  fetchData() {
    this.setState({
      loadingVisible: true,
    })
    Promise.all([this.fetchHeadData(), this.fetchReportData(1), this.fetchReportData(2)])
      .then(() => {
        this.setState({
          loadingVisible: false,
        })
      })
      .catch(() => {
        this.setState({
          loadingVisible: false,
        })
      })
  }

  // 获取头部数据request:接口 params:接口参数
  fetchHeadData = (
    request = GetBossKeyRentRateHead,
    params = this.state.parm
  ) => {
    return request(params)
      .then(({ Data }) => {
        if (this.isObject(Data)) {
          Data['RentRateLB'] += '%' 
          const { RentRateLB, PaidSetNum, UnPaidSetNum } = Data
          this.setState({
            RentRateLB,
            PaidSetNum,
            UnPaidSetNum,
          })
        }
      })
  }

  fetchReportData(num) {
    let obj = {
      TimerShaft: this.state.parm.TimerShaft,
      ReportTimeType: 0,
      FullID: this.state.parm.FullID,
      CityCode: this.state.parm.CityCode,
      ViewState: 1
    }
    const fn = num === 1 ? QueryRentRateSevenDaysChart : QueryRentRateSixMonthsChart
    fn(obj).then(({ Data }) => {
      if (num === 1) {
        const daysXAxisData = [], daysData = []
        Data.forEach(obj => {
          daysXAxisData.push(obj['Date'])
          daysData.push(obj['Num'])
        })
        this.setState({
          daysXAxisData,
          daysData
        })      
      } else if (num === 2) {
        const monthsXAxisData = [], monthsData = []        
        Data.forEach(obj => {
          monthsXAxisData.push(obj['Date'])
          monthsData.push(obj['Num'])
        })
        this.setState({
          monthsXAxisData,
          monthsData
        })        
      }
    })
  }

  fetchReportDataS() {
    let obj = {
      TimerShaft: this.state.parm.TimerShaft,
      ReportTimeType: 0,
      FullID: this.state.parm.FullID,
      CityCode: this.state.parm.CityCode,
      // 1:单页面
      ViewState: 1
    }
    QueryRentRateSixMonthsChart(obj).then(({ Data }) => {
      console.log(Data)
      const monthsXAxisData = [],monthsData = []
      Data.forEach(obj => {
        monthsXAxisData.push(obj['Date'])
        monthsData.push(obj['Num'])
      })
      this.setState({
        daysXAxisData,
        daysData
      })      
    })
  }
  
  // 获取报表数据request:接口, params接口参数
  // fetchReportData = (
  //   request = GetBossKeyRentRateMonthsReport,
  //   params = {
  //     CityCode: this.state.parm.CityCode,
  //     FullID: this.state.parm.FullID,
  //   }
  // ) => {
  //   return request(params)
  //     .then(({ Data }) => {
  //       if (this.isObject(Data)) {
  //         const daysXAxisData = [],
  //           daysData = [],
  //           monthsXAxisData = [],
  //           monthsData = []
  //         Data.NearlySevenDays.forEach(obj => {
  //           daysXAxisData.push(obj['Date'])
  //           daysData.push(obj['Rate'])
  //         })
  //         Data.NearJune.forEach(obj => {
  //           monthsXAxisData.push(obj['Date'])
  //           monthsData.push(obj['Rate'])
  //         })
  //         this.setState({
  //           daysXAxisData,
  //           daysData,
  //           monthsXAxisData,
  //           monthsData,
  //         })
  //       }
  //     })
  // }

  //判断接口返回数据的类型是否是Object并且不是空对象
  isObject = data => {
    return (
      Object.prototype.toString.call(data) === '[object Object]' &&
      Object.keys(data).length !== 0
    )
  }

  //跳转应收页面
  goPage(state) {
    const { navigate } = this.props.navigation
    const label = state === 0 ? '状态' : state === 1 ? '已收' : '未收'
    this.routeParm[2].value = state
    this.routeParm[2].title = label
    navigate('BossReceivable', {
      returnData: this.routeParm,
    })
  }

  getPickerData = (index, subIndex, data, obj) => {
    if (index === 0) {
      this.setState({
        type: data['value'],
      })
    } else if (index === 1 && obj !== 1) {
      this.state.parm.FullID = ''
      this.state.parm.CityCode = data['value']
      this.routeParm[1].value = data['value']
      this.routeParm[1].title = data['title']
      this.routeParm[1].subIndex = subIndex
      this.routeParm[1].obj = obj
      this.fetchData()
    } else if (index === 1 && obj === 1) {
      this.routeParm[1].value = data.value
      this.zoneTitle = data.title
    } else if (index === 2) {
      if (data && data.KeyID === 'One') data['FullID'] = ''
      this.state.parm.FullID = data['FullID']
      this.state.parm.CityCode = ''
      this.routeParm[1].subIndex = -1
      if (this.zoneTitle !== '成都') {
        this.routeParm[1].title = '全重庆'
      } else {
        this.routeParm[1].title = '全成都'
      }
      this.fetchData()
    } else {
      return
    }
  }

  updateData = (date, ReportTimeType, type, label) => {
    this.state.parm.TimerShaft = date
    this.state.parm.ReportTimeType = ReportTimeType
    this.routeParm[0].value = type
    this.routeParm[0].title = label
    this.routeParm[0].time = date
    this.routeParm[0].subIndex = ReportTimeType
  }

  handleChange = (data, type) => {
    if (type === 'date') {
      const date = dateFormat(data)
      this.updateData(date, 0, type, '日报表')
    } else if (type === 'month') {
      const date = dateFormat(data, 'yyyy-MM')
      this.updateData(date, 1, type, '月报表')
    } else {
      const date = dateFormat(data)
      this.updateData(date, 2, type, '年报表')
      this.routeParm[0].time = dateFormat(data, 'yyyy-MM')
    }
    this.fetchHeadData()
  }

  setHeadList = () => {
    return [
      {
        label: '收租率',
        value: this.state.RentRateLB,
        state: 0,
      },
      {
        label: '已收',
        value: this.state.PaidSetNum,
        state: 1,
      },
      {
        label: '未收',
        value: this.state.UnPaidSetNum,
        state: 2,
      },
    ]
  }

  renderItem = () => {
    const headList = this.setHeadList()
    return (
      <View style={{ zIndex: -2, flex: 1 }}>
        <SelectDateBanner
          type={this.state.type}
          handleChange={this.handleChange}
        />
        <ScrollView>
          <View style={styles.head}>
            {headList.map((item, index) => (
              <TouchableOpacity
                key={index + ''}
                style={styles.head_item}
                onPress={() => {
                  this.goPage(item.state)
                }}
                disabled={false}
              >
                <Text
                  style={[
                    styles.head_text,
                    { color: CommonColor.color_primary },
                    { fontSize: 18 },
                  ]}
                >
                  {item.value}
                  <Text style={{ fontSize: 15 }}>
                    {index !== 0 ? '套' : null}
                  </Text>
                </Text>
                <Text style={styles.head_text}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <BarChart
            title="近7天收租率"
            unit="%"
            xAxisData={this.state.daysXAxisData}
            data={this.state.daysData}
            color={'#84ccc9'}
          />
          <View style={{ marginTop: 10 }}></View>
          <BarChart
            title="近6月收租率"
            unit="%"
            xAxisData={this.state.monthsXAxisData}
            data={this.state.monthsData}
            color={'#88abda'}
          />
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <View style={Container}>
        <Header title="收租率" />
        <FullModal visible={this.state.loadingVisible} type={2} />
        <BossKeyHeader
          getPickerData={(index, subIndex, data, obj) =>
            this.getPickerData(index, subIndex, data, obj)
          }
          type={[1, 2]}
          selectShop={3}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    ...DisplayStyle('row', 'center', 'space-around'),
    marginVertical: 10,
    backgroundColor: CommonColor.color_white,
    paddingVertical: 10,
  },
  head_item: {
    ...DisplayStyle('column', 'center', 'center'),
  },
  head_text: {
    color: '#999',
  },
})

export default BossRentRate
