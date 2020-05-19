import React, { Component } from 'react'
import Dimensions from 'Dimensions'
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Keyboard,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { getAllEnumData, Login } from '../../../api/login'
import {
  logErrorAction,
  logInAction,
  startAction
} from '../../../redux/actions/user'
import { getEnumList } from '../../../redux/actions/enum'
import storage from '../../../utils/storage'
import Toast from 'react-native-root-toast'

const Spinner = require('react-native-spinkit')
const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height
const MARGIN = 40

class ButtonSubmit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isSpinnerVisible: false
    }

    this.buttonAnimated = new Animated.Value(0)
    this.growAnimated = new Animated.Value(0)
    this._onPress = this._onPress.bind(this)
  }

  login = (username, password, isChecked) => {
    return new Promise((resolve, reject) => {
      this.props.dispatch(startAction)
      Login(username, password)
        .then(data => {
          if (data.BusCode === 1) {
            Alert.alert('温馨提示', '系统检测到当前不是最新版本，需要更新到最新版本才能正常使用！', [
              {text: '检查更新', onPress: () => {
                this.props.checkUpdate()
              }}
            ], {cancelable: false})
            return reject()
          }
          if (!data.Data.jurisdic.Data.Module.length) {
            return reject('您没有登录权限')
          }
          if (isChecked) {
            storage.set('loginForm', {
              username,
              password,
              isChecked
            })
          } else {
            storage.remove('loginForm')
          }
          this.props.dispatch(logInAction(data.Data))
          storage.set('token', data.Data.Token)
          storage.set('password', password)
          storage.set('userinfo', data.Data)
          resolve()
          getAllEnumData().then(res => {
            const data = res.Data || ''
            const parsedData = JSON.parse(data)
            storage.set('enum', parsedData)
            this.props.dispatch(getEnumList(parsedData))
          })
        })
        .catch(err => {
          this.props.dispatch(logErrorAction(err))
          reject()
        })
    })
  }

  _onPress() {
    if (this.state.isLoading) return
    Keyboard.dismiss()
    this.setState({ isSpinnerVisible: true })
    this.setState({ isLoading: true })
    Animated.timing(this.buttonAnimated, {
      toValue: 1,
      duration: 200,
      delay: 150,
      easing: Easing.linear
    }).start()
    this.login(
      this.props.userinfo.username,
      this.props.userinfo.password,
      this.props.userinfo.isChecked
    )
      .then(() => {
        this.setState({ isSpinnerVisible: false })
        this._onGrow()
        setTimeout(() => {
          this.setState({ isLoading: false })
          this.props.navigation.navigate('AgentApp')
          this.buttonAnimated.setValue(0)
          this.growAnimated.setValue(0)
        }, 800)
      })
      .catch(err => {
        if (err) {
          Toast.show(err, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
        }
        this.setState({ isLoading: false })
        Animated.timing(this.buttonAnimated, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear
        }).start()
      })
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start()
  }

  renderLoading() {
    return Platform.OS === 'ios' ? (
      <ActivityIndicator
        animating={this.state.isSpinnerVisible}
        size={'small'}
        color={'#fff'}
      />
    ) : (
      <Spinner
        style={styles.image}
        isVisible={this.state.isSpinnerVisible}
        size={23}
        type={'Circle'}
        color={'#ffffff'}
      />
    )
  }
  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN]
    })
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN]
    })

    return (
      <View style={styles.container}>
        <Animated.View style={{ width: changeWidth }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._onPress}
            activeOpacity={1}
          >
            {this.state.isLoading ? (
              this.renderLoading()
            ) : (
              <Text style={styles.text}>登 录</Text>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[styles.circle, { transform: [{ scale: changeScale }] }]}
          />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#389ef2',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#389ef2',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#389ef2'
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent'
  },
  image: {
    width: 23,
    height: 23
  }
})

const mapStateToProps = state => ({
  user: state.user
})
export default connect(mapStateToProps)(ButtonSubmit)
