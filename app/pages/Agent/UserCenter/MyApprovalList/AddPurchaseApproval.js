import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native'
import Toast from 'react-native-root-toast'
import Header from '../../../../components/Header'
import { CGBApprovalOperation } from '../../../../api/approval'
import { GiftedForm } from '../../../../components/Form/GiftedForm'
import { connect } from 'react-redux'
import { FullModal } from '../../../../components'
import store from '../../../../redux/store/store'
import { withNavigation } from 'react-navigation'
import { updateList } from '../../../../redux/actions/list'
import { DisplayStyle } from '../../../../styles/commonStyles'

class AddPurchaseApproval extends Component {
  constructor(props) {
    super(props)
    this.EnumAuditStatus = [
      {
        label: '通过',
        value: 1
      },
      {
        label: '不通过',
        value: 2
      }
    ]
    this.state = {
      auditStatus: 1,
      auditRemark: '',
      loading: false
    }
    this.KeyID = this.props.navigation.getParam('KeyID', '')
    this.Type = this.props.navigation.getParam('Type', '')
  }

  toastMsg = msg => {
    Toast.show(msg, {
      duration: 820,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    })
  }

  auditStatusChange(val) {
    this.setState({
      auditStatus: val
    })
  }

  auditRemarkChange(val) {
    this.setState({
      auditRemark: val
    })
  }

  submitForm() {
    let isPassValidate = true
    if (!this.state.auditStatus) {
      this.toastMsg('请选择审核状态')
      isPassValidate = false
    }
    if (
      this.state.auditStatus &&
      this.state.auditStatus === 2 &&
      this.state.auditRemark === ''
    ) {
      this.toastMsg('驳回请填写备注')
      isPassValidate = false
    }
    if (isPassValidate) {
      this.setState({
        loading: true
      })
      const postData = {
        Operation: this.state.auditStatus,
        AuditRemark: this.state.auditRemark,
        KeyID: this.KeyID,
        Type: this.Type,
        ViewState: 2
      }
      CGBApprovalOperation(postData)
        .then(res => {
          this.setState({
            loading: false
          })
          this.toastMsg('审核成功')
          const data = this.props.allList['CGBApprovalList'].find(item => {
            return item.KeyID === this.KeyID
          })
          this.props.dispatch(
            updateList({
              key: 'CGBApprovalList',
              KeyID: this.KeyID,
              data: {
                ...data,
                ReviewedStatus: this.state.auditStatus === 1 ? 2 : 3
              }
            })
          )
          this.props.navigation.navigate('AgentPurchaseApproval')
        })
        .catch(() => {
          this.setState({
            loading: false
          })
        })
    }
  }

  render() {
    return (
      <View style={style.excute_audit}>
        <Header title='确认审核' />
        <ScrollView
          ref='container'
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='never'
          style={style.audit_form_container}
        >
          <GiftedForm formName='ExcuteAuditForm' clearOnClose={true}>
            <GiftedForm.PickerWidget
              name='AuditStatus'
              title='审批操作'
              onPickerConfirm={val => {
                this.auditStatusChange(val)
              }}
              data={this.EnumAuditStatus}
              value={this.state.auditStatus}
            />
            <GiftedForm.NoticeWidget title={`备注`} />
            <GiftedForm.TextAreaWidget
              name='AuditRemark'
              required={false}
              placeholder='请输入备注信息'
              maxLength={100}
              onChangeText={this.auditRemarkChange.bind(this)}
              value={this.state.auditRemark}
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

const style = StyleSheet.create({
  excute_audit: {
    flex: 1,
    backgroundColor: '#F6F6F6'
  },
  audit_form_container: {
    flex: 1
    // ...DisplayStyle('column','stretch','space-between')
  },
  audit_form: {},
  page_bottom: {
    height: 80,
    padding: 15,
    backgroundColor: '#fff'
  },
  page_bottom_btn: {
    flex: 1,
    ...DisplayStyle('row', 'center', 'center'),
    backgroundColor: '#389ef2',
    borderRadius: 5
  },
  page_btn_text: {
    color: '#fff',
    fontSize: 20
  },
  select_next: {
    flex: 1,
    marginTop: 15,
    ...DisplayStyle('row', 'center', 'space-between'),
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    paddingHorizontal: 15
  },
  select_next_title: {
    color: '#000',
    fontSize: 15
  },
  select_next_btn: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  select_next_text: {
    color: '#999999',
    marginRight: 10
  }
})

const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(AddPurchaseApproval))
