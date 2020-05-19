import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import style from './style'
import { CommonColor, Container } from '../../../../styles/commonStyles'
import { QueryApplyListAccordToJurisdiction } from '../../../../api/userCenter'
import { getEnumDesByValue } from '../../../../utils/enumData'
import { connect } from 'react-redux'
import { dateFormat } from '../../../../utils/dateFormat'
import IconFont from '../../../../utils/IconFont/index'
import { Header, List, AddShopListSelector } from '../../../../components'
import { TopMenuItem } from '../../../../components/ListSelector'
import SearchBar from '../../../../components/SearchBar'
import { getEnumListByKey } from '../../../../utils/enumData'

class MyApproval extends Component {
  constructor(props) {
    super(props)
      ; (this.state = {
        searchBarVisible: false,
        form: {
          pageParam: {
            page: 1,
            size: 10
          },
          ApplyName: '',
          BusType: 3,
          AuditStatus: [],
          FullIDNew: ''
        },
        activeIndex: 0,
        // 所属业务
        billProject: [],
        listConfig: [
          {
            type: 'title',
            title: '状态',
            data: [
              {
                title: '全部',
                value: 0
              },
              {
                title: '待审核',
                value: 1
              },
              {
                title: '已通过',
                value: 2
              },
              {
                title: '未通过',
                value: 3
              }
            ]
          },
          {
            type: 'title',
            title: '所属业务',
            data: [
              {
                title: '全部',
                value: 0
              },
              {
                title: '业主合同',
                value: 1
              },
              {
                title: '房源',
                value: 2
              },
              {
                title: '租客合同',
                value: 3
              },
              {
                title: '预定单',
                value: 5
              },
              {
                title: '业主结账',
                value: 14
              },
              {
                title: '租客结账',
                value: 15
              },
              {
                title: '租客转租',
                value: 16
              },
              {
                title: '维修',
                value: 17
              },
              {
                title: '搬家',
                value: 18
              },
              {
                title: '装修',
                value: 19
              },
              {
                title: '保洁',
                value: 20
              }
            ]
          }
        ]
      }),
        (this.ListSelector = null)
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        if (payload.state.params && payload.state.params.type) {
          this.setState({
            activeIndex: +payload.state.params.type
          })
        }
      }
    )
  }
  componentDidMount() {
    // this.getEnumData()
    // 默认为租客合同
    this.ListSelector.manuallySetTitle('租客合同', 2)
  }
  getEnumData() {
    //自定义 项目的组件
    this.belongsToBusiness = getEnumListByKey('BusinessType').filter(item => {
      return item.Description !== '租客账单' && item.Description !== '业主账单'
    })
    const results = this.belongsToBusiness.map((val, i) => {
      return {
        title: val.Description,
        value: val.Value
      }
    })
    console.log(results)
  }

  // 业务详情
  toBussinessDetail(item) {
    // 1: 业主合同 2:房源 3:租客合同
    if (item.BusinessType === 1) {
      this.props.navigation.navigate('AgentContractDetail', {
        id: item.ProfessionID,
        isOwner: true
      })
    } else if (item.BusinessType === 3) {
      this.props.navigation.navigate('AgentContractDetail', {
        id: item.ProfessionID,
        isOwner: false
      })
    } else if (item.BusinessType === 15) {
      this.props.navigation.navigate('AgentCheckOutDetail', {
        contractID: item.ProfessionID,
        isDetail: true
      })
    } else if (item.BusinessType === 16) {
      this.props.navigation.navigate('AgentSubleaseDetail', {
        contractID: item.ProfessionID,
        isDetail: true
      })
    } else if (item.BusinessType === 17) {
      this.props.navigation.navigate('AgentRepairCleanApplyDetail', {
        KeyID: item.ProfessionID,
        busType: 0
      })
    } else if (item.BusinessType === 18) {
      this.props.navigation.navigate('AgentMoveApplyDetail', {
        KeyID: item.ProfessionID,
        busType: 1
      })
    } else if (item.BusinessType === 19) {
      this.props.navigation.navigate('AgentRenovationApplyDetail', {
        KeyID: item.ProfessionID
      })
    } else if (item.BusinessType === 20) {
      this.props.navigation.navigate('AgentRepairCleanApplyDetail', {
        KeyID: item.ProfessionID,
        busType: 1
      })
    }
  }

  toAuditDetail(item) {
    this.props.navigation.navigate('AgentApprovalDetail', {
      id: item.KeyID,
      version: 'new'
    })
  }

  headerVersion() {
    this.props.navigation.navigate('AgentMyApprovalList')
  }

  toggleSearch() {
    this.setState({
      searchBarVisible: !this.state.searchBarVisible
    })
  }

  searchKeyword(val) {
    this.state.form.ApplyName = val
    this.state.form.pageParam.page = 1
    this.setState({
      form: { ...this.state.form }
    })
  }
  onSelectMenu = (index, subindex, data) => {
    console.log(index, subindex, data)
    // index = 0  为第一个
    // index = 1  为所属业务
    //subindex 为每一个的下标
    //data  返回过来的数据
    const form = { ...this.state.form }
    form.pageParam.page = 1
    if (index == 0) {
      /// 1待审核   2已通过   3未通过
      if (subindex === 0) {
        form.AuditStatus = []
      } else {
        form.AuditStatus = [data.value + '']
      }
    } else if (index == 1) {
      form.BusType = data.value
    } else if (index == 2) {
        form.FullIDNew = data.FullID || ''
    }
    this.setState({
      form: form
    })
  }
  renderApprovalItem({ item }) {
    // console.log(item)
    const AuditContent =
      item.AuditContent && item.AuditContent.length > 20
        ? item.AuditContent.substr(0, 20) + '...'
        : item.AuditContent
    let viewInfo,
      hasBtn,
      btnLine = false
    // 仅合同，房源业务可以查看详情
    const canViewType = [1, 3, 15, 16, 17, 18, 19, 20]
    if (item.BusinessType && canViewType.indexOf(item.BusinessType) !== -1) {
      viewInfo = (
        <TouchableOpacity
          style={style.bussiness_type_btn}
          onPress={this.toBussinessDetail.bind(this, item)}
        >
          <Text style={style.btn_text}>业务详情</Text>
        </TouchableOpacity>
      )
      hasBtn = true
    }
    if (hasBtn) {
      btnLine = <View style={style.line} />
    }
    return (
      <View style={style.outside_box}>
        <View style={style.inside_box}>
          <TouchableOpacity onPress={this.toAuditDetail.bind(this, item)}>
            <View style={style.item_title}>
              <View style={style.vertical_line} />
              <Text style={style.item_title_text}>
                {getEnumDesByValue('BusinessType', item.BusinessType)}
              </Text>
            </View>
            <View style={style.line} />
            <View style={style.item_info}>
              <View style={style.content_container}>
                <View style={style.content_container_person}>
                  <Text style={style.content_title}>申请人：</Text>
                  <Text style={style.content_text}>{item.ApplyName}</Text>
                </View>
                <View style={style.content_container_time}>
                  <Text style={style.content_title}>申请时间：</Text>
                  <Text style={style.content_text}>
                    {dateFormat(item.ApplyTime, 'yyyy-MM-dd')}
                  </Text>
                </View>
              </View>
              <View style={style.type_title_container}>
                <Text style={style.type_title}>内容：</Text>
                <Text style={style.type_content}>{AuditContent}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {btnLine}
          {hasBtn ? (
            <View style={style.opera_btn_container}>{viewInfo}</View>
          ) : (
              <View />
            )}
        </View>
      </View>
    )
  }

  // List组件列表
  renderContent = () => {
    const renderItem = ({ item }) => {
      return this.renderApprovalItem({ item })
    }
    return (
      <List
        request={QueryApplyListAccordToJurisdiction}
        pageKey='pageParam'
        form={this.state.form}
        setForm={form => this.setState({ form })}
        listKey={'AgentApprovalNewList'}
        onRefresh={this.onRefresh}
        renderItem={renderItem}
        requestFirst={false}
      />
    )
  }

  render() {
    const customComponent = {
      aaa: (
        <TopMenuItem
          customize
          label={'所属业务'}
          selected={this.state.showPickerVisible}
          onPress={() => {
            this.setState({
              showPickerVisible: !this.state.showPickerVisible
            })
          }}
        />
      )
    }
    return (
      <View style={Container}>
        <Header
          title='我的审批'
          headerRight={
            <View style={style.headerVersion}>
              <TouchableOpacity onPress={this.headerVersion.bind(this)}>
                <Text style={style.headerVersionBtn}>切换旧版本</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
                <IconFont name='search' size={20} color='white' />
              </TouchableOpacity>
            </View>
          }
        >
          {this.state.searchBarVisible && (
            <SearchBar
              placeholder='请输入内容/申请人/合同号'
              onChangeText={text => {
                this.searchKeyword(text)
              }}
              onCancel={text => {
                this.toggleSearch()
                text && this.searchKeyword('')
              }}
              onClear={() => {
                this.searchKeyword('')
              }}
            />
          )}
        </Header>
        <AddShopListSelector
            ref={ListSelector => {
            this.ListSelector = ListSelector
            }}
            selectShop={1}
            config={this.state.listConfig}
            onSelectMenu={this.onSelectMenu}
            renderContent={this.renderContent}
            customComponent={customComponent}
        />
      </View>
    )
  }
}

const mapToProps = state => ({ approvalList: state.approvalList })
export default connect(mapToProps)(MyApproval)
