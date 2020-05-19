import React, { Component } from "react"
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native"
import { Echarts } from "react-native-secharts"
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH,
} from "../../styles/commonStyles"
import { withNavigation } from "react-navigation"
import PropTypes from "prop-types"

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      option: {
        tooltip: {},
        yAxis: {
          show: this.props.unit === "%" ? true: false,
          max: this.props.unit === "%" ? 100: null,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
            color: "#999999",
          }
        },
        xAxis: {
          data: this.props.xAxisData,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: "#999999",
              width: 1,
              opacity: 0.8,
            },
          },
          // axisLabel: {
          //   interval: 0,
          // },
          axisLabel: {
            // fontSize: 12,
            interval: 0,
          },
        },
        series: [
          {
            name: this.props.title,
            type: "bar",
            barWidth: 30,
            data: this.props.data.map(v => Number(v)),
            itemStyle: {
              normal: {
                color: this.props.color,
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#999999",
                    fontSize: 14,
                  },
                },
              },
            },
          },
        ],
        grid: {
          left: this.props.unit === "%" ? 40 : 15,
          right: 15,
          bottom: 35,
          height: 120,
        },
      },
      visible: true,
    }
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    route: PropTypes.string,
    xAxisData: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
    view: PropTypes.element,
    routeParm: PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      JSON.stringify(nextProps.xAxisData) !==
        JSON.stringify(this.props.xAxisData)
    ) {
      this.state.option.series[0].data = nextProps.data
      this.state.option.xAxis.data = nextProps.xAxisData
      // if (Platform.OS === "android") {
      //   this.setState({
      //     option: { ...this.state.option },
      //   })
      // } else {
        this.setState(
          {
            visible: false,
          },
          () => {
            setTimeout(() => {
              this.setState({
                visible: true,
                option: { ...this.state.option },
              })
            },50)
          }
        )
      // }
    }
  }

  render() {
    const { title, unit, route, view } = this.props
    const routeParm = this.props.routeParm || {}
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
                ...styles.Bar_body_top_unit,
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
            <Echarts option={this.state.option} height={200} width={DEVICE_WIDTH} />
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  /**容器 */
  Bar: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  /**容器顶部样式 */
  Bar_top: {
    ...DisplayStyle("row", "center", "space-between"),
    marginHorizontal: 15,
  },
  Bar_top_left: {
    ...DisplayStyle("row", "center", "flex-start"),
  },
  Bar_top_square: {
    width: 3,
    height: 15,
    backgroundColor: CommonColor.color_primary,
    marginVertical: 15,
  },
  Bar_top_title: {
    marginVertical: 15,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#666666",
  },
  /**容器body部分 */
  Bar_body: {
    height: 215,
    ...DisplayStyle("column", "flex-start", "flex-start"),
  },
  /**容器body上面部分 */
  Bar_body_top: {
    ...DisplayStyle("row", "center", "flex-end"),
    marginTop: 15,
    marginRight: 15,
  },
  Bar_body_top_unit: {
    fontSize: 15,
  },
  // Bar_body_top_text: {
  //   fontSize: 15
  // },
  // rentCon_body_top_square: {
  //   width: 15,
  //   height: 15,
  //   marginRight: 10
  // },
  /**分割线 */
  line: {
    height: 1,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_text_bg,
    marginLeft: 15,
  },
  checkMore: {
    fontSize: 15,
    color: CommonColor.color_primary,
  },
})

export default withNavigation(BarChart)
