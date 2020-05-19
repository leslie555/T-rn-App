import React, {Component} from 'react'
import {Alert, Button, Linking, Platform, Text, TouchableOpacity, View, Image} from 'react-native'
import styles from './style'
import {BillPanel} from './components'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {connect} from 'react-redux'
import {ButtonGroup, Header, StepsBox, UploadFile, UploadFileSingle} from "../../../../components";
import {AppGetContractOwnerDetail, editOwnerContract, getOwnerBill, insertOwnerContract} from "../../../../api/owner";
import {StateOwnerContract} from "../../../../api/system";
import {deepCopy, DiffArrFn, isDiffObj} from "../../../../utils/arrUtil";
import {dateFormat} from "../../../../utils/dateFormat";
import {getCityNameByCode} from "../../../../utils/Picker/areaData";
import Toast from 'react-native-root-toast';
import IconFont from "../../../../utils/IconFont";
import {validateCard, validateNumber, validatePhoneNumber, validateEmailNumber} from "../../../../utils/validate";
import FullModal from "../../../../components/FullModal";
import {updateContractDetail} from "../../../../redux/actions/contract";
import {updateList} from "../../../../redux/actions/list";
import store from "../../../../redux/store/store";
import {showSelectAny} from "../../../../components/SelectAny/util";
import BIN from '../../../../utils/bankcardinfo';

class OwnerContract extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
    this.stepList = [
      {
        title: '房屋信息'
      }, {
        title: '托管信息'
      }, {
        title: '生成账单'
      }, {
        title: '附加信息'
      }
    ]
    this.refSteps = null
    this.refBillPanel = null
    this.EnumData = {
      PaymentMethod: [],
      PayCycle: [],
      IncreaseType: [],
      IncreaseFrequency: [],
      PayTimeType: [],
      PaperType: [],
      PassengerChannel: [],
      Sex: [],
      OwnershipStatus: [],
      MortgageStatus: []
    } //枚举类型
    this.EnumProps = {
      value: 'Value',
      label: 'Description'
    }
    this.query = this.props.navigation.state.params || {} // 路由参数 KeyID,Renew EntranceID
    this.editType = this.query.Renew ? 2 : (this.query.KeyID ? 1 : 0) // 0新增 1修改 2续约
    this.headerTitle = ['新增业主合同', '修改业主合同', '续约业主合同'][this.editType]
    this.isLoadBillList = false
    this.cloneData = {
      ImageUpload: [],
      OwnerInfos: [],
      ContractEquipments: [],
      AgentCardIDFront: [],
      AgentCardIDBack: [],
      NoMoveOwn: [],
    } // clone的旧数据
    this.billForm = {}// 账单表单 用于对比是否修改了账单
    this.BillList = [] // 账单信息
    this.BookKeep = [] // 其他记账
    this.HouseRoomList = [] // 房产类型数据
    this.state = {
      currentIndex: 0,
      ContractInfo: {
        OwnerName: '',
        OwnerPhone: '',
        OwnerIDCard: '',
        OwnerSex: 0,
        ContractAddress: '',
        Postcode: '',
        Email: '',
        EmergencyContactName: '',
        EmergencyContactPhone: '',
        AgentName: '',
        AgentPhone: '',
        AgentIDCard: '',
        AgentAddress: '',
        ReceivePeopleName: '',
        ReceiveAccount: '',
        BankAccount: '',
        BankName: '',
        OpenBankName: '',
        ContractTemplateName: '',
        ContractNumber: '',
        HouseNumberMark: '',
        HostTimeMark: [],
        PayTimeType: 0,
        IsAgentMark: false,
        IsBroadbandMark: false,
        IsAgent: 0,
        IsBroadband: 0,
        PayCycle: 0,
        PayModel: 5,
        FreeDays: 0,
        Transformation: 0,
        IncreaseNum: '',
        IncreaseMoney: '',
        IncreaseType: 0,
        IncreaseFrequency: 1,
        PayDays: 30,
        PaperType: 0,
        CollectionType: 1,
        InitialPrice: '',
        PassengerChannel: 0,
        WaterNumber: '',
        ElectricityNumber: '',
        GasNumber: '',
        WaterCardNumber: '',
        GasCardNumber: '',
        ElectricityCardNumber: '',
        DoorCardNumber: '',
        ElectricMeterPeak: '',
        ElectricMeterValley: '',
        AgentCardIDFront: [],
        AgentCardIDBack: [],
        HouseRoomType: [0,0,0],
        RoomCount: 0,
        HallCount: 0,
        ToiletCount: 0,
        ProductionLicenseAddress: '',
        OwnershipStatus: 0,
        ProductionLicenseNumber: '',
        MortgageStatus: 0,
        NoMoveOwn: [],
      },
      detailLoading: false,
      billLoading: false,
      orderLoading: false,
      communityDisabled: false,
      HouseInfo: {
        Building: '',
        UnitNumber: '',
        RoomNumber: '',
        HouseArea: ''
      }, // 房源信息
      CommunityInfo: {
        CityCode: '',
        CityName: '',
        CommunityName: '',
        Location: ''
      }, // 小区信息
      OwnerContractOperate: {}, // 合同操作表
      ContractEquipments: [], // 房屋设备信息
      ImageUpload: [],
      ContractTemplate: [], // 合同模板
      OwnerInfos: [], // 业主列表
      btnOptions: [
        {
          label: '下一步',
          value: 'Next'
        }
      ], // 按钮组,
      PayModelText: [
        {
          Description: '',
          value: 5,
          label: '5+1'
        },
        {
          Description: '需要自己手动添加账单,并且需要审核',
          value: 6,
          label: '非正常拿房'
        }
      ], // 拿房模式
    }
    this.rules = {}
    this.willFocusKey = ''
    // 路由监听
    this.didBlurSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          // 选择小区数据拦截
          debugger
          switch(this.willFocusKey) {
            case 'communityInfo':
              if (payload.state.params && payload.state.params.communityInfo) {
                const obj = {
                  CommunityInfo: JSON.parse(payload.state.params.communityInfo)
                }
                //重复的时候不管
                if (obj.CommunityInfo.KeyID && obj.CommunityInfo.KeyID !== this.state.CommunityInfo.KeyID || obj.CommunityInfo.isAdd && obj.CommunityInfo.CommunityName !== this.state.CommunityInfo.CommunityName) {
                  // 小区可能是添加
                  if (obj.CommunityInfo.isAdd) {
                    obj.communityDisabled = false
                  } else {
                    obj.communityDisabled = true
                  }
                  this.setState(obj)
                }
              }
              break
            case 'streetInfo':
               // 街道数据
              if (payload.state.params && payload.state.params.streetInfo) {
                const streetInfo = JSON.parse(payload.state.params.streetInfo)
                this.setState({
                  CommunityInfo: {
                    ...this.state.CommunityInfo,
                    Street: streetInfo.Street,
                    StreetID: streetInfo.KeyID,
                  }
                })
              }
              break
            case 'equipmentInfo':
              // 设备清单数据拦截
              if (payload.state.params && payload.state.params.equipmentInfo) {
                this.setState({
                  ContractEquipments: JSON.parse(payload.state.params.equipmentInfo)
                })
              }
              break
          }
        }
    )
  }

  componentWillMount() {
    this.fetchData()
    this.initEnumData()
    this.initHouseRoomList()
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove()
  }

  initEnumData() {
    console.log(this.props.enumList)
    const Sex = this.props.enumList.EnumSex.slice()
    this.EnumData.Sex = Sex
    const PaymentMethod = this.props.enumList.EnumPaymentMethod.slice()
    PaymentMethod.shift()
    this.EnumData.PaymentMethod = PaymentMethod
    const PayCycle = this.props.enumList.EnumPayCycle.slice()
    this.EnumData.PayCycle = PayCycle
    const IncreaseType = this.props.enumList.EnumIncreaseType.slice()
    IncreaseType.splice(1, 1) // 删除掉不规则递增
    this.EnumData.IncreaseType = IncreaseType
    const PassengerChannel = this.props.enumList.EnumPassengerChannel.slice()
    PassengerChannel[0].Description = '无'
    this.EnumData.PassengerChannel = PassengerChannel
    const OwnershipStatus = this.props.enumList.EnumOwnershipStatus.slice()
    OwnershipStatus[0].Description = '请选择'
    this.EnumData.OwnershipStatus = OwnershipStatus
    const MortgageStatus = this.props.enumList.EnumMortgageStatus.slice()
    MortgageStatus[0].Description = '请选择'
    this.EnumData.MortgageStatus = MortgageStatus
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
        label: '固定为上一个月的几号',
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

  initHouseRoomList() {
    debugger
    let arr = []
    for (let i = 0; i < 10; i++) {
      arr.push({
        children: [],
        label: i + '室',
        value: i
      })
      for (let j = 0; j < 5; j++) {
        arr[i].children.push({
          children: [],
          label: j + '厅',
          value: j
        })
        for (let x = 0; x < 5; x++) {
          arr[i].children[j].children.push({
            children: [],
            label: x + '卫',
            value: x
          })
        }
      }
    }
    this.HouseRoomList = arr
  }

  validateForm0(form) {
    if (!validateEmailNumber(form.Email)) {
      Toast.show('电子邮箱格式不正确', {
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
    if (!validateCard(form.AgentIDCard)) {
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
    const options3 = {
      min: 0,
      max: 100,
      int: true
    }
    const msg1 = `只能为0-100000的数字`
    const msg2 = `只能为1-100的整数`
    const msg3 = `只能为0-100的整数`
    if (!validateNumber(form.InitialPrice, options1)) {
      Toast.show(`拿房价格` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.Transformation, options3)) {
      Toast.show(`改造期` + msg3, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.FreeDays, options3)) {
      Toast.show(`免租期` + msg3, {
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
    if (!validateNumber(form.WaterNumber, options1)) {
      Toast.show(`水表读数` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.ElectricityNumber, options1)) {
      Toast.show(`电表读数` + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    if (!validateNumber(form.GasNumber, options1)) {
      Toast.show(`天然气` + msg1, {
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
    const {ContractInfo, ContractTemplate, CommunityInfo, HouseInfo} = this.state
    return (
        <GiftedForm
            formName='EditOwnerContractRuleForm0'
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
          <GiftedForm.NoticeWidget title={`房屋信息`}/>
          <GiftedForm.LabelWidget
              name='CommunityName'
              title='小区'
              placeholder='请选择'
              onLabelPress={() => {
                this.showSelectCommunityFn()
              }}
              value={CommunityInfo.CommunityName}
          />
          <GiftedForm.AreaPickerWidget
              name='CityCode'
              title='区域'
              disabled={this.state.communityDisabled}
              value={CommunityInfo.CityCode}
              onChangeText={(val)=>{
                this.setState({
                  CommunityInfo: {
                    ...this.state.CommunityInfo,
                    CityCode: val
                  }
                })
              }}
          />
          <GiftedForm.LabelWidget
              name='Street'
              title='街道'
              placeholder='请选择'
              disabled={!this.state.CommunityInfo.CityCode}
              onLabelPress={() => {
                this.showSelectStreetFn()
              }}
              value={CommunityInfo.Street}
          />
          <GiftedForm.TextInputWidget
              inline={false}
              name='Location'
              title='详细地址'
              disabled={this.state.communityDisabled}
              placeholder='请输入详细地址'
              maxLength={50}
              numberOfLines={2}
              value={CommunityInfo.Location + ''}
          />
          <GiftedForm.TextInputWidget
              name='Building'
              title='栋'
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.Building + ''}
          />
          <GiftedForm.TextInputWidget
              name='UnitNumber'
              title='单元'
              required={false}
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.UnitNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='RoomNumber'
              title='室/房间号'
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.RoomNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='HouseArea'
              title='建筑面积'
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.HouseArea + ''}
              tail={`㎡`}
          />
          <GiftedForm.CascaderWidget
              name='HouseRoomType'
              title='房产类型'
              data={this.HouseRoomList}
              required={false}
              separator=" "
              value={ContractInfo.HouseRoomType}
          />
          <GiftedForm.PickerWidget
              name='OwnershipStatus'
              title='权属状况'
              required={false}
              data={this.EnumData.OwnershipStatus}
              value={ContractInfo.OwnershipStatus}
              mapKey={this.EnumProps}
          />
          <GiftedForm.PickerWidget
              name='MortgageStatus'
              title='抵押状况'
              required={false}
              data={this.EnumData.MortgageStatus}
              value={ContractInfo.MortgageStatus}
              mapKey={this.EnumProps}
          />
          <GiftedForm.TextInputWidget
              name='ProductionLicenseNumber'
              title='产权号'
              keyboardType={this.numberPad}
              maxLength={40}
              required={false}
              value={ContractInfo.ProductionLicenseNumber + ''}
          />
          <GiftedForm.TextInputWidget
              inline={false}
              name='ProductionLicenseAddress'
              title='产权地址'
              required={false}
              placeholder='请输入产权地址'
              maxLength={50}
              numberOfLines={2}
              value={ContractInfo.ProductionLicenseAddress + ''}
          />
          <GiftedForm.NoticeWidget title={`产权证明（不动产证或者产权证）`}/>
          <UploadFile list={ContractInfo.NoMoveOwn} type={`AgentEditOwnerContractNoMoveOwn`}
                      onChange={(data) => this.onUploadFileChange(data,3)}/>
          <GiftedForm.NoticeWidget title={`业主信息`} rightView={
            <TouchableOpacity onPress={() => this.handleOwnerAdd()} style={styles.add_owner_btn_box}>
              <Text style={styles.add_owner_btn_text}>添加业主</Text>
            </TouchableOpacity>
          }/>
          {this.state.OwnerInfos.map((item, index) => {
            return (
                <View style={[index == this.state.OwnerInfos.length - 1 ? null : styles.add_owner_box]} key={index}
                      formName={'ownerForm' + index}>
                  <View style={styles.add_owner_title_box}>
                    <Text style={styles.add_owner_title_text}>{`业主${index + 1}：`}</Text>
                    {this.state.OwnerInfos.length > 1 &&
                    <TouchableOpacity style={styles.owner_del_btn} onPress={() => this.handleOwnerDelete(index)}>
                      <IconFont name='jiahao1' size={10} color='#fff'/>
                    </TouchableOpacity>}
                  </View>
                  <GiftedForm.NoticeWidget widgetStyles={{noticeRow: {backgroundColor: '#fff',paddingTop:5,paddingBottom:0},noticeTitle:{color:'#333',fontSize:15}}} required={this.state.ContractInfo.PaperType === 0} title={`添加业主身份证`}/>
                  <UploadFile list={item.CardIDFront} single={true} btnText='头像面'
                      onChange={(data) => {this.onOwnerUploadFileChange(data,item,'CardIDFront')}}>
                        <UploadFileSingle list={item.CardIDBack} single={true} btnText='国徽面'
                      onChange={(data) => {this.onOwnerUploadFileChange(data,item,'CardIDBack')}}/>
                      </UploadFile>
                  <GiftedForm.TextInputWidget
                      name={`OwnerName${index}`}
                      title='业主姓名'
                      maxLength={14}
                      onChangeText={(val) => {
                        this.ownerInfoChange(val, index, 'OwnerName')
                      }}
                      value={item.OwnerName + ''}
                  />
                  <GiftedForm.TextInputWidget
                      name={`OwnerPhone${index}`}
                      title='业主电话'
                      maxLength={11}
                      onChangeText={(val) => {
                        this.ownerInfoChange(val, index, 'OwnerPhone')
                      }}
                      keyboardType={`phone-pad`}
                      value={item.OwnerPhone + ''}
                  />
                  <GiftedForm.TextInputWidget
                      name={`OwnerIDCard${index}`}
                      title='身份证号'
                      maxLength={18}
                      onChangeText={(val) => {
                        this.ownerInfoChange(val, index, 'OwnerIDCard')
                      }}
                      keyboardType={this.numberPad}
                      value={item.OwnerIDCard + ''}
                  />
                  <GiftedForm.PickerWidget
                      name={`OwnerSex${index}`}
                      title='性别'
                      data={this.EnumData.Sex}
                      value={ContractInfo.OwnerSex}
                      mapKey={this.EnumProps}
                      onPickerConfirm={(val) => {
                        this.ownerInfoChange(val, index, 'OwnerSex')
                      }}
                  />
                  <GiftedForm.TextInputWidget
                      name={`OwnerAddress${index}`}
                      title='通讯地址'
                      required={false}
                      maxLength={50}
                      onChangeText={(val) => {
                        this.ownerInfoChange(val, index, 'ContractAddress')
                      }}
                      value={item.ContractAddress + ''}
                  />
                </View>
            )
          })}
          <GiftedForm.NoticeWidget title={`业主其他信息`}/>
          <GiftedForm.PickerWidget
              name='PassengerChannel'
              title='获客渠道'
              data={this.EnumData.PassengerChannel}
              value={ContractInfo.PassengerChannel}
              mapKey={this.EnumProps}
          />
          <GiftedForm.TextInputWidget
              name='Postcode'
              title='邮编'
              required={false}
              maxLength={14}
              value={ContractInfo.Postcode + ''}
          />
          <GiftedForm.TextInputWidget
              name='Email'
              title='电子邮箱'
              required={false}
              maxLength={30}
              value={ContractInfo.Email + ''}
          />
          <GiftedForm.TextInputWidget
              name='EmergencyContactName'
              title='紧急联系人姓名'
              required={false}
              maxLength={14}
              value={ContractInfo.EmergencyContactName + ''}
          />
          <GiftedForm.TextInputWidget
              name='EmergencyContactPhone'
              title='紧急联系人电话'
              maxLength={11}
              required={false}
              keyboardType={`phone-pad`}
              value={ContractInfo.EmergencyContactPhone + ''}
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
              onChange={(data) => {this.onUploadFileChange(data,1)}}>
                <UploadFileSingle list={this.state.ContractInfo.AgentCardIDBack} single={true} btnText='国徽面'
              onChange={(data) => {this.onUploadFileChange(data,2)}}/>
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
              name='AgentIDCard'
              title='代办人身份证'
              maxLength={18}
              keyboardType={this.numberPad}
              value={ContractInfo.AgentIDCard + ''}
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
          <GiftedForm.NoticeWidget title={`收款信息`}/>
          <GiftedForm.PickerWidget
              name='CollectionType'
              title='收款方式'
              onPickerConfirm={(val) => {
                this.contractInfoChange(val, 'CollectionType')
              }}
              data={this.EnumData.PaymentMethod}
              value={ContractInfo.CollectionType}
              mapKey={this.EnumProps}
          />
          {(ContractInfo.CollectionType == 2 || ContractInfo.CollectionType == 3) &&
          <GiftedForm.TextInputWidget
              name='ReceivePeopleName'
              title='收款人姓名'
              maxLength={14}
              value={ContractInfo.ReceivePeopleName + ''}
          />}
          {(ContractInfo.CollectionType == 2 || ContractInfo.CollectionType == 3) &&
          <GiftedForm.TextInputWidget
              name='ReceiveAccount'
              title='收款账号'
              maxLength={30}
              keyboardType={this.numberPad}
              value={ContractInfo.ReceiveAccount + ''}
          />}
          {(ContractInfo.CollectionType == 4) &&
          <GiftedForm.TextInputWidget
              name='ReceiveAccount'
              title='转款账户名称'
              maxLength={30}
              value={ContractInfo.ReceiveAccount + ''}
          />}
          {(ContractInfo.CollectionType == 4) &&
          <GiftedForm.TextInputWidget
              name='BankAccount'
              title='银行账号'
              maxLength={23}
              keyboardType={this.numberPad}
              onChangeText={(val) => {
                this.searchBankName(val)
              }}
              value={ContractInfo.BankAccount + ''}
          />}
          {(ContractInfo.CollectionType == 4) &&
          <GiftedForm.TextInputWidget
              name='BankName'
              title='银行名称'
              maxLength={20}
              value={ContractInfo.BankName + ''}
          />}
          {(ContractInfo.CollectionType == 4) &&
          <GiftedForm.TextInputWidget
              name='OpenBankName'
              title='开户行'
              maxLength={20}
              value={ContractInfo.OpenBankName + ''}
          />}
          <GiftedForm.NoticeWidget title={`其他附件`}/>
          <UploadFile list={this.state.ImageUpload} type={`AgentEditOwnerContract`}
                      onChange={(data) => this.onUploadFileChange(data)}/>
        </GiftedForm>
    )
  }

  getStep2View() {
    const {ContractInfo} = this.state
    return (
        <GiftedForm
            formName='EditOwnerContractRuleForm1'
        >
          <GiftedForm.NoticeWidget title={`托管信息`} rightView={
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
              title='托管时间'
              cannotEqual
              value={ContractInfo.HostTimeMark}
          />
          <GiftedForm.PickerWidget
              name='PayCycle'
              title='付款周期'
              data={this.EnumData.PayCycle}
              value={ContractInfo.PayCycle}
              mapKey={this.EnumProps}
          />
          <GiftedForm.TextInputWidget
              name='InitialPrice'
              title='拿房价格'
              maxLength={6}
              keyboardType={this.numberPad}
              value={ContractInfo.InitialPrice + ''}
              tail={`元/月`}
              onEndEditing={(val) => {
                this.calcPrice(val.nativeEvent.text)
              }}
          />
          <GiftedForm.NoticeWidget title={`拿房模式`}/>
          <GiftedForm.PickerWidget
              name='PayModel'
              title='拿房模式'
              data={this.state.PayModelText}
              value={ContractInfo.PayModel}
          />
          <GiftedForm.TextInputWidget
              name='Transformation'
              title='改造期'
              maxLength={6}
              required={false}
              keyboardType={this.numberPad}
              value={ContractInfo.Transformation + ''}
              tail={`个月`}
          />
          <GiftedForm.TextInputWidget
              name='FreeDays'
              title='免租期'
              maxLength={6}
              required={false}
              keyboardType={this.numberPad}
              value={ContractInfo.FreeDays + ''}
              tail={`个月`}
          />
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
              title={this.EnumData.PayTimeType[ContractInfo.PayTimeType].label}
              maxLength={2}
              keyboardType={this.numberPad}
              value={ContractInfo.PayDays + ''}
              tail={ContractInfo.PayTimeType == 0 ? '天' : '号'}
          />
        </GiftedForm>
    )
  }

  getStep3View() {
    return (
        <BillPanel type={0} navigation={this.props.navigation} houseInfo={this.state.HouseInfo}
                   communityInfo={this.state.CommunityInfo} ref={(refSteps) => {
          this.refBillPanel = refSteps
        }}/>
    )
  }

  getStep4View() {
    const {ContractInfo} = this.state
    return (
        <GiftedForm
            formName='EditOwnerContractRuleForm3'
        >
          <View style={styles.step_notice}> 
           <Image
                source={require('../EditTenantContract/images/notice.png')}
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
              name='WaterNumber'
              title='水表度数'
              maxLength={7}
              keyboardType={this.numberPad}
              value={ContractInfo.WaterNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='ElectricityNumber'
              title='电表读数'
              maxLength={7}
              keyboardType={this.numberPad}
              value={ContractInfo.ElectricityNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='GasNumber'
              title='天然气'
              maxLength={7}
              keyboardType={this.numberPad}
              value={ContractInfo.GasNumber + ''}
              tail={`m³`}
          />
          <GiftedForm.SwitchWidget
              name='IsBroadbandMark'
              title='是否有宽带'
              onSwitchChange={(val) => this.broadbandChange(val)}
              value={ContractInfo.IsBroadbandMark}
          />
          <GiftedForm.LabelWidget
              title='房屋设备清单'
              required={false}
              value={this.state.ContractEquipments.length === 0 ? '请选择' : `已选择${this.state.ContractEquipments.length}个`}
              onLabelPress={() => {
                this.showContractEquipmentsFn()
              }}
          />
          <GiftedForm.NoticeWidget title={`其他信息`}/>
          <GiftedForm.TextInputWidget
              name='WaterCardNumber'
              title='水卡号'
              required={false}
              maxLength={20}
              keyboardType={this.numberPad}
              value={ContractInfo.WaterCardNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='GasCardNumber'
              title='气卡号'
              required={false}
              maxLength={20}
              keyboardType={this.numberPad}
              value={ContractInfo.GasCardNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='ElectricityCardNumber'
              title='电卡号'
              required={false}
              maxLength={20}
              keyboardType={this.numberPad}
              value={ContractInfo.ElectricityCardNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='DoorCardNumber'
              title='门卡号'
              required={false}
              maxLength={20}
              keyboardType={this.numberPad}
              value={ContractInfo.DoorCardNumber + ''}
          />
          <GiftedForm.TextInputWidget
              name='ElectricMeterPeak'
              title='电表峰'
              required={false}
              maxLength={20}
              keyboardType={this.numberPad}
              value={ContractInfo.ElectricMeterPeak + ''}
          />
          <GiftedForm.TextInputWidget
              name='ElectricMeterValley'
              title='电表谷'
              required={false}
              maxLength={20}
              keyboardType={this.numberPad}
              value={ContractInfo.ElectricMeterValley + ''}
          />
          <GiftedForm.NoticeWidget title={`附加条款`}/>
          <GiftedForm.TextAreaWidget
              name='ContractRemark'
              required={false}
              placeholder='请输入附加条款'
              maxLength={1500}
              value={ContractInfo.ContractRemark}
          />
        </GiftedForm>
    )
  }

  fetchData() {
    this.setState({
      detailLoading: true
    })
    AppGetContractOwnerDetail({
      ownerID: this.query.KeyID || 0, // 35540
      entranceID: this.query.EntranceID || 0,
      type: 1
    }).then(({Data}) => {
      this.initPageData(Data)
    }).finally(() => {
      this.setState({
        detailLoading: false
      })
    })
  }

  initPageData({ContractTemplate, OwnerContract, HouseInfo, CommunityInfo, ImageUpload, OwnerEquipments, OwnerBill, BookKeep, OwnerContractOperate, OwnerInfos}) {
    const ContractStateModel = {
      ContractTemplate
    }
    ContractStateModel.ContractInfo = {
      ...this.state.ContractInfo,
      ContractTemplateName: ContractTemplate[0].ContractTemplateName
    }
    /* 续签删除账期和记账 */
    if (this.editType === 2) {
      OwnerBill = []
      BookKeep = []
      if (OwnerContract) {
        OwnerContract.PaperType = 0
      }
    }
    if (OwnerContractOperate) {
      ContractStateModel.OwnerContractOperate = OwnerContractOperate
    }
    if (HouseInfo) {
      ContractStateModel.HouseInfo = HouseInfo
    }
    if (OwnerEquipments) {
      ContractStateModel.ContractEquipments = OwnerEquipments
      if (this.editType !== 2) {
        this.cloneData.ContractEquipments = deepCopy(OwnerEquipments)
      }
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
    if (OwnerBill && OwnerBill.length > 0) {
      this.BillList = OwnerBill
    }
    if (CommunityInfo) {
      ContractStateModel.CommunityInfo = CommunityInfo
      if (CommunityInfo.CityCode) {
        ContractStateModel.communityDisabled = true
      }
    }
    if (OwnerContract) {
      if (OwnerContract.AgentCardIDFront && OwnerContract.AgentCardIDFront.length > 0) {
        this.cloneData.AgentCardIDFront = deepCopy(OwnerContract.AgentCardIDFront)
      }
      if (OwnerContract.AgentCardIDBack && OwnerContract.AgentCardIDBack.length > 0) {
        this.cloneData.AgentCardIDBack = deepCopy(OwnerContract.AgentCardIDBack)
      }
      if (OwnerContract.NoMoveOwn && OwnerContract.NoMoveOwn.length > 0) {
        this.cloneData.NoMoveOwn = deepCopy(OwnerContract.NoMoveOwn)
      }
      ContractStateModel.ContractInfo = {
        ...this.state.ContractInfo, ...OwnerContract
      }
      // 合同模板可能是空
      if (!ContractStateModel.ContractInfo.ContractTemplateName) {
        ContractStateModel.ContractInfo.ContractTemplateName = ContractTemplate[0].ContractTemplateName
      }
      // 合同编号重置
      if (this.editType === 2) {
        ContractStateModel.ContractInfo.ContractNumber = ''
        ContractStateModel.ContractInfo.HouseNumberMark = ''
      }
      // 代理人信息
      ContractStateModel.ContractInfo.IsAgentMark = ContractStateModel.ContractInfo.IsAgent === 1
      // 是否有宽带
      ContractStateModel.ContractInfo.IsBroadbandMark = ContractStateModel.ContractInfo.IsBroadband === 1
      // 托管时间
      ContractStateModel.ContractInfo.HostStartTime = dateFormat(ContractStateModel.ContractInfo.HostStartTime, 'yyyy-MM-dd 00:00:00')
      ContractStateModel.ContractInfo.HostEndTime = dateFormat(ContractStateModel.ContractInfo.HostEndTime, 'yyyy-MM-dd 00:00:00')
      // 房产类型重置
      ContractStateModel.ContractInfo.HouseRoomType = [ContractStateModel.ContractInfo.RoomCount || 0,ContractStateModel.ContractInfo.HallCount || 0,ContractStateModel.ContractInfo.ToiletCount || 0]
      // 付款模式 兼容老数据 0 1 2 -》6
      if (ContractStateModel.ContractInfo.PayModel < 5) {
        ContractStateModel.ContractInfo.PayModel = 6
      }
      if (!ContractStateModel.PayDays) {
        ContractStateModel.PayDays = 30
      }
      if (this.editType === 2) {
        ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(ContractStateModel.ContractInfo.HostEndTime), '']
      } else {
        // 暂存可能没有时间
        if (!ContractStateModel.ContractInfo.HostStartTime && !ContractStateModel.ContractInfo.HostEndTime) {
          ContractStateModel.ContractInfo.HostTimeMark = []
        } else {
          ContractStateModel.ContractInfo.HostTimeMark = [dateFormat(ContractStateModel.ContractInfo.HostStartTime), dateFormat(ContractStateModel.ContractInfo.HostEndTime)]
        }
      }
    }
    if (!OwnerInfos || OwnerInfos && OwnerInfos.length === 0) {
      ContractStateModel.OwnerInfos = [{
        OwnerName: ContractStateModel.ContractInfo.OwnerName,
        OwnerPhone: ContractStateModel.ContractInfo.OwnerPhone,
        OwnerIDCard: ContractStateModel.ContractInfo.OwnerIDCard,
        OwnerSex: ContractStateModel.ContractInfo.OwnerSex,
        CardIDFront: [],
        CardIDBack: [],
        ContractAddress: ContractStateModel.ContractInfo.ContractAddress
      }]
    } else {
      ContractStateModel.OwnerInfos = OwnerInfos
      if (this.editType !== 2) {
        this.cloneData.OwnerInfos = deepCopy(OwnerInfos)
      }
    }
    this.setState(ContractStateModel)
    if (OwnerContract) {
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
    // this.refSteps.nextStep()
    switch (this.state.currentIndex) {
      case 0:
        const validationResults0 = GiftedFormManager.validate('EditOwnerContractRuleForm0')
        const values0 = GiftedFormManager.getValues('EditOwnerContractRuleForm0')
        console.log(values0)
        // this.refSteps.nextStep()
        if (validationResults0.isValid) {
          if (!this.validateForm0(values0)) return
          try {
            this.state.OwnerInfos.forEach((v, i) => {
              if (!v.OwnerName) {
                throw new Error(`请填写业主${i + 1}姓名！`)
              }
              if (!v.OwnerPhone) {
                throw new Error(`请填写业主${i + 1}电话！`)
              } else if (!validatePhoneNumber(v.OwnerPhone)) {
                throw new Error(`业主${i + 1}电话号码格式不正确！`)
              }
              if (!v.OwnerIDCard) {
                throw new Error(`请填写业主${i + 1}身份证！`)
              }
              // 纸质合同不验证身份证
              if (this.state.ContractInfo.PaperType === 0) {
                if (!validateCard(v.OwnerIDCard)) throw new Error(`业主${i + 1}身份证格式不正确！`)
                if (!(v.CardIDFront && v.CardIDFront.length > 0)) {
                  throw new Error(`请上传业主${i + 1}身份证头像面！`)
                }
                if (!(v.CardIDBack && v.CardIDBack.length > 0)) {
                  throw new Error(`请上传业主${i + 1}身份证国徽面！`)
                }
              }
            })
            if (this.state.ContractInfo.IsAgentMark && this.state.ContractInfo.PaperType === 0 && this.state.ContractInfo.AgentCardIDFront.length === 0) {
              throw new Error(`请上传代办人身份证头像面！`)
            }
            if (this.state.ContractInfo.IsAgentMark && this.state.ContractInfo.PaperType === 0 && this.state.ContractInfo.AgentCardIDBack.length === 0) {
              throw new Error(`请上传代办人身份证国徽面！`)
            }
          } catch (e) {
            Toast.show(e.message, {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return
          }
          this.state.ContractInfo = {...this.state.ContractInfo, ...values0}
          // 重置合同中默认业主信息
          this.state.ContractInfo.OwnerName = this.state.OwnerInfos[0].OwnerName
          this.state.ContractInfo.OwnerPhone = this.state.OwnerInfos[0].OwnerPhone
          this.state.ContractInfo.OwnerIDCard = this.state.OwnerInfos[0].OwnerIDCard.toUpperCase()
          this.state.ContractInfo.OwnerSex = this.state.OwnerInfos[0].OwnerSex
          this.state.ContractInfo.ContractAddress = this.state.OwnerInfos[0].ContractAddress
          // 房源信息
          this.state.HouseInfo.Building = values0.Building
          this.state.HouseInfo.HouseArea = values0.HouseArea
          this.state.HouseInfo.RoomNumber = values0.RoomNumber
          this.state.HouseInfo.UnitNumber = values0.UnitNumber
          // 小区信息
          this.state.CommunityInfo.CityCode = values0.CityCode
          this.state.CommunityInfo.CityName = getCityNameByCode(values0.CityCode,0)
          this.state.CommunityInfo.Location = values0.Location
          this.state.CommunityInfo.CommunityName = values0.CommunityName
          // 房产类型
          this.state.ContractInfo.RoomCount = this.state.ContractInfo.HouseRoomType[0]
          this.state.ContractInfo.HallCount = this.state.ContractInfo.HouseRoomType[1]
          this.state.ContractInfo.ToiletCount = this.state.ContractInfo.HouseRoomType[2]
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
        const validationResults1 = GiftedFormManager.validate('EditOwnerContractRuleForm1')
        const values1 = GiftedFormManager.getValues('EditOwnerContractRuleForm1')
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
    this.setState({
      ContractInfo: this.state.ContractInfo
    })
    let msg = ''
    if (num === 1) {
      msg = '半'
    } else {
      msg = num / 2
    }
    Toast.show(`已切换托管时间为${msg}年`, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM
    })
  }

  calcPrice(val) {
    if (!this.state.CommunityInfo.KeyID || !val) {
      return
    }
    StateOwnerContract({
      CommunityID: this.state.CommunityInfo.KeyID,
      TakeRoom: val
    }).then(({BusCode}) => {
      if (BusCode === 1) {
        Toast.show(`该价格超过系统测算拿房价格`, {
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

  broadbandChange(val) {
    this.setState({
      ContractInfo: {...this.state.ContractInfo, IsBroadbandMark: val}
    })
  }

  contractInfoChange(val, type, num = 0) {
    if(type === 'CollectionType') {
      // 重置收款信息的表单
      this.setState({
        ContractInfo: {
          ...this.state.ContractInfo,
          ReceivePeopleName: '',
          ReceiveAccount: '',
          BankAccount: '',
          BankName: '',
          OpenBankName: '',
        }
      })
    }
    if (num === 0) {
      this.state.ContractInfo[type] = val
      this.setState({
        ContractInfo: this.state.ContractInfo
      })
    } else {
      this.state.ContractInfo[type] = val
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
          ContractInfo: {...this.state.ContractInfo,AgentCardIDFront: data}
        })
        break
      case 2:
        this.setState({
          ContractInfo: {...this.state.ContractInfo,AgentCardIDBack: data}
        })
        break
      case 3:
        this.setState({
          ContractInfo: {...this.state.ContractInfo,NoMoveOwn: data}
        })
        break
    }
  }

  onOwnerUploadFileChange(data,item,type) {
    item[type] = data 
    this.setState({
      OwnerInfos: [...this.state.OwnerInfos]
    })
  }

  showSelectCommunityFn() {
    this.willFocusKey = 'communityInfo'
    showSelectAny({
      apiType: 2,
      path: 'AgentEditOwnerContract',
      returnKey: 'communityInfo'
    })
  }

  showSelectStreetFn() {
    this.willFocusKey = 'streetInfo'
    showSelectAny({
      apiType: 5,
      path: 'AgentEditOwnerContract',
      returnKey: 'streetInfo',
      extraParam: {
        CityCode: this.state.CommunityInfo.CityCode
      }
    })
  }

  searchBankName(num) {
    if (num.length < 19) {
      const arr = new Array(19 - num.length).fill(8)
      num = num + arr.join('')
    }
    console.log(num)
    BIN.getBankBin(num).then((data) => {
        console.log(data)
        this.setState({
          ContractInfo: {...this.state.ContractInfo,BankName:data.bankName}
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  showContractEquipmentsFn() {
    this.willFocusKey = 'equipmentInfo'
    this.props.navigation.navigate('AgentEditContractEquipments', {
      path: 'AgentEditOwnerContract',
      data: this.state.ContractEquipments
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

  handleOwnerDelete(i) {
    this.state.OwnerInfos.splice(i, 1)
    this.setState({
      OwnerInfos: this.state.OwnerInfos
    })
  }

  handleOwnerAdd(i) {
    this.state.OwnerInfos.push({
      OwnerName: '',
      OwnerPhone: '',
      OwnerIDCard: '',
      OwnerSex: 0,
      ContractAddress: '',
      CardIDFront: [],
      CardIDBack: [],
    })
    this.setState({
      OwnerInfos: this.state.OwnerInfos
    })
  }

  ownerInfoChange(val, i, type) {
    this.state.OwnerInfos[i][type] = val
    this.setState({
      OwnerInfos: this.state.OwnerInfos
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

  saveBillForm() {
    const keys = [
      'HostStartTime',
      'HostEndTime',
      'InitialPrice',
      'PayCycle',
      'PayModel',
      'FreeDays',
      'Transformation',
      'IncreaseType',
      'IncreaseFrequency',
      'IncreaseNum',
      'IncreaseMoney',
      'PayTimeType',
      'PayDays'
    ]
    keys.map(v => {
      this.billForm[v] = this.state.ContractInfo[v]
    })
  }

  resetBillForm() {
    if (this.state.ContractInfo.IncreaseFrequency === 0) {
      this.state.ContractInfo.IncreaseFrequency = 1
      this.setState({
        ContractInfo: this.state.ContractInfo
      })
    }
  }

  buildBillData(values) {
    if (!values) {
      // 第二步暂存
      values = GiftedFormManager.getValues('EditOwnerContractRuleForm1')
    }
    this.state.ContractInfo = {...this.state.ContractInfo, ...values}
    // 组装数据
    const model = this.state.ContractInfo
    model.HostStartTime = dateFormat(model.HostTimeMark[0], 'yyyy-MM-dd 00:00:00')
    model.HostEndTime = dateFormat(model.HostTimeMark[1], 'yyyy-MM-dd 00:00:00')
    // 递增方式为不递增 不规则递增时 不能有 递增次数 递增年 递增值
    if (model.IncreaseType < 2) {
      model.IncreaseFrequency = 0
      model.IncreaseNum = 0
      model.IncreaseMoney = 0
    }
  }

  createBill(values) {
    this.buildBillData(values)

    if (Object.keys(this.billForm).length === 0 || this.BillList.length === 0) {
      // 新增、续签、没有账单的时候
      this.getBillList()
    } else if (isDiffObj({ PayModel: this.billForm.PayModel }, this.state.ContractInfo) && this.state.ContractInfo.PayModel === 6) {
      // 修改的时候有变动
      Alert.alert('温馨提示', '系统检测到你切换了拿房模式为“非正常拿房”，账单需要自己添加，确认后进入下一步', [
        {text: '取消', onPress: () => this.resetBillForm()},
        {text: '确认', onPress: () => this.getBillList()}
      ], {cancelable: false})
    } else if (this.state.ContractInfo.PayModel === 6) {
      if (!this.isLoadBillList) {
        this.refBillPanel.initBillData(this.BillList,this.state.ContractInfo.PayModel)
        this.isLoadBillList = true
      }
      this.refSteps.nextStep()
    } else if (isDiffObj(this.billForm, this.state.ContractInfo)) {
      // 修改的时候有变动
      Alert.alert('温馨提示', '系统检测到表单发生变动,确认后将重新生成账单', [
        {text: '取消', onPress: () => this.resetBillForm()},
        {text: '确认', onPress: () => this.getBillList()}
      ], {cancelable: false})
    } else {
      if (!this.isLoadBillList) {
        this.refBillPanel.initBillData(this.BillList,this.state.ContractInfo.PayModel)
        this.isLoadBillList = true
      }
      this.refSteps.nextStep()
    }
  }

  getBillList() {
    if (this.state.ContractInfo.PayModel === 6) {
      this.BillList = []
      this.refBillPanel.initBillData([], this.state.ContractInfo.PayModel)
      this.saveBillForm()
      this.refSteps.nextStep()
    } else {
      this.setState({
        billLoading: true
      })
      getOwnerBill(this.state.ContractInfo).then(({Data, BusCode, Msg}) => {
        if (BusCode === 0) {
          this.BillList = Data
          this.refBillPanel.initBillData(Data, this.state.ContractInfo.PayModel)
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
  }

  createOrder(type) {
    // 电子合同的Save为现场签字
    if (this.state.ContractInfo.PaperType === 0 && type === 'Save') {
      type = 'SignUp'
    }
    // if (type === 'SignUp') {
    //   if (!validatePhoneNumber(this.state.ContractInfo.OwnerPhone)) {
    //     Toast.show('业主电话校验不通过，不能进行现场签字', {
    //       duration: Toast.durations.SHORT,
    //       position: Toast.positions.BOTTOM
    //     })
    //     return false
    //   }
    //   if (this.state.ContractInfo.OwnerIDCard.length !== 15 && this.state.ContractInfo.OwnerIDCard.length !== 18) {
    //     Toast.show('业主身份证校验不通过，不能进行现场签字', {
    //       duration: Toast.durations.SHORT,
    //       position: Toast.positions.BOTTOM
    //     })
    //     return false
    //   }
    // }
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
                this.refBillPanel.initBillData([],this.state.ContractInfo.PayModel)
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
        const validationResults3 = GiftedFormManager.validate('EditOwnerContractRuleForm3')
        const values3 = GiftedFormManager.getValues('EditOwnerContractRuleForm3')
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
    // 是否有宽带
    this.state.ContractInfo.IsBroadband = this.state.ContractInfo.IsBroadbandMark ? 1 : 0
    // 对比数据比较出ModifyStatus
    const OwnerEquipments = DiffArrFn(this.cloneData.ContractEquipments, this.state.ContractEquipments, [
      'EquipmentName',
      'EquipmentNumber'
    ])
    // 对比数据比较出ModifyStatus
    const ImageUpload = DiffArrFn(this.cloneData.ImageUpload, this.state.ImageUpload, [
      'ImageLocation'
    ])
    // 代办人身份证正反面
    const AgentCardIDFront = DiffArrFn(this.cloneData.AgentCardIDFront, this.state.ContractInfo.AgentCardIDFront, [
      'ImageLocation'
    ])
    const AgentCardIDBack = DiffArrFn(this.cloneData.AgentCardIDBack, this.state.ContractInfo.AgentCardIDBack, [
      'ImageLocation'
    ])
    this.state.ContractInfo.AgentCardIDFront = AgentCardIDFront
    this.state.ContractInfo.AgentCardIDBack = AgentCardIDBack
    // 不动产照片
    const NoMoveOwn = DiffArrFn(this.cloneData.NoMoveOwn, this.state.ContractInfo.NoMoveOwn, [
      'ImageLocation'
    ])
    this.state.ContractInfo.NoMoveOwn = NoMoveOwn
    const OwnerInfos = DiffArrFn(this.cloneData.OwnerInfos, this.state.OwnerInfos)
    const OwnerBill = this.refBillPanel.getBillValue()
    // 强制修改 InputTerminal
    this.state.ContractInfo.InputTerminal = 0
    // 续约加字段
    if (this.editType === 2) {
      this.state.ContractInfo.RenewalID = this.query.KeyID
      this.state.KeyID = 0
    }
    // 房东房源备案过来
    if (this.query.EntranceID) {
      this.state.ContractInfo.EntranceID = this.query.EntranceID
    }
    const param = {
      ownerContractModel: {
        OwnerContract: this.state.ContractInfo,
        HouseInfo: this.state.HouseInfo,
        CommunityInfo: this.state.CommunityInfo,
        OwnerBill,
        OwnerEquipments,
        ImageUpload,
        BookKeep: this.BookKeep,
        OwnerInfos
      },
      buttonType: type
    }
    // 手机上都调用暂存接口 !important
    let fn = insertOwnerContract
    if (this.editType === 1) {
      fn = editOwnerContract
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
                    // 修改列表合同状态 签约哪里也要修改 这里不去详情 去列表 但是列表必须push 因为可以返回
                    this.props.navigation.navigate('AgentContractList', {
                      page: 1,
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
                      page: 1,
                      isRefresh
                    })
                  }
                }
              ], {cancelable: false})
            } else if (type === 'SignUp') {
              Alert.alert('温馨提示', '保存合同成功,前往现场签字页面', [
                {
                  text: '确认', onPress: () => {
                    this.props.navigation.replace('AgentContractSign', {
                      Mobile: this.state.ContractInfo.OwnerPhone,
                      IDCard: this.state.ContractInfo.OwnerIDCard,
                      Name: this.state.ContractInfo.OwnerName,
                      Img: this.state.OwnerInfos[0].CardIDFront[0].ImageLocation, // TODO
                      ContractID: Data,
                      path: this.editType === 0 ? 'EditContract' : '',
                      type: 0
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

  getHouseName() {
    let HouseName = this.state.CommunityInfo.CommunityName + this.state.HouseInfo.Building + '-'
    if (this.state.HouseInfo.UnitNumber) {
      HouseName += this.state.HouseInfo.UnitNumber + '-'
    }
    HouseName += this.state.HouseInfo.RoomNumber
    return HouseName
  }

  changeContractData(id, type) {
    let isRefresh = false
    const sameParam = {
      HouseName: this.getHouseName(),
      HostStartTime: this.state.ContractInfo.HostStartTime,
      HostEndTime: this.state.ContractInfo.HostEndTime,
      OwnerName: this.state.ContractInfo.OwnerName,
      OwnerPhone: this.state.ContractInfo.OwnerPhone
    }
    let changeParam = {}
    if (type === 'Save') {
      if (this.editType === 1) {
        changeParam = {
          AuditStatus: 1,
          LeaseStatus: 3,
          ...sameParam
        }
      } else {
        isRefresh = true
      }
    } else if (type === 'TemporaryStorage') {
      if (this.editType === 1) {
        changeParam = {
          AuditStatus: 0,
          LeaseStatus: 1,
          ...sameParam
        }
      } else {
        isRefresh = true
      }
    } else if (type === 'SignUp') {
      if (this.editType === 1) {
        changeParam = {
          AuditStatus: 0,
          LeaseStatus: 2,
          ...sameParam
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
            key: 'ownerContractList',
            data: changeParam
          })
      )
    }
    //修改详情
    store.dispatch(
        updateContractDetail({
          key: 'OwnerContractOperate',
          data: changeParam
        })
    )
    store.dispatch(
        updateContractDetail({
          key: 'OwnerContract',
          data: this.state.ContractInfo
        })
    )
    return isRefresh
  }
}

const mapToProps = state => ({enumList: state.enum.enumList, uploadImages: state.uploadImg.EditOwnerContract})
export default connect(mapToProps)(OwnerContract)
