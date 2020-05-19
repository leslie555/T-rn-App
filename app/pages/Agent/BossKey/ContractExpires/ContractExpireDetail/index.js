import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  BackHandler
} from 'react-native'
import Placeholder from 'rn-placeholder'
import { dateFormat, diffTime } from '../../../../../utils/dateFormat'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { withNavigation } from 'react-navigation'
import { FullModal, Header } from '../../../../../components'
import OwnerTab from '../components/OwnerTab'
import TenantTab from '../components/TenantTab'
import SignUpTab from '../components/SignUpTab'
import BillTab from '../components/BillTab'
import BookKeeping from '../components/BookKeeping'
import { connect } from 'react-redux'
import {
  CommonColor,
  DisplayStyle,
  Container,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'



class ContractExpireDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailData: {},
      isReady: true,
      filteredInfo: {},
      loading: false,
      page: 0
    }
    this.KeyID = 0
    this.isOwner = false
    this.backHandler = null
    this.viewDidAppear = null
    this.willBlurSubscription = null
  }

  componentWillMount() {
    this.KeyID = this.props.navigation.getParam('id')
    this.isOwner = this.props.navigation.getParam('isOwner')
    this.isBackToList = this.props.navigation.getParam('isBackToList', false)
    this.isBackToBill = this.props.navigation.getParam('isBackToBill', false)
    this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
      if (obj.state.params && obj.state.params.page != undefined) {
        this.setState({
          page: obj.state.params.page
        })
      }
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBack
      )
      this.state.isReady && this.filterInfo(this.props.detailData)
    })
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        console.log('removeContractDetialBackHandler')
        this.backHandler && this.backHandler.remove()
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.detailData) !==
      JSON.stringify(nextProps.detailData)
    ) {
      this.filterInfo(nextProps.detailData)
    }
  }
  componentWillUnmount() {
    this.backHandler && this.backHandler.remove()
    this.viewDidAppear && this.viewDidAppear.remove()
    this.willBlurSubscription && this.willBlurSubscription.remove()
  }

  onBack = () => {
    if (this.isBackToList) {
      this.props.navigation.navigate('AgentContractList', {
        param: {
          page: this.isOwner ? 2 : 1
        }
      })
      return true
    } else if (this.isBackToBill) {
      this.props.navigation.navigate('AgentWaitCollectBill')
      return true
    } else {
      this.props.navigation.goBack()
      return true
    }
  }
  getFilterStatus(status) {
    switch (status) {
      case 1:
        return {
          label: '暂存',
          color: 'rgb(255,153,0)'
        }

      case 2:
        return {
          label: '待确认',
          color: 'rgb(255,90,90)'
        }

      case 3:
        return {
          label: '签约成功',
          color: 'rgb(56,158,242)'
        }

      case 4:
        return {
          label: '已退房',
          color: 'rgb(153,153,153)'
        }
      default:
        return {}
    }
  }
 

  handleCheckoutClick = () => {
    // 点击退房的回调
    const houseInfo = this.props.detailData.HouseInfo
    this.props.navigation.navigate('AgentCheckOutContract', {
      contractID: this.KeyID,
      editType: 0,
      type: this.isOwner ? 0 : 1,
      houseInfo: {
        HouseName: houseInfo.HouseName,
        HouseKey: houseInfo.HouseKey,
        HouseID: houseInfo.KeyID
      }
    })
  }

  onChangeTab = ({ i }) => {
    this.setState({
      page: i
    })
  }
  render() {
    const { filteredInfo } = this.state
    return (
      <View style={Container}>
        <Header title={'合同详情'} leftClick={this.onBack} />

        <FullModal visible={this.state.loading} />

        
        <View style={style.headContainer}>
          <View style={style.headTitleContainer}>
            <Placeholder.Line
              color='#eeeeee'
              width='50%'
              textSize={16}
              onReady={this.state.isReady}
            >
              <Text style={style.headTitle}>333</Text>
            </Placeholder.Line>
          </View>
          <View style={style.headStatusContainer}>
            <Placeholder.Line
              color='#eeeeee'
              width='50%'
              textSize={14}
              onReady={this.state.isReady}
            >
              <Text>
                888元/月
              </Text>
            </Placeholder.Line>
            <Text
              // style={{
              //   ...style.statusText,
              //   color: this.state.isReady
              //     ? filteredInfo.statusText.color
              //     : '#fff'
              // }}
            >
              777
            </Text>
          </View>
          <Placeholder.Line
            color='#eeeeee'
            width='80%'
            textSize={14}
            onReady={this.state.isReady}
          >
            <Text>444</Text>
          </Placeholder.Line>

        </View>

         <View style={style.tabContainer}>
           <ScrollableTabView
            tabBarUnderlineStyle={{
              backgroundColor: CommonColor.color_primary,
              height: 2
            }}
            locked={!this.state.isReady}
            tabBarBackgroundColor={CommonColor.color_white}
            tabBarActiveTextColor={CommonColor.color_primary}
            tabBarInactiveTextColor={'rgb(54,54,54)'}
            tabBarTextStyle={{ fontSize: 17 }}
            prerenderingSiblingsNumber={Infinity}
            initialPage={0}
            page={this.state.page}
            onChangeTab={this.onChangeTab}
          >
            {this.isOwner ? (
              <OwnerTab
                isReady={this.state.isReady}
                data={this.props.detailData}
                isOwner={this.isOwner}
                tabLabel={'业主'}
              />
            ) : 
            (
              <TenantTab
                isReady={this.state.isReady}
                data={this.props.detailData}
                isOwner={this.isOwner}
                tabLabel={'租客'}
              />
            )
            }
            <SignUpTab
              isReady={this.state.isReady}
              data={this.props.detailData}
              isOwner={this.isOwner}
              tabLabel='签约'
            />
            <BillTab
              isReady={this.state.isReady}
              data={this.props.detailData}
              isOwner={this.isOwner}
              tabLabel='账单'
            />
            <BookKeeping
              isReady={this.state.isReady}
              data={this.props.detailData}
              isOwner={this.isOwner}
              tabLabel='记账'
            />
          </ScrollableTabView>
        </View>

      </View>
    )
  }
}
const style = StyleSheet.create({
  headContainer: {
    ...DisplayStyle('column', 'flex-start', 'space-around'),
    height: 113,
    width: DEVICE_WIDTH,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonColor.color_white
  },
  headTitleContainer: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    height: 50,
    width: DEVICE_WIDTH - 30,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  headTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(54,54,54)'
  },
  headStatusContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 30
  },
  statusText: {
    fontSize: 16
  },
  tabContainer: {
    flex: 1,
    marginTop: 15
  }
})

const mapToProps = store =>{ 
  console.log("store数据", store.contract)
  return ({ detailData: store.contract.detailData })}
export default connect(mapToProps)(withNavigation(ContractExpireDetail))