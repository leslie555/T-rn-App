import React, {Component} from 'react'
import {Button, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {CheckBox, Header} from "../../../../components";

class EditRentIncludeCost extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数 path,data,title,KeyID
    this.paramData = this.query.data
    this.title = this.query.title
    this.KeyID = this.query.KeyID
    this.scrollRef = null
    this.state = {
      list: this.paramData
    }
  }

  componentWillMount() {

  }

  handleSave() {
    const decorationNum = this.state.list.filter(x=>x.isChecked).length
    this.props.navigation.navigate(this.query.path, {
      decorationInfo: JSON.stringify(this.state.list),
      decorationID: this.KeyID,
      decorationNum
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
          <Header title={this.title}/>
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

export default EditRentIncludeCost
