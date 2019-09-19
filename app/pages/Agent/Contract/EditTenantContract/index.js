import React, {Component} from 'react'
import {Alert, Button, Linking, Platform, Text, TouchableOpacity, View} from 'react-native'
import styles from '../EditOwnerContract/style'
import {BillPanel} from '../EditOwnerContract/components'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {connect} from 'react-redux'
import {ButtonGroup, FullModal, Header, StepsBox, UploadFile} from "../../../../components";
import {
  AppGetContractTenantDetail,
  editTenantContract,
  getTenantBill,
  insertTenantContract,
  QueryHouseContractStatus
} from "../../../../api/tenant";
import {StateTenContract} from "../../../../api/system";
import {searchHouseConfig} from "../../../../api/house";
import {deepCopy, DiffArrFn, isDiffObj} from "../../../../utils/arrUtil";
import {dateFormat} from "../../../../utils/dateFormat";
import Toast from 'react-native-root-toast';
import IconFont from "../../../../utils/IconFont";
import store from "../../../../redux/store/store";
import {updateContractDetail} from "../../../../redux/actions/contract";
import {updateList} from "../../../../redux/actions/list";
import {validateNumber, validatePhoneNumber} from "../../../../utils/validate";
import {showSelectAny} from "../../../../components/SelectAny/util";

class TenantContract extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.stepList = [
      {
        title: '承租人信息'
      }, {
        title: '租约信息'
      }, {
        title: '生成账单'
      }, {
        title: '附加条款'
      }
    ]
    this.refSteps = null
    this.refBillPanel = null
    this.EnumData = {
      Sex: [],
      TenantStageType: [],
      DepositModel: [],
      PayModel: [],
      RentIncludeCost: [],
      PayTimeType: [],
      PaperType: [],
      IncreaseType: [],
      IncreaseFrequency: [],
      MaxLiverCount: []
    } //枚举类型
    this.EnumProps = {
      value: 'Value',
      label: 'Description'
    }
    this.query = this.props.navigation.state.params || {} // 路由参数 KeyID,Renew
    this.editType = this.query.Renew ? 2 : (this.query.KeyID ? 1 : 0) // 0新增 1修改 2续约
    this.headerTitle = ['新增租客合同', '修改租客合同', '续约租客合同'][this.editType]
    this.isLoadBookKeep = false
    this.isLoadBillList = false
    this.cloneData = {
      ImageUpload: [],
      BookKeep: [],
      OutRoomInfoList: [],
      LivePeopleInfoList: [],
      PassengerChannel: []
    } // clone的旧数据
    this.billForm = {}// 账单表单 用于对比是否修改了账单
    this.BillList = [] // 账单信息
    this.BookKeep = [] // 其他记账
    this.state = {
      currentIndex: 0,
      ContractInfo: {
        PaperType: 0,
        ContractTemplateName: '',
        ContractNumber: '',
        TenantName: '',
        TenantPhone: '',
        TenantCard: '',
        TenantSex: 0,
        EmergencyContactName: '',
        EmergencyContactPhone: '',
        IsAgentMark: false,
        AgentName: '',
        AgentPhone: '',
        AgentCard: '',
        TenantContractRemark: '',
        HostTimeMark: [],
        DepositModel: 1,
        PayModel: 3,
        HouseRent: '',
        HouseDeposit: '',
        IsPayStageMark: false,
        TenantStageType: 0,
        PayStageTimeMark: [],
        IncreaseNum: '',
        IncreaseMoney: '',
        IncreaseType: 0,
        IncreaseFrequency: 1,
        PayDays: 15,
        PayTimeType: 0,
        MaxLiverCount: 1,
        PassengerChannel: 0,
        WaterBaseNumber: '',
        ElectricityBaseNumber: '',
        GasBaseNumber: ''
      },
      detailLoading: false,
      billLoading: false,
      orderLoading: false,
      HouseInfo: {}, // 房源信息
      LivePeopleInfoList: [], // 入住人列表
      RentIncludeCost: [], //  租金项目
      ImageUpload: [],
      ContractTemplate: [], // 合同模板
      TenantContractOperate: [], // 合同操作表
      OutRoomInfoList: [], // 出房人列表
      btnOptions: [
        {
          label: '下一步',
          value: 'Next'
        }
      ], // 按钮组
      Decoration: [], // 所有装修情况数据
      TenantConTractQuipment: [], //房屋设备
    }

    // 路由监听
    this.didBlurSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          if (payload.state.params && payload.state.params.houseInfo) {
            this.selectHouse(JSON.parse(payload.state.params.houseInfo))
          }
          if (payload.state.params && payload.state.params.employeeInfo) {
            const item = JSON.parse(payload.state.params.employeeInfo)
            const index = this.state.OutRoomInfoList.findIndex(x => x.Tel === item.Tel)
            if (index === -1) {
              this.state.OutRoomInfoList.push(item)
            } else {
              this.state.OutRoomInfoList[index] = item
            }
            this.setState({
              OutRoomInfoList: this.state.OutRoomInfoList
            })
          }
          // 租金包含费用数据拦截
          if (payload.state.params && payload.state.params.rentIncludeCostInfo) {
            this.setState({
              RentIncludeCost: JSON.parse(payload.state.params.rentIncludeCostInfo)
            })
          }
          // 装修清单数据拦截
          if (payload.state.params && payload.state.params.decorationInfo) {
            const item = this.state.Decoration.find(x => x.KeyID === payload.state.params.decorationID)
            item.PDecoration = JSON.parse(payload.state.params.decorationInfo)
            item.checkNum = payload.state.params.decorationNum
            this.setState({
              Decoration: this.state.Decoration
            })
          }
          // 设备清单数据拦截
          if (payload.state.params && payload.state.params.equipmentInfo) {
            this.setState({
              TenantConTractQuipment: JSON.parse(payload.state.params.equipmentInfo)
            })
          }
        }
    )
  }

  componentWillMount() {
    this.fetchData()
    this.initEnumData()
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.didBlurSubscription.remove()
  }

  initEnumData() {
    const Sex = this.props.enumList.EnumSex.slice()
    this.EnumData.Sex = Sex
    const TenantStageType = this.props.enumList.EnumTenantStageType.slice()
    TenantStageType.shift()
    this.EnumData.TenantStageType = TenantStageType
    const IncreaseType = this.props.enumList.EnumIncreaseType.slice()
    IncreaseType.splice(1, 1) // 删除掉不规则递增
    this.EnumData.IncreaseType = IncreaseType
    const PassengerChannel = this.props.enumList.EnumPassengerChannel.slice()
    PassengerChannel[0].Description = '无'
    this.EnumData.PassengerChannel = PassengerChannel
    this.EnumData.DepositModel = [
      {
        label: '1',
        value: 1
      },
      {
        label: '2',
        value: 2
      },
      {
        label: '3',
        value: 3
      }
    ]
    this.EnumData.PayModel = new Array(12).fill('').map((x, i) => {
      return {
        label: i + 1 + '',
        value: i + 1
      }
    })
    this.EnumData.MaxLiverCount = new Array(30).fill('').map((x, i) => {
      return {
        label: i + 1 + '',
        value: i + 1
      }
    })
    this.EnumData.PayTimeType = [
      {
        label: '提前几天',
        value: 0
      },
      {
        label: '固定几号（当月）',
        value: 1
      },
      {
        label: '固定几号（提前一个月）',
        value: 2
      },
      {
        label: '固定几号（延后一个月）',
        value: 3
      }
    ]
    this.EnumData.IncreaseFrequency = [
      {
        label: '一次',
        value: 1
      },
      {
        label: '每年',
        value: 2
      }
    ]
    this.EnumData.PaperType = [
      {
        label: '电子合同',
        value: 0
      },
      {
        label: '纸质合同',
        value: 1
      }
    ]
  }

  validateForm0(form) {
    if (!validatePhoneNumber(form.TenantPhone)) {
      Toast.show('承租人电话格式不正确', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validatePhoneNumber(form.EmergencyContactPhone)) {
      Toast.show('紧急联系人电话格式不正确', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validatePhoneNumber(form.AgentPhone)) {
      Toast.show('代办人电话格式不正确', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    return true
  }

  validateForm1(form) {
    const options1 = {
      min: 0,
      max: 100000
    }
    const options2 = {
      min: 1,
      max: 100,
      int: true
    }
    const msg1 = `只能为0-100000的数字`
    const msg2 = `只能为1-100的整数`
    if (!validateNumber(form.HouseRent, options1)) {
      Toast.show(`房屋租金` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.HouseDeposit, options1)) {
      Toast.show(`房屋押金` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.IncreaseNum, options2)) {
      Toast.show(`递增年` + msg2, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.IncreaseMoney, options1)) {
      Toast.show(`递增值` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.PayDays, {
      min: 0,
      max: 31,
      int: true
    })) {
      Toast.show(`最晚付款日只能为0-31的整数`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    return true
  }

  validateForm3(form) {
    const options1 = {
      min: 0,
      max: 1000000
    }
    const msg1 = `只能为0-1000000的数字`
    if (!validateNumber(form.WaterBaseNumber, options1)) {
      Toast.show(`水底数` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.ElectricityBaseNumber, options1)) {
      Toast.show(`电底数` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.GasBaseNumber, options1)) {
      Toast.show(`天然气底数` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    return true
  }

  render() {
    return (
        <View style={styles.owner_content}>
          <FullModal
              visible={this.state.billLoading || this.state.detailLoading || this.state.orderLoading}/>
          <Header title={this.headerTitle}
                  leftClick={() => {
                    this.handleBack()
                  }}
                  headerRight={
                    this.state.currentIndex > 0 &&
                    <TouchableOpacity onPress={() => this.createOrder('TemporaryStorage')}>
                      <Text style={styles.owner_header_right_text}>暂存</Text>
                    </TouchableOpacity>
                  }/>
          <StepsBox list={this.stepList} renderNum={1} navigation={this.props.navigation} viewList={[
            this.getStep1View(),
            this.getStep2View(),
            this.getStep3View(),
            this.getStep4View()
          ]} handleChange={this.stepChange} ref={(refSteps) => {
            this.refSteps = refSteps
          }}/>
          <View>
            <ButtonGroup
                options={this.state.btnOptions}
                handleSaveClick={() => this.createOrder('Save')}
                handlePrevClick={this.prev}
                handleNextClick={this.next}
            />
          </View>
        </View>
    )
  }

  getStep1View() {
    const {ContractInfo, ContractTemplate, HouseInfo, LivePeopleInfoList} = this.state
    return (
        <GiftedForm
            formName='EditTenantContractRuleForm0'
        >
          <GiftedForm.NoticeWidget title={`合同信息`}/>
          <GiftedForm.PickerWidget
              name='PaperType'
              title='合同类型'
              onPickerConfirm={(val) => {
                this.contractInfoChange(val, 'PaperType')
                this.changeBtnOptions()
              }}
              data={this.EnumData.PaperType}
              value={ContractInfo.PaperType}
          />
          {ContractInfo.PaperType === 0 ?
              <GiftedForm.PickerWidget
                  name='ContractTemplateName'
                  title='合同模板'
                  data={ContractTemplate}
                  value={ContractInfo.ContractTemplateName}
                  mapKey={{value: 'ContractTemplateName', label: 'ContractTemplateName'}}
              /> :
              <GiftedForm.TextInputWidget
                  name='ContractNumber'
                  title='合同编号'
                  maxLength={50}
                  value={ContractInfo.ContractNumber + ''}
              />
          }
          <GiftedForm.NoticeWidget title={`房源信息`}/>
          <GiftedForm.LabelWidget
              name='HouseName'
              title='房源名称'
              placeholder='请选择'
              onLabelPress={() => {
                this.showSelectHouseFn()
              }}
              value={HouseInfo.HouseName}
          />
          <GiftedForm.NoticeWidget title={`承租人信息`}/>
          <GiftedForm.TextInputWidget
              name='TenantName'
              title='承租人姓名'
              maxLength={10}
              value={ContractInfo.TenantName + ''}
              onChangeText={(val) => {
                this.changeLivePeople(val, 'LiverName')
              }}
          />
          <GiftedForm.TextInputWidget
              name='TenantPhone'
              title='承租人电话'
              maxLength={11}
              keyboardType={`phone-pad`}
              value={ContractInfo.TenantPhone + ''}
              onChangeText={(val) => {
                this.changeLivePeople(val, 'LiverPhone')
              }}
          />
          <GiftedForm.TextInputWidget
              name='TenantCard'
              title='承租人身份证'
              maxLength={18}
              value={ContractInfo.TenantCard + ''}
              onChangeText={(val) => {
                this.changeLivePeople(val, 'CardID')
              }}
          />
          <GiftedForm.PickerWidget
              name='TenantSex'
              title='承租人性别'
              data={this.EnumData.Sex}
              value={ContractInfo.TenantSex}
              mapKey={this.EnumProps}
              onPickerConfirm={(val) => {
                this.changeLivePeople(val, 'LiverSex')
              }}
          />
          <GiftedForm.TextInputWidget
              name='EmergencyContactName'
              title='紧急联系人姓名'
              required={false}
              maxLength={10}
              value={ContractInfo.EmergencyContactName + ''}
              onChangeText={(val) => {
                this.changeLivePeople(val, 'EmergencyContactName')
              }}
          />
          <GiftedForm.TextInputWidget
              name='EmergencyContactPhone'
              title='紧急联系人电话'
              maxLength={11}
              required={false}
              keyboardType={`phone-pad`}
              value={ContractInfo.EmergencyContactPhone + ''}
              onChangeText={(val) => {
                this.changeLivePeople(val, 'EmergencyContactPhone')
              }}
          />
          <GiftedForm.PickerWidget
              name='PassengerChannel'
              title='获客渠道'
              data={this.EnumData.PassengerChannel}
              value={ContractInfo.PassengerChannel}
              mapKey={this.EnumProps}
          />
          <GiftedForm.NoticeWidget title={`代办人信息`}/>
          <GiftedForm.SwitchWidget
              name='IsAgentMark'
              title='是否代办'
              required={false}
              onSwitchChange={(val) => this.agentChange(val)}
              value={ContractInfo.IsAgentMark}
          />
          {ContractInfo.IsAgentMark &&
          <GiftedForm.TextInputWidget
              name='AgentName'
              title='代办人姓名'
              maxLength={10}
              value={ContractInfo.AgentName + ''}
          />}
          {ContractInfo.IsAgentMark &&
          <GiftedForm.TextInputWidget
              name='AgentPhone'
              title='代办人电话'
              maxLength={11}
              keyboardType={`phone-pad`}
              value={ContractInfo.AgentPhone + ''}
          />}
          {ContractInfo.IsAgentMark &&
          <GiftedForm.TextInputWidget
              name='AgentCard'
              title='代办人身份证'
              maxLength={18}
              keyboardType={this.numberPad}
              value={ContractInfo.AgentCard + ''}
          />}
          <GiftedForm.NoticeWidget title={`入住人信息`} rightView={
            <TouchableOpacity onPress={() => this.handleLiveInAdd()} style={styles.add_owner_btn_box}>
              <Text style={styles.add_owner_btn_text}>添加入住人</Text>
            </TouchableOpacity>
          }/>
          <GiftedForm.PickerWidget
              name='MaxLiverCount'
              title='最多入住人'
              data={this.EnumData.MaxLiverCount}
              value={ContractInfo.MaxLiverCount}
          />
          {LivePeopleInfoList.map((item, index) => {
            return (
                <View style={{marginTop: 10}} key={index}
                      formName={'liveInForm' + index}>
                  <View style={styles.add_owner_title_box}>
                    <Text style={styles.add_owner_title_text}>{`入住人${index + 1}：`}</Text>
                    {LivePeopleInfoList.length > 1 &&
                    <TouchableOpacity style={styles.owner_del_btn} onPress={() => this.handleLiveInDelete(index)}>
                      <IconFont name='jiahao1' size={10} color='#fff'/>
                    </TouchableOpacity>}
                  </View>
                  <GiftedForm.TextInputWidget
                      name={`LiverName${index}`}
                      title='入住人姓名'
                      maxLength={10}
                      onChangeText={(val) => {
                        this.liveInInfoChange(val, index, 'LiverName')
                      }}
                      value={item.LiverName + ''}
                  />
                  <GiftedForm.TextInputWidget
                      name={`LiverPhone${index}`}
                      title='入住人电话'
                      maxLength={20}
                      onChangeText={(val) => {
                        this.liveInInfoChange(val, index, 'LiverPhone')
                      }}
                      keyboardType={`phone-pad`}
                      value={item.LiverPhone + ''}
                  />
                  <GiftedForm.TextInputWidget
                      name={`CardID${index}`}
                      title='身份证号'
                      maxLength={18}
                      onChangeText={(val) => {
                        this.liveInInfoChange(val, index, 'CardID')
                      }}
                      keyboardType={this.numberPad}
                      value={item.CardID + ''}
                  />
                  <GiftedForm.PickerWidget
                      name={`LiverSex${index}`}
                      title='入住人性别'
                      data={this.EnumData.Sex}
                      value={item.LiverSex}
                      mapKey={this.EnumProps}
                      onPickerConfirm={(val) => {
                        this.liveInInfoChange(val, index, 'LiverSex')
                      }}
                  />
                </View>
            )
          })}
          <GiftedForm.NoticeWidget title={`出房人信息`} rightView={
            <TouchableOpacity onPress={() => this.showSelectEmployeeFn()} style={styles.add_owner_btn_box}>
              <Text style={styles.add_owner_btn_text}>添加出房人</Text>
            </TouchableOpacity>
          }/>
          {this.state.OutRoomInfoList.map((item, index) => {
            return (
                <View style={styles.add_owner_box} key={index}
                      formName={'outRoomForm' + index}>
                  <View style={styles.add_owner_title_box}>
                    <Text style={styles.add_owner_title_text}>{`出房人${index + 1}：`}</Text>
                    <TouchableOpacity style={styles.owner_del_btn} onPress={() => this.handleOutRoomDelete(index)}>
                      <IconFont name='jiahao1' size={10} color='#fff'></IconFont>
                    </TouchableOpacity>
                  </View>
                  <GiftedForm.LabelWidget
                      name={`OutRoomName${index}`}
                      title='出房人信息'
                      renderRight={false}
                      value={`${item.UserName}(${item.Tel})`}
                  />
                </View>
            )
          })}
          <GiftedForm.NoticeWidget title={`添加附件`}/>
          <UploadFile list={this.state.ImageUpload} type={`AgentEditTenantContract`}
                      onChange={(data) => this.onUploadFileChange(data)}/>
        </GiftedForm>
    )
  }

  getStep2View() {
    const {ContractInfo} = this.state
    return (
        <GiftedForm
            formName='EditTenantContractRuleForm1'
        >
          <GiftedForm.NoticeWidget title={`租约信息`}/>
          <GiftedForm.DatePickerRangeWidget
              name='HostTimeMark'
              cannotEqual
              title='租期时间'
              value={ContractInfo.HostTimeMark}
          />
          <GiftedForm.NoticeWidget title={`付款方式`}/>
          <GiftedForm.PickerWidget
              name='DepositModel'
              title='押'
              data={this.EnumData.DepositModel}
              value={ContractInfo.DepositModel}
          />
          <GiftedForm.PickerWidget
              name='PayModel'
              title='付'
              data={this.EnumData.PayModel}
              value={ContractInfo.PayModel}
          />
          <GiftedForm.TextInputWidget
              name='HouseRent'
              title='房屋租金'
              maxLength={6}
              keyboardType={this.numberPad}
              value={ContractInfo.HouseRent + ''}
              tail={`元/月`}
              onEndEditing={(val) => {
                this.calcPrice(val.nativeEvent.text)
              }}
          />
          <GiftedForm.TextInputWidget
              name='HouseDeposit'
              title='房屋押金'
              maxLength={6}
              keyboardType={this.numberPad}
              value={ContractInfo.HouseDeposit + ''}
              tail={`元`}
          />
          <GiftedForm.SwitchWidget
              name='IsPayStageMark'
              title='是否分期'
              required={false}
              onSwitchChange={(val) => this.stageChange(val)}
              value={ContractInfo.IsPayStageMark}
          />
          {ContractInfo.IsPayStageMark &&
          <GiftedForm.PickerWidget
              name='TenantStageType'
              title='分期类型'
              data={this.EnumData.TenantStageType}
              value={ContractInfo.TenantStageType}
              mapKey={this.EnumProps}
          />
          }
          {ContractInfo.IsPayStageMark &&
          <GiftedForm.DatePickerRangeWidget
              name='PayStageTimeMark'
              cannotEqual
              title='分期时间'
              value={ContractInfo.PayStageTimeMark}
          />
          }
          <GiftedForm.NoticeWidget title={`递增方式`}/>
          <GiftedForm.PickerWidget
              name='IncreaseType'
              title='递增方式'
              data={this.EnumData.IncreaseType}
              value={ContractInfo.IncreaseType}
              mapKey={this.EnumProps}
              onPickerConfirm={(val) => {
                this.contractInfoChange(val, 'IncreaseType')
              }}
          />
          {(ContractInfo.IncreaseType == 2 || ContractInfo.IncreaseType == 3) &&
          <GiftedForm.PickerWidget
              name='IncreaseFrequency'
              title='递增频率'
              data={this.EnumData.IncreaseFrequency}
              value={ContractInfo.IncreaseFrequency}
          />}
          {(ContractInfo.IncreaseType == 2 || ContractInfo.IncreaseType == 3) &&
          <GiftedForm.TextInputWidget
              name='IncreaseNum'
              title='第几年递增'
              maxLength={2}
              keyboardType={this.numberPad}
              value={ContractInfo.IncreaseNum + ''}
              tail={`年`}
          />}
          {(ContractInfo.IncreaseType == 2 || ContractInfo.IncreaseType == 3) &&
          <GiftedForm.TextInputWidget
              name='IncreaseMoney'
              title='递增值'
              maxLength={6}
              keyboardType={this.numberPad}
              value={ContractInfo.IncreaseMoney + ''}
              tail={ContractInfo.IncreaseType == 3 ? '%/年' : '元/年'}
          />}
          <GiftedForm.NoticeWidget title={`最晚付款日规则`}/>
          <GiftedForm.PickerWidget
              name='PayTimeType'
              title='付款规则'
              onPickerConfirm={(val) => {
                this.contractInfoChange(val, 'PayTimeType')
              }}
              data={this.EnumData.PayTimeType}
              value={ContractInfo.PayTimeType}
          />
          <GiftedForm.TextInputWidget
              name='PayDays'
              title={ContractInfo.PayTimeType == 0 ? '最晚付款天数' : '最晚付款日'}
              maxLength={2}
              keyboardType={this.numberPad}
              value={ContractInfo.PayDays + ''}
              tail={ContractInfo.PayTimeType == 0 ? '天' : '号'}
          />
          <GiftedForm.NoticeWidget title={`租金包含费用`}/>
          <GiftedForm.LabelWidget
              title='租金包含费用'
              required={false}
              value={this.state.RentIncludeCost.length === 0 ? '请选择' : `已选择${this.state.RentIncludeCost.length}个`}
              onLabelPress={() => {
                this.showRentIncludeCostFn()
              }}
          />
        </GiftedForm>
    )
  }

  getStep3View() {
    return (
        <BillPanel type={1} navigation={this.props.navigation} houseInfo={this.state.HouseInfo} ref={(refSteps) => {
          this.refBillPanel = refSteps
        }}/>
    )
  }

  getStep4View() {
    const {ContractInfo} = this.state
    return (
        <GiftedForm
            formName='EditTenantContractRuleForm3'
        >
          <GiftedForm.NoticeWidget title={`交割信息`}/>
          <GiftedForm.TextInputWidget
              name='WaterBaseNumber'
              title='水表底数'
              maxLength={7}
              required={false}
              keyboardType={this.numberPad}
              value={ContractInfo.WaterBaseNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='ElectricityBaseNumber'
              title='电表底数'
              maxLength={7}
              required={false}
              keyboardType={this.numberPad}
              value={ContractInfo.ElectricityBaseNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='GasBaseNumber'
              title='气表底数'
              maxLength={7}
              required={false}
              keyboardType={this.numberPad}
              value={ContractInfo.GasBaseNumber + ''}
              tail={`m³`}
          />
          <GiftedForm.LabelWidget
              title='房屋设备清单'
              required={false}
              value={this.state.TenantConTractQuipment.length === 0 ? '请选择' : `已选择${this.state.TenantConTractQuipment.length}个`}
              onLabelPress={() => {
                this.showContractEquipmentsFn()
              }}
          />
          <GiftedForm.NoticeWidget title={`装修情况`}/>
          {this.state.Decoration.map((item, index) => {
            return (
                <GiftedForm.LabelWidget
                    key={index}
                    title={item.Name}
                    required={false}
                    value={item.checkNum === 0 ? '请选择' : `已选择${item.checkNum}个`}
                    onLabelPress={() => {
                      this.showFitUpEquipmentsFn(item)
                    }}
                />
            )
          })}
          <GiftedForm.NoticeWidget title={`附加条款`}/>
          <GiftedForm.TextAreaWidget
              name='TenantContractRemark'
              required={false}
              placeholder='请输入附加条款'
              maxLength={1500}
              value={ContractInfo.TenantContractRemark}
          />
        </GiftedForm>
    )
  }

  fetchData() {
    this.setState({
      detailLoading: true
    })
    AppGetContractTenantDetail({
      tenantID: (this.query.KeyID || 0) - 0, //41742
      houseID: (this.query.HouseID || 0) - 0,
      orderID: (this.query.OrderID || 0) - 0,
      type: 1
    }).then(({Data}) => {
      this.initPageData(Data)
    }).finally(() => {
      this.setState({
        detailLoading: false
      })
    })
  }

  initPageData({ContractTemplate, TenantContractInfo, HouseInfo, ImageUpload, LivePeopleInfoList, TenantBill, BookKeep, TenantContractOperate, OutRoominfoList, Decoration = [], TenDecoration = [], TenantConTractQuipment = []}) {
    // 装修清单初始化
    if (Decoration.length > 0) {
      Decoration.forEach(x => {
        x.checkNum = 0
        x.PDecoration.forEach((cItem, cIndex) => {
          cItem.isChecked = false
        })
      })
    }
    const ContractStateModel = {
      ContractTemplate,
      Decoration
    }
    ContractStateModel.ContractInfo = {
      ...this.state.ContractInfo,
      ContractTemplateName: ContractTemplate[0].ContractTemplateName
    }
    /* 续签删除账期和记账 */
    if (this.editType === 2) {
      TenantBill = []
      BookKeep = []
    }
    if (TenantContractOperate) {
      ContractStateModel.TenantContractOperate = TenantContractOperate
    }
    if (HouseInfo) {
      this.selectHouse(HouseInfo, ContractStateModel.ContractInfo)
    }
    if (ImageUpload) {
      ContractStateModel.ImageUpload = ImageUpload
      this.cloneData.ImageUpload = deepCopy(ImageUpload)
    }
    if (BookKeep && BookKeep.length > 0) {
      this.BookKeep = BookKeep
      this.cloneData.BookKeep = deepCopy(BookKeep)
      // this.refBillPanel.initBookData(BookKeep)
    }
    if (TenantBill && TenantBill.length > 0) {
      this.BillList = TenantBill
      // this.refBillPanel.initBillData(TenantBill)
    }
    if (TenantContractInfo) {
      if (!TenantContractInfo.IncreaseFrequency) {
        TenantContractInfo.IncreaseFrequency = 0
        ContractStateModel.ContractInfo.IncreaseFrequency = 0
      }
      if (!TenantContractInfo.KeyID) {
        // 预定签合同 和房源签合同
        // this.state.ContractInfo.StartTime = TenantContractInfo.StartTime
        // this.state.ContractInfo.EndTime = TenantContractInfo.EndTime
        ContractStateModel.ContractInfo = {
          ...ContractStateModel.ContractInfo,
          TenantName: TenantContractInfo.TenantName || "",
          TenantPhone: TenantContractInfo.TenantPhone || "",
          HouseRent: TenantContractInfo.HouseRent || 0,
          HouseDeposit: TenantContractInfo.HouseDeposit || 0,
        }
      } else {
        ContractStateModel.ContractInfo = {
          ...this.state.ContractInfo, ...TenantContractInfo
        }
        // 合同编号重置
        if (this.editType === 2) {
          ContractStateModel.ContractInfo.ContractNumber = ''
        }
        if (!ContractStateModel.PayDays) {
          ContractStateModel.PayDays = 15
        }
        // 代理人信息
        ContractStateModel.ContractInfo.IsAgentMark = ContractStateModel.ContractInfo.IsAgent === 1
        // 是否分期
        ContractStateModel.ContractInfo.IsPayStageMark = ContractStateModel.ContractInfo.IsPayStage === 1
        // 托管时间和分期时间
        ContractStateModel.ContractInfo.StartTime = dateFormat(ContractStateModel.ContractInfo.StartTime, 'yyyy-MM-dd 00:00:00')
        ContractStateModel.ContractInfo.EndTime = dateFormat(ContractStateModel.ContractInfo.EndTime, 'yyyy-MM-dd 00:00:00')
        ContractStateModel.ContractInfo.PayStageStartTime = dateFormat(ContractStateModel.ContractInfo.PayStageStartTime, 'yyyy-MM-dd 00:00:00')
        ContractStateModel.ContractInfo.PayStageEndTime = dateFormat(ContractStateModel.ContractInfo.PayStageEndTime, 'yyyy-MM-dd 00:00:00')
        if (this.editType === 2) {
          ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(ContractStateModel.ContractInfo.EndTime), '']
          if (ContractStateModel.ContractInfo.IsPayStageMark) {
            ContractStateModel.ContractInfo.PayStageTimeMark = [dateFormat(ContractStateModel.ContractInfo.PayStageEndTime), '']
          }
        } else {
          // 暂存可能没有时间
          if (!ContractStateModel.ContractInfo.StartTime && !ContractStateModel.ContractInfo.EndTime) {
            ContractStateModel.ContractInfo.HostTimeMark = []
          } else {
            ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(ContractStateModel.ContractInfo.StartTime), dateFormat(ContractStateModel.ContractInfo.EndTime)]
          }
          if (ContractStateModel.ContractInfo.IsPayStageMark) {
            if (!ContractStateModel.ContractInfo.PayStageStartTime && !ContractStateModel.ContractInfo.PayStageEndTime) {
              ContractStateModel.ContractInfo.PayStageTimeMark = []
            } else {
              ContractStateModel.ContractInfo.PayStageTimeMark = [dateFormat(ContractStateModel.ContractInfo.PayStageStartTime), dateFormat(ContractStateModel.ContractInfo.PayStageEndTime)]
            }
          }
        }
        // 租金包含费用
        if (ContractStateModel.ContractInfo.RentIncludeCost) {
          ContractStateModel.RentIncludeCost = JSON.parse(ContractStateModel.ContractInfo.RentIncludeCost)
        }
      }
    }
    if (LivePeopleInfoList && LivePeopleInfoList.length > 0) {
      this.cloneData.LivePeopleInfoList = deepCopy(LivePeopleInfoList)
      // 排序将承租人放在第一个
      LivePeopleInfoList.sort((a, b) => b.IsTenant - a.IsTenant)
      ContractStateModel.LivePeopleInfoList = LivePeopleInfoList
    } else {
      this.handleLiveInAdd(1, ContractStateModel.ContractInfo)
    }
    if (OutRoominfoList && OutRoominfoList.length > 0) {
      ContractStateModel.OutRoomInfoList = OutRoominfoList
      this.cloneData.OutRoomInfoList = deepCopy(OutRoominfoList)
    }
    if (TenDecoration && TenDecoration.length > 0) {
      Decoration.forEach((item, index) => {
        item.PDecoration.forEach((cItem, cIndex) => {
          if (TenDecoration.find(x => x.DecorationID === cItem.KeyID)) {
            cItem.isChecked = true
            item.checkNum++
          } else {
            cItem.isChecked = false
          }
        })
      })
      ContractStateModel.Decoration = Decoration
    }
    if (TenantConTractQuipment && TenantConTractQuipment.length > 0) {
      const data = TenantConTractQuipment.map(x => {
        return {
          EquipmentName: x.QuipmentName,
          EquipmentNumber: x.Number
        }
      })
      ContractStateModel.TenantConTractQuipment = data
    }
    this.setState(ContractStateModel)
    if (TenantContractInfo) {
      this.saveBillForm()
    }
  }

  stepChange = (step) => {
    setTimeout(() => {
      this.setState({
        currentIndex: step - 1
      })
      this.changeBtnOptions()
      if (step === 2) {
        this.resetBillForm()
      }
    }, 0)
  }

  next = () => {
    switch (this.state.currentIndex) {
      case 0:
        const validationResults0 = GiftedFormManager.validate('EditTenantContractRuleForm0')
        const values0 = GiftedFormManager.getValues('EditTenantContractRuleForm0')
        console.log(values0)
        // this.refSteps.nextStep()
        if (validationResults0.isValid) {
          if (!this.validateForm0(values0)) return
          if (this.state.LivePeopleInfoList.some(v => {
            return !v.LiverName || !v.LiverPhone || !v.CardID
          })) {
            Toast.show('请填写完成入住人相关信息！', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return
          }
          if (this.state.LivePeopleInfoList.some(v => {
            return !validatePhoneNumber(v.LiverPhone)
          })) {
            Toast.show('入住人电话格式不正确！', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return
          }
          this.state.ContractInfo = {...this.state.ContractInfo, ...values0}
          this.refSteps.nextStep()
        } else {
          const errors = GiftedFormManager.getValidationErrors(validationResults0)
          Toast.show(errors[0], {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        }
        break
      case 1:
        const validationResults1 = GiftedFormManager.validate('EditTenantContractRuleForm1')
        const values1 = GiftedFormManager.getValues('EditTenantContractRuleForm1')
        console.log(values1)
        // this.refSteps.nextStep()
        if (validationResults1.isValid) {
          if (!this.validateForm1(values1)) return
          this.createBill(values1)
        } else {
          const errors1 = GiftedFormManager.getValidationErrors(validationResults1)
          Toast.show(errors1[0], {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        }
        break
      case 2:
        this.refBillPanel.validate().then(() => {
          this.refSteps.nextStep()
        })
    }
  }
  prev = () => {
    this.refSteps.prevStep()
  }

  calcPrice(val) {
    if (!val) {
      return
    }
    StateTenContract({
      HouseID: this.state.HouseInfo.KeyID,
      OuteRoom: val
    }).then(({BusCode}) => {
      if (BusCode === 1) {
        Toast.show(`该价格低于系统测算出房价格`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
      }
    })
  }

  agentChange(val) {
    this.setState({
      ContractInfo: {...this.state.ContractInfo, IsAgentMark: val}
    })
  }

  stageChange(val) {
    this.setState({
      ContractInfo: {...this.state.ContractInfo, IsPayStageMark: val}
    })
  }

  contractInfoChange(val, type) {
    this.setState({
      ContractInfo: {...this.state.ContractInfo, [type]: val}
    })
  }

  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    })
  }

  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 2
      },
      path: 'AgentEditTenantContract',
      returnKey: 'houseInfo'
    })
  }

  showSelectEmployeeFn() {
    showSelectAny({
      apiType: 3,
      path: 'AgentEditTenantContract',
      returnKey: 'employeeInfo'
    })
  }

  handleOutRoomDelete(i) {
    this.state.OutRoomInfoList.splice(i, 1)
    this.setState({
      OutRoomInfoList: this.state.OutRoomInfoList
    })
  }

  showContractEquipmentsFn() {
    this.props.navigation.navigate('AgentEditContractEquipments', {
      path: 'AgentEditTenantContract',
      data: this.state.TenantConTractQuipment
    })
  }

  showFitUpEquipmentsFn(item) {
    this.props.navigation.navigate('AgentEditFitUpEquipments', {
      path: 'AgentEditTenantContract',
      data: item.PDecoration,
      title: item.Name,
      KeyID: item.KeyID
    })
  }

  changeBtnOptions() {
    let btns = [
      {
        label: '上一步',
        value: 'Prev'
      },
      {
        label: '下一步',
        value: 'Next'
      }
    ]
    if (this.state.currentIndex === 0) {
      btns = [
        {
          label: '下一步',
          value: 'Next'
        }
      ]
    } else if (this.state.currentIndex === 3) {
      btns = [
        {
          label: '上一步',
          value: 'Prev'
        }
      ]
      if (this.state.ContractInfo.PaperType === 0) {
        btns.push({
          label: '现场签字',
          value: 'Save'
        })
      } else {
        btns.push({
          label: '保存',
          value: 'Save'
        })
      }
    }
    this.setState({
      btnOptions: btns
    })
  }

  selectHouse(item, model) {
    if (this.state.HouseInfo.KeyID && +this.state.HouseInfo.KeyID === +item.KeyID) return
    this.state.HouseInfo = item
    if (item.HouseID) {
      this.state.HouseInfo.KeyID = item.HouseID
    }
    if (model) {
      model.DepositModel = item.PledgeNumber
      model.PayModel = item.PayNumber
      model.HouseRent = item.RentMoeny
      model.HouseDeposit = item.Pledge
    } else {
      this.state.ContractInfo.DepositModel = item.PledgeNumber
      this.state.ContractInfo.PayModel = item.PayNumber
      this.state.ContractInfo.HouseRent = item.RentMoeny
      this.state.ContractInfo.HouseDeposit = item.Pledge
      this.setState({
        ContractInfo: this.state.ContractInfo
      })
    }
    this.setState({
      HouseInfo: this.state.HouseInfo
    }, () => {
      // 查询房源的合同状态
      this.searchHouseStatus()
      this.searchHouseConfig()
    })
  }

  searchHouseStatus() {
    return QueryHouseContractStatus({
      HouseID: this.state.HouseInfo.KeyID,
      TenantID: (this.editType === 2 ? '' : this.query.KeyID) || ''
    }).then(({Data}) => {
      if (Data) {
        let str = ''
        if (Data.StandBy > 0) {
          str += `该房源有${Data.StandBy}条暂存的合同\n`
        }
        if (Data.WaitTenant > 0) {
          str += `该房源有${Data.WaitTenant}条待租客确认的合同\n`
        }
        if (Data.Success > 0) {
          str += `该房源有${Data.Success}条正在生效的合同\n`
        }
        if (Data.ToAudit > 0) {
          str += `该房源有${Data.ToAudit}条待审核的合同\n`
        }
        if (Data.Reject > 0) {
          str += `该房源有${Data.Reject}条审核未通过的合同\n`
        }
        if (str) {
          str += `继续操作可能会导致重复录入`
          Alert.alert('温馨提示', str, [
            {
              text: '我知道了', onPress: () => {
              }
            }
          ], {cancelable: false})
        }
      }
    })
  }

  searchHouseConfig() {
    if (this.query.KeyID) return
    // 获取房屋设备信息
    return searchHouseConfig({
      HouseID: this.state.HouseInfo.KeyID
    }).then(({Data}) => {
      const list = []
      Data.forEach(x => {
        if (x.RoomName === this.state.HouseInfo.RoomName || x.RoomName === '公共') {
          x.Equipment.forEach(y => {
            list.push({
              EquipmentName: y.EquipmentName,
              EquipmentNumber: y.Number
            })
          })
        }
      })
      this.setState({
        TenantConTractQuipment: list
      })
    })
  }

  handleBack() {
    Alert.alert('温馨提示', '表单还未保存，确定要退出吗？', [
      {
        text: '取消', onPress: () => {
        }
      },
      {text: '确认', onPress: () => this.props.navigation.goBack()}
    ], {cancelable: false})
  }

  handleLiveInAdd(IsTenant = 0,item = {}) {
    this.state.LivePeopleInfoList.push({
      LiverName: item.TenantName || '',
      LiverPhone: item.TenantPhone || '',
      LiverSex: item.TenantSex || 0,
      CardType: 1, // 默认身份证1
      CardID: item.TenantCard || '',
      IsTenant
    })
    this.setState({
      LivePeopleInfoList: this.state.LivePeopleInfoList
    })
  }

  liveInInfoChange(val, i, type) {
    this.state.LivePeopleInfoList[i][type] = val
    this.setState({
      LivePeopleInfoList: this.state.LivePeopleInfoList
    })
  }

  changeLivePeople(val, type) {
    const model = this.state.LivePeopleInfoList
    if (model.find(v => v.IsTenant === 1)) {
      // 如果承租人没有被删除 排序后第一个为承租人 然后安排他
      model[0] = {
        ...model[0],
        [type]: val
      }
      this.setState({
        LivePeopleInfoList: model
      })
    }
  }

  handleLiveInDelete(i) {
    this.state.LivePeopleInfoList.splice(i, 1)
    this.setState({
      LivePeopleInfoList: this.state.LivePeopleInfoList
    })
  }

  showRentIncludeCostFn() {
    this.props.navigation.navigate('AgentEditRentIncludeCost', {
      path: 'AgentEditTenantContract',
      data: this.state.RentIncludeCost
    })
  }

  saveBillForm() {
    const keys = [
      'StartTime',
      'EndTime',
      'HouseRent',
      'HouseDeposit',
      'DepositModel',
      'PayModel',
      'PayTimeType',
      'PayDays',
      'IsPayStageMark',
      'TenantStageType',
      'PayStageStartTime',
      'PayStageEndTime',
      'IncreaseType',
      'IncreaseFrequency',
      'IncreaseNum',
      'IncreaseMoney'
    ]
    keys.map(v => {
      this.billForm[v] = this.state.ContractInfo[v]
    })
  }

  resetBillForm() {
    if (this.state.ContractInfo.TenantStageType === 0) {
      this.state.ContractInfo.TenantStageType = 1
    }
    if (this.state.ContractInfo.IncreaseFrequency === 0) {
      this.state.ContractInfo.IncreaseFrequency = 1
    }
    this.setState({
      ContractInfo: this.state.ContractInfo
    })
  }

  buildBillData(values) {
    if (!values) {
      // 第二步暂存
      values = GiftedFormManager.getValues('EditTenantContractRuleForm1')
    }
    this.state.ContractInfo = {...this.state.ContractInfo, ...values}
    // 组装数据
    const model = this.state.ContractInfo
    model.StartTime = dateFormat(model.HostTimeMark[0], 'yyyy-MM-dd 00:00:00')
    model.EndTime = dateFormat(model.HostTimeMark[1], 'yyyy-MM-dd 00:00:00')
    // 递增方式为不递增 不规则递增时 不能有 递增次数 递增年 递增值
    if (model.IncreaseType < 2) {
      model.IncreaseFrequency = 0
      model.IncreaseNum = ''
      model.IncreaseMoney = ''
    }
    if (model.IsPayStageMark) {
      model.PayStageStartTime = dateFormat(model.PayStageTimeMark[0], 'yyyy-MM-dd 00:00:00')
      model.PayStageEndTime = dateFormat(model.PayStageTimeMark[1], 'yyyy-MM-dd 00:00:00')
    } else {
      model.PayStageStartTime = '2001-01-01 00:00:00'
      model.PayStageEndTime = '2001-01-01 00:00:00'
      model.TenantStageType = 0
    }
    // 是否分期
    model.IsPayStage = model.IsPayStageMark ? 1 : 0
  }

  createBill(values) {
    this.buildBillData(values)
    if (!this.isLoadBookKeep) {
      this.refBillPanel.initBookData(this.BookKeep)
      this.isLoadBookKeep = true
    }
    if (Object.keys(this.billForm).length === 0 || this.BillList.length === 0) {
      // 新增、续签、没有账单的时候
      this.getBillList()
    } else if (isDiffObj(this.billForm, this.state.ContractInfo)) {
      // 修改的时候有变动
      Alert.alert('温馨提示', '系统检测到表单发生变动,确认后将重新生成账单', [
        {text: '取消', onPress: () => this.resetBillForm()},
        {text: '确认', onPress: () => this.getBillList()}
      ], {cancelable: false})
    } else {
      if (!this.isLoadBillList) {
        this.refBillPanel.initBillData(this.BillList)
        this.isLoadBillList = true
      }
      this.refSteps.nextStep()
    }
  }

  getBillList() {
    this.setState({
      billLoading: true
    })
    getTenantBill(this.state.ContractInfo).then(({Data, BusCode, Msg}) => {
      if (BusCode === 0) {
        this.BillList = Data
        this.refBillPanel.initBillData(Data)
        this.saveBillForm()
        this.refSteps.nextStep()
      } else {
        Toast.show(Msg || '参数错误', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
      }
    }).finally(() => {
      this.setState({
        billLoading: false
      })
    })
  }

  createOrder(type) {
    if (this.state.orderLoading) return
    // 电子合同的Save为现场签字
    if (this.state.ContractInfo.PaperType === 0 && type === 'Save') {
      type = 'SignUp'
    }
    if (type === 'SignUp') {
      if (this.state.ContractInfo.TenantCard.length !== 15 && this.state.ContractInfo.TenantCard.length !== 18) {
        Toast.show('租客身份证校验不通过，不能进行现场签字', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
    }
    // 点击前几步暂存时不需要走完流程，也不需要验证当页
    switch (this.state.currentIndex) {
      case 0:
        return
      case 1:
        this.buildBillData()
        if (isDiffObj(this.billForm, this.state.ContractInfo)) {
          // 修改的时候有变动
          Alert.alert('温馨提示', '系统检测到表单发生变动,暂存后将丢失第三步账单计划的数据', [
            {text: '取消', onPress: () => this.resetBillForm()},
            {
              text: '确认', onPress: () => {
                this.refBillPanel.initBillData([])
                this.asyncCreateOrder(type)
              }
            }
          ], {cancelable: false})
        } else {
          this.asyncCreateOrder(type)
        }
        break
      case 2:
        this.refBillPanel.validate().then(() => {
          this.asyncCreateOrder(type)
        })
        break
      case 3:
        // 获取第四步的信息
        const values3 = GiftedFormManager.getValues('EditTenantContractRuleForm3')
        if (!this.validateForm3(values3)) return
        this.state.ContractInfo = {...this.state.ContractInfo, ...values3}
        this.asyncCreateOrder(type)
    }
  }

  asyncCreateOrder(type) {
    // 合同模板
    this.state.ContractInfo.ContractTemplateUrl = this.state.ContractTemplate.find(v => v.ContractTemplateName === this.state.ContractInfo.ContractTemplateName).ContractTemplateUrl
    // 代办人信息
    this.state.ContractInfo.IsAgent = this.state.ContractInfo.IsAgentMark ? 1 : 0
    // 对比数据比较出ModifyStatus
    const LivePeopleInfoList = DiffArrFn(this.cloneData.LivePeopleInfoList, this.state.LivePeopleInfoList, [
      'LiverName',
      'LiverPhone',
      'LiverSex',
      'CardID',
      'EmergencyContactName',
      'EmergencyContactPhone'
    ])
    // 对比数据比较出ModifyStatus
    const ImageUpload = DiffArrFn(this.cloneData.ImageUpload, this.state.ImageUpload, [
      'ImageLocation'
    ])
    // 租金包含费用
    this.state.ContractInfo.RentIncludeCost = JSON.stringify(this.state.RentIncludeCost)
    // 出房人
    const OutRoominfoList = DiffArrFn(this.cloneData.OutRoomInfoList, this.state.OutRoomInfoList)
    let BookKeep = this.refBillPanel.getBookValue()
    BookKeep = DiffArrFn(this.cloneData.BookKeep, BookKeep)
    const TenantBill = this.refBillPanel.getBillValue()
    // 装修清单兼容
    const TenDecoration = []
    this.state.Decoration.map(x => {
      x.PDecoration.map(y => {
        if (y.isChecked) {
          TenDecoration.push({
            DecorationID: y.KeyID
          })
        }
      })
    })
    // 房屋设备清单兼容
    const TenantConTractQuipment = this.state.TenantConTractQuipment.map(x => {
      return {
        QuipmentName: x.EquipmentName,
        Number: x.EquipmentNumber
      }
    })
    // 强制修改 InputTerminal
    this.state.ContractInfo.InputTerminal = 0
    // 修改身份为大写
    this.state.ContractInfo.TenantCard = this.state.ContractInfo.TenantCard.toUpperCase()
    // 续约加字段
    if (this.editType === 2) {
      this.state.ContractInfo.RenewalID = this.query.KeyID
    }
    const param = {
      tenantContractModel: {
        TenantContractInfo: this.state.ContractInfo,
        HouseInfo: this.state.HouseInfo,
        TenantBill,
        HouseEquipment: [],
        LivePeopleInfoList,
        ImageUpload,
        BookKeep,
        OutRoominfoList,
        TenDecoration,
        TenantConTractQuipment
      },
      buttonType: type
    }
    let fn = insertTenantContract
    if (this.editType === 1) {
      fn = editTenantContract
    }
    this.setState({
      orderLoading: true
    })
    if (type === 'Preview') {
      // 手机端没有预览
    } else {
      fn(param).then(({Data}) => {
        this.setState({
          orderLoading: false
        }, () => {
          setTimeout(() => {
            const isRefresh = this.changeContractData(Data, type)
            if (type === 'Save') {
              Alert.alert('温馨提示', '保存合同成功', [
                {
                  text: '确认', onPress: () => {
                    this.props.navigation.navigate('AgentContractList', {
                      page: 0,
                      isRefresh
                    })
                  }
                }
              ], {cancelable: false})
            } else if (type === 'TemporaryStorage') {
              Alert.alert('温馨提示', '暂存合同成功', [
                {
                  text: '确认', onPress: () => {
                    this.props.navigation.navigate('AgentContractList', {
                      param: {
                        page: 0,
                        isRefresh
                      }
                    })
                  }
                }
              ], {cancelable: false})
            } else if (type === 'SignUp') {
              Alert.alert('温馨提示', '保存合同成功,前往现场签字页面', [
                {
                  text: '确认', onPress: () => {
                    this.props.navigation.replace('AgentContractSign', {
                      Mobile: this.state.ContractInfo.TenantPhone,
                      IDCard: this.state.ContractInfo.TenantCard,
                      Name: this.state.ContractInfo.TenantName,
                      ContractID: Data,
                      path: this.editType === 0 ? 'EditContract' : '',
                      type: 1
                    })
                  }
                }
              ], {cancelable: false})
            }
          }, 100)
        })
      }).catch(() => {
        this.setState({
          orderLoading: false
        })
      })
    }
  }

  changeContractData(id, type) {
    let isRefresh = false
    const sameParam = {
      HouseName: this.state.HouseInfo.HouseName,
      StartTime: this.state.ContractInfo.StartTime,
      EndTime: this.state.ContractInfo.EndTime,
      TenantName: this.state.ContractInfo.TenantName,
      TenantPhone: this.state.ContractInfo.TenantPhone
    }
    let changeParam = {}
    if (type === 'Save') {
      if (this.editType === 1) {
        changeParam = {
          AuditStatus: 1,
          RentLeaseStatus: 3
        }
      } else {
        isRefresh = true
      }
    } else if (type === 'TemporaryStorage') {
      if (this.editType === 1) {
        changeParam = {
          AuditStatus: 0,
          RentLeaseStatus: 1
        }
      } else {
        isRefresh = true
      }
    } else if (type === 'SignUp') {
      if (this.editType === 1) {
        changeParam = {
          AuditStatus: 0,
          RentLeaseStatus: 2
        }
      } else {
        isRefresh = true
      }
    }
    if (this.editType === 1) {
      // 修改列表
      store.dispatch(
          updateList({
            KeyID: id,
            key: 'tenantContractList',
            data: {
              ...changeParam,
              ...sameParam
            }
          })
      )
      //修改详情
      store.dispatch(
          updateContractDetail({
            key: 'TenantContractOperate',
            data: changeParam
          })
      )
      store.dispatch(
          updateContractDetail({
            key: 'TenantContractInfo',
            data: this.state.ContractInfo
          })
      )
    }
    return isRefresh
  }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(TenantContract)
