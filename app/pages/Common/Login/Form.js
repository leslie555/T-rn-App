import React, {Component} from 'react'
import Dimensions from 'Dimensions'
import {ActivityIndicator, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

import UserInput from './UserInput'

import usernameImg from './images/username.png'
import passwordImg from './images/password.png'
import eyeImg from './images/eye_black.png'
import {DisplayStyle} from '../../../styles/commonStyles'
import {CheckBox} from '../../../components'

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPass: true,
      press: false
    }
    this.showPass = this.showPass.bind(this)
  }

  showPass() {
    this.state.press === false
        ? this.setState({showPass: false, press: true})
        : this.setState({showPass: true, press: false})
  }

  changeFn = type => {
    return text => {
      this.props.onChangeTextFn({...this.props.userinfo, [type]: text})
    }
  }

  render() {
    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <UserInput
              source={usernameImg}
              placeholder='手机号'
              value={this.props.userinfo.username}
              onChangeTextFn={this.changeFn('username')}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
          />
          <UserInput
              source={passwordImg}
              placeholder='密码'
              value={this.props.userinfo.password}
              onChangeTextFn={this.changeFn('password')}
              secureTextEntry={this.state.showPass}
              returnKeyType={'done'}
              autoCapitalize={'none'}
              autoCorrect={false}
          />
          <TouchableOpacity
              activeOpacity={0.7}
              style={styles.btnEye}
              onPress={this.showPass}
          >
            <Image source={eyeImg} style={styles.iconEye}/>
          </TouchableOpacity>
          <View style={styles.checkBox}>
            <TouchableOpacity style={styles.checkBoxInner} onPress={() => {
              debugger
              this.props.onChangeTextFn({...this.props.userinfo, isChecked: !this.props.userinfo.isChecked})
            }}>
              <CheckBox style={styles.data_item_check} isChecked={this.props.userinfo.isChecked} color="#fff" unCheckColor="#fff" size={16} onClick={() => {
                debugger
                this.props.onChangeTextFn({...this.props.userinfo, isChecked: !this.props.userinfo.isChecked})
              }} />
              <Text style={styles.checkBoxText}>记住密码</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
    )
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 80
  },
  btnEye: {
    position: 'absolute',
    top: 68,
    right: 28
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)'
  },
  checkBox: {
    width: DEVICE_WIDTH,
    ...DisplayStyle('row', 'center', 'flex-end'),
    paddingRight: 20
  },
  checkBoxInner: {
    width: 100,
    ...DisplayStyle('row', 'center', 'flex-end'),
  },
  data_item_check: {
    width: 22
  },
  checkBoxText: {
    color: '#fff',
    fontSize: 12
  }
})
