import React, {Component} from 'react'
import {Alert, Button, Image, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {withNavigation} from 'react-navigation';
import uuid from "../../utils/uuid";
import {getThumbImgUrl} from "../../utils/imgUnit";
import {ImageViewer} from "../../components";
import IconFont from "../../utils/IconFont";
import store from '../../redux/store/store'
import {removeUploadImg} from "../../redux/actions/uploadImg";

class UploadFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      index: 0
    }
    this.uuid = uuid()

    this.didBlurSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          // console.debug('willFocus ', payload);
          const imgs = store.getState().uploadImg[this.props.type][this.uuid] || []
          if (imgs.length > 0) {
            this.props.onChange && this.props.onChange([...this.props.list, ...imgs])
            this.removeUploadImg()
          }
        }
    );
  }

  componentWillMount() {
    console.log(1)
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove()
  }

  addImage() {
    this.props.navigation.navigate('AgentUploadImage', {
      type: this.props.type,
      id: this.uuid
    })
  }
  deleteImage(index){
    // const index = this.props.list.findIndex(x=>x.KeyID===id)
    this.props.list.splice(index,1)
    this.props.onChange && this.props.onChange(this.props.list)
  }

  removeUploadImg() {
    store.dispatch(
        removeUploadImg({
          type: this.props.type
        })
    )
  }

  openImageViewer(index) {
    this.setState({
      visible: true,
      index
    })
  }

  closeImageViewer(){
    debugger
    this.setState({
      visible: false
    })
  }

  render() {
    return (
        <View style={styles.upload_box}>
          <ImageViewer data={this.props.list} visible={this.state.visible} index={this.state.index} onClose={()=>this.closeImageViewer()}></ImageViewer>
          <View style={styles.upload_content}>
            {this.props.list.map((v, i) => {
              return (
                  <View style={styles.upload_image_box} key={i}>
                    <TouchableOpacity onPress={() => {
                      this.openImageViewer(i)
                    }}>
                      <Image
                          style={styles.upload_image}
                          source={{uri: getThumbImgUrl(v.ImageLocation)}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.upload_del_btn} onPress={() => this.deleteImage(i)}>
                      <IconFont name='jiahao1' size={12} color='#fff'></IconFont>
                    </TouchableOpacity>
                  </View>
              )
            })}
            <TouchableOpacity style={styles.upload_btn} onPress={() => this.addImage()}>
              <IconFont name='jiahao' size={46} color='#eeeeee'></IconFont>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

export default withNavigation(UploadFile)
