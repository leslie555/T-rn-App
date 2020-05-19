import React, {Component} from 'react'
import {Alert, DeviceEventEmitter, Platform, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import StepsBox from '../../../../components/StepsBox'
import {validateNumber} from '../../../../utils/validate'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {ButtonGroup, Header, UploadFile} from "../../../../components";
import {houseInfoListByID, perfectingHousingEditApp} from "../../../../api/house";
import Toast from 'react-native-root-toast';
import FullModal from "../../../../components/FullModal";
import store from "../../../../redux/store/store";
import {updateList} from "../../../../redux/actions/list";
import {connect} from 'react-redux'

class CompleteHouse extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.stepList = [
      {
        title: '门牌信息'
      }, {
        title: '价格配置'
      }, {
        title: '房源描述'
      }
    ]
    this.refSteps = null
    this.EnumData = {
      PaymentMethod: [],
      PayCycle: [],
      FreePay: [],
      BillPattern: [],
      IncreaseType: [],
      ForwardType: [],
      IncreaseFrequency: [],
      PayTimeType: [],
      EnterType: []
    } //枚举类型
    this.EnumProps = {
      value: 'Value',
      label: 'Description'
    }
    this.query = this.props.navigation.state.params || {} // 路由参数 KeyID,Renew
    this.isEdit = !!this.query.KeyID // 是否修改
    this.headerTitle = '完善房源'
    this.currentIndex = 0
    this.cloneData = {
      ImageUpload: [],
      BookKeep: []
    } // clone的旧数据
    this.billForm = {}// 账单表单 用于对比是否修改了账单
    this.state = {
      KeyID: 0,
      CountNumNoZero: [],
      HavaTenContract: false,
      isShowModal: true,
      currentIndex: 0,
      HouseDesc: '',
      detailLoading: false,
      pricePartTable: [],
      btnOptions: [
        {
          label: '下一步',
          value: 'Next'
        }
      ],
      BadgeList: [
        {
          label: '不限性别',
          value: '不限性别',
          isSelect: false
        },
        {
          label: '限男',
          value: '限男',
          isSelect: false
        },
        {
          label: '限女',
          value: '限女',
          isSelect: false
        },
        {
          label: '限情侣',
          value: '限情侣',
          isSelect: false
        },
        {
          label: '可宠物',
          value: '可宠物',
          isSelect: false
        },
        {
          label: '可抽烟',
          value: '可抽烟',
          isSelect: false
        },
        {
          label: '可小孩',
          value: '可小孩',
          isSelect: false
        },
        {
          label: '租户稳定',
          value: '租户稳定',
          isSelect: false
        },
        {
          label: '一年起租',
          value: '一年起租',
          isSelect: false
        },
        {
          label: '半年起租',
          value: '半年起租',
          isSelect: false
        },
      ],
      OtherBtnList: [
        {
          label: '物业费',
          value: '物业费',
          isSelect: false
        },
        {
          label: '垃圾费',
          value: '垃圾费',
          isSelect: false
        },
        {
          label: '水电费',
          value: '水电费',
          isSelect: false
        },
        {
          label: '清洁费',
          value: '清洁费',
          isSelect: false
        },
        {
          label: '宽带费',
          value: '宽带费',
          isSelect: false
        },
        {
          label: '燃气费',
          value: '燃气费',
          isSelect: false
        },
        {
          label: '有线电视费',
          value: '有线电视费',
          isSelect: false
        },
        {
          label: '暖气费',
          value: '暖气费',
          isSelect: false
        },
        {
          label: '其他费',
          value: '其他费',
          isSelect: false
        }
      ],
      priceAllTable: {
        Toward: 1,
        Deposit: '',
        RentMoeny: '',
        // 押几
        PledgeNumber: 1,
        // 付几
        PayNumber: 3,
        // 押金
        Pledge: ''
      }
      ,
      HouseInfo: {
        EnterType: 1,
        Location: '',
        parking: 0,
        HouseType: 1,
        renovation: 3,
        HouseName: '',
        UnitNumber: '',
        RoomNumber: '',
        HouseArea: '',
        RoomCount: 1,
        HallCount: 0,
        ToiletCount: 0,
        TotalFloor: '',
        InFloor: '',
        Immobilisations: 0,
        ContractRemark: '',
        IsElevator: 1,
      },
      ImageUpload: [
        {
          RoomName: '公共',
          ImgList: []
        }
      ],
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null
    }
  }

  componentWillMount() {
    // this.fetchData()
    this.state.HouseInfo.HouseName = this.props.navigation.state.params.HouseName
    // this.setState({
    //   HouseInfo: this.state.HouseInfo
    // })
    houseInfoListByID({
      HouseKey: this.props.navigation.state.params.HouseKey
    }).then(response => {
      this.initPageData(response.Data)
    }).catch(() => {
      this.setState({
        isShowModal: false
      })
    })
    this.initEnumData()
  }

  componentDidMount() {

  }

  initEnumData() {
    this.EnumData.ForwardType = [
      {
        label: '免租前置先付',
        value: 1
      },
      {
        label: '免租前置分两年',
        value: 2
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
    this.EnumData.PayTimeType = [
      {
        label: '提前几天支付租金',
        value: 0
      },
      {
        label: '固定几号支付租金（当月）',
        value: 1
      },
      {
        label: '固定几号支付租金（提前一个月）',
        value: 2
      },
      {
        label: '固定几号支付租金（延后一个月）',
        value: 3
      }
    ]
    this.EnumData.EnterType = [
      {
        label: '整租',
        value: 1
      },
      {
        label: '合租',
        value: 2
      }
    ]
    this.EnumData.RoomType = [
      {
        label: '主卧',
        value: 1
      },
      {
        label: '次卧',
        value: 2
      },
      {
        label: '主卧带独卫',
        value: 3
      },
      {
        label: '客厅隔断',
        value: 4
      },
      {
        label: '明隔',
        value: 5
      },
      {
        label: '小卧',
        value: 6
      }
    ]
    this.EnumData.IsElevator = [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]
    this.EnumData.parking = [
      {
        label: '否',
        value: 0
      },
      {
        label: '是',
        value: 1
      }
    ]
    this.EnumData.CountNumNoZero = [
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
      },
      {
        label: '4',
        value: 4
      },
      {
        label: '5',
        value: 5
      },
      {
        label: '6',
        value: 6
      },
      {
        label: '7',
        value: 7
      },
      {
        label: '8',
        value: 8
      },
      {
        label: '9',
        value: 9
      },
      {
        label: '10',
        value: 10
      },
      {
        label: '11',
        value: 11
      },
      {
        label: '12',
        value: 12
      }
    ]
    this.EnumData.CountNum = (() => {
      var arr = []
      for (let i = 0; i <= 26; i++) {
        arr.push({
          label: `${i}`,
          value: i
        })
      }
      return arr
    })()
    this.EnumData.Toward = [
      {
        label: '东',
        value: 1,
      },
      {
        label: '南',
        value: 2
      },
      {
        label: '西',
        value: 3

      },
      {
        label: '北',
        value: 4
      },
      {
        label: '东南',
        value: 5
      },
      {
        label: '东北',
        value: 6
      },
      {
        label: '西南',
        value: 7
      },
      {
        label: '西北',
        value: 8
      }
    ]
    this.EnumData.renovation = [
      {
        label: '毛坯',
        value: 1
      },
      {
        label: '简单',
        value: 2
      },
      {
        label: '普通',
        value: 3
      },
      {
        label: '精装修',
        value: 4
      },
      {
        label: '豪华',
        value: 5
      }
    ]
    this.EnumData.HouseType = [
      {
        value: 1,
        label: '住宅'
      },
      {
        value: 2,
        label: '公寓'
      },
      {
        value: 3,
        label: '别墅'
      },
      {
        value: 4,
        label: '老公房'
      },
      {
        value: 5,
        label: '洋房'
      },
      {
        value: 6,
        label: '四合院'
      }
    ]
  }

  initPageData(data) {
    if(data.EnterType==='3'&&data.HavaTenContract){
      Alert.alert(
          '提示',
          '该房源为整合组房源并且存在租客合同，若要修改信息请前往"电脑版"修改',
          [
            {
              text: '我知道了',
              onPress: () => {
                this.props.navigation.goBack()
              }
            }
          ],
          {cancelable: false}
      )
      return
    }
    // this.state.allKeyID = data.priceAllTable.KeyID
    this.state.KeyID = !data.Rh.KeyID ? 0 : data.Rh.KeyID
    this.state.HavaTenContract = data.HavaTenContract
    var newPickerData = []
    if (data.RoomCount === 0) {
      data.RoomCount = 1
    }
    for (let i = data.RoomCount; i <= 26; i++) {
      newPickerData.push({
        label: `${i}`,
        value: i
      })
    }
    if (data.EnterType !== '0') {
      // 出租方式
      this.state.HouseInfo.EnterType = data.EnterType === '3' ? 2 : Number(data.EnterType)
      this.state.HouseInfo.HouseName = data.HouseName
      this.state.HouseInfo.Location = data.Location
      this.state.HouseInfo.parking = data.parking
      this.state.HouseInfo.renovation = data.renovation
      // 房源类型
      this.state.HouseInfo.HouseType = data.HouseType
      // 几室
      this.state.HouseInfo.RoomCount = data.RoomCount
      // 几厅
      this.state.HouseInfo.HallCount = data.HallCount
      // 几卫
      this.state.HouseInfo.ToiletCount = data.ToiletCount
      // 总楼层数
      this.state.HouseInfo.TotalFloor = String(data.TotalFloor)
      // 所在楼层
      this.state.HouseInfo.InFloor = String(data.InFloor)
      // 固定资产原值
      this.state.HouseInfo.Immobilisations = data.Immobilisations
      // 是否电梯房
      this.state.HouseInfo.IsElevator = data.IsElevator
      // 面积
      this.state.HouseInfo.HouseArea = String(data.HouseArea)
      // 整租对象
      this.state.priceAllTable = (() => {
        data.Rh.Deposit = String(data.Rh.Deposit)
        data.Rh.RentMoeny = String(data.Rh.RentMoeny)
        data.Rh.Pledge = String(data.Rh.Pledge)
        return data.Rh
      })()
      // 合租对象
      this.state.pricePartTable = (() => {
        data.flatmate.forEach(ele => {
          ele.RoomArea = String(ele.RoomArea)
          ele.Deposit = String(ele.Deposit)
          ele.RentMoeny = String(ele.RentMoeny)
          ele.Pledge = String(ele.Pledge)
        })
        return data.flatmate
      })()
      // 图片
      // 其他费用
      this.state.OtherBtnList.forEach(ele => {
        data.costList.forEach(item => {
          if (ele.value === item) {
            ele.isSelect = true
          }
        })
      })
      // 个性标签
      this.state.BadgeList.forEach(ele => {
        data.label.forEach(item => {
          if (ele.value === item) {
            ele.isSelect = true
          }
        })
      })
      this.state.ImageUpload = data.PicSum
      // 房源描述
      this.state.HouseDesc = data.HouseDesc
      this.setState({
        HouseInfo: this.state.HouseInfo,
        priceAllTable: this.state.priceAllTable,
        pricePartTable: this.state.pricePartTable,
        OtherBtnList: this.state.OtherBtnList,
        BadgeList: this.state.BadgeList,
        ImageUpload: this.state.ImageUpload,
        HouseDesc: this.state.HouseDesc,
        KeyID: this.state.KeyID,
        isShowModal: false,
        CountNumNoZero: newPickerData
      })
    } else {
      this.state.HouseInfo.Location = data.Location
      this.setState({
        HouseInfo: this.state.HouseInfo,
        isShowModal: false,
        CountNumNoZero: newPickerData
      })
    }
  }

  stepChange = step => {
    this.currentIndex = step - 1
    // console.log(this.currentIndex)
    setTimeout(() => {
      this.setState({
        currentIndex: step - 1
      })
      this.changeBtnOptions()
    }, 10)
    if (step === 2) {
      // this.currentIndex = 2
    }
  }

  next = () => {
    // this.refSteps.nextStep()
    console.log(this.currentIndex)
    switch (this.currentIndex) {
      case 0:
        const validationResults0 = GiftedFormManager.validate('CompleteForm0')
        const values0 = GiftedFormManager.getValues('CompleteForm0')
        // this.refSteps.nextStep()
        if (!validateNumber(values0.TotalFloor)) {
          Toast.show('总楼层必须为数字', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return false
        }
        if (!validateNumber(values0.InFloor)) {
          Toast.show('所在楼层必须为数字', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return false
        }
        if (!validateNumber(values0.Immobilisations)) {
          Toast.show('固定资产原值必须为数字', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return false
        }
        if (!validateNumber(values0.HouseArea)) {
          Toast.show('建筑面积必须为数字', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return false
        }
        if (Number(values0.InFloor) > Number(values0.TotalFloor)) {
          Toast.show('所在楼层不能大于总楼层数', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return false
        }
        if (validationResults0.isValid) {
          const ABCList = (() => {
            var arr = []
            for (var i = 0; i < 26; i++) {
              arr.push(String.fromCharCode(97 + i))
            }
            return arr
          })()
          if (this.state.HouseInfo.EnterType === 2) {
            this.state.priceAllTable = {
              KeyID: this.state.KeyID,
              Toward: 1,
              Deposit: '',
              RentMoeny: '',
              // 押几
              PledgeNumber: 1,
              // 付几
              PayNumber: 3,
              // 押金
              Pledge: ''
            }
            if (this.state.pricePartTable.length > this.state.HouseInfo.RoomCount) {
              this.state.pricePartTable.splice(this.state.HouseInfo.RoomCount, this.state.pricePartTable.length - 1)
            } else {
              for (let i = 0; i < this.state.HouseInfo.RoomCount; i++) {
                if (!this.state.pricePartTable[i]) {
                  var pobj = {
                    RoomName: ABCList[i],
                    KeyID: 0,
                    RoomType: 1,
                    RoomArea: '',
                    Toward: 1,
                    IsRent: false,
                    Deposit: '',
                    RentMoeny: '',
                    PledgeNumber: 1,
                    PayNumber: 3,
                    Pledge: ''
                  }
                  this.state.pricePartTable[i] = pobj
                }
              }
            }
          } else {
            this.state.pricePartTable = []
          }
          this.setState({
            pricePartTable: this.state.pricePartTable,
            priceAllTable: this.state.priceAllTable,
            HouseInfo: values0
          })
          this.refSteps.nextStep()
        } else {
          const errors = GiftedFormManager.getValidationErrors(validationResults0)
          Toast.show(errors[0], {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return false
        }
        break
      case 1:
        const values1 = GiftedFormManager.getValues('CompleteForm1')
        const validationResults1 = GiftedFormManager.validate('CompleteForm1')
        // 表单验证
        var isComplete = true
        if (this.state.HouseInfo.EnterType === 1) {
          if (validationResults1.isValid) {
            values1.KeyID = this.state.KeyID
            this.setState({
              priceAllTable: values1
            })
            // this.refSteps.nextStep()
          } else {
            const errors1 = GiftedFormManager.getValidationErrors(validationResults1)
            Toast.show(errors1[0], {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            isComplete = false
          }
        } else if (this.state.HouseInfo.EnterType === 2) {
          const toastMsg = function (msg) {
            Toast.show(msg, {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
          }
          for (let i = 0; i <= this.state.pricePartTable.length - 1; i++) {
            if (!validateNumber(this.state.pricePartTable[i].RoomArea)) {
              toastMsg('房间面积必须为数字')
              isComplete = false
              break
            } else if (Number(this.state.pricePartTable[i].RoomArea) === 0) {
              toastMsg('房间面积不能为0')
              isComplete = false
              break
            } else if (!this.state.pricePartTable[i].RoomArea && Number(this.state.pricePartTable.RoomArea !== 0)) {
              toastMsg('房间面积不能为空')
              isComplete = false
              break
            } else if (!this.state.pricePartTable[i].Deposit && this.state.pricePartTable[i].Deposit !== '0') {
              toastMsg('定金不能为空')
              isComplete = false
              break
            } else if (!validateNumber(this.state.pricePartTable[i].Deposit)) {
              toastMsg('定金必须为数字')
              isComplete = false
              break
            } else if (!this.state.pricePartTable[i].RentMoeny && this.state.pricePartTable[i].RentMoeny !== '0') {
              toastMsg('租金不能为空')
              isComplete = false
              break
            } else if (!validateNumber(this.state.pricePartTable[i].RentMoeny)) {
              toastMsg('租金必须为数字')
              isComplete = false
              break
            } else if (!this.state.pricePartTable[i].Pledge && this.state.pricePartTable[i].Pledge !== '0') {
              toastMsg('押金不能为空')
              isComplete = false
              break
            } else if (!validateNumber(this.state.pricePartTable[i].Pledge)) {
              toastMsg('押金必须为数字')
              isComplete = false
              break
            }
          }
        }
        if (isComplete) {
          // 处理图片
          if (this.state.HouseInfo.EnterType === 1) {
            this.state.ImageUpload.splice(1, this.state.ImageUpload.length - 1)
          } else {
            if (this.state.pricePartTable.length < this.state.ImageUpload.length - 1) {
              this.state.ImageUpload.splice(this.state.pricePartTable.length + 1, this.state.ImageUpload.length - 1)
            } else {
              if (this.state.pricePartTable.length > 0) {
                this.state.pricePartTable.forEach((ele, index) => {
                  if (!this.state.ImageUpload[index + 1]) {
                    this.state.ImageUpload.push({
                      RoomName: ele.RoomName,
                      ImgList: []
                    })
                  }
                })
              }
            }
          }
          this.setState({
            ImageUpload: this.state.ImageUpload
          })
          this.refSteps.nextStep()
        } else {
          return false
        }
    }
  }
  prev = () => {
    this.refSteps.prevStep()
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
    } else if (this.state.currentIndex === 2 && this.props.navigation.state.params.Badge === 'edit') {
      btns = [
        {
          label: '上一步',
          value: 'Prev'
        },
        {
          label: '保存',
          value: 'Save'
        },
        {
          label: '提交',
          value: 'Submit'
        }
      ]
    } else if (this.state.currentIndex === 2) {
      btns = [
        {
          label: '上一步',
          value: 'Prev'
        },
        {
          label: '保存',
          value: 'Submit'
        }
      ]
    }
    this.setState({
      btnOptions: btns
    })
  }

  render() {
    // const nowStep = this.currentIndex
    // console.log(nowStep)
    return (
        <View style={styles.owner_content}>
          <FullModal visible={this.state.isShowModal}></FullModal>
          <Header leftClick={() => {
            this.handleBack()
          }} title={this.headerTitle}/>
          <StepsBox list={this.stepList} navigation={this.props.navigation} viewList={[
            this.getStep1View(),
            this.getStep2View(),
            this.getStep3View()
          ]} handleChange={this.stepChange} ref={(refSteps) => {
            this.refSteps = refSteps
          }}/>
          <View>
            <ButtonGroup
                options={this.state.btnOptions}
                handleSaveClick={this.saveForm.bind(this)}
                handleSubmitClick={this.submitForm.bind(this)}
                handlePrevClick={this.prev}
                handleNextClick={this.next}
            />
          </View>
        </View>
    )
  }

  getStep1View() {
    const {HouseInfo} = this.state
    const OtherBtnList = this.state.OtherBtnList.map((ele, index) => (
        <TouchableOpacity style={[styles.Other_program_btn, ele.isSelect ? styles.Other_program_btn_select : '']}
                          key={index} onPress={this.changeOherList.bind(this, index, ele.isSelect)}>
          <Text
              style={[styles.Other_program_btn_text, ele.isSelect ? styles.Other_program_btn_text_select : '']}>{ele.label}</Text>
        </TouchableOpacity>
    ))
    return (
        <GiftedForm
            formName='CompleteForm0'
            clearOnClose={false}
            formStyles={styles.form_style}
        >
          <GiftedForm.NoticeWidget title={`出租方式`}/>
          <GiftedForm.PickerWidget
              name='EnterType'
              title='出租方式'
              disabled={this.state.HavaTenContract}
              data={this.EnumData.EnterType}
              value={HouseInfo.EnterType}
              onPickerConfirm={(val) => {
                this.changeEnterType(val)
              }}
          />
          <GiftedForm.NoticeWidget title={`门牌信息`}/>
          <GiftedForm.TextInputWidget
              name='HouseName'
              title='房源名称'
              keyboardType={this.numberPad}
              maxLength={20}
              editable={false}
              value={HouseInfo.HouseName}
          />
          <GiftedForm.TextInputWidget
              name='Location'
              title='详细地址'
              keyboardType={this.numberPad}
              maxLength={22}
              value={HouseInfo.Location}
          />
          <GiftedForm.PickerWidget
              name='HouseType'
              title='房屋类型'
              data={this.EnumData.HouseType}
              value={HouseInfo.HouseType}
          />
          <GiftedForm.PickerWidget
              name='renovation'
              title='装修'
              data={this.EnumData.renovation}
              value={HouseInfo.renovation}
          />
          <GiftedForm.PickerWidget
              name='parking'
              title='是否有车位'
              data={this.EnumData.parking}
              value={HouseInfo.parking}
          />
          <GiftedForm.PickerWidget
              name='RoomCount'
              title='几室'
              onPickerConfirm={(val) => {
                this.changeRoomCount(val)
              }}
              data={this.state.CountNumNoZero.length === 0 ? [{label: '1', value: 1}] : this.state.CountNumNoZero}
              value={HouseInfo.RoomCount}
          />
          <GiftedForm.PickerWidget
              name='HallCount'
              title='几厅'
              data={this.EnumData.CountNum}
              value={HouseInfo.HallCount}
          />
          <GiftedForm.PickerWidget
              name='ToiletCount'
              title='几卫'
              data={this.EnumData.CountNum}
              value={HouseInfo.ToiletCount}
          />
          <GiftedForm.TextInputWidget
              name='TotalFloor'
              title='总楼层数'
              required={false}
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.TotalFloor}
          />
          <GiftedForm.TextInputWidget
              name='InFloor'
              title='所在楼层'
              required={false}
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.InFloor}
          />
          <GiftedForm.PickerWidget
              name='IsElevator'
              title='是否电梯房'
              data={this.EnumData.IsElevator}
              value={HouseInfo.IsElevator}
          />
          <GiftedForm.TextInputWidget
              name='HouseArea'
              title='建筑面积'
              keyboardType={this.numberPad}
              maxLength={10}
              value={HouseInfo.HouseArea}
          />
          <GiftedForm.TextInputWidget
              name='Immobilisations'
              title='固定资产原值'
              keyboardType={this.numberPad}
              maxLength={12}
              value={HouseInfo.Immobilisations + ''}
          />
          <GiftedForm.NoticeWidget title={`其他费用项目`}/>
          <View style={styles.Other_program}>
            {OtherBtnList}
          </View>
        </GiftedForm>
    )
  }

  getStep2View() {
    const {priceAllTable, pricePartTable} = this.state
    const partList = this.state.pricePartTable.map((ele, index) =>
        <View style={{marginBottom: 20}} key={index}>
          <GiftedForm.TextInputWidget
              name='RoomName'
              title='房间名称'
              keyboardType={this.numberPad}
              maxLength={10}
              editable={false}
              value={pricePartTable[index].RoomName}
          />
          <GiftedForm.PickerWidget
              name='RoomType'
              title='房间类型'
              data={this.EnumData.RoomType}
              value={pricePartTable[index].RoomType}
              onPickerConfirm={(val) => {
                this.changeRoomType(val, index)
              }}
          />
          <GiftedForm.PickerWidget
              name='Toward'
              title='朝向'
              data={this.EnumData.Toward}
              value={pricePartTable[index].Toward}
              onPickerConfirm={(val) => {
                this.changeToward(val, index)
              }}
          />
          <GiftedForm.TextInputWidget
              name='RoomArea'
              title='房间面积'
              keyboardType={this.numberPad}
              maxLength={10}
              value={pricePartTable[index].RoomArea}
              onChangeText={(val) => {
                this.changeRoomArea(val, index)
              }}
          />
          <GiftedForm.TextInputWidget
              name='Deposit'
              title='定金(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={pricePartTable[index].Deposit}
              onChangeText={(val) => {
                this.changeDeposit(val, index)
              }}
          />
          <GiftedForm.TextInputWidget
              name='RentMoeny'
              title='租金(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={pricePartTable[index].RentMoeny}
              onChangeText={(val) => {
                this.changeRentMoeny(val, index)
              }}
          />
          <GiftedForm.PickerWidget
              name='PledgeNumber'
              title='押'
              data={this.EnumData.CountNum}
              value={pricePartTable[index].PledgeNumber}
              onPickerConfirm={(val) => {
                this.changePledgeNumber(val, index)
              }}
          />
          <GiftedForm.PickerWidget
              name='PayNumber'
              title='付'
              data={this.EnumData.CountNum}
              value={pricePartTable[index].PayNumber}
              onPickerConfirm={(val) => {
                this.changePayNumber(val, index)
              }}
          />
          <GiftedForm.TextInputWidget
              name='Pledge'
              title='押金'
              keyboardType={this.numberPad}
              maxLength={10}
              value={pricePartTable[index].Pledge}
              onChangeText={(val) => {
                this.changePledge(val, index)
              }}
          />
        </View>
    )
    const allType = (
        <GiftedForm
            formName='CompleteForm1'
            clearOnClose={false}
            formStyles={styles.form_style}
        >
          <GiftedForm.NoticeWidget title={`整租`}/>
          <GiftedForm.PickerWidget
              name='Toward'
              title='朝向'
              data={this.EnumData.Toward}
              value={priceAllTable.Toward}
          />
          <GiftedForm.TextInputWidget
              name='Deposit'
              title='定金(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={priceAllTable.Deposit}
          />
          <GiftedForm.TextInputWidget
              name='RentMoeny'
              title='租金(元)'
              keyboardType={this.numberPad}
              maxLength={10}
              value={priceAllTable.RentMoeny}
          />
          <GiftedForm.PickerWidget
              name='PledgeNumber'
              title='押'
              data={this.EnumData.CountNum}
              value={priceAllTable.PledgeNumber}
          />
          <GiftedForm.PickerWidget
              name='PayNumber'
              title='付'
              data={this.EnumData.CountNum}
              value={priceAllTable.PayNumber}
          />
          <GiftedForm.TextInputWidget
              name='Pledge'
              title='押金'
              keyboardType={this.numberPad}
              maxLength={10}
              value={priceAllTable.Pledge}
          />
        </GiftedForm>
    )
    const partType = (
        <GiftedForm
            formStyles={styles.form_style}
        >
          <GiftedForm.NoticeWidget title={`合租`}/>
          {partList}
        </GiftedForm>
    )
    const resultType = this.state.HouseInfo.EnterType === 1 ? allType : partType
    return (
        resultType
    )
  }

  getStep3View() {
    // const { HouseInfo } = this.state
    const imgList = this.state.ImageUpload.map((ele, index) => (
        <View style={{marginBottom: 20}} key={index}>
          <GiftedForm.NoticeWidget title={ele.RoomName} required/>
          <UploadFile busType={1} list={this.state.ImageUpload[index].ImgList} type={`CompleteHouse`}
                      onChange={(data) => this.onUploadFileChange(data, index)}/>
        </View>
    ))
    const BadgeList = this.state.BadgeList.map((ele, index) => (
        <TouchableOpacity style={[styles.Badge_program_btn, ele.isSelect ? styles.Other_program_btn_select : '']}
                          key={index} onPress={this.changeBadgeList.bind(this, index, ele.isSelect)}>
          <Text
              style={[styles.Other_program_btn_text, ele.isSelect ? styles.Other_program_btn_text_select : '']}>{ele.label}</Text>
        </TouchableOpacity>
    ))
    return (
        <GiftedForm
            formName='ruleForm2'
            formStyles={styles.form_style}
        >
          <GiftedForm.NoticeWidget title={`上传房源图片`} required/>
          {/* <UploadFile list={this.state.ImageUpload} type={`EditOwnerContract`} onChange={(data) => this.onUploadFileChange(data)}></UploadFile> */}
          {imgList}
          <GiftedForm.NoticeWidget title={`备注信息`}/>
          <GiftedForm.TextAreaWidget
              name='HouseDesc'
              required={false}
              placeholder='请输入备注信息'
              maxLength={100}
              value={this.state.HouseDesc}
              onChangeText={(val) => {
                this.changeHouseDesc(val)
              }}
          />
          <GiftedForm.NoticeWidget title={`个性标签`}/>
          <View style={styles.Badge_program}>
            {BadgeList}
          </View>
        </GiftedForm>
    )
  }

  fetchData() {
    this.setState({
      detailLoading: true
    })
    AppGetContractOwnerDetail({
      ownerID: this.query.KeyID || 0,
      type: 1
    }).then(({Data}) => {
      this.setState({
        detailLoading: false
      })
    })
  }

  changeOherList(index, isSelect) {
    this.state.OtherBtnList[index].isSelect = !isSelect
    this.setState({
      OtherBtnList: this.state.OtherBtnList
    })
  }

  changeBadgeList(index, isSelect) {
    this.state.BadgeList[index].isSelect = !isSelect
    this.setState({
      BadgeList: this.state.BadgeList
    })
  }

  changeHouseDesc(val) {
    this.setState({
      HouseDesc: val
    })
  }

  changeEnterType(val) {
    this.setState({
      HouseInfo: {...this.state.HouseInfo, EnterType: val}
    })
  }

  changeRoomCount(val) {
    this.setState({
      HouseInfo: {...this.state.HouseInfo, RoomCount: val}
    })
  }

  changeRoomArea(val, index) {
    this.state.pricePartTable[index].RoomArea = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changeDeposit(val, index) {
    this.state.pricePartTable[index].Deposit = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changeRoomArea(val, index) {
    this.state.pricePartTable[index].RoomArea = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changeRentMoeny(val, index) {
    this.state.pricePartTable[index].RentMoeny = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changePledge(val, index) {
    this.state.pricePartTable[index].Pledge = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changeRoomType(val, index) {
    this.state.pricePartTable[index].RoomType = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changeToward(val, index) {
    this.state.pricePartTable[index].Toward = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changePledgeNumber(val, index) {
    this.state.pricePartTable[index].PledgeNumber = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  changePayNumber(val, index) {
    this.state.pricePartTable[index].PayNumber = val
    this.setState({
      pricePartTable: this.state.pricePartTable
    })
  }

  onUploadFileChange(data, index) {
    this.state.ImageUpload[index].ImgList = data
    this.setState({
      ImageUpload: this.state.ImageUpload
    })
  }

  saveForm() {
    if(!this.validateImg()) return
    var saveType = ''
    const typeLink = this.props.navigation.state.params.Badge
    if (typeLink === 'ToAudit') {
      saveType = '审核'
    } else if (typeLink === 'edit') {
      saveType = '完善'
    } else {
      saveType = '修改'
    }
    this.setState({
      isShowModal: true
    })
    perfectingHousingEditApp({
      HouseKey: !this.props.navigation.state.params.HouseKey ? '' : this.props.navigation.state.params.HouseKey,
      // 出租方式
      EnterType: String(this.state.HouseInfo.EnterType),
      HouseName: this.state.HouseInfo.HouseName,
      Location: this.state.HouseInfo.Location,
      parking: this.state.HouseInfo.parking,
      renovation: this.state.HouseInfo.renovation,
      // 房源类型
      HouseType: this.state.HouseInfo.HouseType,
      // 几室
      RoomCount: this.state.HouseInfo.RoomCount,
      // 几厅
      HallCount: this.state.HouseInfo.HallCount,
      // 几卫
      ToiletCount: this.state.HouseInfo.ToiletCount,
      // 总楼层数
      TotalFloor: this.state.HouseInfo.TotalFloor,
      // 所在楼层
      InFloor: this.state.HouseInfo.InFloor,
      // 固定资产原值
      Immobilisations: this.state.HouseInfo.Immobilisations,
      // 是否电梯房
      IsElevator: this.state.HouseInfo.IsElevator,
      // 面积
      HouseArea: this.state.HouseInfo.HouseArea,
      // 整租对象
      Rh: this.state.HouseInfo.EnterType !== 2 ? this.state.priceAllTable : {},
      // 合租对象
      flatmate: this.state.pricePartTable,
      // 图片
      // 其他费用
      costList: (() => {
        var resArr = []
        this.state.OtherBtnList.forEach(ele => {
          if (ele.isSelect) {
            resArr.push(ele.value)
          }
        })
        return resArr
      })(),
      // 个性标签
      label: (() => {
        var resArr = []
        this.state.BadgeList.forEach(ele => {
          if (ele.isSelect) {
            resArr.push(ele.value)
          }
        })
        return resArr
      })(),
      PicSum: this.state.ImageUpload,
      // 房源描述
      HouseDesc: this.state.HouseDesc,
      saveType: saveType,
      // 提交状态
      SubmitState: '保存'
    }).then(response => {
      Toast.show('保存成功', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      this.setState({
        isShowModal: false
      })
      this.props.navigation.navigate(this.query.path,{
        isRefresh: true
      })
    }).catch(() => {
      this.setState({
        isShowModal: false
      })
      console.log('失败')
    })
  }

  submitForm() {
    if(!this.validateImg()) return
    this.setState({
      isShowModal: true
    })
    if (this.props.navigation.state.params.Badge === 'edit') {
      perfectingHousingEditApp({
        HouseKey: !this.props.navigation.state.params.HouseKey ? '' : this.props.navigation.state.params.HouseKey,
        // 出租方式
        EnterType: String(this.state.HouseInfo.EnterType),
        HouseName: this.state.HouseInfo.HouseName,
        Location: this.state.HouseInfo.Location,
        parking: this.state.HouseInfo.parking,
        renovation: this.state.HouseInfo.renovation,
        // 房源类型
        HouseType: this.state.HouseInfo.HouseType,
        // 几室
        RoomCount: this.state.HouseInfo.RoomCount,
        // 几厅
        HallCount: this.state.HouseInfo.HallCount,
        // 几卫
        ToiletCount: this.state.HouseInfo.ToiletCount,
        // 总楼层数
        TotalFloor: this.state.HouseInfo.TotalFloor,
        // 所在楼层
        InFloor: this.state.HouseInfo.InFloor,
        // 固定资产原值
        Immobilisations: this.state.HouseInfo.Immobilisations,
        // 是否电梯房
        IsElevator: this.state.HouseInfo.IsElevator,
        // 面积
        HouseArea: this.state.HouseInfo.HouseArea,
        // 整租对象
        Rh: this.state.HouseInfo.EnterType !== 2 ? this.state.priceAllTable : {},
        // 合租对象
        flatmate: this.state.pricePartTable,
        // 图片
        // 其他费用
        costList: (() => {
          var resArr = []
          this.state.OtherBtnList.forEach(ele => {
            if (ele.isSelect) {
              resArr.push(ele.value)
            }
          })
          return resArr
        })(),
        // 个性标签
        label: (() => {
          var resArr = []
          this.state.BadgeList.forEach(ele => {
            if (ele.isSelect) {
              resArr.push(ele.value)
            }
          })
          return resArr
        })(),
        PicSum: this.state.ImageUpload,
        // 房源描述
        HouseDesc: this.state.HouseDesc,
        // 提交状态
        SubmitState: '提交'
      }).then(response => {
        Toast.show('提交成功', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        this.setState({
          isShowModal: false
        })
        // 修改个人房源列表中数据的状态
        this.props.navigation.navigate(this.query.path,{
          isRefresh: true
        })
      }).catch(() => {
        this.setState({
          isShowModal: false
        })
        console.log('失败')
      })
    } else {
      this.saveForm()
    }
  }

  validateImg() {
    let flag = false
    this.state.ImageUpload.forEach(x => {
      if (x.ImgList.length === 0) {
        flag = true
      }
    })
    if (flag) {
      Toast.show('公共区域和房间图片都必须上传才能提交', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return false
    }
    return true
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
}

const mapToProps = state => ({AgentMyHouseList: state.list['AgentMyHouseList'] || []})
export default connect(mapToProps)(CompleteHouse)
