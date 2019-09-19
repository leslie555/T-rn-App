import React from 'react'
import { AppGetContractTenantList } from '../../../api/login'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { Container } from '../../../styles/commonStyles'
import { List, Header, ListSelector } from '../../../components'
const { width, height } = Dimensions.get('window')

export default function ListDemo() {
  const form = {
    parm: {
      page: 1,
      size: 50
    },
    screen: {
      Keyword: '',
      // 租约状态
      RentLeaseStatus: '',
      // 合同类型
      PaperType: '',
      // 审核状态
      AuditStatus: '',
      // 起止时间
      EndTime: '',
      // 开始选择时间
      StartTime: '',
      // 快速选择
      Timeline: '',
      QuickScreening: ''
    }
  }
  const CONFIG = [
    {
      type: 'subtitle',
      selectedIndex: 1,
      data: [
        { title: '全部', subtitle: '1200m' },
        { title: '自助餐', subtitle: '300m' },
        { title: '自助餐', subtitle: '200m' },
        { title: '自助餐', subtitle: '500m' },
        { title: '自助餐', subtitle: '800m' },
        { title: '自助餐', subtitle: '700m' },
        { title: '自助餐', subtitle: '900m' }
      ]
    },
    {
      type: 'title',
      selectedIndex: 0,
      data: [
        {
          title: '智能排序',
          value: 1
        },
        {
          title: '离我最近',
          value: 2
        },
        {
          title: '好评优先',
          value: 3
        },
        {
          title: '人气最高',
          value: 4
        }
      ]
    }
  ]
  renderContent = () => {
    return (
      <List
        request={AppGetContractTenantList}
        form={form}
        renderItem={renderItem}
      />
    )
  }

  onSelectMenu = (index, subindex, data) => {
    debugger
  }
  const renderItem = ({ item }) => {
    return <Text>{item.TenantName}</Text>
  }
  return (
    <View style={Container}>
      <Header title='列表Demo' />
      <ListSelector
        style={styles.container}
        config={CONFIG}
        onSelectMenu={this.onSelectMenu}
        renderContent={this.renderContent}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: '#F5FCFF'
  },
  text: {
    fontSize: 20,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
