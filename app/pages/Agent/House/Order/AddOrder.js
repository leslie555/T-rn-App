import React, { Component } from 'react'
import { View, Alert } from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { ButtonGroup, Header } from '../../../../components'
import {
  InsertOrderInfo,
  EditOderList,
  DeleteOrder
} from '../../../../api/tenant'
import { dateFormat } from '../../../../utils/dateFormat'
import Toast from 'react-native-root-toast'
import FullModal from '../../../../components/FullModal'
import { deleteList, updateList, addList } from '../../../../redux/actions/list'
import { connect } from 'react-redux'
import { validateNumber } from '../../../../utils/validate'
import { showSelectAny } from '../../../../components/SelectAny/util'
class AddOrder extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'addOrderForm'
    this.isEdit = false
    this.query = this.props.navigation.state.params || {}
    this.state = {
      isAddLoading: false,
      isEditLoading: false,
      isDeleteLoading: false,
      HouseName: '',
      btnOption: [],
      disabled: false,
      form: {
        OrderName: '',
        OrderPhone: '',
        LastSignDate: '',
        OrderMoney: '',
        ConvertionMoney: '',
        RentDate: [],
        Remark: ''
      }
    }
    this.houseInfo = {}
    this.form = {
      OrderName: '',
      OrderPhone: '',
      LastSignDate: '',
      OrderMoney: '',
      ConvertionMoney: '',
      RentDate: [],
      Remark: ''
    }
    this.rules = {
      OrderPhone: {
        validate: [
          {
            validator: (...args) => {
              if (/^1[3-9]\d{9}$/.test(args[0]) || !args[0].length) {
                return true
              }
              return false
            },
            message: '电话号码格式不正确'
          }
        ]
      }
    }
    this.headerTitle = '添加预定'
    this.viewDidAppear = null
  }

  componentWillMount() {
    this.viewDidAppear = this.props.navigation.addListener('willFocus', obj => {
      if (!obj.state.params) {
        return
      } else {
        let btnOption = []
        const houseInfo = obj.state.params.houseInfo
        this.disableHouseName = !!obj.state.params.disableHouseName // 是否禁止修改房源名称
        if (houseInfo) {
          this.houseInfo = JSON.parse(houseInfo)
          this.setState({
            HouseName: this.houseInfo.HouseName,
            form: {
              ...this.state.form,
              OrderMoney: this.houseInfo.Deposit,
              ConvertionMoney: this.houseInfo.RentMoeny
            }
          })
        }
        btnOption = [{ label: '添加预定', value: 'Add' }]
        this.setState({
          btnOption
        })
      }
    })
  }
  componentWillUnmount() {
    this.viewDidAppear.remove()
  }
  validateNum(data, msg) {
    if (validateNumber(data)) {
      return true
    } else {
      Toast.show(`${msg}只能为数字!`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }
  handleAddClick = () => {
    const validationResults = GiftedFormManager.validate(this.formName)
    const values = GiftedFormManager.getValues(this.formName)
    if (!this.validateNum(values.OrderMoney, '预定金额')) return
    if (!this.validateNum(values.ConvertionMoney, '约定租金')) return
    if (validationResults.isValid === true) {
      this.setState({
        isAddLoading: true
      })
      const RentDate = values.RentDate
      this.form = { ...values }
      this.form.OrderMoney = +this.form.OrderMoney
      this.form.ConvertionMoney = +this.form.ConvertionMoney
      this.form.LeaseStartTime = RentDate[0]
      this.form.LeaseEndTime = RentDate[1]
      this.form.HouseID = +this.houseInfo.HouseID || +this.houseInfo.KeyID
      this.form.HouseName = this.houseInfo.HouseName
      this.form.HouseKey = this.houseInfo.HouseKey
      InsertOrderInfo(this.form)
        .then(res => {
          this.setState(
            {
              isAddLoading: false
            },
            () => {
              this.props.dispatch(
                addList({
                  key: 'orderList',
                  data: res.Data
                })
              )
              Toast.show('保存成功', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
              })
              if (this.query.path === 'AgentHouseDetail') {
                // 房源详情过来添加的回房源详情
                // 需要修改房源列表中的数据
                // 共享房源列表
                this.props.dispatch(
                  deleteList({
                    primaryKey: 'HouseID',
                    KeyID: res.Data.HouseID,
                    key: 'AgentShareHouseList'
                  })
                )
                // 个人房源列表
                // this.props.dispatch(
                //   updateList({
                //     primaryKey: 'HouseName',
                //     KeyID: res.Data.HouseName,
                //     key: 'AgentMyHouseList',
                //     data: {
                //       Badge: 'order',
                //       Meg: dateFormat(res.Data.LastSignDate)
                //     }
                //   })
                // )
                this.props.navigation.navigate(this.query.path, {
                  isRefresh: true
                })
              }
              else if(this.query.path === 'AgentHomePage'){
                this.props.navigation.replace('AgentOrderList')
              }else {
                this.props.navigation.navigate('AgentOrderList')
              }
            }
          )
        })
        .catch(err => {
          this.setState({
            isAddLoading: false
          })
        })
      /*  this.props.onSubmit(
        true,
        values,
        validationResults,
        this._postSubmit,
        this.props.navigator
      ) */
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }

  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 2
      },
      path: 'AgentAddOrder',
      returnKey: 'houseInfo'
    })
  }

  render() {
    const { form } = this.state
    return (
      <View style={{ flex: 1 }}>
        <FullModal
          visible={
            this.state.isAddLoading ||
            this.state.isDeleteLoading ||
            this.state.isEditLoading
          }
        />
        <Header title={this.headerTitle} />
        <GiftedForm
          formName={this.formName} // GiftedForm instances that use the same name will also share the same states
          clearOnClose={true} // delete the values of the form when unmounted
          validators={this.rules}
        >
          <GiftedForm.SeparatorWidget />
          <GiftedForm.LabelWidget
            name='HouseName'
            title='房源名称'
            placeholder='请选择'
            disabled={this.disableHouseName}
            renderRight={!this.disableHouseName}
            onLabelPress={() => {
              this.showSelectHouseFn()
            }}
            value={this.state.HouseName}
          />
          <GiftedForm.TextInputWidget
            name='OrderName'
            title='预定人名称'
            maxLength={8}
            value={form.OrderName}
          />

          <GiftedForm.TextInputWidget
            name='OrderPhone'
            title='预定人电话'
            maxLength={11}
            keyboardType='numeric'
            value={form.OrderPhone}
          />

          <GiftedForm.DatePickerWidget
            name='LastSignDate'
            title='最晚签约日'
            value={form.LastSignDate && dateFormat(form.LastSignDate)}
          />
          <GiftedForm.TextInputWidget
            name='OrderMoney'
            title='预定金额'
            maxLength={10}
            tail='元'
            keyboardType='numeric'
            value={form.OrderMoney + ''}
          />
          <GiftedForm.TextInputWidget
            name='ConvertionMoney'
            title='约定租金'
            placeholder='请输入'
            maxLength={10}
            tail='元/月'
            keyboardType='numeric'
            clearButtonMode='while-editing'
            value={form.ConvertionMoney + ''}
          />
          <GiftedForm.DatePickerRangeWidget
            name='RentDate'
            title='约定租期'
            cannotEqual
            value={form.RentDate}
          />

          <GiftedForm.SeparatorWidget />

          <GiftedForm.NoticeWidget title='备注' />

          <GiftedForm.TextAreaWidget
            name='Remark'
            numberOfLines={5}
            value={form.Remark}
          />
          <GiftedForm.ErrorsWidget />
        </GiftedForm>
        <ButtonGroup
          options={this.state.btnOption}
          handleAddClick={this.handleAddClick}
          handleEditClick={this.handleAddClick}
        />
      </View>
    )
  }
}

export default connect()(AddOrder)
