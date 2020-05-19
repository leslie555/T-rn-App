import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import styles from '../EditAgreeFreeStatement/style'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../../components/Form/GiftedForm'
import { FullModal, Header } from '../../../../../components'
import ButtonGroup from '../../../../../components/ButtonGroup'
import { connect } from 'react-redux'
import Toast from 'react-native-root-toast'
import { withNavigation } from 'react-navigation'
import {
  AddConsentTerminateContract,
  UpdateConsentTerminateContract
} from '../../../../../api/statementOrAgree'
import UploadFile from "../../../../../components/UploadFile";
import { dateFormat } from '../../../../../utils/dateFormat'
import { updateList, addList } from '../../../../../redux/actions/list'
import diffArr from '../../../../../utils/arrUtil/diffArr'
import deepClone from '../../../../../utils/deepClone'

class EditContractRemoveAgree extends React.Component {
  constructor(props) {
    super(props)
    this.btnOptions = []
    this.editType = props.navigation.state.params.editType
    this.KeyID = props.navigation.state.params.KeyID
    this.token = props.navigation.state.params.token
    this.AllData = props.navigation.state.params.AllData 
    this.ImageList = this.editType === 1 ? [] : deepClone(this.AllData.imgList)
    this.numberPad =
      Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
    // 轮询是否调接口成功
    this.submitAuditReady = false
    this.judgeSaveOk = false
    this.interval = null
    this.willFocusSubscription = null
    // 计时器
    this.count = 0
    this.state = {
      form: {
        OwnerName: '',
        OwnerPhone: '',
        OwnerIDCard: '',
        HouseLocation: '',
        ReturnDate: '',
        Remark: ''
      },
      loading: false,
      imgList : []
    }
  }

  onUploadFileChange(data) {
    this.setState({
      imgList : data
    })
  }

  componentWillMount() {
    this.initData()
  }
  initData() {
    // 2修改进入 1新增
    if (this.editType === 2) {
      this.state.form = {
        OwnerName: this.AllData.OwnerName,
        OwnerPhone: this.AllData.OwnerPhone,
        OwnerIDCard: this.AllData.OwnerIDCard,
        HouseLocation: this.AllData.HouseLocation,
        ReturnDate: dateFormat(this.AllData.ReturnDate),
        Remark: this.AllData.Remark,
        SignUrl: this.AllData.SignUrl
      }
      this.state.imgList = this.AllData.imgList
      this.state.title = '修改解除同意书'
      this.btnOptions.push(
        { label: '修改保存', value: 'Save' },
      )
    } else {
      this.btnOptions.push(
        { label: '保存并签字', value: 'SignInfo' }
      )
      this.state.title = '新增解除同意书'
    }
  }
  handleSignInfo() {
    // 对业主签字   接口OK过后 在调签字
    this.handleSave()
  }

  handleSave() {
    const validationResults = GiftedFormManager.validate(
      'EditContractRemoveAgree'
    )
    if (validationResults.isValid) {
      const diffImage = diffArr(this.ImageList, this.state.imgList, [ 'ImageLocation' ])
      const values = {...GiftedFormManager.getValues('EditContractRemoveAgree'), imgList: diffImage }
      this.setState({
        loading: true
      })
      // 状态 :0:暂存  1:待签字  2:完成
      this.editType === 1 ? (values.Type = 1) : (values.Type = 2)
      if (this.editType === 2) {
        values.SignUrl = this.state.form.SignUrl
      }
      // 为空 则是新加  不为空则是修改
      const Fn = this.KeyID === '' ? AddConsentTerminateContract : UpdateConsentTerminateContract
      values.KeyID = this.KeyID
      Fn(values).then(({ Data }) => {
        this.setState({
          loading: false
        })
        const ListFn = this.editType === 1 ? addList : updateList
        this.props.dispatch(
          ListFn({
            KeyID: Data.KeyID,
            key: 'AgentContractRemoveAgree',
            data: Data
          })
        )
        this.KeyID = Data.KeyID
        if (this.editType === 2) {
          this.props.navigation.navigate('AgentContractRemoveAgree')
        } else {
          this.props.navigation.navigate('AgentSignUpH5Container', {
            KeyID: this.KeyID,
            busType: 6
          })
        }
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
      <View style={styles.resource_container}>
        <Header title={this.state.title} />
        <FullModal visible={this.state.loading} />
        <GiftedForm formName="EditContractRemoveAgree">
          <GiftedForm.SeparatorWidget />
          <GiftedForm.TextInputWidget
            name="OwnerName"
            title="业主姓名"
            maxLength={8}
            required={true}
            placeholder="请填写"
            value={form.OwnerName + ''}
          />
          <GiftedForm.TextInputWidget
            name="OwnerPhone"
            title="业主电话"
            required={true}
            placeholder="请填写"
            maxLength={11}
            keyboardType={this.numberPad}
            value={form.OwnerPhone + ''}
          />
          <GiftedForm.TextInputWidget
            name="OwnerIDCard"
            title="身份证号"
            required={true}
            placeholder="请填写"
            maxLength={18}
            keyboardType={this.numberPad}
            value={form.OwnerIDCard + ''}
          />
          <GiftedForm.TextInputWidget
            name="HouseLocation"
            title="房屋地址"
            required={true}
            placeholder="请填写"
            maxLength={200}
            value={form.HouseLocation + ''}
          />
          <GiftedForm.SeparatorWidget />
          <GiftedForm.DatePickerWidget
            name="ReturnDate"
            title="归还房屋日期"
            value={form.ReturnDate}
          />
          <GiftedForm.SeparatorWidget />
          <GiftedForm.NoticeWidget title={`添加附件`}/>
          <UploadFile list={this.state.imgList } type={`ContractRemoveAgree`}
                        onChange={(data) => this.onUploadFileChange(data)}/>
          <GiftedForm.NoticeWidget title={`备注`}/>
          <GiftedForm.TextAreaWidget
              name='Remark'
              required={false}
              placeholder='请输入备注信息'
              maxLength={100}
              value={form.Remark}
          />
        </GiftedForm>
        <View>
          <ButtonGroup
            options={this.btnOptions}
            handleSaveClick={() => this.handleSave()}
            handleSignInfoClick={() => this.handleSignInfo()}
          />
        </View>
      </View>
    )
  }
}

export default connect()(withNavigation(EditContractRemoveAgree))
