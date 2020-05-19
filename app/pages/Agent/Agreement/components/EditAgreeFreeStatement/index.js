import React, {Component} from 'react'
import {View, Platform} from 'react-native'
import styles from './style'
import {GiftedForm, GiftedFormManager} from '../../../../../components/Form/GiftedForm'
import {FullModal, Header} from '../../../../../components'
import ButtonGroup from '../../../../../components/ButtonGroup'
import Toast from 'react-native-root-toast'
import {InsertAgreeRentFree, UpdateAgreeRentFree, TempAgreeRentFreeInfo} from '../../../../../api/personalAccount'
import {dateFormat} from "../../../../../utils/dateFormat";
import { priceFormat } from '../../../../../utils/priceFormat'
import {connect} from 'react-redux'
import UploadFile from "../../../../../components/UploadFile";
import {QueryOwnerBookSignInfo} from "../../../../../api/personalAccount";
import {updateList, addList} from "../../../../../redux/actions/list";
import { diffTime } from '../../../../../utils/dateFormat'
import diffArr from '../../../../../utils/arrUtil/diffArr'
import deepClone from '../../../../../utils/deepClone'

class EditAgreeFreeStatement extends Component {
  constructor(props) {
    super(props)
    this.editType = props.navigation.state.params.editType // 0新增 1修改
    this.TemporaryID = 0 // 暂存ID
    this.count = 0
    this.title = ''
    this.saveFn = null
    this.btnOptions = []
    this.Status = 0,
    this.SignInfo = ''
    this.AllData = props.navigation.state.params.data
    debugger
    this.ImageList = !this.editType ? [] : deepClone(this.AllData.ImageUpload)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.state = {
      form: {
        OwnerName: '',
        Phone: '',
        OwnerIDCard: '',
        HouseAddress: '',
        StartTime: '',
        EndTime: '',
        Month: '',
        RentMoeny: '',
        ContractRemark: '',
        SignInfo: ''
      },
      loading: false,
      ImageUpload: []
    }
  }
  componentWillMount() {
    this.initData()
  }
  calcDate = (EndDate, StartDate) => {
    const [Year, Month, Day] = diffTime(EndDate, StartDate, 1)
    return Month || 0
  }
  initData() {
    this.editType = this.props.navigation.getParam('editType', 0)
    this.data = this.props.navigation.getParam('data', {})
    this.title = this.editType === 0 ? '新增免租声明书' : '修改免租声明书'
    if (this.editType === 1) {
      const {
        OwnerName,
        Phone,
        OwnerIDCard,
        HouseAddress,
        StartTime,
        EndTime,
        Month,
        RentMoeny,
        ContractRemark,
        SignInfo,
        ImageUpload
      } = this.data
      this.setState({
        form: {
          OwnerName,
          Phone,
          OwnerIDCard,
          HouseAddress,
          StartTime: dateFormat(StartTime),
          EndTime: dateFormat(EndTime),
          Month: this.calcDate(EndTime, StartTime),
          RentMoeny: priceFormat(RentMoeny),
          ContractRemark,
          SignInfo
        },
        ImageUpload
      })
    }
    if (this.editType === 0) {
      // 新增
      this.btnOptions.push(
        { label: '保存并签字', value: 'Save' }
      )
    } else　{
      this.btnOptions.push(
        { label: '修改保存', value: 'Save' },
      )
    }
  }
  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    })
  }
  // 保存按钮
  handleSave() {
    const validationResults0 = GiftedFormManager.validate('EditAgreeFreeStatement')
    const values0 = {...GiftedFormManager.getValues('EditAgreeFreeStatement'), ImageUpload: this.state.ImageUpload}
    if (validationResults0.isValid) {
      const diffImage = diffArr(this.ImageList, this.state.ImageUpload, [ 'ImageLocation' ])
      const values = {ImageUpload: diffImage }
      this.state.form = {...this.state.form, ...values0}
      debugger
      this.setState({
        loading: true
      })
      // 根据选择确定方法
      if (this.editType === 0) {
        // 新增
        this.Status = 0
        this.saveFn = InsertAgreeRentFree
      } else {
        // 修改
        this.Status = this.data.SignInfo || this.SignInfo ? 2 : 1
        this.saveFn = UpdateAgreeRentFree
      }
      // 调 新增（修改）接口
      const {
        OwnerName,
        Phone,
        OwnerIDCard,
        HouseAddress,
        StartTime,
        EndTime,
        Month,
        RentMoeny,
        ContractRemark,
        SignInfo
      } = this.state.form
      this.saveFn({
        KeyID: this.data.KeyID,
        TemporaryID: this.TemporaryID,
        Type: this.Status,
        OwnerName,
        Phone,
        OwnerIDCard,
        HouseAddress,
        StartTime,
        EndTime,
        Month,
        RentMoeny,
        ContractRemark,
        SignInfo,
        ImageUpload: values.ImageUpload
      }).then(({Data}) => {
        // 更新List列表
        const Fn = this.editType === 0 ? addList : updateList
        this.props.dispatch(
          Fn({
            KeyID: Data.KeyID,
            key: 'AgentAgreeFreeStatement',
            data: Data
          })
        )
        // 修改Toast提示信息
        const msg = this.editType === 0 ? '新增成功' : '修改成功'
        Toast.show(msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        // 跳转至列表
        if(this.editType === 0) {
          this.props.navigation.navigate('AgentSignUpH5Container', {
            KeyID: Data.KeyID,
            busType: 5
          })
        } else {
          this.props.navigation.navigate('AgentAgreeFreeStatement')
        }
      }).finally(() => {
        this.setState({
          loading: false
        })
      })
    } else {
      // 表单验证失败
      const errors = GiftedFormManager.getValidationErrors(validationResults0)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }
  // 签字
  // handleSign() {
  //   const validationResults1 = GiftedFormManager.validate('EditAgreeFreeStatement')
  //   const values1 = GiftedFormManager.getValues('EditAgreeFreeStatement')
  //   console.log(values1)
  //   if (validationResults1.isValid) {
  //     this.state.form = {...this.state.form, ...values1}
  //     this.setState({
  //       loading: true
  //     })
  //     if (this.editType === 0) { // 0新增 1修改
  //       TempAgreeRentFreeInfo({
  //         ...this.state.form,
  //         Type: 0 // 0暂存
  //       }).then(res => {
  //         if (res.Data) {
  //           this.TemporaryID = res.Data
  //           this.setState({
  //             loading: false
  //           }, ()=> {
  //             this.props.navigation.navigate('AgentSignUpH5Container', {
  //               KeyID: res.Data,
  //               busType: 5
  //             })
  //             // this.handleOpen(res.Data)
  //           })
  //         }
  //       })
  //     } else {
  //       // 签字--修改
  //       // TempAgreeRentFreeInfo({
  //       //   ...this.state.form,
  //       //   Type: this.data.SignInfo ? 2 : 1 // 判断是否有签字信息 2有签字  1待签字
  //       // }).then(res => {
  //         this.props.navigation.navigate('AgentSignUpH5Container', {
  //           KeyID: this.data.KeyID,
  //           busType: 5
  //         })
  //         // this.handleOpen(this.data.KeyID)
  //         this.setState({
  //           loading: false
  //         })
  //       // })
  //     }
  //   } else {
  //     const errors = GiftedFormManager.getValidationErrors(validationResults1)
  //     Toast.show(errors[0], {
  //       duration: Toast.durations.SHORT,
  //       position: Toast.positions.BOTTOM
  //     })
  //   }
  // }

  render() {
    const {form} = this.state
    return (
        <View style={styles.resource_container}>
          <Header title={this.title}/>
          <FullModal visible={this.state.loading}/>
          <GiftedForm formName='EditAgreeFreeStatement'>
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.TextInputWidget
                name='OwnerName'
                title='业主姓名'
                maxLength={8}
                required={true}
                placeholder='请填写'
                value={form.OwnerName + ''}
            />
            <GiftedForm.TextInputWidget
                name='Phone'
                title='业主电话'
                required={true}
                placeholder='请填写'
                maxLength={11}
                keyboardType={this.numberPad}
                value={form.Phone + ''}
            />
            <GiftedForm.TextInputWidget
                name='OwnerIDCard'
                title='身份证号'
                required={true}
                placeholder='请填写'
                maxLength={18}
                keyboardType={this.numberPad}
                value={form.OwnerIDCard + ''}
            />
            <GiftedForm.TextInputWidget
                name='HouseAddress'
                title='房屋地址'
                required={true}
                placeholder='请填写'
                maxLength={200}
                value={form.HouseAddress + ''}
            />
            <GiftedForm.NoticeWidget title={`免租期限`} />
            <GiftedForm.DatePickerWidget
                name='StartTime'
                title='开始时间'
                value={form.StartTime}
            />
            <GiftedForm.DatePickerWidget
                name='EndTime'
                title='结束时间'
                value={form.EndTime}
            />
            <GiftedForm.SeparatorWidget />
            <GiftedForm.TextInputWidget
                name='Month'
                title='合计月份'
                required={true}
                placeholder='请填写'
                maxLength={2}
                keyboardType={this.numberPad}
                value={form.Month + ''}
                tail={'月'}
            />
            <GiftedForm.TextInputWidget
                name='RentMoeny'
                title='合计金额'
                required={true}
                placeholder='请填写'
                maxLength={10}
                keyboardType={this.numberPad}
                value={form.RentMoeny + ''}
                tail={'元'}
            />
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.NoticeWidget title={`添加附件`}/>
            <UploadFile list={this.state.ImageUpload} type={`RentFreeStatement`}
                        onChange={(data) => this.onUploadFileChange(data)}/>
            <GiftedForm.NoticeWidget title={`备注`}/>
            <GiftedForm.TextAreaWidget
                name='ContractRemark'
                required={false}
                placeholder='请填写备注信息'
                maxLength={100}
                value={form.ContractRemark + ''}
            />
          </GiftedForm>
          <View>
            <ButtonGroup
                options={this.btnOptions}
                handleSaveClick={() => this.handleSave()}
                handleSignClick={() => this.handleSign()}
            />
          </View>
        </View>
    )
  }
}

const mapToProps = state => ({allList: state.list})
export default connect(mapToProps)(EditAgreeFreeStatement)
