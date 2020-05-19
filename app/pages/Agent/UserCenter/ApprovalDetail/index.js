import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {Container} from '../../../../styles/commonStyles';
import {dateFormat} from '../../../../utils/dateFormat';
import {Header} from "../../../../components";
import {QueryApplyByID} from '../../../../api/userCenter'
import style from './style'
import {getEnumDesByValue} from "../../../../utils/enumData";

export default class ApprovalDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: {},
            List: []
        }
        this.version = this.props.navigation.state.params.version || 'old'
        this.fetchData = this.fetchData.bind(this)
    }

    // life
    componentDidMount() {
        this.fetchData()
    }

    // methods
    fetchData() {
        QueryApplyByID({
            KeyID: this.props.navigation.state.params.id
        }).then(res => {
            this.setState({
                content: res.Data.ApplyAudit,
                List: res.Data.List
            })
        })
    }

    toAudit(item) {
        this.props.navigation.navigate('AgentConfirmAudit',{id:item.KeyID,version:this.version})
    }

    renderProcessItem(item) {
        return (
            <View style={style.process_item}>
                {/*<View style={style.dashed_vertical_line} />*/}
                <View style={style.audit_content_line}>
                    <View style={style.process_title}>
                        <View style={style.process_title_left}>
                            <View style={item.RecordType == 2?style.out_circle_waitaudit:item.RecordType == 3?style.out_circle_passed:style.out_circle_nopass}>
                                <View style={item.RecordType == 2?style.inner_circle_waitaudit:item.RecordType == 3?style.inner_circle_passed:style.inner_circle_nopass} />
                            </View>
                            {
                                item.RecordType == 2? (
                                    <Text style={style.process_title_text_waitaudit}>待审批</Text>
                                ): item.RecordType == 3? (
                                    <Text style={style.process_title_text_passed}>已通过</Text>
                                ):(<Text style={style.process_title_text_nopass}>未通过</Text>)
                            }
                        </View>
                        <Text style={style.process_auditor}>{item.AuditorName}</Text>
                    </View>
                    <Text style={style.process_audit_date}>{dateFormat(item.AuditTime,'yyyy-MM-dd hh:mm:ss') }</Text>
                    {
                        item.AuditRemark&&item.AuditRemark.length>0 &&
                        <Text style={style.process_remark}>备注：{item.AuditRemark}</Text>
                    }
                </View>
            </View>
        )
    }

    render() {
        const item = this.state.content
        const processList = this.state.List.map(m=>{
            return this.renderProcessItem(m)
        })
        return (
            <View style={{...Container}}>
                <Header title='审批详情'/>
                <View style={style.approval_content}>
                    <Text style={style.content_title}>{getEnumDesByValue('BusinessType', item.BusinessType)}</Text>
                    <View style={style.line}/>
                    <View style={style.content_applay_name}>
                        <Text style={style.content_apply_name_text}>{item.ApplyName}</Text>
                        <Text style={style.content_apply_date_text}>{dateFormat(item.ApplyTime, 'yyyy-MM-dd hh:mm:ss')}</Text>
                    </View>
                    <Text style={style.content_apply_info}>{item.AuditContent}</Text>
                </View>
                <ScrollView contentContainerStyle={style.scroller}>
                    <View style={style.approval_process}>
                        {processList}
                        <View style={style.process_item}>
                            <View  style={style.audit_content}>
                                <View style={style.process_title}>
                                    <View style={style.process_title_left}>
                                        <View style={style.out_circle_waitaudit}>
                                            <View style={style.inner_circle_waitaudit} />
                                        </View>
                                        <Text style={style.process_title_text_waitaudit}>已提交</Text>
                                    </View>
                                    <Text style={style.process_auditor}>{item.ApplyName}</Text>
                                </View>
                                <Text style={style.process_audit_date}>{dateFormat(item.ApplyTime, 'yyyy-MM-dd hh:mm:ss')}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {
                    item.AuditStatus == 1 &&
                    <TouchableOpacity style={style.page_bottom} onPress={this.toAudit.bind(this,item)}>
                        <Text style={style.audit_btn}>审批</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

