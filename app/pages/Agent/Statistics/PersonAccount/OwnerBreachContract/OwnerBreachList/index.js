
import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SearchBar, List, Header, Picker } from '../../../../../../components' 
import { DisplayStyle, CommonColor, Container } from '../../../../../../styles/commonStyles'
import style from '../../style'
import IconFont from '../../../../../../utils/IconFont' 
import { dateFormat } from "../../../../../../utils/dateFormat";
import { QueryAgentBreachList } from "../../../../../../api/userCenter";
class OwnerBreachList extends Component {
    constructor(props){
        super(props);
        this.state={
            isShowSearchBar: false,
            isAll: false,
            isShowShadow: false,
            curMonth: '本月',
            defaultHeader: '',
            markDateVisible: false,
            markDateSelectedValue: [],
            form: {
                Type: 0,  //业主 Type=0   租客 Type=1
                parm: {
                    page: 1,
                    size: 10
                },
                keyWord: '',
                QueryDate: '',
                IsToday:''  
            }
        }
    }
    componentDidMount(){
        const { key }  = this.props.navigation.state.params
        console.log('key',key)
        let Y = new Date().getFullYear();
        let M = new Date().getMonth() + 1;
        let D = new Date().getDate();
        const markDateSelectedValue = [];
        markDateSelectedValue.push(Y + '年')
        markDateSelectedValue.push(M + '月')
        this.state.form.QueryDate = Y + '-' + M

        if(key === 1){
            this.state.form.QueryDate = Y + '-' + M + '-' + D
            this.state.defaultHeader = '今日违约业主'
        }else if(key === 0){
            this.state.defaultHeader = '本月违约业主'
        }
        else{
            this.state.form.QueryDate = Y + '-' + M
            this.state.defaultHeader = '业主违约列表'
        }
        this.state.form.IsToday = key;
        this.setState({
          form: {...this.state.form},
          markDateSelectedValue,
          defaultHeader: this.state.defaultHeader
        })
    }

    markDateConfirm(data) {
        const markDateSelectedValue = [...data];
        data[0] = data[0].slice(0, -1)
        data[1] = data[1].slice(0, -1)
        console.log('data',data)
        this.state.form.QueryDate = data.join('-');
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        this.state.curMonth = year == data[0] && month == data[1] ? '本月' : data[0] + '-' + data[1];
        this.state.form.parm.page = 1
        this.setState({
            form: {...this.state.form},
            isAll: false,
            curMonth: this.state.curMonth,
            markDateVisible: false,
            markDateSelectedValue
        })
    }
    resetStartTime() {
        this.state.form.parm.page = 1
        this.state.form.QueryDate = ''
        this.setState({
            form: this.state.form,
            curMonth: '本月',
            isAll:false,
            markDateVisible: false
        })
    }

    toggleSearch(){
        this.setState({
            isShowSearchBar: !this.state.isShowSearchBar
        })
    }
    toggleDateVisible(){
        this.setState({
          markDateVisible: true
        })
    }
    searchContent(text){
        this.state.form.keyWord = text
        this.setState({
            form: {...this.state.form}
        })
        console.log('text',text)
    }
    // Picker 筛选栏头部
    selectTimeTypeTitle() {
        return this.state.curTimeType;
    }
    selectCurSalesmanTitle() {
        return this.state.curSalesman;
    }
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
                <Text style={styles.num}>{
                     item.ContractNumber.length > 8 ? 
                     item.ContractNumber.slice(0,6) + '...' : item.ContractNumber
       
                    }</Text>
                </Text>
            </View>
            <View style={styles.content_title}>
                <Text style={styles.content_color}>
                业主：
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
        const { key }  = this.props.navigation.state.params
        return (
            <View style={Container}>
            <Header 
                title={this.state.defaultHeader}
                hideLeft={false} 
                headerRight={
                <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
                  <IconFont name='search' size={24} color='white'/>
                </TouchableOpacity>
                }
            >
            { this.state.isShowSearchBar ? <SearchBar 
                    hideLeft
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
           
                 {/* Picker 筛选 start */}
                 
                    {key == 0 || key == 1 ? null :(<View style={[style.select_box, style.select_position]}>
                    <TouchableOpacity
                        onPress={this.toggleDateVisible.bind(this)}
                        style={style.select_btn}
                    >
                        <View style={style.select_label_box}>
                        <Text
                            style={[
                            style.select_text,
                            this.state.curMonth === "本月" ? "" : style.selected_text
                            ]}
                        >
                             {this.state.curMonth}
                        </Text>
                        <IconFont
                            name="sanjiaoxing"
                            size={10}
                            color={
                            this.state.curMonth === "本月" ? "#dddddd" : "#389ef2"
                            }
                        />
                        </View>
                    </TouchableOpacity>
                    <Picker
                        visible={this.state.markDateVisible}
                        type={'dateYearMonth'}
                        selectedValue={this.state.markDateSelectedValue}
                        onPickerConfirm={(data) => this.markDateConfirm(data)}
                        pickerCancelBtnText={'重置'}
                        onPickerCancel={() => {this.resetStartTime()}}
                        closeModal={() => {this.setState({markDateVisible:false})}}
                    />
                    </View>)}

                    {/* Picker 筛选 end */}
                    {/* <ScrollView style={styles.margin_bottom}> */}
                        <List
                            request={QueryAgentBreachList}
                            form={this.state.form}
                            listKey={"AgentBreachList"}
                            setForm={form => this.setState({ form })}
                            renderItem={this.allData.bind(this)}
                            primaryKey={'TenID'}
                        />
                    {/* </ScrollView> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain_body:{
      flex:1,
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
      fontSize: 15,
      height: 18,
      lineHeight:18,
      color: "#333"
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
  });
  



export default OwnerBreachList;