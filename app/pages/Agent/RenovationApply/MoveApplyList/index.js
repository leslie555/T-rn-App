import React, { Component } from "react"
import { withNavigation } from "react-navigation"
import {
  ShowHouseMoving
} from "../../../../api/service"
import IconFont from "../../../../utils/IconFont"
import { View, TouchableOpacity, Text } from "react-native"
import { List, Header, ListSelector, SearchBar } from "../../../../components"
import ListItem from "./ListItem"
import styles from "./style"
import { connect } from "react-redux"

class MoveApplyList extends Component {
  constructor(props) {
    super(props)
    this.headerTitle = "搬家申请"
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10,
        },
        HouseName: "",  
        Status: 0
      },
      CleanConfig: [
        {
          type: "title",
          title: "搬家状态",
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
              title: '待审批（经理）',
              value: 2
            },
            {
              title: '待审批（采购部）',
              value: 3
            },
            {
              title: '待指派',
              value: 4
            },
            {
              title: '待处理',
              value: 5
            },
            {
              title: '已完成',
              value: 6
            }
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
        form.Status = data.value
        this.setState({ form })
        break
      default:
        break
    }
  }

  renderContent = () => {
    const renderItem = ({ item }) => {
      return <ListItem item={item}/>
    }
    const fn = ShowHouseMoving
    const ListKey = "AgentMoveApplyList"
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
    form.HouseName = text
    // this.busType === 0 ? (form.Keyword = text) : (form.HouseName = text)
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
                  this.props.navigation.navigate("AgentAddMoveApply", {
                    editType: 0,
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
            this.state.CleanConfig
          }
          onSelectMenu={this.onSelectMenu}
          renderContent={this.renderContent}
        />
      </View>
    )
  }
}

export default withNavigation(MoveApplyList)
