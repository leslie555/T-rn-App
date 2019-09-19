
import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
// import Picker from "react-native-picker";
import { SearchBar, List, Header , Picker } from '../../../../components'
import { DisplayStyle, CommonColor, Container } from '../../../../styles/commonStyles'
import style from '../PersonAccount/style'
import IconFont from '../../../../utils/IconFont'
import { dateFormat } from "../../../../utils/dateFormat";
import { QueryAgentBreachList } from "../../../../api/userCenter";
class TenantDefaultsDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            isShowSearchBar: false,
            form: {
                Type: 1,  //业主 Type=0   租客 Type=1
                parm: {
                    page: 1,
                    size: 10
                },
                KeyWord: '',
                QueryDate: '',
                //为1 今日  其它为月
                IsToday:'',
            },
            // picker 出现
            markDateVisible: false,
            //选择picker的数据
            markDateSelectedValue: [],
            curStartTime: '本月',
            headerTittle: '租客违约列表'
        }
    }
    toggleSearch(){
        this.setState({
            isShowSearchBar: !this.state.isShowSearchBar
        })
    }
    searchContent(text){
        this.state.form.KeyWord = text
        this.setState({
            form: {...this.state.form}
        })
    }
     // 筛选时间
     markDateConfirm(data) {
        this.state.markDateSelectedValue = [...data];
        this.setState({
            markDateSelectedValue : this.state.markDateSelectedValue
        })
        data[0] = data[0].slice(0, -1)
        data[1] = data[1].slice(0, -1)
        this.state.form.QueryDate = data.join('-')
        this.state.curStartTime = data.join('-')
        this.state.form.parm.page = 1
        this.setState({
            markDateVisible: false,
            curStartTime:this.state.curStartTime,
            form: {...this.state.form},
        })
      }
      //取消时间
      resetStartTime() {
        this.state.curStartTime = '本月';
        this.state.form.QueryDate = ''
        this.state.form.parm.page = 1
        this.setState({
            markDateVisible: false,
            curStartTime:this.state.curStartTime,
            form: {...this.state.form},
        })
      }
      onPress(){
          this.state.markDateVisible = true;
          this.setState({
            markDateVisible:this.state.markDateVisible
          })
      }
      componentDidMount(){
        let key = this.props.navigation.state.params.key;
        console.log('key',key)

        //获取今年今月今日 时间
        let Time = new Date();
        let year = Time.getFullYear();
        let month = Time.getMonth()+1;
        let day = Time.getDate()

        //key 0 本月  key 1 今日
        if(key === 1){
            key = 1
            this.state.form.QueryDate = year + '-' + month + '-' + day
            this.state.headerTittle = '今日违约租客'
        }else if(key === 0){
            key = 0
            this.state.form.QueryDate = year + '-' + month
            this.state.headerTittle = '本月违约租客'
            this.state.markDateSelectedValue = [year+'年',month+'月']
        }else{
            key = 3
            this.state.form.QueryDate = year + '-' + month
            this.state.headerTittle = '租客违约列表'
            this.state.markDateSelectedValue = [year+'年',month+'月']
        }
        this.state.form.IsToday = key;
        this.setState({
            form : this.state.form,
            markDateSelectedValue:this.state.markDateSelectedValue
        })
      }
    //   jumpContact(item){
    //       console.log(item.TenID,'传入ID')
    //     this.props.navigation.navigate('AgentContractDetail',{
    //         id:item.TenID,
    //         //1业主  其他为租客
    //         isOwner:0
    //     })
    //   }

    // 渲染列表每一项数据
    allData({ item }) {
        return (
        <TouchableOpacity>
            <View style={styles.container}>
                <View
                    style={[styles.content_top, styles.content_title, styles.border]}
                >
                 <View style={styles.flash_box}>
                    <Text style={styles.border_primary}></Text>
                    <Text style={styles.content_name}>{item.HouseName}</Text>
                </View>
                    <Text style={styles.num}>
                        {dateFormat(item.DefaultTime, "yyyy-MM-dd")}
                    </Text>
                </View>
                <View style={styles.content_title}>
                    <Text style={styles.content_color}>
                    合同编号：
                    <Text style={styles.num}>{item.ContractNumber}</Text>
                    </Text>
                </View>
                <View style={styles.content_title}>
                    <Text style={styles.content_color}>
                    租客：
                    <Text style={styles.num}>
                        {item.Name} {item.Phone}
                    </Text>
                    </Text>
                    <Text style={styles.month}>{item.Money}元/月</Text>
                </View>
            </View>
        </TouchableOpacity>
        );
    }
    render() {
        return (
            <View style={styles.containerBody}>
                <Header
                    title={this.state.headerTittle}
                    hideLeft={false}
                    headerRight={
                    <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
                    <IconFont name='search' size={24} color='white'/>
                    </TouchableOpacity>
                    }
                >
                { this.state.isShowSearchBar ? <SearchBar
                        hideLeft
                        // hideRight={this.state.isShowSearchBar}
                        placeholder={"开始搜索"}
                        cancelText={"取消"}
                        onChangeText={text=>{
                            this.searchContent(text)
                        }}
                        onCancel={text=>{
                            this.toggleSearch()
                            text && this.searchContent('')
                        }}
                        onClear={()=>{
                            this.searchContent('')
                        }}
                    /> : null}
                </Header>
                {
                    this.state.form.IsToday === 1 || this.state.form.IsToday === 0 ? null:
                        <TouchableOpacity style={styles.selectTime}  onPress={this.onPress.bind(this)}>
                            <Text  style={this.state.curStartTime === "本月"  ? styles.text_colorBlank:styles.text_colorPrimary}>
                                {this.state.curStartTime}
                            </Text>
                            <IconFont
                                style={styles.text_con}
                                name="sanjiaoxing"
                                size={10}
                                color={
                                    this.state.curStartTime === "本月" ? "#dddddd" : "#389ef2"
                                }
                            />
                        </TouchableOpacity>
                }

                <Picker
                    visible={this.state.markDateVisible}
                    type={'dateYearMonth'}
                    selectedValue={this.state.markDateSelectedValue}
                    onPickerConfirm={(data) => this.markDateConfirm(data)}
                    pickerCancelBtnText={'重置'}
                    onPickerCancel={() => {this.resetStartTime()}}
                    closeModal={() => {this.setState({markDateVisible:false})}}
                />
                <List
                    request={QueryAgentBreachList}
                    form={this.state.form}
                    listKey={"TenantDefaultsDetail"}
                    setForm={form => this.setState({ form })}
                    renderItem={this.allData.bind(this)}
                    primaryKey={"TenID"}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerBody:{
        flex:1
    },
    container: {
    backgroundColor: '#ffffff',
    marginTop: 10
    },
    content_top: {
      paddingBottom: 10,
      marginBottom: 10,
      marginTop: 10
    },
    content_title: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 20,
      paddingRight: 20,
      marginBottom: 10
    },
    num: {
      color: "#777"
    },
    content_color: {
      color: "#363636"
    },
    red_font: {
      color: "#ff5a5a"
    },
    month: {
      color: "#666"
    },
    border: {
      borderBottomWidth: 0.5,
      borderColor: "#ccc"
    },
    select_btn: {
      ...DisplayStyle("row", "center", "center")
    },
    select_text: {
      fontSize: 15,
      marginRight: 3,
      color: CommonColor.color_text_primary
    },
    margin_top: {
      marginTop: 100
    },
    content_name: {
    //   borderLeftWidth: 6,
    //   borderLeftColor: "#389ef2",
    //   paddingLeft: 20,
      fontSize: 15,
      color: "#333"
    },
    selectTime:{
        height:40,
        // color:'#fff',
        fontSize:50,
        paddingHorizontal:15,
        ...DisplayStyle("row", "center", "center")
    },
    text_colorBlank:{
        color:CommonColor.color_black,
    },
    text_colorPrimary:{
        color:CommonColor.color_primary,
    },
    text_con:{
        paddingLeft:10,
    },
    border_primary: {
        width:3,
        height:12,
        lineHeight:12,
        marginRight: 10,
        backgroundColor:CommonColor.color_primary,
    },
    flash_box: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text_marginB110:{
        // marginBottom:110,
        // backgroundColor:CommonColor.color_black,
    },
  });




export default TenantDefaultsDetail;
