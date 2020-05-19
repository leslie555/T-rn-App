import React, { Fragment } from 'react'
import ListItem from './ListItem'
import { View, TouchableOpacity } from 'react-native'
import { GetOderList } from '../../../../api/tenant'
import { SearchBar } from '../../../../components'
import { Container } from '../../../../styles/commonStyles'
import { List, AddShopListSelector, Header } from '../../../../components/index'
import IconFont from '../../../../utils/IconFont'

export default class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Querykey: '',
        AuditStatus: 0,
        EndTime: '',
        HouseName: '',
        OrderStatus: 0,
        StartTime: '',
        FullIDNew: ''
      },
      listConfig: [
        {
          type: 'title',
          title: '预定状态',
          data: [
            {
              title: '全部',
              value: ''
            },
            {
              title: '待付款', // 1待确认2预定成功3预定失败4快到签约5已取消6待付款7已签约
              value: 6
            },
            {
              title: '预定成功',
              value: 2
            },
            /* {
              title: '预定失败',
              value: 3
            }, */
            {
              title: '已取消',
              value: 5
            },
            {
              title: '已签约',
              value: 7
            }
          ]
        },
        {
          type: 'panel', // 更多筛选组件
          title: '更多筛选',
          height: 300,
          components: [
            {
              type: 'datepicker',
              title: '预定提交时间'
            }
          ]
        }
      ]
    }
  }
  componentDidMount() {
    this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
      if (!obj.state.params) {
        return
      } else {
        if (obj.state.params.isRefresh) {
          this.setState({
            form: { ...this.state.form }
          })
          obj.state.params.isRefresh = false
        }
      }
    })
  }

  showSearch = () => {
    this.setState({
      isShow: true
    })
  }
  search(text) {
    const form = { ...this.state.form }
    form.parm.page = 1
    form.Querykey = text
    this.setState({
      form
    })
  }
  onChangeText = text => {
    this.search(text)
  }
  onCancel = text => {
    if (text) {
      this.search('')
    }
    this.setState({
      isShow: false
    })
  }
  onClear = () => {
    this.search('')
  }

  renderContent = () => {
    const renderItem = ({ item }) => {
      return <ListItem isOrder item={item} />
    }
    return (
      <Fragment>
        <List
          request={GetOderList}
          form={this.state.form}
          setForm={form => this.setState({ form })}
          listKey={'orderList'}
          renderItem={renderItem}
        />
      </Fragment>
    )
  }
  onSelectMenu = (index, subindex, data) => {
    const form = { ...this.state.form }
    form.parm.page = 1
    switch (index) {
      case 0:
        form.OrderStatus = data.value
        break
      case 1:
        data.forEach((item, index) => {
          if (!item.data) {
            item.data = {
              value: ''
            }
          }
          switch (index) {
            case 0:
              form.StartTime = item.data.startTime
              form.EndTime = item.data.endTime
              break
          }
        })
      case 2:
        form.FullIDNew = data.FullID
        break
    }
    this.setState({ form })
  }
  render() {
    return (
      <View style={Container}>
        <Header
          title={'我的预定'}
          headerRight={
            <TouchableOpacity onPress={this.showSearch}>
              <IconFont name='search' size={20} color='white' />
            </TouchableOpacity>
          }
        >
          {this.state.isShow && (
            <SearchBar
              placeholder={'房源名称、小区、门牌号、预定人姓名'}
              onChangeText={this.onChangeText}
              onCancel={this.onCancel}
              onClear={this.onClear}
            />
          )}
        </Header>
        <AddShopListSelector
          ref={AddShopListSelector => {
            this.AddShopListSelector = AddShopListSelector
          }}
          selectShop={1}
          config={this.state.listConfig}
          onSelectMenu={this.onSelectMenu}
          renderContent={this.renderContent}
        />
      </View>
    )
  }
}
