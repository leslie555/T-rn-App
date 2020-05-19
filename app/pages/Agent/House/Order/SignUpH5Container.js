import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import { Container } from '../../../../styles/commonStyles'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { Header, FullModal } from '../../../../components'
import {phoneURL} from "../../../../config";
import Share from "../../../../components/Share";
import {getThumbImgUrl} from "../../../../utils/imgUnit";

class SignUpH5Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingText: '',
      loading: true
    }
    this.shareRef = null
    this.KeyID = this.props.navigation.getParam('KeyID', '')
    this.type = this.props.navigation.getParam('type', 0) // 按业务自己来 可能多个签字的情况来区分
    this.busType = +this.props.navigation.getParam('busType', 0) // 0 预订单签字 1 退房签字 2 转租签字
    this.title = ''
    this.description = ''
    switch (this.busType) {
      case 0:
        this.title = this.type === 0 ? '租房人签字' : '收款人签字'
        this.description = `定金条已经生成，请签字确认`
        break
      case 1:
        this.title = this.type === 0 ? '租房人签字' : '退房人签字'
        this.description = '退房协议已生成,请签字确认'
        break
      case 2:
        this.title = '租房人签字'
        this.description = '转租协议已生成,请签字确认'
        break
      case 5:
        this.title = '声明人签字'
        this.description = '免租声明书已生成,请签字确认'
        break
      case 6:
        this.title = '业主签字'
        this.description = '合同解除同意书已生成,请签字确认'
        break
    }
    const param = {
      id: this.KeyID,
      ty: this.type,
      to: props.token,
      ti: new Date().getTime(),
      bt: this.busType
    }
    const query = Object.entries(param)
      .map(v => {
        const [key, val] = v
        return key + '=' + val
      })
      .join('&')
    this.url = `${phoneURL}ordersign?${query}`
    console.log('this.url:', this.url)
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
    if(this.busType === 6) {
      this.props.navigation.navigate('AgentContractRemoveAgree')
    }else if (this.busType === 5) {
      this.props.navigation.navigate('AgentAgreeFreeStatement')
    } else {
      this.props.navigation.pop()
    }
  }
  render() {
    return (
      <View style={Container}>
        <Share
            ref={(ref) => {
              this.shareRef = ref
            }}
            showFriends={false}
            title={this.title}
            description={this.description}
            thumbImage={getThumbImgUrl(`/funrenting/636945724045887557`)}
            webpageUrl={this.url}/>
        <Header title={this.title}   headerRight={
          <TouchableOpacity onPress={() => this.shareRef.openDialog()}>
            <Text style={{
              fontSize: 14,
              color: "#fff"
            }}>分享签字</Text>
          </TouchableOpacity>
        } />
        <FullModal
          loadingText={this.state.loadingText}
          visible={this.state.loading}
        />
        <WebView
          ref={ref => (this.webViewRef = ref)}
          source={{ uri: this.url }}
          onLoadProgress={({ nativeEvent }) => {
            this.handleLoading(nativeEvent.progress)
          }}
          onLoadEnd={() => {
            this.handleLoadingEnd()
          }}
          onMessage={event => {
            this.handleBack(event.nativeEvent.data)
          }}
          mixedContentMode='always'
          cacheEnabled={false}
          style={{ flex: 1 }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  token: state.user.token
})
export default connect(mapStateToProps)(withNavigation(SignUpH5Container))
