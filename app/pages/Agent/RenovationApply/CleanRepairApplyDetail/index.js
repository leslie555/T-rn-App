import React, { Component } from "react"
import PropTypes from "prop-types"
import { withNavigation } from "react-navigation"
import {
  View,
  // Text,
  // TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native"
import { connect } from "react-redux"
import { ImagePreview, Header, FullModal } from "../../../../components"
import LabelWidget from "../../../../components/Form/widgets/LabelWidget"
import NoticeWidget from "../../../../components/Form/widgets/NoticeWidget"
import TextAreaWidget from "../../../../components/Form/widgets/TextAreaWidget"
import styles from "./style"
import { CommonColor } from "../../../../styles/commonStyles"
import CleanRepairApplyTrack from "./CleanRepairApplyTrack"
import ButtonGroup from "../../../../components/ButtonGroup"
import { dateFormat } from "../../../../utils/dateFormat"
import {
  CommitRepairApply,
  DeleteRepairApply,
  WithdrawRepairApply,
  QueryRepairApplyDetail,
  QueryCleaningApplyDetail,
  CommitCleaningApply,
  DeleteCleaningApply,
  WithdrawCleaningApply,
} from "../../../../api/service"
import { getEnumDesByValue } from "../../../../utils/enumData"
import { deleteList, updateList } from "../../../../redux/actions/list"


class RenovationApplyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: {},
      cloneData: {},
    }
    this.options = [
      {
        label: "撤回",
        value: "Withdrawn",
      },
      {
        label: "修改",
        value: "Update",
      },
      {
        label: "提交",
        value: "Commit",
      },
      {
        label: "删除",
        value: "Delete",
      },
    ]
    this.KeyID = this.props.navigation.getParam("KeyID", "")
    this.busType = this.props.navigation.getParam("busType", "")
    this.title = this.busType === 0 ? "维修申请详情" : "保洁申请详情"
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        if (payload.state.params && payload.state.params.isRefresh) {
          this.fetchDetail(this.KeyID)
        }
      }
    )
  }

  // static propTypes = {
  // }

  componentDidMount() {
    this.fetchDetail(this.KeyID)
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove()
  }

  //获取详情
  fetchDetail(KeyID) {
    const fn =
      this.busType === 0 ? QueryRepairApplyDetail : QueryCleaningApplyDetail
    fn({ KeyID }).then(res => {
      if (res.Code === 0 && res.Data) {
        const data = res.Data
        const cloneData = Object.assign({}, data)
        this.setState({
          data,
          cloneData
        })
      }
    })
  }

  // static defaultProps = {
  // }

  filterOperation(State = 0) {
    let Operations = []
    if (State === 1) {
      Operations = this.options.slice(1)
    } else if (State === 2) {
      Operations.push(this.options[0])
    }
    return Operations
  }

  // 按钮监听事件处理函数
  // 删除

  handleDeleteClick = () => {
    const fn = this.busType === 0 ? DeleteRepairApply : DeleteCleaningApply
    const info =
      this.busType === 0 ? "确认要删除该维修申请吗" : "确认要删除该保洁申请吗"
    const key = "AgentRepairCleanApplyList"
    Alert.alert("温馨提示", info, [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress: () => {
          this.setState({
            loading: true,
          })
          fn({ KeyID: this.KeyID })
            .then(() => {
              this.setState(
                {
                  loading: false,
                },
                () => {
                  setTimeout(() => {
                    Alert.alert(
                      "温馨提示",
                      "删除成功",
                      [
                        {
                          text: "确认",
                          onPress: () => {
                            this.props.dispatch(
                              deleteList({
                                key,
                                KeyID: this.KeyID,
                              })
                            )
                            this.props.navigation.navigate(
                              key
                            )
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                  }, 100)
                }
              )
            })
            .catch(() => {
              this.setState({
                loading: false,
              })
            })
        },
      },
    ])
  }

  // 提交
  handleCommitClick = () => {
    const fn = this.busType === 0 ? CommitRepairApply : CommitCleaningApply
    const info =
      this.busType === 0 ? "确认要提交该维修申请吗" : "确认要提交该保洁申请吗"
    const key = "AgentRepairCleanApplyList"
    Alert.alert("温馨提示", info, [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress: () => {
          this.setState({
            loading: true,
          })
          fn({ KeyID: this.KeyID, type: 2, HouseKey: this.state.data.HouseKey})
            .then(() => {
              this.setState(
                {
                  loading: false,
                },
                () => {
                  setTimeout(() => {
                    Alert.alert(
                      "温馨提示",
                      "提交成功",
                      [
                        {
                          text: "确认",
                          onPress: () => {
                            let data = this.state.data
                            data.State = 2
                            this.props.dispatch(
                              updateList({
                                key,
                                KeyID: this.KeyID,
                                data,
                              })
                            )
                            this.props.navigation.navigate(key)
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                  }, 100)
                }
              )
            })
            .catch(() => {
              this.setState({
                loading: false,
              })
            })
        },
      },
    ])
  }

  // 撤回
  handleWithdrawnClick = () => {
    const fn = this.busType === 0 ? WithdrawRepairApply : WithdrawCleaningApply
    const info =
      this.busType === 0 ? "确认要撤回该维修申请吗" : "确认要撤回该保洁申请吗"
    const key = "AgentRepairCleanApplyList"
    Alert.alert("温馨提示", info, [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress: () => {
          this.setState({
            loading: true,
          })
          fn({
            KeyID: this.KeyID,
            HouseKey: this.state.data.HouseKey,
          })
            .then(() => {
              this.setState(
                {
                  loading: false,
                },
                () => {
                  setTimeout(() => {
                    Alert.alert(
                      "温馨提示",
                      "撤回成功",
                      [
                        {
                          text: "确认",
                          onPress: () => {
                            const data = this.state.data
                            data.State = 1
                            this.props.dispatch(
                              updateList({
                                key,
                                KeyID: this.KeyID,
                                data,
                              })
                            )
                            this.props.navigation.navigate(key)
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                  }, 100)
                }
              )
            })
            .catch(() => {
              this.setState({
                loading: false,
              })
            })
        },
      },
    ])
  }

  // 修改
  handleUpdateClick = () => {
    this.props.navigation.navigate("AgentAddRepairCleanApply", {
      busType: this.busType,
      editType: 1,
      data: this.state.cloneData,
    })
  }

  render() {
    const {
      HouseName,
      Location,
      TenName,
      TenPhone,
      UserName,
      Phone,
      CompanyName,
      MaintainContent,
      CleaningContent,
      CreaterTime,
      CompleteTime,
      State,
      Remark,
      MaintainEmpName,
      CleaningEmpName,
      MaintainRemark,
      CleaningRemark,
      Progresstrack,
      RenovationPlanTrack,
    } = this.state.data
    const houseImages =
      this.busType === 0 ? this.state.data.imageSumList : this.state.data.Img
    const busImages =
      this.busType === 0
        ? this.state.data.MaintainIDSumList
        : this.state.data.CleaningImg    
    const Operations = this.filterOperation(State)
    return (
      <View style={styles.container}>
        <FullModal visible={this.state.loading} />
        <Header title={this.title} />
        <ScrollView>
          <LabelWidget
            type="LabelWidget"
            title="房源名称"
            value={HouseName || " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="地址"
            value={Location || " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="租客"
            value={(TenName || "") + " " + (TenPhone || "")}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="业务员"
            value={(UserName || "") + " " + (Phone || "")}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="部门"
            value={CompanyName || " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="提交时间"
            value={dateFormat(CreaterTime) || " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            title="状态"
            editable={false}
            value={getEnumDesByValue("MaintainState", State) || " "}
            required={false}
            renderRight={false}
          />
          <NoticeWidget title={this.busType === 0 ? "维修内容" : "保洁内容"} />
          <TextAreaWidget
            name="remarks"
            disabled={true}
            value={MaintainContent || CleaningContent || " "}
          />
          <NoticeWidget title={"房源图片"} />
          <View style={{ backgroundColor: CommonColor.color_white }}>
            <ImagePreview imgSrc={ houseImages ? houseImages : []} />
          </View>
          <NoticeWidget title={"备注"} />
          <TextAreaWidget name="remarks" disabled={true} value={Remark} />
            {State > 2 && (<View>
              <NoticeWidget
                title={this.busType === 0 ? "维修信息" : "保洁信息"}
              />
              <LabelWidget
                title={this.busType === 0 ? "维修人员" : "保洁人员"}
                editable={false}
                value={
                  (this.busType === 0 ? MaintainEmpName : CleaningEmpName) ||
                  " "
                }
                required={false}
                renderRight={false}
              />
              </View>)}
              {State === 4 && 
              (<View>
                <LabelWidget
                  title={"完成时间"}
                  editable={false}
                  value={dateFormat(CompleteTime) || " "}
                  required={false}
                  renderRight={false}
                />
                <NoticeWidget
                  title={this.busType === 0 ? "维修图片" : "保洁图片"}
                />
                <View style={{ backgroundColor: CommonColor.color_white }}>
                  <ImagePreview imgSrc={ busImages ? busImages : [] } />
                </View>
                <NoticeWidget
                  title={this.busType === 0 ? "维修备注" : "保洁备注"}
                />
                <TextAreaWidget
                  name="CleanRepairRemarks"
                  value={
                    `${this.busType === 0 ? MaintainRemark : CleaningRemark}` ||
                    " "
                  }
                  disabled={true}
                />
              </View>)
          }
          <CleanRepairApplyTrack
            CleanRepairApplyTrack={
              this.busType === 0 ? Progresstrack : RenovationPlanTrack
            }
          />
        </ScrollView>
        {Operations.length !== 0 && (
          <View style={styles.page_bottom}>
            <ButtonGroup
              options={Operations}
              hasIcon={false}
              hasImage={false}
              handleUpdateClick={this.handleUpdateClick}
              handleWithdrawnClick={this.handleWithdrawnClick}
              handleDeleteClick={this.handleDeleteClick}
              handleCommitClick={this.handleCommitClick}
            />
          </View>
        )}
      </View>
    )
  }
}

export default withNavigation(connect()(RenovationApplyDetail))
