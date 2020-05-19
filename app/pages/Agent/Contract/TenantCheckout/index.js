import React from 'react'
import { Platform, Alert, View} from 'react-native'
import Toast from 'react-native-root-toast'
import styles from './style'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {FullModal, Header} from '../../../../components'
import {
  SelectTenCheckOutAgreement,
  UpdateTenCheckOutAgreement,
  InsertTenCheckOutAgreement
} from '../../../../api/tenant'
import ButtonGroup from '../../../../components/ButtonGroup'
import {dateFormat} from '../../../../utils/dateFormat'
import store from "../../../../redux/store/store";
import {updateContractDetail} from "../../../../redux/actions/contract";
import {validateNumber} from '../../../../utils/validate'

class TenantCheckout extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
    this.mapKey = {
      children: 'Children',
      label: 'Name',
      value: 'KeyID'
    }
    this.EnumData = {}
    this.query = this.props.navigation.state.params || {} // 路由参数 path,data
    this.IsSettle = [
      {
        label: '是',
        value: '1'
      },
      {
        label: '否',
        value: '0'
      }
    ]
    this.EnumProps = {
      label: 'label',
      value: 'value'
    }
    this.btnOptions = [{label: '保存', value: 'Save'}]
    this.KeyID = ''
    this.updateStatus = false
    this.state = {
      form: {
        WaterEndNumber: '', // 水表止数
        WaterMoney: '', // 水金额
        WaterIsSettle: '', // 水表是否结清
        ElectricityEndNumber: '', // 电表止数
        ElectricityMoney: '', // 电表金额
        ElectricityIsSettle: '', // 电表是否结清
        GasEndNumber: '', // 气止数
        GasMoney: '', // 气金额
        GasIsSettle: '', // 气是否结清
        NetWorkMoney: '', // 网金额
        NetWorkStartDate: '', // 网开始日期
        NetWorkEndDate: '', // 网截止日期
        NetWorkIsSettle: '', // 网是否结清
        ManageMoney: '', // 物管金额
        ManageStartDate: '', // 物管截止日期
        ManageEndDate: '', // 物管截止日期
        ManageIsSettle: '', // 物管是否结清
        CleanMoney: '', // 保洁金额
        CleanStartDate: '', // 保洁截止日期
        CleanEndDate: '', // 保洁截止日期
        CleanIsSettle: '', // 保洁是否结清
        DoorCardCount: '', // 门卡
        WaterCardCount: '', // 水卡
        ElecCardCount: '', // 电卡
        KeyCount: '', // 钥匙把数
        KeyPlacement: '', // 钥匙放置处
        ExpireLiveDate: [], // 到期多居住时间
        ExpireLiveStartDate: '', // 到期多居住开始时间
        ExpireLiveEndDate: '', // 到期多居住结束时间
        ExpireLiveDay: '', // 到期多居住
        ExpireLiveDayMoney: '', // 共计金额
        DefaultMoney: '', // 违约退房金额
        DefaultDate: [], // 违约退房日期
        DefaultStartDate: '', // 违约退房开始日期
        DefaultEndDate: '', // 违约退房结束日期
        RepairMoney: '', // 维修共计金额
        NeedPay: '', // 需支付费用
        HouseRent: '', // 房租
        HouseDeposit: '', // 房屋押金
        BankAccount: '', // 客户银行卡号
        OpenBankName: '', // 开户行
        TenBankName: '', // 户名
        PaymentDay: '', // 款项还款日
        CheckOutDate: '', // 退房日期
        DefaultPrepayment: '', // 水电气预付金
        DefaultAgreeRemoveDate: '', // 租客搬离日期
        DefaultReturnMonry: '', // 退还金额
        HouseName: '',
        ReceivablesDate: '',
        VoucherID: '',
        IsBreachContractMark: false,
        IsHouse: 1,
        Equipment: [], // 1 为损坏 0 正常
        getActualReceive: ''
      },
      BookKeepProjectList: [],
      billProject: [],
      ImageUpload: [],
      billLoading: false,
      TenantConTractQuipmentGood: [], //好的房屋设备
      TenantConTractQuipmentBad: [], //坏的房屋设备
    }
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          // 设备清单数据拦截
          if (payload.state.params && payload.state.params.equipmentInfo) {
            const data = JSON.parse(payload.state.params.equipmentInfo)
            if(data.isSettle === 0) {
              this.setState({
                TenantConTractQuipmentGood: data.data
              })
            }else{
              this.setState({
                TenantConTractQuipmentBad: data.data
              })
            }
          }
        }
    )
  }

  componentDidMount() {
    this.initData()
    console.log('this.query:', this.query)
  }
  componentDidUpdate() {
    this.getActualReceiveFn()
    this.getAllMoney()
  }
  getActualReceiveFn() {
    const {form} = this.state
    return Number(form.HouseRent) + Number(form.HouseDeposit) - this.getAllMoney()
  }
  getAllMoney() {
    const {form} = this.state
    const allCount = Number(form.WaterMoney) +
    Number(form.ElectricityMoney) +
    Number(form.GasMoney) +
    Number(form.NetWorkMoney) +
    Number(form.ManageMoney) +
    Number(form.CleanMoney) +
    Number(form.ExpireLiveDayMoney) +
    Number(form.DefaultMoney) +
    Number(form.RepairMoney)
    return allCount
  }

  initData() {
    this.setState({
      billLoading: true
    })
    SelectTenCheckOutAgreement({
      KeyID: this.query.contractID,
      IsDefault: this.query.IsDefault,
      HouseKey: this.query.houseInfo.HouseKey
    }).then(res => {
      const { Data } = res
      if (res.Code === 0) {
        this.KeyID = res.Data.KeyID
        if (res.Data.KeyID === 0) {
          this.updateStatus = false // KeyID等于0， 保存时为新增状态
          this.setState({
            billLoading: false
          })
        } else {
          const { form } = this.state
          // this.form = {...Data}
          this.updateStatus = true, // KeyID大于0， 保存时为修改状态
          form.WaterEndNumber = Data.WaterEndNumber || '', // 水止数
          form.WaterMoney = Data.WaterMoney || '', // 水金额
          form.WaterIsSettle = Data.WaterIsSettle || 0, // 水是否结清
          form.ElectricityEndNumber = Data.ElectricityEndNumber || '', // 电止数
          form.ElectricityMoney = Data.ElectricityMoney || '', // 电金额
          form.ElectricityIsSettle = Data.ElectricityIsSettle || 0, // 电是否结清
          form.GasEndNumber = Data.GasEndNumber || '', // 气止数
          form.GasMoney = Data.GasMoney || '', // 气金额
          form.GasIsSettle = Data.GasIsSettle || 0, // 气是否结清
          form.NetWorkStartDate = dateFormat(Data.NetWorkStartDate), // 网开始日期
          form.NetWorkEndDate = dateFormat(Data.NetWorkEndDate), // 网截止日期
          form.NetWorkMoney = Data.NetWorkMoney || '', // 网金额
          form.NetWorkIsSettle = Data.NetWorkIsSettle || 0, // 网是否结清
          form.ManageStartDate = dateFormat(Data.ManageStartDate), // 物管开始日期
          form.ManageEndDate = dateFormat(Data.ManageEndDate), // 物管截止日期
          form.ManageMoney = Data.ManageMoney || '', // 物管金额
          form.ManageIsSettle = Data.ManageIsSettle || 0, // 物管是否结清
          form.CleanStartDate = dateFormat(Data.CleanStartDate), // 保洁开始日期
          form.CleanEndDate = dateFormat(Data.CleanEndDate), // 保洁截止日期
          form.CleanMoney = Data.CleanMoney || '', // 保洁金额
          form.CleanIsSettle = Data.CleanIsSettle || 0, // 保洁是否结清
          form.DoorCardCount = Data.DoorCardCount || '', // 门卡
          form.WaterCardCount = Data.WaterCardCount || '', // 水卡
          form.ElecCardCount = Data.ElecCardCount || '', // 电卡
          form.KeyCount = Data.KeyCount || '', // 钥匙把数
          form.KeyPlacement = Data.KeyPlacement, // 钥匙放置处
          form.ExpireLiveDay = Data.ExpireLiveDay || '', // 到期多居住
          form.ExpireLiveDate = [dateFormat(Data.ExpireLiveStartDate), dateFormat(Data.ExpireLiveEndDate)], // 到期多居住日期
          form.ExpireLiveStartDate = dateFormat(Data.ExpireLiveStartDate), // 到期多居住开始日期
          form.ExpireLiveEndDate = dateFormat(Data.ExpireLiveEndDate), // 到期多居住结束日期
          form.ExpireLiveDayMoney = Data.ExpireLiveDayMoney || '', // 共计金额
          form.DefaultDate = [dateFormat(Data.DefaultStartDate), dateFormat(Data.DefaultEndDate)], // 违约退房日期
          form.DefaultStartDate = dateFormat(Data.DefaultStartDate), // 违约退房开始日期
          form.DefaultEndDate = dateFormat(Data.DefaultEndDate), // 违约退房结束日期
          form.DefaultMoney = Data.DefaultMoney || '', // 违约退房金额
          form.RepairMoney = Data.RepairMoney || '', // 维修共计金额
          form.NeedPay = Data.NeedPay || '', // 需支付费用
          form.HouseRent = Data.HouseRent || '', // 需支付费用
          form.HouseDeposit = Data.HouseDeposit || '', // 需支付费用
          form.BankAccount = Data.BankAccount, // 客户银行卡号
          form.OpenBankName = Data.OpenBankName, // 开户行
          form.TenBankName = Data.TenBankName, // 户名
          form.PaymentDay = dateFormat(Data.PaymentDay), // 款项还款日
          form.CheckOutDate = dateFormat(Data.CheckOutDate), // 退房当天日期
          form.DefaultPrepayment = Data.DefaultPrepayment || '', // 水电气预付金
          form.DefaultAgreeRemoveDate = dateFormat(Data.DefaultAgreeRemoveDate), // 租客搬离日期
          form.DefaultReturnMonry = Data.DefaultReturnMonry || '', // 退还金额
          this.state.TenantConTractQuipmentBad = Data.Equipment.filter(x=>x.EquipmentState===1)
          this.state.TenantConTractQuipmentGood = Data.Equipment.filter(x=>x.EquipmentState===0)
          this.setState({
            form,
            TenantConTractQuipmentBad: this.state.TenantConTractQuipmentBad,
            TenantConTractQuipmentGood: this.state.TenantConTractQuipmentGood,
            billLoading: false
          })
        }
      }
      console.log('查询详情Data:', res)
    }).catch(() => {
      this.setState({
        billLoading: false
      })
    })
  }
  addContractEquipmentList(issettle) {
    this.props.navigation.navigate('AgentCheckOutCostProject', {
      path: 'AgentTenantCheckout',
      isSettle: issettle,
      data: issettle===0?this.state.TenantConTractQuipmentGood:this.state.TenantConTractQuipmentBad
    })
  }
  HostExpireLiveChange(value) {
    console.log(value)
    this.state.form.ExpireLiveStartDate = value[0]
    this.state.form.ExpireLiveEndDate = value[1]
    if (value[1]) {
      const resultDate = this.getDaysBetween(value[0], value[1])
      this.state.form.ExpireLiveDay = resultDate
    }
    this.setState({
      form: {...this.state.form}
    })
  }
  getDaysBetween(start, end) {
    const startDate = new Date(start).getTime()
    const endDate = new Date(end).getTime()
    const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
    return days
  }
  handleSave() {
    const validationResults = GiftedFormManager.validate('TenantCheckOutContractForm')
    if (validationResults.isValid) {
      const Allvalues = GiftedFormManager.getValues('TenantCheckOutContractForm')
      const options1 = {
        min: 0,
        max: 1000000
      }
      if (!validateNumber(Allvalues.DefaultPrepayment)) {
        Toast.show('水电气预付金只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.DefaultReturnMonry)) {
        Toast.show('违约退还金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.WaterMoney)) {
        Toast.show('水金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.ElectricityMoney)) {
        Toast.show('电金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.GasMoney)) {
        Toast.show('气金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.NetWorkMoney)) {
        Toast.show('网费金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.ManageMoney)) {
        Toast.show('物管卫生金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.CleanMoney)) {
        Toast.show('保洁费用金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.ExpireLiveDayMoney, options1)) {
        Toast.show('到期多居住金额只能是大于0的数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.DefaultMoney, options1)) {
        Toast.show('违约退房金额只能是大于0的数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (!validateNumber(Allvalues.RepairMoney, options1)) {
        Toast.show('维修共计金额只能是大于0的数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      console.log('Allvalues:', Allvalues)
      if (Allvalues.ExpireLiveDayMoney > 0 && (!Allvalues.ExpireLiveDate[0] || !Allvalues.ExpireLiveDate[1])) {
        Toast.show('到期多居住日期不能为空!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      if (Allvalues.DefaultMoney > 0 && (!Allvalues.DefaultDate[0] || !Allvalues.DefaultDate[1])) {
        Toast.show('违约退房日期不能为空!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
      this.state.form.DefaultStartDate = Allvalues.DefaultDate[0]
      this.state.form.DefaultEndDate = Allvalues.DefaultDate[1]
      this.state.form = {...this.state.form, ...Allvalues}
      const {form} = this.state
      console.log('this.state.form:', this.state.form)
      const ID = this.KeyID !== 0 ? this.KeyID : this.query.contractID
      this.setState({
        billLoading: true
      })
      const apiRequest = this.updateStatus === true ? UpdateTenCheckOutAgreement : InsertTenCheckOutAgreement
      apiRequest({
        KeyID: ID,
        TenContractID: this.query.contractID,
        IsDefault: this.query.IsDefault,
        HouseName: this.query.houseInfo.HouseName,
        HouseID: this.query.houseInfo.HouseID,
        HouseKey: this.query.houseInfo.HouseKey,
        WaterEndNumber: form.WaterEndNumber, // 水止数
        WaterMoney: form.WaterMoney, // 水金额
        WaterIsSettle: form.WaterIsSettle, // 水是否结清
        ElectricityEndNumber: form.ElectricityEndNumber, // 电止数
        ElectricityMoney: form.ElectricityMoney, // 电金额
        ElectricityIsSettle: form.ElectricityIsSettle, // 电是否结清
        GasEndNumber: form.GasEndNumber, // 气止数
        GasMoney: form.GasMoney, // 气金额
        GasIsSettle: form.GasIsSettle, // 气是否结清
        NetWorkStartDate: dateFormat(form.NetWorkStartDate), // 网开始日期
        NetWorkEndDate: dateFormat(form.NetWorkEndDate), // 网截止日期
        NetWorkMoney: form.NetWorkMoney, // 网金额
        NetWorkIsSettle: form.NetWorkIsSettle, // 网是否结清
        ManageStartDate: dateFormat(form.ManageStartDate), // 物管卫生开始日期
        ManageEndDate: dateFormat(form.ManageEndDate), // 物管卫生截止日期
        ManageMoney: form.ManageMoney, // 物管卫生金额
        ManageIsSettle: form.ManageIsSettle, // 物管卫生是否结清
        CleanStartDate: dateFormat(form.CleanStartDate), // 保洁费用开始日期
        CleanEndDate: dateFormat(form.CleanEndDate), // 保洁费用截止日期
        CleanMoney: form.CleanMoney, // 保洁费用金额
        CleanIsSettle: form.CleanIsSettle, // 保洁费用是否结清
        DoorCardCount: form.DoorCardCount, // 门卡张数
        WaterCardCount: form.WaterCardCount, // 水卡张数
        ElecCardCount: form.ElecCardCount, // 电卡张数
        KeyCount: form.KeyCount, // 钥匙数量
        KeyPlacement: form.KeyPlacement, // 钥匙放置处
        ExpireLiveStartDate: form.ExpireLiveStartDate, // 到期多居住开始时间
        ExpireLiveEndDate: form.ExpireLiveEndDate, // 到期多居住结束时间
        ExpireLiveDay: form.ExpireLiveDay, // 到期多居住天数
        ExpireLiveDayMoney: form.ExpireLiveDayMoney, // 到期多居住金额
        DefaultStartDate: form.DefaultStartDate, // 违约退房开始时间
        DefaultEndDate: form.DefaultEndDate, // 违约退房结束时间
        DefaultMoney: form.DefaultMoney, // 违约退房金额
        RepairMoney: form.RepairMoney, // 维修共计金额
        NeedPay: this.getAllMoney() + '', // 需支付费用
        HouseRent: form.HouseRent, // 房租
        HouseDeposit: form.HouseDeposit, // 房租
        BankAccount: form.BankAccount, // 客户银行卡号
        TenBankName: form.TenBankName, // 户名
        OpenBankName: form.OpenBankName, // 开户行
        PaymentDay: dateFormat(form.PaymentDay), // 款项还款日
        CheckOutDate: dateFormat(form.CheckOutDate), // 退房当天日期
        ActualReceive: this.getActualReceiveFn(),
        DefaultPrepayment: form.DefaultPrepayment, // 违约退房-水电气预付金
        DefaultAgreeRemoveDate: dateFormat(form.DefaultAgreeRemoveDate), // 违约退房-约定搬离日期
        DefaultReturnMonry: form.DefaultReturnMonry, // 违约退房-退还租金和押金
        Equipment: [...this.state.TenantConTractQuipmentBad, ...this.state.TenantConTractQuipmentGood]
      }).then(res => {
        this.updateStatus = true
        this.setState({
          billLoading: false
        },() => {
          store.dispatch(
            updateContractDetail({
              key: 'TenantContractOperate',
              data: {
                IsBreachContract: this.query.IsDefault
              }
            })
          )
          setTimeout(()=>{
            Alert.alert('温馨提示', this.query.IsSafeEdit ? '修改成功':'退房成功,前往签字页面', [
              {
                text: '确认', onPress: () => {
                  this.props.navigation.navigate('AgentCheckOutDetail', {
                    contractID: this.query.contractID
                  })
                }
              }
            ], {cancelable: false})
          },100)
        })
        console.log('修改或新增res:', res)
      }).catch(() => {
        this.setState({
          billLoading: false
        })
      })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }

  render() {
    const { form } = this.state
    return (
        <View style={styles.check_container}>
          <Header title={`退房收款清单`}/>
          <FullModal visible={this.state.billLoading}/>
          <GiftedForm formName='TenantCheckOutContractForm'>
            <GiftedForm.SeparatorWidget/>
            {this.query.IsDefault === 1 &&
            <GiftedForm.NoticeWidget title={`违约退房协议`} />}
            {this.query.IsDefault === 1 &&
            <GiftedForm.TextInputWidget
                name='DefaultPrepayment'
                title='水电气预付金'
                maxLength={20}
                required={false}
                keyboardType={this.numberPad}
                value={form.DefaultPrepayment + ''}
                tail={`元`}
            />}
            {this.query.IsDefault === 1 &&
            <GiftedForm.DatePickerWidget
                name='DefaultAgreeRemoveDate'
                title='租客搬离日期'
                required={false}
                value={form.DefaultAgreeRemoveDate}
            />}
            {this.query.IsDefault === 1 &&
            <GiftedForm.TextInputWidget
                name='DefaultReturnMonry'
                title='退还金额'
                maxLength={20}
                required={false}
                keyboardType={this.numberPad}
                value={form.DefaultReturnMonry + ''}
                tail={`元`}
            />}
            <GiftedForm.NoticeWidget title={`水表`} />
            <GiftedForm.TextInputWidget
                name='WaterEndNumber'
                title='水表止数'
                maxLength={20}
                required={false}
                keyboardType={this.numberPad}
                value={form.WaterEndNumber + ''}
            />
            <GiftedForm.TextInputWidget
                name='WaterMoney'
                title='水金额'
                keyboardType={this.numberPad}
                maxLength={20}
                required={false}
                value={form.WaterMoney + ''}
            />
            <GiftedForm.PickerWidget
                name='WaterIsSettle'
                title='是否结清'
                data={this.IsSettle}
                required={false}
                value={form.WaterIsSettle + ''}
                mapKey={this.EnumProps}
                onPickerConfirm={(data) => {
                  console.log('data:', data)
                  form.WaterIsSettle = data
                }}
            />
            <GiftedForm.NoticeWidget title={`电表`} />
            <GiftedForm.TextInputWidget
                name='ElectricityEndNumber'
                title='电表止数'
                maxLength={20}
                keyboardType={this.numberPad}
                required={false}
                value={form.ElectricityEndNumber + ''}
            />
            <GiftedForm.TextInputWidget
                name='ElectricityMoney'
                title='电金额'
                maxLength={20}
                required={false}
                keyboardType={this.numberPad}
                value={form.ElectricityMoney + ''}
            />
            <GiftedForm.PickerWidget
                name='ElectricityIsSettle'
                title='是否结清'
                data={this.IsSettle}
                required={false}
                value={form.ElectricityIsSettle + ''}
                mapKey={this.EnumProps}
                onPickerConfirm={(data) => {
                  form.ElectricityIsSettle = data
                }}
            />
            <GiftedForm.NoticeWidget title={`气表`} />
            <GiftedForm.TextInputWidget
                name='GasEndNumber'
                title='气表止数'
                maxLength={20}
                keyboardType={this.numberPad}
                required={false}
                value={form.GasEndNumber + ''}
            />
            <GiftedForm.TextInputWidget
                name='GasMoney'
                title='气金额'
                maxLength={20}
                required={false}
                keyboardType={this.numberPad}
                value={form.GasMoney + ''}
            />
            <GiftedForm.PickerWidget
                name='GasIsSettle'
                title='是否结清'
                data={this.IsSettle}
                required={false}
                value={form.GasIsSettle + ''}
                mapKey={this.EnumProps}
                onPickerConfirm={(data) => {
                  form.GasIsSettle = data
                }}
            />
            <GiftedForm.NoticeWidget title={`网费`} />
            <GiftedForm.DatePickerWidget
                name='NetWorkStartDate'
                title='开始日期'
                required={false}
                value={form.NetWorkStartDate}
            />
            <GiftedForm.DatePickerWidget
                name='NetWorkEndDate'
                title='截止日期'
                required={false}
                value={form.NetWorkEndDate}
            />
            <GiftedForm.TextInputWidget
                name='NetWorkMoney'
                title='金额'
                maxLength={20}
                keyboardType={this.numberPad}
                required={false}
                value={form.NetWorkMoney + ''}
            />
            <GiftedForm.PickerWidget
                name='NetWorkIsSettle'
                title='是否结清'
                data={this.IsSettle}
                required={false}
                value={form.NetWorkIsSettle + ''}
                mapKey={this.EnumProps}
                onPickerConfirm={(data) => {
                  form.NetWorkIsSettle = data
                }}
            />
            <GiftedForm.NoticeWidget title={`物管卫生`} />
            <GiftedForm.DatePickerWidget
                name='ManageStartDate'
                title='开始日期'
                required={false}
                value={form.ManageStartDate}
            />
            <GiftedForm.DatePickerWidget
                name='ManageEndDate'
                title='截止日期'
                required={false}
                value={form.ManageEndDate}
            />
            <GiftedForm.TextInputWidget
                name='ManageMoney'
                title='金额'
                maxLength={20}
                required={false}
                keyboardType={this.numberPad}
                value={form.ManageMoney + ''}
            />
            <GiftedForm.PickerWidget
                name='ManageIsSettle'
                title='是否结清'
                data={this.IsSettle}
                required={false}
                value={form.ManageIsSettle + ''}
                mapKey={this.EnumProps}
                onPickerConfirm={(data) => {
                  form.ManageIsSettle = data
                }}
            />
            <GiftedForm.NoticeWidget title={`保洁费用`} />
            <GiftedForm.DatePickerWidget
                name='CleanStartDate'
                title='开始日期'
                required={false}
                value={form.CleanStartDate}
            />
            <GiftedForm.DatePickerWidget
                name='CleanEndDate'
                title='截止日期'
                required={false}
                value={form.CleanEndDate}
            />
            <GiftedForm.TextInputWidget
                name='CleanMoney'
                title='金额'
                maxLength={20}
                keyboardType={this.numberPad}
                required={false}
                value={form.CleanMoney + ''}
            />
            <GiftedForm.PickerWidget
                name='CleanIsSettle'
                title='是否结清'
                data={this.IsSettle}
                required={false}
                value={form.CleanIsSettle + ''}
                mapKey={this.EnumProps}
                onPickerConfirm={(data) => {
                  console.log('data:', data)
                  form.CleanIsSettle = data
                }}
            />
            <GiftedForm.NoticeWidget />
            <GiftedForm.TextInputWidget
              name='DoorCardCount'
              title='门卡'
              maxLength={20}
              required={false}
              keyboardType={this.numberPad}
              value={form.DoorCardCount + ''}
              tail={`张`}
            />
            <GiftedForm.TextInputWidget
              name='WaterCardCount'
              title='水卡'
              maxLength={20}
              keyboardType={this.numberPad}
              required={false}
              value={form.WaterCardCount + ''}
              tail={`张`}
            />
            <GiftedForm.TextInputWidget
              name='ElecCardCount'
              title='电卡'
              maxLength={20}
              required={false}
              keyboardType={this.numberPad}
              value={form.ElecCardCount + ''}
              tail={`张`}
            />
            <GiftedForm.TextInputWidget
              name='KeyCount'
              title='钥匙'
              maxLength={20}
              keyboardType={this.numberPad}
              required={false}
              value={form.KeyCount + ''}
              tail={`把`}
            />
            <GiftedForm.TextInputWidget
              name='KeyPlacement'
              title='钥匙放置处'
              maxLength={20}
              required={false}
              value={form.KeyPlacement + ''}
            />
            <GiftedForm.NoticeWidget title={`到期多居住`} />
            {/* <GiftedForm.DatePickerWidget
                name='ExpireLiveStartDate'
                title='开始日期'
                required={true}
                value={form.ExpireLiveStartDate}
            />
            <GiftedForm.DatePickerWidget
                name='ExpireLiveEndDate'
                title='结束日期'
                required={true}
                value={form.ExpireLiveEndDate}
            /> */}
            <GiftedForm.DatePickerRangeWidget
              name="ExpireLiveDate"
              title="日期"
              cannotEqual
              required={false}
              value={form.ExpireLiveDate}
              onChangeText={(val) => {
                this.HostExpireLiveChange(val)
              }}
            />
            <GiftedForm.TextInputWidget
              name='ExpireLiveDay'
              title='天数'
              maxLength={20}
              required={false}
              disabled={true}
              keyboardType={this.numberPad}
              value={form.ExpireLiveDay + ''}
              tail={`天`}
            />
            <GiftedForm.TextInputWidget
              name='ExpireLiveDayMoney'
              title='共计金额'
              maxLength={20}
              required={false}
              keyboardType={this.numberPad}
              value={form.ExpireLiveDayMoney + ''}
              tail={`元`}
            />
            <GiftedForm.NoticeWidget title={`违约退房`} />
            {/* <GiftedForm.DatePickerWidget
                name='DefaultStartDate'
                title='开始日期'
                required={true}
                value={form.DefaultStartDate}
            />
            <GiftedForm.DatePickerWidget
                name='DefaultEndDate'
                title='结束日期'
                required={true}
                value={form.DefaultEndDate}
            /> */}
            <GiftedForm.DatePickerRangeWidget
              name="DefaultDate"
              title="日期"
              cannotEqual
              required={false}
              value={form.DefaultDate}
            />
            <GiftedForm.TextInputWidget
              name='DefaultMoney'
              title='金额'
              maxLength={20}
              keyboardType={this.numberPad}
              required={false}
              value={form.DefaultMoney + ''}
              tail={`元`}
            />
            <GiftedForm.NoticeWidget title='设施设备损坏维修' />
            <GiftedForm.LabelWidget
              title='损坏项目'
              required={false}
              value={this.state.TenantConTractQuipmentBad.length === 0 ? '请选择' : `已选择${this.state.TenantConTractQuipmentBad.length}个`}
              onLabelPress={() => {
                this.addContractEquipmentList(1)
              }}
            />
            <GiftedForm.LabelWidget
              title='正常项目'
              required={false}
              value={this.state.TenantConTractQuipmentGood.length === 0 ? '请选择' : `已选择${this.state.TenantConTractQuipmentGood.length}个`}
              onLabelPress={() => {
                this.addContractEquipmentList(0)
              }}
            />
            <GiftedForm.TextInputWidget
              name='RepairMoney'
              title='维修共计金额'
              maxLength={20}
              required={false}
              keyboardType={this.numberPad}
              value={form.RepairMoney + ''}
              tail={`元`}
            />
            <GiftedForm.NoticeWidget title='其他' />
            <GiftedForm.TextInputWidget
              name='HouseRent'
              title='房租'
              maxLength={20}
              required={false}
              keyboardType={this.numberPad}
              value={form.HouseRent + ''}
              tail={`元`}
            />
            <GiftedForm.TextInputWidget
              name='HouseDeposit'
              title='押金'
              maxLength={20}
              required={false}
              keyboardType={this.numberPad}
              value={form.HouseDeposit + ''}
              tail={`元`}
            />
            <GiftedForm.TextInputWidget
              name='NeedPay'
              title='需支付费用'
              maxLength={20}
              disabled={true}
              keyboardType={this.numberPad}
              required={false}
              value={this.getAllMoney() + ''}
              tail={`元`}
            />
            <GiftedForm.DatePickerWidget
                name='PaymentDay'
                title='款项还款日'
                required={true}
                value={form.PaymentDay}
            />
            <GiftedForm.DatePickerWidget
                name='CheckOutDate'
                title='退房当天日期'
                required={true}
                value={form.CheckOutDate}
            />
            <GiftedForm.NoticeWidget title='客户信息'/>
            <GiftedForm.TextInputWidget
              name='BankAccount'
              title='客户银行卡号'
              maxLength={20}
              required={true}
              keyboardType={this.numberPad}
              value={form.BankAccount + ''}
            />
            <GiftedForm.TextInputWidget
              name='OpenBankName'
              title='开户行'
              maxLength={20}
              required={true}
              value={form.OpenBankName + ''}
            />
            <GiftedForm.TextInputWidget
              name='TenBankName'
              title='户名'
              maxLength={20}
              required={true}
              value={form.TenBankName + ''}
            />
          </GiftedForm>
          <View>
            <ButtonGroup
                options={this.btnOptions}
                handleSaveClick={() => this.handleSave()}
            />
          </View>
        </View>
    )
  }
}

export default TenantCheckout
