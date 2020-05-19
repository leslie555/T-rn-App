import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { List, Header, SearchBar } from '../../../../../components'
import styles from '../DetailAgreeFreeStatement/style'
import { ButtonGroup, FullModal } from '../../../../../components'
import { baseURL, gwUrl, pdfDownloadUrl } from '../../../../../config'
import { saveImage } from '../../../../../utils/imgUnit'
import storage from '../../../../../utils/storage'
import Share from '../../../../../components/Share'
import { HtmlToPDF } from '../../../../../api/system'
import { ConsentTerminateContractDetail } from '../../../../../api/statementOrAgree'

class DetailContractRemoveAgree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingText: '',
      loading: true
    }
    this.webViewRef = null
    this.count = 0
    this.AllData = props.navigation.state.params.content
    this.KeyID = props.navigation.state.params.content.KeyID
    this.token = props.navigation.state.params.token
    this.url = `${gwUrl}/TerminationConsent/index?KeyID=${this.KeyID}&to=${this.token}`
    console.log(this.url)
    this.btnOptions = [
      { label: '修改', value: 'Edit' },
      { label: '业主签字', value: 'Sign' }
    ]
  }

componentWillMount() {
    this.initData()
}

initData() {
    this.getDetail(this.KeyID)
}
// 获取一条合同解除同意书详情
getDetail(id) {
    this.setState({
        loading: true
    })
    const fn = ConsentTerminateContractDetail
    fn({
        KeyID: id
    }).then(({Data}) => {
      this.AllData = Data
    }).catch(res =>{
        this.setState({
            loading: false
        })
    })
}

  sharePDF() {
    this.setState({
      loading: true,
      loadingText: `正在构建分享文件...`
    })
    storage.get('token').then(token => {
      HtmlToPDF({
        Url: encodeURIComponent(this.url.replace(gwUrl, pdfDownloadUrl))
      })
        .then(({ Data }) => {
          saveImage(baseURL + Data, 'pdf', '解除同意书').then(path => {
            this.setState({
              loading: false,
              filePath: path
            })
            this.shareRef.openDialog()
          })
        })
        .catch(() => {
          this.setState({
            loading: false
          })
        })
    })
  }
  handleEdit() {
    console.log('修改:')
    this.props.navigation.navigate('AgentEditContractRemoveAgree', {
      editType: 2,
      KeyID: this.KeyID,
      token: this.token,
      AllData: this.AllData
    })
  }
  handleSign() {
    this.props.navigation.navigate('AgentSignUpH5Container', {
      KeyID: this.KeyID,
      busType: 6
    })
  }
  handleBack() {}
  handleChange() {}
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
  render() {
    return (
      <View style={styles.container}>
        <Share
          ref={ref => {
            this.shareRef = ref
          }}
          showFriends={false}
          showCopy={false}
          title={'解除同意书'}
          type="file"
          description={`解除同意书`}
          filePath={this.state.filePath}
          fileExtension=".pdf"
        />
        <Header
          title="详情"
          headerRight={
            <TouchableOpacity
              onPress={() => {
                this.sharePDF()
              }}
            >
              <Text style={styles.header_right_text}>分享pdf</Text>
            </TouchableOpacity>
          }
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
          mixedContentMode="always"
          cacheEnabled={false}
          style={{ flex: 1 }}
        />
        <FullModal
          loadingText={this.state.loadingText}
          visible={this.state.loading}
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

export default DetailContractRemoveAgree
