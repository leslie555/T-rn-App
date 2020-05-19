import React, { Component } from "react"
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native"
import PropTypes from "prop-types"
import Pie from "./components/Pie"
import { CommonColor, DisplayStyle } from "../../styles/commonStyles"
import { withNavigation } from "react-navigation"
import Picker from "../Picker"
import IconFont from "../../utils/IconFont"

class PieChart extends Component {
  constructor(props) {
    super(props)
    this.pickerType = this.initType(this.props.type)
    this.color = this.initData(this.props.data)
    this.state = {
      data: this.initData(this.props.data, this.props.chartKey),
      pickerTitle: this.initPicker(this.props.type).pickerTitle || null,
      markDateVisible: false,
      markDateSelectedValue: this.initPicker(this.props.type).markDateSelectedValue || null,
    }
  }

  static defaultProps = {
    title: "" /**统计标题 */,
    unit: "" /**统计单位 */,
    route: "" /**查看更多路由 */,
    routeParm: {} /**查看更多路由参数 */,
    data: [] /**统计数据 */,
    chartKey: "" /**统计数据每一项金额的key */,
    onChangeDate: () => {} /**确认选择日期后回调 */,
    renderItem: () => {} /**列表每项渲染element函数 */,
  }

  
  
  static propTypes = {
    title: PropTypes.string,
    unit: PropTypes.string,
    route: PropTypes.string,
    routeParm: PropTypes.object,
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    chartKey: PropTypes.string.isRequired,
    onChangeDate: PropTypes.func,
  }
  
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.state.data = this.initData(nextProps.data, this.props.chartKey)
      this.setState({
        data: [...this.state.data],
      })
    }
  }

  // 初始化饼图的数据(data, color)
  initData = (data = [], key = "color") => {
    if (data && data.length !== 0) {
      return data.map(obj => obj[key])
    }
    return data
  }

  // 初始化picker默认选中当前date和按钮text
  initPicker = type => {
    // Y代表年 M代表月
    let pickerTitle = "",
      Y = "",
      M = "",
      markDateSelectedValue = []
    Y = new Date().getFullYear()
    M = new Date().getMonth() + 1
    if (type === 1) {
      pickerTitle = Y
      markDateSelectedValue.push(Y + "年")
      return { pickerTitle, markDateSelectedValue }
    } else if (type === 2) {
      markDateSelectedValue.push(Y + "年")
      markDateSelectedValue.push(M + "月")
      if (M < 10) {
        M = "0" + M
      }
      pickerTitle = Y + "-" + M
      return { pickerTitle, markDateSelectedValue }
    } else {
      return {}
    }
  }

  // 初始化picker类型
  initType = type => {
    switch (type) {
      case 0:
        return null
      case 1:
        return "dateYear"
      case 2:
        return "dateYearMonth"
      default:
        return null
    }
  }

  // 总计
  sumTotal = (data = [], key) => {
    if (data && data.length !== 0) {
      const total =  data.reduce((prev, next) => {
        return prev + next[key]
      }, 0)
      return total.toFixed(2)
    }
    return null
  }

  // 格式化月份格式
  formatMonth = dataMonth => {
    let Month
    if (dataMonth.slice(0, -1) < 10) {
      Month = 0 + dataMonth.slice(0, -1)
    } else {
      Month = dataMonth.slice(0, -1)
    }
    return Month
  }

  markDateConfirm(data) {
    let pickerTitle = ""
    let markDateSelectedValue = []
    if (this.props.type === 1) {
      pickerTitle = data[0].slice(0, -1)
    } else if (this.props.type === 2) {
      const dataMonth = data[1]
      const Month = this.formatMonth(dataMonth)
      pickerTitle = data[0].slice(0, -1) + "-" + Month
    }
    markDateSelectedValue.push.apply(markDateSelectedValue, data)
    this.setState(
      {
        pickerTitle,
        markDateVisible: false,
        markDateSelectedValue,
      },
      () => {
        this.props.onChangeDate &&
          this.props.onChangeDate(this.props.type, pickerTitle)
      }
    )
  }

  render() {
    const { title, unit, route, routeParm, data, chartKey, label } = this.props
    const total = this.sumTotal(data, chartKey) 
    const height = data && data.length * 20 + 20 // 列表高度
    return (
      <View style={styles.pie_container}>
        <View style={styles.pie_top}>
          <View style={styles.pie_topLeft}>
            <View style={styles.pie_top_square} />
            <Text style={styles.pie_top_title}>{title || null}</Text>
            {this.pickerType ? (
              <View style={{ marginLeft: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ markDateVisible: true })
                  }}
                  style={styles.select_btn}
                >
                  <Text style={[styles.select_text]}>
                    {this.state.pickerTitle}
                  </Text>
                  <IconFont name="sanjiaoxing" size={10} color={"#999"} />
                </TouchableOpacity>
                <Picker
                  visible={this.state.markDateVisible}
                  type={this.pickerType}
                  selectedValue={this.state.markDateSelectedValue}
                  onPickerConfirm={data => this.markDateConfirm(data)}
                  closeModal={() => {
                    this.setState({ markDateVisible: false })
                  }}
                />
              </View>
            ) : null}
          </View>
          {route !== "" ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(route, { ...(routeParm || {}) })
              }
            >
              <Text style={styles.pie_top_checkMore}>查看更多</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.line} />
        <View style={styles.pie_unit}>
          <Text>{`单位: ${unit || ""}`}</Text>
        </View>
        <View style={[styles.pie_body]}>
          <Pie
            data={this.state.data}
            color={this.color}
            label={label || "总计"}
            value={total}
          />
          <View
            style={[styles.pie_body_content, { height, paddingVertical: 10 }]}
          >
            <FlatList
              renderItem={this.props.renderItem}
              data={data || []}
              keyExtractor={(item, index) => index + ""}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pie_top: {
    ...DisplayStyle("row", "center", "space-between"),
    marginHorizontal: 15,
  },
  pie_topLeft: {
    ...DisplayStyle("row", "center", "flex-start"),
  },
  pie_top_square: {
    width: 3,
    height: 15,
    backgroundColor: CommonColor.color_primary,
    marginVertical: 15,
  },
  pie_top_title: {
    marginVertical: 15,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#666666",
  },
  pie_top_checkMore: {
    fontSize: 15,
    color: CommonColor.color_primary,
  },
  line: {
    height: 1,
    backgroundColor: CommonColor.color_text_bg,
    marginHorizontal: 15,
  },
  pie_container: {
    flexDirection: "column",
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  pie_body: {
    ...DisplayStyle("row", "center", "space-between"),
    marginHorizontal: 15,
  },
  pie_body_content: {
    flex: 1,
    ...DisplayStyle("column", "flex-start", "center"),
  },
  pie_unit: {
    ...DisplayStyle("row", "center", "flex-end"),
    marginTop: 15,
    marginRight: 15,
    fontSize: 15,
  },
  select_btn: {
    ...DisplayStyle("row", "center", "center"),
  },
  select_text: {
    fontSize: 15,
    marginRight: 5,
    color: CommonColor.color_text_primary,
  },
})

export default withNavigation(PieChart)
