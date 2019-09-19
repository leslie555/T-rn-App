import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Platform} from 'react-native'
import Header from '../../../../components/Header/index'
import IconFont from '../../../../utils/IconFont/index'
import {StyleSheet} from 'react-native';
import {CommonColor, Container, DisplayStyle} from '../../../../styles/commonStyles';
import {GiftedForm} from "../../../../components/Form/GiftedForm";
import {toastMsg} from "../../../../utils/toastMsg";
import {TextInput} from "../../../../components/Form/widgets/TextInputWidget";

export default class SelectPayMode extends Component {
    constructor(props) {
        super(props)
        this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
        this.state = {
            billId: '',
            billInfo: {},
            WXFlag: true,
            payAmount: '',
        }
        // 路由监听
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                // 线上支付成功数据拦截
                if (payload.state.params && payload.state.params.newBillObj) {
                    const newBillObj = payload.state.params.newBillObj
                    this.state.form.OnLineOrOffLine = 1
                    this.state.form.PaidMoney = newBillObj.totalPaidMoney
                    this.state.form.UnPaidMoney = newBillObj.unPaidAmount
                    if (+newBillObj.unPaidAmount === 0) {
                        this.state.form.VerificationStatus = 2
                    }
                    this.buildButton()
                    this.changeStore()
                }
            }
        )
    }

    componentWillMount() {
        // 必传字段：billId，totalAmount，orderType
        // orderType->0：待收账单 1：记账本，2：收款单 3：预定单
        // businessType:用来判断支付成功后的跳转页面,如果orderType无法确定跳转页面，则传此参数，此参数为前端自定义枚举，详见paypage页面
        // 默认可部分支付，是否可部分支付通过orderType判断，自行加判断语句，同orderType===3(不可部分支付）
        const id = this.props.navigation.getParam('billId', '') // 账单id
        const totalAmount = this.props.navigation.getParam('totalAmount', '') // 账单总金额
        const contractID = this.props.navigation.getParam('contractID', '') // 合同id
        const businessType = this.props.navigation.getParam('BusinessType', '') // 业务类型
        const orderType = this.props.navigation.getParam('orderType', '') // 支付页面类型
        const unPaidAmount = this.props.navigation.getParam('unPaidAmount', '') // 总未付金额

        const billInfo = {
            totalAmount,
            orderType,
            contractID,
            businessType,
            unPaidAmount,
        }
        if (id) {
            if (unPaidAmount) {
                this.setState({
                    unPaidAmount: unPaidAmount
                })
                this.setState({
                    payAmount: unPaidAmount
                })
            }
            this.setState({
                billId: id,
                billInfo,
                payAmount: orderType != 3 ? unPaidAmount : totalAmount
            })
        }
    }

    handleConfirmButton() {
        if (this.state.billInfo.orderType != 3) {
            // 验证支付金额
            const payMoney = this.state.payAmount
            const unPaidMoney = this.state.billInfo.unPaidAmount - 0
            if (payMoney === '') {
                toastMsg('请输入支付金额')
                return false
            }
            const patter = /^[0-9]*(\.[0-9]{1,2})?$/;
            if (!patter.test(payMoney)) {
                toastMsg('支付金额应为数字')
                return false
            }
            // if(typeof payMoney !== 'number'){
            //     toastMsg('支付金额应为数字')
            //     return false
            // }
            // if (!isNaN(payMoney)){
            //     toastMsg('支付金额应为数字')
            //     return false
            // }
            if (payMoney - 0 < 0 || payMoney - 0 === 0) {
                toastMsg('支付金额应大于0')
                return false
            }
            if (payMoney - 0 > unPaidMoney) {
                toastMsg('支付金额应小于总未付金额')
                return false
            }
        }

        const item = this.state.billInfo
        this.props.navigation.navigate('AgentPayPage', {
            payMode: this.state.WXFlag ? '1' : '2',
            billId: this.state.billId,
            payMoney: this.state.payAmount,
            unPaidAmount: item.unPaidAmount,
            totalAmount: item.totalAmount,
            contractID: item.contractID,
            businessType: item.businessType,
            orderType: item.orderType
        })
    }

    togglePayMode() {
        this.setState({
            WXFlag: !this.state.WXFlag
        })
    }

    // 验证输入金额规则
    // 1、不能输入两个小数点，如果输入，截取第二个小数点
    // 2、以小数点开头，则往前面加0
    // 3、小数点后超过两位，截取两位
    // 4、以0开始且连续为0的数字置为0
    // 5、输入金额不能小于0，否则置为1
    // 6、输入金额不能大于未付总金额，否则置为未付总金额
    validateAmount(val) {
        let money
        const totalUnpaid = this.state.billInfo.unPaidAmount - 0
        if (!isNaN(val) && val.length > 0 && val != 0) {
            money = val - 0
            if (val.indexOf('.') > -1) {
                if (val.indexOf('.') !== val.lastIndexOf('.')) {
                    money = money.substr(0, val.length - 2)
                } else {
                    if (val.indexOf('.') === 0) {
                        money = '0' + val
                    } else {
                        const strArr = val.split('.')
                        if (strArr[1] && strArr[1].length > 2) {
                            strArr[1] = strArr[1].substr(0, 2)
                        }
                        money = strArr.join('.')
                    }
                }
            }
            if (val.indexOf(0) === 0 && val.length > 1 && val.lastIndexOf(0) === 1) {
                money = val.substr(1, val.length - 1)
            }
            if (money < 0) {
                money = 1
            }
            if (money > totalUnpaid) {
                money = totalUnpaid
            }
        } else {
            money = val
        }
        // console.log(money)
        this.setState({
            payAmount: money
        })
    }

    render() {
        const item = this.state
        let WXIcon, ZFBIcon
        WXIcon = this.state.WXFlag ? (<IconFont name='selected' size={20} color='#ff5a5a'/>) : (
            <IconFont name='unselected' size={20} color='#dddddd'/>)
        ZFBIcon = !this.state.WXFlag ? (<IconFont name='selected' size={20} color='#ff5a5a'/>) : (
            <IconFont name='unselected' size={20} color='#dddddd'/>)
        const isAllPay = item.billInfo.orderType == 3
        return (
            <View style={Container}>
                <Header title="选择支付方式"/>
                {/*<ScrollView*/}
                    {/*ref='container'*/}
                    {/*automaticallyAdjustContentInsets={false}*/}
                    {/*keyboardDismissMode='on-drag'*/}
                    {/*keyboardShouldPersistTaps='never'*/}
                    {/*style={{*/}
                        {/*flex: 1,*/}
                        {/*backgroundColor: '#f6f6f6'*/}
                    {/*}}>*/}
                    {/*<View style={style.pay_info}>*/}
                        {
                            !isAllPay ? (
                                <View style={[style.count_style, style.flex]}>
                                    <View style={style.flex_center}>
                                        <Text style={style.count_title}>总金额</Text>
                                        <Text style={style.count_number}>¥{item.billInfo.totalAmount}</Text>
                                    </View>
                                    <View style={style.flex_center}>
                                        <Text style={style.count_title}>总未收</Text>
                                        <Text style={style.count_number}>¥{item.billInfo.unPaidAmount}</Text>
                                    </View>
                                </View>
                            ): (<View style={[style.count_style, style.flex]}>
                                <View style={style.flex_center}>
                                    <Text style={style.count_title}>总金额</Text>
                                    <Text style={style.count_number}>¥{item.billInfo.totalAmount}</Text>
                                </View>
                            </View>)
                        }
                        {
                            !isAllPay ? (
                                <View class={style.money_input}>
                                    <GiftedForm.TextInputWidget
                                        name='PayAmount'
                                        title='本次支付'
                                        maxLength={8}
                                        disabled={false}
                                        forceChange={true}
                                        keyboardType={this.numberPad}
                                        value={item.payAmount + ''}
                                        onChangeText={(text) => {
                                            this.validateAmount(text)
                                        }}
                                    />
                                </View>
                            ) : (<View/>)
                        }
                        <View style={style.pay_mode_container}>
                            <View style={style.pay_mode_title}>
                                <Text style={style.pay_mode_title_text}>选择方式</Text>
                            </View>
                            <View style={style.pay_mode_list}>
                                <TouchableOpacity onPress={this.togglePayMode.bind(this)}>
                                    <View style={style.pay_mode_item}>
                                        <View style={style.pay_mode_left}>
                                            <View>
                                                <IconFont style={style.pay_mode_icon} name='wxpay' size={20}
                                                          color='#24ba80'></IconFont>
                                            </View>
                                            <View>
                                                <Text style={style.pay_mode_text}>微信支付</Text>
                                            </View>
                                        </View>
                                        {WXIcon}
                                    </View>
                                </TouchableOpacity>
                                <View style={style.divide_line}></View>
                                <TouchableOpacity onPress={this.togglePayMode.bind(this)}>
                                    <View style={style.pay_mode_item}>
                                        <View style={style.pay_mode_left}>
                                            <View>
                                                <IconFont style={style.pay_mode_icon} name='zhifubaozhifu' size={20}
                                                          color='#3da1f3'></IconFont>
                                            </View>
                                            <View>
                                                <Text style={style.pay_mode_text}>支付宝支付</Text>
                                            </View>
                                        </View>
                                        {ZFBIcon}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    {/*</View>*/}
                {/*</ScrollView>*/}
                <View style={style.pay_button_container}>
                    <TouchableOpacity style={style.pay_button} onPress={this.handleConfirmButton.bind(this)}>
                        <Text style={style.pay_button_text}>确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    count_style: {
        height: 100,
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderBottomColor: '#eee',
        borderBottomWidth: 0.5,
    },
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    flex_center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    count_number: {
        fontSize: 18,
        color: '#363636',
    },
    count_title: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 12,
        color: '#999',
        marginBottom: 15
    },
    pay_mode_container: {
        marginTop: 15
    },
    pay_mode_left: {
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    pay_mode_title: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
        marginLeft: 20
    },
    money_input: {
        // marginBottom: 0,
        // paddingBottom: 0,
        // height: 30
    },
    pay_mode_title_text: {},
    pay_mode_list: {
        backgroundColor: '#fff',
        paddingHorizontal: 15
    },
    pay_mode_item: {
        marginVertical: 15,
        ...DisplayStyle('row', 'center', 'space-between')
    },
    pay_mode_icon: {
        marginRight: 15
    },
    pay_mode_text: {
        fontSize: 15,
        color: '#363636'
        // marginLeft: 15,
    },
    divide_line: {
        height: 1,
        backgroundColor: '#eee'
    },
    pay_button_container: {
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        paddingVertical: 15,
        paddingHorizontal: 15,
        height: 80,
        backgroundColor: '#fff'
    },
    pay_button: {
        height: 50,
        borderRadius: 8,
        backgroundColor: '#389ef2',
        ...DisplayStyle('row', 'center', 'center')
    },
    pay_button_text: {
        fontSize: 20,
        color: '#fff'
    }
})
