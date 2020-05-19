import React, { Component } from "react"
import {
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native"
import { Echarts } from "react-native-secharts"
import {
  DisplayStyle,
} from "../../../styles/commonStyles"

export default class Pie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      option: {
        tooltip: { show: false },
        color: this.props.color,
        series: [
          {
            type: "pie",
            radius: ["70%", "55%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "15",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: true,
              },
            },
            data: this.props.data,
          },
        ],
      },
      visible: true,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.state.option.series[0].data = nextProps.data
      if (Platform.OS === "android") {
        this.setState({
          option: { ...this.state.option },
        })
      } else {
        this.setState(
          {
            visible: false,
          },
          () => {
            this.setState({
              visible: true,
              option: { ...this.state.option },
            })
          }
        )
      }
    }
  }

  render() {
    return (
      <View style={styles.pie_body_left}>
        <View style={styles.pie_body_total}>
          <View style={styles.pie_body_content}>
            <View style={{ alignSelf: "center" }}>
              <Text>{this.props.label || null}</Text>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Text>{this.props.value || null}</Text>
            </View>
          </View>
        </View>
        {this.state.visible && (
          <Echarts
            option={this.state.option}
            height={180}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pie_body_left: { flex: 1, ...DisplayStyle("row", "center", "center") },
  pie_body_total: {
    position: "absolute",
    zIndex: 10,
  },
  pie_body_content: {
    flex: 1,
    ...DisplayStyle("column", "flex-start", "center"),
  },
})
