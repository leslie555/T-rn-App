import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import {  Container, DisplayStyle, CommonColor } from '../../../../styles/commonStyles';
import Toast from 'react-native-root-toast';
import storage from '../../../../utils/storage/index'
import { ModifyPwd } from '../../../../api/userCenter'
import Header from "../../../../components/Header";
import {connect} from "react-redux";
import {logout} from "../../../../redux/actions/user";

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            OldPwd: '',
            NewPwd: '',
            ConfirmPassWord: ''
        }
        this.msgToast = this.msgToast.bind(this)
    }

    // methods
    savePwd() {
        if (!this.state.OldPwd) {
            this.msgToast('原密码不能为空')
            return
        } else if (!this.state.NewPwd) {
            this.msgToast('请输入新密码')
            return
        } else if (!this.state.ConfirmPassWord) {
            this.msgToast('请确认密码')
            return
        } else if (this.state.NewPwd.length < 6) {
            this.msgToast('请设置6-16位密码')
            return
        } else if (this.state.NewPwd !== this.state.ConfirmPassWord) {
            this.msgToast('两次密码输入不一致')
            this.setState({
                ConfirmPassWord: ''
            })
            return
        } else {
            storage.get('userinfo').then(res => {
                if (res) {
                    const postData = {
                        OldPwd: this.state.OldPwd,
                        NewPwd: this.state.NewPwd,
                        ConfirmPassWord: this.state.ConfirmPassWord,
                        'UserID': res.UserID,
                        'LoginCode': res.LoginCode
                    }
                    ModifyPwd(postData).then(response => {
                        if (response.Code === 0) {
                            this.msgToast('修改成功')
                            this.props.dispatch(logout())
                            this.props.navigation.navigate('Auth')
                            // this.props.navigation.goBack()
                        }
                    }).catch(() => {
                        this.setState({
                            OldPwd: '',
                            NewPwd: '',
                            ConfirmPassWord: ''
                        })
                    })
                }
            })
        }
    }

    msgToast(msg) {
        Toast.show(msg, {
            duration: 820,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls on toast\`s appear animation start
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
    contentFilter(item) {
        return item.replace(/[^\w\.\/]/ig, '')
    }
    // render
    render() {
        return (
            <View style={Container}>
                <Header title='修改密码' headerRight={
                    <TouchableOpacity onPress={this.savePwd.bind(this)}>
                        <Text style={{ color: CommonColor.color_white, fontSize: 16 }}>保存</Text>
                    </TouchableOpacity>
                }/>
                <View style={style.detail_page}>
                    <View style={style.setting_top_list}>
                        <View style={style.setting_listItem_top}>
                            <View style={style.setting_listItem_left}>
                                <Text style={style.setting_listItem_star}>*</Text>
                                <Text style={style.setting_listItem_text}>原密码</Text>
                            </View>
                            <TextInput
                                style={style.setting_input}
                                onChangeText={(text) => this.setState({ OldPwd: text })}
                                value={this.state.OldPwd}
                                secureTextEntry={true}
                                maxLength={16}
                                placeholder='请输入原密码'
                                placeholderTextColor='#999999'
                            />
                        </View>
                        <View style={style.setting_listItem_top}>
                            <View style={style.setting_listItem_left}>
                                <Text style={style.setting_listItem_star}>*</Text>
                                <Text style={style.setting_listItem_text}>新的密码</Text>
                            </View>
                            <TextInput
                                style={style.setting_input}
                                onChangeText={(text) => {
                                    const newText = this.contentFilter(text)
                                    this.setState({ NewPwd: newText })
                                }}
                                value={this.state.NewPwd}
                                secureTextEntry={true}
                                maxLength={16}
                                placeholder='请输入6-16位字母数字组合'
                                placeholderTextColor='#999999'
                            />
                        </View>
                        <View style={style.setting_listItem_top}>
                            <View style={style.setting_listItem_left}>
                                <Text style={style.setting_listItem_star}>*</Text>
                                <Text style={style.setting_listItem_text}>确认密码</Text>
                            </View>
                            <TextInput
                                style={style.setting_input}
                                onChangeText={(text) => this.setState({ ConfirmPassWord: text })}
                                value={this.state.ConfirmPassWord}
                                secureTextEntry={true}
                                maxLength={16}
                                placeholder='请确认新密码'
                                placeholderTextColor='#999999'
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    detail_page: {
        flex: 1,
    },
    setting_top_list: {
        marginBottom: 20
    },
    setting_listItem_top: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: CommonColor.color_white,
        ...DisplayStyle('row', 'center', 'flex-start'),
        borderBottomWidth: 1,
        borderColor: 'rgba(230, 230, 230, 0.5)',
        borderStyle: 'solid'
    },
    setting_listItem_left: {
        marginRight: 15,
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    setting_listItem_text: {
        fontSize: 14
    },
    setting_listItem_star: {
        color: 'red',
        marginRight: 2
    },
    setting_listItem_right: {
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    setting_bottom_btn: {
        backgroundColor: CommonColor.color_white,
        paddingTop: 20,
        paddingBottom: 20,
        ...DisplayStyle('row', 'center', 'center')
    },
    setting_bottom_text: {
        color: '#FF817C',
        fontSize: 18
    },
    setting_input: {
        flex: 1,
        fontSize: 16
    }
})

const mapToProps = state => ({userInfo: state.user.userinfo})
export default connect(mapToProps)(ResetPassword)
