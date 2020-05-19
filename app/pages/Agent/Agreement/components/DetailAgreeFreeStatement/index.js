import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import { WebView } from 'react-native-webview'
import {saveImage} from '../../../../../utils/imgUnit'
import {FullModal, Header, ButtonGroup} from "../../../../../components";
import Share from "../../../../../components/Share";
import {HtmlToPDF} from "../../../../../api/system";
import {AgreeRentFreeDetail} from '../../../../../api/personalAccount'
import {baseURL, gwUrl, pdfDownloadUrl} from "../../../../../config";
import storage from "../../../../../utils/storage";
// import Toast from "react-native-root-toast";
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import styles from './style'
class DetailAgreeFreeStatement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingText: '',
      loading: true,
      filePath: ''
    }
    this.shareRef = null
    this.willFocusSubscription = null
    this.willBlurSubscription = null
    this.data = this.props.navigation.getParam('data', {})
    this.contractID = this.data.KeyID
    this.url = `${gwUrl}/StatementConsent?KeyID=${this.contractID}&to=${props.token}`
    console.log('this.url:', this.url)
    this.count = 0
    this.submitAuditReady = false
    this.interval = null // 轮训循环器
    this.btnOptions = [
      {label: '修改', value: 'Edit'},
      {label: '声明人签字', value: 'Sign'}
    ]
  }

componentWillMount() {
      this.initData()
  }

initData() {
    this.getDetail(this.contractID)
}
// 获取一条合同解除同意书详情
getDetail(id) {
    this.setState({
        loading: true
    })
    const fn = AgreeRentFreeDetail
    fn({
        KeyID: id
    }).then(({Data}) => {
      this.data = Data
    }).catch(res =>{
        this.setState({
            loading: false
        })
    })
}
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          // 退后刷新
          this.count++
          if (this.count > 1) {
            this.webViewRef.reload()
          }
          this.handleOpen()
        }
    )
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
  handleSharePDF() {
    this.setState({
      loading: true,
      loadingText: `正在构建分享文件...`
    })
    storage.get('token').then(token => {
      HtmlToPDF({
        Url: encodeURIComponent(this.url.replace(gwUrl,pdfDownloadUrl)),
      }).then(({Data}) => {
        saveImage(baseURL + Data, 'pdf', '免租声明书').then((path) => {
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
  handleEdit() {
    this.props.navigation.navigate('AgentEditAgreeFreeStatement', {
      KeyID: this.contractID,
      editType: 1,  // 0新增 1修改
      data: this.data
    })
  }
  handleSign = () => {
    this.props.navigation.navigate('AgentSignUpH5Container', {
      KeyID: this.contractID,
      editType: 1,  // 0新增 1修改
      busType: 5 // 签字接口
    })
  }
  handleBack(data) {}
  handleChange(data) {}
  render() {
    return (
        <View style={styles.container}>
          <Share
            ref={(ref) => {
              this.shareRef = ref
            }}
            showFriends={false}
            showCopy={false}
            title={'免租声明书'}
            type="file"
            description={`免租声明书`}
            filePath={this.state.filePath}
            fileExtension=".pdf"/>
          <Header title="详情" headerRight={
              <TouchableOpacity onPress={() => {
                this.handleSharePDF()
              }}>
                <Text style={styles.header_right_text}>分享pdf</Text>
              </TouchableOpacity>
          }/>
          <FullModal
              loadingText={this.state.loadingText}
              visible={this.state.loading}
          />
          <WebView
              ref={ref => (this.webViewRef = ref)}
              source={{uri: this.url}}
              onMessage={event => {
                this.handleBack(event.nativeEvent.data)
              }}
              onLoadProgress={({nativeEvent}) => {
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
              style={{flex: 1}}
          />
          <View style={styles.footer_btn}>
            <ButtonGroup
                options={this.btnOptions}
                handleEditClick={() => this.handleEdit()}
                handleSignClick={() => this.handleSign()}
            />
          </View>
        </View>
    )
  }
}

const mapStateToProps = state => ({
  token: state.user.token
})
export default connect(mapStateToProps)(withNavigation(DetailAgreeFreeStatement))
