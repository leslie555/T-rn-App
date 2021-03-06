import React, { Fragment } from 'react'
import { Button } from 'react-native'
import {
  AppFindTenantContractListPage,
  AppGetTenantContractNumber
} from '../../../../api/tenant'
import {
  AppFindOwnerContractListPage,
  AppGetOwnerContractNumber
} from '../../../../api/owner'
import {
  List,
  AddShopListSelector,
  ListNumberBox
} from '../../../../components'
import ListItem from './ListItem'
import { getEnumListByKey } from '../../../../utils/enumData'

export default class contractList extends React.Component {
  constructor(props) {
    super(props)
    this.statusKey = props.isOwner ? 'LeaseStatus' : 'RentLeaseStatus'
    this.EnumStatusList = getEnumListByKey(this.statusKey).map(v => ({
      title: v.Description,
      value: v.Value
    }))
    this.request = props.isOwner
      ? AppFindOwnerContractListPage
      : AppFindTenantContractListPage
    this.numberRequest = props.isOwner
      ? AppGetOwnerContractNumber
      : AppGetTenantContractNumber
    this.listKey = props.isOwner ? 'ownerContractList' : 'tenantContractList'
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        screen: {
          Keyword: '',
          // 租约状态
          [this.statusKey]: '',
          CommunityName: '',
          HouseNumber: '',
          // 合同类型
          PaperType: '',
          // 审核状态
          AuditStatus: '',
          // 合同开始时间区域的开始时间
          StartTime: '',
          // 合同开始时间区域的结束时间
          EndTime: '',
          // 快速选择
          Timeline: '',
          QuickScreening: '',
          // 合同结束时间区域的开始时间
          EndStartTime: '',
          // 合同结束时间区域的结束时间
          EndEndTime: '',
          FullIDNew: ''
        }
      },
      visible: false,
      numberBoxConfig: [
        {
          type: 'Store',
          label: '暂存',
          value: 0,
          key: 'LeaseStatus'
        },
        {
          type: 'Confirm',
          label: '待确认',
          value: 0,
          key: 'LeaseStatus'
        },
        {
          type: 'InOfDate',
          label: '合同快到期(30天)',
          value: 0,
          key: 'LeaseStatus',
          color: 'rgb(255,90,90)'
        },
        {
          type: 'OutOfDate',
          label: '合同已到期',
          value: 0,
          key: 'LeaseStatus',
          color: 'rgb(255,90,90)'
        }
      ],
      listConfig: [
        /*   {
    type: 'subtitle',
    selectedIndex: 1,
    data: [
      { title: '全部', subtitle: '1200m' },
    ]
  }, */
        {
          type: 'title',
          title: '合同状态',
          data: [
            {
              title: '全部',
              value: ''
            },
            ...this.EnumStatusList
          ]
        },
        {
          type: 'title', // 0电子合同 1纸质合同
          title: '合同类型',
          data: [
            {
              title: '全部类型',
              value: ''
            },
            {
              title: '纸质合同',
              value: 1
            },
            {
              title: '电子合同',
              value: 0
            }
          ]
        },
        /*         {
          type: 'customize', // 自定义组件
          componentKey: 'aaa'
        }, */
        {
          type: 'panel', // 更多筛选组件
          title: '更多筛选',
          height: 400,
          components: [
            {
              type: 'checkbox',
              title: '快速筛选',
              data: [
                {
                  title: '全部',
                  value: ''
                },
                {
                  title: '本周',
                  value: 0
                },
                {
                  title: '本月',
                  value: 1
                },
                {
                  title: '上月',
                  value: 2
                }
              ]
            },
            {
              type: 'checkbox',
              title: '审核状态',
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
                  title: '审核成功',
                  value: 2
                },
                {
                  title: '审核失败',
                  value: 3
                }
              ]
            },
            {
              type: 'datepicker',
              title: '合同开始日期'
            },
            {
              type: 'datepicker',
              title: '合同结束日期'
            }
          ]
        }
      ]
    }
    this.AddShopListSelector = null
  }

  componentDidMount() {
    this.fetchNumber()
  }

  search = searchInfo => {
    this.setFormScreen(searchInfo)
  }

  fetchNumber() {
    this.numberRequest().then(({ Data }) => {
      const numberBoxConfig = [...this.state.numberBoxConfig]
      numberBoxConfig[0].value = Data.StandByNumber
      numberBoxConfig[1].value = Data.WaitConfireNumber
      numberBoxConfig[2].value = Data.ExpireSoonNumber
      numberBoxConfig[3].value = Data.ExpiredNumber
      this.setState({
        numberBoxConfig
      })
    })
  }

  setFormScreen(val) {
    const form = { ...this.state.form }
    form.parm.page = 1
    form.screen = {
      ...form.screen,
      ...val
    }
    this.setState({ form })
  }

  onRefresh = () => {
    this.fetchNumber()
  }
  handleInOfDateClick = selected => {
    if (selected) {
      this.AddShopListSelector.manuallySelect(0, 0)
      this.setFormScreen({
        QuickScreening: 1
      })
    } else {
      this.setFormScreen({
        QuickScreening: ''
      })
    }
  }
  handleOutOfDateClick = selected => {
    if (selected) {
      this.AddShopListSelector.manuallySelect(0, 0)
      this.setFormScreen({
        QuickScreening: 2
      })
    } else {
      this.setFormScreen({
        QuickScreening: ''
      })
    }
  }
  renderContent = () => {
    const renderItem = ({ item }) => {
      return <ListItem isOwner={this.props.isOwner} item={item} />
    }
    return (
      <Fragment>
        <ListNumberBox
          data={this.state.numberBoxConfig}
          handleStoreClick={selected => {
            if (!selected) {
              this.AddShopListSelector.manuallySelect(0, 0)
            } else {
              this.AddShopListSelector.manuallySelect(0, 1)
              this.setFormScreen({
                QuickScreening: ''
              })
            }
          }}
          handleConfirmClick={selected => {
            if (!selected) {
              this.AddShopListSelector.manuallySelect(0, 0)
            } else {
              this.AddShopListSelector.manuallySelect(0, 2)
              this.setFormScreen({
                QuickScreening: ''
              })
            }
          }}
          handleInOfDateClick={this.handleInOfDateClick}
          handleOutOfDateClick={this.handleOutOfDateClick}
        />
        <List
          request={this.request}
          form={this.state.form}
          setForm={form => this.setState({ form })}
          listKey={this.listKey}
          onRefresh={this.onRefresh}
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
        form.screen[this.statusKey] = data.value
        break
      case 1:
        form.screen.PaperType = data.value
        break
      case 2:
        data.forEach((item, index) => {
          if (!item.data) {
            item.data = {
              value: ''
            }
          }
          switch (index) {
            case 0:
              form.screen.Timeline = item.data.value
              break
            case 1:
              form.screen.AuditStatus = item.data.value
              break
            case 2:
              form.screen.StartTime = item.data.startTime
              form.screen.EndTime = item.data.endTime
              break
            case 3:
              form.screen.EndStartTime = item.data.startTime
              form.screen.EndEndTime = item.data.endTime
              break
          }
        })
        break
      case 3:
        form.screen.FullIDNew = data.FullID
        break
    }
    this.setState({ form })
  }
  render() {
    return (
      <AddShopListSelector
        ref={AddShopListSelector => {
          this.AddShopListSelector = AddShopListSelector
        }}
        selectShop={1}
        config={this.state.listConfig}
        onSelectMenu={this.onSelectMenu}
        renderContent={this.renderContent}
      />
    )
  }
}
