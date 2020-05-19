import React, { Fragment } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Header, SearchBar, List } from '../../../../components'
import { Container } from '../../../../styles/commonStyles'
import ListItem from './ListItem'
import IconFont from '../../../../utils/IconFont'
import { ShowReimbursement } from '../../../../api/pay'

export default class WriteOffList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      form: {
        parm: { size: 10, page: 1 },
        BeginTime: '',
        EndTime: '',
        Status: 0,
        HouseName: '',
        FullIDNew: '',
        Keyword: ''
      }
    }
  }

  showSearch = () => {
    this.setState({
      isShow: true
    })
  }

  reset(text = '') {
    const form = { ...this.state.form }
    form.parm.page = 1
    form.Keyword = text
    this.setState({
      form
    })
  }
  onChangeText = text => {
    this.reset(text)
  }
  onCancel = text => {
    if (text) {
      this.reset()
    }
    this.setState({
      isShow: false
    })
  }
  onClear = () => {
    this.reset()
  }
  addWriteOff = () => {
    this.props.navigation.navigate('AgentAddWriteOff', { editType: 0 })
  }

  render() {
    const renderItem = ({ item }) => {
      return <ListItem item={item} />
    }
    return (
      <View style={Container}>
        <Header
          title={'费用报销'}
          headerRight={
            <Fragment>
              <TouchableOpacity onPress={this.showSearch}>
                <IconFont name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.addWriteOff}>
                <Text style={styles.addButtonText}>新增</Text>
              </TouchableOpacity>
            </Fragment>
          }
        >
          {this.state.isShow && (
            <SearchBar
              hideLeft
              placeholder={'房源名称、姓名、电话'}
              onChangeText={this.onChangeText}
              onCancel={this.onCancel}
              onClear={this.onClear}
            />
          )}
        </Header>
        <List
          request={ShowReimbursement}
          form={this.state.form}
          setForm={form => this.setState({ form })}
          listKey={'writeOffList'}
          renderItem={renderItem}
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
