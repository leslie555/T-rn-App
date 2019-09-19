import React, {Component} from 'react'
import {Button, ScrollView, Text, TouchableOpacity, View, TextInput, Platform} from 'react-native'
import styles from './style'

export default class InputNumber extends Component{
  constructor(props){
    super(props)
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.min = this.props.min || 1
    this.max = this.props.max || 100000
  }
  numChange(val){
    // 如果不是数字就安排
    if(isNaN(val-1)){
      val = this.min
    }
    if(+val<this.min){
      val = this.min
    }else if(+val>this.max){
      val = this.max
    }
    // console.log(val,this.min)
    this.props.onChange&&this.props.onChange(val)
  }
  handleSub(){
    let val = this.props.value
    val--
    this.numChange(val)
  }
  handleAdd(){
    let val = this.props.value
    val++
    this.numChange(val)
  }
  render(){
    return (
        <View style={styles.number_box}>
          <TouchableOpacity style={styles.number_handle} onPress={()=>{
            this.handleSub()
          }}>
            <Text style={styles.number_handle_text}>—</Text>
          </TouchableOpacity>
          <TextInput style={styles.number_input} keyboardType={this.numberPad} defaultValue={this.props.value+''} onChangeText={(val)=>{
            this.numChange(val)
          }} />
          <TouchableOpacity style={styles.number_handle} onPress={()=>{
            this.handleAdd()
          }}>
            <Text style={styles.number_handle_text}>+</Text>
          </TouchableOpacity>
        </View>
    )
  }
}
