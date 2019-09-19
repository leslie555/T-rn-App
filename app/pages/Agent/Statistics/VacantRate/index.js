import React from "react"
import { Text, View, ScrollView, TouchableOpacity } from "react-native"
import Header from "../../../../components/Header"
import BarChart from "../Components/BarChart"
import styles from "./style"
import {
  GetStatisticsVacantHeadData,
  GetStatisticsVacantRateData,
  // GetHouseStatisticsWholeCountData,
  // GetHouseStatisticsCloseCountData,
} from "../../../../api/report"

export default class VacantRate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // form: {
      //   FullID: ""
      // },
      VacancyCount: "",
      VacancyRate: "",
      AllVacancyCount: "",
      AllVacancyRate: "",
      PartVacancyCount: "",
      PartVacancyRate: "",
      // 近6月空置率(DateZ:整租, DateH合租)
      DateZ: [0, 0, 0, 0, 0, 0],
      DateH: [0, 0, 0, 0, 0, 0],
      Head: ["6月", "5月", "4月", "3月", "2月", "1月"],
      // 整租空置
      // WholeCount: [0, 0, 0, 0, 0, 0],
      // wholeCountNum: 0, //整租空置间数
      //合租空置
      // PartCount: [0, 0, 0, 0, 0, 0],
      // partCountNum: 0, //合租空置间数
    }
    // this.vacantDays = [
    //   "0-7天",
    //   "8-15天",
    //   "16-20天",
    //   "21-30天",
    //   "31-50天",
    //   "50天以上"
    // ];
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    GetStatisticsVacantHeadData()
      .then(({ Data }) => {
        if (
          Object.prototype.toString.call(Data) === "[object Object]" &&
          Object.keys(Data).length !== 0
        ) {
          const {
            VacancyCount,
            VacancyRate,
            AllVacancyCount,
            AllVacancyRate,
            PartVacancyCount,
            PartVacancyRate,
          } = Data
          this.setState({
            VacancyCount,
            VacancyRate,
            AllVacancyCount,
            AllVacancyRate,
            PartVacancyCount,
            PartVacancyRate,
          })
        }
      })
      .catch(() => {
        console.log("失败")
      })
    GetStatisticsVacantRateData()
      .then(({ Data }) => {
        if (
          Object.prototype.toString.call(Data) === "[object Object]" &&
          Object.keys(Data).length !== 0
        ) {
          const { DateZ, DateH, Head } = Data
          Head.reverse()
          this.setState({
            DateZ,
            DateH,
            Head,
          })
        }
      })
      .catch(() => {
        console.log("失败")
      })
    // GetHouseStatisticsWholeCountData().then(res => {
    //   if (res.Data && res.Data.length !== 0) {
    //     const WholeCount = res.Data;
    //     const wholeCountNum = WholeCount.reduce((prev, next) => {
    //       return prev + next;
    //     });
    //     this.setState({
    //       WholeCount,
    //       wholeCountNum
    //     });
    //   }
    // }).catch(() => {
    //   console.log('失败')
    // });
    // GetHouseStatisticsCloseCountData().then(res => {
    //   if (res.Data && res.Data.length !== 0) {
    //     const PartCount = res.Data;
    //     const partCountNum = PartCount.reduce((prev, next) => {
    //       return prev + next;
    //     });
    //     this.setState({
    //       PartCount,
    //       partCountNum
    //     });
    //   }
    // }).catch(() => {
    //   console.log('失败')
    // });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title="空置率" />
        <ScrollView>
          <View style={styles.top}>
            <View style={styles.top_vacant}>
              <View style={styles.top_vacant_rate}>
                <Text style={styles.top_data_text}>
                  {`${this.state.VacancyRate}%`}
                </Text>
                <Text style={styles.top_title_text}>空置率</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AgentVacantHouseList", {
                    RentType: 0,
                    Isrealtime: 0,
                  })
                }}
                style={styles.top_vacant_rate}
              >
                <Text style={styles.top_data_text}>
                  {this.state.VacancyCount}
                </Text>
                <Text style={styles.top_title_text}>空置</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.top_vacant}>
              <View style={styles.top_vacant_rate}>
                <Text style={styles.top_data_text}>{`${
                  this.state.AllVacancyRate
                }%`}</Text>
                <Text style={styles.top_title_text}>整租空置率</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AgentVacantHouseList", {
                    RentType: 1,
                    Isrealtime: 0,
                  })
                }}
                style={styles.top_vacant_rate}
              >
                <Text style={styles.top_data_text}>
                  {this.state.AllVacancyCount}
                </Text>
                <Text style={styles.top_title_text}>整租空置</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.top_vacant}>
              <View style={styles.top_vacant_rate}>
                <Text style={styles.top_data_text}>{`${
                  this.state.PartVacancyRate
                }%`}</Text>
                <Text style={styles.top_title_text}>合租空置率</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AgentVacantHouseList", {
                    RentType: 2,
                    Isrealtime: 0,
                  })
                }}
                style={styles.top_vacant_rate}
              >
                <Text style={styles.top_data_text}>
                  {this.state.PartVacancyCount}
                </Text>
                <Text style={styles.top_title_text}>合租空置</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rect} />
          <BarChart
            title="近6月整租空置率"
            unit="%"
            xAxisData={this.state.Head}
            data={this.state.DateZ}
            color={"#84ccc9"}
          />
          <View style={styles.rect} />
          <BarChart
            title="近6月合租空置率"
            unit="%"
            xAxisData={this.state.Head}
            data={this.state.DateH}
            color={"#88abda"}
          />
          {/* <View style={styles.rect} /> */}
          {/* <BarChart
            title="整租"
            unit="套"
            xAxisData={this.vacantDays}
            data={this.state.WholeCount}
            color={"#75b1f2"}
            route={"AgentVacantHouseList"}
            view={
              <View style={styles.count_con}>
                <Text style={styles.count_con_text}> [空置</Text>
                <Text style={[styles.count_con_text, styles.count_con_num]}>
                  {this.state.wholeCountNum}
                </Text>
                <Text style={styles.count_con_text}>间]</Text>
              </View>
            }
            routeParm={{ RentType: 1, Isrealtime: 1, }}
          />
          <View style={styles.rect} /> */}
          {/* <BarChart
            title="合租"
            unit="间"
            xAxisData={this.vacantDays}
            data={this.state.PartCount}
            color={"#cce198"}
            route={"AgentVacantHouseList"}
            view={
              <View style={styles.count_con}>
                <Text style={styles.count_con_text}> [空置</Text>
                <Text style={[styles.count_con_text, styles.count_con_num]}>
                  {this.state.partCountNum}
                </Text>
                <Text style={styles.count_con_text}>间]</Text>
              </View>
            }
            routeParm={{ RentType: 2, Isrealtime: 1, }}
          /> */}
        </ScrollView>
      </View>
    )
  }
}
