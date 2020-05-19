import React, { Component } from "react"
import PropTypes from "prop-types"
import { withNavigation } from "react-navigation"
import {
  View,
  Text,
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
import MovingApplyTrack from "./MovingApplyTrack"
import ButtonGroup from "../../../../components/ButtonGroup"
import { dateFormat } from "../../../../utils/dateFormat"
import {
  ShowHouseMovingDetails,
  OperationHouseMoving
} from "../../../../api/service"
import { deleteList, updateList, addList } from "../../../../redux/actions/list"

import { setMovingDetail } from "../../../../redux/actions/movingDetail"
import store from "../../../../redux/store/store";



class MovingApplyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      loadingDetail: false,
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
    this.title = "搬家申请详情"
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
      let fn = ShowHouseMovingDetails
      fn({ KeyID }).then(res => {
        if (res.Code === 0 && res.Data) {
          const data = res.Data
          const cloneData = Object.assign({}, data)
          // 保存详情
          store.dispatch(
            setMovingDetail({
              // key: 'AgentMoveApplyDetail',
              data,
            })
          )
          this.setState({
            data,
            cloneData,
            loadingDetail: true,
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
    const fn = OperationHouseMoving
    const info = "确认要删除该搬家申请吗"
    const key = "AgentMoveApplyList"
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
          fn({ KeyID: this.KeyID,Type: 1, })
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
    const fn = OperationHouseMoving
    const info = "确认要提交该搬家申请吗"
    const key = "AgentMoveApplyList"
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
          fn({ KeyID: this.KeyID, Type: 3, MovingContent: this.state.data.HouseRecord[0].MovingContent})
            .then(({Data}) => {
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
                            const data = Data[0]
                            debugger
                            data.Status = 2
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
    const fn = OperationHouseMoving
    const info = "确认要撤回该搬家申请吗"
    const key = "AgentMoveApplyList"
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
            Type: 2,
          })
            .then(({Data}) => {
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
                            const data = Data[0]
                            debugger
                            data.Status = 1
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
    this.props.navigation.navigate("AgentAddMoveApply", {
      editType: 1,
      data: this.state.cloneData,
    })
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
    if(this.state.loadingDetail){
      console.log(this.props.movingDatil)
      const {
        HouseRecord,
        ImageList,
        MovingImageList,
        RenovationTrack
      } = this.props.movingDatil
      const {
        HouseName,
        Location,
        TenantName,
        TenantTel,
        Salesman,
        CompanyName,
        MovingContent,
        ReviewedCommitTime,
        CompleteTime,
        Status,
        BZ,
        MovingName,
        MovingBZ,
      } = this.props.movingDatil.HouseRecord[0]
      const houseImages = ImageList
      const busImages = MovingImageList
      const getStatus = this.judgeStatus(HouseRecord[0].Status)
      const Operations = this.filterOperation(HouseRecord[0].Status)
      return (
        <View style={styles.container}>
          <FullModal visible={this.state.loading} />
          {
            
          }
          <Header title={this.title} />
          {
            HouseRecord.map(item => {
              return
            })
          }
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
              value={(TenantName || "") + " " + (TenantTel || "")}
              required={false}
              renderRight={false}
            />
            <LabelWidget
              type="LabelWidget"
              title="业务员"
              value={(Salesman || "")}
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
              value={dateFormat(ReviewedCommitTime) || " "}
              required={false}
              renderRight={false}
            />
            <LabelWidget
              title="状态"
              editable={false}
              value={getStatus || " "}
              required={false}
              renderRight={false}
            />
            <NoticeWidget title={"搬家内容"} />
            <TextAreaWidget
              name="remarks"
              disabled={true}
              value={MovingContent || " "}
            />
            <NoticeWidget title={"房源图片"} />
            <View style={{ backgroundColor: CommonColor.color_white }}>
              <ImagePreview imgSrc={ houseImages ? houseImages : []} />
            </View>
            <NoticeWidget title={"备注"} />
            <TextAreaWidget name="remarks" disabled={true} value={BZ} />
              {Status > 5 && (<View>
                <NoticeWidget
                  title={"搬家信息"}
                />
                <LabelWidget
                  title={"搬家人员"}
                  editable={false}
                  value={
                    MovingName ||
                    " "
                  }
                  required={false}
                  renderRight={false}
                />
                </View>)}
                {Status === 6 && 
                (<View>
                  <LabelWidget
                    title={"完成时间"}
                    editable={false}
                    value={dateFormat(CompleteTime) || " "}
                    required={false}
                    renderRight={false}
                  />
                  <NoticeWidget
                    title={"搬家图片"}
                  />
                  <View style={{ backgroundColor: CommonColor.color_white }}>
                    <ImagePreview imgSrc={ busImages ? busImages : [] } />
                  </View>
                  <NoticeWidget
                    title={"搬家备注"}
                  />
                  <TextAreaWidget
                    name="CleanRepairRemarks"
                    value={
                      MovingBZ ||
                      " "
                    }
                    disabled={true}
                  />
                </View>)
            }
            <MovingApplyTrack
              MovingApplyTrack={
                RenovationTrack
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
    } else {
      return(
        null
      )
    }

  }
}

const mapToProps = state => {
  return { movingDatil: state.movingDetail }
}

export default withNavigation(connect(mapToProps)(MovingApplyDetail))
