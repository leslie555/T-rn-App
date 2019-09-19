import React, { Component } from 'react'
import {View, Alert, Platform} from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { ButtonGroup, Header, UploadFile } from '../../../../components'
import {
  AddFitment, EditFitment, FindFitment
} from '../../../../api/house'
import Toast from 'react-native-root-toast';
import { dateFormat } from '../../../../utils/dateFormat'
import { validateNumber } from '../../../../utils/validate'
import FullModal from "../../../../components/FullModal";

export default class SetFixtures extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.formName = 'addOrderForm'
    this.state = {
      isEdit: false,
      isShowModal: true,
      ImageUpload: [],
      isShowMoney: false,
      isAddLoading: false,
      isEditLoading: false,
      isDeleteLoading: false,
      isSignUpLoading: false,
      IsDecorating: '',
      KeyID: 0,
      AuditStatus: '',
      HouseName: '',
      btnOption: [
        { label: '设置装修', value: 'Edit' }
      ],
      form: {
        KeyID: '',
        RentDate: [],
        ReceivablesDate: '',
        DecorateMoeny: '',
        LoanMoeny: '',
        ActDecorateEndTime: '', // 设置装修开始时间，
        ActDecorateStartTime: '', // 设置装修结束时间
        Remark: '',
        IsLoan: 0, // 是否设置装修
        DecoratePicIDList: [] // 图片列表
      }
    }
    this.EnumData = {
      IsLoan: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        }
      ]
    }
    this.houseInfo = {}
    // this.form = {
    //   OrderName: '',
    //   OrderPhone: '',
    //   LastSignDate: '',
    //   OrderMoney: '',
    //   ConvertionMoney: '',
    //   RentDate: '',
    //   Remark: ''
    // }
    this.headerTitle = '设置装修'
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  componentWillMount() {
    FindFitment({
      houseKey: this.props.navigation.state.params.HouseKey,
      houseID: this.props.navigation.state.params.HouseID
    }).then(res => {
      const data = res.Data
      if (!data) {
        this.setState({
          isEdit: false,
          isShowModal: false
        })
      } else {
        this.state.form = data
        this.state.form.ActDecorateStartTime = dateFormat(this.state.form.ActDecorateStartTime)
        this.state.form.ActDecorateEndTime = dateFormat(this.state.form.ActDecorateEndTime)
        this.state.form.LoanMoeny = this.state.form.LoanMoeny + ''
        this.state.form.DecorateMoeny = this.state.form.DecorateMoeny + ''
        this.state.form.ReceivablesDate = '2012-2-1'
        this.setState({
          form: this.state.form,
          isEdit: true,
          isShowModal: false,
          IsDecorating: data.IsDecorating,
          KeyID: data.KeyID,
          AuditStatus: data.AuditStatus
        })
      }
    })
  }
  componentWillUnmount() {
  }
  handleAddClick = () => {
    this.setState({
      isEditLoading: true
    })
    var isValid = true
    function toastMsg(msg) {
      Toast.show(msg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
    const values0 = GiftedFormManager.getValues('ruleForm0')
    debugger
    console.log(values0)
    if (!values0.ActDecorateStartTime) {
      isValid = false
      toastMsg('请选择装修开始时间')
    } else if (!values0.ActDecorateEndTime) {
      isValid = false
      toastMsg('请选择装修结束时间')
    } else if (!this.state.isEdit && !values0.ReceivablesDate) {
      isValid = false
      toastMsg('请选择收支时间')
    } else if (!validateNumber(values0.DecorateMoeny)) {
      isValid = false
      toastMsg('共用金额必须为数字')
    } else if (!values0.DecorateMoeny) {
      isValid = false
      toastMsg('共用金额不能为空')
    } else if (values0.IsLoan === 1 && !values0.LoanMoeny) {
      isValid = false
      toastMsg('贷款金额不能为空或0')
    } else if (this.state.ImageUpload.length === 0) {
      isValid = false
      toastMsg('请上传图片')
    }
    if (isValid) {
      if (this.state.isEdit) {
        EditFitment({
          KeyID: this.state.KeyID,
          AuditStatus: this.state.AuditStatus,
          IsDecorating: this.state.IsDecorating,
          HouseID: this.props.navigation.state.params.HouseID,
          HouseName: this.props.navigation.state.params.HouseName,
          ActDecorateStartTime: values0.ActDecorateStartTime,
          ActDecorateEndTime: values0.ActDecorateEndTime,
          DecorateMoeny: values0.DecorateMoeny,
          LoanMoeny: !values0.LoanMoeny ? '' : values0.LoanMoeny,
          IsLoan: values0.IsLoan,
          DecoratePicIDList: this.state.ImageUpload,
          Remark: values0.Remark
        }).then(res => {
          Toast.show('提交成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.setState({
            isEditLoading: false,
            isShowModal: false
          })
          this.props.navigation.goBack()
        })
      } else {
        AddFitment({
          HouseKey: this.props.navigation.state.params.HouseKey,
          AuditStatus: values0.AuditStatus,
          ReceivablesDate: values0.ReceivablesDate,
          IsDecorating: this.state.IsDecorating,
          HouseID: this.props.navigation.state.params.HouseID,
          HouseName: this.props.navigation.state.params.HouseName,
          ActDecorateStartTime: values0.ActDecorateStartTime,
          ActDecorateEndTime: values0.ActDecorateEndTime,
          DecorateMoeny: values0.DecorateMoeny,
          LoanMoeny: !values0.LoanMoeny ? '' : values0.LoanMoeny,
          IsLoan: values0.IsLoan,
          DecoratePicIDList: this.state.ImageUpload,
          Remark: values0.Remark
        }).then(res => {
          Toast.show('提交成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.setState({
            isEditLoading: false,
            isShowModal: false
          })
          this.props.navigation.goBack()
        })
      }
    } else {
      this.setState({
        isEditLoading: false,
        isShowModal: false
      })
    }
  }
  changeIsLoan(val) {
    this.state.form.IsLoan = val
    this.setState({
      form: this.state.form
    })
  }
  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    })
  }

  render() {
    const { form } = this.state
    return (
      <View style={{ flex: 1 }}>
        <FullModal visible={this.state.isShowModal}></FullModal>
        <Header title={this.headerTitle} />
        <GiftedForm
          formName='ruleForm0'// GiftedForm instances that use the same name will also share the same states
          clearOnClose={false} // delete the values of the form when unmounted
        >
          <GiftedForm.NoticeWidget title={`${this.props.navigation.state.params.HouseName}`} />
          <GiftedForm.DatePickerWidget
            name='ActDecorateStartTime'
            title='装修开始时间'
            value={form.ActDecorateStartTime}
          />
          <GiftedForm.DatePickerWidget
            name='ActDecorateEndTime'
            title='装修结束时间'
            value={form.ActDecorateEndTime}
          />
          {
            this.state.isEdit ? null : (
              <GiftedForm.DatePickerWidget
                name='ReceivablesDate'
                title='收支时间'
                value={form.ReceivablesDate}
              />
            )
          }
          <GiftedForm.TextInputWidget
            name='DecorateMoeny'
            title='共用金额(元)'
            keyboardType={this.numberPad}
            maxLength={10}
            value={form.DecorateMoeny}
          />
          <GiftedForm.PickerWidget
            name='IsLoan'
            title='是否使用装修贷'
            data={this.EnumData.IsLoan}
            value={form.IsLoan}
            onPickerConfirm={(val) => { this.changeIsLoan(val) }}
          />
          {
            this.state.form.IsLoan === 1 ? (
              <GiftedForm.TextInputWidget
                name='LoanMoeny'
                title='贷款金额(元)'
                keyboardType={this.numberPad}
                maxLength={10}
                value={form.LoanMoeny}
              />
            ) : null
          }
          <GiftedForm.NoticeWidget title='图片上传' />
          <UploadFile list={this.state.ImageUpload} type={`SetFixtures`}
            onChange={(data) => this.onUploadFileChange(data)}></UploadFile>
          <GiftedForm.NoticeWidget title='装修备注' />
          <GiftedForm.TextAreaWidget
            name='Remark'
            required={false}
            placeholder='请输入备注信息'
            maxLength={100}
            value={form.Remark}
          />
        </GiftedForm>
        <ButtonGroup
          options={this.state.btnOption}
          handleEditClick={this.handleAddClick}
          isEditLoading={this.state.isEditLoading}
        />
      </View>
    )
  }
}
