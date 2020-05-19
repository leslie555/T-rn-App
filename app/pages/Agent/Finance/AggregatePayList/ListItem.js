import React, { Component } from 'react'
import IconFont from '../../../../utils/IconFont'
import { Text, TouchableOpacity, View } from 'react-native'
import style from './style'
import { dateFormat } from '../../../../utils/dateFormat'
import { getEnumListByKey } from '../../../../utils/enumData'
import { updateList } from '../../../../redux/actions/list'
import store from '../../../../redux/store/store'
import CheckBox from '../../../../components/CheckBox'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    // debugger
    // store.dispatch(updateList({
    //     key: 'AgentAggregatePayList',
    //     KeyID: this.props.item.KeyID,
    //     data: {isSelected:false}
    // }))
  }

  shouldComponentUpdate(nextProps) {
    const isSelected1 = this.props.billIds.includes(this.props.item.KeyID)
    const isSelected2 = nextProps.billIds.includes(nextProps.item.KeyID)
    return isSelected1 !== isSelected2
  }

  // 获取预期字体样式
  getDisplayStateText(item) {
    let today = new Date()
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    let receiveDate = new Date(dateFormat(item.ReceivableDate, 'yyyy-MM-dd'))
    receiveDate = new Date(
      receiveDate.getFullYear(),
      receiveDate.getMonth(),
      receiveDate.getDate()
    )
    const diffDay = (receiveDate - today) / 1000 / 60 / 60 / 24
    if (diffDay < 0) {
      return <Text style={style.bill_title_passDate}>{item.PayStatus}</Text>
    }
    if (item.PaidMoney > 0 && item.UnPaidMoney > 0) {
      return <Text style={style.bill_title_receivePart}>部分收</Text>
    }
    if (item.UnPaidMoney == 0) {
      return <Text style={style.bill_title_received}>已收</Text>
    }
    return <Text style={style.bill_title_unReceive}>未收</Text>
  }

  render() {
    const item = this.props.item
    const DisplayState = this.getDisplayStateText(item)
    const isSelected = this.props.billIds.includes(item.KeyID)
    return (
      <View style={style.content_box}>
        <TouchableOpacity
          style={style.check_box}
          onPress={() => {
            this.props.togglePayBill(item)
          }}
        >
          {/*{selectIcon}*/}
          <CheckBox
            color={'#389ef2'}
            size={20}
            type={1}
            isChecked={isSelected}
            onClick={() => {
              this.props.togglePayBill(item)
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={style.bill_content}
          onPress={() => {
            this.props.toDetail(item)
          }}
        >
          <View style={style.bill_title}>
            <Text style={style.bill_title_left}>
              应收款日:
              {dateFormat(item.ReceivableDate, 'yyyy-MM-dd')}
            </Text>
            {DisplayState}
          </View>
          <View style={style.line} />
          <View style={style.bill_info_container}>
            <View style={style.bill_house_title_container}>
              <Text style={style.bill_house_title}>房源名称：</Text>
              <Text style={style.bill_house_name}>{item.HouseName}</Text>
            </View>
            <View style={style.bill_number_container}>
              <View style={style.bill_info}>
                <Text style={style.bill_number_title}>项目：</Text>
                <Text style={style.bill_number}>{item.ProjectName.length > 20 ? item.ProjectName.slice(0, 20) : item.ProjectName}</Text>
              </View>
              <Text style={style.bill_money}>¥{item.ReceivableMoney}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
