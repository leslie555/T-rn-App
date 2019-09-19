import React, {Component} from 'react'
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    Linking,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'
import style from './style'
import {CommonColor, Container} from "../../../../styles/commonStyles";
import {QueryApplyList} from '../../../../api/userCenter'
import {getEnumDesByValue} from '../../../../utils/enumData'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {connect} from 'react-redux'
import {dateFormat} from "../../../../utils/dateFormat";
import IconFont from '../../../../utils/IconFont/index'
import {Header, List} from "../../../../components";
import SearchBar from "../../../../components/SearchBar";

class MyApproval extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchBarVisible: false,
            form1: {
                pageParam: {
                    page: 1,
                    size: 10
                },
                ApplyName: '',
                AuditStatus: ["1"]
            },
            form2: {
                pageParam: {
                    page: 1,
                    size: 10
                },
                ApplyName: '',
                AuditStatus: ["2"]
            },
            form3: {
                pageParam: {
                    page: 1,
                    size: 10
                },
                ApplyName: '',
                AuditStatus: ["3"]
            },
            activeIndex: 0
        }
        // 路由监听
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
              if(payload.state.params && payload.state.params.type) {
                  this.setState({
                      activeIndex: +payload.state.params.type
                  })
              }
            })
    }

    // componentDidMount() {
    //     const type = this.props.navigation.getParam('type')
    //     if(type) {
    //         this.setState({
    //             activeIndex: +type
    //         })
    //     }
    // }

    changeTab(val) {
        this.setState({
            activeIndex: val.i
        })
    }

    // 业务详情
    toBussinessDetail(item) {
        // 1: 业主合同 2:房源 3:租客合同
        if (item.BusinessType === 1) {
            this.props.navigation.navigate('AgentContractDetail', {
                id: item.ProfessionID,
                isOwner: true
            })
        } else if (item.BusinessType === 3) {
            this.props.navigation.navigate('AgentContractDetail', {
                id: item.ProfessionID,
                isOwner: false
            })
        }
    }

    toAuditDetail(item) {
        this.props.navigation.navigate('AgentApprovalDetail', {
            id: item.KeyID
        })
    }

    toggleSearch() {
        this.setState({
            searchBarVisible: !this.state.searchBarVisible
        })
    }

    searchKeyword(val) {
        if(this.state.activeIndex == 0) {
            this.state.form1.ApplyName = val
            this.state.form1.pageParam.page = 1
            this.setState({
                form1: {...this.state.form1}
            })
        } else if(this.state.activeIndex == 1) {
            this.state.form2.ApplyName = val
            this.state.form2.pageParam.page = 1
            this.setState({
                form2: {...this.state.form2}
            })
        } else {
            this.state.form3.ApplyName = val
            this.state.form3.pageParam.page = 1
            this.setState({
                form3: {...this.state.form3}
            })
        }
    }

    renderApprovalItem({item}) {
        const AuditContent = item.AuditContent && item.AuditContent.length > 20 ?
            item.AuditContent.substr(0, 20) + '...' :
            item.AuditContent
        let viewInfo, hasBtn, btnLine = false
        // 仅合同，房源业务可以查看详情
        if (item.BusinessType && item.BusinessType === 1 || item.BusinessType === 3) {
            viewInfo = (<TouchableOpacity style={style.bussiness_type_btn}
                                          onPress={this.toBussinessDetail.bind(this, item)}>
                <Text style={style.btn_text}>业务详情</Text>
            </TouchableOpacity>)
            hasBtn = true
        }
        if (hasBtn) {
            btnLine = (<View style={style.line}/>)
        }
        return (
            <View style={style.outside_box}>
                <View style={style.inside_box}>
                    <TouchableOpacity onPress={this.toAuditDetail.bind(this, item)}>
                        <View style={style.item_title}>
                            <View style={style.vertical_line} />
                            <Text
                                style={style.item_title_text}>{getEnumDesByValue('BusinessType', item.BusinessType)}</Text>
                        </View>
                        <View style={style.line}/>
                        <View style={style.item_info}>
                            <View style={style.content_container}>
                                <View style={style.content_container_person}>
                                    <Text style={style.content_title}>申请人：</Text>
                                    <Text style={style.content_text}>{item.ApplyName}</Text>
                                </View>
                                <View style={style.content_container_time}>
                                    <Text style={style.content_title}>申请时间：</Text>
                                    <Text
                                        style={style.content_text}>{dateFormat(item.ApplyTime, 'yyyy-MM-dd')}</Text>
                                </View>
                            </View>
                            <View style={style.type_title_container}>
                                <Text style={style.type_title}>内容：</Text>
                                <Text style={style.type_content}>{AuditContent}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {btnLine}
                    {
                        hasBtn? (
                            <View style={style.opera_btn_container}>
                                {viewInfo}
                            </View>
                        ):(<View/>)
                    }
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={Container}>
                <Header title='我的审批' headerRight={
                    <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
                       <IconFont name='search' size={20} color='white' />
                    </TouchableOpacity>
                }>
                    {
                        this.state.searchBarVisible &&
                        <SearchBar
                            placeholder='请输入内容/申请人/合同号'
                            onChangeText={(text) => {
                                this.searchKeyword(text)}
                            }
                            onCancel={(text)=>{
                                this.toggleSearch()
                                text && this.searchKeyword('')
                            }}
                            onClear={()=>{
                                this.searchKeyword('')}
                            }
                        />
                    }
                </Header>
                <ScrollableTabView
                    tabBarTextStyle={style.tabbar_textstyle}
                    tabBarActiveTextColor={CommonColor.color_primary}
                    tabBarUnderlineStyle={style.tabbar_underline}
                    style={style.tabbar_style}
                    page={this.state.activeIndex}
                    onChangeTab={this.changeTab.bind(this)}
                >
                    <View style={style.tabbar_content} tabLabel="待审核">
                        <List request={QueryApplyList}
                              pageKey="pageParam"
                              form={this.state.form1}
                              listKey={'AgentApprovalList_WaitAudit'}
                              setForm={form1 => this.setState({form1})}
                              renderItem={this.renderApprovalItem.bind(this)}
                        />
                    </View>
                    <View style={style.tabbar_content} tabLabel="已通过">
                        <List request={QueryApplyList}
                              pageKey="pageParam"
                              form={this.state.form2}
                              listKey={'AgentApprovalList_Passed'}
                              setForm={form2 => this.setState({form2})}
                              renderItem={this.renderApprovalItem.bind(this)}
                        />
                    </View>
                    <View style={style.tabbar_content} tabLabel="未通过">
                        <List request={QueryApplyList}
                              pageKey="pageParam"
                              form={this.state.form3}
                              listKey={'AgentApprovalList_noPass'}
                              setForm={form3 => this.setState({form3})}
                              renderItem={this.renderApprovalItem.bind(this)}
                        />
                    </View>
                </ScrollableTabView>
            </View>
        )
    }
}

const mapToProps = state => ({approvalList: state.approvalList})
export default connect(mapToProps)(MyApproval)
