import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dimensions from 'Dimensions'
import { StyleSheet, View, TextInput, Image } from 'react-native'

export default class UserInput extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={styles.inputWrapper}>
        <Image source={this.props.source} style={styles.inlineImg} />
        <TextInput
          defaultValue={this.props.value}
          onChangeText={this.props.onChangeTextFn.bind(this)}
          style={styles.input}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor='white'
          underlineColorAndroid='transparent'
        />
      </View>
    )
  }
}

UserInput.propTypes = {
  source: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string
}

const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  input: {
    flex:1,
    height: 40,
    paddingLeft: 45,
    paddingVertical: 0,
    color: '#ffffff'
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 15,
    top: 9
  }
})
