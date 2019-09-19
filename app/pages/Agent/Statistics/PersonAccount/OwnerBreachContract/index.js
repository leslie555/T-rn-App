
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Header } from '../../../../../components/'
import BarChart from '../../Components/BarChart'
import { DisplayStyle, CommonColor, Container } from '../../../../../styles/commonStyles'
import { QueryAgentBreachContract } from "../../../../../api/userCenter"; // 请求接口
export default class OwnerBreachContract extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: 0, //业主 type=0   租客 type=1
            DefaultCount: [],
            Months: [],
            MonthDefault: null, //本月违约
            TodayDefault: null  //今日违约
        }
    }
    requestList(){
        QueryAgentBreachContract({
            type: this.state.type
        })
        .then(res=>{
            this.setState({
                Months : res.Data.Months,
                DefaultCount : res.Data.DefaultCount,
                MonthDefault : res.Data.MonthDefault,
                TodayDefault : res.Data.TodayDefault,
            })
            console.log("res",res.Data)
        })
    }
    goContractList(key){
        this.props.navigation.navigate('AgentBreachList',{key:key})
    }
    componentDidMount(){
        this.requestList()     
    }
    render() {
        const { title, unit, Scolor, text, data, xAxisData, BarColor,moreInfo} = { ...this.props }
        return (
            <ScrollView style={ Container}>
                <Header title="业主违约" hideLeft={false} />
                <View style={[styles.count_style, styles.flex]}>
                    <TouchableOpacity onPress={this.goContractList.bind(this,0)}>
                        <View style={styles.flex_center}>
                            <Text style={styles.count_number}> {this.state.MonthDefault}</Text>
                            <Text style={styles.count_title}> 本月违约业主</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.goContractList.bind(this,1)}>
                        <View style={styles.flex_center}>
                            <Text style={styles.count_number}> {this.state.TodayDefault}</Text>
                            <Text style={styles.count_title}> 今日违约业主</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                 <View style={styles.panel}>
                        {/* 柱状图 */}
                        <View>
                            <BarChart
                                title='近6月业主违约'
                                unit={'个'}
                                route='AgentBreachList'
                                data={this.state.DefaultCount}
                                xAxisData={this.state.Months} 
                                color='#5db2f8'
                            />
                        </View>
                 </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    count_style: {
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
    },
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    flex_center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    count_number: {
        fontSize: 20,
        color: '#389ef2',
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    count_title: {
        color: '#999',
        fontSize: 15,
    },
    panel: {
        backgroundColor: '#fff',
        marginTop: 20
    },
})