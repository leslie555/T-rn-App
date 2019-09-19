import React, { Component } from 'react';
import { Text, View, TouchableOpacity, RefreshControl, SectionList, DeviceEventEmitter } from 'react-native';
import { Container } from '../../../../styles/commonStyles';
import { ListFooterComponent, EmptyList, ListLoading } from '../../../../components/index'
import IconFont from "../../../../utils/IconFont";
import { dateFormat } from "../../../../utils/dateFormat/index";
import style from './style';
import Toast from 'react-native-root-toast';
import { FindMemoTodayList, FindMemoList } from '../../../../api/userCenter'
import {Header} from '../../../../components'

export default class MyThings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listLoading: false,
            isRefresh: false,
            openRefresh: true,
            isAll: false,
            openLoad: true,
            TodayList: [],
            OtherList: [],
            parm: {
                page: 1,
                size: 15
            }
        }
        this.fetchData = this.fetchData.bind(this)
        this.toastMsg = this.toastMsg.bind(this)
    }

    // 生命周期
    componentDidMount() {
        this.setState({
            listLoading: true
        })
        this.fetchData(true)
        this.updateThings = DeviceEventEmitter.addListener('updateThings', data => {
            if (data.type === 'delete') {
                var CurIndex = 0
                if (data.isToday) {
                    for (let i = 0; i <= this.state.TodayList.length - 1; i++) {
                        if (this.state.TodayList[i].KeyID === data.KeyID) {
                            CurIndex = i
                            break
                        }
                    }
                    this.state.TodayList.splice(CurIndex, 1)
                    this.setState({
                        TodayList: this.state.TodayList
                    })
                } else {
                    for (let k = 0; k <= this.state.OtherList.length - 1; k++) {
                        if (this.state.OtherList[k].KeyID === data.KeyID) {
                            CurIndex = k
                            break
                        }
                    }
                    this.state.OtherList.splice(CurIndex, 1)
                    this.setState({
                        OtherList: this.state.OtherList
                    })
                }
            } else if (data.type === 'update') {
                if (data.isToday) {
                    if (data.isChange) {
                        for (let i = 0; i <= this.state.TodayList.length - 1; i++) {
                            if (this.state.TodayList[i].KeyID === data.KeyID) {
                                CurIndex = i
                                break
                            }
                        }
                        this.state.TodayList.splice(CurIndex, 1)
                        this.state.OtherList.unshift({
                            KeyID: data.KeyID,
                            MemoTime: data.MemoTime,
                            Content: data.Content
                        })
                        this.setState({
                            TodayList: this.state.TodayList,
                            OtherList: this.state.OtherList
                        })
                    } else {
                        for (let i = 0; i <= this.state.TodayList.length - 1; i++) {
                            if (this.state.TodayList[i].KeyID === data.KeyID) {
                                this.state.TodayList[i].MemoTime = data.MemoTime
                                this.state.TodayList[i].Content = data.Content
                                break
                            }
                        }
                        this.setState({
                            TodayList: this.state.TodayList
                        })
                    }
                } else {
                    if (data.isChange) {
                        for (let i = 0; i <= this.state.OtherList.length - 1; i++) {
                            if (this.state.OtherList[i].KeyID === data.KeyID) {
                                CurIndex = i
                                break
                            }
                        }
                        this.state.OtherList.splice(CurIndex, 1)
                        this.state.TodayList.unshift({
                            KeyID: data.KeyID,
                            MemoTime: data.MemoTime,
                            Content: data.Content
                        })
                        this.setState({
                            TodayList: this.state.TodayList,
                            OtherList: this.state.OtherList
                        })
                    } else {
                        for (let i = 0; i <= this.state.OtherList.length - 1; i++) {
                            if (this.state.OtherList[i].KeyID === data.KeyID) {
                                this.state.OtherList[i].MemoTime = data.MemoTime
                                this.state.OtherList[i].Content = data.Content
                                break
                            }
                        }
                        this.setState({
                            OtherList: this.state.OtherList
                        })
                    }
                }
            } else if (data.type === 'add') {
                if (data.isToday) {
                    this.state.TodayList.unshift({
                        KeyID: data.KeyID,
                        MemoTime: data.MemoTime,
                        Content: data.Content
                    })
                    this.setState({
                        TodayList: this.state.TodayList
                    })
                } else {
                    this.state.OtherList.unshift({
                        KeyID: data.KeyID,
                        MemoTime: data.MemoTime,
                        Content: data.Content
                    })
                    this.setState({
                        OtherList: this.state.OtherList
                    })
                }
            }
        })
    }
    componentWillUnmount() {
        // removeListener;
        this.updateThings.remove();
    }

    // methods
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
                this.props.navigation.goBack()
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
    renderThingItem({ item }) {
        // item是FlatList中固定的参数名
        return (
            <TouchableOpacity style={style.msg_item} onPress={() => {
                this.props.navigation.navigate('AgentThingDetail', {
                    KeyID: item.KeyID
                })
            }}>
                <View style={style.msg_item_top}>
                    <View style={style.msg_item_title}>
                        <Text style={style.msg_item_title_text}>{this.trimStr(item.Content)}</Text>
                    </View>
                    <View style={style.msg_item_time}>
                        <Text style={style.msg_item_time_text}>{dateFormat(item.MemoTime, 'yyyy-MM-dd hh:mm')}</Text>
                        <IconFont name='open' size={16} color='#999999'></IconFont>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    trimStr(val) {
        var newStr = val.replace(new RegExp('↵', "gi"), '')
        newStr = newStr.replace(/[\n\r]/g, '')
        var str = newStr
        if (newStr.length > 12) {
            str = newStr.slice(0, 12)
            str = str + '...'
        }
        return str
    }
    // 下拉刷新
    onRefresh() {
        // 需要开关控制下拉,放请求里
        if (this.state.openRefresh) {
            this.state.parm.page = 1
            this.state.openRefresh = false
            this.state.isRefresh = true
            this.state.isAll = false
            this.setState({
                listLoading: true
            })
            this.fetchData(true)
        }
    }
    // 上拉加载
    onEndReached() {
        if (!this.state.isAll && this.state.openLoad) {
            this.setState({
                openLoad: false
            })
            this.fetchData(false)
        }
    }
    fetchData(isReset) {
        if (isReset) {
            FindMemoTodayList().then(res => {
                this.setState({
                    TodayList: !res.Data ? [] : res.Data
                })
                FindMemoList({ parm: this.state.parm }).then(res => {
                    this.state.openRefresh = true
                    this.state.isRefresh = false
                    this.state.OtherList = res.Data.rows
                    if (this.state.OtherList.length === res.Data.records) {
                        this.state.isAll = true
                        this.state.openLoad = false
                    } else {
                        this.state.openLoad = true
                        this.state.parm.page += 1
                    }
                    this.setState({
                        OtherList: this.state.OtherList,
                        isRefresh: this.state.isRefresh,
                        openRefresh: this.state.openRefresh,
                        parm: this.state.parm,
                        isAll: this.state.isAll,
                        openLoad: this.state.openLoad,
                        listLoading: false
                    })
                })
            }).catch(() => {
                this.toastMsg('网络错误,请稍后重试')
                this.state.openRefresh = true
                this.state.isRefresh = false
                this.setState({
                    isRefresh: this.state.isRefresh,
                    openRefresh: this.state.openRefresh,
                    listLoading: false
                })
            })
        } else {
            if (!this.state.isAll) {
                FindMemoList({ parm: this.state.parm }).then(res => {
                    this.state.OtherList = this.state.OtherList.concat(res.Data.rows)
                    if (this.state.OtherList.length === res.Data.records) {
                        this.state.isAll = true
                        this.state.openLoad = false
                    } else {
                        this.state.openLoad = true
                        this.state.parm.page += 1
                    }
                    this.setState({
                        OtherList: this.state.OtherList,
                        isAll: this.state.isAll,
                        parm: this.state.parm,
                        openLoad: this.state.openLoad,
                        listLoading: false
                    })
                })
            } else {
                this.setState({
                    isRefresh: false,
                    openRefresh: true,
                    listLoading: false
                })
            }
        }
    }

    render() {
        return (
            <View style={Container}>
                <Header title='我的待办' headerRight={
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AgentAddThing')}>
                        <IconFont name='addition' size={20} color='white'></IconFont>
                    </TouchableOpacity>
                }/>
                {this.state.listLoading ? (<ListLoading isVisible={this.state.listLoading} />) : (<SectionList
                    extraData={this.state}
                    contentContainerStyle={style.scroller}
                    ListEmptyComponent={<EmptyList text='暂无待办' />}
                    ListFooterComponent={<ListFooterComponent list={this.state.OtherList} isAll={this.state.isAll} />}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={0.1}
                    renderItem={this.renderThingItem.bind(this)}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{ fontWeight: "bold", padding: 10 }}>{title}</Text>
                    )}
                    sections={this.state.TodayList.length === 0 && this.state.OtherList.length === 0 ? [] : [
                        { title: "今日", data: this.state.TodayList },
                        { title: "其他", data: this.state.OtherList }
                    ]}
                    keyExtractor={(item, index) => item + index}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefresh}
                            onRefresh={this.onRefresh.bind(this)}
                            colors={['#389ef2']}
                            tintColor='#389ef2'
                            title='加载中...'
                        />
                    }
                    refreshing={this.state.isRefresh}
                />)}
            </View>
        )
    }
}
