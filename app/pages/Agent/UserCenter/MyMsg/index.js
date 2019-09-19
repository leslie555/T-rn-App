import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Container } from '../../../../styles/commonStyles';
import IconFont from "../../../../utils/IconFont";
import {ShowMessagePush} from '../../../../api/userCenter'
import style from './style';
import { dateFormat } from '../../../../utils/dateFormat'
import {Header,List} from '../../../../components'
import {connect} from "react-redux";
import {withNavigation} from "react-navigation";
import {updateList} from "../../../../redux/actions/list";

class MyMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                parm: {
                    page: 1,
                    size: 10
                }
            }
        }
    }

    renderMsgItem({ item }) {
        // item是FlatList中固定的参数名
        return (
            <View style={style.msg_item}>
                <View style={style.msg_item_top}>
                    <View style={style.msg_item_title}>
                        <Text style={item.IsRead ? style.msg_item_title_text_read : style.msg_item_title_text}>{this.trimStr(item.MessageTitle)}</Text>
                    </View>
                    <View style={style.msg_item_time}>
                        {/* 小圆点 */}
                        {item.IsRead ? null : <View style={style.msg_item_dot}></View>}
                        <Text style={style.msg_item_time_text}>{dateFormat(item.PushTime, 'yyyy-MM-dd')}</Text>
                    </View>
                </View>
                <TouchableOpacity style={style.msg_item_bottom} onPress={this.toDetails.bind(this, item.KeyID)}>
                    <Text style={style.msg_item_seeDetail}>查看详情</Text>
                    <IconFont name='open' size={10} color='#389ef2' />
                </TouchableOpacity>
            </View>
        )
    }

    toDetails(id) {
        this.props.allList['AgentMyMsg'].forEach(item => {
            if (item.KeyID === id) {
                this.props.dispatch(updateList({
                    key: 'AgentMyMsg',
                    KeyID: id,
                    data: {IsRead: true}
                }))
            }
        })
        this.props.navigation.navigate('AgentMsgDetail', {
            id
        })
    }

    trimStr(val) {
        var str = val
        if (val.length > 16) {
            str = val.slice(0, 16)
            str = str + '...'
        }
        return str
    }

    render() {
        return (
            <View style={Container}>
                <Header title="我的消息"/>
                <List request={ShowMessagePush}
                      form={this.state.form}
                      listKey={'AgentMyMsg'}
                      setForm={form => this.setState({form})}
                      renderItem={this.renderMsgItem.bind(this)}
                />
            </View>
        )
    }
}

const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(MyMsg))
