import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Image } from 'react-native'

import logoImg from './images/logo.png'

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={logoImg} style={styles.image} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 175,
    height: 52,
    resizeMode: 'cover'
  }
})
