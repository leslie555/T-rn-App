import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { List, Header, SearchBar } from '../../../../components'
import styles from '../AgreeFreeStatement/style'
import IconFont from '../../../../utils/IconFont'
import Toast from 'react-native-root-toast'
import { ShowConsentTerminateContractList } from '../../../../api/statementOrAgree'
import { dateFormat } from '../../../../utils/dateFormat'
import storage from '../../../../utils/storage'
import { connect } from 'react-redux'

class ContractRemoveAgree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Keyword: ''
      },
      list: [],
      searchBarVisible: false
    }
  }

  componentWillMount() {}
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {}
    )
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {}
    )
  }
  handleAdd() {
    this.props.navigation.navigate('AgentEditContractRemoveAgree', {
      editType: 1,
      KeyID: '',
      token: ''
    })
  }
  toggleSearchBar() {
    this.setState({
      searchBarVisible: !this.state.searchBarVisible
    })
  }
  searchByKeyword(text) {
    this.state.form.parm.page = 1
    this.state.form.Keyword = text
    this.setState({
      form: { ...this.state.form }
    })
  }
  renderApprovalItem({ item }) {
    return (
      <View style={styles.outside_box}>
        <View style={styles.inside_box}>
          <TouchableOpacity
            onPress={() => {
              storage.get('token').then(token => {
                this.props.navigation.navigate(
                  'AgentDetailContractRemoveAgree',
                  { content: item, token: token }
                )
              })
            }}
          >
            <View style={styles.item_title}>
              <View style={styles.item_title_bothCon}>
                <Text style={styles.item_title_blank}></Text>
                <Text style={styles.item_title_text}>
                  {item.OwnerName} &nbsp;&nbsp;&nbsp;{item.OwnerPhone}
                </Text>
              </View>
              <View>
                <Text style={styles.item_title_textRight}>
                  {dateFormat(item.ReturnDate)}
                </Text>
              </View>
            </View>
            <View style={styles.line} />
            <View style={styles.con_body}>
              <View style={styles.item_info}>
                <View style={styles.type_title_container}>
                  <Text style={styles.type_title}>
                    业主身份证：{item.OwnerIDCard}
                  </Text>
                </View>
              </View>
              <View style={styles.content_container}>
                <View style={styles.content_container_time}>
                  <Text style={styles.content_title}>地址：</Text>
                  <Text style={styles.content_text}>{item.HouseLocation}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const renderItem = ({ item }) => {
      return this.renderApprovalItem({ item })
    }
    return (
      <View style={styles.keep_container}>
        <Header
          title="合同解除同意书"
          headerRight={
            <View style={styles.header_right_content}>
              <TouchableOpacity
                onPress={() => {
                  this.toggleSearchBar()
                }}
              >
                <IconFont name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleAdd()
                }}
              >
                <View>
                  <Text style={styles.header_right_text}>新增</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        >
          {this.state.searchBarVisible && (
            <SearchBar
              hideLeft
              placeholder={'请输入姓名/电话'}
              onChangeText={text => {
                this.searchByKeyword(text)
              }}
              onCancel={text => {
                this.toggleSearchBar()
                text && this.searchByKeyword('')
              }}
              onClear={() => {
                this.searchByKeyword('')
              }}
            />
          )}
        </Header>
        <List
          request={ShowConsentTerminateContractList}
          form={this.state.form}
          listKey={'AgentContractRemoveAgree'}
          setForm={form => this.setState({ form })}
          renderItem={renderItem}
        />
      </View>
    )
  }
}

export default connect()(ContractRemoveAgree)
