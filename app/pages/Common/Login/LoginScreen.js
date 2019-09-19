import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import Logo from './Logo'
import Form from './Form'
import Wallpaper from './Wallpaper'
import ButtonSubmit from './ButtonSubmit'
import {checkAppUpdate,DownloadModal} from '../../../utils/updateUtil'
import storage from "../../../utils/storage";


class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userinfo: {
        username: '',
        password: '',
        isChecked: false
      }
    }
  }
  componentWillMount() {
    storage.get('loginForm').then((userinfo)=>{
      if(userinfo){
        this.setState({
          userinfo
        })
      }
    })
    this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
      checkAppUpdate()
    })
  }
  componentWillUnmount() {
    // 移除监听
    this.viewDidAppear.remove()
  }
  onChangeTextFn = userinfo => {
    this.setState({ userinfo })
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  render() {
    return (
      <Wallpaper>
        <DownloadModal/>
        <Logo />
        <KeyboardAvoidingView>
          <Form
            onChangeTextFn={this.onChangeTextFn}
            userinfo={this.state.userinfo}
          />
        </KeyboardAvoidingView>
        <ButtonSubmit
          navigation={this.props.navigation}
          userinfo={this.state.userinfo}
        />
      </Wallpaper>
    )
  }
}
export default LoginScreen
