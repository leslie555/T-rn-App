import React, { Fragment } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { TabBar, SearchBar } from '../../../../../components'
import { Container } from '../../../../../styles/commonStyles'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import IconFont from '../../../../../utils/IconFont'
import ActionSheet from 'react-native-actionsheet'
import List from './SignUpOnlineList'

export default class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      page: 0
    }
    this.TenantList = null
    this.OwnerList = null
  }

  showSearch = () => {
    this.setState({
      isShow: true
    })
  }

  addContract = () => {
    this.ActionSheet.show()
  }

  onChangeText = text => {
    const Keyword = text
    if (this.state.page === 0) {
      this.TenantList.search(Keyword)
    } else {
      this.OwnerList.search(Keyword)
    }
  }
  onCancel = text => {
    if (text) {
      const Keyword = ''
      if (this.state.page === 0) {
        this.TenantList.search(Keyword)
      } else {
        this.OwnerList.search(Keyword)
      }
    }
    this.setState({
      isShow: false
    })
  }
  onClear = () => {
    const Keyword = ''
    if (this.state.page === 0) {
      this.TenantList.search(Keyword)
    } else {
      this.OwnerList.search(Keyword)
    }
  }

  onActionSheetPress(idx) {
    // idx:0=>新增租客合同,1=>新增业主合同
    if (idx === 0) {
      this.props.navigation.navigate('AgentEditTenantContract')
    } else if (idx === 1) {
      this.props.navigation.navigate('AgentEditOwnerContract')
    }
  }

  onChangeTab = ({ i }) => {
    this.setState({
      page: i
    })
  }
  render() {
    return (
      <View style={Container}>
        <ScrollableTabView
          tabBarActiveTextColor={'#fff'}
          tabBarInactiveTextColor={'rgb(153,209,254)'}
          tabBarTextStyle={{ fontSize: 17 }}
          initialPage={0}
          page={this.state.page}
          locked={this.state.isShow}
          onChangeTab={this.onChangeTab}
          renderTabBar={() => (
            <TabBar
              headerRight={
                <Fragment>
                  <TouchableOpacity onPress={this.showSearch}>
                    <IconFont name='search' size={20} color='white' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.addContract}>
                    <Text style={styles.addButtonText}>新增</Text>
                  </TouchableOpacity>
                </Fragment>
              }
            >
              {this.state.isShow && (
                <SearchBar
                  placeholder={'电话/房源名称/房间号/小区名称'}
                  onChangeText={this.onChangeText}
                  onCancel={this.onCancel}
                  onClear={this.onClear}
                />
              )}
            </TabBar>
          )}
        >
          <List
            tabLabel='租客'
            ref={TenantList => {
              this.TenantList = TenantList
            }}
          />
          <List
            tabLabel='业主'
            isOwner
            ref={OwnerList => {
              this.OwnerList = OwnerList
            }}
          />
        </ScrollableTabView>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'新增合同'}
          options={['新增租客合同', '新增业主合同', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={idx => {
            this.onActionSheetPress(idx)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 20
  }
})
