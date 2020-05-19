import React, { Component } from 'react';
import {Alert, Button, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import {FullModal, Header} from '../../../../components'
import { GiftedForm, GiftedFormManager } from "../../../../components/Form/GiftedForm";
import ButtonGroup from '../../../../components/ButtonGroup'
class Toast extends Component {
    constructor(props){
        super(props)
        this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
        this.query = this.props.navigation.state.params || {} // 路由参数
        this.reciptID = this.query.reciptID
        this.KeyID = this.query.KeyID
        this.token = this.query.token
        this.state = {
            form:{
                money: ''
            },
            btnOptions:[{label: '提交', value: 'Submit'}]
        }
    }
    handleSubmit(){
        const validationResults0 = GiftedFormManager.validate('PayReceiptRuleForm')
        const values0 = GiftedFormManager.getValues('PayReceiptRuleForm')
        console.log(values0)
        this.setState({
            money: values0
        })
        console.log(this.KeyID,this.reciptID,values0,validationResults0)
        debugger
        if(validationResults0.isValid){
            this.props.navigation.navigate('AgentPayReceiptWebView', { reciptID: this.reciptID, KeyID: this.KeyID, money:values0.money, token:this.token })
        }
    }
    render() {
        const {form} = this.state
        return (
            <View style={{flex: 1}}>
                <Header title='添加代收房东款项'/>
                <View style={styles.bgColor}>
                    <Text style={{color: 'red'}}>
                        *从2019年10月1日起，租客租金需拆为两部分：️代收房东；️服务费，请填写时注意。
                    </Text>
                </View>
                <GiftedForm formName='PayReceiptRuleForm'>
                    <GiftedForm.SeparatorWidget/>
                    <GiftedForm.TextInputWidget
                        name='money'
                        title='金额合计'
                        maxLength={8}
                        keyboardType={this.numberPad}
                        disabled={false}
                        value={form.money}
                    />
                </GiftedForm>
                <View>
                    <ButtonGroup
                        options={this.state.btnOptions}
                        handleSubmitClick={() => this.handleSubmit()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bgColor: {
        backgroundColor: '#f6f6f6',
        padding: 20
    }
 
  });

export default Toast