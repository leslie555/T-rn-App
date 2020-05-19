import React, {Component} from 'react'
import {Alert, Button, Platform, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {FullModal, Header} from "../../../../components";
import {insertBookKeep} from "../../../../api/owner";
import ButtonGroup from "../../../../components/ButtonGroup";
import {connect} from 'react-redux'
import Toast from "react-native-root-toast";
import {setBookKeep} from "../../../../redux/actions/bookKeep";
import {fetchBillData, getTreeNodeByValue} from "../../../../utils/arrUtil";
import {updateContractDetail} from "../../../../redux/actions/contract";
import {validateNumber} from "../../../../utils/validate";
import {dateFormat} from "../../../../utils/dateFormat";

class AddBookKeeping extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
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
    this.apiType = 0
    this.busType = 0
    this.state = {
      form: {
        HouseName: '',
        ReceivablesDate: '',
        InOrOut: 1,
        BillProjectIDMark: [],
        Amount: '',
        RentType: 1
      },
      billProject: [],
      loading: false
    }
  }

  componentWillMount() {
    this.initData()
    fetchBillData().then(({Data}) => {
      this.setState({
        billProject: Data
      }, () => {
        this.initForm()
      })
    })
  }

  initData() {
    const InOrOut = this.props.enumList.EnumInOrOut.slice()
    InOrOut.shift()
    this.EnumData = InOrOut
    const data = this.props.navigation.getParam('data', {})
    const editType = this.props.navigation.getParam('editType', 0) // 0新增 1 修改
    const apiType = this.props.navigation.getParam('apiType', 0)  // 0 不调用接口 1 调用接口
    const busType = this.props.navigation.getParam('busType', 0)  // 0 业主 1租客
    this.editForm = data
    this.editType = editType
    this.apiType = apiType
    this.busType = busType
  }

  initForm() {
    this.state.form.HouseName = this.editForm.HouseName
    this.state.form.RentType = this.editForm.RentType
    if (this.editType === 1) {
      debugger
      const pathArr = getTreeNodeByValue(this.state.billProject, this.editForm.BillProjectID, {
        children: 'Children',
        value: 'KeyID',
        label: 'Name'
      }).pathArr
      this.state.form.BillProjectIDMark = pathArr
      this.state.form.ReceivablesDate = dateFormat(this.editForm.ReceivablesDate)
      this.state.form.Amount = this.editForm.Amount
      this.state.form.InOrOut = this.editForm.InOrOut
      this.currentBillProject = {
        KeyID: this.editForm.BillProjectID,
        Name: this.editForm.BillProjectName,
      }
      this.setState({
        form: this.state.form
      })
    } else {
      if (this.apiType === 1) {
        this.state.form.HouseID = this.editForm.HouseID
        this.state.form.HouseName = this.editForm.HouseName
        this.state.form.HouseKey = this.editForm.HouseKey
        this.state.form.ContractID = this.editForm.ContractID
      }
      this.setState({
        form: this.state.form
      })
    }
  }

  handleSave() {
    const validationResults0 = GiftedFormManager.validate('AddBookKeepingRuleForm')
    const values0 = GiftedFormManager.getValues('AddBookKeepingRuleForm')
    console.log(values0)
    if (validationResults0.isValid) {
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
      let param = {}
      if (this.apiType === 1) { // 详情里面的新增
        param = {
          bookKeepPara: {
            ...this.editForm,
            ...values0,
            IsHouse: 1,
            ContractType: this.busType,
            IsBreachContract: false,
            VoucherID: '',
            Remark: '',
            ImageUpload: []
          },
          bookKeep: [{
            ...this.editForm,
            ...values0,
            BillProjectID: this.currentBillProject.KeyID,
            BillProjectName: this.currentBillProject.Name,
            IsEntireHouse: this.busType === 0 ? 1 : this.state.form.RentType === 1 ? 1 : 0
          }]
        }
        this.setState({
          loading: true
        })
        debugger
        insertBookKeep(param).then(({Data}) => {
          // 这里设置想要的数据 是取Data还是什么 先看Data才知道
          //修改详情
          this.props.dispatch(
              updateContractDetail({
                key: 'BookKeep',
                data: Data
              })
          )
          // this.props.dispatch(
          //     setBookKeep(Data[0])
          // )
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
      } else { // 其他默认为新增修改合同里面的
        param = {
          ...this.editForm,
          ...values0,
          IsEntireHouse: this.busType === 0 ? 1 : this.state.form.RentType === 1 ? 1 : 0,
          BillProjectID: this.currentBillProject.KeyID,
          BillProjectName: this.currentBillProject.Name
        }
        Toast.show('保存成功', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        this.props.dispatch(
            setBookKeep(param)
        )
        this.props.navigation.goBack()
      }
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

  render() {
    const {form} = this.state
    return (
        <View style={styles.keep_container}>
          <FullModal visible={this.state.loading} loadingText="保存中..."/>
          <Header title={this.editType == 0 ? `添加记账` : `修改记账`}/>
          <GiftedForm
              formName='AddBookKeepingRuleForm'
          >
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.TextInputWidget
                name='HouseName'
                title='房源名称'
                disabled={true}
                maxLength={20}
                value={form.HouseName}
            />
            <GiftedForm.DatePickerWidget
                name='ReceivablesDate'
                title='收支日期'
                value={form.ReceivablesDate}
            />
            <GiftedForm.PickerWidget
                name='InOrOut'
                title='收支类型'
                data={this.EnumData}
                value={form.InOrOut}
                mapKey={this.EnumProps}
            />
            <GiftedForm.CascaderWidget
                name='BillProjectIDMark'
                title='项目'
                data={this.state.billProject}
                value={form.BillProjectIDMark}
                onSelect={(data) => {
                  this.billProjectChange(data)
                }}
            />
            <GiftedForm.TextInputWidget
                name='Amount'
                title='金额'
                maxLength={18}
                keyboardType={this.numberPad}
                value={form.Amount + ''}
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
