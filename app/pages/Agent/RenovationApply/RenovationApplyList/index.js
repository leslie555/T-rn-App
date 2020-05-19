import React, { Component } from "react"
import { withNavigation } from "react-navigation"
import { SelectRenovationApplyList } from "../../../../api/house"
import IconFont from "../../../../utils/IconFont"
import { View, TouchableOpacity, Text } from "react-native"
import { List, Header, ListSelector, SearchBar } from "../../../../components"
import ListItem from "./ListItem"
import styles from "./style"
import { connect } from "react-redux"

class RenovationApplyList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10,
        },
        Status: 0,
        HouseName: "",
        Salesman: ''
      },
      listConfig: [
        {
          type: "title",
          title: "装修状态",
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
              title: "待审批(经理)",
              value: 2,
            },
            {
              title: "待勘察(采购部)",
              value: 3,
            },
            {
              title: "已勘察",
              value: 4,
            },
            {
              title: "装修中",
              value: 5,
            },
            {
              title: "装修结束",
              value: 6,
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
  }

  componentWillMount() {

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
        return <ListItem item={item} />
    }
    return (
      <List
        request={SelectRenovationApplyList}
        form={this.state.form}
        setForm={form => this.setState({ form })}
        listKey={"AgentRenovationApplyList"}
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
    this.setState({
      form
    })
  }

  _onChangeText = text => {
    this.reset(text)
  }

  _onCancel = text => {
    if (!text) {
      this.setState({
        isShowSearch: false
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
          title="装修申请"
          headerRight={
            <View style={[styles.searchAdd, {marginRight: 10}]}>
              <TouchableOpacity
                onPress={() => this.setState({ isShowSearch: true })}
              >
                <IconFont name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AgentAddRenovationApply", {
                    type: 1
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
          config={this.state.listConfig}
          onSelectMenu={this.onSelectMenu}
          renderContent={this.renderContent}
        />
      </View>
    )
  }
}

const mapToProps = state => ({ userInfo: state.user.userinfo })
export default withNavigation(connect(mapToProps)(RenovationApplyList))

