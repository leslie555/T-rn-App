import React, { Component } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { ButtonGroup, Header } from '../../../components'
import { DisplayStyle } from '../../../styles/commonStyles'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../components/Form/GiftedForm'
import { Investment, OutOfHouse, InOfHouse } from '../../../api/house'
import Toast from 'react-native-root-toast'
import { validateNumber } from '../../../utils/validate'
import FullModal from '../../../components/FullModal'
import { showSelectAny } from '../../../components/SelectAny/util'
import { withNavigation } from 'react-navigation'

class Calculate extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.state = {
      isEdit: false,
      isShowModal: false,
      isEditLoading: false,
      KeyID: 0,
      HouseID: 0,
      HouseName: '',
      // 出房
      takeStatus: false,
      // 拿房
      getStatus: false,
      btnOptions: [{ label: '开始测算', value: 'Edit' }],
      RentType: 1,
      rulesForm: {
        HeightInvestment: '',
        Investment: ''
      },
      sendForm: {
        RedPrice: '',
        RoomNum: '',
        LowOutOfHousePrice: '',
        InOfHousePrice: '',
        HeightInvestment: '',
        SafetyFactor: '',
        Security: ''
      },
      takeForm: {
        PayStageTimeMark: [],
        HouseArea: '',
        RoomArea: '',
        Investment: ''
      },
      resForm: {
        SafetyFactor: '',
        Security: false,
        LowOutOfHousePrice: ''
      },
      resTakeForm: {
        SafetyFactor: '',
        Security: false,
        LowOutOfHousePrice: '',
        HeightInvestment: '',
        TotalPerformance: '',
        Accessibles: []
      },
      form: {
        EnterType: 1,
        TotalFloor: '',
        InFloor: '',
        InOfHousePrice: '',
        OutOfHousePrice: '',
        Investment: '',
        PayStageTimeMark: [],
        PayModel: 1,
        MoneyModel: 1,
        derotion: 1,
        Five1: 5,
        Five2: 0,
        One1: 1
      }
    }
    this.EnumData = {
      // 1，5+1，2，10%10%，3，y+a ,4y+b+1,5y+b+2,6,2333,7,23331
      PayModel: [
        {
          label: '5+1模式',
          value: 1
        },
        {
          label: '10%10%',
          value: 2
        },
        {
          label: 'Y模式',
          value: 3
        },
        {
          label: '2333模式',
          value: 6
        },
        {
          label: '23331模式',
          value: 7
        }
      ],
      EnterType: [
        {
          label: '整租',
          value: 1
        },
        {
          label: '合租',
          value: 2
        }
      ],
      Five1: this.createEnum(5, 12),
      Five2: (() => {
        var newPickerData = []
        for (let i = 0; i <= 10; i++) {
          newPickerData.push({
            label: `${i}%10%`,
            value: i
          })
        }
        return newPickerData
      })(),
      One1: this.createEnum(0, 12),
      derotion: [
        {
          label: '房东装修贷',
          value: 1
        },
        {
          label: '10-2-2-0-0',
          value: 2
        }
      ],
      MoneyModel: [
        {
          label: '现金',
          value: 1
        },
        {
          label: '装修贷',
          value: 2
        }
      ]
    }
    this.houseInfo = {}
  }

  componentDidMount() {
    this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
      if (!obj.state.params || !obj.state.params.houseInfo) {
        return
      } else {
        const HouseInfo = JSON.parse(obj.state.params.houseInfo)
        this.state.HouseID = HouseInfo.KeyID
        this.state.HouseName = HouseInfo.HouseName
        this.state.RentType = HouseInfo.RentType
        // this.fetchData(HouseInfo.HouseKey)
        this.fetch(HouseInfo.KeyID)
        this.props.navigation.setParams({ houseInfo: '' })
      }
    })
  }
  componentWillUnmount() {}
  handleEditClick = () => {
    if (this.props.activeIndex === 1) {
      this.submitTake()
    } else {
      this.submitGet()
    }
  }
  /*  changeActiveIndex(index) {
    if (this.props.activeIndex !== index) {
      let btns = [
        {
          label: '开始测算',
          value: 'Edit'
        }
      ]
      if (index === 1) {
        if (this.state.getStatus !== this.state.takeStatus) {
          if (this.state.getStatus) {
            btns = [
              {
                label: '重新测算',
                value: 'Edit'
              }
            ]
            this.setState({
              btnOptions: btns,
              activeIndex: index
            })
          } else {
            btns = [
              {
                label: '开始测算',
                value: 'Edit'
              }
            ]
            this.setState({
              btnOptions: btns,
              activeIndex: index
            })
          }
        } else {
          this.setState({
            activeIndex: index
          })
        }
      } else {
        if (this.state.getStatus !== this.state.takeStatus) {
          if (this.state.takeStatus) {
            btns = [
              {
                label: '重新测算',
                value: 'Edit'
              }
            ]
            this.setState({
              btnOptions: btns,
              activeIndex: index
            })
          } else {
            btns = [
              {
                label: '开始测算',
                value: 'Edit'
              }
            ]
            this.setState({
              btnOptions: btns,
              activeIndex: index
            })
          }
        } else {
          this.setState({
            activeIndex: index
          })
        }
      }
    }
  } */
  fetch(HouseID) {
    this.setState({
      isShowModal: true
    })
    Investment({
      HouseID
    })
      .then(response => {
        const data = response.Data
        this.state.takeForm.HouseArea = String(data.HouseArea)
        this.state.takeForm.RoomArea = String(data.RoomArea)
        this.state.takeForm.Investment = String(data.Investment)
        this.state.rulesForm.Investment = String(data.Investment)
        this.state.sendForm.RedPrice = data.RedPrice
        this.state.sendForm.RoomNum = data.RoomNum
        this.state.sendForm.LowOutOfHousePrice = data.LowOutOfHousePrice
        this.state.sendForm.InOfHousePrice = data.InOfHousePrice
        this.state.sendForm.HeightInvestment = data.HeightInvestment
        this.state.rulesForm.HeightInvestment = data.HeightInvestment
        this.state.sendForm.SafetyFactor = data.SafetyFactor
        this.state.sendForm.Security = data.Security
        this.setState({
          sendForm: this.state.sendForm,
          HeightInvestment: String(data.HeightInvestment),
          takeForm: this.state.takeForm,
          rulesForm: this.state.rulesForm,
          HouseID: this.state.HouseID,
          HouseName: this.state.HouseName,
          RentType: this.state.RentType,
          isShowModal: false
        })
      })
      .catch(() => {
        this.setState({
          isShowModal: false
        })
      })
  }
  createEnum(min, max) {
    if (!min && min !== 0) {
      min = 0
    }
    if (!max && max !== 0) {
      max = 20
    }
    var newPickerData = []
    for (let i = min; i <= max; i++) {
      newPickerData.push({
        label: `${i}`,
        value: i
      })
    }
    return newPickerData
  }
  changeEnterType(val) {
    this.setState({
      form: { ...this.state.form, EnterType: val }
    })
  }
  changePayModelType(val) {
    this.setState({
      form: { ...this.state.form, PayModel: val }
    })
  }
  changeMoneyModelType(val) {
    this.setState({
      form: { ...this.state.form, MoneyModel: val }
    })
  }
  // 拿房
  submitGet() {
    const validationResults0 = GiftedFormManager.validate('CalcForm1')
    const values0 = GiftedFormManager.getValues('CalcForm1')
    if (!validateNumber(values0.TotalFloor)) {
      Toast.show('总楼层必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else if (!validateNumber(values0.InFloor)) {
      Toast.show('所在楼层必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else if (!validateNumber(values0.InOfHousePrice)) {
      Toast.show('拿房价必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else if (!validateNumber(values0.OutOfHousePrice)) {
      Toast.show('出租价格必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (values0.EnterType === 2) {
      if (Number(values0.InFloor) > Number(values0.TotalFloor) - 2) {
        Toast.show('合租模式下不能出租最顶层和次顶层', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
    }
    if (validationResults0.isValid) {
      this.setState({
        isShowModal: true
      })
      let sendData = {}
      sendData.EnterType = values0.EnterType
      sendData.InFloor = values0.InFloor
      sendData.InOfHousePrice = values0.InOfHousePrice
      sendData.OutOfHousePrice = values0.OutOfHousePrice
      sendData.StartTime = values0.PayStageTimeMark[0]
      if (values0.PayModel !== 3) {
        sendData.Investment = values0.Investment
      }
      sendData.EndTime = values0.PayStageTimeMark[1]
      if (values0.PayModel === 1) {
        sendData.PayModel = values0.PayModel
        sendData.Five = values0.Five1
        sendData.One = values0.One1
      } else if (values0.PayModel === 2) {
        sendData.PayModel = values0.PayModel
        sendData.Five = values0.Five2
        sendData.One = 10
      } else if (values0.PayModel === 3) {
        if (values0.MoneyModel === 1) {
          sendData.PayModel = 3
          sendData.Five = 0
          sendData.One = 0
        } else if (values0.MoneyModel === 2) {
          if (values0.derotion === 1) {
            sendData.PayModel = 4
            sendData.Five = 0
            sendData.One = 0
          } else if (values0.derotion === 2) {
            sendData.PayModel = 5
            sendData.Five = 0
            sendData.One = 0
          }
        }
      } else {
        sendData.PayModel = values0.PayModel
        sendData.Five = 0
        sendData.One = 0
      }
      InOfHouse(sendData)
        .then(response => {
          const data = response.Data
          this.state.resTakeForm.SafetyFactor = `${data.SafetyFactor.toFixed(
            1
          )}${data.Security ? '(安全)' : '(不安全)'}`
          this.state.resTakeForm.Security = data.Security
          this.state.resTakeForm.LowOutOfHousePrice = String(
            data.LowOutOfHousePrice.toFixed(2)
          )
          this.state.resTakeForm.HeightInvestment = String(
            data.HeightInvestment.toFixed(2)
          )
          this.state.resTakeForm.TotalPerformance = String(
            data.TotalPerformance.toFixed(2)
          )
          this.state.resTakeForm.Accessibles = (() => {
            let newArr = []
            if (data.Accessibles.indexOf(-1) !== -1) {
              newArr = data.Accessibles.slice(0, data.Accessibles.indexOf(-1))
            } else {
              newArr = data.Accessibles
            }
            return newArr
          })()
          this.setState({
            takeStatus: true,
            form: { ...this.state.form, ...values0 },
            resTakeForm: this.state.resTakeForm,
            isShowModal: false
          })
          Toast.show('测算成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.changeBtnOptions()
        })
        .catch(() => {
          this.setState({
            isShowModal: false
          })
        })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults0)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      this.setState({
        isShowModal: false
      })
      return false
    }
  }
  // 出房
  submitTake() {
    const validationResults0 = GiftedFormManager.validate('CalcForm')
    const values0 = GiftedFormManager.getValues('CalcForm')
    if (!validateNumber(values0.Investment)) {
      Toast.show('投入金额必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else if (!validateNumber(values0.HouseArea)) {
      Toast.show('房源总面积必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else if (this.state.RentType === 2 && !validateNumber(values0.RoomArea)) {
      Toast.show('房间面积必须为数字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (Number(values0.Investment) < Number(this.state.rulesForm.Investment)) {
      Toast.show(`不能低于最低投入金额${this.state.rulesForm.Investment}元`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    } else if (
      Number(values0.Investment) > Number(this.state.rulesForm.HeightInvestment)
    ) {
      Toast.show(
        `不能高于最高投入金额${this.state.rulesForm.HeightInvestment}元`,
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        }
      )
      return false
    }
    if (validationResults0.isValid) {
      let sendData = {}
      this.setState({
        isShowModal: true
      })
      sendData.HouseName = values0.HouseName
      if (this.state.RentType === 2) {
        sendData.RoomArea = values0.RoomArea
      } else {
        sendData.RoomArea = this.state.takeForm.RoomArea
      }
      sendData.HouseArea = values0.HouseArea
      sendData.Investment = values0.Investment
      OutOfHouse({
        ...sendData,
        ...this.state.sendForm
      })
        .then(response => {
          const data = response.Data
          this.state.resForm.SafetyFactor = `${data.SafetyFactor.toFixed(1)}${
            data.Security ? '(安全)' : '(不安全)'
          }`
          this.state.resForm.Security = data.Security
          this.state.resForm.LowOutOfHousePrice = String(
            data.LowOutOfHousePrice.toFixed(2)
          )

          this.setState({
            resForm: this.state.resForm,
            takeForm: { ...this.state.takeForm, ...values0 },
            getStatus: true,
            isShowModal: false
          })
          Toast.show('测算成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.changeBtnOptions()
        })
        .catch(() => {
          this.setState({
            isShowModal: false
          })
        })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults0)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      this.setState({
        isShowModal: false
      })
      return false
    }
  }
  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 2
      },
      path: 'AgentOutHouseCalculate',
      returnKey: 'houseInfo'
    })
  }
  changeBtnOptions() {
    let btns = [
      {
        label: '开始测算',
        value: 'Edit'
      }
    ]
    if (this.props.activeIndex === 1 && this.state.getStatus) {
      btns = [
        {
          label: '重新测算',
          value: 'Edit'
        }
      ]
    } else if (this.props.activeIndex == 2 && this.state.takeStatus) {
      btns = [
        {
          label: '重新测算',
          value: 'Edit'
        }
      ]
    }
    this.setState({
      btnOptions: btns
    })
  }

  render() {
    const { takeForm, form, resTakeForm } = this.state
    const AccessiblesList = this.state.resTakeForm.Accessibles.map(
      (ele, index) => (
        <GiftedForm.TextInputWidget
          name='canRecevice'
          key={index}
          required={false}
          title={`${index + 1}次可入(元)`}
          disabled={true}
          maxLength={10}
          value={Number(ele)}
        />
      )
    )
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <FullModal visible={this.state.isShowModal} />
        <Header
          title={this.props.activeIndex === 1 ? '出房测算' : '拿房测算'}
        />
        {this.props.activeIndex === 1 ? (
          <GiftedForm
            formName='CalcForm' // GiftedForm instances that use the same name will also share the same states
            clearOnClose={false} // delete the values of the takeForm when unmounted
          >
            {/* <GiftedForm.NoticeWidget title={`${this.props.navigation.state.params.HouseName}`} /> */}
            <GiftedForm.LabelWidget
              name='HouseName'
              title='房源名称'
              placeholder='请选择'
              onLabelPress={() => {
                this.showSelectHouseFn()
              }}
              value={this.state.HouseName}
            />
            <GiftedForm.TextInputWidget
              name='Investment'
              title='投入金额(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={takeForm.Investment}
            />
            <GiftedForm.TextInputWidget
              name='HouseArea'
              title='房源总面积(平方米)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={takeForm.HouseArea}
            />
            {this.state.RentType === 2 ? (
              <GiftedForm.TextInputWidget
                name='RoomArea'
                title='房间面积(平方米)'
                keyboardType={this.numberPad}
                maxLength={10}
                value={takeForm.RoomArea}
              />
            ) : null}
            <GiftedForm.DatePickerRangeWidget
              name='PayStageTimeMark'
              title='租期'
              value={takeForm.PayStageTimeMark}
            />
            {this.state.getStatus ? (
              <View>
                <GiftedForm.NoticeWidget title='测算结果' />
                <GiftedForm.LabelWidget
                  name='SafetyFactor'
                  title='安全系数'
                  rightTextStyle={{
                    color: this.state.resForm.Security ? '#389ef2' : 'red'
                  }}
                  required={false}
                  renderRight={false}
                  disabled={true}
                  value={this.state.resForm.SafetyFactor}
                />
                <GiftedForm.LabelWidget
                  name='LowOutOfHousePrice'
                  title='最低出房价(元)'
                  required={false}
                  renderRight={false}
                  disabled={true}
                  value={this.state.resForm.LowOutOfHousePrice}
                />
              </View>
            ) : null}
          </GiftedForm>
        ) : (
          <GiftedForm
            formName='CalcForm1' // GiftedForm instances that use the same name will also share the same states
            clearOnClose={false} // delete the values of the form when unmounted
          >
            <GiftedForm.PickerWidget
              name='EnterType'
              title='出租方式'
              data={this.EnumData.EnterType}
              value={form.EnterType}
              onPickerConfirm={val => {
                this.changeEnterType(val)
              }}
            />
            <GiftedForm.TextInputWidget
              name='TotalFloor'
              title='总楼层'
              keyboardType={this.numberPad}
              maxLength={10}
              value={form.TotalFloor}
            />
            {/* 倒数两层不让选择 */}
            <GiftedForm.TextInputWidget
              name='InFloor'
              title='所在楼层'
              keyboardType={this.numberPad}
              maxLength={10}
              value={form.InFloor}
            />
            <GiftedForm.TextInputWidget
              name='InOfHousePrice'
              title='拿房价(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={form.InOfHousePrice}
            />
            <GiftedForm.TextInputWidget
              name='OutOfHousePrice'
              title='出租价格(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={form.OutOfHousePrice}
            />
            <GiftedForm.DatePickerRangeWidget
              name='PayStageTimeMark'
              title='托管周期'
              value={form.PayStageTimeMark}
            />
            <GiftedForm.PickerWidget
              name='PayModel'
              title='拿房模式'
              data={this.EnumData.PayModel}
              value={form.PayModel}
              onPickerConfirm={val => {
                this.changePayModelType(val)
              }}
            />
            {this.state.form.PayModel === 1 ? (
              <GiftedForm.NoticeWidget title='更改5+1模式' />
            ) : null}
            {this.state.form.PayModel === 1 ? (
              <GiftedForm.PickerWidget
                name='Five1'
                title='5+1模式第一个值(5-12)'
                data={this.EnumData.Five1}
                value={form.Five1}
              />
            ) : null}
            {this.state.form.PayModel === 1 ? (
              <GiftedForm.PickerWidget
                name='One1'
                title='5+1模式第二个值(0-12)'
                data={this.EnumData.One1}
                value={form.One1}
              />
            ) : null}
            {this.state.form.PayModel === 2 ? (
              <GiftedForm.NoticeWidget title='更改10%10%模式' />
            ) : null}
            {this.state.form.PayModel === 2 ? (
              <GiftedForm.PickerWidget
                name='Five2'
                title='更改10%10%模式'
                data={this.EnumData.Five2}
                value={form.Five2}
              />
            ) : null}
            {this.state.form.PayModel === 3 ? (
              <GiftedForm.PickerWidget
                name='MoneyModel'
                title='方式'
                data={this.EnumData.MoneyModel}
                value={form.MoneyModel}
                onPickerConfirm={val => {
                  this.changeMoneyModelType(val)
                }}
              />
            ) : null}
            {this.state.form.PayModel === 3 &&
            this.state.form.MoneyModel === 2 ? (
              <GiftedForm.PickerWidget
                name='derotion'
                title='装修贷方式'
                data={this.EnumData.derotion}
                value={form.derotion}
              />
            ) : null}
            {this.state.form.PayModel !== 3 ? (
              <GiftedForm.NoticeWidget title='投入金额' />
            ) : null}
            {this.state.form.PayModel !== 3 ? (
              <GiftedForm.TextInputWidget
                name='Investment'
                title='投入金额(元)'
                keyboardType={this.numberPad}
                maxLength={10}
                value={form.Investment}
              />
            ) : null}
            {this.state.takeStatus ? (
              <View>
                <GiftedForm.NoticeWidget title='测算结果' />
                <GiftedForm.LabelWidget
                  name='SafetyFactor'
                  title='安全系数'
                  rightTextStyle={{
                    color: this.state.resTakeForm.Security ? '#389ef2' : 'red'
                  }}
                  required={false}
                  renderRight={false}
                  maxLength={10}
                  disabled={true}
                  value={resTakeForm.SafetyFactor}
                />
                <GiftedForm.LabelWidget
                  name='LowOutOfHousePrice'
                  title='最高拿房价(元)'
                  required={false}
                  renderRight={false}
                  disabled={true}
                  maxLength={10}
                  value={resTakeForm.LowOutOfHousePrice}
                />
                {this.state.form.PayModel !== 3 ? (
                  <GiftedForm.LabelWidget
                    name='HeightInvestment'
                    title='最高投入(元)'
                    required={false}
                    renderRight={false}
                    disabled={true}
                    maxLength={10}
                    value={resTakeForm.HeightInvestment}
                  />
                ) : null}
                <GiftedForm.LabelWidget
                  name='TotalPerformance'
                  title='总业绩(元)'
                  required={false}
                  renderRight={false}
                  disabled={true}
                  maxLength={10}
                  value={resTakeForm.TotalPerformance}
                />
                {AccessiblesList}
              </View>
            ) : null}
          </GiftedForm>
        )}
        <ButtonGroup
          options={this.state.btnOptions}
          handleEditClick={this.handleEditClick}
          isEditLoading={this.state.isEditLoading}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  DefalultHeader_Title_Box: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  notActive: {
    fontSize: Platform.OS === 'ios' ? 15 : 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: 'rgba(250, 250, 250, 0.5)'
  }
})

export default withNavigation(Calculate)
