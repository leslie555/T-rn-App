import React from 'react'
import {View, TextInput, Platform, StyleSheet, TouchableOpacity, Text} from 'react-native'
import { Container } from '../../../../styles/commonStyles'
import { WebView } from 'react-native-webview'
import {saveImage} from '../../../../utils/imgUnit'

import Share from "../../../../components/Share";
import {HtmlToPDF} from "../../../../api/system";
import {baseURL, gwUrl, pdfDownloadUrl} from "../../../../config";
import storage from "../../../../utils/storage";

import { withNavigation } from 'react-navigation'
import {
  Header,
  ButtonGroup,
  FullModal
} from '../../../../components'
import { connect } from 'react-redux'

class SignUpDepositBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingText: '',
      loading: true,
      filePath: ''
    }
    this.shareRef = null
    this.willFocusSubscription = null
    this.orderKeyID = this.props.navigation.getParam('KeyID', '')
    this.url = `${gwUrl}/external/OrderTemplate?KeyID=${this.orderKeyID}&to=${props.token}`
    this.count = 0
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        // 退后刷新
        this.count++
        if(this.count>1){
          this.webViewRef.reload()
        }
      }
    )
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove()
  }
  handleLoading(num) {
    if (num < 1) {
      this.setState({
        loadingText: Math.floor(num * 100) + '%'
      })
    }
  }
  handleLoadingEnd() {
    this.setState({
      loading: false
    })
  }
  handleBack(data) {
    //
  }
  handleChange(data) {
    //
  }
  handleTenantSignUpClick = () => {
    this.props.navigation.navigate('AgentSignUpH5Container', {
      KeyID: this.orderKeyID,
      type: 0
    })
  }
  handleManagerSignUpClick = () => {
    this.props.navigation.navigate('AgentSignUpH5Container', {
      KeyID: this.orderKeyID,
      type: 1
    })
  }

  sharePDF() {
    this.setState({
      loading: true,
      loadingText: `正在构建分享文件...`
    })
    storage.get('token').then(token => {
      HtmlToPDF({
        Url: encodeURIComponent(this.url.replace(gwUrl,pdfDownloadUrl)),
      }).then(({ Data }) => {
        saveImage(baseURL + Data,'pdf','定金条').then((path)=>{
          this.setState({
            loading: false,
            filePath: path
          })
          this.shareRef.openDialog()
        })
      }).catch(() => {
        this.setState({
          loading: false
        })
      })
    })
  }

  render() {
    return (
      <View style={Container}>
        <Share
            ref={(ref) => {
              this.shareRef = ref
            }}
            showFriends={false}
            showCopy={false}
            title={'房源预定-定金收条'}
            type="file"
            description={`房源预定-定金收条`}
            filePath={this.state.filePath}
            fileExtension=".pdf"/>
        <Header title={'定金条'}  headerRight={
          <TouchableOpacity onPress={() => this.sharePDF()}>
            <Text style={{
              fontSize: 14,
              color: "#fff"
            }}>分享PDF</Text>
          </TouchableOpacity>
        } />
        <FullModal
          loadingText={this.state.loadingText}
          visible={this.state.loading}
        />
        <WebView
          ref={ref => (this.webViewRef = ref)}
          source={{ uri: this.url }}
          onMessage={event => {
            this.handleBack(event.nativeEvent.data)
          }}
          onLoadProgress={({ nativeEvent }) => {
            this.handleLoading(nativeEvent.progress)
          }}
          onLoadEnd={() => {
            this.handleLoadingEnd()
          }}
          onNavigationStateChange={navState => {
            this.handleChange(navState)
          }}
          mixedContentMode='always'
          cacheEnabled={false}
          style={{ flex: 1 }}
        />
        <ButtonGroup
          options={[
            { label: '租房人签字', value: 'TenantSignUp' },
            { label: '收款人签字', value: 'ManagerSignUp' }
          ]}
          handleTenantSignUpClick={this.handleTenantSignUpClick}
          handleManagerSignUpClick={this.handleManagerSignUpClick}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({})

const mapStateToProps = state => ({
  token: state.user.token
})
export default connect(mapStateToProps)(withNavigation(SignUpDepositBar))
