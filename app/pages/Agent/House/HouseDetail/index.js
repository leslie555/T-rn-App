import React, {Component} from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {CommonColor, Container, DisplayStyle} from '../../../../styles/commonStyles';
import IconFont from "../../../../utils/IconFont";
import Swiper from 'react-native-swiper';
import Picker from 'react-native-picker';
import style from './style';
import Placeholder from 'rn-placeholder';
import Toast from 'react-native-root-toast';
import Spinner from 'react-native-spinkit';
import {addEnshrine, delEnshrine, selectMyHouseDetail, selectShareHouseDetail} from '../../../../api/house'
import {getImgUrl, getThumbImgUrl} from '../../../../utils/imgUnit/index'
import {ButtonGroup, Header, ImageViewer, Share} from '../../../../components'
import {webpageUrl} from '../../../../config/index'
import {connect} from "react-redux";
import {GetHouseBadgeInfo,CancelOrderInfo} from "../../../../api/tenant";
import {dateFormat} from "../../../../utils/dateFormat";
import {updateList} from "../../../../redux/actions/list";
import {getEnumDesByValue} from "../../../../utils/enumData";

const {width, height} = Dimensions.get('window');

class ShareHouseDetail extends Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {}
    this.state = {
      overHidden: true,
      isChange: true,
      isShowShadow: false,
      isReady: false,
      visible: false,
      isDisabled: true,
      HouseInfoData: [],
      CurRoomIndex: 0,
      color: 'rgb(255,0, 0)',
      label: '1222',
      isOpen: false,
      flag: false,
      changing: false,
      HouseNameList: [],
      Emp: [],
      collectSwitch: true,
      // 设备
      GoodsList: [
        {
          icon: 'refrigerator',
          name: '冰箱',
          isExist: false
        },
        {
          icon: 'ranqizao',
          name: '燃气灶',
          isExist: false
        },
        {
          icon: 'shafa',
          name: '沙发',
          isExist: false
        },
        {
          icon: 'chuang',
          name: '床',
          isExist: false
        },
        {
          icon: 'cookerhood',
          name: '热水器',
          isExist: false
        },
        {
          icon: 'yigui',
          name: '衣柜',
          isExist: false
        },
        {
          icon: 'washer',
          name: '洗衣机',
          isExist: false
        },
        {
          icon: 'airconditioner',
          name: '空调',
          isExist: false
        },
        {
          icon: 'wifi1',
          name: 'Wifi',
          isExist: false
        },
        {
          icon: 'dianshi',
          name: '电视机',
          isExist: false
        }
      ],
      buttonGroup: []
    }
    this.enumBtnGroup = [
      {
        label: '修改',
        value: 'Edit',
        color: '#4aa8f5',
        iconName: 'xiugai-',
        style: {backgroundColor: CommonColor.color_white}
      },
/*       {
        label: '发布',
        value: 'Push',
        color: '#4aa8f5',
        iconName: 'fasong-',
        style: {backgroundColor: CommonColor.color_white}
      }, */
      {
        label: '预定',
        value: 'Order',
        color: '#4aa8f5',
        iconName: 'wodeyuding',
        style: {backgroundColor: CommonColor.color_white}
      },
      {
        label: '取消预定',
        value: 'CancelOrder',
        color: '#4aa8f5',
        iconName: 'wodeyuding',
        style: {backgroundColor: CommonColor.color_white}
      },
      {
        label: '签约',
        value: 'OrderContract',
        color: '#4aa8f5',
        iconName: 'sign',
        style: {backgroundColor: CommonColor.color_white}
      },
      {
        label: '合同',
        value: 'HouseInfo',
        color: '#4aa8f5',
        iconName: 'hetongxinxi',
        style: {backgroundColor: CommonColor.color_white}
      }
    ]
    this.toastMsg = this.toastMsg.bind(this)
    this.trimEnum = this.trimEnum.bind(this)
    this.shareRef = null
    this.viewWillFocus = this.props.navigation.addListener(
        'willFocus',
        payload => {
          if (payload.state.params && payload.state.params.isRefresh === true) {
            console.log(1)
            this.fetchData()
          }
        }
    )
  }

  componentDidMount() {
    console.log(2)
    this.fetchData()
    this.viewDidBlur = this.props.navigation.addListener(
        'willBlur',
        (obj) => {
          Picker.hide()
          this.setState({
            isShowShadow: false,
            flag: false,
            isOpen: false
          })
        }
    )
  }

  componentWillUnmount() {
    this.viewDidBlur.remove()
    this.viewWillFocus.remove()
  }

  fetchData() {
    let apiFn = selectShareHouseDetail
    if (this.query.isMine) {
      apiFn = selectMyHouseDetail
    }
    apiFn({
      HouseKey: this.props.navigation.state.params.HouseKey
    }).then(res => {
      this.state.HouseInfoData = res.Data
      this.state.Emp = res.Data[0].tub
      for (let i = 0; i <= res.Data.length - 1; i++) {
        if (res.Data[i].KeyID === this.props.navigation.state.params.HouseID) {
          this.state.CurRoomIndex = i
          break
        }
      }
      this.state.GoodsList.forEach(ele => {
        for (let i = 0; i < res.Data[0].equ.length; i++) {
          if (res.Data[0].equ[i].EquipmentName.toLowerCase().indexOf(ele.name.toLowerCase()) !== -1) {
            ele.isExist = true
            break
          }
        }
      })
      res.Data.forEach(ele => {
        let roomName = ele.RoomName === '' ? '整租' : ele.RoomName
        this.state.HouseNameList.push(roomName)
      })
      this.setState({
        buttonGroup: this.getButtons(),
        HouseInfoData: this.state.HouseInfoData,
        CurRoomIndex: this.state.CurRoomIndex,
        Emp: this.state.Emp,
        HouseNameList: this.state.HouseNameList,
        GoodsList: this.state.GoodsList,
        isReady: true,
        isDisabled: false
      })
    }).catch(() => {
      this.setState({
        isDisabled: false
      })
    })
  }

  // componentWillUnmount() {
  //   this.setState({
  //     isModal: false
  //   })
  // }
  openImageViewer(index) {
    this.setState({
      visible: true,
      index
    })
  }

  closeImageViewer() {
    this.setState({
      visible: false
    })
  }

  // methods
  callPhone(num, e) {
    Alert.alert('温馨提示', '是否联系管房人', [
      {text: '取消'},
      {text: '确认', onPress: () => Linking.openURL(`tel:${num}`)}
    ])
  }

  toastMsg(msg) {
    Toast.show(msg, {
      duration: 820,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      }
    })
  }

  // 收藏房源
  collectHouse() {
    const HouseInfoData = this.state.HouseInfoData
    const CurRoomIndex = this.state.CurRoomIndex
    if (this.state.collectSwitch) {
      this.state.collectSwitch = false
      if (HouseInfoData[CurRoomIndex].EnshrineState !== 1) {
        addEnshrine({
          HouseID: HouseInfoData[CurRoomIndex].KeyID,
        }).then(({Data}) => {
          this.state.HouseInfoData[this.state.CurRoomIndex].EnshrineID = Data
          this.state.HouseInfoData[this.state.CurRoomIndex].EnshrineState = 1
          this.setState({
            HouseInfoData: this.state.HouseInfoData
          })
          DeviceEventEmitter.emit('updateCollect', {
            type: 'add'
          })
          this.toastMsg('收藏成功')
          setTimeout(() => {
            this.state.collectSwitch = true
          }, 1000)
        })
      } else {
        Alert.alert('温馨提示', '是否取消收藏房源', [
          {text: '取消'},
          {
            text: '确认', onPress: () => {
              delEnshrine({
                KeyID: HouseInfoData[CurRoomIndex].EnshrineID
              }).then(({Data}) => {
                this.state.HouseInfoData[this.state.CurRoomIndex].EnshrineState = 2
                this.setState({
                  HouseInfoData: this.state.HouseInfoData
                })
                DeviceEventEmitter.emit('updateCollect', {
                  type: 'delete',
                  KeyID: HouseInfoData[CurRoomIndex].EnshrineID
                })
                this.toastMsg('取消成功')
              })
              setTimeout(() => {
                this.state.collectSwitch = true
              }, 1000)
            }
          }
        ])

      }
    }
  }

  changeRoom(index, disabled = false) {
    if (disabled) return
    this.state.CurRoomIndex = index
    this.setState({
      CurRoomIndex: index,
      buttonGroup: this.getButtons()
    })
  }

  closeSideMenu() {
    const isOpen = this.state.isOpen;
    const flag = this.state.flag;
    if (isOpen && flag)
      this.setState({isOpen: false, flag: false});
    else if (!isOpen && !flag) {
    } else {
      this.setState({flag: true});
    }
  }

  trimEnum(val, type) {
    if (type === 'RentType') {
      switch (val) {
        case 1:
          return '整租'
        case 2:
          return '合租'
      }
    } else if (type === 'HouseType') {
      switch (val) {
        case 1:
          return '住宅'
        case 2:
          return '公寓'
        case 3:
          return '别墅'
        case 4:
          return '老公房'
        case 5:
          return '洋房'
        case 6:
          return '四合院'
      }
    }
  }

  closeShadow() {
    Picker.hide()
    this.setState({
      isShowShadow: false
    })
  }

  goPush() {
    const item = this.state.HouseInfoData[this.state.CurRoomIndex]
    this.props.navigation.navigate('AgentHousePush', {
      houseID: item.KeyID
    })
  }

  goOrder(type = 0) {
    const item = this.state.HouseInfoData[this.state.CurRoomIndex]
    console.log(item)
    if (type === 0) {
      const sendData = {
        HouseName: item.HouseName,
        HouseID: item.KeyID,
        HouseKey: item.HouseKey,
        RentMoeny: item.RentMoeny,
        Deposit: item.Deposit
      }
      this.props.navigation.navigate('AgentAddOrder', {
        disableHouseName: true,
        path: 'AgentHouseDetail',
        houseInfo: JSON.stringify(sendData)
      })
    } else {
      // 自己添加的预定
      if(item.ord&&item.ord.IsMe===0){
        Alert.alert('温馨提示', '确定要取消该预定吗?', [
          {text: '取消'},
          {
            text: '确认',
            onPress: () => {
              this.setState({
                loading: true
              })

              CancelOrderInfo({
                orderId: item.ReservationID
              })
                  .then(({Data}) => {
                    Toast.show('取消预定成功！', {
                      duration: Toast.durations.SHORT,
                      position: Toast.positions.BOTTOM
                    })
                    GetHouseBadgeInfo({
                      HouseID: item.KeyID
                    }).then(({Data})=>{
                      // 需要修改个人房源列表中的数据
                      this.props.dispatch(
                          updateList({
                            primaryKey: 'HouseName',
                            KeyID: item.HouseName,
                            key: 'AgentMyHouseList',
                            data: {
                              Badge: Data.Badge,
                              Meg: Data.Meg
                            }
                          })
                      )
                    })
                    item.ReservationID = 0
                    this.setState({
                      buttonGroup: this.getButtons(),
                      HouseInfoData: this.state.HouseInfoData
                    })
                  })
                  .finally(err => {
                    this.setState({
                      loading: false
                    })
                  })
            }
          }
        ])
      }else{
        this.props.navigation.navigate('AgentAddOrderRemark', {
          isAgree: false,
          orderId: item.ReservationID,
          HouseID: item.KeyID,
          HouseName: item.HouseName,
          path: 'AgentHouseDetail'
        })
      }
    }
  }

  goTenant(type = 0) {
    const item = this.state.HouseInfoData[this.state.CurRoomIndex]
    // if (item.ReservationID) {
    //   this.props.navigation.navigate('AgentEditTenantContract', {OrderID: item.ReservationID})
    // } else {
      this.props.navigation.navigate('AgentEditTenantContract', {HouseID: item.KeyID})
    // }
  }

  goHouseInfo() {
    const item = this.state.HouseInfoData[this.state.CurRoomIndex]
    const sendData = {
      houseInfo: {
        houseName: item.HouseName,
        houseArea: item.HouseArea,
        location: item.Location,
        // 室
        RoomCount: item.RoomCount,
        // 厅
        HallCount: item.HallCount,
        // 卫
        ToiletCount: item.ToiletCount,
      },
      houseID: item.KeyID,
      houseKey: item.HouseKey
    }
    this.props.navigation.navigate('AgentHouseInfo', sendData)
  }

  goEdit() {
    const item = this.state.HouseInfoData[this.state.CurRoomIndex]
    this.props.navigation.navigate('AgentEditHouse', {
      HouseName: item.HouseName,
      Badge: this.query.Badge,
      HouseKey: item.HouseKey,
      path: 'AgentHouseDetail'
    })
  }

  scrollEvent(event) {
    if (this.state.isChange) {
      if (event.nativeEvent.contentOffset.y > 200) {
        console.log('大于')
        this.setState({
          isChange: false,
          overHidden: false
        })
      }
    }
    if (event.nativeEvent.contentOffset.y < 200) {
      if (!this.state.isChange) {
        console.log('小于')
        this.setState({
          isChange: true,
          overHidden: true
        })
      }
    }
  }

  getButtons() {
    const item = this.state.HouseInfoData[this.state.CurRoomIndex]
    let buttons = []
    if (!item) return []
    if (this.query.isMine) {
      if(item.HouseStatus===7){
        if (item.ReservationID) {
          buttons = ['Edit', 'Push']
        } else {
          buttons = ['Edit', 'Push']
        }
      }else{
        if (item.ReservationID) {
          if(item.OrderStatus===2){ // 预定成功不能取消
            buttons = ['Edit', 'Push', 'OrderContract', 'HouseInfo']
          }else{
            buttons = ['Edit', 'Push', 'CancelOrder', 'OrderContract', 'HouseInfo']
          }
        } else {
          buttons = ['Edit', 'Push', 'Order', 'OrderContract', 'HouseInfo']
        }
      }
    } else {
      if (item.ReservationID) {
        // buttons = ['OrderContract']
      } else {
        buttons = ['Order', 'OrderContract']
      }
    }
    return this.enumBtnGroup.filter(x => buttons.find(y => y === x.value))
  }

  // render
  render() {
    const HouseInfoData = this.state.HouseInfoData
    const CurRoomIndex = this.state.CurRoomIndex
    const HouseItem = HouseInfoData[CurRoomIndex]
    const ImgList = !HouseInfoData[CurRoomIndex] ? [{
      ImageLocation: ''
    }] : HouseInfoData[CurRoomIndex].img.length > 0 ? HouseInfoData[CurRoomIndex].img : [{
      ImageLocation: ''
    }]
    const Roomlist = this.state.HouseInfoData.map((ele, index) => {
      const disabled = (ele.ReservationID || ele.HouseStatus === 5) && !this.query.isMine
      return (
          <TouchableOpacity
              style={[style.Other_program_btn, this.state.CurRoomIndex === index ? style.Other_program_btn_select : null, disabled ? style.Other_program_btn_disabled : null]}
              key={index} onPress={this.changeRoom.bind(this, index, disabled)}>
            <Text
                style={[style.Other_program_btn_text, this.state.CurRoomIndex === index ? style.Other_program_btn_text_select : '']}>{ele.RoomName === '' ? '整租' : ele.RoomName}</Text>
          </TouchableOpacity>
      )
    })
    const EmpList = this.state.Emp.map((ele, index) => <View style={style.detail_manager_list_item} key={index}>
      <View style={style.detail_manager_name}>
        <Text style={style.detail_manager_name_text}>{ele.UserName}</Text>
      </View>
      <View style={style.detail_manager_name}>
        <Text style={style.detail_manager_name_text}>{ele.Tel}</Text>
      </View>
      <TouchableOpacity style={style.detail_manager_name} onPress={this.callPhone.bind(this, ele.Tel)}>
        <IconFont name='call' size={30} color='#389ef2'/>
      </TouchableOpacity>
    </View>)
    const IconList = this.state.GoodsList.map((ele, index) => (
      <View style={style.detail_config_list_item} key={index}>
        <View style={style.detail_config_icon}>
          <IconFont
            name={ele.icon}
            style={ele.name === '空调' ? { marginVertical : 5 } : null}
            size={ele.name === '空调' ? 20 : 30}
            color={ele.isExist ? '#FE9C11' : '#cccccc'}
          />
        </View>
        <View style={style.detail_config_icontext}>
          <Text
            style={[
              ele.isExist
                ? style.detail_config_text
                : style.detail_config_no_text
            ]}
          >
            {ele.name}
          </Text>
        </View>
      </View>
    ))
    const HouseImgList = ImgList.map((ele, index) => (
        <TouchableOpacity style={{flex: 1, height: 300}} onPress={this.openImageViewer.bind(this, index)} key={index}>
          <Image source={{uri: getThumbImgUrl(ele.ImageLocation,{w: 600})}}
                 style={{flex: 1, height: 300}} resizeMode="cover" key={index}/>
        </TouchableOpacity>
    ))
    return (
        <View style={{position: 'relative', ...Container}}>
          {/* <View style={{ flex: 1, backgroundColor: 'rgba(100, 100, 100, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator></ActivityIndicator>
        </View> */}
          <ImageViewer data={ImgList} visible={this.state.visible} index={this.state.index}
                       onClose={() => this.closeImageViewer()}/>
          <Share ref={(ref) => {
            this.shareRef = ref
          }} title={!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].HouseName}
                 description={!HouseInfoData[CurRoomIndex] ? '' : `${HouseInfoData[CurRoomIndex].RentMoeny}元  ${HouseInfoData[CurRoomIndex].RoomCount}室${HouseInfoData[CurRoomIndex].HallCount}厅/押${HouseInfoData[CurRoomIndex].PledgeNumber}付${HouseInfoData[CurRoomIndex].PayNumber}`}
                 thumbImage={getThumbImgUrl(ImgList[0].ImageLocation)}
                 webpageUrl={`${webpageUrl}House/ShareHouseDetails?HouseKey=${this.props.navigation.state.params.HouseKey}&HouseID=${HouseItem && HouseItem.KeyID}`}/>
          {this.state.isShowShadow ? <TouchableWithoutFeedback onPress={this.closeShadow.bind(this)}>
            <View style={{
              width: width,
              height: height,
              zIndex: 999,
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}/>
          </TouchableWithoutFeedback> : null}
          <Header title={`房源详情`} headerRight={<TouchableOpacity onPress={() => this.shareRef.openDialog()}>
            <IconFont name='fenxiangcopy' size={18} color='#fff'/>
          </TouchableOpacity>
          } style={{
            position: 'absolute',
            zIndex: 999,
            top: 0,
            left: 0,
            backgroundColor: this.state.overHidden ? 'rgba(0, 0, 0, .2)' : CommonColor.color_primary
          }}/>
          <ScrollView content ContainerStyle={style.scroller} onScroll={Event => this.scrollEvent(Event)}>
            {!HouseInfoData[CurRoomIndex] || this.state.changing ?
                <View style={{flex: 1, height: 300, ...DisplayStyle('row', 'center', 'center')}}>
                  <Spinner
                      isVisible={true}
                      size={60}
                      type={'ThreeBounce'}
                      color={CommonColor.color_primary}
                  />
                </View> : <Swiper
                    style={style.wrapper}
                    showsButtons={false}
                    height={300}
                    autoplay={true}
                    index={0}
                    autoplayTimeout={3}
                    activeDotColor={CommonColor.color_primary}
                >
                  {HouseImgList}
                </Swiper>}
            <View style={style.detail_content}>
              <View style={style.detail_content_title}>
                <Placeholder.Line
                    style={style.detail_content_title_box}
                    color='#eeeeee'
                    width='50%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_title_box}>
                    <Text
                        style={style.detail_content_title_text}>{!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[this.state.CurRoomIndex].HouseName}</Text>
                  </View>
                </Placeholder.Line>
                {
                  !HouseInfoData[CurRoomIndex] || this.query.isMine ? null : HouseInfoData[CurRoomIndex].EnshrineState !== 1 ? (
                      <TouchableOpacity style={style.detail_content_collect} onPress={this.collectHouse.bind(this)}>
                        {/* icon */}
                        <IconFont name='collection' size={20} color='#cccccc'></IconFont>
                      </TouchableOpacity>) : (
                      <TouchableOpacity style={style.detail_content_collect} onPress={this.collectHouse.bind(this)}>
                        {/* icon */}
                        <IconFont name='collectied' size={20} color='#F08080'></IconFont>
                      </TouchableOpacity>)
                }
              </View>
              <View style={style.detail_content_price}>
                <Placeholder.Line
                    style={style.detail_content_pricebox}
                    color='#FCB144'
                    width='20%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_pricebox}>
                    <Text
                        style={style.detail_content_price_num}>{parseInt(!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].RentMoeny)}</Text>
                    <Text style={style.detail_content_price_unit}>元/月</Text>
                  </View>
                </Placeholder.Line>
                <Placeholder.Line
                    style={style.detail_content_enterType}
                    color='#389ef2'
                    width='10%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_enterType}>
                    <Text
                        style={style.detail_content_enterType_text}>{!HouseInfoData[CurRoomIndex] ? '' : this.trimEnum(HouseInfoData[CurRoomIndex].RentType, 'RentType')}</Text>
                  </View>
                </Placeholder.Line>
                <Placeholder.Line
                    style={style.detail_content_houseType}
                    color='#389ef2'
                    width='10%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_houseType}>
                    <Text
                        style={style.detail_content_houseType_text}>{!HouseInfoData[CurRoomIndex] ? '' : this.trimEnum(HouseInfoData[CurRoomIndex].HouseType, 'HouseType')}</Text>
                  </View>
                </Placeholder.Line>
                <Placeholder.Line
                    style={style.detail_content_houseType}
                    color='#389ef2'
                    width='10%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_houseType}>
                    <Text
                        style={style.detail_content_houseType_text}>{`押${!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].PledgeNumber}付${!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].PayNumber}`}</Text>
                  </View>
                </Placeholder.Line>
              </View>
              <View style={style.detail_content_houseInfo}>
                <View style={style.detail_content_info_iconbox}>
                  {/* icon */}
                  <IconFont name='shouye' size={16} color='#cccccc'></IconFont>
                </View>
                <Placeholder.Line
                    style={style.detail_content_info_textarea}
                    color='#eeeeee'
                    width='50%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_info_textarea}>
                    <Text
                        style={style.detail_content_info_text}>{`${!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].RoomCount}室${!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].HallCount}厅`}</Text>
                    <Text style={style.detail_content_info_text}>{'/'}</Text>
                    <Text
                        style={style.detail_content_info_text}>{`建筑面积${!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].HouseArea}m2`}</Text>
                    <Text style={style.detail_content_info_text}>{'/'}</Text>
                    <Text
                        style={[style.detail_content_info_text, style.detail_content_info_rightMar]}>{`${!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].InFloor}楼`}</Text>
                    <Text
                        style={style.detail_content_info_text}>{!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].IsElevator ? '电梯' : '非电梯'}</Text>
                  </View>
                </Placeholder.Line>
              </View>
              <View style={style.detail_content_address}>
                <View style={style.detail_content_info_iconbox}>
                  {/* icon */}
                  <IconFont name='location' size={16} color='#cccccc'></IconFont>
                  {/* <Text style={style.detail_content_info_icon}>icon</Text> */}
                </View>
                <Placeholder.Line
                    style={style.detail_content_info_textarea}
                    color='#eeeeee'
                    width='50%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                  <View style={style.detail_content_info_textarea}>
                    <Text
                        style={style.detail_content_info_text}>{!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].Location}</Text>
                  </View>
                </Placeholder.Line>
              </View>
            </View>
            <View style={style.detail_room_num}>
              <View style={style.detail_room_num_left}>
                <Text style={style.detail_room_num_left_text}>选择房间</Text>
              </View>
              <View style={style.Other_program}>
                {Roomlist}
              </View>
              {/* <TouchableOpacity style={style.detail_room_num_right} onPress={this.changeRoom.bind(this)}>
              <View style={style.detail_room_num_btn}>
                <Placeholder.Line
                  color='#eeeeee'
                  width='10%'
                  textSize={16}
                  onReady={this.state.isReady}
                >
                  <Text style={style.detail_room_num_label}>{this.state.HouseNameList[this.state.CurRoomIndex]}</Text>
                </Placeholder.Line>
                <IconFont name='open' size={18} color='#cccccc'></IconFont>
              </View>
            </TouchableOpacity> */}
            </View>
            {this.query.isMine&&HouseInfoData[CurRoomIndex]&&HouseInfoData[CurRoomIndex].ord&&
              <View style={style.detail_manager}>
                <View style={style.detail_manager_title}>
                  <Text style={style.detail_manager_title_text}>预定信息</Text>
                </View>
                <View style={style.detail_order_box}>
                  <Placeholder.Line
                      color='#eeeeee'
                      width='30%'
                      textSize={16}
                      onReady={this.state.isReady}
                  >
                  </Placeholder.Line>
                  <View style={style.detail_order_line}>
                    <View style={style.detail_order_inner_box}>
                      <View style={style.detail_order_text_left}><Text style={style.detail_order_text}>姓<Text style={style.detail_order_placeholder}>占位</Text>名</Text></View>
                      <View style={style.detail_order_text_right}><Text style={style.detail_order_text}>{HouseInfoData[CurRoomIndex].ord.OrderName}</Text></View>
                    </View>
                    <View style={style.detail_order_inner_box}>
                      <View style={style.detail_order_text_left}><Text style={style.detail_order_text}>电<Text style={style.detail_order_placeholder}>占位</Text>话</Text></View>
                      <View style={style.detail_order_text_right}><Text style={style.detail_order_text}>{HouseInfoData[CurRoomIndex].ord.OrderPhone}</Text></View>
                    </View>
                  </View>
                  <View style={style.detail_order_line}>
                    <View style={style.detail_order_inner_box}>
                      <View style={style.detail_order_text_left}><Text style={style.detail_order_text}>定<Text style={style.detail_order_placeholder}>占位</Text>金</Text></View>
                      <View style={style.detail_order_text_right}><Text style={style.detail_order_text}>{HouseInfoData[CurRoomIndex].ord.OrderMoney}元</Text></View>
                    </View>
                    <View style={style.detail_order_inner_box}>
                      <View style={style.detail_order_text_left}><Text style={style.detail_order_text}>最晚签约</Text></View>
                      <View style={style.detail_order_text_right}><Text style={style.detail_order_text}>{dateFormat(HouseInfoData[CurRoomIndex].ord.LastSignDate)}</Text></View>
                    </View>
                  </View>
                  <View style={style.detail_order_line}>
                    <View style={style.detail_order_inner_box}>
                      <View style={style.detail_order_text_left}><Text style={style.detail_order_text}>约定租期</Text></View>
                      <View style={style.detail_order_text_right}><Text style={style.detail_order_text}>{dateFormat(HouseInfoData[CurRoomIndex].ord.LeaseStartTime)}至{dateFormat(HouseInfoData[CurRoomIndex].ord.LeaseEndTime)}</Text></View>
                    </View>
                  </View>
                  <View style={style.detail_order_line}>
                    <View style={style.detail_order_inner_box}>
                      <View style={style.detail_order_text_left}><Text style={style.detail_order_text}>预定状态</Text></View>
                      <View style={style.detail_order_text_right}><Text style={style.detail_order_text}>{getEnumDesByValue('OrderStatus',HouseInfoData[CurRoomIndex].ord.OrderStatus)}</Text></View>
                    </View>
                  </View>
                </View>
              </View>
            }
            <View style={style.detail_manager}>
              <View style={style.detail_manager_title}>
                <Text style={style.detail_manager_title_text}>管家</Text>
              </View>
              <View>
                <Placeholder.Line
                    color='#eeeeee'
                    width='30%'
                    textSize={16}
                    onReady={this.state.isReady}
                >
                </Placeholder.Line>
                {EmpList}
              </View>
            </View>
            <View style={style.detail_config}>
              <View style={style.detail_manager_title}>
                <Text style={style.detail_manager_title_text}>公共区域</Text>
              </View>
              <View style={style.detail_config_iconlist}>
                {IconList}
              </View>
            </View>
            <View style={style.detail_description}>
              <View style={style.detail_manager_title}>
                <Text style={style.detail_manager_title_text}>房源描述</Text>
              </View>
              <View style={style.detail_description_box}>
                <Text
                    style={style.detail_description_text}>{!HouseInfoData[CurRoomIndex] ? '' : HouseInfoData[CurRoomIndex].HouseDesc}</Text>
              </View>
            </View>
          </ScrollView>
          <ButtonGroup
              options={
                this.state.buttonGroup
              }
              hasIcon={true}
              handleEditClick={this.goEdit.bind(this)}
              handleOrderClick={this.goOrder.bind(this, 0)}
              handleCancelOrderClick={this.goOrder.bind(this, 1)}
              handlePushClick={this.goPush.bind(this)}
              handleEditContractClick={this.goTenant.bind(this, 0)}
              handleOrderContractClick={this.goTenant.bind(this, 1)}
              handleHouseInfoClick={this.goHouseInfo.bind(this)}
          />
        </View>
    )
  }
}

export default connect()(ShareHouseDetail);
