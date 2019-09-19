import React, {Component} from 'react'
import {Platform, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import {DefalultHeader_Title, DefalutHeader, DefalutHeader_Left, DefalutHeader_Right} from '../../styles/commonStyles'
import styles from './style'
import {withNavigation} from 'react-navigation'
import IconFont from '../../utils/IconFont'
import PropTypes from 'prop-types';

class Header extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    leftClick: null,
    hideLeft: false,
    title: '',
    headerRight: null,
    style: {}
  }

  static propTypes = {
    leftClick: PropTypes.func, // 左边后退按钮点击事件
    hideLeft: PropTypes.bool, // 是否隐藏后退键
    title: PropTypes.string, // 标题
    headerRight: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.bool
    ]), // 右侧显示的组件
    style: PropTypes.object, // 样式
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('#00000000', true)
    }
  }

  onPress = () => {
    if (this.props.leftClick) {
      this.props.leftClick()
      return
    }
    this.props.navigation.pop()
  }

  render() {
    return (
        <View style={[styles.defaultHeader, this.props.style]}>
          {!this.props.hideLeft && <TouchableOpacity
              style={styles.defaultHeaderLeft}
              onPress={this.onPress}
          >
            <IconFont name='back' size={20} color='white'/>
          </TouchableOpacity>}
          {this.props.children ? this.props.children :
              <Text style={styles.defaultHeaderTitle}>{this.props.title}</Text>}
          <View style={styles.defaultHeaderRight}>{this.props.headerRight}</View>
        </View>
    )
  }
}

export default withNavigation(Header)
