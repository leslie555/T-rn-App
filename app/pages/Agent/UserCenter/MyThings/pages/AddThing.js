import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    DeviceEventEmitter
} from 'react-native'
import {
    Container,
    DisplayStyle,
    CommonColor
} from '../../../../../styles/commonStyles'
import IconFont from '../../../../../utils/IconFont'
import { arrToTime, dateFormat } from '../../../../../utils/dateFormat/index'
import Picker from 'react-native-picker'
import { InsertMemo } from '../../../../../api/userCenter'
import Toast from 'react-native-root-toast'
import { trim } from '../../../../../utils/stringUtil'
import {Header} from "../../../../../components";

export default class AddThing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isToday: true,
            form: {
                Content: '',
                // dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
                MemoTime: dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
            }
        }
        this._isToday = this._isToday.bind(this)
        this.toastMsg = this.toastMsg.bind(this)
    }

    //
    componentWillUnmount() {
        Picker.hide()
    }

    // methods
    _showTimePicker() {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = []

        for (let i = 1; i < 51; i++) {
            years.push(i + 1980)
        }
        for (let i = 1; i < 13; i++) {
            months.push(i)
        }
        for (let i = 1; i < 25; i++) {
            hours.push(i)
        }
        for (let i = 1; i < 32; i++) {
            days.push(i)
        }
        for (let i = 0; i < 61; i++) {
            minutes.push(i)
        }
        let pickerData = [years, months, days, hours, minutes]
        const oldDate = this.state.form.MemoTime
        let date = new Date(oldDate.replace('T', ' ').replace(/-/g, '/'))
        let selectedValue = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            // date.getHours() > 11 ? 'pm' : 'am',
            date.getHours(),
            date.getMinutes()
        ]
        Picker.init({
            pickerData,
            selectedValue,
            pickerTitleText: '选择时间',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            onPickerConfirm: pickedValue => {
                this.state.form.MemoTime = arrToTime(pickedValue)
                this.setState({
                    form: this.state.form
                })
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue)
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue]
                if (parseInt(targetValue[1]) === 2) {
                    if (targetValue[0] % 4 === 0 && targetValue[2] > 29) {
                        targetValue[2] = 29
                    } else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
                        targetValue[2] = 28
                    }
                } else if (
                    targetValue[1] in { 4: 1, 6: 1, 9: 1, 11: 1 } &&
                    targetValue[2] > 30
                ) {
                    targetValue[2] = 30
                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if (k !== 3) {
                            targetValue[k] = parseInt(v)
                        }
                    })
                    Picker.select(targetValue)
                    pickedValue = targetValue
                }
            }
        })
        Picker.show()
    }
    _isToday(date) {
        var date = new Date(date.replace('T', ' ').replace(/-/g, '/'))
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var newDate = new Date()
        var Curyear = newDate.getFullYear()
        var Curmonth = newDate.getMonth() + 1
        var Curday = newDate.getDate()
        return year === Curyear && month === Curmonth && day === Curday
    }
    submitForm() {
        if (!this.state.form.Content && this.state.form.Content !== 0) {
            this.toastMsg('内容不能为空')
            return false
        } else {
            const form = { ...this.state.form }
            form.Content = trim(form.Content)
            InsertMemo(form).then(res => {
                this.toastMsg('新增成功')
                // 广播
                this.state.isToday = this._isToday(this.state.form.MemoTime)
                DeviceEventEmitter.emit('updateThings', {
                    type: 'add',
                    KeyID: res.Data.KeyID,
                    MemoTime: this.state.form.MemoTime,
                    Content: this.state.form.Content,
                    isToday: this.state.isToday
                })
                // 返回
                if(this.props.navigation.getParam('path','')==='AgentHomePage'){
                  this.props.navigation.replace('AgentMyThings')
                }else{
                  this.props.navigation.navigate('AgentMyThings')
                }
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
    changeText(Content) {
        this.state.form.Content = Content
        this.setState({
            form: this.state.form
        })
    }

    // render
    render() {
        return (
            <View style={Container}>
                <Header title='新增待办'/>
                <View style={style.detail_page}>
                    <ScrollView style={style.detail_page_top}>
                        <View style={style.detail_page_content}>
                            <TextInput
                                style={style.textInput}
                                multiline={true}
                                returnKeyType={'done'}
                                numberOfLines={7}
                                maxLength={180}
                                value={this.state.form.Content}
                                onChangeText={this.changeText.bind(this)}
                            />
                        </View>
                        <View style={style.detail_page_time}>
                            <Text style={style.detail_page_time_label}>设置时间</Text>
                            <TouchableOpacity
                                style={style.detail_page_time_btn}
                                onPress={this._showTimePicker.bind(this)}
                            >
                                <Text style={style.detail_page_time_text}>
                                    {this.state.form.MemoTime}
                                </Text>
                                <IconFont name='open' size={16} color='#999999' />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View style={style.detail_page_bottom}>
                        <TouchableOpacity
                            style={style.detail_page_bottom_btn}
                            onPress={this.submitForm.bind(this)}
                        >
                            <Text style={style.detail_page_btn_text}>保存</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    detail_page: {
        paddingTop: 15,
        flex: 1,
        justifyContent: 'space-between'
    },
    detail_page_top: {},
    detail_page_content: {
        padding: 15,
        marginBottom: 20,
        backgroundColor: CommonColor.color_white
    },
    detail_page_time: {
        padding: 20,
        backgroundColor: CommonColor.color_white,
        ...DisplayStyle('row', 'center', 'space-between')
    },
    detail_page_time_label: {
        fontSize: 18
    },
    detail_page_time_btn: {
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    detail_page_time_text: {
        fontSize: 18,
        color: '#999999',
        marginRight: 5
    },
    detail_page_bottom: {
        padding: 15,
        height: 80,
        backgroundColor: CommonColor.color_white
    },
    detail_page_bottom_btn: {
        height: 50,
        borderRadius: 8,
        backgroundColor: '#389ef2',
        ...DisplayStyle('row', 'center', 'center')
    },
    detail_page_btn_text: {
        color: CommonColor.color_white,
        fontSize: 20
    },
    textInput: {
        textAlignVertical: 'top',
        fontSize: 18,
        height:170
    }
})
