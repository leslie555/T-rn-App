import React from 'react';
import {Alert, BackHandler, Dimensions, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FullModal, Header} from '../../../../components'
import {personAuth, AddRealNameAuthenticateNeed} from '../../../../api/owner'
import {getQueryString} from '../../../../utils/urlUtil'
import {WebView} from 'react-native-webview';
import IconFont from "../../../../utils/IconFont";
import {getThumbImgUrl} from "../../../../utils/imgUnit";
import Share from "../../../../components/Share";
import store from "../../../../redux/store/store";
import {phoneURL} from "../../../../config";
import {updateContractDetail} from "../../../../redux/actions/contract";
import {updateList} from "../../../../redux/actions/list";
import storage from "../../../../utils/storage";

export default class ContractSign extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.props.navigation.state.params || {} // 路由参数
    this.CustomerId = ''
    this.type = this.query.type//0业主 1 租客
    this.isResultLoad = false
    this.shareRef = null
    this.state = {
      loadingText: '个人信息认证中..',
      visible: false,
      signUrl: null,
      isResultLoadFlag: false
    }
    // setTimeout(()=>{
    //   this.setState({
    //     signUrl: 'http://192.168.2.26:8088/signResult.html?status=0&contractType=1'
    //   })
    // },1000)
    this.backHandler = null
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.handleBack(1)
            return true
          })
        }
    )
    this.willBlurSubscription = this.props.navigation.addListener(
        'willBlur',
        payload => {
          this.backHandler && this.backHandler.remove()
        }
    )
  }

  componentDidMount() {
    this.personAuth()
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
    this.willBlurSubscription.remove();
    this.backHandler && this.backHandler.remove() // replace的时候先进入 componentWillUnmount 再进入willBlur
  }

  render() {
    return (
        <View style={styles.container}>
          <Share
              ref={(ref) => {
                this.shareRef = ref
              }}
              showFriends={false}
              title="合同待签字确认"
              description={`您的${this.type === 0 ? '业主' : '租客'}合同已经生成，请签字确认`}
              thumbImage={getThumbImgUrl(`/funrenting/636945724045887557`)}
              webpageUrl={this.state.signUrl}/>
          <Header title={this.type === 0 ? '业主合同签署' : '租客合同签署'}
                  leftClick={() => {
                    this.handleBack(1)
                  }}
                  headerRight={this.state.signUrl && !this.state.isResultLoadFlag ?
                      <TouchableOpacity onPress={() => this.shareRef.openDialog()}>
                        <IconFont name='fenxiangcopy' size={18} color='#fff'/>
                      </TouchableOpacity> : null
                  }/>
          <FullModal loadingText={this.state.loadingText} visible={this.state.visible}/>
          {this.state.signUrl && <WebView
              ref={ref => this.webViewRef = ref}
              source={{uri: this.state.signUrl}}
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
              cacheEnabled={false}
              mixedContentMode='always'
              style={styles.webBox}/>}
        </View>
    )
  }

  personAuth() {
    this.setState({
      visible: true
    })
    return personAuth({
      Idcard: this.query.IDCard,
      Mobile: this.query.Mobile,
      Name: this.query.Name,
      ElectronicSeal: ''
    }).then(({Data}) => {
      if (Data.Status === 0) {
        this.CustomerId = Data.CustomerId
        this.getSignUrl()
      } else {
        this.authFail('4')
      }
    }).catch(() => {
      this.authFail('3')
      // this.setState({
      //   visible: false
      // })
    })
  }

  authFail(text) {
    console.log('身份认证错误标识' + text)
    this.setState({
      visible: false
    }, () => {
      setTimeout(() => {
        Alert.alert('温馨提示', '请核对客户，身份证和电话。', [
          {
            text: '返回修改', onPress: () => {
              this.props.navigation.goBack()
            }
          }
        ], {cancelable: false})
      }, 100)
    })

  }

  getSignUrl() {
    this.setState({
      loadingText: '签署文件生成中...'
    })
    storage.get('token').then(token => {
      const param = {}
      param.i = this.query.IDCard
      param.m = this.query.Mobile
      param.n = this.query.Name
      param.c = this.query.ContractID
      param.to = token
      param.ty = this.type
      param.cu = this.CustomerId
      param.im = this.query.Img || ''
      param.ti = new Date().getTime()
      debugger
      AddRealNameAuthenticateNeed({
        ReturnTWUrl: JSON.stringify(param),
        CustomerId: this.CustomerId
      }).then(({ Data }) => {
        this.setState({
          signUrl: decodeURIComponent(phoneURL + 'ContractAuthInfo?p=' + Data + '&to=' + param.to)
        })
      }).catch(() => {
        this.setState({
          visible: false
        })
      })
    })
    // return getFddAuthUrl({
    //   ContractId: this.query.ContractID,
    //   CustomerId: this.CustomerId,
    //   TemplateType: this.type + 1,
    //   BCustomerId: '02E27683E4FC2AC722E61A98B5EB4E4A ',
    //   Mobile: this.query.Mobile,
    //   Name: this.query.Name,
    // }).then(({Data}) => {
    //   this.setState({
    //     signUrl: decodeURIComponent(Data)
    //   })
    // }).catch(() => {
    //   this.setState({
    //     visible: false
    //   })
    // })
  }

  handleBack(data) {
    if (data === 1) {
      this.goContractDetail()
    } else if (data) {
      data = JSON.parse(data)
      if (data.status == 0) { // 成功
        this.goContractDetail()
      } else {
        this.webViewRef.goBack()
      }
    }
  }

  goContractDetail() {
    debugger
    if (this.query.path === 'EditContract') {
      this.props.navigation.replace('AgentContractDetail', {
        id: this.query.ContractID,
        isOwner: this.type === 0,
        isBackToList: true
      })
    } else {
      this.props.navigation.goBack()
    }
  }

  handleLoading(num) {
    if (num < 1) {
      this.setState({
        loadingText: Math.floor(num * 100) + '%'
      })
    } else {
      this.setState({
        visible: false
      })
    }
  }

  handleLoadingEnd() {
    if (Platform.OS === 'ios') {
      this.setState({
        visible: false
      })
    }
  }

  handleChange(data) {
    console.log(data.url)
    if (data.url.indexOf('signResult') !== -1 && !this.isResultLoad) {
      this.setState({
        isResultLoadFlag: true
      })
      this.isResultLoad = true
      const status = getQueryString(data.url, 'status')
      const type = getQueryString(data.url, 'contractType')
      if (status === '0') {
        // 成功去修改redux
        // 修改列表
        if (this.query.path !== 'EditContract') {
          store.dispatch(
              updateList({
                KeyID: this.query.ContractID,
                key: this.type === 0 ? 'ownerContractList' : 'tenantContractList',
                data: {
                  [this.type === 0 ? 'LeaseStatus' : 'RentLeaseStatus']: 3,
                  AuditStatus: 1
                }
              })
          )
          //修改详情
          store.dispatch(
              updateContractDetail({
                key:
                    this.type === 0
                        ? 'OwnerContractOperate'
                        : 'TenantContractOperate',
                data: {
                  [this.type === 0 ? 'LeaseStatus' : 'RentLeaseStatus']: 3,
                  AuditStatus: 1
                }
              })
          )
        }
      }
    }
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
