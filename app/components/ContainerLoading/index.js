import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {DisplayStyle} from '../../styles/commonStyles';

export default class ChartModal extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    visible: true,
    loadingText: '加载中...'
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否显示
    loadingText: PropTypes.string, // 加载文字
  }

  render() {
    const {loadingText, visible} = this.props
    if (!visible) return null
    return (
        <View style={styles.full_container}
        >
          <ActivityIndicator size="large" color='#389ef2'/>
          <Text style={styles.loading_text}>{loadingText}</Text>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  full_container: {
    // flex: 1,
    // backgroundColor: '#0b1c6e',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    ...DisplayStyle('column', 'center', 'center'),
    zIndex: 1000,
  },
  loading_text: {
    color: '#389ef2'
  }
})
