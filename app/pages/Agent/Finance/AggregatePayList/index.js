import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Linking, Dimensions } from 'react-native'
import IconFont from '../../../../utils/IconFont/index'
import style from './style'
import { CommonColor, Container } from '../../../../styles/commonStyles'
import { Header, List } from '../../../../components'
import ListItem from './ListItem'
import { setList, updateList } from '../../../../redux/actions/list'
import { QueryAggPaymentList } from '../../../../api/bill'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import Toast from 'react-native-root-toast'
import { priceFormat } from '../../../../utils/priceFormat'
import ListSelector, { TopMenuItem } from '../../../../components/ListSelector'
import Picker from '../../../../components/Picker'
import SearchBar from '../../../../components/SearchBar'
import { fetchBillData } from '../../../../utils/arrUtil/fetchBillData'

const { width, height } = Dimensions.get('window')

class AggregatePayList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listConfig: [
        {
          type: 'customize', // 自定义组件
          componentKey: 'aaa'
        },
        {
          type: 'title',
          title: '合同账单',
          selectedIndex: 0,
          data: [
            {
              title: '合同账单',
              value: 0
            },
            {
              title: '记账本',
              value: 1
            }
          ]
        },
        {
          type: 'panel',
          title: '更多筛选',
          components: [
            {
              type: 'datepicker',
              title: '日期'
            }
          ]
        }
      ],
      totalMount: 0,
      billIds: [],
      visible: false,
      searchBarVisible: false,
      HouseID: '',
      form: {
        KeyWord: '',
        ProjectName: '',
        Type: 0, // 0合同账单，1记账本
        StartDate: '',
        EndDate: '',
        pageParam: {
          page: 1,
          size: 8
        }
      },
      billProject: []
    }
    this.togglePayBill = this.togglePayBill.bind(this)
    this.toDetail = this.toDetail.bind(this)
    // 有部分收数据
    this.hasPartReceived = 0
    // this.countTotalMoney = this.countTotalMoney.bind(this)
  }

  componentDidMount() {
    fetchBillData(1, true).then(({ Data }) => {
      this.setState({
        billProject: Data
      })
    })
    this.setState({
      form: this.state.form
    })
  }

  /* componentWillReceiveProps(nextProps) {
    if (this.props.allList !== nextProps.allList) {
      let totalMount = 0
      let billIds = []
      nextProps.allList['AgentAggregatePayList'].forEach(item => {
        if (item.isSelected) {
          totalMount = priceFormat(+totalMount + +item.ReceivableMoney)
          // totalMount += priceFormat(item.ReceivableMoney - 0)
          billIds.push(item.KeyID)
        }
      })
      this.setState({
        totalMount: totalMount,
        billIds: billIds
      })
    }
  } */

  toggleSearch() {
    this.setState({
      searchBarVisible: !this.state.searchBarVisible
    })
  }

  searchKeyword(val) {
    this.state.form.KeyWord = val
    this.state.form.pageParam.page = 1
    this.setState({
      form: { ...this.state.form },
      totalMount: 0,
      billIds: [],
      HouseID: ''
    })
  }

  // 勾选要支付的账单(部分收账单只能选择一个)
  togglePayBill(item) {
    const billIndex = this.state.billIds.indexOf(item.KeyID)
    const billIds = [...this.state.billIds]
    const num = billIds.length
    let { HouseID, totalMount } = this.state
    // 判断当前点的选项是否已经勾选
    if (billIndex === -1) {
      // 判断是否和已勾选数据是同一套房源
      if (HouseID && HouseID !== item.HouseID) {
        this.showToast(0)
        return
      }
      // 判断是否有部分收选项已勾选
      if (this.hasPartReceived === 1) {
        this.showToast(1)
        return
      }
      HouseID = item.HouseID
      if (num === 0) { // 如果没选任何账单判断所选账单是否是部分收
        if (item.UnPaidMoney > 0 && item.PaidMoney > 0) {
          this.hasPartReceived = 1
        }
      } else  {
        if (item.UnPaidMoney > 0 && item.PaidMoney > 0) {
          this.showToast(1)
          return
        }
      }
      billIds.push(item.KeyID)
      totalMount = priceFormat(+totalMount + +item.ReceivableMoney)
    } else {
      if (num === 1) {
        HouseID = ''
        this.hasPartReceived = 0
      }
      billIds.splice(billIndex, 1)
      totalMount = priceFormat(+totalMount - +item.ReceivableMoney)
    }
    this.setState({
      billIds,
      HouseID,
      totalMount
    })
    // const hasItem = this.state.billIds.includes(item.KeyID)
    // const billIds = [...this.state.billIds]
    // let { HouseID, totalMount } = this.state
    // // 如果是未勾选状态变为勾选状态
    // if (!hasItem) {
    //   // 判断是否已有勾选数据
    //   if (this.state.billIds && this.state.billIds.length > 0) {
    //     // 判断如果是部分收 则不能一起勾选
    //     if ((item.UnPaidMoney > 0 && item.PaidMoney > 0) || (this.hasPartReceived === 1)) {
    //       Toast.show('部分收只能单选, 不能和其他的一起支付', {
    //         duration: Toast.durations.SHORT,
    //         position: Toast.positions.CENTER
    //       })
    //       this.hasPartReceived = 1
    //       return 
    //     }
    //     // 有则判断是否和已有勾选数据属于同一房源
    //     if (item.HouseID != this.state.HouseID) {
    //       Toast.show('请选择同一房源！', {
    //         duration: Toast.durations.SHORT,
    //         position: Toast.positions.CENTER
    //       })
    //       return
    //     }
    //   } else if(item.UnPaidMoney > 0 && item.PaidMoney > 0) {
    //     this.hasPartReceived = 1
    //   }
    //   totalMount = priceFormat(+totalMount + +item.ReceivableMoney)
    //   billIds.push(item.KeyID)
    //   // 没有则设置HouseID
    //   HouseID = item.HouseID
    // } else {
    //   // 如果是勾选状态变为未勾选状态
    //   totalMount = priceFormat(+totalMount - +item.ReceivableMoney)
    //   const idx = billIds.findIndex(v => v === item.KeyID)
    //   billIds.splice(idx, 1)
    //   if (this.hasPartReceived === 1) {
    //     this.hasPartReceived = 0
    //   }
    //   //判断该数据是否为最后一个勾选的数据，如果是，则重置HouseID
    //   if (this.state.billIds && this.state.billIds.length == 1) {
    //     HouseID = ''
    //   }
    // }
    // this.setState({
    //   billIds,
    //   HouseID,
    //   totalMount
    // })
    // this.countTotalMoney()
  }

  showToast(type) {
    console.log(type)
    let msg = ''
    switch (type) {
      case 0:
        msg = '请选择同一房源！'
        break
      case 1:
        msg = '部分收只能单选, 不能和其他的一起支付!'
        break
    }
    Toast.show(msg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER
    })
  }
  /*     // 计算总金额
    countTotalMoney() {
        let totalMount = 0
        let billIds = []
        this.props.allList['AgentAggregatePayList'].forEach(item => {
            if (item.isSelected) {
                totalMount = priceFormat(+totalMount+(+item.ReceivableMoney))
                // totalMount += priceFormat(item.ReceivableMoney - 0)
                billIds.push(item.KeyID)
            }
        })
        this.setState({
            totalMount: totalMount,
            billIds: billIds
        })
    } */

  resetData() {
    this.setState({
      totalMount: 0,
      billIds: [],
      HouseID: ''
    })
  }

  toDetail(item) {
    this.props.navigation.navigate('AgentAggregatePayDetail', {
      id: item.KeyID,
      type: this.state.form.Type // 0合同账单，1记账本
    })
  }

  toPay() {
    const state = this.state
    if (state.billIds.length == 0) {
      Toast.show('请选择账单！', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER
      })
      return
    }
    const isSinglePay = state.billIds.length === 1
    if (isSinglePay) {
      const obj = this.props.allList['AgentAggregatePayList'].find(item => {
        return item.KeyID === state.billIds[0]
      })
      this.props.navigation.navigate('AgentSelectAggPayMode', {
        billId: state.billIds,
        orderType: this.state.form.Type + '', // 0：合同账单 1：记账本
        unPaidAmount: obj.UnPaidMoney + '',
        totalAmount: obj.ReceivableMoney + '',
        contractID: obj.ContractID,
        BusinessType: obj.BusinessType + ''
      })
    } else {
      this.props.navigation.navigate('AgentSelectAggPayMode', {
        billId: state.billIds,
        totalAmount: state.totalMount + '',
        orderType: this.state.form.Type + '' // 0：合同账单 1：记账本
      })
    }
  }

  renderContent() {
    const renderItem = ({ item }) => {
      return (
        <ListItem
          togglePayBill={this.togglePayBill}
          toDetail={this.toDetail}
          item={item}
          billIds={this.state.billIds}
        />
      )
    }

    return (
      <List
        request={QueryAggPaymentList}
        form={this.state.form}
        pageKey='pageParam'
        listKey={'AgentAggregatePayList'}
        setForm={form => this.setState({ form })}
        onRefresh={this.resetData.bind(this)}
        renderItem={renderItem}
      />
    )
  }

  onSelectMenu = (index, subindex, data) => {
    const form = { ...this.state.form }
    form.pageParam.page = 1
    this.resetData()
    switch (index) {
      case 0:
        break
      case 1:
        form.Type = data.value
        this.setState({ form })
        break
      case 2:
        data.forEach((item, index) => {
          if (!item.data) {
            item.data = {
              value: '全部',
              startTime: '',
              endTime: ''
            }
          }
          switch (index) {
            case 0:
              form.StartDate = item.data.startTime
              form.EndDate = item.data.endTime
              break
          }
        })
        this.setState({ form })
        break
    }
  }

  onPickerConfirm(data) {
    const form = { ...this.state.form }
    if (form.ProjectName == '' && data[1] == '全部') {
      return
    }
    form.pageParam.page = 1
    form.ProjectName = data[1] == '全部' ? '' : data[1]
    this.setState({ form })
  }

  toggleProject() {
    this.setState({
      visible: !this.state.visible
    })
    this.resetData()
  }

  render() {
    const { totalMount } = this.state
    const customComponent = {
      aaa: (
        <TopMenuItem
          customize
          label={
            this.state.form.ProjectName && this.state.form.ProjectName != '全部'
              ? this.state.form.ProjectName
              : '项目'
          }
          selected={this.state.visible}
          onPress={this.toggleProject.bind(this)}
        />
      )
    }
    return (
      <View style={{ position: 'relative', ...Container }}>
        <Header
          title='聚合支付'
          headerRight={
            <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
              <IconFont name='search' size={20} color='white' />
            </TouchableOpacity>
          }
        >
          {this.state.searchBarVisible && (
            <SearchBar
              placeholder='请输入房源名称/租客姓名/租客电话'
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
          renderContent={this.renderContent.bind(this)}
          customComponent={customComponent}
        />
        <Picker
          visible={this.state.visible}
          type={'cascader'}
          pickerData={this.state.billProject}
          onPickerConfirm={this.onPickerConfirm.bind(this)}
          onPickerCancel={() => {
            this.setState({ visible: false })
          }}
          closeModal={() => {
            this.setState({ visible: false })
          }}
        />
        <View style={style.page_bottom}>
          <View style={style.total_text}>
            <Text style={style.total_title}>合计：</Text>
            <Text style={style.total_amount}>{totalMount}元</Text>
          </View>
          <TouchableOpacity
            style={style.pay_btn}
            onPress={this.toPay.bind(this)}
          >
            <Text style={style.pay_btn_text}>去收款</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(AggregatePayList))
