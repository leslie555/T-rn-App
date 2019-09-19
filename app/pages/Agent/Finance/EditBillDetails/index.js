import React, {Component} from 'react'
import {Button, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {GiftedForm} from '../../../../components/Form/GiftedForm'
import {CheckBox, Header} from "../../../../components";
import Toast from "react-native-root-toast";
import {connect} from 'react-redux'
import {dateFormat} from "../../../../utils/dateFormat";
import {priceFormat} from "../../../../utils/priceFormat";

class EditRentIncludeCost extends React.Component {
    constructor(props) {
        super(props)
        this.query = this.props.navigation.state.params || {} // 路由参数 path,data
        this.EnumData = []
        this.EnumProps = {
            label: 'Description',
            value: 'Value'
        }
        this.busType = 0
        this.allList = []
        this.state = {
            list: [],
            total: 0
        }
    }

    componentWillMount() {
        this.initData()
    }

    initData() {
        // 约定BillType 2/3为收款单 1/3为付款单
        this.EnumData = [
            {
                Value: 0,
                Description: '收款单'
            },
            {
                Value: 1,
                Description: '付款单'
            }
        ]
        this.state.total = 0
        this.busType = this.query.busType || 0
        this.query.data.forEach((item) => {
            item.ReceivableDate = dateFormat(item.ReceivableDate)
            const index = this.query.selectData.findIndex(x => x.BillDetailID === item.BillDetailID)
            this.allList.push(item)
            if (this.busType === 0 && (item.BillType === 2 || item.BillType === 3) || this.busType === 1 && (item.BillType === 1 || item.BillType === 3)) {
                this.state.list.push({
                    ...item,
                    isChecked: index !== -1
                })
                if (index !== -1) {
                    let flag = -1
                    if (this.busType === 0 && item.InOrOut === 1 || this.busType === 1 && item.InOrOut === 2) {
                        flag = 1
                    }
                    this.state.total = priceFormat(+this.state.total + flag * item.PaidMoney)
                }
            }
        })
        this.setState({
            list: this.state.list,
            total: this.state.total
        })
    }

    handleSave() {
        const result = []
        debugger
        this.state.list.forEach(x => {
            if (x.isChecked) {
                result.push(x)
            }
        })
        if (result.length === 0) {
            Toast.show('请选择账单！', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            })
            return
        }
        if (+this.state.total < 0) {
            Toast.show('金额总计必须大于0！', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            })
            return
        }
        this.props.navigation.navigate(this.query.path, {
            billData: JSON.stringify(result),
            billBusType: this.busType
        })
    }


    changeCheckBox(item) {
        item.isChecked = !item.isChecked
        let total = 0
        this.state.list.forEach((x) => {
            if (x.isChecked) {
                let flag = -1
                if (this.busType === 0 && x.InOrOut === 1 || this.busType === 1 && x.InOrOut === 2) {
                    flag = 1
                }
                total = total + flag * x.PaidMoney
            }
        })
        this.setState({
            list: this.state.list,
            total: priceFormat(total)
        })
    }

    pickerChange(val) {
        if (val !== this.busType) {
            this.busType = val
            const list = this.allList.filter(x => {
                if (this.busType === 0 && (x.BillType === 2 || x.BillType === 3) || this.busType === 1 && (x.BillType === 1 || x.BillType === 3)) {
                    return true
                } else {
                    return false
                }
            })
            list.map(x => {
                x.isChecked = false
            })
            this.setState({
                list,
                total: 0
            })
        }
    }

    render() {
        return (
            <View style={styles.keep_container}>
                <Header title="账单明细"/>
                <GiftedForm.PickerWidget
                    name='busType'
                    title='单据类型'
                    data={this.EnumData}
                    value={this.busType}
                    mapKey={this.EnumProps}
                    disabled={this.query.editType === 1}
                    onPickerConfirm={(val) => {
                        this.pickerChange(val)
                    }}
                />
                <View style={styles.keep_content}>
                    <ScrollView ref={(ref) => {
                        this.scrollRef = ref
                    }}>
                        {this.state.list.map((item, index) => {
                            return (
                                <TouchableOpacity style={styles.data_item_box} key={index} onPress={() => {
                                    this.changeCheckBox(item)
                                }}>
                                    <CheckBox style={styles.data_item_check} isChecked={item.isChecked} onClick={() => {
                                        this.changeCheckBox(item)
                                    }}/>
                                    <Text style={styles.data_item_text}>{item.ProjectName}</Text>
                                    <Text style={styles.data_item_type}>{item.InOrOut === 1 ? '收入' : '支出'}</Text>
                                    <Text style={styles.data_item_input}>{item.PaidMoney} 元</Text>
                                    <Text style={styles.data_item_date}>{item.ReceivableDate}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        <View style={{height: 20}}/>
                    </ScrollView>
                </View>
                <View style={styles.bottom_box}>
                    <View style={styles.bottom_left}>
                        <Text style={styles.bottom_left_text1}>合计:</Text>
                        <Text style={styles.bottom_left_text2}>{this.state.total}元</Text>
                    </View>
                    <TouchableOpacity style={styles.bottom_btn2} onPress={() => this.handleSave()}>
                        <Text style={styles.bottom_btn_text2}>保存</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapToProps = state => ({enumList: state.enum.enumList})
export default connect(mapToProps)(EditRentIncludeCost)
