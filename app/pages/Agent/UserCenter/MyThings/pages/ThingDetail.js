import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions, Alert, DeviceEventEmitter } from 'react-native';
import { Container, DisplayStyle, CommonColor } from '../../../../../styles/commonStyles';
import IconFont from "../../../../../utils/IconFont";
import { arrToTime, dateFormat } from "../../../../../utils/dateFormat/index";
import Picker from 'react-native-picker';
import Toast from 'react-native-root-toast';
import { FindMemo, EditMemo, DelMemoByID } from '../../../../../api/userCenter'
import {Header} from "../../../../../components";
// 测试

const { width } = Dimensions.get('window');
// Picker.hide()
export default class ThingDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isToday: true,
            isChange: false,
            form: {
                KeyID: 0,
                Content: '',
                MemoTime: dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
            },
        }
        this.fetchData = this.fetchData.bind(this)
        this.toastMsg = this.toastMsg.bind(this)
        this._isToday = this._isToday.bind(this)
    }

    // 生命周期
    componentDidMount() {
        this.state.form.KeyID = this.props.navigation.state.params.KeyID
        this.setState({
            form: this.state.form
        })
        this.fetchData()
    }
    componentWillUnmount() {
        Picker.hide()
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
    _showTimePicker() {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for (let i = 1; i < 51; i++) {
            years.push(i + 1980);
        }
        for (let i = 1; i < 13; i++) {
            months.push(i);
        }
        for (let i = 1; i < 25; i++) {
            hours.push(i);
        }
        for (let i = 1; i < 32; i++) {
            days.push(i);
        }
        for (let i = 0; i < 61; i++) {
            minutes.push(i);
        }
        let pickerData = [years, months, days, hours, minutes];
        const oldDate = this.state.form.MemoTime
        let date = new Date(oldDate.replace('T', ' ').replace(/-/g, '/'))
        let selectedValue = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            // date.getHours() > 11 ? 'pm' : 'am',
            date.getHours(),
            date.getMinutes()
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerTitleText: '选择时间',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            onPickerConfirm: pickedValue => {
                console.log('area', arrToTime(pickedValue));
                this.state.form.MemoTime = arrToTime(pickedValue)
                this.setState({
                    form: this.state.form
                })
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if (parseInt(targetValue[1]) === 2) {
                    if (targetValue[0] % 4 === 0 && targetValue[2] > 29) {
                        targetValue[2] = 29;
                    }
                    else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
                        targetValue[2] = 28;
                    }
                }
                else if (targetValue[1] in { 4: 1, 6: 1, 9: 1, 11: 1 } && targetValue[2] > 30) {
                    targetValue[2] = 30;

                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if (k !== 3) {
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
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
        return (year === Curyear && month === Curmonth && day === Curday)
    }
    fetchData() {
        FindMemo({
            KeyID: !this.props.navigation.state.params ? '' : this.props.navigation.state.params.KeyID
        }).then(res => {
            const data = res.Data[0]
            this.state.form.Content = data.Content
            this.state.form.MemoTime = dateFormat(data.MemoTime, 'yyyy-MM-dd hh:mm')
            this.state.isToday = this._isToday(this.state.form.MemoTime)
            this.setState({
                form: this.state.form,
                isToday: this.state.isToday
            })
        })
    }
    submitForm() {
        if (!this.state.form.Content && this.state.form.Content !== 0) {
            this.toastMsg('内容不能为空')
            return false
        } else {
            EditMemo(this.state.form).then(res => {
                this.toastMsg('保存成功')
                // 广播通知(修改)
                if (this.state.isToday) {
                    if (this._isToday(this.state.form.MemoTime)) {
                        this.state.isChange = false
                    } else {
                        this.state.isChange = true
                    }
                } else {
                    if (this._isToday(this.state.form.MemoTime)) {
                        this.state.isChange = true
                    } else {
                        this.state.isChange = false
                    }
                }
                this.setState({
                    isChange: this.state.isChange
                })
                DeviceEventEmitter.emit('updateThings', {
                    type: 'update',
                    KeyID: this.props.navigation.state.params.KeyID,
                    MemoTime: this.state.form.MemoTime,
                    Content: this.state.form.Content,
                    isToday: this.state.isToday,
                    isChange: this.state.isChange
                })
                // 返回
                this.props.navigation.goBack()
            })
        }
    }
    delete() {
        Alert.alert('温馨提示', '是否删除本条备忘录', [
            { text: '取消' },
            {
                text: '确认', onPress: () => {
                    DelMemoByID({
                        KeyID: this.state.form.KeyID
                    }).then(res => {
                        this.toastMsg('删除成功')
                        // 广播通知(修改)
                        DeviceEventEmitter.emit('updateThings', {
                            type: 'delete',
                            KeyID: this.props.navigation.state.params.KeyID,
                            isToday: this.state.isToday
                        })
                        // 返回
                        this.props.navigation.goBack()
                    })
                }
            }
        ])
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
                <Header title='待办详情'/>
                <View style={style.detail_page}>
                    <ScrollView style={style.detail_page_top}>
                        <View style={style.detail_page_time}>
                            <IconFont name='schedule' size={16} color='#389ef2'></IconFont>
                            <TouchableOpacity style={style.detail_page_time_btn} onPress={this._showTimePicker.bind(this)}>
                                <Text style={style.detail_page_time_text}>{this.state.form.MemoTime}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.detail_page_content}>
                            <TextInput
                                style={style.textInput}
                                multiline={true}
                                returnKeyType={'done'}
                                numberOfLines={7}
                                maxLength={120}
                                value={this.state.form.Content}
                                onChangeText={this.changeText.bind(this)}
                            />
                        </View>
                    </ScrollView>
                    <View style={style.detail_page_bottom}>
                        <TouchableOpacity style={style.detail_page_bottom_btn_delete} onPress={this.delete.bind(this)}>
                            <Text style={style.detail_page_btn_text}>删除</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.detail_page_bottom_btn} onPress={this.submitForm.bind(this)}>
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
        flex: 1,
        backgroundColor: CommonColor.color_white,
        justifyContent: 'space-between'
    },
    detail_page_top: {

    },
    detail_page_content: {
        padding: 15,
        backgroundColor: CommonColor.color_white
    },
    detail_page_time: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingTop: 30,
        backgroundColor: CommonColor.color_white,
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    detail_page_time_label: {
        fontSize: 18
    },
    detail_page_time_btn: {
        marginLeft: 5,
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    detail_page_time_text: {
        fontSize: 16,
        color: CommonColor.color_primary,
        marginRight: 5
    },
    detail_page_bottom: {
        padding: 15,
        height: 80,
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(230, 230, 230, 0.5)',
        backgroundColor: CommonColor.color_white,
        ...DisplayStyle('row', 'center', 'space-between')
    },
    detail_page_bottom_btn: {
        height: 50,
        width: Math.floor(width / 2.5),
        borderRadius: 8,
        backgroundColor: CommonColor.color_primary,
        ...DisplayStyle('row', 'center', 'center')
    },
    detail_page_bottom_btn_delete: {
        height: 50,
        width: Math.floor(width / 2.5),
        borderRadius: 8,
        backgroundColor: CommonColor.color_danger,
        ...DisplayStyle('row', 'center', 'center')
    },
    detail_page_btn_text: {
        color: CommonColor.color_white,
        fontSize: 16
    },
    textInput: {
        textAlignVertical: 'top',
        fontSize: 16
    }
})
