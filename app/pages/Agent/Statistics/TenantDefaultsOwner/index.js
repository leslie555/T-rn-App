import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Header } from '../../../../components'
import  BarChart from '../Components/BarChart'
import {SelectWholeDefault,QueryIntroductionList} from '../../../../api/personalAccount'
import { DisplayStyle, CommonColor, Container } from '../../../../styles/commonStyles'
export default class AgentBreachContract extends Component {

    constructor(){
        super();
        this.state = {
            //坐标轴Y轴数据
            tanantGetCus: [],
            //坐标轴X轴数据
            tanantGetCusMon: [],
            //本月违约
            monthDefault:'',
            //本日违约
            todayDefault:'',
            // 业主 type=0   租客 type=1
            type:1
        }

    }
    fetchData(){
        SelectWholeDefault({
            type: this.state.type
        }).then(data=>{
            const getData = {...data.Data}
            this.state.tanantGetCus = getData.DefaultCount;
            this.state.tanantGetCusMon = getData.Months;
            this.state.monthDefault = getData.MonthDefault;
            this.state.todayDefault = getData.TodayDefault;
            this.setState({
                tanantGetCus:this.state.tanantGetCus,
                tanantGetCusMon:this.state.tanantGetCusMon,
                monthDefault:this.state.monthDefault,
                todayDefault:this.state.todayDefault,
            })
        }).catch(data=>{

        })
    }
    componentDidMount(){
        this.fetchData();
    }
    DefaultsDetail(key){
        //key 0 本月  key 1 今日
        this.props.navigation.navigate('AgentTenantDefaultsDetail',{key:key})
    }
    render() {
        return (
            <ScrollView style={ Container}>
                <Header title="租客违约" hideLeft={false} />
                
                <View style={[styles.count_style, styles.flex]}>
                    <TouchableOpacity onPress={this.DefaultsDetail.bind(this,0)}>
                        <View style={styles.flex_center}>
                            <Text style={styles.count_number}> {this.state.monthDefault}</Text>
                            <Text style={styles.count_title}> 本月违约租客</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.DefaultsDetail.bind(this,1)}>
                        <View style={styles.flex_center}>
                            <Text style={styles.count_number}> {this.state.todayDefault}</Text>
                            <Text style={styles.count_title}> 今日违约租客</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                 <View style={styles.panel}>
                        <View>
                            <BarChart
                            title='近6月租客违约'
                            unit={'个'}
                            route='AgentTenantDefaultsDetail'
                            data={this.state.tanantGetCus}
                            xAxisData={this.state.tanantGetCusMon} 
                            color='#5db2f8'/>
                            {/* BarChart需要传的字段 */}
                            {/* title(字符串): 左上角标题 
                            unit(字符串): 单位
                            route(字符串): 查看更多路由
                            xAxisData(数组): chart横坐标
                            data(数组): chart柱图的数据
                            color(字符串): chart颜色 */}
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
        alignItems: 'center'
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