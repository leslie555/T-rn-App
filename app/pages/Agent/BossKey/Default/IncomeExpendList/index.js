import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Header, List } from '../../../../../components'
import { Container } from '../../../../../styles/commonStyles'
import { SelectBossDefaultInOrOut } from '../../../../../api/bossKey'
import ListItem from './components/ListItem'
class IncomeExpendList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        CityCode: '',
        ContractType: 0,
        ReportTimeType: 0,
        InOrOutType: 0, // 1:收入  2:支出
        StartTime: '',
        FullID: ''
      }
    }
  }
  componentWillMount() {
    this.fetchData()
  }
  fetchData() {
    const {
      InOrOutType,
      CityCode,
      ContractType,
      ReportTimeType,
      StartTime,
      FullID
    } = this.props.navigation.state.params
    this.state.form.InOrOutType = InOrOutType
    this.state.form.CityCode = CityCode
    this.state.form.FullID = FullID
    this.state.form.ContractType = ContractType
    this.state.form.ReportTimeType = ReportTimeType
    this.state.form.StartTime = StartTime
    this.setState({
      form: { ...this.state.form }
    })
    console.log(this.props.navigation.state.params)
  }

  render() {
    const renderItem = ({ item }) => {
      return <ListItem item={item} />
    }
    return (
      <View style={[styles.contain_body, Container]}>
        <Header title={this.state.form.InOrOutType === 1 ? '收入' : '支出'} />
        <View style={styles.content_top}>
          <List
            request={SelectBossDefaultInOrOut}
            form={this.state.form}
            setForm={form => this.setState({ form })}
            listKey={'BossIncomeExpendList'}
            primaryKey={'HouseName'}
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
    paddingTop: 6,
    flex: 1
  }
})

export default IncomeExpendList
