import React, { Component } from 'react'
import {
  Alert,
  Button,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import styles from './style'
import UploadFileSingle from './single'

class UploadFile extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log(1)
  }

  render() {
    return (
      <View style={styles.upload_box}>
        <View style={styles.upload_content}>
          <UploadFileSingle {...this.props} />
          {this.props.children} 
        </View>
      </View>
    )
  }
}

export default UploadFile
