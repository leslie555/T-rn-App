import React from 'react'
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import styles from './style'
import IconFont from '../../../../../utils/IconFont'
import { checkAppUpdate } from '../../../../../utils/updateUtil'
import { logout } from '../../../../../redux/actions/user'
import { connect } from 'react-redux'

class DrawerBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      routeList: [
        {
          icon: 'shoucang',
          router: 'AgentShareHouseList',
          label: '我的收藏',
          isShow: true
        },
        {
          icon: 'changepwd',
          router: 'AgentResetPassword',
          label: '修改密码',
          isShow: true
        },
        {
          icon: 'jianchagengxin',
          router: 'CheckUpdate',
          label: '检查更新',
          isShow: true
        },
        {
          icon: require('./images/laoban.png'),
          isImage: true,
          router: 'BossHomePage',
          label: '老板键',
          isShow: false
        }
      ]
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo !== this.props.userInfo) {
      if (nextProps.userInfo.PermissionFlag) {
        const arr = nextProps.userInfo.PermissionFlag.split(',')
        // 1,3 都有老板键
        if (arr.includes('1') || arr.includes('3')) {
          this.state.routeList.find(
            x => x.router === 'BossHomePage'
          ).isShow = true
          this.setState({
            routeList: this.state.routeList
          })
        }
      }
    }
  }
  componentDidMount() { }

  logout() {
    this.props.dispatch(logout())
    this.props.navigation.navigate('Auth')
  }
  onPressRouter(name) {
    this.props.navigation.navigate(name)
  }
  goPage(routeName) {
    this.props.navigation.closeDrawer()
    if (routeName === 'AgentShareHouseList') {
      this.props.navigation.navigate(routeName, {
        type: 1
      })
    } else if (routeName === 'CheckUpdate') {
      checkAppUpdate(1)
    } else {
      this.props.navigation.navigate(routeName)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.draw_header}>
          <View style={styles.draw_photo_box}>
            <Image
              style={styles.draw_photo_img}
              source={require('../../images/head.png')}
            />
            <Text style={styles.draw_photo_text}>
              {this.props.userInfo.UserName}
            </Text>
          </View>
          <View style={styles.draw_text_box}>
            <Text style={styles.draw_text_left}>
              职<Text style={styles.text_indent}>占位</Text>位：
            </Text>
            <Text style={styles.draw_text_right}>
              {this.props.userInfo.DepName}
            </Text>
          </View>
          <View style={styles.draw_text_box}>
            <Text style={styles.draw_text_left}>所属组织：</Text>
            <Text style={styles.draw_text_right}>
              {this.props.userInfo.Organization}
            </Text>
          </View>
          <View style={styles.draw_text_box}>
            <Text style={styles.draw_text_left}>
              电<Text style={styles.text_indent}>占位</Text>话：
            </Text>
            <Text style={styles.draw_text_right}>
              {this.props.userInfo.LoginCode}
            </Text>
          </View>
        </View>
        <View style={styles.draw_content}>
          {this.state.routeList.map((item, index) => {
            if (!item.isShow) return null
            return (
              <TouchableOpacity
                style={styles.draw_content_item}
                key={index}
                onPress={() => {
                  this.goPage(item.router)
                }}
              >
                <View style={styles.draw_content_item_icon}>
                  {item.isImage ? (
                    <Image
                      source={item.icon}
                      style={styles.draw_content_item_img}
                    />
                  ) : (
                      <IconFont size={12} color='#389ef2' name={item.icon} />
                    )}
                </View>
                <Text style={styles.draw_content_item_text}>{item.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.protocolPolicy}>
          <TouchableOpacity onPress={() => {
            this.onPressRouter('ServiceContract')
          }} style={[styles.protocolPolicyBtn]}>
            <Text style={styles.protocolPolicyBtnColor}>服务协议</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.onPressRouter('PrivacyPolicy')
          }}>
            <Text style={styles.protocolPolicyBtnColor}>隐私政策</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.draw_footer}>
          <TouchableOpacity
            style={styles.draw_btn}
            onPress={() => {
              this.logout()
            }}
          >
            <Text style={styles.draw_btn_text}>退出当前账号</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapToProps = state => ({ userInfo: state.user.userinfo })
export default connect(mapToProps)(DrawerBox)
