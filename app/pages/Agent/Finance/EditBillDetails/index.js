import React, {Component, Fragment} from 'react'
import {Button, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './style'
import {GiftedForm} from '../../../../components/Form/GiftedForm'
import {CheckBox, Header} from "../../../../components";
import Toast from "react-native-root-toast";
import {connect} from 'react-redux'
import {dateFormat} from "../../../../utils/dateFormat";
import {priceFormat} from "../../../../utils/priceFormat";
import {deepCopy} from "../../../../utils/arrUtil";

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
        // 再次约定 ContractType 1 收款单  2付款单
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
        // 把值赋予给Details
        this.query.data.map((v, index) => {
            if (v.Details.length !== 0) {
              v.Details.map(y => {
                // 唯一ID  通过这个来判断分几列
                y.BillID = v.BillID
                y.ReceivableDate = v.ReceivableDate
                y.Remark = v.Remark
                y.EndDate = v.EndDate
                y.StartDate = v.StartDate
              })
            }
        })
        // 先添加 再去重
        var selectDataArr = []
        if (this.query.selectData.length !== 0) {
            this.query.selectData.map(v => {
                this.query.data.map(y => {
                    if (v.BillID === y.BillID) {
                        selectDataArr.push(y)
                    }
                })
            })
            console.log(selectDataArr)
            var obj = {};
            // 去重
            selectDataArr = selectDataArr.reduce(function(item, next) {
                obj[next.BillID] ? '' : obj[next.BillID] = true && item.push(next)
                return item
            }, [])
        }
        this.query.data.forEach((item) => {
            item.ReceivableDate = dateFormat(item.ReceivableDate)
            item.ShowImg = dateFormat(item.ReceivableDate,'yyyyMM') === dateFormat(new Date(),'yyyyMM')
            const index = selectDataArr.findIndex(x => x.BillID === item.BillID)
            this.allList.push(item)
            if (this.busType === 0 && item.ContractType === 1 || this.busType === 1 && item.ContractType === 2) {
                this.state.list.push({
                    ...item,
                    isChecked: index !== -1
                })
                // if (index !== -1) {
                //     // let flag = -1
                //     // if (this.busType === 0 && item.InOrOut === 1 || this.busType === 1 && item.InOrOut === 2) {
                //     //     flag = 1
                //     // }
                //     // this.state.total = priceFormat(+this.state.total + flag * item.PaidMoney)
                //     item.Details.map(y => {
                //         let flag = -1
                //         if (this.busType === 0 && y.InOrOut === 1 || this.busType === 1 && y.InOrOut === 2) {
                //             flag = 1
                //         }
                //         this.state.total = priceFormat(+this.state.total + flag * y.PaidMoney)
                //     })
                // }
            }
        })
        var judgeChecked = false
        for (let i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i].isChecked) {
                judgeChecked = true
            }
        }
        if (!judgeChecked) {
            this.state.list.map(v => {
                if (v.ShowImg) {
                    v.isChecked = true
                }
            })
        }
        console.log(this.state.list)
        debugger
        this.state.list.map(v => {
            if (v.isChecked) {
                v.Details.map(y => {
                    let flag = -1
                    if (this.busType === 0 && y.InOrOut === 1 || this.busType === 1 && y.InOrOut === 2) {
                        flag = 1
                    }
                    this.state.total = priceFormat(+this.state.total + flag * y.PaidMoney)
                })
            }
        })
        this.listCopy = deepCopy(this.state.list)
        this.setState({
            list: this.state.list,
            total: this.state.total
        })
    }

    handleSave() {
        const result = []
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
        if (+this.state.total < 0 && this.busType === 1) {
            Toast.show('金额总计必须大于0！', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            })
            return
        }
        if (+this.state.total < 0 && this.busType === 0) {
            Toast.show('金额总计必须大于0！', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            })
            return
        }
        console.log(result)
        const arr = []
        result.map(v => {
            v.Details.map(y => {
                y.PaymentData = y.ReceivableDate
                y.BillType = v.BillType
                arr.push(y)
            })
        })
        this.props.navigation.navigate(this.query.path, {
            billData: JSON.stringify(arr),
            billDataLength: result.length,
            billBusType: this.busType
        })
    }


    changeCheckBox(item) {
        item.isChecked = !item.isChecked
        let total = 0
        // this.state.list.forEach((x) => {
        //     if(x.BillID === item.BillID) {
        //         x.isChecked = true
        //         x.Details.map(y => {
        //             // if (x.isChecked) {
        //                 let flag = -1
        //                 if (this.busType === 0 && y.InOrOut === 1 || this.busType === 1 && y.InOrOut === 2) {
        //                     flag = 1
        //                 }
        //                 total = total + flag * y.PaidMoney
        //             // }
        //         })
        //     } else {
        //         x.isChecked = false
        //     }
        // })
        this.state.list.forEach((x) => {
            if (x.isChecked) {
                x.Details.map(y => {
                    let flag = -1
                    if (this.busType === 0 && y.InOrOut === 1 || this.busType === 1 && y.InOrOut === 2) {
                        flag = 1
                    }
                    total = total + flag * y.PaidMoney
                })
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
                if (this.busType === 0 && x.ContractType === 1 || this.busType === 1 && x.ContractType === 2) {
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
                                    <View style={styles.data_item_ListAll}>
                                        {item.Details && item.Details.map((v, num) => {
                                            return (
                                                <View style={styles.data_item_List} key={num + 'Details'}>
                                                    <Text style={styles.data_item_text}>{v.ProjectName}</Text>
                                                    <Text style={styles.data_item_type}>{v.InOrOut === 1 ? '收入' : '支出'}</Text>
                                                    <Text style={styles.data_item_input}>{v.PaidMoney} 元</Text>
                                                    <Text style={styles.data_item_date}>{item.ReceivableDate}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    {item.ShowImg&&<Text style={styles.data_item_btn}>本月</Text>}
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
