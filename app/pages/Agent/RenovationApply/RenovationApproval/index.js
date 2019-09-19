import React, { Component } from "react"
import { Text, View, TouchableOpacity, ScrollView } from "react-native"
import Toast from "react-native-root-toast"
import Header from "../../../../components/Header"
import { ApprovalRenovationApplication } from "../../../../api/house"
import { GiftedForm } from "../../../../components/Form/GiftedForm"
import style from "./style.js"
import { connect } from "react-redux"
import { FullModal } from "../../../../components"
import store from "../../../../redux/store/store"
// import IconFont from "../../../../utils/IconFont"
import { withNavigation } from "react-navigation"
import { updateList } from "../../../../redux/actions/list"

class ConfirmAudit extends Component {
  constructor(props) {
    super(props)
    this.EnumApprovalStatus = [
      {
        label: "通过",
        value: 1,
      },
      {
        label: "驳回",
        value: 0,
      },
    ]
    this.state = {
      SubmissionDepartment: 1,
      ApprovalStatus: 1,
      ApprovalBZ: "",
      KeyID: "",
      HouseKey: this.props.navigation.getParam("HouseKey", ""),
      loading: false
    }
    this.toastMsg = this.toastMsg.bind(this)
  }

  componentDidMount() {
    const KeyID = this.props.navigation.getParam("id", "")
    if (KeyID) {
      this.setState({
        KeyID
      })
    }
  }

  toastMsg(msg) {
    Toast.show(msg, {
      duration: 820,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
        // this.props.navigation.goBack()
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      },
    })
  }

  auditStatusChange(val) {
    // console.log('val :', val);
    this.setState({
      ApprovalStatus: val,
    })
  }

  auditRemarkChange(val) {
    this.setState({
      ApprovalBZ: val,
    })
  }

  submitForm() {
    let isPassValidate = true
    // if (this.state.ApprovalStatus) {
    //   this.toastMsg("请选择审核状态")
    //   isPassValidate = false
    // }
    if (this.state.ApprovalStatus === 0 && this.state.ApprovalBZ === "") {
      this.toastMsg("驳回请填写备注")
      isPassValidate = false
    }
    if (isPassValidate) {
      this.setState({
        loading: true,
      })
      const postData = {}
      for (let [key, val] of Object.entries(this.state)) {
        if (key !== "loading") {
          postData[key] = val
        }
      }
      ApprovalRenovationApplication(postData)
        .then(res => {
          this.setState({
            loading: false,
          })
          if(res.Data === 1) {
            this.toastMsg("审核成功")
            const data = this.props.allList["AgentRenovationApplyList"].find(
              v => v.KeyID = this.state.KeyID
            )
            const status = this.state.ApprovalStatus
            if (status === 1) {
              data.Status = 3
            } else if (status === 0) {
              data.Status = 1
            }
              store.dispatch(
                updateList({
                  key: "AgentRenovationApplyList",
                  KeyID: this.state.KeyID,
                  data,
                })
              )
            this.props.navigation.navigate("AgentRenovationApplyList")            
          } else {
            this.toastMsg(`审核失败:${res.Msg || ""}`)
          }
        })
        .catch(() => {
          this.setState({
            loading: false,
          })
      })
    }
  }

  render() {
    return (
      <View style={style.excute_audit}>
        <Header title="确认审核" />
        <ScrollView
          ref="container"
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          style={style.audit_form_container}
        >
          <GiftedForm formName="ExcuteAuditForm" clearOnClose={true}>
            <GiftedForm.PickerWidget
              name="ApprovalStatus"
              title="审批操作"
              onPickerConfirm={val => {
                this.auditStatusChange(val)
              }}
              data={this.EnumApprovalStatus}
              value={this.state.ApprovalStatus}
            />
            <GiftedForm.NoticeWidget title={`备注`} />
            <GiftedForm.TextAreaWidget
              name="ApprovalBZ"
              required={false}
              placeholder="请输入备注信息"
              maxLength={100}
              onChangeText={this.auditRemarkChange.bind(this)}
              value={this.state.ApprovalBZ}
            />
          </GiftedForm>
        </ScrollView>
        <View style={style.page_bottom}>
          <TouchableOpacity
            style={style.page_bottom_btn}
            onPress={this.submitForm.bind(this)}
          >
            <Text style={style.page_btn_text}>提交</Text>
          </TouchableOpacity>
        </View>
        <FullModal visible={this.state.loading} />
      </View>
    )
  }
}

const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(ConfirmAudit))
