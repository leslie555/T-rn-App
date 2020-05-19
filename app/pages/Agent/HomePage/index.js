import React, { Component } from 'react'
// 渐变
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import style from './style'
import BtnList from './components/BtnList'
import { Header } from '../../../components'
import IconFont from '../../../utils/IconFont'
import { connect } from 'react-redux'
import { getEnumList } from '../../../redux/actions/enum'
import storage from '../../../utils/storage'
import NavigationService from '../../../router/NavigationService'
import rootBackHandle from '../../../utils/rootBackHandle'
import { checkAppUpdate } from '../../../utils/updateUtil'
import { FindReadCount } from '../../../api/userCenter'
import ActionSheet from 'react-native-actionsheet'
import { logInAction } from '../../../redux/actions/user'
import DownloadModal from '../../../utils/updateUtil/DownloadModal'
import { hasModule } from '../../../utils/buttonPermission'
import Toast from 'react-native-root-toast'

import { ShowStaffRelationIntoByEmployeeID } from '../../../api/bossKey'
import { accountList } from '../../../redux/actions/account'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.rootBackHandle = new rootBackHandle(this.props.navigation)
    this.ActionSheet = null
    this.hasApproval = false
    this.state = {
      comList: [
        {
          icon: 'fangyuan-1',
          router: 'AgentShareHouseList',
          label: '共享房源',
          isShow: true
        },
        {
          icon: 'zhanghu-',
          router: 'AgentPrivateAccount',
          label: '个人账户',
          isShow: true
        },
        {
          icon: 'guanli-',
          router: 'AgentEditContract',
          label: '合同录入',
          isShow: true
        },
        {
          icon: 'fangyuanbeian',
          router: 'AgentRenovationNav',
          label: '装修配置申请',
          isShow: true
        },
        {
          icon: 'qianyue-',
          router: 'AgentSignUpOnlineList',
          label: '电子签约',
          isShow: true
        },
        {
          icon: 'juhe-',
          router: 'AgentAggregatePayList',
          label: '聚合支付',
          isShow: true
        },
        {
          icon: 'shouzu-',
          router: 'AgentCollectRentalsRate',
          label: '收租率',
          isShow: true
        },
        {
          icon: 'kongzhi-',
          router: 'AgentVacantRate',
          label: '空置率',
          isShow: true
        },
        {
          icon: 'beian-',
          router: 'AgentOwnerResource',
          label: '房东房源备案',
          isShow: true
        }
      ],
      msgNumber: 0,
      Organization: ''
    }
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        if (Platform.OS === 'android') {
          checkAppUpdate()
        }
        FindReadCount().then(res => {
          this.setState({
            msgNumber: res.Data
          })
        })
        // storage.get('password').then(val => {
        //   if (val === '000000') {
        //     Alert.alert(
        //       '温馨提示',
        //       `系统检测到密码为初始密码，请您及时修改，避免出现不必要的麻烦。`,
        //       [
        //         { text: '稍后修改' },
        //         {
        //           text: '修改密码',
        //           onPress: () => {
        //             this.props.navigation.navigate('AgentResetPassword')
        //           }
        //         }
        //       ],
        //       { cancelable: false }
        //     )
        //   }
        // })
        // 门店4级
        ShowStaffRelationIntoByEmployeeID({
          Type: 1
        }).then(({ Data }) => {
          this.props.dispatch(
            accountList({
              key: 'ShopListSelector',
              data: Data
            })
          )
        })
        ShowStaffRelationIntoByEmployeeID({
          Type: 3
        }).then(({ Data }) => {
          this.props.dispatch(
            accountList({
              key: 'ShopListSelector2',
              data: Data
            })
          )
        })
      }
    )
  }

  componentDidMount() {
    console.log(this.props.userInfo)
    NavigationService.agentTabIndex = 0 // 兼容重新进入的时候
    storage.get('enum').then(val => {
      if (val && !this.props.enumList.length) {
        this.props.dispatch(getEnumList(val))
      }
    })
    storage.get('userinfo').then(val => {
      let Organization = val.Organization
      if(typeof Organization === 'string'){
        Organization = Organization.replace(/-/g,'>').split('>')
        if(Organization.length>2) {
          Organization.splice(0,Organization.length-2)
        }
        this.setState({
          Organization: Organization.join('>')
        })
        val.Organization = Organization.join('>')
      }
      if (val && !this.props.userinfo) {
        this.props.dispatch(logInAction(val))
      }
    })
    hasModule('MyApproval')
      .then(() => {
        this.hasApproval = true
      })
      .catch(() => {
        this.hasApproval = false
      })
  }

  componentWillUnmount() {
    this.rootBackHandle.remove()
    this.didFocusSubscription.remove()
  }

  goPage(routeName) {
    if (!routeName) {
      Toast.show('功能暂未开放！', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    } else if (routeName === 'AgentEditContract') {
      this.ActionSheet.show()
    } else if (routeName === 'AgentMyApprovalList') {
      if (this.hasApproval) {
        this.props.navigation.navigate(routeName)
      } else {
        Toast.show('您的账号暂无审批权限！', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
      }
    } else {
      this.props.navigation.navigate(routeName)
    }
  }

  onActionSheetPress(idx) {
    // idx:0=>新增租客合同,1=>新增业主合同
    if (idx === 0) {
      this.props.navigation.navigate('AgentEditTenantContract')
    } else if (idx === 1) {
      this.props.navigation.navigate('AgentEditOwnerContract')
    }
  }

  render() {
    return (
      <View style={style.app_container}>
        {/* 头部 */}
        <Header title='首页' hideLeft={true} />
        <DownloadModal />
        <View style={style.home_header_box}>
          <TouchableOpacity
              style={style.home_header_left}
              activeOpacity={1}
              onPress={() => {
                this.props.navigation.openDrawer()
              }}>
            <View
              style={style.home_header_more}
            >
              <IconFont size={20} color='#fff' name='gengduo' />
            </View>
            <View style={style.home_header_userinfo}>
              <Image
                style={style.home_header_img}
                source={require('./images/head.png')}
              />
              <Text style={style.home_header_name}>
                {this.props.userInfo.UserName}
              </Text>
              <Text style={style.home_header_name}>
                {this.state.Organization}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={style.home_header_right}>
            <View style={style.home_header_right_item}>
              <TouchableOpacity
                style={style.home_header_right_item_content}
                onPress={() => {
                  this.goPage('AgentMyMsg')
                }}
              >
                <View style={style.home_header_right_item_icon}>
                  <IconFont size={20} color='#fff' name='xiaoxi-' />
                </View>
                <View style={style.home_header_right_item_label_box}>
                  <Text style={style.home_header_right_item_label}>
                    我的消息
                  </Text>
                  {this.state.msgNumber > 0 && (
                    <View style={style.home_header_right_item_msg}>
                      <Text style={style.home_header_right_item_msg_text}>
                        {this.state.msgNumber}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={style.home_header_right_item}>
              <TouchableOpacity
                style={style.home_header_right_item_content}
                onPress={() => {
                  let flag = false
                  if (this.props.userInfo.PermissionFlag) {
                    flag = this.props.userInfo.PermissionFlag.split(
                      ','
                    ).includes('2')
                  }
                  this.goPage(
                    flag ? 'AgentPurchaseApproval' : 'AgentMyApprovalNewList'
                  )
                }}
              >
                <View style={style.home_header_right_item_icon}>
                  <IconFont size={20} color='#fff' name='shenpi-' />
                </View>
                <Text style={style.home_header_right_item_label}>我的审批</Text>
              </TouchableOpacity>
            </View>
            <View style={style.home_header_right_item}>
              <TouchableOpacity
                style={style.home_header_right_item_content}
                onPress={() => {
                  this.goPage('AgentMyThings')
                }}
              >
                <View style={style.home_header_right_item_icon}>
                  <IconFont size={20} color='#fff' name='daiban-' />
                </View>
                <Text style={style.home_header_right_item_label}>我的待办</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={style.home_middle}>
          <TouchableOpacity
            style={style.home_middle_item}
            onPress={() => {
              this.goPage('AgentInHouseCalculate')
            }}
          >
            <Image
              style={style.home_middle_item_img}
              source={require('./images/Takeroom.png')}
            />
            <Text style={style.home_middle_item_text}>拿房预测算</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.home_middle_item}
            onPress={() => {
              this.goPage('AgentOutHouseCalculate')
            }}
          >
            <Image
              style={style.home_middle_item_img}
              source={require('./images/outroom.png')}
            />
            <Text style={style.home_middle_item_text}>出房预测算</Text>
          </TouchableOpacity>
        </View>
        <View style={style.home_content}>
          <BtnList
            list={this.state.comList}
            onPress={rootName => {
              this.goPage(rootName)
            }}
          />
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'新增合同'}
          options={['新增租客合同', '新增业主合同', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={idx => {
            this.onActionSheetPress(idx)
          }}
        />
      </View>
    )
  }
}

const mapToProps = state => ({
  enumList: state.enum.enumList,
  userInfo: state.user.userinfo
})
export default connect(mapToProps)(HomePage)
