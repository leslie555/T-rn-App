import React from 'react';
import {Button, Image, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import styles from './style'
import IconFont from "../../../../utils/IconFont";
import {Header} from "../../../../components";
import { connect } from 'react-redux'

class DrawerBox extends React.Component {
  constructor(props) {
    super(props)
    this.routeList = [
      {
        icon: require('./images/gongxiang.png'),
        isImage: true,
        router: 'BossShareHouseHome',
        label: '共享房源',
        width: 15,
        height: 13,
        isShow: true
      },
      {
        icon: require('./images/chudan.png'),
        isImage: true,
        // router: 'FinanceApp',
        router: 'BossOutBilling',
        label: '出单',
        width: 13,
        height: 15,
        isShow: true
      },
      {
        icon: require('./images/yingshou.png'),
        isImage: true,
        router: 'BossReceivable',
        label: '应收',
        width: 14,
        height: 15,
        isShow: true
      },
      {
        icon: require('./images/yingfu.png'),
        isImage: true,
        router: 'BossHandle',
        label: '应付',
        width: 15,
        height: 15,
        isShow: true
      },
      {
        icon: require('./images/shouzulv.png'),
        isImage: true,
        router: 'BossRentRate',
        label: '收租率',
        width: 14,
        height: 15,
        isShow: true
      },
      {
        icon: require('./images/kongzhilv.png'),
        isImage: true,
        router: 'BossVacantRate',
        label: '空置率',
        width: 16,
        height: 16,
        isShow: true
      },
      {
        icon: require('./images/weiyue.png'),
        isImage: true,
        router: "BossDefault",
        label: '违约',
        width: 13,
        height: 13,
        isShow: true
      },
      {
        icon: require('./images/pingjun.png'),
        isImage: true,
        router: "BossAveragePrice",
        label: '平均差价',
        width: 15,
        height: 15,
        isShow: true
      },
      {
        icon: require('./images/yehzuxuqian.png'),
        isImage: true,
        router: "BossContractExpire",
        label: "合同到期",
        width: 12,
        height: 14,
        isShow: true
      },
      {
        icon: require('./images/zujinchapaihangbang.png'),
        isImage: true,
        router: "BossKeyRentPrice",
        label: "租金差排行榜",
        width: 16,
        height: 15,
        isShow: true
      },
      {
        icon: require('./images/chudanpaihang.png'),
        isImage: true,
        width: 16,
        height: 15,
        isShow: true,
        router: 'BossKeySoldRank',
        label: '出单排行榜'
      },
      {
        icon: require('./images/kongzhilvpaihang.png'),
        isImage: true,
        width: 16,
        height: 15,
        router: 'BossKeyVacantRateRank',
        label: '空置率排行榜',
        isShow: true
      },
      {
        icon: require('./images/shouzulvpaiahng.png'),
        isImage: true,
        width: 16,
        height: 15,
        router: 'BossKeyRentCollectRateRank',
        label: '收租率排行榜',
        isShow: true
      },
      {
        icon: require('./images/weiyuepaihang.png'),
        isImage: true,
        width: 16,
        height: 15,
        router: 'BossKeyBreakContractRank',
        label: '违约排行榜',
        isShow: true
      },
      {
        icon: require('./images/xuzupaiahng.png'),
        isImage: true,
        width: 16,
        height: 15,
        router: 'BossKeyRenewRentRank',
        label: '续租排行榜',
        isShow: true
      },
      {
        icon: require('./images/nafangpaihang.png'),
        isImage: true,
        width: 16,
        height: 15,
        router: 'BossKeyHouseInRank',
        label: '拿房排行榜',
        isShow: true
      },
      {
        icon: require('./images/zongfangyuan.png'),
        isImage: true,
        width: 16,
        height: 15,
        router: 'BossKeyAllHouseRank',
        label: '总房源排行榜',
        isShow: true
      }
    ]
    if(this.props.userInfo.PermissionFlag){
      const arr = this.props.userInfo.PermissionFlag.split(',')
      // 1,3 都有老板键
      if (arr.includes('3')) {
        const output = []
        const showArr = ['BossKeyRentPrice','BossKeySoldRank','BossKeyVacantRateRank','BossKeyRentCollectRateRank','BossKeyBreakContractRank','BossKeyRenewRentRank']
        this.routeList.forEach(x=>{
          if (showArr.includes(x.router)){
            output.push(x)
          }
        })
        this.routeList = output
      }
    }
  }

  componentDidMount() {

  }

  goPage(routeName, label) {
    this.props.navigation.navigate(routeName, {label: label})
  }

  render() {
    return (
        <View style={styles.container}>
        <Header title="老板键" />
          <ScrollView contentContainerStyle={styles.btn_box}>
            {this.routeList.map((item, index) => {
              return (
                  <TouchableOpacity style={[styles.btn_box_item, index % 2 === 1 ? styles.btn_box_item_ml : null]}
                                    key={index} onPress={() => {
                    this.goPage(item.router, item.label)
                  }}>
                    <View style={styles.btn_box_item_icon}>
                      {item.isImage ? <Image source={item.icon} style={{width: item.width, height: item.height}}/> :
                          <IconFont size={20} color='#fff' name={item.icon}/>}
                    </View>
                    <Text style={styles.btn_box_item_text}>{item.label}</Text>
                  </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
    );
  }
}
const mapToProps = state => ({ userInfo: state.user.userinfo })
export default connect(mapToProps)(DrawerBox)
