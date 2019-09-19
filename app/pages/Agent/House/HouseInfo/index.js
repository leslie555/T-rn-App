import React from 'react'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { View } from 'react-native'
import { Container, CommonColor } from '../../../../styles/commonStyles'
import { Header } from '../../../../components'
import OwnerTab from './components/OwnerTab'
import TenantTab from './components/TenantTab'
export default class HouseInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isReady: false
    }
    this.data = {
      houseInfo: '',
      HouseID: '',
      HouseKey: ''
    }
  }

  componentWillMount() {
    this.data.houseInfo = this.props.navigation.getParam('houseInfo', {})
    this.data.HouseID = this.props.navigation.getParam('houseID', '')
    this.data.HouseKey = this.props.navigation.getParam('houseKey', '')
  }
  render() {
    return (
      <View style={Container}>
        <Header title={this.data.houseInfo.HouseName} />
        <ScrollableTabView
          tabBarUnderlineStyle={{
            backgroundColor: CommonColor.color_primary,
            height: 2
          }}
          tabBarBackgroundColor={CommonColor.color_white}
          tabBarActiveTextColor={CommonColor.color_primary}
          tabBarInactiveTextColor={'rgb(54,54,54)'}
          tabBarTextStyle={{ fontSize: 17 }}
          prerenderingSiblingsNumber={Infinity}
          initialPage={0}
        >
          <OwnerTab
            houseKey={this.data.HouseKey}
            houseInfo={this.data.houseInfo}
            tabLabel={'房东信息'}
          />
          <TenantTab HouseID={this.data.HouseID} tabLabel={'租客信息'} />
        </ScrollableTabView>
      </View>
    )
  }
}
