import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {List, Header, SearchBar} from "../../../../components"
import styles from './style'
import IconFont from "../../../../utils/IconFont"
import {QueryAgreeRentFreeList} from '../../../../api/personalAccount'
import {dateFormat, diffTime} from '../../../../utils/dateFormat'
import {priceFormat} from '../../../../utils/priceFormat'
import {connect} from 'react-redux'
class AgreeFreeStatement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Keyword: '',
      },
      searchBarVisible: false,
      hideLeft: false
    }
  }
  componentDidMount() {
  }
  handleAdd() {
    this.props.navigation.navigate('AgentEditAgreeFreeStatement', { editType: 0 })
  }
  toggleSearchBar() {
    this.setState({
      searchBarVisible: !this.state.searchBarVisible,
      hideLeft: !this.state.hideLeft
    })
  }
  searchByKeyword(text) {
    this.state.form.parm.page = 1
    this.state.form.Keyword = text
    this.setState({
      form: {...this.state.form}
    })
  }
  renderApprovalItem({item}) {
    return (
      <View style={styles.outside_box}>
      <View style={styles.inside_box}>
          <TouchableOpacity onPress={()=> {
            this.props.navigation.navigate('AgentDetailAgreeFreeStatement', { data: item })
          }}>
              <View style={styles.item_title}>
                  <View style={styles.item_title_bothCon}>
                      <Text style={styles.item_title_blank}></Text>
                      <Text style={styles.item_title_text}>{item.OwnerName} &nbsp;&nbsp;&nbsp;{item.Phone}</Text>
                  </View>
                  <View>
                      <Text style={styles.item_title_textRight}>{dateFormat(item.EndTime)}</Text>
                  </View>
              </View>
              <View style={styles.line}/>
              <View style={styles.con_body}>
                <View style={styles.item_info}>
                    <View style={styles.type_title_container}>
                        <Text style={styles.type_title}>业主身份证：{item.OwnerIDCard}</Text>
                    </View>
                </View>
                <View style={styles.content_container}>
                    <View style={styles.content_container_time}>
                        <Text style={styles.content_title}>免租金额：</Text>
                        <Text style={styles.content_text}>{priceFormat(item.RentMoeny)}</Text>
                    </View>
                    <View style={styles.content_container_time}>
                        <Text style={styles.content_title}>免租期限：</Text>
                        <Text style={styles.content_text}>{diffTime(item.EndTime, item.StartTime)}</Text>
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
        return  this.renderApprovalItem({item})
    }
    return (
        <View style={styles.keep_container}>
          <Header hideLeft = {this.state.hideLeft} title="同意免租声明书" headerRight={
            <View style={styles.header_right_content}>
              <TouchableOpacity onPress={() => {
                this.toggleSearchBar()
              }}>
                <IconFont name='search' size={20} color='white'/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.handleAdd()
              }}>
                <View>
                  <Text style={styles.header_right_text}>新增</Text>
                </View>
              </TouchableOpacity>

            </View>
          }>
          {this.state.searchBarVisible &&
          <SearchBar
              hideLeft
              placeholder={'请输入房东姓名/电话/地址'}
              onChangeText={(text) => {
                this.searchByKeyword(text)
              }}
              onCancel={(text) => {
                this.toggleSearchBar()
                text && this.searchByKeyword('')
              }}
              onClear={() => {
                this.searchByKeyword('')
              }}
          />}
          </Header>
          <List
              request={QueryAgreeRentFreeList}
              form={this.state.form}
              listKey={'AgentAgreeFreeStatement'}
              setForm={form => this.setState({  form })}
              renderItem={renderItem}
          />
        </View>
    )
  }
}

const mapToProps = state => ({allList: state.list})
export default connect(mapToProps)(AgreeFreeStatement)
