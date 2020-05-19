import React, { Component } from 'react'
import { View, Alert } from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { ButtonGroup, Header } from '../../../../components'
import {
  UpdateOrderInfo,
  OrderMoneyExtension,
  TurnOrderinfo
} from '../../../../api/tenant'
import { dateFormat } from '../../../../utils/dateFormat'
import Toast from 'react-native-root-toast'
import FullModal from '../../../../components/FullModal'
import { deleteList, updateList, addList } from '../../../../redux/actions/list'
import { setOrderDetail } from '../../../../redux/actions/order'
import { connect } from 'react-redux'
import { validateNumber, validateCard } from '../../../../utils/validate'
import { showSelectAny } from '../../../../components/SelectAny/util'

const formatDate = date => {
  return dateFormat(new Date(date))
}
class AddOrder extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'editOrderForm'
    this.isEdit = false
    this.markFlag = false
    this.query = this.props.navigation.state.params || {}
    this.type = this.props.navigation.getParam('type', 1)
    this.data = this.props.navigation.getParam('data', {})
    this.state = {
      isAddLoading: false,
      isEditLoading: false,
      isDeleteLoading: false,
      HouseName: this.data.HouseName,
      btnOption: [{ label: '完成', value: 'Add' }],
      disabled: false,
      form: {
        ...this.data,
        LastSignDate: formatDate(this.data.LastSignDate),
        RentDate: [
          formatDate(this.data.LeaseStartTime),
          formatDate(this.data.LeaseEndTime)
        ]
      }
    }
    this.houseInfo = {
      HouseID: this.data.HouseID,
      HouseName: this.data.HouseName,
      HouseKey: this.data.HouseKey
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
    this.headerTitle =
      this.type === 1 ? '修改预定' : this.type === 2 ? '转定' : '续定'
    this.request =
      this.type === 1
        ? UpdateOrderInfo
        : this.type === 2
        ? TurnOrderinfo
        : OrderMoneyExtension
    this.viewDidAppear = null
  }

  componentWillMount() {
    this.viewDidAppear = this.props.navigation.addListener('willFocus', obj => {
      if (!obj.state.params) {
        return
      } else {
        const houseInfo = obj.state.params.houseInfo
        this.disableHouseName = !!obj.state.params.disableHouseName // 是否禁止修改房源名称
        if (houseInfo) {
          this.houseInfo = JSON.parse(houseInfo)
          this.setState({
            HouseName: this.houseInfo.HouseName
          })
        }
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
        if (values.ConvertionMoney < 0) {
          Toast.show(`服务费不能小于0!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return
        }
        if (
          this.type === 3 &&
          new Date(values.LastSignDate).getTime() <=
            new Date(this.data.LastSignDate).getTime()
        ) {
          Toast.show(
            `最晚签约日必须晚于${dateFormat(this.data.LastSignDate)}`,
            {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            }
          )
          return
        }
        if (
          values.LastSignDate &&
          values.OrderMoney > 0 &&
          values.ConvertionMoney > 0
        ) {
          const days = Math.ceil(
            (new Date(values.LastSignDate).getTime() -
              new Date(this.data.LastSignDate).getTime()) /
              3600 /
              1000 /
              24
          )
          const maxOrderMoney = Math.ceil(
            (values.ConvertionMoney / 30) * 2 * days
          )
          if (+values.OrderMoney < maxOrderMoney) {
            Toast.show(`预定金额不能小于${maxOrderMoney}元!`, {
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
        const form = { ...this.state.form }
        form.OrderMoney = +values.OrderMoney
        form.ConvertionMoney = +values.ConvertionMoney
        form.ServiceFee = +values.ServiceFee
        form.LeaseStartTime = values.RentDate[0]
        form.LeaseEndTime = values.RentDate[1]
        form.HouseID = +this.houseInfo.HouseID || +this.houseInfo.KeyID
        form.HouseName = this.houseInfo.HouseName
        form.HouseKey = this.houseInfo.HouseKey
        this.request(form)
          .then(({ Data }) => {
            this.setState(
              {
                isAddLoading: false
              },
              () => {
                Toast.show('保存成功', {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM
                })
                if (this.type === 1) {
                  debugger
                  this.props.dispatch(
                    updateList({
                      KeyID: Data.KeyID,
                      key: 'orderList',
                      data: Data
                    })
                  )
                  this.props.dispatch(setOrderDetail(Data))
                  this.props.navigation.navigate('AgentOrderDetail')
                } else {
                  this.props.navigation.navigate('AgentOrderList', {
                    isRefresh: true
                  })
                }
              }
            )
          })
          .catch(err => {
            this.setState({
              isAddLoading: false
            })
          })
      } else {
        const errors = GiftedFormManager.getValidationErrors(validationResults)
        Toast.show(errors[0], {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
      }
    }, 400)
  }

  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 2
      },
      path: 'AgentEditOrder',
      returnKey: 'houseInfo'
    })
  }

  render() {
    const { form } = this.state
    const { type } = this
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
            disabled={type != 2}
            renderRight={type == 2}
            onLabelPress={() => {
              this.showSelectHouseFn()
            }}
            value={this.state.HouseName}
          />
          <GiftedForm.TextInputWidget
            disabled={type != 1}
            name="OrderName"
            title="预定人姓名"
            maxLength={14}
            value={form.OrderName}
          />

          <GiftedForm.TextInputWidget
            disabled={type != 1}
            name="OrderPhone"
            title="预定人电话"
            maxLength={11}
            keyboardType="numeric"
            value={form.OrderPhone}
          />

          <GiftedForm.TextInputWidget
            disabled={type != 1}
            name="OrderCardID"
            title="预定人身份证"
            maxLength={18}
            value={form.OrderCardID}
          />
          <GiftedForm.TextInputWidget
            disabled={type != 3}
            name="OrderMoney"
            title="预定金额"
            forceChange={true}
            maxLength={10}
            tail="元"
            keyboardType="numeric"
            value={form.OrderMoney + ''}
          />
          <GiftedForm.TextInputWidget
            disabled={type != 1 || this.query.isAgent == true}
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
            disabled={type != 1}
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
            disabled={type != 1}
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
            disabled={type != 3}
            name="LastSignDate"
            title="最晚签约日"
            value={form.LastSignDate && dateFormat(form.LastSignDate)}
          />
          <GiftedForm.DatePickerRangeWidget
            disabled={type != 1 || (this.query.isAgent == true && 1)}
            name="RentDate"
            title="约定租期"
            cannotEqual
            value={form.RentDate}
          />
          <GiftedForm.TextInputWidget
            disabled={type != 1}
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
            disabled={type != 1}
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

export default connect()(AddOrder)
