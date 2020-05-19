import React, { Component } from 'react'
import { View, Alert } from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { ButtonGroup, Header } from '../../../../components'
import {
  InsertOrderInfo,
  SelectExceptLastSignDate
} from '../../../../api/tenant'
import { dateFormat } from '../../../../utils/dateFormat'
import Toast from 'react-native-root-toast'
import FullModal from '../../../../components/FullModal'
import { deleteList, updateList, addList } from '../../../../redux/actions/list'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { validateNumber, validateCard } from '../../../../utils/validate'
import { showSelectAny } from '../../../../components/SelectAny/util'
class AddOrder extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'addOrderForm'
    this.isEdit = false
    this.markFlag = false
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
        OrderCardID: '',
        LastSignDate: '',
        OrderMoney: '',
        PayModel: 3,
        AdvanceMonth: 1,
        ServiceFee: 0,
        ConvertionMoney: '',
        RentDate: [],
        Remark: '',
        ContractExpireDate: ''
      }
    }
    this.houseInfo = {}
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
      },
      OrderCardID: {
        validate: [
          {
            validator: (...args) => {
              if (validateCard(args[0])) {
                return true
              }
              return false
            },
            message: '身份证格式不正确'
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
        btnOption = [{ label: '提交审核', value: 'Add' }]
        this.setState({
          btnOption
        })
      }
    })
    if ((this.query.hasContractExpire || true)&&this.query.houseInfo) {
      const HouseInfo = JSON.parse(this.query.houseInfo)
      this.setState({
        isAddLoading: true
      })
      SelectExceptLastSignDate({ HouseID: +HouseInfo.HouseID || +HouseInfo.KeyID })
        .then(({ Data }) => {
          this.state.form.ContractExpireDate = Data.ContractExpireDate
          this.state.form.ContractStartDate = Data.ContractStartDate
          this.state.form.IsForwardHouse = Data.IsForwardHouse
          this.setState({
            isAddLoading: false
          })
        })
        .finally(() => {
          this.setState({
            isAddLoading: false
          })
        })
    }
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
    if (this.markFlag) return
    this.markFlag = true
    setTimeout(() => {
      this.markFlag = false
      const validationResults = GiftedFormManager.validate(this.formName)
      const values = GiftedFormManager.getValues(this.formName)
      if (validationResults.isValid === true) {
        if (!this.validateNum(values.OrderMoney, '预定金额')) return
        if (values.OrderMoney <= 0) {
          Toast.show(`预定金额必须大于0!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return
        }
        if (!this.validateNum(values.ConvertionMoney, '约定租金')) return
        if (values.ConvertionMoney <= 0) {
          Toast.show(`约定租金必须大于0!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return
        }
        if (!this.validateNum(values.ServiceFee, '服务费')) return
        if (values.ServiceFee < 0) {
          Toast.show(`服务费不能小于0!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return
        }
        if (
          this.state.form.ContractExpireDate &&
          new Date(values.LastSignDate).getTime() <=
            new Date(this.state.form.ContractExpireDate).getTime()
        ) {
          Toast.show(`最晚签约日必须晚于该房源租期结束时间!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return
        }
        if (
          values.LastSignDate &&
          values.OrderMoney > 0 &&
          values.ConvertionMoney > 0
        ) {
          const startDate = this.state.form.ContractExpireDate
            ? new Date(this.state.form.ContractExpireDate)
            : new Date()
          const days =
            Math.ceil(
              (new Date(values.LastSignDate).getTime() - startDate.getTime()) /
                3600 /
                1000 /
                24
            ) + 1
          const maxOrderMoney = Math.ceil(
            (values.ConvertionMoney / 30) * 2 * days
          )
          if (+values.OrderMoney < maxOrderMoney) {
            Toast.show(`预定金额不能小于${maxOrderMoney}!`, {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return
          }
        }
        this.setState({
          form: { ...this.state.form, ...values },
          isAddLoading: true
        })
        const form = { ...this.state.form, ...values }
        form.OrderMoney = +form.OrderMoney
        form.ConvertionMoney = +form.ConvertionMoney
        form.ServiceFee = +form.ServiceFee
        form.LeaseStartTime = values.RentDate[0]
        form.LeaseEndTime = values.RentDate[1]
        form.HouseID = +this.houseInfo.HouseID || +this.houseInfo.KeyID
        form.HouseName = this.houseInfo.HouseName
        form.HouseKey = this.houseInfo.HouseKey
        InsertOrderInfo(form)
          .then(res => {
            this.setState(
              {
                isAddLoading: false
              },
              () => {
                if (res.BusCode === 2) {
                  setTimeout(() => {
                    Alert.alert('温馨提示', res.Msg)
                  }, 100)
                  return
                }
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
                if (res.Data.AuditStatus === 1) {
                  setTimeout(() => {
                    Alert.alert(
                      '温馨提示',
                      '该预订单需要审核，请联系上级审核',
                      [
                        {
                          text: '确认',
                          onPress: () => {
                            this.orderSucessCb(res)
                          }
                        }
                      ]
                    )
                  }, 100)
                } else {
                  this.orderSucessCb(res)
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
    }, 400)
  }
  orderSucessCb = res => {
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
    } else if (this.query.path === 'AgentHomePage') {
      this.props.navigation.replace('AgentOrderList')
    } else {
      this.props.navigation.navigate('AgentOrderList')
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
            name="HouseName"
            title="房源名称"
            placeholder="请选择"
            disabled={this.disableHouseName}
            renderRight={!this.disableHouseName}
            onLabelPress={() => {
              this.showSelectHouseFn()
            }}
            value={this.state.HouseName}
          />
          <GiftedForm.TextInputWidget
            name="OrderName"
            title="预定人姓名"
            maxLength={14}
            value={form.OrderName}
          />

          <GiftedForm.TextInputWidget
            name="OrderPhone"
            title="预定人电话"
            maxLength={11}
            keyboardType="numeric"
            value={form.OrderPhone}
          />

          <GiftedForm.TextInputWidget
            name="OrderCardID"
            title="预定人身份证"
            maxLength={18}
            value={form.OrderCardID}
          />
          <GiftedForm.TextInputWidget
            name="OrderMoney"
            title="预定金额"
            forceChange={true}
            maxLength={10}
            tail="元"
            keyboardType="numeric"
            value={form.OrderMoney + ''}
          />
          <GiftedForm.TextInputWidget
            name="ConvertionMoney"
            title="约定租金"
            placeholder="请输入"
            maxLength={10}
            tail="元/月"
            keyboardType="numeric"
            clearButtonMode="while-editing"
            value={form.ConvertionMoney + ''}
          />
          <GiftedForm.NoticeWidget title={`付款方式`} />
          <GiftedForm.PickerWidget
            name="PayModel"
            title="押 1 付"
            data={new Array(12).fill('').map((x, i) => {
              return {
                label: i + 1 + '',
                value: i + 1
              }
            })}
            value={form.PayModel}
          />
          <GiftedForm.NoticeWidget title={`最晚付款日`} />
          <GiftedForm.PickerWidget
            name="AdvanceMonth"
            title="提前"
            tail="月"
            data={new Array(4).fill('').map((x, i) => {
              return {
                label: i + '个月',
                value: i
              }
            })}
            value={form.AdvanceMonth}
          />
          <GiftedForm.DatePickerWidget
            name="LastSignDate"
            title="最晚签约日"
            value={form.LastSignDate && dateFormat(form.LastSignDate)}
          />
          <GiftedForm.DatePickerRangeWidget
            name="RentDate"
            title="约定租期"
            cannotEqual
            value={form.RentDate}
          />
          <GiftedForm.TextInputWidget
            name="ServiceFee"
            title="服务费"
            maxLength={10}
            tail="元"
            keyboardType="numeric"
            value={form.ServiceFee + ''}
          />
          <GiftedForm.SeparatorWidget />

          <GiftedForm.NoticeWidget title="备注" />

          <GiftedForm.TextAreaWidget
            name="Remark"
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

export default withNavigation(connect()(AddOrder))
