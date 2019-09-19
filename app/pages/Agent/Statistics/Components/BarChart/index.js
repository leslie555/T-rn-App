import React, { Component } from "react";
import { Text, View } from "react-native";
import { Echarts } from "react-native-secharts";
import styles from "./style";
import { DEVICE_WIDTH } from "../../../../../styles/commonStyles";
import { TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.option = {
      tooltip: {},
      yAxis: { show: false },
      xAxis: {
        data: this.props.xAxisData.reverse(),
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: "#999999",
            width: 1,
            opacity: 0.8
          }
        },
        axisLabel: {
          interval: 0
        },
        axisLabel: {
          // fontSize: 12,
          interval: 0
        }
      },
      series: [
        {
          name: this.props.title,
          type: "bar",
          barWidth: 30,
          data: this.props.data,
          itemStyle: {
            normal: {
              color: this.props.color,
              label: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#999999",
                  fontSize: 14
                }
              }
            }
          }
        }
      ],
      grid: {
        left: 15,
        right: 15,
        bottom: 35,
        height: 120
      }
    };
    this.state = {
      visible: true
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    route: PropTypes.string,
    xAxisData: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
    view: PropTypes.element,
    routeParm: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      JSON.stringify(nextProps.xAxisData) !== JSON.stringify(this.props.xAxisData)
    ) {
      this.option.series[0].data = nextProps.data;
      this.option.xAxis.data = nextProps.xAxisData;
      this.setState(
        {
          visible: false
        },
        () => {
          this.setState({
            visible: true
          });
        }
      );
    }
  }

  render() {
    const { title, unit, route, view } = this.props;
    const routeParm = this.props.routeParm || {};
    return (
      <View style={styles.Bar}>
        <View style={styles.Bar_top}>
          <View style={styles.Bar_top_left}>
            <View style={styles.Bar_top_square} />
            <Text style={styles.Bar_top_title}>{title}</Text>
            {view || null}
          </View>
          {route ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(route, { ...routeParm })
              }
            >
              <Text style={styles.checkMore}>查看更多</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.line} />
        <View style={styles.body}>
          <View style={styles.Bar_body_top}>
            <Text
              style={{
                ...styles.Bar_body_top_unit
              }}
            >{`单位: ${unit}`}</Text>
            {/* {Scolor !== "" ? (
              <View
                style={[
                  styles.rentCon_body_top_square,
                  { backgroundColor: Scolor }
                ]}
              />
            ) : null} */}
            {/* {text !== "" ? (
              <Text style={styles.Bar_body_top_text}>{text}</Text>
            ) : null} */}
          </View>
          {this.state.visible && (
            <Echarts option={this.option} height={200} width={DEVICE_WIDTH} />
          )}
        </View>
      </View>
    );
  }
}

export default withNavigation(BarChart);
