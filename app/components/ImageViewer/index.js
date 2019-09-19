import { Modal, StatusBar, Text } from 'react-native'
import React, { Component } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import { getImgUrl, saveImage } from '../../utils/imgUnit'
import ActionSheet from 'react-native-actionsheet'
import Spinner from 'react-native-spinkit'
import { CommonColor } from '../../styles/commonStyles'

class ImageViewerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      toastVisible: false,
      toastMsg: ''
    }
    this.ActionSheet = {}
    this.currentIndex = 0
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) {
        const images = nextProps.data || []
        this.setState({
          images: images.map((v, i) => {
            return {
              url: getImgUrl(v.ImageLocation)
            }
          })
        })
        this.currentIndex = nextProps.index
        StatusBar.setBackgroundColor('#000')
      } else {
        StatusBar.setBackgroundColor('transparent')
      }
    }
  }

  componentDidMount() {}

  onActionSheetPress(index) {
    if (index === 0) {
      const imgUrl = this.state.images[this.currentIndex].url
      saveImage(imgUrl)
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        onRequestClose={() => this.props.onClose && this.props.onClose()}
      >
        <ImageViewer
          imageUrls={this.state.images}
          onClick={() => {
            this.props.onClose && this.props.onClose()
          }}
          onChange={index => {
            this.currentIndex = index
          }}
          index={this.props.index}
          enableSwipeDown={true}
          loadingRender={() => {
            return (
              <Spinner
                // style={style.spinner}
                isVisible={true}
                size={60}
                type={'ThreeBounce'}
                color={CommonColor.color_primary}
              />
            )
          }}
          onCancel={() => {
            this.props.onClose && this.props.onClose()
          }}
          menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
          onSaveToCamera={index => {
            console.log(index)
          }}
          leaveStayTime={50}
          leaveDistance={1}
          saveToLocalByLongPress={false}
          onLongPress={() => {
            if (this.props.onlyView) return
            this.ActionSheet.show()
          }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={['保存图片', '取消']}
          cancelButtonIndex={1}
          onPress={idx => {
            this.onActionSheetPress(idx)
          }}
        />
      </Modal>
    )
  }
}

export default ImageViewerComponent
