import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { FullModal, Header, ButtonGroup } from '../../../../components'
import Toast from 'react-native-root-toast'
import { withNavigation } from 'react-navigation'
import {
  QuerySubletAgreement,
  InsertSubletAgreement,
  EditSubletAgreement
} from '../../../../api/tenant'
import { Container } from '../../../../styles/commonStyles'
import { dateFormat } from '../../../../utils/dateFormat'
import { validateNumber } from '../../../../utils/validate'
class AgentEditSublease extends Component {
  constructor(props) {
    super(props)
    const getParam = this.props.navigation.getParam
    this.numberPad =
      Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
    this.btnOptions = [
      {
        label: '保存',
        value: 'Save'
      }
    ]
    this.editType = getParam('editType')
    this.state = {
      loading: false,
      form: {
        IsSave: 0,
        HouseID: null,
        HouseName: '',
        AgreePrice: '',
        OriginalRent: '', // 原房租价格
        OriginalDeposit: '', // 原租房押金
        StillNeedPay: '', // 还需支付费用
        RetreatSumAmount: '', // 实退金额共计
        RefundDate: '', // 退款日期
        AgreeExpireDate: '',
        SalesmanSignInfo: '',
        TenSignInfo: '',
        TenName: getParam('TenName'),
        BankAccount: '',
        OpenBankName: '',
        TenContractID: getParam('TenContractID')
      }
    }
  }
  ChangeStillNeedPay(text, type) {
    const Allvalues = GiftedFormManager.getValues('EditSubleaseRuleForm')
    // console.log('type', type)
    if (type === 'OriginalRent') {
      this.setState({
        form: {
          ...this.state.form,
          RetreatSumAmount:
            Number(text) +
            Number(Allvalues.OriginalDeposit) -
            Number(Allvalues.StillNeedPay)
        }
      })
    } else if (type === 'OriginalDeposit') {
      this.setState({
        form: {
          ...this.state.form,
          RetreatSumAmount:
            Number(Allvalues.OriginalRent) +
            Number(text) -
            Number(Allvalues.StillNeedPay)
        }
      })
    } else {
      this.setState({
        form: {
          ...this.state.form,
          RetreatSumAmount:
            Number(Allvalues.OriginalRent) +
            Number(Allvalues.OriginalDeposit) -
            Number(text)
        }
      })
    }
  }
  render() {
    // debugger
    const { form } = this.state
    return (
      <View style={Container}>
        <Header title="转租协议" />
        <FullModal visible={this.state.loading} />
        <GiftedForm formName="EditSubleaseRuleForm">
          <GiftedForm.TextInputWidget
            name="AgreePrice"
            title="转租价格"
            required={true}
            keyboardType={this.numberPad}
            value={form.AgreePrice + ''}
            tail={'元/月'}
          />
          <GiftedForm.DatePickerWidget
            name="AgreeExpireDate"
            title="转租日期"
            placeholder="请选择"
            value={form.AgreeExpireDate}
            renderRight={false}
          />
          <GiftedForm.TextInputWidget
            name="OriginalRent"
            title="房租价格"
            required={true}
            keyboardType={this.numberPad}
            value={form.OriginalRent + ''}
            onChangeText={text => {
              console.log('text2:', text)
              this.ChangeStillNeedPay(text, 'OriginalRent')
            }}
            tail={'元/月'}
          />
          <GiftedForm.TextInputWidget
            name="OriginalDeposit"
            title="租房押金"
            required={true}
            onChangeText={text => {
              console.log('text2:', text)
              this.ChangeStillNeedPay(text, 'OriginalDeposit')
            }}
            keyboardType={this.numberPad}
            value={form.OriginalDeposit + ''}
            tail={'元'}
          />
          <GiftedForm.TextInputWidget
            name="StillNeedPay"
            title="需支付金额"
            required={true}
            onChangeText={text => {
              console.log('text3:', text)
              this.ChangeStillNeedPay(text, 'StillNeedPay')
            }}
            keyboardType={this.numberPad}
            value={form.StillNeedPay + ''}
            tail={'元'}
          />
          <GiftedForm.TextInputWidget
            name="RetreatSumAmount"
            title="实退金额总计"
            required={false}
            disabled={true}
            value={form.RetreatSumAmount}
            tail={'元'}
          />
          <GiftedForm.NoticeWidget title={`(房租+押金-需支付金额)`} />
          <GiftedForm.DatePickerWidget
            name="RefundDate"
            title="退款日期"
            placeholder="请选择"
            value={form.RefundDate}
            renderRight={false}
          />
          <GiftedForm.NoticeWidget title={`银行账户信息`} />
          <GiftedForm.TextInputWidget
            name="TenName"
            title="姓名"
            disabled={true}
            value={form.TenName}
            required={false}
          />
          <GiftedForm.TextInputWidget
            name="OpenBankName"
            title="开户行"
            required={true}
            value={form.OpenBankName}
          />
          <GiftedForm.TextInputWidget
            name="BankAccount"
            title="银行卡号"
            required={true}
            keyboardType={this.numberPad}
            value={form.BankAccount}
          />
        </GiftedForm>
        <ButtonGroup
          options={this.btnOptions}
          handleSaveClick={() => this.handleSave()}
        />
      </View>
    )
  }

  setLoading(isLoading) {
    this.setState({
      loading: isLoading
    })
  }

  componentDidMount() {
    this.setLoading(true)
    const TenContractID = this.state.form.TenContractID
    QuerySubletAgreement({ TenContractID })
      .then(({ Data }) => {
        if (Data) {
          const form = this.state.form
          form.IsSave = Data.IsSave
          form.AgreePrice = Data.AgreePrice || ''
          form.OriginalRent = Data.OriginalRent || ''
          form.OriginalDeposit = Data.OriginalDeposit || ''
          form.StillNeedPay = Data.StillNeedPay || ''
          form.RetreatSumAmount = Number(Data.OriginalRent) + Number(Data.OriginalDeposit) - Number(Data.StillNeedPay) || 0
          form.AgreeExpireDate = dateFormat(Data.AgreeExpireDate)
          form.RefundDate = dateFormat(Data.RefundDate)
          if (Data.IsSave === 1) {
            form.TenName = Data.TenName
          }
          form.HouseID = Data.HouseID
          form.HouseName = Data.HouseName
          form.OpenBankName = Data.OpenBankName
          form.BankAccount = Data.BankAccount
          this.setState({
            loading: false,
            form: this.state.form
          })
        } else {
          this.setLoading(false)
        }
      })
      .catch(() => {
        this.setLoading(false)
      })
  }

  handleSave() {
    const validationResults0 = GiftedFormManager.validate(
      'EditSubleaseRuleForm'
    )
    const values0 = GiftedFormManager.getValues('EditSubleaseRuleForm')
    if (validationResults0.isValid) {
      if (!this.validateForm(values0)) return
      const form = { ...this.state.form, ...values0 }
      const fn = form.IsSave === 0 ? InsertSubletAgreement : EditSubletAgreement
      this.setLoading(true)
      fn(form)
        .then(({ Data }) => {
          const msg = '保存成功'
          form.IsSave = 1
          Toast.show(msg, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.setLoading(false)
          this.props.navigation.navigate('AgentSubleaseDetail', {
            contractID: this.state.form.TenContractID
          })
        })
        .catch(() => {
          this.setLoading(false)
        })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults0)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }

  validateForm(form) {
    if (!validateNumber(Number(form.AgreePrice))) {
      Toast.show('转租价格只能填写数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    return true
  }
}

export default withNavigation(AgentEditSublease)
