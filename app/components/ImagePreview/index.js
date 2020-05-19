import React, { Component } from 'react'
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native'
import { DEVICE_WIDTH, DisplayStyle } from '../../styles/commonStyles'
import { getThumbImgUrl } from '../../utils/imgUnit'
import ImageViewer from '../ImageViewer'
import AliImage from '../AliImage'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      index: 0
    }
  }
  static defaultProps = {
    imgSrc: []
  }
  openImageViewer(index) {
    this.setState({
      visible: true,
      index
    })
  }

  closeImageViewer() {
    debugger
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <View style={style.imgsContainer}>
        {this.props.imgSrc.map((val, idx) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.openImageViewer(idx)
              }}
              style={{ ...style.imgItem, marginLeft: idx % 3 === 0 ? 0 : 10 }}
              key={idx}
            >
              <AliImage
                source={{
                  uri: getThumbImgUrl(val.ImageLocation)
                }}
                style={{
                  width: 105,
                  height: 105,
                  borderRadius: 5
                }}
              />
            </TouchableOpacity>
          )
        })}
        <ImageViewer
          data={this.props.imgSrc}
          visible={this.state.visible}
          index={this.state.index}
          onClose={() => this.closeImageViewer()}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  imgsContainer: {
    width: DEVICE_WIDTH,
    padding: 10,
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flexWrap: 'wrap'
  },
  imgItem: {
    width: 105,
    height: 105,
    marginBottom: 15,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 5
  }
})
