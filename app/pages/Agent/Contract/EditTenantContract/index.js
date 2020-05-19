import React, {Component} from 'react'
import {Alert, Button, Linking, Platform, Text, TouchableOpacity, View,Image} from 'react-native'
import styles from '../EditOwnerContract/style'
import {BillPanel} from '../EditOwnerContract/components'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {connect} from 'react-redux'
import {ButtonGroup, FullModal, Header, StepsBox, UploadFile, UploadFileSingle} from "../../../../components";
import {
  AppGetContractTenantDetail,
  editTenantContract,
  getTenantBill,
  insertTenantContract,
  QueryHouseContractStatus
} from "../../../../api/tenant";
import {StateTenContract} from "../../../../api/system";
import {searchHouseConfig, QueryOrderByHouseID} from "../../../../api/house";
import {deepCopy, DiffArrFn, isDiffObj} from "../../../../utils/arrUtil";
import {dateFormat} from "../../../../utils/dateFormat";
import Toast from 'react-native-root-toast';
import IconFont from "../../../../utils/IconFont";
import store from "../../../../redux/store/store";
import {updateContractDetail} from "../../../../redux/actions/contract";
import {updateList} from "../../../../redux/actions/list";
import {validateNumber, validatePhoneNumber, validateCard, validateEmailNumber} from "../../../../utils/validate";
import {showSelectAny} from "../../../../components/SelectAny/util";
import NationData from './nation.json'

class TenantContract extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
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
      Relationship: [],
      DepositModel: [],
      PayModel: [],
      RentIncludeCost: [],
      PayTimeType: [],
      PaperType: [],
      MaxLiverCount: []
    } //枚举类型
    this.EnumProps = {
      value: 'Value',
      label: 'Description'
    }
    this.query = this.props.navigation.state.params || {} // 路由参数 KeyID,Renew
    this.editType = this.query.Renew ? 2 : (this.query.KeyID ? 1 : 0) // 0新增 1修改 2续约
    this.headerTitle = ['新增租客合同', '修改租客合同', '续约租客合同'][this.editType]
    this.isLoadBillList = false
    this.cloneData = {
      ImageUpload: [],
      OutRoomInfoList: [],
      LivePeopleInfoList: [],
      PassengerChannel: [],
      EducationLevels: [],
      Nation: [],
      MarryStatus: [],
      TenantBill: [],
      CardIDFront: [],
      CardIDBack: [],
      AgentCardIDFront: [],
      AgentCardIDBack: [],
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
        HouseNumberMark: '',
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
        AgentAddress: '',
        TenantContractRemark: '',
        DiscountPolicy: '',
        HostTimeMark: [],
        DepositModel: 1,
        PayModel: 3,
        HouseRent: '',
        HouseDeposit: '',
        ManagerFee: 0,
        EntranceID: 0,
        IsPayStageMark: false,
        IsSubstituteMark: false,
        PayDays: 30,
        PayTimeType: 0,
        MaxLiverCount: 1,
        PassengerChannel: 0,
        EducationLevels: 0,
        Profession: '',
        PermanentAddress: '',
        MarryStatus: 0,
        Nation: '',
        WaterBaseNumber: '',
        PropertyManageFee: '',
        ElectricityBaseNumber: '',
        GasBaseNumber: '',
        CardIDFront: [],
        CardIDBack: [],
        AgentCardIDFront: [],
        AgentCardIDBack: [],
        Email: '',
        WeChatNumber: '',
        DisputeSettlement: 0
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
      EntranceIDList: [
        {
          label: '请选择',
          value: 0
        }
      ], //预订单编号
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
    const Relationship = this.props.enumList.EnumRelationship.slice()
    Relationship.unshift({
      Description: '请选择',
      Value: 0
    })
    this.EnumData.Relationship = Relationship
    const PassengerChannel = this.props.enumList.EnumPassengerChannel.slice()
    PassengerChannel[0].Description = '无'
    this.EnumData.PassengerChannel = PassengerChannel
    const EducationLevels = this.props.enumList.EnumEducationLevels.slice()
    EducationLevels.unshift({
      Description: '请选择',
      Value: 0
    })
    this.EnumData.EducationLevels = EducationLevels
    const MarryStatus = this.props.enumList.EnumMarryStatus.slice()
    MarryStatus.unshift({
      Description: '请选择',
      Value: 0
    })
    this.EnumData.MarryStatus = MarryStatus
    this.EnumData.Nation = NationData
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
    // this.EnumData.PayModel = new Array(12).fill('').map((x, i) => {
    //   return {
    //     label: i + 1 + '',
    //     value: i + 1
    //   }
    // })
    this.EnumData.PayModel = [
      {
        label: '月付',
        value: 1
      },
      {
        label: '季付',
        value: 3
      },
      {
        label: '半年付',
        value: 6
      },
      {
        label: '年付',
        value: 12
      }
    ]
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
        label: '固为上一个月的几号',
        value: 2
      },
      {
        label: '固定为下一个月的几号',
        value: 3
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
    if (form.PaperType === 0 && !validateCard(form.TenantCard)) {
      Toast.show('承租人身份证格式不正确', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateEmailNumber(form.Email)) {
      Toast.show('承租人电子邮箱格式不正确', {
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
    if (!validateCard(form.AgentCard)) {
      Toast.show('代办人身份证格式不正确', {
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
      Toast.show(`押金` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.ManagerFee, options1)) {
      Toast.show(`管理服务费` + msg1, {
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
    if (form.EntranceID) {
      const item = this.state.EntranceIDList.find(x => x.value === form.EntranceID)
      if (!item) {
        Toast.show(`预定单编号已被使用,请重新选择或清空！`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return false
      }
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
    if (!validateNumber(form.PropertyManageFee, options1)) {
      Toast.show(`物管费` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    debugger
    if (form.DisputeSettlement === 0) {
      Toast.show(`争议处理方式不能为空`, {
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
          {this.editType === 1 && 
            <GiftedForm.TextInputWidget
                name='HouseNumberMark'
                title='系统编号'
                disabled
                maxLength={50}
                value={ContractInfo.HouseNumberMark + ''}
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
          <GiftedForm.NoticeWidget widgetStyles={{noticeRow: {backgroundColor: '#fff',paddingTop:5,paddingBottom:0},noticeTitle:{color:'#333',fontSize:15}}} required={this.state.ContractInfo.PaperType === 0} title={`添加承租人身份证`}/>
          <UploadFile list={this.state.ContractInfo.CardIDFront} single={true} btnText='头像面'
              onChange={(data) => {this.onUploadFileChange(data,1)}}>
                <UploadFileSingle list={this.state.ContractInfo.CardIDBack} single={true} btnText='国徽面'
              onChange={(data) => {this.onUploadFileChange(data,2)}}/>
          </UploadFile>
          <GiftedForm.TextInputWidget
              name='TenantName'
              title='承租人姓名'
              maxLength={14}
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
          <GiftedForm.PickerWidget
              name='EducationLevels'
              title='文化程度'
              required={false}
              data={this.EnumData.EducationLevels}
              value={ContractInfo.EducationLevels}
              mapKey={this.EnumProps}
          />
          <GiftedForm.PickerWidget
              name='Nation'
              title='民族'
              required={false}
              data={this.EnumData.Nation}
              value={ContractInfo.Nation}
          />
          <GiftedForm.TextInputWidget
              name='Email'
              title='承租人电子邮箱'
              required={false}
              maxLength={30}
              value={ContractInfo.Email + ''}
          />
          <GiftedForm.TextInputWidget
              name='WeChatNumber'
              title='微信号'
              required={false}
              maxLength={30}
              value={ContractInfo.WeChatNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='Profession'
              title='职业'
              required={false}
              maxLength={30}
              value={ContractInfo.Profession + ''}
          />
          <GiftedForm.PickerWidget
              name='MarryStatus'
              title='婚姻状况'
              required={false}
              data={this.EnumData.MarryStatus}
              value={ContractInfo.MarryStatus}
              mapKey={this.EnumProps}
          />
          <GiftedForm.TextInputWidget
              inline={false}
              name='PermanentAddress'
              title='户籍地址'
              required={false}
              placeholder='请输入户籍地址'
              maxLength={50}
              numberOfLines={2}
              value={ContractInfo.PermanentAddress + ''}
          />
          <GiftedForm.TextInputWidget
              name='EmergencyContactName'
              title='紧急联系人姓名'
              required={false}
              maxLength={14}
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
          <GiftedForm.NoticeWidget widgetStyles={{noticeRow: {backgroundColor: '#fff',paddingTop:5,paddingBottom:0},noticeTitle:{color:'#333',fontSize:15}}} required={this.state.ContractInfo.PaperType === 0} title={`添加代办人身份证`}/>
          }
          {ContractInfo.IsAgentMark &&
          <UploadFile list={this.state.ContractInfo.AgentCardIDFront} single={true} btnText='头像面'
              onChange={(data) => {this.onUploadFileChange(data,3)}}>
                <UploadFileSingle list={this.state.ContractInfo.AgentCardIDBack} single={true} btnText='国徽面'
              onChange={(data) => {this.onUploadFileChange(data,4)}}/>
          </UploadFile>
          }
          {ContractInfo.IsAgentMark &&
          <GiftedForm.TextInputWidget
              name='AgentName'
              title='代办人姓名'
              maxLength={14}
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
          {ContractInfo.IsAgentMark && 
            <GiftedForm.TextInputWidget
              inline={false}
              name='AgentAddress'
              title='代办人通讯地址'
              required={false}
              placeholder='请输入代办人通讯地址'
              maxLength={50}
              numberOfLines={2}
              value={ContractInfo.AgentAddress + ''}
          />
          }
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
                      maxLength={14}
                      onChangeText={(val) => {
                        this.liveInInfoChange(val, index, 'LiverName')
                      }}
                      value={item.LiverName + ''}
                  />
                  <GiftedForm.TextInputWidget
                      name={`LiverPhone${index}`}
                      title='入住人电话'
                      maxLength={11}
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
                  {index>0 && <GiftedForm.PickerWidget
                      name={`Relationship${index}`}
                      title='入住人关系'
                      required={false}
                      data={this.EnumData.Relationship}
                      value={item.Relationship}
                      mapKey={this.EnumProps}
                      onPickerConfirm={(val) => {
                        this.liveInInfoChange(val, index, 'Relationship')
                      }}
                  />}
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
          <GiftedForm.NoticeWidget title={`其他附件`}/>
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
          <GiftedForm.NoticeWidget title={`租约信息`} rightView={
            <View style={styles.fast_change_time_box}>
              <TouchableOpacity style={styles.fast_change_time_box_item} onPress={() => this.fastChangeTime(1)}>
                <Text style={styles.owner_header_right_text}>半年</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fast_change_time_box_item} onPress={() => this.fastChangeTime(2)}>
                <Text style={styles.owner_header_right_text}>一年</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fast_change_time_box_item} onPress={() => this.fastChangeTime(4)}>
                <Text style={styles.owner_header_right_text}>两年</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fast_change_time_box_item} onPress={() => this.fastChangeTime(6)}>
                <Text style={styles.owner_header_right_text}>三年</Text>
              </TouchableOpacity>
            </View>
          }/>
          <GiftedForm.DatePickerRangeWidget
              name='HostTimeMark'
              cannotEqual
              title='租期时间'
              onChangeText={(val) => {
                this.HostTimeMarkChange(val)
              }}
              value={ContractInfo.HostTimeMark}
          />
          {/* <GiftedForm.PickerWidget
              name='DepositModel'
              title='押'
              data={this.EnumData.DepositModel}
              value={ContractInfo.DepositModel}
          /> */}
          <GiftedForm.PickerWidget
              name='PayModel'
              title='付款方式'
              onPickerConfirm={(val) => {
                this.PayModelChange(val)
              }}
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
              title='押金'
              maxLength={6}
              keyboardType={this.numberPad}
              value={ContractInfo.HouseDeposit + ''}
              tail={`元`}
          />
          <GiftedForm.TextInputWidget
              name='ManagerFee'
              title='管理服务费'
              maxLength={6}
              keyboardType={this.numberPad}
              value={ContractInfo.ManagerFee + ''}
              tail={`元/月`}
          />
          <GiftedForm.PickerWidget
              name='EntranceID'
              title='定金收据编号'
              required={false}
              data={this.state.EntranceIDList}
              value={ContractInfo.EntranceID}
          />
          <GiftedForm.SwitchWidget
              name='IsPayStageMark'
              title='是否分期'
              required={false}
              onSwitchChange={(val) => this.stageChange(val)}
              value={ContractInfo.IsPayStageMark}
          />
          <GiftedForm.SwitchWidget
              name='IsSubstituteMark'
              title='是否代缴水电气'
              onSwitchChange={(val) => this.substituteChange(val)}
              value={ContractInfo.IsSubstituteMark}
          />
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
              title={this.EnumData.PayTimeType[ContractInfo.PayTimeType].label}
              maxLength={2}
              keyboardType={this.numberPad}
              value={ContractInfo.PayDays + ''}
              tail={ContractInfo.PayTimeType == 0 ? '天' : '号'}
          />
          {/*<GiftedForm.NoticeWidget title={`租金包含费用`}/>*/}
          {/*<GiftedForm.LabelWidget*/}
              {/*title='租金包含费用'*/}
              {/*required={false}*/}
              {/*value={this.state.RentIncludeCost.length === 0 ? '请选择' : `已选择${this.state.RentIncludeCost.length}个`}*/}
              {/*onLabelPress={() => {*/}
                {/*this.showRentIncludeCostFn()*/}
              {/*}}*/}
          {/*/>*/}
          <GiftedForm.NoticeWidget title={`优惠政策`}/>
          <GiftedForm.TextAreaWidget
              name='DiscountPolicy'
              required={false}
              placeholder='请输入优惠政策'
              maxLength={1500}
              value={ContractInfo.DiscountPolicy}
          />
        </GiftedForm>
    )
  }

  getStep3View() {
    return (
        <BillPanel type={1} navigation={this.props.navigation} contract={this.state.ContractInfo} houseInfo={this.state.HouseInfo} ref={(refSteps) => {
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
          <View style={styles.step_notice}> 
           <Image
                source={require('./images/notice.png')}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 5
                }}
            />
            <Text style={styles.step_notice_text}>如有附加条款，请在页面最下方输入栏中输入</Text>
          </View>
          <GiftedForm.NoticeWidget title={`交割信息`}/>
          <GiftedForm.TextInputWidget
              name='WaterBaseNumber'
              title='水表底数'
              maxLength={7}
              keyboardType={this.numberPad}
              value={ContractInfo.WaterBaseNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='ElectricityBaseNumber'
              title='电表底数'
              maxLength={7}
              keyboardType={this.numberPad}
              value={ContractInfo.ElectricityBaseNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='GasBaseNumber'
              title='气表底数'
              maxLength={7}
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
          <GiftedForm.NoticeWidget title={`其他费用`}/>
          <GiftedForm.TextInputWidget
              name='PropertyManageFee'
              title='物管费'
              maxLength={7}
              required={false}
              keyboardType={this.numberPad}
              value={ContractInfo.PropertyManageFee + ''}
              tail={`元/月`}
          />
          <GiftedForm.NoticeWidget required title={`争议处理方式`}/>
          <GiftedForm.RadioWidget
              name='DisputeSettlement'
              options={
                [
                  {
                    label: '提交仲裁委员会仲裁',
                    value: 1
                  },
                  {
                    label: '依法向房屋所在地人民法院提起诉讼。一方产生的诉讼费、律师费、保全费、执行费等维权费用由违约方承担',
                    value: 2
                  }
                ]
              }
              required={false}
              value={ContractInfo.DisputeSettlement}
          />
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
      if (TenantContractInfo) {
        TenantContractInfo.PaperType = 0
      }
    }
    if (TenantContractOperate) {
      ContractStateModel.TenantContractOperate = TenantContractOperate
    }
    if (HouseInfo) {
      this.selectHouse(HouseInfo, ContractStateModel.ContractInfo,1)
    }
    if (ImageUpload) {
      ContractStateModel.ImageUpload = ImageUpload
      if (this.editType !== 2) {
        this.cloneData.ImageUpload = deepCopy(ImageUpload)
      }
    }
    if (BookKeep && BookKeep.length > 0) {
      this.BookKeep = BookKeep
    }
    if (TenantBill && TenantBill.length > 0) {
      this.BillList = TenantBill
      this.cloneData.TenantBill = deepCopy(TenantBill)
      // this.refBillPanel.initBillData(TenantBill)
    }
    if (TenantContractInfo) {
      if (!TenantContractInfo.KeyID) {
        // 预定签合同 和房源签合同
        const StartTime = dateFormat(TenantContractInfo.StartTime, 'yyyy-MM-dd 00:00:00')
        const EndTime = dateFormat(TenantContractInfo.EndTime, 'yyyy-MM-dd 00:00:00')
        ContractStateModel.ContractInfo = {
          ...ContractStateModel.ContractInfo,
          TenantName: TenantContractInfo.TenantName || "",
          TenantPhone: TenantContractInfo.TenantPhone || "",
          TenantCard: TenantContractInfo.TenantCard || "",
          HouseRent: TenantContractInfo.HouseRent || 0,
          HouseDeposit: TenantContractInfo.HouseDeposit || 0,
          EntranceType: TenantContractInfo.EntranceType || 0,
          EntranceID: TenantContractInfo.EntranceID || 0,
          OrderMoneyNumber: TenantContractInfo.OrderMoneyNumber || '',
          PayModel: TenantContractInfo.PayModel || 3,
          OrderMoney: TenantContractInfo.OrderMoney || 0
        }
        debugger
        if (ContractStateModel.ContractInfo.EntranceType === 1) {
          this.setState({
            EntranceIDList: [
              {
                label: '请选择',
                value: 0
              },
              {
                label: ContractStateModel.ContractInfo.OrderMoneyNumber,
                value: ContractStateModel.ContractInfo.EntranceID,
                price: ContractStateModel.ContractInfo.OrderMoney
              }
            ]
          })
        }
        if (StartTime) {
          ContractStateModel.ContractInfo.StartTime = StartTime
          ContractStateModel.ContractInfo.EndTime = EndTime
          ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(StartTime), dateFormat(EndTime)]
        }
      } else {
        if (TenantContractInfo.CardIDFront && TenantContractInfo.CardIDFront.length > 0) {
          this.cloneData.CardIDFront = deepCopy(TenantContractInfo.CardIDFront)
        }
        if (TenantContractInfo.CardIDBack && TenantContractInfo.CardIDBack.length > 0) {
          this.cloneData.CardIDBack = deepCopy(TenantContractInfo.CardIDBack)
        }
        if (TenantContractInfo.AgentCardIDFront && TenantContractInfo.AgentCardIDFront.length > 0) {
          this.cloneData.AgentCardIDFront = deepCopy(TenantContractInfo.AgentCardIDFront)
        }
        if (TenantContractInfo.AgentCardIDBack && TenantContractInfo.AgentCardIDBack.length > 0) {
          this.cloneData.AgentCardIDBack = deepCopy(TenantContractInfo.AgentCardIDBack)
        }
        ContractStateModel.ContractInfo = {
          ...this.state.ContractInfo, ...TenantContractInfo
        }
        // 合同编号重置
        if (this.editType === 2) {
          ContractStateModel.ContractInfo.ContractNumber = ''
          ContractStateModel.ContractInfo.HouseNumberMark = ''
          ContractStateModel.ContractInfo.OrderMoneyNumber = ''
          ContractStateModel.ContractInfo.EntranceID = 0
        }
        if (!ContractStateModel.PayDays) {
          ContractStateModel.PayDays = 30
        }
        // 代理人信息
        ContractStateModel.ContractInfo.IsAgentMark = ContractStateModel.ContractInfo.IsAgent === 1
        // 是否分期
        ContractStateModel.ContractInfo.IsPayStageMark = ContractStateModel.ContractInfo.IsPayStage === 1
        // 是否代缴水电费
        ContractStateModel.ContractInfo.IsSubstituteMark = ContractStateModel.ContractInfo.IsSubstitute === 1
        // 托管时间和分期时间
        ContractStateModel.ContractInfo.StartTime = dateFormat(ContractStateModel.ContractInfo.StartTime, 'yyyy-MM-dd 00:00:00')
        ContractStateModel.ContractInfo.EndTime = dateFormat(ContractStateModel.ContractInfo.EndTime, 'yyyy-MM-dd 00:00:00')
        if (this.editType === 2) {
          ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(ContractStateModel.ContractInfo.EndTime), '']
        } else {
          // 暂存可能没有时间
          if (!ContractStateModel.ContractInfo.StartTime && !ContractStateModel.ContractInfo.EndTime) {
            ContractStateModel.ContractInfo.HostTimeMark = []
          } else {
            ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(ContractStateModel.ContractInfo.StartTime), dateFormat(ContractStateModel.ContractInfo.EndTime)]
          }
        }
        // 租金包含费用
        if (ContractStateModel.ContractInfo.RentIncludeCost) {
          ContractStateModel.RentIncludeCost = JSON.parse(ContractStateModel.ContractInfo.RentIncludeCost)
        }
      }
    }
    if (LivePeopleInfoList && LivePeopleInfoList.length > 0) {
      if (this.editType !== 2) {
        this.cloneData.LivePeopleInfoList = deepCopy(LivePeopleInfoList)
      }
      // 排序将承租人放在第一个
      LivePeopleInfoList.sort((a, b) => b.IsTenant - a.IsTenant)
      ContractStateModel.LivePeopleInfoList = LivePeopleInfoList
    } else {
      this.handleLiveInAdd(1, ContractStateModel.ContractInfo)
    }
    if (OutRoominfoList && OutRoominfoList.length > 0) {
      ContractStateModel.OutRoomInfoList = OutRoominfoList
      if (this.editType !== 2) {
        this.cloneData.OutRoomInfoList = deepCopy(OutRoominfoList)
      }
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
      if (step === 3) {
        let str = ''
        if (this.state.ContractInfo.EntranceID>0 || this.editType === 2) {
          str += `该合同为【${this.editType === 2 ? '续约' : '预定'}】合同\n`
          str += `您可能需要在第一期中添加一个明细\n`
          str += `【支出-租客-${this.editType === 2 ? '续约转押金' : '定金转租金'}】`
          Alert.alert('温馨提示', str, [
            {
              text: '我知道了', onPress: () => {
              }
            }
          ], {cancelable: false})
        }
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
          this.state.ContractInfo = {...this.state.ContractInfo, ...values0}
          try {
            this.state.LivePeopleInfoList.forEach((v,i)=>{
              if (!v.LiverName) {
                throw new Error(`请填写入住人${i + 1}姓名！`)
              }
              if (!validatePhoneNumber(v.LiverPhone)) {
                throw new Error(`入住人${i + 1}电话号码格式不正确！`)
              }
              if (this.state.ContractInfo.PaperType === 0 && !validateCard(v.CardID)) {
                throw new Error(`入住人${i + 1}身份证格式不正确！`)
              }
            })
            if (this.state.ContractInfo.PaperType === 0 && this.state.ContractInfo.CardIDFront.length === 0) {
              throw new Error('请上传租客身份证头像面！')
            }
            if (this.state.ContractInfo.PaperType === 0 && this.state.ContractInfo.CardIDBack.length === 0) {
              throw new Error('请上传租客身份证国徽面！')
            }
            if (this.state.ContractInfo.IsAgentMark && this.state.ContractInfo.PaperType === 0 && this.state.ContractInfo.AgentCardIDFront.length === 0) {
              throw new Error('请上传代办人身份证头像面！')
            }
            if (this.state.ContractInfo.IsAgentMark && this.state.ContractInfo.PaperType === 0 && this.state.ContractInfo.AgentCardIDBack.length === 0) {
              throw new Error('请上传代办人身份证国徽面！')
            }
          }catch (e) {
            Toast.show(e.message, {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return
          }
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
          const text = this.refBillPanel.validateHoliday()
          if(text) {
            Alert.alert('温馨提示', text, [
              {
                text: '返回修改'
              },
              {
                text: '下一步', onPress: () => {
                  this.refSteps.nextStep()
                }
              }
            ])
          }else {
            this.refSteps.nextStep()
          }
        })
    }
  }
  prev = () => {
    this.refSteps.prevStep()
  }

  fastChangeTime(num) {
    const form1 = GiftedFormManager.getValues('EditTenantContractRuleForm1')
    form1.HostTimeMark = form1.HostTimeMark || []
    let start = form1.HostTimeMark[0]
    let startTime = 0, arr = form1.HostTimeMark.slice()
    if (start) {
      startTime = new Date(start)
    } else {
      startTime = new Date()
      arr[0] = dateFormat(startTime)
    }
    startTime.addMonths(num * 6)
    startTime.setDate(startTime.getDate() - 1)
    arr[1] = dateFormat(startTime)
    this.state.ContractInfo.HostTimeMark = arr
    // this.calcDiscountPolicy(this.state.ContractInfo.HostTimeMark, this.state.ContractInfo.PayModel, this.state.ContractInfo.HouseRent)
    this.setState({
      ContractInfo: this.state.ContractInfo
    })
    let msg = ''
    if (num === 1) {
      msg = '半'
    } else {
      msg = num / 2
    }
    Toast.show(`已切换租期时间为${msg}年`, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM
    })
  }

  calcPrice(val) {
    if (!val) {
      return
    }
    // this.state.ContractInfo.HouseRent = val
    // this.calcDiscountPolicy(this.state.ContractInfo.HostTimeMark, this.state.ContractInfo.PayModel, this.state.ContractInfo.HouseRent,1)
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
  
  substituteChange(val) {
    this.setState({
      ContractInfo: {...this.state.ContractInfo, IsSubstituteMark: val}
    })
  }

  contractInfoChange(val, type) {
    this.setState({
      ContractInfo: {...this.state.ContractInfo, [type]: val}
    })
  }

  HostTimeMarkChange(val) {
    // debugger
    // this.state.ContractInfo.HostTimeMark = val
    // this.calcDiscountPolicy(this.state.ContractInfo.HostTimeMark, this.state.ContractInfo.PayModel, this.state.ContractInfo.HouseRent)
  }

  PayModelChange(val) {
    // debugger
    // this.state.ContractInfo.PayModel = val
    // this.calcDiscountPolicy(this.state.ContractInfo.HostTimeMark, this.state.ContractInfo.PayModel, this.state.ContractInfo.HouseRent)
  }

  hasDiscountPolicy(timeArr, PayModel, HouseRent) {
    if (timeArr[0] && timeArr[1]) {
      // 租期大于等于1年
      const flag = this.moreThan12Month(timeArr)
      if (flag) {
        // 半年付和年付
        if (PayModel === 6 || PayModel === 12) {
          if (HouseRent > 0) {
            return true
          }
        }
      }
    }
    return false
  }

  calcDiscountPolicy(timeArr, PayModel, HouseRent, type=0) {
    // debugger
    // if (type === 1) {
    //   this.calcDiscountPolicyFn(timeArr, PayModel, HouseRent)
    // } else {
    //   setTimeout(()=>{
    //     this.calcDiscountPolicyFn(timeArr, PayModel, HouseRent)
    //   },500)
    // }
  }

  calcDiscountPolicyFn(timeArr, PayModel, HouseRent) {
    if (this.hasDiscountPolicy(timeArr, PayModel, HouseRent)) {
      let DiscountPolicy = ''
      if (PayModel === 6) {
        DiscountPolicy = `因客户${PayModel}个月付款，优惠金额${HouseRent / 2}元，如客户中途违约，优惠金额${HouseRent / 2}元取消。`
      } else {
        DiscountPolicy = `因客户${PayModel}个月付款，优惠金额${HouseRent}元，如客户中途违约，优惠金额${HouseRent}元取消。`
      }
      this.state.ContractInfo.DiscountPolicy = DiscountPolicy
      Alert.alert('温馨提示', '系统检测到该条件下符合优惠政策，已自动为您添加优惠政策', [
        {text: '确认', onPress: () => {
          this.setState({
            ContractInfo: { ...this.state.ContractInfo}
          })
        }}
      ], {cancelable: false})
    }
  }

  moreThan12Month(timeArr) {
    const time1 = new Date(timeArr[0])
    const time2 = new Date(timeArr[1])
    time2.setDate(time2.getDate() + 1)
    time1.setMonth(time1.getMonth() + 12)
    if (dateFormat(time1, 'yyyy-MM-dd') <= dateFormat(time2, 'yyyy-MM-dd')) {
      return true
    } else {
      return false
    }
  }

  onUploadFileChange(data,type = 0) {
    switch (type) {
      case 0:
        this.setState({
          ImageUpload: data
        })
        break
      case 1:
        this.setState({
          ContractInfo: {...this.state.ContractInfo,CardIDFront: data}
        })
        break
      case 2:
        this.setState({
          ContractInfo: {...this.state.ContractInfo,CardIDBack: data}
        })
        break
      case 3:
        this.setState({
          ContractInfo: {...this.state.ContractInfo,AgentCardIDFront: data}
        })
        break
      case 4:
        this.setState({
          ContractInfo: {...this.state.ContractInfo,AgentCardIDBack: data}
        })
        break
    }
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

  selectHouse(item, model,type = 0) {
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
      this.searchHouseOrder(type)
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

  searchHouseOrder(type) {
    if (this.query.OrderID) return
    return QueryOrderByHouseID({
      HouseID: this.state.HouseInfo.KeyID
    }).then(({ Data }) => {
      const EntranceIDList = Data.map(x => {
        return {
          label: x.OrderMoneyNumber,
          value: x.KeyID,
          price: x.OrderMoney
        }
      })
      EntranceIDList.unshift({
        label: '请选择',
        value: 0
      })
      this.setState({
        EntranceIDList
      })
      if (type !== 1) {
        this.setState({
          ContractInfo: {...this.state.ContractInfo,EntranceID: 0}
        })
      }
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

  handleLiveInAdd(IsTenant = 0, item = {}) {
    this.state.LivePeopleInfoList.push({
      LiverName: item.TenantName || '',
      LiverPhone: item.TenantPhone || '',
      LiverSex: item.TenantSex || 0,
      CardType: 1, // 默认身份证1
      CardID: item.TenantCard || '',
      Relationship: 0,
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
      'ManagerFee',
      'PayTimeType',
      'EntranceID',
      'DiscountPolicy',
      'PayDays'
    ]
    keys.map(v => {
      this.billForm[v] = this.state.ContractInfo[v]
    })
  }

  resetBillForm() {
    // nothing
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
    // 是否分期
    model.IsPayStage = model.IsPayStageMark ? 1 : 0
    // 是否分期
    model.IsSubstitute = model.IsSubstituteMark ? 1 : 0
    // 预订单编号 绑定
    debugger
    if (model.EntranceID) {
      model.EntranceType = 1
      const EntranceIDListItem = this.state.EntranceIDList.find(x => x.value === model.EntranceID)
      model.OrderMoneyNumber = EntranceIDListItem.label
      model.OrderMoney = EntranceIDListItem.price
    } else {
      model.EntranceType = 0
      model.OrderMoneyNumber = ''
      model.OrderMoney = 0
    }
  }

  createBill(values) {
    this.buildBillData(values)
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
      this.setState({
        billLoading: false
      },()=>{
        setTimeout(()=>{
          if (BusCode === 0) {
            this.filterBillData(Data)
            this.BillList = Data
            this.refBillPanel.initBillData(Data, this.cloneData.TenantBill)
            this.saveBillForm()
            this.refSteps.nextStep()
          } else {
            Toast.show(Msg || '参数错误', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
          }
        },100)
      })
    }).catch(() => {
      this.setState({
        billLoading: false
      })
    })
  }

  filterBillData(Data) {
    const obj = {
      BillProjectID: 0,
      BillProjectName: '',
      InOrOut: 2,
      Amount: '',
      showWhenZero: true,
      IsActual: 0,
      CanOperate: 1
    }
    if (this.state.ContractInfo.EntranceID>0) {
      const cloneObj = { ...obj }
      cloneObj.Amount = this.state.ContractInfo.OrderMoney
      cloneObj.CanOperate = 0
      cloneObj.BillProjectID = 57
      cloneObj.BillProjectName = '定金转租金'
      // 判断之前是否已经有这个项目
      if (Data[0].TenantBillDetail.findIndex(x => x.BillProjectID === 57) === -1) {
        Data[0].TenantBillDetail.push(cloneObj)
      }
    }
    // if (this.hasDiscountPolicy(this.state.ContractInfo.HostTimeMark, this.state.ContractInfo.PayModel, this.state.ContractInfo.HouseRent)) {
    //   const Amount = this.state.ContractInfo.PayModel === 6 ? (this.state.ContractInfo.HouseRent / 2) : this.state.ContractInfo.HouseRent
    //   if (this.state.ContractInfo.DiscountPolicy.indexOf(`优惠金额${Amount}`) > 0) {
    //     const cloneObj = { ...obj }
    //     cloneObj.Amount = Amount
    //     cloneObj.CanOperate = 0
    //     cloneObj.BillProjectID = 88
    //     cloneObj.BillProjectName = '租金优惠'
    //     if (Data[0].TenantBillDetail.findIndex(x => x.BillProjectID === 88) === -1) {
    //       Data[0].TenantBillDetail.push(cloneObj)
    //     }
    //   }
    // }
    if (this.editType === 2) {
      obj.BillProjectID = 58
      obj.BillProjectName = '续约转押金'
      Data[0].TenantBillDetail.push(obj)
    }
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
        debugger
        const validationResults3 = GiftedFormManager.validate('EditTenantContractRuleForm3')
        const values3 = GiftedFormManager.getValues('EditTenantContractRuleForm3')
        if (validationResults3.isValid || type === 'TemporaryStorage') {
          if (!this.validateForm3(values3)) return
          this.state.ContractInfo = {...this.state.ContractInfo, ...values3}
          this.asyncCreateOrder(type)
        } else {
          const errors3 = GiftedFormManager.getValidationErrors(validationResults3)
          Toast.show(errors3[0], {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        }
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
      'Relationship',
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
    let RentIncludeExp = 0
    this.state.RentIncludeCost.forEach(x=>{
      RentIncludeExp += +x.Price
    })
    this.state.ContractInfo.RentIncludeExp = RentIncludeExp
    this.state.ContractInfo.RentIncludeCost = JSON.stringify(this.state.RentIncludeCost)
    // 出房人
    const OutRoominfoList = DiffArrFn(this.cloneData.OutRoomInfoList, this.state.OutRoomInfoList)
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
    // 身份证照片
    const CardIDFront = DiffArrFn(this.cloneData.CardIDFront, this.state.ContractInfo.CardIDFront, [
      'ImageLocation'
    ])
    const CardIDBack = DiffArrFn(this.cloneData.CardIDBack, this.state.ContractInfo.CardIDBack, [
      'ImageLocation'
    ])
    this.state.ContractInfo.CardIDFront = CardIDFront
    this.state.ContractInfo.CardIDBack = CardIDBack
    // 代办人身份证照片
    const AgentCardIDFront = DiffArrFn(this.cloneData.AgentCardIDFront, this.state.ContractInfo.AgentCardIDFront, [
      'ImageLocation'
    ])
    const AgentCardIDBack = DiffArrFn(this.cloneData.AgentCardIDBack, this.state.ContractInfo.AgentCardIDBack, [
      'ImageLocation'
    ])
    this.state.ContractInfo.AgentCardIDFront = AgentCardIDFront
    this.state.ContractInfo.AgentCardIDBack = AgentCardIDBack
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
        BookKeep: this.BookKeep,
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
      fn(param).then(({Data, BusCode, Msg}) => {
        this.setState({
          orderLoading: false
        }, () => {
          setTimeout(() => {
            if (BusCode === 2) {
              Alert.alert('温馨提示', Msg);
              return
            }
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
                      Img: this.state.ContractInfo.CardIDFront[0].ImageLocation,
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
