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
          icon: require("./images/fixtures.png"),
          isImage: true,
          router: "AgentRenovationApplyList",
          label: "装修列表",
          isShow: true,
        },
        {
          icon: require("./images/maintain.png"),
          isImage: true,
          router: "AgentRepairCleanApplyList",
          extendParam: {busType: 0},
          label: "维修列表",
          isShow: true,
        },
        {
          icon: require("./images/cleaning.png"),
          isImage: true,
          router: "AgentRepairCleanApplyList",
          extendParam: {busType: 1},
          label: "保洁列表",
          isShow: true,
        },
        {
          icon: require("./images/cleaning.png"),
          isImage: true,
          router: "AgentMoveApplyList",
          // extendParam: {busType: 1},
          label: "搬家列表",
          isShow: true,
        },
      ],
    }
  }

  componentDidMount() {

  }

  goPage(routeName, extendParam) {
    this.props.navigation.navigate(routeName, extendParam)
  }

  render() {

    return (
        <View style={styles.container}>
          <Header title="装修配置申请"/>
          <View style={styles.btn_box}>
            {this.state.routeList.map((item, index) => {
              return (
                  <TouchableOpacity style={[styles.btn_box_item, index % 2 === 1 ? styles.btn_box_item_ml : null]}
                                    key={index} onPress={() => {
                    this.goPage(item.router, item.extendParam)
                  }}>
                    <View style={styles.btn_box_item_icon}>
                      {item.isImage ? <Image source={item.icon} style={styles.btn_box_item_image}/> :
                          <IconFont size={20} color='#fff' name={item.icon}/>}
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
