import React from 'react';
import {Button, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import styles from './style'
import IconFont from "../../../../../utils/IconFont";

export default class DrawerBox extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数 index
    this.state = {
      routeList: [
        {
          icon: 'tenantcontract',
          router: 'AgentEditTenantContract',
          label: '添加租客合同',
          color: '#fb9157',
          isShow: true
        },
        {
          icon: 'ownercontract',
          router: 'AgentEditOwnerContract',
          label: '添加业主合同',
          color: '#ff787b',
          isShow: true
        },
        {
          icon: 'reserve',
          router: 'AgentAddOrder',
          label: '添加预定',
          color: '#fab743',
          isShow: true
        },
        {
          icon: 'add',
          router: 'AgentAddThing',
          label: '添加待办',
          color: '#b595fc',
          isShow: true
        }
      ]
    }
  }

  componentWillMount() {
    // console.log(this.query.index)
    this.box_bg = this.query.index === 0 ? require('../../images/add_bg.jpg') : require('../../images/add_bg_1.png')
  }

  goPage(routeName) {
    if (routeName === 'AgentAddOrder' || routeName === 'AgentAddThing') {
      this.props.navigation.navigate(routeName, {
        path: 'AgentHomePage'
      })
    } else {
      this.props.navigation.navigate(routeName)
    }
  }

  closeModal() {
    this.props.navigation.pop()
  }

  render() {
    // const newRouteList = []
    // let num = -1
    // this.state.routeList.forEach((item, index) => {
    //   if (index % 3 === 0) {
    //     num++
    //   }
    //   if (!newRouteList[num]) {
    //     newRouteList[num] = []
    //   }
    //   newRouteList[num].push(item)
    // })
    return (
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => {
            this.closeModal()
          }}><View style={styles.icon_holder}></View></TouchableWithoutFeedback>
          <View style={styles.icon_box}>
            {this.state.routeList.map((item, index) => {
              return (
                  <TouchableOpacity style={[styles.icon_box_item, index % 3 !== 0 ? styles.icon_box_item_ml : null]}
                                    key={index} onPress={() => {
                    this.goPage(item.router)
                  }}>
                    <View style={{...styles.icon_box_item_icon, backgroundColor: item.color}}>
                      <IconFont size={24} color="#fff" name={item.icon}/>
                    </View>
                    <Text style={styles.icon_box_item_text}>{item.label}</Text>
                  </TouchableOpacity>
              )
            })}
          </View>
          <TouchableOpacity style={styles.icon_cancel} onPress={() => {
            this.closeModal()
          }}>
            <IconFont size={18} color="#999" name="guanbi"/>
          </TouchableOpacity>
          <Image style={styles.add_bg} source={this.box_bg}/>
        </View>
    );
  }
}
