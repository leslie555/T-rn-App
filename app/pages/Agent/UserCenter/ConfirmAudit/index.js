import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import Toast from 'react-native-root-toast';
import Header from '../../../../components/Header'
import {BatchExcuteAudit} from '../../../../api/approval'
import {GiftedForm} from '../../../../components/Form/GiftedForm'
import style from './style.js'
import {connect} from 'react-redux'
import {FullModal} from '../../../../components'
import store from '../../../../redux/store/store'
import IconFont from "../../../../utils/IconFont";
import {withNavigation} from "react-navigation";
import {deleteList,addList} from "../../../../redux/actions/list";

class ConfirmAudit extends Component {
    constructor(props) {
        super(props)
        this.EnumAuditStatus = [
            {
                label: '通过',
                value: 2
            },
            {
                label: '不通过',
                value: 3
            }
        ]
        this.state = {
            KeyID: '',
            auditStatus: 2,
            auditRemark: '',
            loading: false
        }
        this.toastMsg = this.toastMsg.bind(this)
    }

    componentDidMount() {
        const KeyID = this.props.navigation.getParam('id', '')
        if (KeyID) {
            this.setState({
                KeyID
            })
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

    auditStatusChange(val) {
        this.setState({
            auditStatus: val
        })
    }

    auditRemarkChange(val) {
        this.setState({
            auditRemark: val
        })
    }

    submitForm() {
        let isPassValidate = true
        if (!this.state.auditStatus) {
            this.toastMsg('请选择审核状态')
            isPassValidate = false
        }
        if (this.state.auditStatus && this.state.auditStatus === 3 && this.state.auditRemark === "") {
            this.toastMsg('驳回请填写备注')
            isPassValidate = false
        }
        if (isPassValidate) {
            this.setState({
                loading: true
            })
            const postData = [{
                AuditStatus: this.state.auditStatus,
                AuditRemark: this.state.auditRemark,
                KeyID: this.state.KeyID,
                isEnd: 1
            }]
            BatchExcuteAudit(postData).then(res => {
                this.setState({
                    loading: false
                })
                this.toastMsg('审核成功')
                // this.props.dispatch(updateApprovalList({
                //     KeyID: this.state.KeyID,
                //     AuditContent: {
                //         AuditStatus: this.state.auditStatus,
                //         AuditRemark: this.state.auditRemark,
                //         AuditTime: getNowFormatDate()
                //     }
                // }))
                // 更新缓存
                const data = this.props.allList['AgentApprovalList_WaitAudit'].find(item=>{
                    return item.KeyID === this.state.KeyID
                })
                store.dispatch(deleteList({
                    key:'AgentApprovalList_WaitAudit',
                    KeyID: this.state.KeyID,
                }))
                this.props.dispatch(addList({
                    key:this.state.auditStatus==2?'AgentApprovalList_Passed':'AgentApprovalList_noPass',
                    data: {...data,AuditStatus: this.state.auditStatus}
                }))
                this.props.navigation.navigate('AgentMyApprovalList',{type:this.state.auditStatus==2?1:2})
            }).catch(() => {
                this.setState({
                    loading: false
                })
            })
        }
    }

    selectNextAuditor() {

    }

    render() {
        return (
            <View style={style.excute_audit}>
                <Header title="确认审核"/>
                <ScrollView
                    ref='container'
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    style={style.audit_form_container}>
                    <GiftedForm
                        formName='ExcuteAuditForm'
                        clearOnClose={true}
                    >
                        <GiftedForm.PickerWidget
                            name='AuditStatus'
                            title='审批操作'
                            onPickerConfirm={(val) => {
                                this.auditStatusChange(val)
                            }}
                            data={this.EnumAuditStatus}
                            value={this.state.auditStatus}
                        />
                        <GiftedForm.NoticeWidget title={`备注`}/>
                        <GiftedForm.TextAreaWidget
                            name='AuditRemark'
                            required={false}
                            placeholder='请输入备注信息'
                            maxLength={100}
                            onChangeText={this.auditRemarkChange.bind(this)}
                            value={this.state.auditRemark}
                        />
                        {/*{*/}
                            {/*this.state.auditStatus != 3 &&*/}
                                {/*<View style={style.select_next}>*/}
                                    {/*<Text style={style.select_next_title}>继续提交审批</Text>*/}
                                    {/*<TouchableOpacity style={style.select_next_btn} onPress={this.selectNextAuditor.bind(this)}>*/}
                                        {/*<Text style={styles.select_next_text}>请选择下一个审批</Text>*/}
                                        {/*<IconFont name='open' size={12} color='#999999' />*/}
                                    {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                        {/*}*/}
                    </GiftedForm>
                </ScrollView>
                <View style={style.page_bottom}>
                    <TouchableOpacity style={style.page_bottom_btn} onPress={this.submitForm.bind(this)}>
                        <Text style={style.page_btn_text}>提交</Text>
                    </TouchableOpacity>
                </View>
                <FullModal visible={this.state.loading}/>
            </View>
        )
    }

}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(ConfirmAudit))
