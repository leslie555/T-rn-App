import React from 'react'
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Container } from '../../../../styles/commonStyles'
import { WebView } from 'react-native-webview'
import { saveImage } from '../../../../utils/imgUnit'

import Share from '../../../../components/Share'
import { HtmlToPDF } from '../../../../api/system'
import {
  SearchAfterSaleSign,
  SubmitSubletApproval
} from '../../../../api/tenant'
import { baseURL, gwUrl, pdfDownloadUrl } from '../../../../config'
import storage from '../../../../utils/storage'

import { withNavigation } from 'react-navigation'
import { ButtonGroup, FullModal, Header } from '../../../../components'
import { connect } from 'react-redux'
import Toast from 'react-native-root-toast'
import store from '../../../../redux/store/store'
import { updateList } from '../../../../redux/actions/list'
import { updateContractDetail } from '../../../../redux/actions/contract'

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
    this.willBlurSubscription = null
    this.contractID = this.props.navigation.getParam('contractID', '')
    this.isDetail = this.props.navigation.getParam('isDetail', false)
    this.url = `${gwUrl}/SubletAgreement?TenContractID=${this.contractID}&to=${props.token}`
    console.log(this.url)
    this.count = 0
    this.submitAuditReady = false
    this.interval = null // 轮训循环器
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
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.handleClosed()
      }
    )
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove()
    this.handleClosed()
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

  handleOpen() {
    this.checkSignInfo()
    this.interval = setInterval(() => {
      this.checkSignInfo()
    }, 5000)
  }

  handleClosed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  checkSignInfo() {
    SearchAfterSaleSign({
      TenContractID: this.contractID
    })
      .then(({ Data }) => {
        if (Data.TenSignInfo) {
          this.submitAuditReady = true
          this.handleClosed()
        }
      })
      .catch(() => {
        this.handleClosed()
      })
  }

  handleSignUpClick = () => {
    this.props.navigation.navigate('AgentSignUpH5Container', {
      KeyID: this.contractID,
      busType: 2
    })
  }
  handleEditClick = () => {
    // 修改
    this.props.navigation.pop()
  }

  handleSubmitClick = () => {
    if (!this.submitAuditReady) {
      Toast.show('请签完字后再提交审核！', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      return
    }
    this.setState({
      loading: true,
      loadingText: `正在提交中...`
    })
    SubmitSubletApproval({
      TenContractID: this.contractID
    })
      .then(() => {
        this.setState(
          {
            loading: false
          },
          () => {
            setTimeout(() => {
              Alert.alert(
                '提示',
                '提交审核',
                [
                  {
                    text: '确定',
                    onPress: () => {
                      this.changeStore()
                    }
                  }
                ],
                { cancelable: false }
              )
            }, 100)
          }
        )
      })
      .catch(() => {
        this.setState({
          loading: false
        })
      })
  }

  changeStore() {
    const changeParam = {
      AuditStatus: 1,
      RentLeaseStatus: 6
    }
    store.dispatch(
      updateList({
        KeyID: this.contractID,
        key: 'tenantContractList',
        data: changeParam
      })
    )
    //修改详情
    store.dispatch(
      updateContractDetail({
        key: 'TenantContractOperate',
        data: changeParam
      })
    )
    this.props.navigation.navigate('AgentContractDetail', {
      id: this.contractID,
      isOwner: false
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
          saveImage(baseURL + Data, 'pdf', '转租协议').then(path => {
            debugger
            console.log(path)
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

  render() {
    return (
      <View style={Container}>
        <Share
          ref={ref => {
            this.shareRef = ref
          }}
          showFriends={false}
          showCopy={false}
          title={'转租协议'}
          type="file"
          description={`转租协议`}
          filePath={this.state.filePath}
          fileExtension=".pdf"
        />
        <Header
          title={'转租协议'}
          headerRight={
            <TouchableOpacity onPress={() => this.sharePDF()}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff'
                }}
              >
                分享PDF
              </Text>
            </TouchableOpacity>
          }
        />
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
          mixedContentMode="always"
          cacheEnabled={false}
          style={{ flex: 1 }}
        />
        {!this.isDetail && (
          <ButtonGroup
            options={[
              {
                label: '修改',
                value: 'Edit',
                color: '#389ef2',
                iconName: 'xiugai-'
              },
              {
                label: '提交',
                value: 'Submit',
                color: '#389ef2',
                iconName: 'fasong-'
              },
              {
                label: '签字',
                value: 'SignUp',
                color: '#389ef2',
                iconName: 'sign'
              }
            ]}
            isIconContainer
            handleSignUpClick={this.handleSignUpClick}
            handleEditClick={this.handleEditClick}
            handleSubmitClick={this.handleSubmitClick}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({})

const mapStateToProps = state => ({
  token: state.user.token
})
export default connect(mapStateToProps)(withNavigation(SignUpDepositBar))
