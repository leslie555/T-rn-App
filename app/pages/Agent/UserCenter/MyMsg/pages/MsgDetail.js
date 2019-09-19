import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {
    Container,
    DisplayStyle
} from '../../../../../styles/commonStyles';
import Placeholder from 'rn-placeholder';
import {FindMessagePush} from '../../../../../api/userCenter';
import {dateFormat} from '../../../../../utils/dateFormat';
import {Header} from "../../../../../components";

export default class MsgDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isReady: false,
            MsgContent: {
                title: '',
                pushTime: '',
                content: ''
            }
        }
        this.fetchData = this.fetchData.bind(this)
    }

    // life
    componentDidMount() {
        this.fetchData()
    }

    // methods
    fetchData() {
        FindMessagePush({
            KeyID: this.props.navigation.state.params.id
        }).then(res => {
            const data = res.Data
            this.state.MsgContent = {
                title: data.MessageTitle,
                pushTime: dateFormat(data.PushTime, 'yyyy-MM-dd hh:mm:ss'),
                content: data.MessageContent
            }
            this.setState({
                MsgContent: this.state.MsgContent,
                isReady: true
            })
        })
    }

    render() {
        return (
            <View style={{...Container, backgroundColor: 'white'}}>
                <Header title='消息详情'/>
                <ScrollView contentContainerStyle={style.scroller}>
                    <View style={style.detail_title}>
                        <Placeholder.Line
                            style={style.detail_title_text}
                            color='#eeeeee'
                            width='50%'
                            textSize={16}
                            onReady={this.state.isReady}
                        >
                            <Text style={style.detail_title_text}>{this.state.MsgContent.title}</Text>
                        </Placeholder.Line>
                        <Placeholder.Line
                            color='#eeeeee'
                            width='50%'
                            textSize={16}
                            onReady={this.state.isReady}
                        >
                        </Placeholder.Line>
                        <Text style={style.detail_title_time}>{this.state.MsgContent.pushTime}</Text>
                    </View>
                    <View style={style.detail_content}>
                        <Placeholder.Line
                            style={style.detail_content_text}
                            color='#eeeeee'
                            width='50%'
                            textSize={16}
                            onReady={this.state.isReady}
                        >
                            <Text style={style.detail_content_text}>{this.state.MsgContent.content}</Text>
                        </Placeholder.Line>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const style = StyleSheet.create({
    scroller: {
        padding: 20
    },
    detail_title: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.5)',
        borderStyle: 'solid',
        ...DisplayStyle('column', 'center', 'flex-start')
    },
    detail_title_text: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15
    },
    detail_title_time: {
        color: '#999999'
    },
    detail_content: {
        paddingTop: 15
    },
    detail_content_text: {
        fontSize: 16
    }
})
