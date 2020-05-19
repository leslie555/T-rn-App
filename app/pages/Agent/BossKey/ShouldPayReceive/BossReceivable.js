import React from 'react'
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import styles from './style'
import { List, FullModal,  Header, SelectDateBanner, BossKeyHeader } from '../../../../components'
import { QueryBossReceivable, QueryBossReceivableReport } from '../../../../api/bossKey'
import { dateFormat } from '../../../../utils/dateFormat'
export default class BossReceivable extends React.Component {
    constructor(props) {
        super(props)
        this.returnData = [],
        this.getTimeShow = '',
        this.getReturnData = []
        this.state = {
            loadingVisible: false,
            listKey: 'BossReceivable',
            form: {
                parm: {
                    page: 1,
                    size: 10
                },
                CityCode: '5101XX',
                TimerShaft: '',
                // (0：全部，1：已收，2：未收，3：逾期)
                PayStatus: '',
                // 0 day 1 month 2year
                ReportTimeType: 0,
                // SearchDate: '' // 头部入参
            },
            type:'date',
            PaidMoney: 0,
            UnPaidMoney: 0,
            OnLine: 0,
            //接口接受的数据
            billProject: [],
            // 展示picker是否出现
            billProjectVisible: false,
            // 选中的数据
            billProjectSelectedValue: []
        }
    }
    goBack() {
        this.props.navigation.goBack();
    }
    //数据转化  日期和时间 前面加 0
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    transformStandardHorizontal(format, date) {
        // format 可以等于 'Y-M-D'  'Y/M/D' 'Y/M/D h:m:s'  'h:m'
        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        if (!date) {
            date = new Date()
        }
        if (typeof date === 'string') {
            date = new Date(date)
        }
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));
        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    }
    getHandleChange(data,type){
        var getData = '';
        var typeData = 0;
        const form = {...this.state.form}
        if(type === 'date'){
            getData = this.transformStandardHorizontal('Y-M-D',data)
            typeData = 0
            // form.SearchDate = getData
        }else if(type === 'month'){
            getData = this.transformStandardHorizontal('Y-M',data)
            typeData = 1
            // form.SearchDate = getData
        }else{
            getData = this.transformStandardHorizontal('Y',data)
            typeData = 2
            // form.SearchDate = this.transformStandardHorizontal('Y-M',data) // 'SearchDateSearchDate这个字段不能只传年, 后端识别不了'
        }
        form.TimerShaft = getData
        form.ReportTimeType = typeData
        form.parm.page = 1
        this.setState({
            form
        },()=>{
            this.fetchData()
        })
    }
    renderApprovalItem({ item }) {
        return (
            <View style={styles.outside_box}>
                <View style={styles.inside_box}>
                    <TouchableOpacity>
                        <View style={styles.item_title}>
                            <View style={styles.item_title_bothCon}>
                                <Text
                                    style={styles.item_title_text}>应收款日： &nbsp;&nbsp;&nbsp;{dateFormat(item.ReceivableDate)}</Text>
                            </View>
                            <View>
                                <Text
                                    style={[styles.item_title_textRight, styles.account_colorR]}>{item.Remark}</Text>
                            </View>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.con_body}>
                            <View style={styles.item_info}>
                                <View style={styles.type_title_container}>
                                    <Text style={styles.type_title}>房源名称：&nbsp;&nbsp;{item.HouseName}</Text>
                                    <Text style={styles.content_title}>{item.ReceivableMoney}元</Text>
                                </View>
                            </View>
                            <View style={styles.content_container}>
                                <View style={styles.content_container_time}>
                                    <Text style={styles.content_title}>项         目：&nbsp;&nbsp;{item.BillProjectName}</Text>
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    componentWillMount() {
        // 传给日历的时间
        const returnData = this.props.navigation.state.params.returnData
        this.getReturnData = returnData
        if (!!returnData) {
            debugger
            this.getTimeShow = returnData[0].time
            this.state.form.TimerShaft = returnData[0].time
            // this.state.form.SearchDate = returnData[0].time
            this.state.form.PayStatus = returnData[2].value
            this.state.form.CityCode = returnData[1].value
            this.state.form.ReportTimeType = returnData[0].value === 'date' ? 0 : returnData[0].value === 'month' ? 1 : 2
            this.state.type = returnData[0].value
        }
    }
    componentDidMount() {
        const returnData = this.props.navigation.state.params.returnData
        !returnData ? this.NowData() : this.getDataTime(returnData)
        this.fetchData();
    }
    getDataTime() {
        //
    }
    //  获取今天时间
    NowData(){
        var date = new Date()
        var getData = this.transformStandardHorizontal('Y-M-D',date)
        this.state.form.TimerShaft = getData
        // this.state.form.SearchDate = getData
        this.setState({
            form: this.state.form
        })
    }
    fetchData(){
        this.setState({
            loadingVisible: true
        })
        QueryBossReceivableReport(this.state.form).then(({ Data }) => {
            const {PaidMoney,UnPaidMoney,OnLine} = Data
            this.setState({
                PaidMoney: PaidMoney.toFixed(2),
                UnPaidMoney: UnPaidMoney.toFixed(2),
                OnLine: OnLine.toFixed(2),
                loadingVisible: false
            })
        }).catch(()=>{
            this.setState({
              loadingVisible: false
            })
          })
    }
    getPickerData(index, subindex, data, num) {
        const form = { ...this.state.form }
        if(index === 0) {
            this.setState({
                type: data.value
            })
        } else if(index === 1 && num !== 1) {
            form.CityCode = data.value
            form.parm.page = 1
            this.setState({
                form
            },()=>{
                this.fetchData()
            })
        } else if(index === 2) {
            form.PayStatus = data.value
            form.parm.page = 1
            this.setState({
                form
            },()=>{
                this.fetchData()
            })
        }
    }

    renderItemAll(){
        const renderItem = ({ item }) => {
            return this.renderApprovalItem({ item })
        }
        return (
            <View style={{flex: 1, zIndex: -2}}>
                <SelectDateBanner
                type={this.state.type}
                initSelected={this.getTimeShow}
                handleChange={(data, type)=>{
                    this.getHandleChange(data, type)
                }}/>
                <View style={styles.boss_pdddingSize}>
                    <View style={styles.boss_receivable}>
                        <View style={styles.boss_receivableItemXian}>
                            <View style={styles.boss_receivableItemXianText}><Text style={styles.boss_receivablelue}>{this.state.OnLine}</Text><Text>元</Text></View>
                            <View style={styles.boss_receivableItemXianText}><Text>线上收款</Text></View>
                        </View>
                    </View>
                    <View style={styles.boss_receivable}>
                        <View style={styles.boss_receivableItem}>
                            <View style={styles.boss_receivableItemXianText}><Text style={styles.boss_receivablelue}>{this.state.UnPaidMoney}元</Text></View>
                            <View style={styles.boss_receivableItemXianText}><Text>未收</Text></View>
                        </View>
                        <View style={styles.boss_receivableItem}>
                            <View style={styles.boss_receivableItemXianText}><Text style={styles.boss_receivablelue}>{this.state.PaidMoney}元</Text></View>
                            <View style={styles.boss_receivableItemXianText}><Text>已收</Text></View>
                        </View>
                    </View>
                </View>
                <List
                    request={QueryBossReceivable}
                    form={this.state.form}
                    setForm={form => this.setState({ form })}
                    listKey={this.state.listKey}
                    onRefresh={this.onRefresh}
                    renderItem={renderItem}
                    hasSameKeyID={true}
                />
            </View>
        )
    }
    render() {
 
        return (
            <View style={styles.container}>
                <Header
                    hideLeft={false}
                    title={'应收'}
                />
                <FullModal visible={this.state.loadingVisible} type={2}/>
                <BossKeyHeader
                    renderItem = {this.renderItemAll.bind(this)}
                    // 1 报表  2城市区域  3已收 4已付 
                    type={[1, 2, 3]}
                    getPickerData = {(index, subindex, data, num) => {
                        this.getPickerData(index, subindex, data, num)
                    }}
                    returnData = {this.getReturnData}
                />
            </View>
        )
    }
}
