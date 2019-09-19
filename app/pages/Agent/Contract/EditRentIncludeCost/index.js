import React, {Component} from 'react'
import {Button, Platform, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {CheckBox, Header} from "../../../../components";
import Toast from "react-native-root-toast";
import {connect} from 'react-redux'
import {validateNumber} from "../../../../utils/validate";

class EditRentIncludeCost extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.query = this.props.navigation.state.params || {} // 路由参数 path,data
    this.defaultData = this.props.enumList.EnumRentIncludeCost.slice()
    this.paramData = this.query.data
    this.scrollRef = null
    this.state = {
      list: []
    }
    this.initData()
  }

  componentWillMount() {

  }

  initData() {
    //填充默认的
    this.defaultData.forEach((item) => {
      this.state.list.push({
        KeyID: item.Value,
        Name: item.Description,
        Price: '',
        isChecked: false
      })
    })
    // 填充已有数据
    this.paramData.forEach((item) => {
      const index = this.state.list.findIndex(x => x.KeyID === item.KeyID)
      if (index === -1) {
        // 不可能
      } else {
        this.state.list[index] = {
          ...item,
          Name: this.state.list[index].Name,
          isChecked: true
        }
      }
    })
  }

  handleSave() {
    const result = []
    this.state.list.forEach(x => {
      if (x.isChecked) {
        result.push({
          KeyID: x.KeyID,
          Price: x.Price
        })
      }
    })
    if (result.some(x => !x.Price)) {
      Toast.show('请填写已选项目金额！', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    if (result.some(x => !validateNumber(x.Price))) {
      Toast.show('金额只能为数字！', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.props.navigation.navigate(this.query.path, {
      rentIncludeCostInfo: JSON.stringify(result)
    })
  }


  changeCheckBox(item) {
    item.isChecked = !item.isChecked
    this.setState({
      list: this.state.list
    })
  }

  render() {
    return (
        <View style={styles.keep_container}>
          <Header title="租金包含费用"/>
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
                      <Text style={styles.data_item_text}>{item.Name}</Text>
                      <TextInput style={styles.data_item_input}
                                 keyboardType={this.numberPad}
                                 placeholder="请输入金额"
                                 defaultValue={item.Price + ''} onChangeText={(val) => {
                        item.Price = val
                        this.setState({
                          list: this.state.list
                        })
                      }}/>
                    </TouchableOpacity>
                )
              })}
              <View style={{height: 20}}/>
            </ScrollView>
          </View>
          <View style={styles.bottom_box}>
            <TouchableOpacity style={styles.bottom_btn2} onPress={() => this.handleSave()}>
              <Text style={styles.bottom_btn_text2}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(EditRentIncludeCost)
