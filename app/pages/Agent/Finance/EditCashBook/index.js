import React, {Component} from 'react'
import {Alert, Button, Platform, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {FullModal, Header} from "../../../../components";
import {InsertBookKeep, UpdateBookKeep} from "../../../../api/bill";
import ButtonGroup from "../../../../components/ButtonGroup";
import {connect} from 'react-redux'
import Toast from "react-native-root-toast";
import {deepCopy, fetchBillData, getTreeNodeByValue} from "../../../../utils/arrUtil";
import {validateNumber} from "../../../../utils/validate";
import {showSelectAny} from "../../../../components/SelectAny/util";
import UploadFile from "../../../../components/UploadFile";
import {dateFormat} from "../../../../utils/dateFormat";
import {addList, updateList} from "../../../../redux/actions/list";
import {updateAccountDetail} from "../../../../redux/actions/accountDetail";

class AddBookKeeping extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.query = this.props.navigation.state.params || {}
    this.mapKey = {
      children: 'Children',
      label: 'Name',
      value: 'KeyID'
    }
    this.EnumData = {}
    this.EnumProps = {
      label: 'Description',
      value: 'Value'
    }
    this.btnOptions = [{label: '保存', value: 'Save'}]
    this.currentBillProject = {}
    this.editForm = {}
    this.editType = 0 // 0新增 1修改
    this.state = {
      form: {
        IsHouse: true,
        HouseName: '',
        HouseID: '',
        HouseKey: '',
        RentType: 1,
        ReceivablesDate: '',
        InOrOut: this.query.busType,
        BillProjectIDMark: [],
        IsEntireHouse: false,
        Amount: '',
        ImageUpload: [],
        VoucherID: '',
        Remark: ''
      },
      billProject: [],
      loading: false
    }
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          // 房源数据拦截
          if (payload.state.params && payload.state.params.houseInfo) {
            this.selectHouse(JSON.parse(payload.state.params.houseInfo))
          }
        }
    )
  }

  componentWillMount() {
    this.initData()
    fetchBillData().then(({Data}) => {
      this.setState({
        billProject: Data
      },()=>{
        this.initForm()
      })
    })
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove()
  }

  initData() {
    const InOrOut = this.props.enumList.EnumInOrOut.slice()
    InOrOut.shift()
    this.EnumData = InOrOut
    // debugger
    const data = this.props.navigation.getParam('data', {})
    const editType = this.props.navigation.getParam('editType', 0) // 0新增 1 修改
    this.editForm = data
    this.editType = editType
  }

  initForm() {
    if (this.editType === 1) {
      const pathArr = getTreeNodeByValue(this.state.billProject, this.editForm.BillProjectID, {
        children: 'Children',
        value: 'KeyID',
        label: 'Name'
      }).pathArr
      this.state.form = {...this.editForm}
      this.state.form.ReceivablesDate = dateFormat(this.editForm.ReceivablesDate)
      this.state.form.BillProjectIDMark = pathArr
      this.state.form.ImageUpload = deepCopy(this.editForm.ImageUpload || [])
      this.state.form.IsHouse = !!this.editForm.HouseID
      this.state.form.IsEntireHouse = this.editForm.IsEntireHouse === 1
      this.currentBillProject = {
        KeyID: this.editForm.BillProjectID,
        Name: this.editForm.BillProjectName,
      }
      this.setState({
        form: this.state.form
      })
    }
  }

  handleSave() {
    const validationResults0 = GiftedFormManager.validate('AgentEditCashBookRuleForm')
    const values0 = GiftedFormManager.getValues('AgentEditCashBookRuleForm')
    console.log(values0)
    if (validationResults0.isValid) {
      if (this.state.form.IsHouse && !this.state.form.HouseName) {
        Toast.show('房源不能为空!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      if (!this.currentBillProject.KeyID) {
        Toast.show('项目不能为空!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      if (!validateNumber(values0.Amount)) {
        Toast.show('金额只能为数字!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      debugger
      let IsEntireHouse = 0
      if (!this.state.form.IsHouse) {
        IsEntireHouse = 0
      } else if (this.state.form.RentType === 1) {
        IsEntireHouse = 1
      }else {
        IsEntireHouse = values0.IsEntireHouse ? 1 : 0
      }
      const bookKeepPara = {
        ...this.state.form,
        ...values0,
        IsHouse: this.state.form.IsHouse ? 1 : 0,
        IsEntireHouse,
        BillProjectID: this.currentBillProject.KeyID,
        BillProjectName: this.currentBillProject.Name
      }
      if (bookKeepPara.IsHouse === 0) {
        bookKeepPara.HouseName = ''
        bookKeepPara.HouseID = ''
        bookKeepPara.HouseKey = ''
      }
      this.setState({
        loading: true
      })
      const apiFn = this.editType === 0 ? InsertBookKeep : UpdateBookKeep
      apiFn({
        [this.editType === 0 ? 'bookKeepPara' : 'bookKeep']: bookKeepPara
      }).then(({Data}) => {
        // editType 为0 新增   1 为修改
        this.props.dispatch(
          updateAccountDetail({
              data: Data
            })
        )
        this.props.dispatch(
            (this.editType === 0 ? addList : updateList)({
              KeyID: Data.KeyID,
              key: this.state.form.InOrOut===1 ? 'IncomeOrExpendAccount' : 'ExpendOrIncomeAccount',
              data: Data
            })
        )
        this.setState({
          loading: false
        }, () => {
          setTimeout(() => {
            Alert.alert(
                '提示',
                '保存成功',
                [
                  {
                    text: '确定',
                    onPress: () => {
                      this.props.navigation.goBack()
                    }
                  }
                ],
                {cancelable: false}
            )
          }, 100)
        })
      }).catch(() => {
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

  billProjectChange(data) {
    this.currentBillProject = data
  }

  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 1
      },
      path: 'AgentEditCashBook',
      returnKey: 'houseInfo'
    })
  }

  selectHouse(item) {
    this.state.form.HouseName = item.HouseName
    this.state.form.HouseID = item.KeyID
    this.state.form.HouseKey = item.HouseKey
    this.state.form.RentType = item.RentType
    this.setState({
      form: this.state.form
    })
  }

  onUploadFileChange(data) {
    this.setState({
      form: {
        ...this.state.form,
        ImageUpload: data
      }
    })
  }

  isHouseChange(val) {
    this.setState({
      form: {...this.state.form, IsHouse: val}
    })
  }

  render() {
    const {form} = this.state
    return (
        <View style={styles.keep_container}>
          <FullModal visible={this.state.loading} loadingText="保存中..."/>
          <Header title={this.editType == 0 ? `新增记账` : `修改记账`}/>
          <GiftedForm
              formName='AgentEditCashBookRuleForm'
          >
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.SwitchWidget
                name='IsHouse'
                title='是否房源相关'
                required={false}
                disabled={this.editType === 1}
                onSwitchChange={(val) => {
                  this.isHouseChange(val)
                }}
                value={form.IsHouse}
            />
            {form.IsHouse &&
            <GiftedForm.LabelWidget
                name='HouseName'
                title='房源名称'
                placeholder='请选择'
                disabled={this.editType === 1}
                onLabelPress={() => {
                  this.showSelectHouseFn()
                }}
                value={form.HouseName}
            />}
            <GiftedForm.DatePickerWidget
                name='ReceivablesDate'
                title='收支日期'
                value={form.ReceivablesDate}
            />
            <GiftedForm.PickerWidget
                name='InOrOut'
                title='收支类型'
                data={this.EnumData}
                disabled={true}
                value={form.InOrOut}
                mapKey={this.EnumProps}
            />
            <GiftedForm.CascaderWidget
                name='BillProjectIDMark'
                title='项目'
                data={this.state.billProject}
                value={form.BillProjectIDMark}
                mapKey={this.mapKey}
                onSelect={(data) => {
                  this.billProjectChange(data)
                }}
            />
            {form.IsHouse&&form.RentType===2&&<GiftedForm.SwitchWidget
                name='IsEntireHouse'
                title='是否记为整套房'
                required={false}
                disabled={this.editType === 1}
                value={form.IsEntireHouse}
            />}
            <GiftedForm.TextInputWidget
                name='Amount'
                title='金额'
                maxLength={14}
                keyboardType={this.numberPad}
                value={form.Amount + ''}
                tail={`元`}
            />
            <GiftedForm.TextInputWidget
                name='VoucherID'
                title='凭证编号'
                maxLength={20}
                required={false}
                value={form.VoucherID + ''}
            />
            <GiftedForm.NoticeWidget title={`图片上传`}/>
            <UploadFile list={this.state.form.ImageUpload} type={`AgentEditCashBook`}
                        onChange={(data) => this.onUploadFileChange(data)}/>
            <GiftedForm.NoticeWidget title={`备注`}/>
            <GiftedForm.TextAreaWidget
                name='Remark'
                required={false}
                placeholder='请输入备注内容'
                maxLength={200}
                value={form.Remark}
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

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(AddBookKeeping)
