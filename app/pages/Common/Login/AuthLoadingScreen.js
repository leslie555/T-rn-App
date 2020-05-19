import React, { Component } from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import storage from '../../../utils/storage'
export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props)
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          this._bootstrapAsync()
        })
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove()
  }

  _bootstrapAsync = () => {
    storage.get('token').then(token => {
      this.props.navigation.navigate(token ? 'AgentApp' : 'Auth')
    }).catch(()=>{
      this.props.navigation.navigate('Auth')
    })
  }

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    )
  }
}
