import React, { Component } from "react"
import { withNavigation } from "react-navigation"
import {
  SelectRepairApplyList,
  SelectCleaningApplyList,
} from "../../../../api/service"
import IconFont from "../../../../utils/IconFont"
import { View, TouchableOpacity, Text } from "react-native"
import { List, Header, ListSelector, SearchBar } from "../../../../components"
import ListItem from "./ListItem"
import styles from "./style"
import { connect } from "react-redux"

class RenovationApplyList extends Component {
  constructor(props) {
    super(props)
    this.busType = this.props.navigation.getParam("busType")
    this.headerTitle = this.busType === 0 ? "维修申请" : "保洁申请"
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10,
        },
        State: 0,
        StartTime: "",
        EndTime: "",
        Keyword: "",
        HouseName: "",
      },
      RepairConfig: [
        {
          type: "title",
          title: this.busType === 0 ? "维修状态" : "保洁状态",
          data: [
            {
              title: "全部",
              value: 0,
            },
            {
              title: "暂存",
              value: 1,
            },
            {
              title: "待指派",
              value: 2,
            },
            {
              title: "待维修",
              value: 3,
            },
            {
              title: "已完成",
              value: 4,
            },
            {
              title: "转装修",
              value: 5,
            },
          ],
        },
      ],
      CleanConfig: [
        {
          type: "title",
          title: this.busType === 0 ? "维修状态" : "保洁状态",
          data: [
            {
              title: "全部",
              value: 0,
            },
            {
              title: "暂存",
              value: 1,
            },
            {
              title: "待指派",
              value: 2,
            },
            {
              title: "待处理",
              value: 3,
            },
            {
              title: "已完成",
              value: 4,
            },
          ],
        },
      ],
      isShowSearch: false,
    }
    // this.willFocusSubscription = this.props.navigation.addListener(
    //   "willFocus",
    //   payload => {
    //     if (payload.state.params && payload.state.params.RentType) {
    //       this.state.form.RentType = payload.state.params.RentType
    //       this.setState({
    //         form: this.state.form,
    //       })
    //     }
    //   }
    // )
    // this.isCompanyLeader = false
    // this.isCompanyLeader = true
  }

  componentWillMount() {
    // this.isCompanyLeader = this.props.userInfo.IsCompanyLeader
    // debugger
    // this.isCompanyLeader = true
    // if (this.isCompanyLeader) {
    //   this.state.listConfig[0].data.splice(1, 1)
    // }
  }

  // componentWillUnmount() {
  //   this.willFocusSubscription.remove()
  // }

  onSelectMenu = (index, subindex, data) => {
    const form = { ...this.state.form }
    form.parm.page = 1
    switch (index) {
      case 0:
        form.State = data.value
        this.setState({ form })
        break
      default:
        break
    }
  }

  renderContent = () => {
    const renderItem = ({ item }) => {
      return <ListItem item={item} busType={this.busType} />
    }
    const fn =
      this.busType === 0 ? SelectRepairApplyList : SelectCleaningApplyList
    const ListKey = "AgentRepairCleanApplyList"
    return (
      <List
        // request={GetAppShowVacantHouse}
        request={fn}
        form={this.state.form}
        setForm={form => this.setState({ form })}
        listKey={ListKey}
        renderItem={renderItem}
        primaryKey={"KeyID"}
      />
    )
  }

  //搜索
  reset(text = "") {
    const form = { ...this.state.form }
    form.parm.page = 1
    this.busType === 0 ? (form.Keyword = text) : (form.HouseName = text)
    this.setState({
      form,
    })
  }

  _onChangeText = text => {
    this.reset(text)
  }

  _onCancel = text => {
    if (!text) {
      this.setState({
        isShowSearch: false,
      })
    } else {
      this.reset()
    }
  }

  _onClear = () => {
    this.reset()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.headerTitle}
          headerRight={
            <View
              style={[
                styles.searchAdd,
              ]}
            >
              <TouchableOpacity
                onPress={() => this.setState({ isShowSearch: true })}
              >
                <IconFont name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AgentAddRepairCleanApply", {
                    editType: 0,
                    busType: this.busType,
                  })
                }}
              >
                <Text style={styles.add}>新增</Text>
              </TouchableOpacity>
            </View>
          }
        >
          {this.state.isShowSearch && (
            <SearchBar
              onChangeText={this._onChangeText}
              onCancel={this._onCancel}
              onClear={this._onClear}
              placeholder={"房源名称"}
            />
          )}
        </Header>
        <ListSelector
          config={
            this.busType === 0
              ? this.state.RepairConfig
              : this.state.CleanConfig
          }
          onSelectMenu={this.onSelectMenu}
          renderContent={this.renderContent}
        />
      </View>
    )
  }
}

export default withNavigation(RenovationApplyList)
