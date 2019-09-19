import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView} from 'react-native'
import Header from '../../../../components/Header/index'
import style from './style'
import {dateFormat} from "../../../../utils/dateFormat";
import {Container} from "../../../../styles/commonStyles";
import {GiftedForm} from "../../../../components/Form/GiftedForm";
import {GetAggPaymentDetail} from "../../../../api/bill";
// import {getEnumDesByValue} from '../../../../utils/enumData'

export default class AggregatePayDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            BillInfo: {}
        }
        this.handlePayButton = this.handlePayButton.bind(this)
    }

    componentWillMount() {
        const id = this.props.navigation.getParam('id', '')
        const type = this.props.navigation.getParam('type', '')

        if (id) {
            GetAggPaymentDetail({KeyID: id,type}).then(res=>{
                if(res.Data) {
                    const BillInfo = {
                        ...res.Data
                    }
                    this.setState({
                        id: id,
                        BillInfo: BillInfo
                    })
                }
            })
        }
    }

    handlePayButton() {
        const item = this.state
        this.props.navigation.navigate('AgentSelectAggPayMode', {
            billId: [item.id],
            unPaidAmount: item.BillInfo.UnPaidMoney + '',
            totalAmount: item.BillInfo.ReceivableMoney + '',
            contractID: item.BillInfo.ContractID,
            orderType: item.BillInfo.OrderType + '', // 0：合同账单 1：记账本
            BusinessType: item.BillInfo.BusinessType + ''
        })
    }

    // 获取预期字体样式
    getDisplayStateText(item) {
        let today = new Date()
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        let receiveDate = new Date(dateFormat(item.ReceivableDate, 'yyyy-MM-dd'))
        receiveDate = new Date(receiveDate.getFullYear(), receiveDate.getMonth(), receiveDate.getDate())
        const diffDay = (receiveDate - today) / 1000 / 60 / 60 / 24
        if (diffDay < 0) {
            return <Text style={style.bill_title_passDate}>{item.PayStatus}</Text>
        } else {
            if(item.PayStatus == '部分收') {
                return <Text style={style.bill_title_receivePart}>部分收</Text>
            }
            // if(item.PayStatus == '已收') {
            //     return <Text style={style.bill_title_received}>已收</Text>
            // }
            return <Text style={style.bill_title_unReceive}>未收</Text>
        }
    }

    getPayStatus(item) {
        if (item.PaidMoney > 0 && item.UnPaidMoney > 0)
        {
            return '部分收'
        }
        // if (item.UnPaidMoney == 0)
        // {
        //     return '已收'
        // }
        return '未收'
    }

    render() {
        const item = this.state.BillInfo
        const DisplayState = this.getDisplayStateText(item)
        const payStatusStr = this.getPayStatus(item)
        return (
            <View style={{...Container}}>
                <Header title="账单详情"/>
                <GiftedForm formName='AggregatePayDetail'>
                    <View style={style.bill_money}>
                        <View style={style.bill_title_container}>
                            <Text style={style.bill_money_text}>¥{item.ReceivableMoney}</Text>
                            <Text style={style.bill_paid_money_text}>(已收{item.PaidMoney})</Text>
                        </View>
                        <View>
                            {DisplayState}
                        </View>
                    </View>
                    <GiftedForm.LabelWidget
                        name='HouseName'
                        title='房源名称'
                        required={false}
                        renderRight={false}
                        value={item.HouseName || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='BillType'
                        title='账单类型'
                        required={false}
                        renderRight={false}
                        value={item.BillType || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='ReceivableMoney'
                        title='应收金额'
                        required={false}
                        renderRight={false}
                        value={item.ReceivableMoney || ''}
                    />
                    <GiftedForm.LabelWidget
                        name='PaidMoney'
                        title='已收金额'
                        required={false}
                        renderRight={false}
                        value={item.PaidMoney || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='UnPaidMoney'
                        title='未收金额'
                        required={false}
                        renderRight={false}
                        value={item.UnPaidMoney || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='payStatusStr'
                        title='收支状态'
                        required={false}
                        renderRight={false}
                        value={payStatusStr}
                    />
                    <GiftedForm.LabelWidget
                        name='ReceivableDate'
                        title='应收日期'
                        required={false}
                        renderRight={false}
                        value={dateFormat(item.ReceivableDate, 'yyyy-MM-dd')|| '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='ProjectName'
                        title='项目'
                        required={false}
                        renderRight={false}
                        value={item.ProjectName || '无'}
                    />
                </GiftedForm>
                <TouchableOpacity style={style.page_bottom} onPress={this.handlePayButton}>
                    <Text style={style.pay_btn}>立即支付</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
