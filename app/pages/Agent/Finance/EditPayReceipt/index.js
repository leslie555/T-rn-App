import React, {Component} from 'react'
import {Button, Text, TouchableOpacity, View, Alert} from 'react-native'
import styles from './style'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {FullModal, Header} from '../../../../components'
import ButtonGroup from '../../../../components/ButtonGroup'
import {connect} from 'react-redux'
import Toast from 'react-native-root-toast'
import {
  AddPaymentSingleNew,
  AddReceiveSingleNew,
  EditPaymentSingleNew,
  EditReceiveSingleNew,
  GetBillListData,
  GetPaymentDetailsNew,
  GetReceiptDetailsNew
} from '../../../../api/payReceipt'
import {dateFormat} from "../../../../utils/dateFormat";
import store from "../../../../redux/store/store";
import UploadFile from "../../../../components/UploadFile";
import {addList, updateList} from "../../../../redux/actions/list";
import {showSelectAny} from "../../../../components/SelectAny/util";

class EditOwnerResource extends React.Component {
  constructor(props) {
    super(props)
    this.editType = 0 // 0新增 1修改
    this.busType = 0 // 0收款 1付款
    this.KeyID = '' // 修改用的id
    this.title = ''
    this.saveFn = null
    this.btnOptions = []
    this.BillList = []
    this.EnumData = {
      AccountType: []
    }
    this.EnumProps = {
      label: 'Description',
      value: 'Value'
    },
    this.billDataLength = 0,
    this.state = {
      form: {
        HouseName: '',
        HouseKey: '',
        HouseID: '',
        PaymentMoney: 0,
        PaymentData: '',
        BalanceType: 0,
        EdName: '',
        StoreManager: '',
        Remarks: ''
      },
      ImageUpload: [],
      SelectBillList: [],
      loading: false
    }
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          // 选择房源数据拦截
          if (payload.state.params && payload.state.params.houseInfo) {
            const obj = JSON.parse(payload.state.params.houseInfo)
            if (+this.state.form.HouseID !== +obj.KeyID) {
              this.selectHouse(obj)
            }else{
              // 选择账单数据拦截
              if (payload.state.params && payload.state.params.billData) {
                const obj = JSON.parse(payload.state.params.billData)
                this.busType = payload.state.params.billBusType
                this.billDataLength = payload.state.params.billDataLength
                this.selectDetails(obj)
              }
            }
          }
        }
    )
  }

  componentWillMount() {
    this.initEnumData()
    this.initData()
  }

  initEnumData() {
    const AccountType = this.props.enumList.EnumAccountType.slice()
    this.EnumData.AccountType = AccountType
  }

  initData() {
    this.editType = this.props.navigation.getParam('editType', 0)
    this.busType = this.props.navigation.getParam('busType', 0)
    this.KeyID = this.props.navigation.getParam('KeyID', '')
    if (this.editType === 0) {
      this.title = '新增'
      // this.saveFn = AddReceiveSingleNew
      // if (this.busType === 1) {
      //   this.saveFn = AddPaymentSingleNew
      // }
    } else {
      this.title = '修改收款单'
      this.getDetail(this.KeyID)
      this.state.form.KeyID = this.KeyID
      this.saveFn = EditReceiveSingleNew
      if (this.busType === 1) {
        this.title = '修改付款单'
        this.saveFn = EditPaymentSingleNew
      }
    }
    this.btnOptions.push({label: this.editType === 0 ? '保存' : '修改', value: 'Save'})
  }

  getDetail(id) {
    this.setState({
      loading: true
    })
    const fn = this.busType === 0 ? GetReceiptDetailsNew : GetPaymentDetailsNew
    fn({
      KeyID: id
    }).then(({Data}) => {
      const SelectBillList = Data.Details
      delete Data.Details
      Data.PaymentData = dateFormat(Data.PaymentData)
      this.state.form = Data
      this.setState({
        loading: false,
        ImageUpload: Data.Pic || []
      })
      this.selectHouse({
        HouseName: Data.HouseName,
        HouseKey: Data.HouseKey,
        KeyID: Data.HouseID
      }, 1)
      this.selectDetails(SelectBillList, 1)
    })
  }

  getBillList(data, type = 0) {
    GetBillListData(data).then(({Data}) => {
      this.BillList = Data
      let obj = {}
      if (type === 0) {
        obj = {
          SelectBillList: [],
          loading: false
        }
      } else {
        obj = {
          loading: false
        }
      }
      this.setState(obj)
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 12
      },
      rightLabel: 'TenantName',
      path: 'AgentEditPayReceipt',
      returnKey: 'houseInfo',
      placeholder: '输入房源关键字或合同号进行搜索'
    })
  }

  selectHouse(obj, type = 0) {
    if (this.state.form.HouseID !== obj.KeyID || type === 1) {
      this.setState({
        loading: true,
        form: {
          ...this.state.form,
          HouseName: obj.HouseName,
          HouseKey: obj.HouseKey,
          HouseID: obj.KeyID,
          PaymentMoney: 0
        }
      })
      this.getBillList({
        houseID: obj.KeyID,
        HouseName: obj.HouseName,
        inOrOut: 0
      }, type)
    }
  }

  showSelectDetailsFn() {
    if (!this.state.form.HouseKey) {
      Toast.show(`请先选择房源`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    if (this.BillList.length === 0) {
      Toast.show(`该房源暂无账单明细`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.props.navigation.navigate('AgentEditBillDetails', {
      path: 'AgentEditPayReceipt',
      data: this.BillList,
      selectData: this.state.SelectBillList,
      editType: this.editType,
      busType: this.busType
    })
  }

  selectDetails(obj, type = 0) {
    if (type === 0) {
      const total = obj.reduce((total, x) => {
        let flag = -1
        if (this.busType === 0 && x.InOrOut === 1 || this.busType === 1 && x.InOrOut === 2) {
          flag = 1
        }
        return total + flag * x.PaidMoney
      }, 0)
      this.setState({
        SelectBillList: obj,
        form: {
          ...this.state.form,
          PaymentMoney: total
        }
      })
    } else {
      this.setState({
        SelectBillList: obj
      })
    }
  }

  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    })
  }

  changeStore(data) {
    // 修改store
    // this.props.dispatch(updatePayReceiveList({
    //     KeyID: data.KeyID,
    //     EditType: this.editType,//新增0，修改1
    //     BusType: this.busType,//收款0，付款1
    //     BillContent: {
    //         PaymentData: data.PaymentData,
    //         VerificationStatus: data.VerificationStatus,
    //         ProjectName: data.ProjectName,
    //         ContractNumber: data.ContractNumber,
    //         PaymentMoney: data.PaymentMoney,
    //         PaidMoney: data.PaidMoney,
    //         UnPaidMoney: data.UnPaidMoney,
    //         HouseName: data.HouseName
    //     }
    // }))
    // editType 新增0，修改1
    // busType 收款0，付款1
    if (this.editType) {
      store.dispatch(updateList({
        key: this.busType ? 'AgentPayReceiptList_pay' : 'AgentPayReceiptList_receive',
        KeyID: data.KeyID,
        data: {
          PaymentData: data.PaymentData,
          VerificationStatus: data.VerificationStatus,
          ProjectName: data.ProjectName,
          ContractNumber: data.ContractNumber,
          PaymentMoney: data.PaymentMoney,
          PaidMoney: data.PaidMoney,
          UnPaidMoney: data.UnPaidMoney,
          HouseName: data.HouseName
        }
      }))
    } else {
      // 插入缓存数据
      store.dispatch(addList({
        key: this.busType ? 'AgentPayReceiptList_pay' : 'AgentPayReceiptList_receive',
        data: {
          KeyID: data.KeyID,
          PaymentData: data.PaymentData,
          VerificationStatus: data.VerificationStatus,
          ProjectName: data.ProjectName,
          ContractNumber: data.ContractNumber,
          PaymentMoney: data.PaymentMoney,
          PaidMoney: data.PaidMoney,
          UnPaidMoney: data.UnPaidMoney,
          HouseName: data.HouseName
        }
      }))
    }
  }
  handleSaveTip() {
    // 大于本月 给出弹框
    const data = dateFormat(new Date()).split('-')
    const values0 = GiftedFormManager.getValues('EditPayReceiptRuleForm')
    console.log(this.state.form.PaymentData, values0.PaymentData)
    const PaymentData = dateFormat(values0.PaymentData).split('-')
    if ((Number(PaymentData[0]) === Number(data[0]) && Number(PaymentData[1]) > Number(data[1]) || Number(PaymentData[0]) > Number(data[0]))) {
      Alert.alert('温馨提示', `应${this.busType === 0 ? '收款日期' : '付款日期'}大于了本月,是否继续`, [
        {
            text: '取消', onPress: () => {
            }
        },
        {
            text: '确认', onPress: () => {
                this.handleSave()
            }
        }
    ], {cancelable: false})
    } else {
      this.handleSave()
    }
  }
  handleSave() {
    const validationResults0 = GiftedFormManager.validate('EditPayReceiptRuleForm')
    const values0 = GiftedFormManager.getValues('EditPayReceiptRuleForm')
    console.log(values0)
    if (validationResults0.isValid) {
      if (this.state.SelectBillList.length === 0) {
        Toast.show(`请选择明细`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      delete values0.Details
      this.state.form = {...this.state.form, ...values0, Pic: this.state.ImageUpload}
      this.setState({
        loading: true
      })
      // 根据选择确定方法
      if (this.editType === 0) {
        if (this.busType === 0) {
          this.saveFn = AddReceiveSingleNew
        } else {
          this.saveFn = AddPaymentSingleNew
        }
      }
      this.saveFn({
        [this.busType === 0 ? 'Receipt' : 'Payment']: this.state.form,
        Details: this.state.SelectBillList
      }).then(({Data}) => {
        const msg = this.editType === 0 ? '新增成功' : '修改成功'
        Toast.show(msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        this.changeStore(Data)
        this.props.navigation.navigate('AgentPayReceiptList', {
          type: this.busType
        })
      }).finally(() => {
        this.setState({
          loading: false
        })
      })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults0)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }

  render() {
    const {form} = this.state
    return (
        <View style={styles.resource_container}>
          <Header title={this.title}/>
          <FullModal visible={this.state.loading}/>
          <GiftedForm formName='EditPayReceiptRuleForm'>
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.LabelWidget
                name='HouseName'
                title='房源名称'
                placeholder='请选择'
                onLabelPress={() => {
                  this.showSelectHouseFn()
                }}
                value={form.HouseName}
            />
            <GiftedForm.LabelWidget
                name='Details'
                title='明细'
                placeholder='请选择'
                onLabelPress={() => {
                  this.showSelectDetailsFn()
                }}
                value={`已选择${this.billDataLength}个`}
            />
            <GiftedForm.TextInputWidget
                name='PaymentMoney'
                title='金额合计'
                maxLength={8}
                disabled={true}
                value={form.PaymentMoney + ''}
            />
            <GiftedForm.DatePickerWidget
                name='PaymentData'
                title='日期'
                value={form.PaymentData}
            />
            <GiftedForm.TextInputWidget
                name='EdName'
                title='主管'
                required={false}
                maxLength={10}
                value={form.EdName + ''}
            />
            <GiftedForm.TextInputWidget
                name='StoreManager'
                title='门店经理'
                required={false}
                maxLength={10}
                value={form.StoreManager + ''}
            />
            <GiftedForm.NoticeWidget title={`添加附件`}/>
            <UploadFile list={this.state.ImageUpload} type={`EditPayReceipt`}
                        onChange={(data) => this.onUploadFileChange(data)}/>
            <GiftedForm.NoticeWidget title={`备注`}/>
            <GiftedForm.TextAreaWidget
                name='Remarks'
                required={false}
                placeholder='请输入备注信息'
                maxLength={100}
                value={form.Remarks}
            />
          </GiftedForm>
          <View>
            <ButtonGroup
                options={this.btnOptions}
                handleSaveClick={() => this.handleSaveTip()}
            />
          </View>
        </View>
    )
  }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(EditOwnerResource)
