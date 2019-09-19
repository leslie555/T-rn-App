import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Header from "../../../../components/Header";
import BarChart from "../Components/BarChart";
import styles from "./style";
import {
  ShowRentCollection,
  ShowRentingCollection
} from "../../../../api/report";

export default class CollectRentalsRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RentRateThisMonth: "", //本月收租率
      ReceivedThisMonth: 0, //本月已收
      UncollectedThisMonth: 0, //本月未收
      months: ["1月", "2月", "3月", "4月", "5月", "6月"],
      data: [0, 0, 0, 0, 0, 0],
      RentRateToday: "",//今日收租率
      ReceivedToday: 0, //今日已收
      UncollectedToday: 0, //今日未收
    };
  }

  handlePress(route, routeParam) {
    this.props.navigation.navigate(route, {
      ...routeParam
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    ShowRentCollection().then(res => {
      if (res.Data && Object.keys(res.Data).length !== 0) {
        const {
          RentRateThisMonth,
          ReceivedThisMonth,
          UncollectedThisMonth,
          UncollectedToday,
          ReceivedToday,
          RentRateToday,
        } = res.Data;
        this.setState({
          RentRateThisMonth,
          ReceivedThisMonth,
          UncollectedThisMonth,
          UncollectedToday,
          ReceivedToday,
          RentRateToday,
        });
      }
    });
    ShowRentingCollection().then(res => {
      if (res.Data && res.Data.length !== 0) {
        let months = [],
          data = [];
        for (let i = 0; i < res.Data.length; i++) {
          months.push(res.Data[i]["name"]);
        }
        for (let j = 0; j < res.Data.length; j++) {
          data.push(res.Data[j]["value"]);
        }
        this.setState({
          months,
          data,
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title="收租率" />
        <View style={styles.top}>
          <View style={styles.top_left}>
            <Text style={styles.top_left_rate}>{this.state.RentRateThisMonth}</Text>
            <Text style={styles.top_left_description}>本月收租率</Text>
          </View>
          <TouchableOpacity
            style={styles.top_left}
            onPress={() => {
              this.handlePress("AgentReceivedList", {type: 1});
            }}
          >
            <Text style={styles.top_left_rate}>{this.state.ReceivedThisMonth}</Text>
            <Text style={styles.top_left_description}>本月已收</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.top_left}
            onPress={() => {
              this.handlePress("AgentUnReceivedList", {type: 0});
            }}
          >
            <Text style={styles.top_left_rate}>{this.state.UncollectedThisMonth}</Text>
            <Text style={styles.top_left_description}>本月未收</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <View style={styles.top}>
          <View style={styles.top_left}>
            <Text style={styles.top_left_rate}>{this.state.RentRateToday}</Text>
            <Text style={styles.top_left_description}>今日收租率</Text>
          </View>
          <TouchableOpacity
            style={styles.top_left}
            onPress={() => {
              this.handlePress("AgentReceivedList", {
                ReceivedType: "thisDay",
                type: 3
              });
            }}
          >
            <Text style={styles.top_left_rate}>{this.state.ReceivedToday}</Text>
            <Text style={styles.top_left_description}>今日已收</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.top_left}
            onPress={() => {
              this.handlePress("AgentUnReceivedList", {
                UnReceivedType: "thisDay",
                type: 2,
              });
            }}
          >
            <Text style={styles.top_left_rate}>{this.state.UncollectedToday}</Text>
            <Text style={styles.top_left_description}>今日未收</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rect} />
        <BarChart
          title="近6月收租率"
          unit="%"
          xAxisData={this.state.months}
          data={this.state.data}
          color={"#5db2f8"}
        />
      </View>
    );
  }
}
