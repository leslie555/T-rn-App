import React, {Component} from 'react'
import {Button, Platform, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {FullModal, Header} from '../../../../components'
import {
  getBookKeepByID,
  ownerCheckOut,
  ownerEditCheckOut,
  tenantCheckOut,
  tenantEditCheckOut
} from '../../../../api/owner'
import ButtonGroup from '../../../../components/ButtonGroup'
import {connect} from 'react-redux'
import Toast from 'react-native-root-toast'
import {fetchBillData, getTreeNodeByValue} from '../../../../utils/arrUtil'
import {dateFormat} from '../../../../utils/dateFormat'
import {updateContractDetail, updateContractList} from '../../../../redux/actions/contract'
import IconFont from "../../../../utils/IconFont";
import UploadFile from "../../../../components/UploadFile";

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
    this.editForm = {}
    this.editType = 0 // 0新增 1修改
    this.type = 0 // 0业主 1租客
    this.contractID = ''
    this.houseInfo = {} // 房源信息
    this.state = {
      form: {
        HouseName: '',
        ReceivablesDate: '',
        VoucherID: '',
        IsBreachContractMark: false,
        IsHouse: 1
      },
      BookKeepProjectList: [],
      billProject: [],
      ImageUpload: [],
      loading: false
    }
  }

  componentWillMount() {
    this.initData()
    fetchBillData().then(({Data}) => {
      this.setState({
        billProject: Data
      })
      this.initForm()
    })
  }

  initData() {
    const InOrOut = this.props.enumList.EnumInOrOut.slice()
    InOrOut.shift()
    this.EnumData = InOrOut
    this.editType = this.props.navigation.getParam('editType', 0)
    this.houseInfo = this.props.navigation.getParam('houseInfo', {})
    this.type = this.props.navigation.getParam('type', 0)
    this.contractID = this.props.navigation.getParam('contractID', '')
  }

  initForm() {
    if (this.editType === 0) {
      this.handleCheckOutAdd()
      this.setState({
        form: {...this.state.form, ...this.houseInfo}
      })
    } else {
      this.setState({
        loading: true
      })
      getBookKeepByID({
        id: this.contractID,
        type: this.type
      })
          .then(({Data}) => {
            const bookKeepPara = Data.bookKeepPara
            const bookKeep = Data.bookKeep
            this.state.form = {
              ...this.state.form,
              ...bookKeepPara,
              ReceivablesDate: dateFormat(bookKeepPara.ReceivablesDate),
              IsBreachContractMark: bookKeepPara.IsBreachContract !== 0
            }
            bookKeep.forEach((item, index) => {
              const pathArr = getTreeNodeByValue(
                  this.state.billProject,
                  item.BillProjectID,
                  this.mapKey
              ).pathArr
              item.BillProjectIDMark = pathArr
            })
            this.setState({
              form: this.state.form,
              BookKeepProjectList: bookKeep,
              ImageUpload: bookKeepPara.ImageUpload
            })
          })
          .finally(() => {
            this.setState({
              loading: false
            })
          })
    }
  }

  validateProject() {
    debugger
    const flag = this.state.BookKeepProjectList.some(v => {
      if (v.BillProjectID === '' || v.InOrOut === '' || v.Amount === '') {
        return true
      }
    })
    if (flag || this.state.BookKeepProjectList.length === 0) {
      Toast.show('请完善项目!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else {
      return true
    }
  }

  handleSave() {
    const validationResults0 = GiftedFormManager.validate('CheckOutContractRuleForm')
    const values0 = GiftedFormManager.getValues('CheckOutContractRuleForm')
    console.log(values0)
    if (validationResults0.isValid) {
      if (!this.validateProject()) {
        return
      }
      const param = {
        bookKeepPara: {
          ...this.state.form,
          ...values0,
          IsBreachContract: values0.IsBreachContractMark ? 1 : 0,
          ContractID: this.contractID,
          ImageUpload: this.state.ImageUpload
        },
        bookKeep: this.state.BookKeepProjectList
      }
      let fn = ''
      if (this.type === 0) {
        if (this.editType === 0) {
          fn = ownerCheckOut
        } else {
          fn = ownerEditCheckOut
        }
      } else {
        if (this.editType === 0) {
          fn = tenantCheckOut
        } else {
          fn = tenantEditCheckOut
        }
      }
      this.setState({
        loading: true
      })
      fn(param)
          .then(() => {
            Toast.show('操作成功!', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            debugger
            this.props.dispatch(
                updateContractDetail({
                  key:
                      this.type === 0
                          ? 'OwnerContractOperate'
                          : 'TenantContractOperate',
                  data: {
                    AuditStatus: 1,
                    [this.type === 0 ? 'LeaseStatus' : 'RentLeaseStatus']: 4
                  }
                })
            )
            this.props.dispatch(
                updateContractList({
                  key: this.type === 0 ? 'ownerContractList' : 'tenantContractList',
                  KeyID: this.contractID,
                  data: {
                    AuditStatus: 1,
                    [this.type === 0 ? 'LeaseStatus' : 'RentLeaseStatus']: 4
                  }
                })
            )
            this.props.navigation.goBack()
          })
          .finally(() => {
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

  handleCheckOutAdd() {
    this.state.BookKeepProjectList.push({
      BillProjectID: '',
      BillProjectIDMark: [],
      BillProjectName: '',
      Amount: '',
      InOrOut: '',
      Remark: ''
    })
    this.setState({
      BookKeepProjectList: this.state.BookKeepProjectList
    })
  }

  handleCheckOutDelete(index) {
    this.state.BookKeepProjectList.splice(index, 1)
    this.setState({
      BookKeepProjectList: this.state.BookKeepProjectList
    })
  }

  billProjectChange(data, item) {
    if (data !== 1) {
      item.BillProjectID = data.KeyID
      item.BillProjectName = data.Name
    }
    this.setState({
      BookKeepProjectList: this.state.BookKeepProjectList
    })
  }

  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    })
  }

  render() {
    const {form} = this.state
    return (
        <View style={styles.check_container}>
          <Header title={this.editType === 0 ? `退房` : `修改退房`}/>
          <FullModal visible={this.state.loading}/>
          <GiftedForm formName='CheckOutContractRuleForm'>
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
            <GiftedForm.SwitchWidget
                name='IsBreachContractMark'
                title='是否违约'
                required={false}
                value={form.IsBreachContractMark}
            />
            <GiftedForm.TextInputWidget
                name='VoucherID'
                title='凭证编号'
                maxLength={30}
                required={false}
                value={form.VoucherID}
            />

            <GiftedForm.NoticeWidget title={`项目信息`} rightView={
              <TouchableOpacity onPress={() => this.handleCheckOutAdd()} style={styles.add_owner_btn_box}>
                <Text style={styles.add_owner_btn_text}>添加项目</Text>
              </TouchableOpacity>
            }/>
            {this.state.BookKeepProjectList.map((item, index) => {
              return (
                  <View style={[index === this.state.BookKeepProjectList.length - 1 ? null : styles.add_owner_box]}
                        key={index}
                        formName={'ownerForm' + index}>
                    <View style={styles.add_owner_title_box}>
                      <Text style={styles.add_owner_title_text}>{`项目${index + 1}：`}</Text>
                      {this.state.BookKeepProjectList.length > 1 &&
                      <TouchableOpacity style={styles.owner_del_btn} onPress={() => this.handleCheckOutDelete(index)}>
                        <IconFont name='jiahao1' size={10} color='#fff'/>
                      </TouchableOpacity>}
                    </View>
                    <GiftedForm.PickerWidget
                        name='InOrOut'
                        title='收支类型'
                        data={this.EnumData}
                        value={item.InOrOut}
                        mapKey={this.EnumProps}
                        onPickerConfirm={(data) => {
                          item.InOrOut = data
                          this.billProjectChange(1)
                        }}
                    />
                    <GiftedForm.CascaderWidget
                        name={'BillProjectIDMark'+index}
                        title='项目'
                        data={this.state.billProject}
                        value={item.BillProjectIDMark}
                        mapKey={this.mapKey}
                        onSelect={data => {
                          this.billProjectChange(data, item)
                        }}
                    />
                    <GiftedForm.TextInputWidget
                        name='Amount'
                        title='金额'
                        maxLength={18}
                        keyboardType={this.numberPad}
                        value={item.Amount + ''}
                        onChangeText={(data) => {
                          item.Amount = data
                          this.billProjectChange(1)
                        }}
                    />
                    <GiftedForm.TextInputWidget
                        name='Remark'
                        title='备注'
                        required={false}
                        maxLength={200}
                        value={item.Remark}
                        onChangeText={(data) => {
                          item.Remark = data
                          this.billProjectChange(1)
                        }}
                    />
                  </View>
              )
            })}
            <GiftedForm.NoticeWidget title={`图片凭证`}/>
            <UploadFile list={this.state.ImageUpload} type={`AgentCheckOutContract`}
                        onChange={(data) => this.onUploadFileChange(data)}/>
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
