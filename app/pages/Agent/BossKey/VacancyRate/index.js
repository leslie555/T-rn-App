import React from "react"
import { Text, View, ScrollView, TouchableOpacity } from "react-native"
import { Header, FullModal, PickerAreaStatement, BossKeyHeader } from "../../../../components"
import { BarChart } from "../../../../components/Charts"

// import BarChart from "../Components/BarChart"
import styles from "./style"
import { BoosKeyVacancyReportHead, BoosKeyVacancyReport } from '../../../../api/bossKey'
export default class VacantRateOne extends React.Component {
  constructor(props) {
    super(props)
    CityCodeVlaue = '5101XX'
    this.state = {
      loadingVisible: false,
      AllVacancyCount: "",
      AllVacancyVate: "",
      HVacancyCount: "",
      HVacancyVate: "",
      ZVacancyCount: "",
      ZVacancyVate: "",
      // 近6月空置率(ZhengArr:整租, HeArr合租)
      ZhengArrRate: [0, 0, 0, 0, 0, 0],
      HeArrRate: [0, 0, 0, 0, 0, 0],
      HeArr: [0, 0, 0, 0, 0, 0],
      ZhengArr: [0, 0, 0, 0, 0, 0],
      FullID: '',
      CityCode: '5101XX',
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchVacancyHead = () => {
    var obj = {
      CityCode: this.state.CityCode,
      QueryFullID: this.state.FullID
    }
    return BoosKeyVacancyReportHead(obj).then(({ Data }) => {
      if (
        Object.prototype.toString.call(Data) === "[object Object]" &&
        Object.keys(Data).length !== 0
      ) {
        return Data
      }
    })
  }
  
  fetchVacancyReportZ = () => {
    var obj = {
      parm: {
        page: 1,
        size: 6
      },
      CityCode: this.state.CityCode,
      QueryFullID: this.state.FullID,
      RentType: 1
    }
    return BoosKeyVacancyReport(obj).then((res) => {
      const Data = res && res.Data
      const ZhengArr = []
      const ZhengArrRate = []
      Data.rows.map((item) => {
        ZhengArr.push(item.Name)
        ZhengArrRate.push(item.VacancyValue)
      })
      return { ZhengArr, ZhengArrRate }
    }) 
  }

  fetchVacancyReportH = () => {
    var obj = {
      parm: {
        page: 1,
        size: 6
      },
      CityCode: this.state.CityCode,
      QueryFullID: this.state.FullID,
      RentType: 2
    }
    return BoosKeyVacancyReport(obj).then((res) => {
      const Data = res && res.Data
      const HeArr = []
      const HeArrRate = []
      Data.rows.map((item) => {
        HeArr.push(item.Name)
        HeArrRate.push(item.VacancyValue)
      })
      return { HeArr, HeArrRate }
    })
  }
  
  fetchData = () => {
    this.setState({
      loadingVisible: true
    })
    Promise.all([this.fetchVacancyHead(), this.fetchVacancyReportZ(), this.fetchVacancyReportH()]).then((res) => {
      const { 
          AllVacancyCount,
          AllVacancyVate,
          ZVacancyCount,
          ZVacancyVate,
          HVacancyCount,
          HVacancyVate        
      } = res[0]
      const { ZhengArr, ZhengArrRate } = res[1]
      const { HeArr, HeArrRate } = res[2]
      this.setState({
        AllVacancyCount,
        AllVacancyVate,
        ZVacancyCount,
        ZVacancyVate,
        HVacancyCount,
        HVacancyVate,
        ZhengArr,
        ZhengArrRate,
        HeArr,
        HeArrRate,
        loadingVisible: false
      })
    }).catch(() => {
      this.setState({
        loadingVisible: false
      })
    })
  }
  getPickerData(index, subindex, data, num) {
    if(index === 0){
      if(num === 1 && this.state.FullID !== ''){
          this.setState({
            CityCode: data.value,
            FullID: ''
          })
      }else if(num !== 1){
          this.setState({
            CityCode: data.value,
            FullID: ''
          }, () => {
            this.fetchData()
          })
      }else if(num === 1){
        this.setState({
          CityCode: data.value,
          FullID: ''
        })
      }
    } else if (index === 1) {
          // 判断是不是成都的门店
      // if(this.state.CityCode.indexOf('510') !== -1){
      //   cd = '5101XX'
      // }else{
      //   cd = '5001XX'
      // }
      if (data && data.KeyID === 'One') data["FullID"] = ''
      this.state.CityCode = ''
      this.setState({
        FullID: data.FullID,
        CityCode: this.state.CityCode
      }, () => {
        this.fetchData()
      })
    }
  }
  renderItemAll() {
    return (
      <View style={{ flex: 1, zIndex: -2 }}>
        <ScrollView>
          <View style={styles.top}>
            <View style={styles.top_vacant}>
              <View style={styles.top_vacant_rate}>
                <Text style={styles.top_data_text}>
                  {`${this.state.AllVacancyVate && (this.state.AllVacancyVate + '%')}`}
                </Text>
                <Text style={styles.top_title_text}>空置率</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("BossShareHouseList", {
                    VacancyType: 0,
                    CityCode: this.state.CityCode,
                    FullID: this.state.FullID
                  })
                }}
                style={styles.top_vacant_rate}
              >
                <Text style={styles.top_data_text}>
                  {this.state.AllVacancyCount}
                </Text>
                <Text style={styles.top_title_text}>空置</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.top_vacant}>
              <View style={styles.top_vacant_rate}>
                <Text style={styles.top_data_text}>{`${
                  this.state.ZVacancyVate && (this.state.ZVacancyVate + '%')
                  }`}</Text>
                <Text style={styles.top_title_text}>整租空置率</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("BossShareHouseList", {
                    VacancyType: 1,
                    CityCode: this.state.CityCode,
                    FullID: this.state.FullID
                  })
                }}
                style={styles.top_vacant_rate}
              >
                <Text style={styles.top_data_text}>
                  {this.state.ZVacancyCount}
                </Text>
                <Text style={styles.top_title_text}>整租空置</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.top_vacant}>
              <View style={styles.top_vacant_rate}>
                <Text style={styles.top_data_text}>{`${
                  this.state.HVacancyVate && (this.state.HVacancyVate + '%')
                  }`}</Text>
                <Text style={styles.top_title_text}>合租空置率</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("BossShareHouseList", {
                    VacancyType: 2,
                    CityCode: this.state.CityCode,
                    FullID: this.state.FullID
                  })
                }}
                style={styles.top_vacant_rate}
              >
                <Text style={styles.top_data_text}>
                  {this.state.HVacancyCount}
                </Text>
                <Text style={styles.top_title_text}>合租空置</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rect} />
          <BarChart
            title="区域空置率-整租"
            unit="%"
            xAxisData={this.state.ZhengArr}
            data={this.state.ZhengArrRate}
            color={"#84ccc9"}
          />
          <View style={styles.rect} />
          <BarChart
            title="区域空置率-合租"
            unit="%"
            xAxisData={this.state.HeArr}
            data={this.state.HeArrRate}
            color={"#88abda"}
          />
        </ScrollView>
      </View>
    )
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title="空置率" />
        <FullModal visible={this.state.loadingVisible} type={2} />
        <BossKeyHeader
          renderItem = {this.renderItemAll.bind(this)}
            // 1 报表  2城市区域  3已收 4已付 
          type={[2]}
          selectShop={2}
          getPickerData={(index, subindex, data, num) => {
              this.getPickerData(index, subindex, data, num)
          }}
        />
      </View>
    )
  }
}
