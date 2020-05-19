import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { Header, PickerAreaStatement, FullModal, BossKeyHeader } from "../../../../components";
import { BarChart } from "../../../../components/Charts";
import { BoosKeyAveragePriceyReport } from "../../../../api/bossKey";
import style from "./style";
class AveragePrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ZAvg: "",
      HAvg: "",
      XAxis: [],
      SixZ: [],
      SixH: [],
      CityCode: "5101XX",
      loadingVisible: false
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    this.setState({
      loadingVisible: true
    })
    BoosKeyAveragePriceyReport({
      CityCode: this.state.CityCode
    }).then(({ Data }) => {
      const { ZAvg, HAvg, SixZ, SixH, XAxis } = Data;
      this.setState({
        ZAvg,
        HAvg,
        SixZ,
        SixH,
        XAxis
      });
      console.log("平均差价", Data);
    }).finally(()=> {
      this.setState({
        loadingVisible: false
      })
    })
  }
  getPickerData(res) {
    const { data } = res;
    this.setState({
      CityCode: data.value
    });
    this.fetchData();
    console.log("res:", res);
  }
  render() {
    return (
      <View style={style.main}>
        <FullModal visible = {this.state.loadingVisible} type={2} />
        <Header title={"平均差价"} />
        <PickerAreaStatement getPickerData={this.getPickerData.bind(this)} />
        <ScrollView>
          <View style={style.container}>
            <View style={style.header_title}>
              <Text style={style.title_color}>本月租金差（元）</Text>
            </View>
            <View style={style.title_list}>
              <View style={style.title}>
                <Text style={style.num_color}>{this.state.ZAvg}</Text>
                <Text>整租平均</Text>
              </View>
              <View style={style.title}>
                <Text style={style.num_color}>{this.state.HAvg}</Text>
                <Text>合租平均</Text>
              </View>
            </View>
            <View style={style.rect} />
            <BarChart
              title="近6月租金差-整租"
              unit="元"
              xAxisData={this.state.XAxis}
              data={this.state.SixZ}
              color={"rgb(132,204,201)"}
            />
            <View style={style.rect} />
            <BarChart
              title="近6月租金差-合租"
              unit="元"
              xAxisData={this.state.XAxis}
              data={this.state.SixH}
              color={"rgb(137,171,219)"}
            />
            <View style={style.rect} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default AveragePrice;
