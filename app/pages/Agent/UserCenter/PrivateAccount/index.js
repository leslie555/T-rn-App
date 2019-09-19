import React from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './style'
import IconFont from "../../../../utils/IconFont";
import {Header} from "../../../../components";

export default class DrawerBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      routeList: [
        {
          icon: 'gerenfangyuan',
          router: 'AgentMyHouseList',
          label: '个人房源',
          isShow: true
        },
        {
          icon: 'shoufukuan',
          router: 'AgentPayReceiptList',
          label: '收付款',
          isShow: true
        },
        {
          icon: 'hetongguanli',
          router: 'AgentContractList',
          label: '合同管理',
          isShow: true
        },
        {
          icon: 'wodeyuding',
          router: 'AgentOrderList',
          label: '我的预定',
          isShow: true
        },
        {
          icon: 'yezhudaoqi',
          router: 'AgentOwnerExpire',
          label: '业主到期',
          isShow: true
        },
        {
          icon: 'zukedaoqi',
          router: 'AgentTenantExpire',
          label: '租客到期',
          isShow: true
        },
        {
          icon: 'yezhuweiyue',
          router: 'AgentBreachContract',
          label: '业主违约',
          isShow: true
        },
        {
          icon: 'zukeweiyue',
          router: 'AgentTenantDefaults',
          label: '租客违约',
          isShow: true
        },
        {
          icon: 'zhuanjieshaofangdong',
          router: 'AgentReferLandlord',
          label: '转介绍（房东）',
          isShow: true
        },
        {
          icon: 'zhuanjieshaozuke1',
          router: 'AgentReferTenant',
          label: '转介绍（租客）',
          isShow: true
        },
        {
          icon: 'shourujizhang',
          router: 'AgentIncomeOrExpendAccount',
          label: '收入记账',
          isShow: true
        },
        {
          icon: 'zhichujizhang',
          router: 'AgentIncomeOrExpendAccount',
          label: '支出记账',
          isShow: true
        }
      ]
    }
  }

  componentDidMount() {

  }

  goPage(routeName,label) {
    this.props.navigation.navigate(routeName,{label:label})
  }
  render() {
    return (
        <View style={styles.container}>
          <Header title="个人账户" />
          <View style={styles.btn_box}>
            {this.state.routeList.map((item,index)=>{
              return (
                  <TouchableOpacity style={[styles.btn_box_item,index%2===1?styles.btn_box_item_ml:null]} key={index} onPress={()=>{
                    this.goPage(item.router,item.label)
                  }}>
                    <View style={styles.btn_box_item_icon}>
                      <IconFont size={20} color='#fff' name={item.icon} />
                    </View>
                    <Text style={styles.btn_box_item_text}>{item.label}</Text>
                  </TouchableOpacity>
              )
            })}
          </View>
        </View>
    );
  }
}
