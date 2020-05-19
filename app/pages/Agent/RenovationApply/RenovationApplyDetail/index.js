import React, { Component } from "react"
import PropTypes from "prop-types"
import { withNavigation } from "react-navigation"
import {
  View,
  ScrollView,
  FlatList,
  Alert
} from "react-native"
import { connect } from "react-redux"
import { ImagePreview, Header, FullModal } from "../../../../components"
import LabelWidget from "../../../../components/Form/widgets/LabelWidget"
import NoticeWidget from "../../../../components/Form/widgets/NoticeWidget"
import TextAreaWidget from "../../../../components/Form/widgets/TextAreaWidget"
import styles from "./style"
import { CommonColor } from "../../../../styles/commonStyles"
import RenovationProgress from "./RenovationProgress"
import ButtonGroup from "../../../../components/ButtonGroup"
import { dateFormat } from "../../../../utils/dateFormat"
import {
  SelectRenovationApplyDetail,
  SubmitRenovationApplication,
  DeleteRenovationApplication,
  WithdrawRenovationApplication,
  ShowHouseInfoFieldByHousekey,
  EditHouseWhetherRentOut
} from "../../../../api/house"
import { setRenovationDetail } from "../../../../redux/actions/renovationDetail"
import { getEnumDesByValue } from "../../../../utils/enumData"
import { deleteList, updateList } from "../../../../redux/actions/list"

class RenovationApplyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      HouseKey: "",
      // 0:不可租 1:可租
      whetherRentOut: 0,
      // 是否接口调完
      titleFinsh: false
    }
    this.options = [
      {
        label: "审批",
        value: "Approval",
      },
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
      {
        label: "是否可租",
        value: "WhetherRentOut",
      },
    ]
    this.KeyID = this.props.navigation.getParam("KeyID", "")
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        if (payload.state.params && payload.state.params.isRefresh) {
          // debugger
          this.fetchDetail(this.KeyID)
        }
      }
    )
  }

  componentDidMount() {
    const getParam = this.props.navigation.getParam
    const KeyID = getParam("KeyID", "")
    this.fetchDetail(KeyID)
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove()
  }
  //获取详情
  fetchDetail(KeyID) {
    SelectRenovationApplyDetail({ KeyID }).then(res => {
      if (res.Code === 0 && res.Data) {
        this.props.dispatch(setRenovationDetail({ ...res.Data }))
        const HouseKey = res.Data.ApplyRecord[0].HouseKey || ""
        this.setState({
          HouseKey: HouseKey
        })
        // 是否继续可租
        ShowHouseInfoFieldByHousekey({ HouseKeySum: [HouseKey] }).then(({ Data }) => {
          const whetherRentOut = Data[0].whetherRentOut
          this.setState({
            whetherRentOut,
            titleFinsh: true
          })
        })
      }
    })
  }

  static defaultProps = {
    detail: {
      ApplyRecord: [
        {
          HouseName: "",
          Location: "",
          KeyLocation: "",
          RoomArea: "",
          Salesman: "",
          HousePictureList: [],
          Remarks: "",
          CompanyName: "",
          KeyID: "",
          Status: 1,
          CreaterTime: "0001-01-01T00:00:00",
          BZ: "",
          HouseKey: ""
        },
      ],
      DecorationDetails: [{}],
      RenovationTrack: [{}],
      imageList: [{}],
    },
  }

  filterOperation(Status) {
    let Operations = []
    if (Status === 1) {
      Operations = this.options.slice(2)
    } else if (Status === 2 || Status === 3) {
      Operations.push(this.options[1])
      // 新加是否可租
      Operations.push(this.options[5])
    } else if (Status !== 6){
      Operations.push(this.options[5])
    }
    return Operations
  }

  handleWhetherRentOutClick = () => {
    if(this.state.titleFinsh) {
      const title = this.state.whetherRentOut === 0 ? '确认出租' : '确认不出租'
      Alert.alert("温馨提示", title, [
        {
          text: "取消",
        },
        {
          text: "确认",
          onPress: () => {
            this.setState({
              loading: true,
            })
            const whetherRentOut = this.state.whetherRentOut === 1 ? 0 : 1
            const obj = {
              HouseKey: this.state.HouseKey,
              Type:1,
              WhetherRentOut:whetherRentOut,
              status: whetherRentOut
            }
            EditHouseWhetherRentOut(obj)
              .then((res) => {
                this.setState(
                  {
                    loading: false,
                  },
                  () => {
                      setTimeout(() => {
                        Alert.alert(
                          "温馨提示",
                          "修改成功",
                          [
                            {
                              text: "确认",
                              onPress: () => {
                                const whetherRentOut = this.state.whetherRentOut === 0 ? 1 : 0
                                this.setState({
                                  whetherRentOut
                                })
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
    } else {
      setTimeout(() => {
        Alert.alert(
          "正在努力中",
          "请稍等..."
        )
      }, 100)
    }
  }

  // 按钮监听事件处理函数
  // 删除


  handleDeleteClick = () => {
    Alert.alert("温馨提示", "确认要删除该装修申请吗", [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress: () => {
          this.setState({
            loading: true,
          })
          DeleteRenovationApplication({ KeyID: this.KeyID, OperationStatus: 2,  HouseKey: this.state.HouseKey})
            .then((res) => {
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
                                  key: "AgentRenovationApplyList",
                                  KeyID: this.KeyID,
                                })
                              )
                              this.props.navigation.navigate(
                                "AgentRenovationApplyList"
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
    Alert.alert("温馨提示", "确认要提交该装修申请吗", [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress: () => {
          this.setState({
            loading: true,
          })
          SubmitRenovationApplication({
            KeyID: this.KeyID,
            OperationStatus: 1,
            HouseKey: this.state.HouseKey,
            HouseName: this.props.detail.ApplyRecord[0].HouseName,
          })
            .then((res) => {
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
                                const data = this.props.detail.ApplyRecord[0]
                                data.Status = 2
                                this.props.dispatch(
                                  updateList({
                                    key: "AgentRenovationApplyList",
                                    KeyID: this.KeyID,
                                    data,
                                  })
                                )
                                this.props.navigation.navigate(
                                  "AgentRenovationApplyList"
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

  // 撤回
  handleWithdrawnClick = () => {
    Alert.alert("温馨提示", "确认要撤回该装修申请吗", [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress: () => {
          this.setState({
            loading: true,
          })
          WithdrawRenovationApplication({
            KeyID: this.KeyID,
            OperationStatus: 1,
            HouseKey: this.state.HouseKey,
          })
            .then((res) => {
              this.setState(
                {
                  loading: false,
                },
                () => {
                  if(res.Data === 1) {
                    setTimeout(() => {
                      Alert.alert(
                        "温馨提示",
                        "撤回成功",
                        [
                          {
                            text: "确认",
                            onPress: () => {
                              const data = this.props.detail.ApplyRecord[0]
                              data.Status = 1
                              this.props.dispatch(
                                updateList({
                                  key: "AgentRenovationApplyList",
                                  KeyID: this.KeyID,
                                  data,
                                })
                              )
                              this.props.navigation.navigate(
                                "AgentRenovationApplyList"
                              )
                            },
                          },
                        ],
                        { cancelable: false }
                      )
                    }, 100)
                  } else {
                      setTimeout(() => {
                        Alert.alert("温馨提示", `撤回失败 ${res.Msg || ""}`)
                      }, 100)
                  }
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
    this.props.navigation.navigate("AgentAddRenovationApply", {
      type: 2,
      id: this.KeyID,
    })
  }

  // 审批
  handleApprovalClick = () => {
    this.props.navigation.navigate("AgentRenovationApproval", {
      id: this.KeyID,
      HouseKey: this.state.HouseKey
    })
  }

  render() {
    const {
      HouseName,
      Location,
      KeyLocation,
      RoomArea,
      Salesman,
      CompanyName,
      CreaterTime,
      Status,
      BZ,
    } = this.props.detail.ApplyRecord[0]
    const whetherRentOut = this.state.whetherRentOut === 0 ? '否' : '是'
    const imageList = this.props.detail.imageList
    const DecorationDetails = this.props.detail.DecorationDetails
    const RenovationTrack = this.props.detail.RenovationTrack
    const Operations = this.filterOperation(Status)
    return (
      <View style={styles.container}>
        <FullModal visible={this.state.loading} />
        <Header title={"装修申请详情"} />
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
            renderRight={false}
            required={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="钥匙位置"
            value={KeyLocation || " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="是否可租"
            value={whetherRentOut || " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="产权面积"
            value={RoomArea ? `${RoomArea}m²` : " "}
            required={false}
            renderRight={false}
          />
          <LabelWidget
            type="LabelWidget"
            title="业务员"
            value={Salesman || " "}
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
            value={getEnumDesByValue("RenovationApplyRecord", Status)}
            required={false}
            renderRight={false}
          />
          <View style={{ position: "relative" }}>
            <NoticeWidget title={"装修项目"} />
          </View>
          <FlatList
            keyboardShouldPersistTaps="always"
            data={DecorationDetails}
            renderItem={({ item, index }) => (
              <LabelWidget
                title={item.ProjectName}
                editable={false}
                value={`${item.ExternalPrice}元/${item.Unit}, 数量${item.Number}, 金额${item.ExternalPriceTotalAmount}元`}
                required={false}
                renderRight={false}
              />
            )}
            keyExtractor={(item, index) => index + ""}
          />
          <NoticeWidget title={"房源图片"} />
          <View style={{ backgroundColor: CommonColor.color_white }}>
            <ImagePreview imgSrc={imageList ? imageList : []} />
          </View>
          <NoticeWidget title={"备注"} />
          <ScrollView>
          <TextAreaWidget
            name="remarks"
            required={false}
            editable={false}
            value={BZ}
          /></ScrollView>
          <RenovationProgress RenovationTrack={RenovationTrack} />
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
              handleApprovalClick={this.handleApprovalClick}
              handleWhetherRentOutClick={this.handleWhetherRentOutClick}
            />
          </View>
        )}
      </View>
    )
  }
}

const mapStateToPorps = state => ({ detail: state.renovationDetail, userinfo: state.user.userinfo })
export default withNavigation(connect(mapStateToPorps)(RenovationApplyDetail))
