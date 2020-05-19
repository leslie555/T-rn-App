import React, { Component, Fragment } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    RefreshControl,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'
import IconFont from '../../../../utils/IconFont/index'
import style from './style'
import { CommonColor, Container } from "../../../../styles/commonStyles";
import { getEnumListByKey } from "../../../../utils/enumData";
import { dateFormat } from "../../../../utils/dateFormat";
import { GetReceiveListNew, GetPaymentListNew } from "../../../../api/payReceipt";
// import {MenuDatePicker} from '../../../../components/MoreFilterMenu'
import { connect } from 'react-redux'
import { List, ListSelector } from "../../../../components";
import SearchBar from "../../../../components/SearchBar";
import { withNavigation } from "react-navigation";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { TabBar } from "../../../../components";
import rootBackHandle from "../../../../utils/rootBackHandle";

class ReceiveBillList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listConfig: [
                {
                    type: 'title',
                    title: '核销状态',
                    data: []
                },
                {
                    type: 'title',
                    title: '收款方式',
                    data: [
                        { title: '全部', value: '' },
                        { title: '系统收款', value: '1' },
                        { title: '线下收款', value: '2' }
                    ]
                },
                {
                    type: 'panel',
                    title: '更多筛选',
                    components: [
                        {
                            type: 'checkbox',
                            title: '账户类型',
                            data: []
                        },
                        {
                            type: 'datepicker',
                            title: '日期'
                        }
                    ]
                }
            ],
            form: {
                pageParam: {
                    page: 1,
                    size: 10
                },
                KeyWord: '',
                VerificationStatus: '',
                CompanyID: '',
                AccountType: '', // 账户类型
                PayWay: '', //收款方式
                startTime: '开始时间',
                endTime: '结束时间'
            },
        }
        this.ListSelector = null
    }

    componentWillMount() {
        // 获取核销状态枚举
        const enumList = getEnumListByKey('VerStatus')
        const verStatusList = enumList.map(val => ({
            title: val.Description,
            value: val.Value
        }))
        verStatusList.shift()
        verStatusList.unshift({ title: '全部', value: '' })
        this.state.listConfig[0].data = verStatusList
        this.setState({
            listConfig: this.state.listConfig
        })

        // 获取账户管理枚举
        const enumList2 = getEnumListByKey('AccountType')
        const accountList = enumList2.map(val => ({
            title: val.Description,
            value: val.Value
        }))
        accountList.unshift({ title: '全部', value: '' })
        this.state.listConfig[2].components[0].data = accountList
    }

    refreshList() {
        this.state.form = { ...this.state.form }
        this.setState({
            form: this.state.form
        })
    }

    setFormScreen(val) {
        let form = { ...this.state.form }
        form.pageParam.page = 1
        form = {
            ...form,
            ...val
        }
        this.setState({ form })
    }

    updateKeyword(val) {
        this.setFormScreen({ KeyWord: val })
    }

    onSelectMenu = (index, subindex, data) => {
        const form = { ...this.state.form }
        form.pageParam.page = 1
        switch (index) {
            case 0:
                form.VerificationStatus = data.value
                this.setState({ form })
                break
            case 1:
                form.PayWay = data.value
                this.setState({ form })
                break
            case 2:
                data.forEach((item, index) => {
                    if (!item.data) {
                        item.data = {
                            value: '',
                            startTime: '',
                            endTime: ''
                        }
                    }
                    switch (index) {
                        case 0:
                            form.AccountType = item.data.value
                            break
                        case 1:
                            form.startTime = item.data.startTime
                            form.endTime = item.data.endTime
                            break
                    }
                })
                this.setState({ form })
                break
            default:
                break
        }
    }

    renderContent() {
        return (
            <List
                pageKey="pageParam"
                style={style.scroller}
                request={GetReceiveListNew}
                form={this.state.form}
                listKey={'AgentPayReceiptList_receive'}
                setForm={form => this.setState({ form })}
                renderItem={this.props.renderBillItem}
            />
        )
    }

    render() {
        return (
            <ListSelector
                ref={ListSelector => (this.ListSelector = ListSelector)}
                config={this.state.listConfig}
                onSelectMenu={this.onSelectMenu}
                renderContent={this.renderContent.bind(this)}
            />
        )
    }
}

class PayBillList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listConfig: [
                {
                    type: 'title',
                    title: '核销状态',
                    data: []
                },
                {
                    type: 'panel',
                    title: '更多筛选',
                    components: [
                        {
                            type: 'checkbox',
                            title: '账户类型',
                            data: []
                        },
                        {
                            type: 'datepicker',
                            title: '日期'
                        }
                    ]
                }
            ],
            form: {
                pageParam: {
                    page: 1,
                    size: 10
                },
                KeyWord: '',
                VerificationStatus: '',
                CompanyID: '',
                AccountType: '', // 账户类型
                PayWay: '', //收款方式
                startTime: '开始时间',
                endTime: '结束时间'
            },
        }
        this.ListSelector = null
    }

    componentWillMount() {
        // 获取核销状态枚举
        const enumList = getEnumListByKey('VerStatus')
        const verStatusList = enumList.map(val => ({
            title: val.Description,
            value: val.Value
        }))
        verStatusList.shift()
        verStatusList.unshift({ title: '全部', value: '' })
        this.state.listConfig[0].data = verStatusList
        this.setState({
            listConfig: this.state.listConfig
        })

        // 获取账户管理枚举
        const enumList2 = getEnumListByKey('AccountType')
        const accountList = enumList2.map(val => ({
            title: val.Description,
            value: val.Value
        }))
        accountList.unshift({ title: '全部', value: '' })
        this.state.listConfig[1].components[0].data = accountList
    }

    onSelectMenu = (index, subindex, data) => {
        const form = { ...this.state.form }
        form.pageParam.page = 1
        switch (index) {
            case 0:
                form.VerificationStatus = data.value
                this.setState({ form })
                break
            case 1:
                data.forEach((item, index) => {
                    if (!item.data) {
                        item.data = {
                            value: '',
                            startTime: '',
                            endTime: ''
                        }
                    }
                    switch (index) {
                        case 0:
                            form.AccountType = item.data.value
                            break
                        case 1:
                            form.startTime = item.data.startTime
                            form.endTime = item.data.endTime
                            break
                    }
                })
                this.setState({ form })
                break
            default:
                break
        }
    }

    setFormScreen(val) {
        let form = { ...this.state.form }
        form.pageParam.page = 1
        form = {
            ...form,
            ...val
        }
        this.setState({ form })
    }

    updateKeyword(val) {
        this.setFormScreen({ KeyWord: val })
    }

    renderContent() {
        return (
            <List
                style={style.scroller}
                pageKey="pageParam"
                request={GetPaymentListNew}
                form={this.state.form}
                listKey={'AgentPayReceiptList_pay'}
                setForm={form => this.setState({ form })}
                renderItem={this.props.renderBillItem}
            />
        )
    }

    render() {
        return (
            <ListSelector
                ref={ListSelector => (this.ListSelector = ListSelector)}
                config={this.state.listConfig}
                onSelectMenu={this.onSelectMenu}
                renderContent={this.renderContent.bind(this)}
            />
        )
    }
}

class PayReceiptList extends Component {
    constructor(props) {
        super(props)
        this.rootBackHandle = new rootBackHandle(this.props.navigation)
        this.receiveList = null
        this.payList = null
        this.state = {
            searchBarVisible: false,
            activeIndex: 0
        }
    }

    componentDidMount() {
        const type = this.props.navigation.getParam('type')
        if (type) {
            this.setState({
                activeIndex: type
            })
        }
        const isRefresh = this.props.navigation.getParam('isRefresh', false)
        if (isRefresh) {
            this.receiveList.refreshList()
        }
    }

    componentWillUnmount() {
        this.rootBackHandle.remove()
    }

    renderBillItem({ item }) {
        const ProjectName = item.ProjectName.length > 16 ? item.ProjectName.substr(0, 16) + '...' : item.ProjectName
        return (
            <View style={style.outside_box}>
                <View style={style.inside_box}>
                    <TouchableOpacity onPress={this.toDetail.bind(this, item)}>
                        <View style={style.item_title}>
                            <Text style={style.item_title_date}>{dateFormat(item.PaymentData, 'yyyy-MM-dd')}</Text>
                            {
                                item.VerificationStatus === 1 ? (
                                    <Text style={style.item_title_status}>未核销</Text>
                                ) : (<Text style={style.item_title_status2}>已核销</Text>)
                            }
                        </View>
                        <View style={style.line} />
                        <View style={style.bill_detail}>
                            <Text style={style.bill_detail_title}>明细：</Text>
                            <Text style={style.bill_detail_info}>{ProjectName}</Text>
                        </View>
                        <View style={style.item_info}>
                            <View style={style.contract_number}>
                                <Text style={style.contract_number_title}>房源名称：</Text>
                                <Text style={style.contract_number_info}>{item.HouseName}</Text>
                            </View>
                            <Text style={style.price_info}>{item.PaymentMoney}元</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    toDetail(item) {
        this.props.navigation.navigate('AgentPayReceiptDetail', { KeyID: item.KeyID, busType: this.state.activeIndex, ProjectName: item.ProjectName })
    }

    toAddBill() {
        this.props.navigation.navigate('AgentEditPayReceipt', { editType: 0, busType: this.state.activeIndex }) // 0收款 1付款 KeyID 修改用的id
    }

    toggleSearch() {
        this.setState({
            searchBarVisible: !this.state.searchBarVisible
        })
    }

    searchKeyword(val) {
        if (this.state.activeIndex == 0) {
            this.receiveList.updateKeyword(val)
        } else {
            this.payList.updateKeyword(val)
        }
    }

    onChangeTab = ({ i }) => {
        this.setState({
            activeIndex: i
        })
    }

    render() {
        return (
            <View style={Container}>
                <ScrollableTabView
                    tabBarActiveTextColor={'#fff'}
                    tabBarInactiveTextColor={'rgb(153,209,254)'}
                    tabBarTextStyle={{ fontSize: 17 }}
                    initialPage={0}
                    page={this.state.activeIndex}
                    locked={this.state.searchBarVisible}
                    onChangeTab={this.onChangeTab}
                    renderTabBar={() => (
                        <TabBar
                            hideLeft
                            headerRight={
                                <Fragment>
                                    <View style={style.top_right}>
                                        <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
                                            <IconFont name='search' size={20} color='white' />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={style.add_btn} onPress={this.toAddBill.bind(this)}>
                                            {/*<IconFont name='addition' size={20} color='white' />*/}
                                            <Text style={style.add_text}>新增</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Fragment>
                            }
                        >
                            {this.state.searchBarVisible && (
                                <SearchBar
                                    hideLeft
                                    placeholder='请输入合同编号/小区名称/房间号/房源名称'
                                    onChangeText={(text) => {
                                        this.searchKeyword(text)
                                    }
                                    }
                                    onCancel={(text) => {
                                        this.toggleSearch()
                                        text && this.searchKeyword('')
                                    }}
                                    onClear={() => {
                                        this.searchKeyword('')
                                    }
                                    }
                                />
                            )}
                        </TabBar>
                    )}
                >
                    <ReceiveBillList
                        tabLabel='收款'
                        ref={receiveList => {
                            this.receiveList = receiveList
                        }}
                        renderBillItem={this.renderBillItem.bind(this)}
                    />
                    <PayBillList
                        tabLabel='付款'
                        ref={payList => {
                            this.payList = payList
                        }}
                        renderBillItem={this.renderBillItem.bind(this)}
                    />
                </ScrollableTabView>
            </View>
        )
    }
}

const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(PayReceiptList))
