import React from "react";
import PropTypes from 'prop-types';
import styles from "./style";
import {Text, TouchableOpacity, View} from "react-native";

export default class ListNumberBox extends React.Component {
  constructor(props) {
    super(props)
    this.defaultColor = '#ff9900'
    this.state = {
      checkList: []
    }
  }

  static propTypes = {
    data: PropTypes.array, // 绑定数据
  }

  handleClick(item) {
    //内部颜色逻辑处理
    this.state.checkList[item.type] = !this.state.checkList[item.type]
    const sameList = this.props.data.filter(x => x.key === item.key && x.type !== item.type)
    if (sameList && sameList.length > 0) {
      sameList.forEach((cItem, index) => {
        this.state.checkList[cItem.type] = false
      })
    }
    // 外部点击事件回调
    const type = `handle${item.type}Click`
    this.props[type] && this.props[type](this.state.checkList[item.type])
    this.setState({
      checkList: this.state.checkList
    })
  }

  render() {
    return (
        <View style={styles.middleContent}>
          {this.props.data.map((item, index) => {
            return (
                <View style={styles.middleContentItem} key={index}>
                  <TouchableOpacity style={styles.middleContentItemInner} onPress={() => {
                    this.handleClick(item)
                  }}>
                    <Text
                        style={[styles.middleContentItemLeft, {color: this.state.checkList[item.type] ? '#389ef2' : '#666'}]}>{item.label}：</Text>
                    <Text
                        style={[styles.middleContentItemRight, {color: item.color || this.defaultColor}]}
                    >{item.value}</Text>
                  </TouchableOpacity>
                </View>
            )
          })}
        </View>
    )
  }
}
