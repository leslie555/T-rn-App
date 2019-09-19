import React, {Component} from 'react'
import {Alert, Button, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {GiftedForm} from '../../../../components/Form/GiftedForm'
import {FullModal, Header} from '../../../../components'
import ButtonGroup from '../../../../components/ButtonGroup'
import {connect} from 'react-redux'
import {DeleteReceiptNew, GetPaymentDetailsNew, GetReceiptDetailsNew, VerificationNew} from '../../../../api/payReceipt'
import {getEnumDesByValue} from '../../../../utils/enumData'
import {dateFormat} from '../../../../utils/dateFormat'
import {getButtons} from '../../../../utils/buttonPermission'
import Toast from "react-native-root-toast";
import store from "../../../../redux/store/store";
import ImagePreview from "../../../../components/ImagePreview";
import {deleteList,updateList} from '../../../../redux/actions/list'

class EditOwnerResource extends React.Component {
    constructor(props) {
        super(props)
        this.editType = 0 // 0新增 1修改
        this.busType = 0 // 0收款 1付款
        this.KeyID = '' // 修改用的id
        this.saveFn = null
        this.BillList = []
        this.EnumData = {
            AccountType: [],
            VerStatus: []
        }
        this.EnumProps = {
            label: 'Description',
            value: 'Value'
        }
        this.state = {
            form: {
                CommunityName: '',
                ContractNumber: '',
                RoomNumber: '',
                PaymentMoney: 0,
                PaidMoney: 0,
                UnPaidMoney: 0,
                PaymentData: '',
                OutRoomName: '',
                EdName: '',
                StoreManager: '',
                VerificationStatusName: '',
                BalanceTypeName: '',
                InitialCashBank: '',
                DetailsMark: '',
                Remarks: ''
            },
            SelectBillList: [],
            btnOptions: [],
            loading: false
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
        this.initData()
    }

    initData() {
        this.busType = this.props.navigation.getParam('busType', 0)
        this.KeyID = this.props.navigation.getParam('KeyID', '')
        this.getDetail(this.KeyID)
    }

    getDetail(id) {
        this.setState({
            loading: true
        })
        const fn = this.busType === 0 ? GetReceiptDetailsNew : GetPaymentDetailsNew
        fn({
            KeyID: id
        }).then(({Data}) => {
            let DetailsMark = ''
            Data.Details.forEach(v => {
                DetailsMark += `${v.ProjectName} (${v.PaidMoney}元)`
            })
            const VerificationStatusName = getEnumDesByValue('VerStatus', Data.VerificationStatus)
            const BalanceTypeName = getEnumDesByValue('AccountType', Data.BalanceType)
            const PaymentData = dateFormat(Data.PaymentData)
            delete Data.Details
            this.state.form = {
                ...Data,
                DetailsMark,
                VerificationStatusName,
                BalanceTypeName,
                PaymentData
            }
            this.setState({
                loading: false,
                form: this.state.form
            })
            this.buildButton()
        })
    }

    handleSave() {
        this.props.navigation.navigate('AgentEditPayReceipt', {editType: 1, busType: this.busType, KeyID: this.state.form.KeyID}) // 0收款 1付款 KeyID 修改用的id
    }

    handleDelete() {
        Alert.alert('温馨提示', `确认要删除${this.busType === 0 ? '收款单' : '付款单'}吗？`, [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确认', onPress: () => {
                    this.fetchDelete()
                }
            }
        ], {cancelable: false})
    }

    handleWrite() {
        Alert.alert('温馨提示', '确认要核销吗？', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确认', onPress: () => {
                    this.fetchWrite(2)
                }
            }
        ], {cancelable: false})
    }

    handleUnWrite() {
        Alert.alert('温馨提示', '确认要撤销核销吗？', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确认', onPress: () => {
                    this.fetchWrite(1)
                }
            }
        ], {cancelable: false})
    }

    fetchWrite(status) {
        this.setState({
            loading: true
        })
        VerificationNew({
            VerType: this.busType + 1,
            PayOrReceiptID: this.state.form.KeyID,
            VerificationStatus: status
        }).then(() => {
            Toast.show(status === 2 ? `核销成功` : `撤回核销成功`, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            })
            this.state.form.VerificationStatus = status
            this.changeStore()
            this.buildButton()
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    handleToPay() {
        // 去支付
        this.props.navigation.navigate('AgentSelectPayMode',
            {
                billId: this.state.form.KeyID,
                unPaidAmount: this.state.form.UnPaidMoney + '', // 未收
                totalAmount: this.state.form.PaymentMoney + '',
                BusinessType: 3,
                orderType: 2
            })
    }

    fetchDelete() {
        this.setState({
            loading: true
        })
        DeleteReceiptNew({
            VerType: this.busType + 1,
            KeyID: this.state.form.KeyID
        }).then(() => {
            Toast.show(`删除成功`, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            })
            this.changeStore('delete')
            this.props.navigation.goBack()
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    changeStore(type = 'update') {
        const data = this.state.form
        if (type === 'update') {
            // 修改store
            store.dispatch(updateList({
                key:this.busType?'AgentPayReceiptList_pay':'AgentPayReceiptList_receive',
                KeyID: data.KeyID,
                data: {
                    PaymentData: data.PaymentData,
                    VerificationStatus: data.VerificationStatus,
                    ProjectName: data.ProjectName,
                    ContractNumber: data.ContractNumber,
                    PaymentMoney: data.PaymentMoney,
                    PaidMoney: data.PaidMoney,
                    UnPaidMoney: data.UnPaidMoney,
                    HouseName: data.HouseName
                }
            }))
            // this.props.dispatch(updatePayReceiveList({
            //     KeyID: data.KeyID,
            //     EditType: 1,//新增0，修改1
            //     BusType: this.busType,//收款0，付款1
            //     BillContent: {
            //         PaymentData: data.PaymentData,
            //         VerificationStatus: data.VerificationStatus,
            //         ProjectName: data.ProjectName,
            //         ContractNumber: data.ContractNumber,
            //         PaymentMoney: data.PaymentMoney,
            //         PaidMoney: data.PaidMoney,
            //         UnPaidMoney: data.UnPaidMoney,
            //         HouseName: data.HouseName
            //     }
            // }))
        } else {
            // this.props.dispatch(removePayReceiveListItem({
            //     KeyID: data.KeyID,
            //     index: this.busType //收款0，付款1
            // }))
            // busType 收款0，付款1
            store.dispatch(deleteList({
                key:this.busType?'AgentPayReceiptList_pay':'AgentPayReceiptList_receive',
                KeyID: data.KeyID,
            }))
        }
    }

    buildButton() {
        const btnOptions = []
        getButtons('PaymentBill').then((data) => {
            // if (data.find(x => x.EActionName === 'Edit') && this.state.form.VerificationStatus === 1) {
            //   btnOptions.push({label: '修改', value: 'Edit'})
            // }
            if (data.find(x => x.EActionName === 'Delete') && this.state.form.VerificationStatus === 1 && this.state.form.PaidMoney === 0 && this.busType === 0) {
                btnOptions.push({label: '删除', value: 'Delete'})
            }
            if (data.find(x => x.EActionName === 'Write') && this.state.form.VerificationStatus === 1 && this.state.form.PaidMoney === 0) {
                btnOptions.push({label: '核销', value: 'Write'})
            }
            if (data.find(x => x.EActionName === 'ToPay') && this.state.form.VerificationStatus === 1 && this.busType === 0) {
                btnOptions.push({label: '去支付', value: 'ToPay'})
            }
            if (data.find(x => x.EActionName === 'Write') && this.state.form.OnLineOrOffLine !== 1 && this.state.form.VerificationStatus === 2) {
                btnOptions.push({label: '撤销核销', value: 'UnWrite'})
            }
            this.setState({
                btnOptions
            })
        })
    }

    render() {
        const {form} = this.state
        return (
            <View style={styles.resource_container}>
                <Header title={this.busType === 0 ? '收款明细' : '付款明细'}/>
                <FullModal visible={this.state.loading}/>
                <GiftedForm formName='EditPayReceiptRuleForm'>
                    {
                        this.busType === 0 && !this.editType ?
                            <View style={styles.top_title}>
                                <View style={styles.top_content}>
                                    <Text style={styles.top_content_receiveMoney}>¥{form.PaymentMoney + ''}</Text>
                                </View>
                                <View style={styles.top_content}>
                                    <Text style={styles.top_content_paidMoney}>(已收{form.PaidMoney})</Text>
                                </View>
                            </View>

                            :<View/>
                    }
                    <GiftedForm.SeparatorWidget/>
                    <GiftedForm.LabelWidget
                        name='ContractNumber'
                        title='合同编号'
                        required={false}
                        renderRight={false}
                        value={form.ContractNumber || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='CommunityName'
                        title='小区'
                        required={false}
                        renderRight={false}
                        value={form.CommunityName}
                    />
                    <GiftedForm.LabelWidget
                        name='RoomNumber'
                        title='门牌'
                        required={false}
                        renderRight={false}
                        value={form.RoomNumber + ''}
                    />
                    <GiftedForm.LabelWidget
                        name='PaymentMoney'
                        title='应收金额'
                        required={false}
                        renderRight={false}
                        value={form.PaymentMoney + ''}
                    />
                    {this.busType === 0 &&
                    <GiftedForm.LabelWidget
                        name='PaidMoney'
                        title='已收金额'
                        required={false}
                        renderRight={false}
                        value={form.PaidMoney + ''}
                    />
                    }
                    {this.busType === 0 &&
                    <GiftedForm.LabelWidget
                        name='PaidMoney'
                        title='未收金额'
                        required={false}
                        renderRight={false}
                        value={form.UnPaidMoney + ''}
                    />
                    }
                    <GiftedForm.LabelWidget
                        name='Details'
                        title='收支类型'
                        required={false}
                        renderRight={false}
                        value={this.busType === 0 ? '收入' : '支出'}
                    />
                    <GiftedForm.LabelWidget
                        name='PaymentData'
                        title='日期'
                        required={false}
                        renderRight={false}
                        value={form.PaymentData + ''}
                    />
                    <GiftedForm.LabelWidget
                        name='OutRoomName'
                        title='经手人'
                        required={false}
                        renderRight={false}
                        value={form.OutRoomName || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='EdName'
                        title='主管'
                        required={false}
                        renderRight={false}
                        value={form.EdName || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='StoreManager'
                        title='门店经理'
                        required={false}
                        renderRight={false}
                        value={form.StoreManager || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='VerificationStatusName'
                        title='核销状态'
                        required={false}
                        renderRight={false}
                        value={form.VerificationStatusName || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='BalanceTypeName'
                        title='结算方式'
                        required={false}
                        renderRight={false}
                        value={form.BalanceTypeName || '无'}
                    />
                    <GiftedForm.LabelWidget
                        name='InitialCashBank'
                        title='账户'
                        required={false}
                        renderRight={false}
                        value={form.InitialCashBank + ''}
                    />
                    <GiftedForm.NoticeWidget title={`明细`}/>
                    <GiftedForm.TextAreaWidget
                        name='Remarks'
                        required={false}
                        disabled={true}
                        maxLength={100}
                        value={form.DetailsMark || '无'}
                    />
                    <GiftedForm.NoticeWidget title={`图片凭证`}/>
                    <ImagePreview imgSrc={form.Pic || []}/>
                    <GiftedForm.NoticeWidget title={`备注`}/>
                    <GiftedForm.TextAreaWidget
                        name='Remarks'
                        required={false}
                        disabled={true}
                        maxLength={100}
                        value={form.Remarks || '无'}
                    />
                </GiftedForm>
                <View>
                    <ButtonGroup
                        options={this.state.btnOptions}
                        handleEditClick={() => this.handleSave()}
                        handleDeleteClick={() => this.handleDelete()}
                        handleWriteClick={() => this.handleWrite()}
                        handleUnWriteClick={() => this.handleUnWrite()}
                        handleToPayClick={() => this.handleToPay()}
                    />
                </View>
            </View>
        )
    }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(EditOwnerResource)
