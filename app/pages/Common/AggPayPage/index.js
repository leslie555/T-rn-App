import React, {Component} from 'react'
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Header from '../../../components/Header/index'
import Toast from 'react-native-root-toast';
import {DisplayStyle} from '../../../styles/commonStyles';
import QRCode from 'react-native-qrcode';
import {GetPayCodeBatch, QueryPayStatus} from "../../../api/pay";
import {toastMsg} from "../../../utils/toastMsg";
import ListLoading from "../../../components/ListLoading";
import store from "../../../redux/store/store";
import {removeWaitCollectBillList, updateWaitCollectBillList} from "../../../redux/actions/waitCollectBillList";
import FullModal from "../../../components/FullModal";
import {priceFormat} from '../../../utils/priceFormat'

export default class AggPayPage extends Component {
    constructor(props) {
        super(props)
        this.BussinessType = [
            {
                name: '业主合同',
                value: '1'
            },
            {
                name: '租客合同',
                value: '2'
            },
            {
                name: '收款单',
                value: '3'
            }
        ]
        this.state = {
            billId: '',
            orderType: '',
            OrderId: '',
            payMode: '',
            payMoney: '',
            unPaidAmount: '',
            totalAmount: '',
            payCodeUrl: '',
            contractID: '',
            businessType: '',
            successLoading: false,
            listLoading: false
        }
        this.toastMsg = this.toastMsg.bind(this)
        this.handleSuccessPay = this.handleSuccessPay.bind(this)
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        this.setState({
            listLoading: true
        })
        const payMode = this.props.navigation.getParam('payMode', '')
        const id = this.props.navigation.getParam('billId', '')
        const money = this.props.navigation.getParam('payMoney', '')
        const unPaidmoney = this.props.navigation.getParam('unPaidAmount', '')
        const totalMoney = this.props.navigation.getParam('totalAmount', '')
        const contraID = this.props.navigation.getParam('contractID', '')
        const busType = this.props.navigation.getParam('businessType', '')
        const payType = this.props.navigation.getParam('orderType', '')

        if (payMode) {
            this.setState({
                payMode: payMode
            })
        }
        if (money) {
            this.setState({
                payMoney: money
            })
        }
        if(unPaidmoney) {
            this.setState({
                unPaidAmount:unPaidmoney
            })
        }
        if(totalMoney) {
            this.setState({
                totalAmount:totalMoney
            })
        }
        if (contraID) {
            this.setState({
                contractID: contraID
            })
        }
        if (busType) {
            this.setState({
                businessType: busType
            })
        }
        if(payType) {
            this.setState({
                orderType: payType
            })
        }
        if (id) {
            this.setState({
                billId: id
            })
            GetPayCodeBatch({
                bookID: id,
                partAmount: id.length===1?money: 0,
                // W1微信,A1支付宝
                payChannelType: payMode === '1' ? 'W1' : 'A1',
                // 0：合同账单 1：记账本
                orderType: payType
            }).then(res => {
                    this.setState({
                        listLoading: false
                    })
                    if (res.Data) {
                        this.setState({
                            payCodeUrl: res.Data.QrcodeUrl,
                            OrderId: res.Data.OrderId,
                            // isSuccess: true,
                            listLoading: false
                        })
                    }
                }
            ).catch(() => {
                this.setState({
                    listLoading: false
                })
                // toastMsg('网络错误，请稍候再试')
                this.props.navigation.goBack()
            })
        }
    }

    handlePaySuccessButton() {
        // 验证支付是否成功
        // 失败刷新页面
        // 支付中显示请等候
        // 成功跳转到到合同详情
        if (this.state.OrderId) {
            this.setState({
                successLoading: true
            })
            QueryPayStatus({
                OrderId: this.state.OrderId
            }).then(res => {
                if (res) {
                    const BusCode = res.BusCode
                    // const BusCode = 0
                    // BusCode =1 支付确认中
                    // BusCode=0 支付成功
                    // BusCode=2 支付失败
                    if (BusCode == 1) {
                        this.setState({
                            successLoading: false
                        })
                        toastMsg('支付确认中，请稍候')
                    }
                    if (BusCode == 0) {
                        this.handleSuccessPay(this.state.orderType,this.state.businessType)
                    }
                    if (BusCode == 2) {
                        this.setState({
                            successLoading: false
                        }, () => {
                            setTimeout(() => {
                                Alert.alert('温馨提示', '支付出错，确认刷新本页面重新支付？', [
                                    {
                                        text: '确认', onPress: () => {
                                            this.fetchData()
                                        }
                                    }
                                ], {cancelable: false})
                            }, 100)
                        })
                    }
                }
            }).catch(() => {
                this.setState({
                    successLoading: false
                })
                // toastMsg('网络错误，请稍候再试')
            })
        }
    }

    handleSuccessPay(payType,businessType) {
        // 0：合同账单 1：记账本
        payType = +payType
        const totalAmount = this.state.totalAmount - 0 // 总金额
        const totalUnpaid = this.state.unPaidAmount - 0 // 总未付
        const payAmount = this.state.payMoney - 0 // 本次支付
        const billObj = {
            billId: this.state.billId,
            payAmount: payAmount,
            unPaidAmount: priceFormat(totalUnpaid - payAmount), // 未付金额 = 总未付金额-已付金额
            totalPaidMoney: priceFormat(totalAmount - totalUnpaid + payAmount) // 总已付金额=总金额-总未付+本次支付
        }
        if(this.state.billId.length >1) {
            // 多笔账单支付跳收付款列表
        }
        switch(payType) {
            case 0:
                this.setState({
                    successLoading: false
                })
                store.dispatch(removeWaitCollectBillList({
                    KeyID: this.state.billId
                }))
                if (businessType == 1 && this.state.contractID) {
                    toastMsg('支付成功！即将跳转页面')
                    this.props.navigation.navigate('ContractDetail', {
                        id: this.state.contractID,
                        isOwner: true
                    })
                }
                if (businessType == 2 && this.state.contractID) {
                    toastMsg('支付成功！即将跳转到页面')
                    this.props.navigation.navigate('ContractDetail', {
                        id: this.state.contractID,
                        isOwner: false
                    })
                }
                break;
            case 1:
                // 跳转至记账本详情页面
                break;
        }
    }

    toastMsg(msg) {
        Toast.show(msg, {
            duration: 820,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls on toast\`s appear animation start
                // this.props.navigation.goBack()
            },
            onShown: () => {
                // calls on toast\`s appear animation end.
            },
            onHide: () => {
                // calls on toast\`s hide animation start.
            },
            onHidden: () => {
                // calls on toast\`s hide animation end.
            }
        })
    }

    render() {
        let payText, qrcodeContent
        if (this.state.payMode === '1') {
            payText = <Text style={style.qrcode_type_title_text}>微信支付</Text>
        } else {
            payText = <Text style={style.qrcode_type_title_text}>支付宝支付</Text>
        }
        qrcodeContent = (
            <View style={style.qrcode_img_container}>
                <View style={style.qrcode_img_content}>
                    <View style={style.qrcode_img_box}>
                        <QRCode
                            style={style.qrcode_img}
                            value={this.state.payCodeUrl}
                            size={200}
                            bgColor='black'
                            fgColor='white'/>
                    </View>
                    <View>
                        <Text style={style.qrcode_notice}>请扫描二维码进行支付</Text>
                    </View>
                </View>
                <View style={style.pay_success_container}>
                    <TouchableOpacity style={style.pay_success_button}
                                      onPress={this.handlePaySuccessButton.bind(this)}>
                        <Text style={style.pay_success_button_text}>支付完成</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
        // if (this.state.isSuccess) {
        //
        // } else {
        //     qrcodeContent = (<View style={style.no_qrcode_container}>
        //         <Image style={style.error_img} source="../../../images/pay/error-icon.png"/>
        //     </View>)
        // }
        return (
            <View style={{flex: 1}}>
                <Header title="扫码支付"/>
                <FullModal
                    visible={this.state.successLoading}/>
                {this.state.listLoading ? (
                    <ListLoading isVisible={this.state.listLoading}/>
                ) : (
                    <View style={style.outside_box}>
                        <View style={style.inside_box}>
                            <View style={style.qrcode_type_title}>
                                {payText}
                            </View>
                            <View style={style.qrcode_info}>
                                <View style={style.pay_info}>
                                    <View>
                                        <Text style={style.total_money_title}>合计金额</Text>
                                    </View>
                                    <View style={style.total_money_container}>
                                        <Text style={style.total_money_text}>¥{this.state.payMoney}</Text>
                                    </View>
                                </View>
                                {qrcodeContent}
                            </View>
                        </View>
                    </View>
                )
                }
            </View>
        )
    }
}

const style = StyleSheet.create({
    outside_box: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: '#389ef2',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    inside_box: {
        borderRadius: 8,
        flex: 1,
        backgroundColor: '#fff'
    },
    qrcode_type_title: {
        ...DisplayStyle('row', 'center', 'center'),
        // width: 345,
        height: 40,
        backgroundColor: 'rgba(56,158,242,0.4)'
    },
    qrcode_type_title_text: {
        fontSize: 16,
        color: '#389ef2'
    },
    qrcode_info: {
        flex: 1,
        ...DisplayStyle('column', 'center', 'space-around'),
    },
    pay_info: {
        flex: 1,
        ...DisplayStyle('column', 'center', 'center'),
    },
    no_qrcode_container: {
        flex: 3,
        backgroundColor: '#ff5a5a',
        ...DisplayStyle('column', 'center', 'center')
    },
    error_style: {},
    // qrcode_img: {
    //   flex:1,
    //     ...DisplayStyle('column', 'center', 'center'),
    // },
    total_money_title: {
        fontSize: 14,
        color: '#999'
    },
    total_money_container: {
        marginTop: 15
    },
    total_money_text: {
        fontSize: 18,
        color: '#363636'
    },
    qrcode_img_container: {
        flex: 3,
        ...DisplayStyle('column', 'center', 'flex-start')
    },
    qrcode_img_content: {
        ...DisplayStyle('column', 'center', 'center')
    },
    qrcode_img_box: {
        marginBottom: 20,
        overflow: 'hidden'
    },
    qrcode_img: {
        width: 190,
        height: 190
    },
    qrcode_notice: {
        fontSize: 14,
        color: '#666'
    },
    pay_success_container: {
        marginTop: 50
    },
    pay_success_button: {
        borderRadius: 8,
        width: 150,
        height: 45,
        backgroundColor: '#389ef2',
        ...DisplayStyle('row', 'center', 'center')
    },
    pay_success_button_text: {
        color: '#fff',
        fontSize: 15
    },
    error_img: {}
})
