import React from 'react'
import {
  CommonColor,
  DisplayStyle,
  Container,
  DEVICE_WIDTH
} from '../../../../styles/commonStyles'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  BackHandler
} from 'react-native'
import { dateFormat, diffTime } from '../../../../utils/dateFormat'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {
  AppGetContractTenantDetail,
  tenantWithDrawByID,
  deleteTenantContractByIDs
} from '../../../../api/tenant'
import {
  AppGetContractOwnerDetail,
  DeleteOwnerContractByIDs,
  WithDrawByID
} from '../../../../api/owner'
import Placeholder from 'rn-placeholder'
import { PlaceholderText, Separator, ButtonGroup } from '../../../../components'
import { withNavigation } from 'react-navigation'
import { FullModal, Header } from '../../../../components'
import Toast from 'react-native-root-toast'
import OwnerTab from './components/OwnerTab'
import TenantTab from './components/TenantTab'
import SignUpTab from './components/SignUpTab'
import BillTab from './components/BillTab'
import BookKeeping from './components/BookKeeping'
import { connect } from 'react-redux'
import {
  setContractDetail,
  updateContractDetail
} from '../../../../redux/actions/contract'
import { updateList, deleteList } from '../../../../redux/actions/list'

const ENUMBUTTONOPT = {
  delete: {
    label: '删除',
    value: 'Delete',
    color: '#4aa8f5',
    iconName: 'delete'
  },
  revert: {
    label: '撤回',
    value: 'Revert',
    color: '#4aa8f5',
    iconName: 'retract'
  },
  checkout: {
    label: '退房',
    value: 'Checkout',
    color: '#4aa8f5',
    iconName: 'checkout'
  },
  editCheckout: {
    label: '修改退房',
    value: 'EditCheckout',
    color: '#4aa8f5',
    iconName: 'checkout'
  },
  contact: {
    label: '联系',
    value: 'Contact',
    color: '#4aa8f5',
    iconName: 'contact'
  },
  signUp: {
    label: '签字',
    value: 'SignUp',
    color: '#4aa8f5',
    iconName: 'sign'
  },
  edit: {
    label: '修改',
    value: 'Edit',
    color: '#4aa8f5',
    iconName: 'sign'
  },
  bookKeep: {
    label: '记账',
    value: 'BookKeep',
    color: '#4aa8f5',
    iconName: 'jizhang'
  },
  renew: {
    label: '续约',
    value: 'Renew',
    color: '#4aa8f5',
    iconName: 'sign'
  }
}

class ContractDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailData: {},
      isReady: false,
      RentLeaseStatus: {
        label: '',
        color: 'rgb(0,0,0)'
      },
      filteredInfo: {},
      loading: false,
      page: 0
    }
    this.KeyID = 0
    this.isOwner = false
    this.backHandler = null
    this.viewDidAppear = null
    this.willBlurSubscription = null
  }

  componentWillMount() {
    this.KeyID = this.props.navigation.getParam('id')
    this.isOwner = this.props.navigation.getParam('isOwner')
    this.isBackToList = this.props.navigation.getParam('isBackToList', false)
    this.isBackToBill = this.props.navigation.getParam('isBackToBill', false)
    this.fetchData()
    this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
      if (obj.state.params && obj.state.params.page != undefined) {
        this.setState({
          page: obj.state.params.page
        })
      }
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBack
      )
      this.state.isReady && this.filterInfo(this.props.detailData)
    })
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        console.log('removeContractDetialBackHandler')
        this.backHandler && this.backHandler.remove()
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.detailData) !==
      JSON.stringify(nextProps.detailData)
    ) {
      this.filterInfo(nextProps.detailData)
    }
  }
  componentWillUnmount() {
    this.backHandler && this.backHandler.remove()
    this.viewDidAppear && this.viewDidAppear.remove()
    this.willBlurSubscription && this.willBlurSubscription.remove()
  }

  onBack = () => {
    if (this.isBackToList) {
      this.props.navigation.navigate('AgentContractList', {
        param: {
          page: this.isOwner ? 2 : 1
        }
      })
      return true
    } else if (this.isBackToBill) {
      this.props.navigation.navigate('AgentWaitCollectBill')
      return true
    } else {
      this.props.navigation.goBack()
      return true
    }
  }
  fetchData() {
    if (this.isOwner) {
      AppGetContractOwnerDetail({
        ownerID: this.KeyID,
        type: 0
      }).then(res => {
        this.props.dispatch(setContractDetail(res.Data))
        this.filterInfo(res.Data)
      })
    } else {
      AppGetContractTenantDetail({
        tenantID: this.KeyID,
        type: 0
      }).then(res => {
        this.props.dispatch(setContractDetail(res.Data))
        this.filterInfo(res.Data)
      })
    }
  }
  getFilterStatus(status) {
    switch (status) {
      case 1:
        return {
          label: '暂存',
          color: 'rgb(255,153,0)'
        }

      case 2:
        return {
          label: '待确认',
          color: 'rgb(255,90,90)'
        }

      case 3:
        return {
          label: '签约成功',
          color: 'rgb(56,158,242)'
        }

      case 4:
        return {
          label: '已退房',
          color: 'rgb(153,153,153)'
        }
      default:
        return {}
    }
  }
  getFilteredBtn(type, status, audit) {
    // status(合同状态): 1暂存2待确认3签约成功4已退房 // audit(审核状态) 0待提交1待审核2审核通过3审核失败
    if (type === 0) {
      // 电子合同
      if (status === 1 && audit === 0) {
        return [
          ENUMBUTTONOPT.edit,
          ENUMBUTTONOPT.contact,
          ENUMBUTTONOPT.bookKeep,
          ENUMBUTTONOPT.delete
        ]
      } else if (status === 2 && audit === 0) {
        return [
          ENUMBUTTONOPT.signUp,
          ENUMBUTTONOPT.contact,
          ENUMBUTTONOPT.bookKeep,
          ENUMBUTTONOPT.revert
        ]
      } else if (status === 3 && audit === 1) {
        return [
          ENUMBUTTONOPT.contact,
          ENUMBUTTONOPT.bookKeep,
          ENUMBUTTONOPT.revert
        ]
      } else if (status === 3 && audit === 2) {
        return [
          ENUMBUTTONOPT.checkout,
          ENUMBUTTONOPT.contact,
          ENUMBUTTONOPT.bookKeep,
          ENUMBUTTONOPT.renew
        ]
      } else if (status === 3 && audit === 3) {
        return [
          ENUMBUTTONOPT.contact,
          ENUMBUTTONOPT.bookKeep,
          ENUMBUTTONOPT.revert
        ]
      } else if (status === 4 && audit === 2) {
        return [ENUMBUTTONOPT.contact]
      } else if (status === 4 && audit === 3) {
        return [ENUMBUTTONOPT.contact,ENUMBUTTONOPT.editCheckout]
      }
    } else {
      // 纸质合同
      if (status === 3) {
        if (audit === 1) {
          return [
            ENUMBUTTONOPT.contact,
            ENUMBUTTONOPT.bookKeep,
            ENUMBUTTONOPT.revert
          ]
        } else if (audit === 2) {
          return [
            ENUMBUTTONOPT.checkout,
            ENUMBUTTONOPT.contact,
            ENUMBUTTONOPT.bookKeep,
            ENUMBUTTONOPT.renew
          ]
        } else if (audit === 3) {
          return [
            ENUMBUTTONOPT.contact,
            ENUMBUTTONOPT.bookKeep,
            ENUMBUTTONOPT.revert
          ] 
        }
      } else if (status === 1) {
        return [
          ENUMBUTTONOPT.edit,
          ENUMBUTTONOPT.contact,
          ENUMBUTTONOPT.bookKeep,
          ENUMBUTTONOPT.delete
        ]
      } else if (status === 4) {
        if(audit === 3){
          return [ENUMBUTTONOPT.contact,ENUMBUTTONOPT.editCheckout]
        }else{
          return [ENUMBUTTONOPT.contact]
        }
      }
    }
  }
  filterInfo(info) {
    const isOwner = this.isOwner
    const filteredInfo = {}
    const contractKey = isOwner ? 'OwnerContract' : 'TenantContractInfo'
    const contractOperateKey = isOwner
      ? 'OwnerContractOperate'
      : 'TenantContractOperate'
    const contract = info[contractKey]
    const contractOperate = info[contractOperateKey]
    // 业主或租客信息
    if (isOwner) {
      filteredInfo.IDCard = contract.OwnerIDCard
      filteredInfo.Name = contract.OwnerName
      filteredInfo.Phone = contract.OwnerPhone
    } else {
      filteredInfo.IDCard = contract.TenantCard
      filteredInfo.Name = contract.TenantName
      filteredInfo.Phone = contract.TenantPhone
    }
    // 房源名称
    filteredInfo.HouseName = info.HouseInfo.HouseName
    // 拿房价或租金
    filteredInfo.ContractInfoRent = isOwner
      ? ['拿房价', contract.InitialPrice]
      : ['租金', contract.HouseRent] || []
    // 合同签约状态
    filteredInfo.ContractLeaseStatus = isOwner
      ? contractOperate.LeaseStatus
      : contractOperate.RentLeaseStatus
    // 托管时间或租期
    const sTime = isOwner ? contract.HostStartTime : contract.StartTime
    const eTime = isOwner ? contract.HostEndTime : contract.EndTime
    filteredInfo.HostTime = isOwner
      ? [
          '托管时间',
          `${dateFormat(sTime)} 至 ${dateFormat(eTime)} (${diffTime(
            sTime,
            eTime
          )})`
        ]
      : [
          '租期',
          `${dateFormat(sTime)} 至 ${dateFormat(eTime)} (${diffTime(
            sTime,
            eTime
          )})`
        ]
    filteredInfo.PaperType = contract.PaperType
    filteredInfo.AuditStatus = contractOperate.AuditStatus
    // 根据审核状态改变操作按钮
    filteredInfo.btnOptions = this.getFilteredBtn(
      filteredInfo.PaperType,
      filteredInfo.ContractLeaseStatus,
      filteredInfo.AuditStatus
    )
    filteredInfo.statusText = this.getFilterStatus(
      filteredInfo.ContractLeaseStatus
    )
    this.setState({
      isReady: true,
      filteredInfo
    })
  }

  handleCheckoutClick = () => {
    // 点击退房的回调
    const houseInfo = this.props.detailData.HouseInfo
    this.props.navigation.navigate('AgentCheckOutContract', {
      contractID: this.KeyID,
      editType: 0,
      type: this.isOwner ? 0 : 1,
      houseInfo: {
        HouseName: houseInfo.HouseName,
        HouseKey: houseInfo.HouseKey,
        HouseID: houseInfo.KeyID
      }
    })
  }

  handleSignUpClick = () => {
    // 点击签字的回调
    const { detailData } = this.props
    const Name = this.isOwner
      ? detailData.OwnerContract.OwnerName
      : detailData.TenantContractInfo.TenantName
    const IDCard = this.isOwner
      ? detailData.OwnerContract.OwnerIDCard
      : detailData.TenantContractInfo.TenantCard
    const Mobile = this.isOwner
      ? detailData.OwnerContract.OwnerPhone
      : detailData.TenantContractInfo.TenantPhone
    this.props.navigation.navigate('AgentContractSign', {
      Mobile,
      IDCard,
      Name,
      ContractID: this.KeyID,
      type: this.isOwner ? 0 : 1
    })
  }
  handleBookKeepClick = () => {
    // 点击记账的回调
    const houseInfo = this.props.detailData.HouseInfo
    this.props.navigation.navigate('AgentAddBookKeeping', {
      data: {
        contractID: this.KeyID,
        HouseName: houseInfo.HouseName,
        HouseKey: houseInfo.HouseKey,
        HouseID: houseInfo.KeyID
      },
      editType: 0,
      apiType: 1,
      busType: this.isOwner ? 0 : 1
    })
  }
  handleRenewClick = () => {
    // 点击续约的回调
    if (this.isOwner) {
      this.props.navigation.navigate('AgentEditOwnerContract', {
        KeyID: this.KeyID,
        Renew: true
      })
    } else {
      this.props.navigation.navigate('AgentEditTenantContract', {
        KeyID: this.KeyID,
        Renew: true
      })
    }
  }

  handleEditCheckoutClick = () => {
    // 点击修改退房的回调
    this.props.navigation.navigate('AgentCheckOutContract', {
      contractID: this.KeyID,
      editType: 1,
      type: this.isOwner ? 0 : 1
    })
  }
  handleContactClick = () => {
    // 点击联系的回调
    const num = this.isOwner
      ? this.props.detailData.OwnerContract.OwnerPhone
      : this.props.detailData.TenantContractInfo.TenantPhone
    Alert.alert('温馨提示', `是否联系${num}？`, [
      { text: '取消' },
      { text: '确认', onPress: () => Linking.openURL(`tel:${num}`) }
    ])
  }
  handleEditClick = () => {
    // 点击修改的回调
    if (this.isOwner) {
      this.props.navigation.navigate('AgentEditOwnerContract', {
        KeyID: this.KeyID
      })
    } else {
      this.props.navigation.navigate('AgentEditTenantContract', {
        KeyID: this.KeyID
      })
    }
  }
  handleRevertClick = () => {
    // 点击撤回的回调
    Alert.alert('温馨提示', '确定要撤回吗?', [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => {
          this.setState({
            loading: true
          })
          if (this.isOwner) {
            WithDrawByID({
              contractID: this.KeyID
            })
              .then(() => {
                this.setState({
                  loading: false
                })
                Toast.show('撤回成功', {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM
                })
                this.props.dispatch(
                  updateContractDetail({
                    key: 'OwnerContractOperate',
                    data: {
                      AuditStatus: 0,
                      LeaseStatus: 1
                    }
                  })
                )
                this.props.dispatch(
                  updateList({
                    key: 'ownerContractList',
                    KeyID: this.KeyID,
                    data: {
                      AuditStatus: 0,
                      LeaseStatus: 1
                    }
                  })
                )
                this.fetchData()
              })
              .catch(() => {
                this.setState({
                  loading: false
                })
              })
          } else {
            tenantWithDrawByID({
              contractID: this.KeyID
            })
              .then(() => {
                this.setState({
                  loading: false
                })
                Toast.show('撤回成功', {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM
                })
                this.props.dispatch(
                  updateContractDetail({
                    key: 'TenantContractOperate',
                    data: {
                      AuditStatus: 0,
                      RentLeaseStatus: 1
                    }
                  })
                )
                this.props.dispatch(
                  updateList({
                    key: 'tenantContractList',
                    KeyID: this.KeyID,
                    data: {
                      AuditStatus: 0,
                      RentLeaseStatus: 1
                    }
                  })
                )
              })
              .catch(() => {
                this.setState({
                  loading: false
                })
              })
          }
        }
      }
    ])
  }
  handleDeleteClick = () => {
    // 点击删除的回调
    Alert.alert('温馨提示', '确定要删除吗?', [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => {
          this.setState({
            loading: true
          })
          if (this.isOwner) {
            DeleteOwnerContractByIDs({
              ids: [this.KeyID]
            })
              .then(() => {
                this.setState(
                  {
                    loading: false
                  },
                  () => {
                    setTimeout(() => {
                      Alert.alert(
                        '温馨提示',
                        '删除成功',
                        [
                          {
                            text: '确认',
                            onPress: () => {
                              this.props.dispatch(
                                deleteList({
                                  key: 'ownerContractList',
                                  KeyID: this.KeyID
                                })
                              )
                              this.props.navigation.navigate(
                                'AgentContractList',
                                {
                                  param: {
                                    page: 2
                                  }
                                }
                              )
                            }
                          }
                        ],
                        { cancelable: false }
                      )
                    }, 100)
                  }
                )
              })
              .catch(() => {
                this.setState({
                  loading: false
                })
              })
          } else {
            deleteTenantContractByIDs({
              ids: [this.KeyID]
            })
              .then(() => {
                this.setState(
                  {
                    loading: false
                  },
                  () => {
                    setTimeout(() => {
                      Alert.alert(
                        '温馨提示',
                        '删除成功',
                        [
                          {
                            text: '确认',
                            onPress: () => {
                              this.props.dispatch(
                                deleteList({
                                  key: 'tenantContractList',
                                  KeyID: this.KeyID
                                })
                              )
                              this.props.navigation.navigate(
                                'AgentContractList',
                                {
                                  param: {
                                    page: 1
                                  }
                                }
                              )
                            }
                          }
                        ],
                        { cancelable: false }
                      )
                    }, 100)
                  }
                )
              })
              .catch(() => {
                this.setState({
                  loading: false
                })
              })
          }
        }
      }
    ])
  }
  onChangeTab = ({ i }) => {
    this.setState({
      page: i
    })
  }
  render() {
    const { filteredInfo } = this.state
    return (
      <View style={Container}>
        <Header title={'合同详情'} leftClick={this.onBack} />
        <FullModal visible={this.state.loading} />
        <View style={style.headContainer}>
          <View style={style.headTitleContainer}>
            <Placeholder.Line
              color='#eeeeee'
              width='50%'
              textSize={16}
              onReady={this.state.isReady}
            >
              <Text style={style.headTitle}>{filteredInfo.HouseName}</Text>
            </Placeholder.Line>
          </View>
          <View style={style.headStatusContainer}>
            <Placeholder.Line
              color='#eeeeee'
              width='50%'
              textSize={14}
              onReady={this.state.isReady}
            >
              <Text>
                {this.state.isReady &&
                  filteredInfo.ContractInfoRent[1] + '元/月'}
              </Text>
            </Placeholder.Line>
            <Text
              style={{
                ...style.statusText,
                color: this.state.isReady
                  ? filteredInfo.statusText.color
                  : '#fff'
              }}
            >
              {this.state.isReady && filteredInfo.statusText.label}
            </Text>
          </View>
          <Placeholder.Line
            color='#eeeeee'
            width='80%'
            textSize={14}
            onReady={this.state.isReady}
          >
            <Text>{this.state.isReady && filteredInfo.HostTime[1]}</Text>
          </Placeholder.Line>
        </View>
        <View style={style.tabContainer}>
          <ScrollableTabView
            tabBarUnderlineStyle={{
              backgroundColor: CommonColor.color_primary,
              height: 2
            }}
            locked={!this.state.isReady}
            tabBarBackgroundColor={CommonColor.color_white}
            tabBarActiveTextColor={CommonColor.color_primary}
            tabBarInactiveTextColor={'rgb(54,54,54)'}
            tabBarTextStyle={{ fontSize: 17 }}
            prerenderingSiblingsNumber={Infinity}
            initialPage={0}
            page={this.state.page}
            onChangeTab={this.onChangeTab}
          >
            {this.isOwner ? (
              <OwnerTab
                isReady={this.state.isReady}
                data={this.props.detailData}
                isOwner={this.isOwner}
                tabLabel={'业主'}
              />
            ) : (
              <TenantTab
                isReady={this.state.isReady}
                data={this.props.detailData}
                isOwner={this.isOwner}
                tabLabel={'租客'}
              />
            )}
            <SignUpTab
              isReady={this.state.isReady}
              data={this.props.detailData}
              isOwner={this.isOwner}
              tabLabel='签约'
            />
            <BillTab
              isReady={this.state.isReady}
              data={this.props.detailData}
              isOwner={this.isOwner}
              tabLabel='账单'
            />
            <BookKeeping
              isReady={this.state.isReady}
              data={this.props.detailData}
              isOwner={this.isOwner}
              tabLabel='记账'
            />
          </ScrollableTabView>
        </View>

        <ButtonGroup
          options={filteredInfo.btnOptions}
          hasIcon
          handleCheckoutClick={this.handleCheckoutClick}
          handleBookKeepClick={this.handleBookKeepClick}
          handleRenewClick={this.handleRenewClick}
          handleEditCheckoutClick={this.handleEditCheckoutClick}
          handleContactClick={this.handleContactClick}
          handleEditClick={this.handleEditClick}
          handleRevertClick={this.handleRevertClick}
          handleDeleteClick={this.handleDeleteClick}
          handleSignUpClick={this.handleSignUpClick}
        />
      </View>
    )
  }
}
const style = StyleSheet.create({
  headContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    height: 113,
    width: DEVICE_WIDTH,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_white
  },
  headTitleContainer: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    height: 50,
    width: DEVICE_WIDTH - 30,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  headTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(54,54,54)'
  },
  headStatusContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 30
  },
  statusText: {
    fontSize: 16
  },
  tabContainer: {
    flex: 1,
    marginTop: 15
  }
})

const mapToProps = store => ({ detailData: store.contract.detailData })
export default connect(mapToProps)(withNavigation(ContractDetail))
