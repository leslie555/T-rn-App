import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import style from './style'
import { Container } from '../../../../styles/commonStyles'
import { CGBApprovalList as getCGBApprovalList } from '../../../../api/approval'
import { connect } from 'react-redux'
import { dateFormat } from '../../../../utils/dateFormat'
import IconFont from '../../../../utils/IconFont/index'
import { Header, List, ListSelector } from '../../../../components'
import SearchBar from '../../../../components/SearchBar'

class CGBApprovalList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchBarVisible: false,
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Type: 1,
        DepID: '',
        Salesman: '',
        BeginTime: '',
        EndTime: '',
        HouseName: '',
        ReviewedStatus: ''
      },
      listConfig: [
        {
          type: 'title',
          title: '状态',
          data: [
            {
              title: '全部',
              value: ''
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
          selectedIndex: 0,
          data: [
            {
              title: '装修',
              value: 1
            },
            {
              title: '维修',
              value: 2
            },
            {
              title: '保洁',
              value: 3
            },
            {
              title: '搬家',
              value: 4
            }
          ]
        }
      ]
    }
    this.ListSelector = null
  }

  toBussinessDetail(item) {
    switch (this.state.form.Type) {
      case 1:
        this.props.navigation.navigate('AgentRenovationApplyDetail', {
          KeyID: item.KeyID
        })
        break
      case 2:
        this.props.navigation.navigate('AgentRepairCleanApplyDetail', {
          KeyID: item.KeyID,
          busType: 0
        })
        break
      case 3:
        this.props.navigation.navigate('AgentRepairCleanApplyDetail', {
          KeyID: item.KeyID,
          busType: 1
        })
        break
      case 4:
        this.props.navigation.navigate('AgentMoveApplyDetail', {
          KeyID: item.KeyID,
          busType: 1
        })
        break
    }
  }

  handleAudit(item) {
    this.props.navigation.navigate('AgentAddPurchaseApproval', {
      KeyID: item.KeyID,
      Type: this.state.form.Type
    })
  }

  toggleSearch() {
    this.setState({
      searchBarVisible: !this.state.searchBarVisible
    })
  }

  searchKeyword(val) {
    this.state.form.HouseName = val
    this.state.form.parm.page = 1
    this.setState({
      form: { ...this.state.form }
    })
  }
  onSelectMenu = (index, subindex, data) => {
    // index = 0  为第一个
    // index = 1  为所属业务
    //subindex 为每一个的下标
    //data  返回过来的数据
    const form = { ...this.state.form }
    form.parm.page = 1
    if (index == 0) {
      /// 1待审核   2已通过   3未通过
      form.ReviewedStatus = data.value
    } else if (index == 1) {
      form.Type = data.value
    }
    this.setState({
      form: form
    })
  }
  renderApprovalItem({ item }) {
    let AuditContent, BusinessType
    switch (this.state.form.Type) {
      case 1:
        AuditContent = ''
        if (item.ywyList && item.ywyList) {
          AuditContent = item.ywyList.map(v => v.ProjectName).join(',')
        }
        BusinessType = '装修'
        break
      case 2:
        AuditContent = item.MaintainContent
        BusinessType = '维修'
        break
      case 3:
        AuditContent = item.CleaningContent
        BusinessType = '保洁'
        break
      case 4:
        AuditContent = item.MovingContent
        BusinessType = '搬家'
        break
    }
    AuditContent =
      AuditContent.length > 20
        ? AuditContent.substr(0, 20) + '...'
        : AuditContent
    return (
      <View style={style.outside_box}>
        <View style={style.inside_box}>
          <View style={style.item_title}>
            <View style={style.vertical_line} />
            <Text style={style.item_title_text}>{BusinessType}</Text>
          </View>
          <View style={style.line} />
          <View style={style.item_info}>
            <View style={style.content_container}>
              <View style={style.content_container_person}>
                <Text style={style.content_title}>申请人：</Text>
                <Text style={style.content_text}>{item.CreaterName}</Text>
              </View>
              <View style={style.content_container_time}>
                <Text style={style.content_title}>房源：</Text>
                <Text style={style.content_text}>{item.HouseName}</Text>
              </View>
            </View>
            <View style={style.type_title_container}>
              <Text style={style.type_title}>内容：</Text>
              <Text style={style.type_content}>{AuditContent}</Text>
            </View>
          </View>
          <View style={style.line} />
          <View style={style.opera_btn_container}>
            {item.ReviewedStatus === 1 && (
              <TouchableOpacity
                style={style.bussiness_type_btn}
                onPress={this.handleAudit.bind(this, item)}
              >
                <Text style={style.btn_text}>审核</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={style.bussiness_type_btn}
              onPress={this.toBussinessDetail.bind(this, item)}
            >
              <Text style={style.btn_text}>业务详情</Text>
            </TouchableOpacity>
          </View>
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
        request={getCGBApprovalList}
        form={this.state.form}
        setForm={form => this.setState({ form })}
        listKey={'CGBApprovalList'}
        renderItem={renderItem}
      />
    )
  }

  render() {
    return (
      <View style={Container}>
        <Header
          title='我的审批'
          headerRight={
            <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
              <IconFont name='search' size={20} color='white' />
            </TouchableOpacity>
          }
        >
          {this.state.searchBarVisible && (
            <SearchBar
              placeholder='请输入房源名称'
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

        <ListSelector
          ref={ListSelector => (this.ListSelector = ListSelector)}
          config={this.state.listConfig}
          onSelectMenu={this.onSelectMenu}
          renderContent={this.renderContent}
        />
      </View>
    )
  }
}

const mapToProps = state => ({ approvalList: state.approvalList })
export default connect(mapToProps)(CGBApprovalList)
