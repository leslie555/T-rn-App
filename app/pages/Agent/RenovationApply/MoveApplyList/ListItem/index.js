import React, { Component } from "react"
import { Text, View, TouchableOpacity, Alert, Linking } from "react-native"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import styles from "./style"
import { withNavigation } from "react-navigation"
import IconFont from "../../../../../utils/IconFont"
import { getEnumDesByValue } from "../../../../../utils/enumData"
import { dateFormat } from "../../../../../utils/dateFormat"

class ListItem extends Component {
  constructor(props) {
    super(props)
    this.colors = {
      orange: "#ff9900",
      blue: "#389ef2",
      green: "#33cc99",
      default: "#999999",
    }
  }

  static defaultProps = {
    item: {
      HouseName: "",
      Salesman: "",
      ReviewedCommitTime: "",
      status: 0,
      MovingContent: "",
    },
    // busType: 0,
  }

  StatusColors(State) {
    if ([1, 2, 3].indexOf(State) !== -1) {
      return this.colors.orange
    } else if (State === 4) {
      return this.colors.green
    } else if (State === 5) {
      return this.colors.default
    }
  }

  filterContent(content = "") {
    return content.length > 20 ? `${content.slice(0, 20)}...` : content
  }
  judgeStatus(val) {
    let type = ''
    switch (val) {
      case 0:
        type = '全部'
        break
      case 1:
        type = '暂存'
        break
      case 2:
        type = '待审批（经理）'
        break
      case 3:
        type = '待审批（采购部）'
        break
      case 4:
        type = '待指派'
        break
      case 5:
        type = '待处理'
        break
      case 6:
        type = '已完成'
        break
    }
    return type
  }

  render() {
    const {
      HouseName,
      Salesman,
      Status,
      ReviewedCommitTime,
      KeyID,
      MovingContent
    } = this.props.item
    const CreaterTimeMark = dateFormat(ReviewedCommitTime)
    let content = MovingContent
    content = content.replace(/\n/g,' ') // 替换换行为空格
    content = (content.length > 20 ? `${content.slice(0, 20)}...` : content) || ""
    let getStatus = this.judgeStatus(Status)
    // const enumKey = this.props.busType === 0 ? "MaintainState" : "CleaningState"
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.navigation.navigate("AgentMoveApplyDetail", {
            KeyID,
          })
        }}
      >
        <View style={styles.container_top}>
          <View style={styles.container_top_info}>
            <Text style={styles.container_top_title}>{HouseName}</Text>
          </View>
          <Text
            style={[
              styles.container_top_title,
              { color: this.StatusColors(Status) },
            ]}
          >
            {/* {getEnumDesByValue(enumKey, Status)} */}
            { getStatus }
          </Text>
        </View>
        <View style={styles.container_line} />
        <View style={styles.container_content}>
          <View style={styles.container_content_top}>
            <View style={styles.container_content_top_left}>
              <Text style={styles.container_content_label}>业务员:</Text>
              <Text style={[styles.container_content_value, { marginLeft: 5 }]}>
                {(Salesman || "")}
              </Text>
            </View>
            <View style={styles.container_content_top_right}>
              <Text
                style={[styles.container_content_label, { marginRight: 10 }]}
              >
                提交时间
              </Text>
              <Text>{CreaterTimeMark}</Text>
            </View>
          </View>
          <View style={styles.container_content_top_left}>
            <Text style={styles.container_content_label}>内容: </Text>
            <View
              style={[styles.container_content_top_right, { marginRight: 22 }]}
            >
              <Text
                style={[styles.container_content_value, { flexWrap: "wrap" }]}
              >
                {content}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapToProps = state => ({ userInfo: state.user.userinfo })
export default connect(mapToProps)(withNavigation(ListItem))
