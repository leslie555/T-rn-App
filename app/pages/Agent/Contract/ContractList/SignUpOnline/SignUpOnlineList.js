// 电子签约
import React from 'react'
import { View } from 'react-native'
import { List } from '../../../../../components'
import { QueryOwnerElectronicList } from '../../../../../api/owner'
import { QueryTenantElectronicList } from '../../../../../api/tenant'
import { Container } from '../../../../../styles/commonStyles'
import ListItem from '../ListItem'
export default class SignUpOnlineList extends React.Component {
  constructor(props) {
    super(props)
    this.request = props.isOwner
      ? QueryOwnerElectronicList
      : QueryTenantElectronicList
    this.listKey = props.isOwner
      ? 'ownerSignUpOnlineList'
      : 'tenantSignUpOnlineList'
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        KeyWord: ''
      }
    }
  }
  search = keyword => {
    const form = { ...this.state.form }
    form.parm.page = 1
    form.KeyWord = keyword
    this.setState({ form })
  }
  render() {
    const renderItem = ({ item }) => {
      return (
        <ListItem isOwner={this.props.isOwner} isSignUpOnline item={item} />
      )
    }
    return (
      <View style={Container}>
        <List
          request={this.request}
          form={this.state.form}
          setForm={form => this.setState({ form })}
          listKey={this.listKey}
          renderItem={renderItem}
        />
      </View>
    )
  }
}
