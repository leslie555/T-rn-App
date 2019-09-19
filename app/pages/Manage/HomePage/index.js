import React, { Component } from 'react'
// 渐变
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import style from './style'

class BtnList extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const line1 = this.props.list.slice(0, 3)
    const line2 = this.props.list.slice(3, 6)
    const line3 = this.props.list.slice(6, 9)
    const line4 = this.props.list.slice(9, 12)
    const list1 = line1.map((item, index) => (
      <TouchableOpacity style={[style.home_btn, index === 0 ? style.noLeftBorder : '']}>
        <View style={style.item_content}>
          {/* <iconfont></iconfont> */}
          <View style={style.item_iconfont}></View>
          <Text style={style.item_label}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    ))
    const list2 = line2.map((item, index) => (
      <TouchableOpacity style={[style.home_btn, index === 0 ? style.noLeftBorder : '']} onPress={this.props.navigate()}>
        <View style={style.item_content}>
          <View style={style.item_iconfont}></View>
          <Text style={style.item_label}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    ))
    const list3 = line3.map((item, index) => (
      <TouchableOpacity style={[style.home_btn, index === 0 ? style.noLeftBorder : '']}>
        <View style={style.item_content}>
          <View style={style.item_iconfont}></View>
          <Text style={style.item_label}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    ))
    const list4 = line4.map((item, index) => (
      <TouchableOpacity style={[style.home_btn, style.noBottomBorder]}>
        <View style={style.item_content}>
          <View style={style.item_iconfont}></View>
          <Text style={style.item_label}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    ))
    return (
      <View style={style.test_insideBox}>
        <View style={style.home_item_column}>
          {list1}
        </View>
        <View style={style.home_item_column}>
          {list2}
        </View>
        <View style={style.home_item_column}>
          {list3}
        </View>
        <View style={style.home_item_column}>
          {list4}
        </View>
      </View>
    )
  }
}

export default class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalHeight: 0,
      comList: [
        {
          icon: '',
          router: '',
          label: '满城介绍',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '公益',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '董事长信箱',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '领导致辞',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '公司活动',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '店面风采',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '制度',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '制度新推',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '在线学习',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '法律咨询',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '投诉热线',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '生日会',
          isShow: true
        }
      ],
      yunList: [
        {
          icon: '',
          router: '',
          label: '房源店面',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '应收应付',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '合同到期',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '收租率',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '续租率',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '空置率',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '排行榜',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '客户预定',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '房东房源备案',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '个人账户',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '电子签约',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '聚合支付',
          isShow: true
        }
      ],
      toolList: [
        {
          icon: '',
          router: '',
          label: '人房比',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '人效比',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '合同管理',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '新增房源客户',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '违约房东客户',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '转介绍房东客户',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '供应链',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '平均差价',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '获客渠道',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '部门',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '人员增减',
          isShow: true
        },
        {
          icon: '',
          router: '',
          label: '工作日志',
          isShow: true
        }
      ]
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={style.app_container}>
        {/* 头部 */}
        <View style={{ height: 70, backgroundColor: '#eeeeee' }}></View>
        <View style={style.home_header_box}>
          <View style={style.home_header_left}>
            <View style={style.home_header_userinfo}>
              <Image style={style.home_header_img} source={require('./images/head.png')}></Image>
              <Text style={style.home_header_name}>崩坏阳</Text>
            </View>
          </View>
          <View style={style.home_header_right}>
            <TouchableOpacity style={style.home_header_right_item}>
              <View style={style.home_header_right_item_content}>
                {/* <iconfont></iconfont> */}
                <View style={style.home_header_right_item_icon}></View>
                <Text style={style.home_header_right_item_label}>
                  我的消息
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.home_header_right_item}>
              <View style={style.home_header_right_item_content}>
                {/* <iconfont></iconfont> */}
                <View style={style.home_header_right_item_icon}></View>
                <Text style={style.home_header_right_item_label}>
                  我的审批
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.home_header_right_item}>
              <View style={style.home_header_right_item_content}>
                {/* <iconfont></iconfont> */}
                <View style={style.home_header_right_item_icon}></View>
                <Text style={style.home_header_right_item_label}>
                  我的待办
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={style.home_content} ref="scrollTab">
          <ScrollableTabView
            ref="scrollTab"
            style={style.ScrollableTabView}
            tabBarBackgroundColor='white'
            tabBarActiveTextColor={'#389ef2'}
            tabBarInactiveTextColor={'#888888'}
            tabBarTextStyle={{ fontSize: 16 }}
            initialPage={0}
            tabBarUnderlineStyle={{ backgroundColor: '#389ef2' }}
          >
            <ScrollView contentContainerStyle={style.test_box} tabLabel="公司">
              <BtnList list={this.state.comList} />
            </ScrollView>
            <ScrollView contentContainerStyle={style.test_box} tabLabel="运营">
              <BtnList list={this.state.yunList} />
            </ScrollView>
            <ScrollView contentContainerStyle={style.test_box} tabLabel="工具">
              <BtnList list={this.state.toolList} />
            </ScrollView>
            <ScrollView contentContainerStyle={style.test_box} tabLabel="鬼谷神算">
              <View style={style.test_insideBox}>
                <View style={style.home_item_column}>
                  <TouchableOpacity style={style.home_btn}>
                    <View style={style.item_content}>
                      <View style={style.item_iconfont}></View>
                      <Text style={style.item_label}>鬼谷拿房预测算</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={style.home_btn}>
                    <View style={style.item_content}>
                      <View style={style.item_iconfont}></View>
                      <Text style={style.item_label}>鬼谷出房预测算</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={style.home_item_column}></View>
                <View style={style.home_item_column}></View>
                <View style={style.home_item_column}></View>
              </View>
            </ScrollView>
          </ScrollableTabView>
        </View>
      </View>
    )
  }
}
