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
  PickerAreaStatement,
  SelectDateBanner,
  FullModal,
  BossKeyHeader,
} from '../../../../components'
import {
  DisplayStyle,
  CommonColor,
  Container,
} from '../../../../styles/commonStyles'
import { BarChart } from '../../../../components/Charts'
import {
  GetBossKeyOutBillingHead,
  GetBossKeyOutBillingReportDay,
  GetBossKeyOutBillingReportMonth,
} from '../../../../api/bossKey'
import { dateFormat } from '../../../../utils/dateFormat'

class BossOutBilling extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingVisible: true,
      parm: {
        CityCode: '',
        ReportTimeType: 0,
        StartTime: this.initDate(),
        FullID: '',
      },
      ElecCount: null,
      PaperCount: null,
      OutRoomCount: null,
      daysXAxisData: [], // 近7天报表横坐标数据
      daysData: [], // 近7天报表统计数据
      monthsXAxisData: [], // 近6个月报表横坐标数据
      monthsData: [], // 近6个月报表统计数据
    }
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
    this.setState({ loadingVisible: true })
    Promise.all([this.fetchHeadData(), this.fetchReportDataDay(), this.fetchReportDataMonth()])
      .then(() => {
        this.setState({ loadingVisible: false })
        console.log('state', this.state)
      })
      .catch(err => {
        console.log(err)
        this.setState({ loadingVisible: false })
      })
  }

  // 获取头部数据request:接口 params:接口参数
  fetchHeadData = (
    request = GetBossKeyOutBillingHead,
    params = this.state.parm
  ) => {
    return request(params)
      .then(({ Data }) => {
        if (Data) {
          const { ElecCount, PaperCount, OutRoomCount } = Data
          this.setState({
            ElecCount,
            PaperCount,
            OutRoomCount
          })
        } else {
          this.setState({
            loadingVisible: false,
          })
        }
      })
  }

  //获取报表数据7天 request:接口 params:接口参数
  fetchReportDataDay = (
    request = GetBossKeyOutBillingReportDay,
    params = {
      CityCode: this.state.parm.CityCode,
      FullID: this.state.parm.FullID,
    }
  ) => {
    return request(params)
      .then(({ Data }) => {
        if (Data) {
          const daysXAxisData = [], daysData = []
          Data.forEach(obj => {
            daysXAxisData.push(obj.Date)
            daysData.push(obj.Num)
          })
          this.setState({
            daysXAxisData,
            daysData
          })
        }
      })
  }
  // 获取报表数据6月 request:接口 params:接口参数
  fetchReportDataMonth = (
    request = GetBossKeyOutBillingReportMonth,
    params = {
      CityCode: this.state.parm.CityCode,
      FullID: this.state.parm.FullID,
    }
  ) => {
    return request(params)
      .then(({ Data }) => {
        if (Data) {
          const monthsXAxisData = [], monthsData = []
          Data.forEach(obj => {
            monthsXAxisData.push(obj.Date)
            monthsData.push(obj.Num)
          })
          this.setState({
            monthsXAxisData,
            monthsData
          })
        }
      })
  }

  getPickerData = (index, subIndex, data, obj) => {
    if (index === 0) {
      this.setState({
        type: data['value'],
      })
    } else if (index === 1 && obj !== 1) {
      this.state.parm.CityCode = data['value']
      this.state.parm.FullID = ''
      this.fetchData()
    } else if (index === 2) {
      if (data && data.KeyID === 'One') data['FullID'] = ''
      this.state.parm.FullID = data['FullID']
      this.state.parm.CityCode = ''
      this.fetchData()
    } else {
      return
    }
  }

  handleChange = (data, type) => {
    if (type === 'date') {
      this.state.parm.StartTime = dateFormat(data)
      this.state.parm.ReportTimeType = 0
    } else if (type === 'month') {
      this.state.parm.StartTime = dateFormat(data, 'yyyy-MM')
      this.state.parm.ReportTimeType = 1
    } else {
      this.state.parm.StartTime = dateFormat(data, 'yyyy-MM-dd')
      this.state.parm.ReportTimeType = 2
    }
    this.fetchHeadData()
  }

  // 跳转租客合同列表 typeKey:2代表租客
  goPgae = (typeKey = 2, ContractType) => {
    const routeName = 'BossOwnerTenantContractList'
    const { navigate } = this.props.navigation
    const ReportTimeType = this.state.parm.ReportTimeType
    navigate(routeName, {
      typeKey,
      ContractType,
      StartTime: this.state.parm.StartTime,
      CityCode: this.state.parm.CityCode,
      ReportTimeType,
      FullID: this.state.parm.FullID,
    })
  }

  renderItem = () => {
    return (
      <View style={{ zIndex: -2, flex: 1 }}>
        <SelectDateBanner
          type={this.state.type}
          handleChange={this.handleChange}
        />
        <ScrollView>
          <View style={styles.head}>
            <TouchableOpacity
              style={styles.head_top}
              onPress={() => {
                this.goPgae(2, 0)
              }}
            >
              <Text style={styles.number}>{this.state.OutRoomCount}</Text>
              <Text style={styles.head_text}>合计</Text>
            </TouchableOpacity>
            <View style={styles.head_bottom}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  this.goPgae(2, 1)
                }}
              >
                <Text style={styles.number}>{this.state.ElecCount}</Text>
                <Text style={[styles.head_text]}>电子合同</Text>
              </TouchableOpacity>
              <View
                style={{ height: 25, width: 1, backgroundColor: '#dddddd' }}
              ></View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  this.goPgae(2, 2)
                }}
              >
                <Text style={styles.number}>{this.state.PaperCount}</Text>
                <Text style={[styles.head_text]}>纸质合同</Text>
              </TouchableOpacity>
            </View>
          </View>
          <BarChart
            title="近7天出单"
            unit="个"
            xAxisData={this.state.daysXAxisData}
            data={this.state.daysData}
            color={'#84ccc9'}
          />
          <View style={{ marginTop: 10 }}></View>
          <BarChart
            title="近6月出单"
            unit="个"
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
        <Header title="出单" />
        <FullModal visible={this.state.loadingVisible} type={2}></FullModal>
        <BossKeyHeader
          getPickerData={(index, subIndex, data, obj) =>
            this.getPickerData(index, subIndex, data, obj)
          }
          type={[1, 2]}
          selectShop={3}
          renderItem={this.renderItem}
        ></BossKeyHeader>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: CommonColor.color_white,
    margin: 10,
    borderRadius: 5,
  },
  head_top: {
    ...DisplayStyle('column', 'center', 'center'),
    paddingVertical: 5,
  },
  head_bottom: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    borderTopWidth: 1,
    borderColor: '#dddddd',
    paddingVertical: 5,
  },
  head_text: {
    textAlign: 'center',
  },
  number: {
    color: CommonColor.color_primary,
    fontSize: 18,
    textAlign: 'center',
  },
})
export default BossOutBilling
