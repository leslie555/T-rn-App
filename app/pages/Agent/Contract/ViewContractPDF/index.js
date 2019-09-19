import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { FullModal, Header } from '../../../../components'
import { getDownloadContract } from '../../../../api/owner'
import {getThumbImgUrl, saveImage} from '../../../../utils/imgUnit'

import { WebView } from 'react-native-webview'
import {viewPDFContract} from "../../../../api/tenant";
import Share from "../../../../components/Share";

export default class ViewContractPDF extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数
    this.title = this.query.type === 1 ? '房屋租赁运营管理委托协议' : '房屋租赁合同'
    this.shareRef = null
    this.state = {
      loadingText: '加载中..',
      visible: false,
      signUrl: null,
      filePath: ''
    }
    // setTimeout(()=>{
    //   this.setState({
    //     signUrl: 'http://192.168.2.26:8088/signResult.html?status=0&contractType=1'
    //   })
    // },1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Share
            ref={(ref) => {
              this.shareRef = ref
            }}
            showFriends={false}
            showCopy={false}
            title={this.title}
            type="file"
            description={this.title}
            filePath={this.state.filePath}
            fileExtension=".pdf"/>
        <Header title={'查看合同'}
                headerRight={
                 <TouchableOpacity onPress={() => this.sharePDF()}>
                    <Text style={{
                      fontSize: 14,
                      color: "#fff"
                    }}>分享</Text>
                  </TouchableOpacity>
                }/>
        <FullModal
          loadingText={this.state.loadingText}
          visible={this.state.visible}
        />
        {this.state.signUrl && (
          <WebView
            source={{ uri: this.state.signUrl }}
            onLoadProgress={({ nativeEvent }) => {
              this.handleLoading(nativeEvent.progress)
            }}
            cacheEnabled={false}
            style={styles.webBox}
          />
        )}
      </View>
    )
  }

  componentWillMount() {
    this.getSignUrl()
  }

  getSignUrl() {
    this.setState({
      visible: true
    })
    viewPDFContract({
      ContractId: this.query.id,
      TemplateType: this.query.type
    }).then(res => {
      this.setState({
        visible: false,
        signUrl: decodeURIComponent(res.Data)
      })
    })
  }

  handleLoading(num) {
    if (num < 1) {
      this.setState({
        visible: true,
        loadingText: Math.floor(num * 100) + '%'
      })
    } else {
      this.setState({
        visible: false
      })
    }
  }

  sharePDF() {
    this.setState({
      visible: true,
      loadingText: `正在构建分享文件...`
    })
    getDownloadContract({
      ContractId: this.query.id,
      TemplateType: this.query.type
    }).then(({ Data }) => {
      saveImage(decodeURIComponent(Data),'pdf',this.title).then((path)=>{
        this.setState({
          visible: false,
          filePath: path
        })
        this.shareRef.openDialog()
      })
    }).catch(() => {
      this.setState({
        visible: false
      })
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webBox: {
    flex: 1
  }
})
