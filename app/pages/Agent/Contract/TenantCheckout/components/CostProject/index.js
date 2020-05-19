import React, {Component} from 'react'
import {Button, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {CheckBox, Header, InputNumber} from "../../../../../../components";
import IconFont from "../../../../../../utils/IconFont";
import Toast from "react-native-root-toast";

class EditContractEquipments extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数 path,data
    this.defaultData = ['照明灯', '开关', '插座', '遥控器', '晾衣杆', '窗帘', '门锁',
      '水龙头', '地漏', '地板', '墙面', '电视', '冰箱', '洗衣机', '空调', '热水器', '燃气灶',
      '油烟机', '橱柜', '花洒', '浴霸灯', '洗漱台', '衣柜', '床（垫）', '沙发', '茶几', '电视柜',
      '餐桌椅', '鞋柜', '床头柜']
    this.paramData = this.query.data
    this.isSettle = this.query.isSettle
    this.scrollRef = null
    this.state = {
      list: [],
      selectAll: false
    }
    this.initData()
  }

  componentWillMount() {

  }

  initData() {
    //填充默认的
    this.defaultData.forEach((item) => {
      this.state.list.push({
        EquipmentName: item,
        isDefault: true,
        isChecked: false
      })
    })
    // 填充已有数据
    this.paramData.forEach((item) => {
      const index = this.state.list.findIndex(x => x.EquipmentName === item.EquipmentName)
      if (index === -1) {
        this.state.list.push({
          ...item,
          isDefault: false,
          isChecked: true
        })
      } else {
        this.state.list[index] = {
          ...item,
          isDefault: true,
          isChecked: true
        }
      }
    })
    // 同步不需要
    // this.setState({
    //   list: this.state.list
    // })
    this.calcSelect()
  }

  handleSave() {
    const result = this.state.list.filter(x => {
      x.EquipmentState = this.isSettle
      return x.isChecked
    })
    if (result.some(x => !x.EquipmentName)) {
      Toast.show('请完善已选设备信息！', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.props.navigation.navigate(this.query.path, {
      equipmentInfo: JSON.stringify({
        isSettle: this.isSettle,
        data: result
      })
    })
  }

  handleAdd() {
    this.state.list.push({
      EquipmentName: '',
      isDefault: false,
      isChecked: true
    })
    this.setState({
      list: this.state.list
    }, () => {
      setTimeout(() => {
        this.scrollRef.scrollToEnd({animated: true})
      }, 10)
    })
  }

  handleSelectAll() {
    this.state.list.map(item => {
      item.isChecked = !this.state.selectAll
    })
    this.setState({
      list: this.state.list,
      selectAll: !this.state.selectAll
    })
  }

  changeCheckBox(item) {
    item.isChecked = !item.isChecked
    this.setState({
      list: this.state.list
    })
    this.calcSelect()
  }

  calcSelect() {
    if (this.state.list.some(x => {
      return x.isChecked === false
    })) {
      this.setState({
        selectAll: false
      })
    } else {
      this.setState({
        selectAll: true
      })
    }
  }

  render() {
    return (
        <View style={styles.keep_container}>
          <Header title={this.isSettle === 0?'正常设备清单':'损坏设备清单'} headerRight={
            <TouchableOpacity onPress={() => this.handleAdd()}>
              <IconFont name='addition' size={18} color='#fff'/>
            </TouchableOpacity>
          }/>
          <View style={styles.keep_content}>
            <ScrollView ref={(ref) => {
              this.scrollRef = ref
            }}>
              {this.state.list.map((item, index) => {
                return (
                    <TouchableOpacity style={styles.data_item_box} key={index} onPress={() => {
                      this.changeCheckBox(item)
                    }}>
                      <CheckBox style={styles.data_item_check} isChecked={item.isChecked} onClick={() => {
                        this.changeCheckBox(item)
                      }}/>
                      {item.isDefault ?
                          <Text style={styles.data_item_text}>{item.EquipmentName}</Text> :
                          <TextInput style={styles.data_item_input} placeholder="请输入设备名称"
                                     defaultValue={item.EquipmentName + ''} onChangeText={(val) => {
                            item.EquipmentName = val
                            this.setState({
                              list: this.state.list
                            })
                          }}/>
                      }
                    </TouchableOpacity>
                )
              })}
              <View style={{height: 20}}/>
            </ScrollView>
          </View>
          <View style={styles.bottom_box}>
            <TouchableOpacity style={styles.bottom_btn1} onPress={() => this.handleSelectAll()}>
              <Text style={styles.bottom_btn_text1}>{this.state.selectAll ? '取消全选' : '全选'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottom_btn2} onPress={() => this.handleSave()}>
              <Text style={styles.bottom_btn_text2}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

export default EditContractEquipments
