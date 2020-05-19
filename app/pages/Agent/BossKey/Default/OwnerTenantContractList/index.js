import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Header, List } from '../../../../../components'
import ListItem from './components/ListItem'
import { Container } from '../../../../../styles/commonStyles'
import {
  SelectBossDefaultList,
  BossKeyTenantBillingDetailsList
} from '../../../../../api/bossKey'
class OwnerTenantContractList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        CityCode: '',
        ContractType: 0, // 合同类型
        ReportTimeType: 0, // 0:日报表   1:月报表    2:年报表
        StartTime: '',
        PaperType: 0,
        typeKey: 0,
        FullID: ''
      }
    }
  }
  componentWillMount() {
    this.fetchData()
  }
  fetchData() {
    const {
      ReportTimeType,
      CityCode,
      FullID,
      ContractType,
      StartTime,
      typeKey
    } = this.props.navigation.state.params
    this.state.form.ReportTimeType = ReportTimeType
    this.state.form.CityCode = CityCode
    this.state.form.FullID = FullID
    this.state.form.ContractType = ContractType
    this.state.form.PaperType = ContractType
    this.state.form.StartTime = StartTime
    this.state.form.typeKey = typeKey
    this.setState({
      form: { ...this.state.form }
    })
    // console.log(this.props.navigation.state.params);
  }

  render() {
    const requestList =
      this.state.form.typeKey === 2
        ? BossKeyTenantBillingDetailsList
        : SelectBossDefaultList
    const renderItem = ({ item }) => {
      return <ListItem item={item} typeKey={this.state.form.typeKey} />
    }
    return (
      <View style={[styles.contain_body, Container]}>
        <Header
          title={
            this.state.form.typeKey === 1
              ? '租客'
              : this.state.form.typeKey === 0
              ? '业主'
              : this.state.form.typeKey === 2
              ? '出单(租客)'
              : ''
          }
        />
        <View style={styles.content_top}>
          <List
            request={requestList}
            form={this.state.form}
            setForm={form => this.setState({ form })}
            listKey={'BossOwnerTenantContractList'}
            primaryKey={'KeyID'}
            renderItem={renderItem}
          />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  contain_body: {
    position: 'relative',
    flex: 1
  },
  content_top: {
    paddingVertical: 6,
    flex: 1
  }
})

export default OwnerTenantContractList
