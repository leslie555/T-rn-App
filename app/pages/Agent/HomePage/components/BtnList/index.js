import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import style from "./style";
import IconFont from "../../../../../utils/IconFont";
import {withNavigation} from 'react-navigation'

class BtnList extends React.Component {
  constructor(props) {
    super(props)
  }

  goPage(routeName) {
    this.props.onPress && this.props.onPress(routeName)
  }

  render() {
    const line1 = this.props.list.slice(0, 3)
    const line2 = this.props.list.slice(3, 6)
    const line3 = this.props.list.slice(6, 9)
    const list1 = line1.map((item, index) => (
        <View style={[style.home_btn, index === 0 ? style.noLeftBorder : '']} key={index}>
          <TouchableOpacity style={style.item_content} onPress={() => {
            this.goPage(item.router)
          }}>
            <IconFont size={28} color="#6fbcf8" name={item.icon}/>
            <Text style={style.item_label}>{item.label}</Text>
          </TouchableOpacity>
        </View>
    ))
    const list2 = line2.map((item, index) => (
        <View style={[style.home_btn, index === 0 ? style.noLeftBorder : '']} key={index}>
          <TouchableOpacity style={style.item_content} onPress={() => {
            this.goPage(item.router)
          }}>
            <IconFont size={28} color="#6fbcf8" name={item.icon}/>
            <Text style={style.item_label}>{item.label}</Text>
          </TouchableOpacity>
        </View>
    ))
    const list3 = line3.map((item, index) => (
        <View style={[style.home_btn, index === 0 ? style.noLeftBorder : '', style.noBottomBorder]} key={index}>
          <TouchableOpacity style={style.item_content} onPress={() => {
            this.goPage(item.router)
          }}>
            <IconFont size={28} color="#6fbcf8" name={item.icon}/>
            <Text style={style.item_label}>{item.label}</Text>
          </TouchableOpacity>
        </View>
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
        </View>
    )
  }
}

export default withNavigation(BtnList)
