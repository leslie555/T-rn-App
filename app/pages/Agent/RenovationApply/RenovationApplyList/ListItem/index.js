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
      orange: '#ff9900',
      blue: '#389ef2',
      green: '#33cc99',
      default: '#999999',
    }
  }

  static defaultProps = {
    item: {
      HouseName: "", //房源名称
      Salesman: "", //业务员
      CreaterTime: "", //提交时间
      Status: 0, //装修状态
      Money: 0, //出租金额
      ywyList: [{}]
    },
  }

  static propTypes = {
    item: PropTypes.shape({
      HouseName: PropTypes.string,
      ywyList: PropTypes.Object,
      HouseID: PropTypes.number,
      HouseKey: PropTypes.string,
    }),
  }

  callPhone = () => {
    const phoneNum = Number(this.props.item.Salesman.split('  ')[1])
    // debugger
    Alert.alert("温馨提示", `是否联系${phoneNum}?`, [
      { text: "取消" },
      {
        text: "确认",
        onPress: () => Linking.openURL(`tel:${phoneNum}`),
      },
    ])
  }

  StatusColors(Status) {
    if ([1, 2, 3].indexOf(Status) !== -1) {
      return this.colors.orange
    } else if(Status === 4) {
      return this.colors.blue
    } else if(Status === 5) {
      return this.colors.green
    } else if(Status === 6) {
      return this.colors.default
    }
  }
  
  render() {
    const {
      HouseName,
      Salesman,
      ywyList,
      Status,
      CreaterTime,
      KeyID
    } = this.props.item
    let Project = ywyList
      ? ywyList.map(v => v.ProjectName).join("、")
      : ""
    Project = Project.length > 20 ? `${Project.slice(0, 20)}...` : Project
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.navigation.navigate("AgentRenovationApplyDetail", {
            KeyID,
            isCompanyLeader: this.props.isCompanyLeader,
          })
        }}
      >
        <View style={styles.container_top}>
          <View style={styles.container_top_info}>
            {/* <View style={styles.container_top_square} /> */}
            <Text style={styles.container_top_title}>{HouseName}</Text>
            {/* <Text style={styles.container_top_title}>{rentType}</Text> */}
          </View>
          <Text
            style={[
              styles.container_top_title,
              { color: this.StatusColors(Status) },
            ]}
          >
            {getEnumDesByValue("RenovationApplyRecord", Status)}
          </Text>
        </View>
        <View style={styles.container_line} />
        <View style={styles.container_content}>
          <View style={styles.container_content_top}>
            <View style={styles.container_content_top_left}>
              <Text style={styles.container_content_label}>业务员:</Text>
              <Text style={[styles.container_content_value, { marginLeft: 5 }]}>
                {Salesman}
              </Text>
              {/* <Text style={[styles.container_content_value, { marginLeft: 9 }]}>
                {tub[0].Tel}
              </Text> */}
              <TouchableOpacity
                style={[styles.container_content_value, { marginLeft: 9 }]}
                onPress={this.callPhone}
              >
                <IconFont name="call" size={24} color="#389ef2" />
              </TouchableOpacity>
            </View>
            <View style={styles.container_content_top_right}>
              <Text
                style={[styles.container_content_label, { marginRight: 10 }]}
              >
                提交时间
              </Text>
              <Text>{dateFormat(CreaterTime)}</Text>
            </View>
          </View>
          <View style={styles.container_content_top_left}>
            <Text style={styles.container_content_label}>项目: </Text>
            <View
              style={[styles.container_content_top_right, { marginRight: 24 }]}
            >
              <Text
                style={[styles.container_content_value, { flexWrap: "wrap" }]}
              >
                {Project}
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
