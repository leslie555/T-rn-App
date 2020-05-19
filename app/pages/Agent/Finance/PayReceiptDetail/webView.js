import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { FullModal, Header } from '../../../../components'
import {saveImage} from '../../../../utils/imgUnit'

import { WebView } from 'react-native-webview'
import Share from "../../../../components/Share";
import {HtmlToPDF} from "../../../../api/system";
import {baseURL,gwUrl,pdfDownloadUrl} from "../../../../config";
import storage from "../../../../utils/storage";

export default class ViewContractPDF extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数
    this.title = '收款单据'
    this.shareRef = null
    this.state = {
      loadingText: '加载中..',
      visible: false,
      signUrl: '',
      filePath: ''
    }
    switch (this.query.reciptID) {
      case 0:
        this.state.signUrl = `${gwUrl}/ReceiptOne?KeyID=${this.query.KeyID}&to=${this.query.token}`
        break
      case 1:
        this.state.signUrl = `${gwUrl}/ReceiptTwo?KeyID=${this.query.KeyID}&to=${this.query.token}&money=${this.query.money}`
        break
      case 2:
        this.state.signUrl = `${gwUrl}/ReceiptThree?KeyID=${this.query.KeyID}&to=${this.query.token}`
    }
    debugger
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
            title={`收款单据`}
            type="file"
            description={`收款单据`}
            filePath={this.state.filePath}
            fileExtension=".pdf"/>
        <Header title={this.title}
                headerRight={
                 <TouchableOpacity onPress={() => this.sharePDF()}>
                    <Text style={{
                      fontSize: 14,
                      color: "#fff"
                    }}>分享PDF</Text>
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
            mixedContentMode='always'
            cacheEnabled={false}
            style={styles.webBox}
          />
        )}
      </View>
    )
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
    storage.get('token').then(token => {
      HtmlToPDF({
        Url: encodeURIComponent(this.state.signUrl.replace(gwUrl,pdfDownloadUrl)),
      }).then(({ Data }) => {
        saveImage(baseURL + Data,'pdf','收款单据').then((path)=>{
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
