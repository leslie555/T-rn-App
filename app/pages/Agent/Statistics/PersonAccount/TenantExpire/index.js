import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { SearchBar, List, Header, Picker } from "../../../../../components";
import {
  DisplayStyle,
  CommonColor,
  Container
} from "../../../../../styles/commonStyles";
import style from "../style";
import IconFont from "../../../../../utils/IconFont";
import { QueryAgentTenantExpire } from "../../../../../api/userCenter"; // 请求接口
import { dateFormat } from "../../../../../utils/dateFormat";
export default class TenantExpire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSearchBar: false,
      isAll: false,
      isShowShadow: false,
      // picker 出现
      markDateVisible: false,
      //选择picker的数据
      markDateSelectedValue: [],
      curStartTime: '本月',
      form: {
        parm: {
          page: 1,
          size: 10
        },
        KeyWord: "",
        Month: ""
      }
    };
  }
  resetSearch(text){
    this.state.form.KeyWord = text
    this.state.form.parm.page = 1
        this.setState({
            form: {
              ...this.state.form
            }
        })
    console.log('text',text)
  }
  toggleSearch(){
    this.setState({
      isShowSearchBar: !this.state.isShowSearchBar
    });
  }
  toggleDateVisible(){
    this.setState({
      markDateVisible: true
    })
  }
  // 筛选时间
  markDateConfirm(data) {
    const markDateSelectedValue = [...data];
    data[0] = data[0].slice(0, -1)
    data[1] = data[1].slice(0, -1)
    this.state.form.Month = data.join('-')
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    console.log('form',this.state.form.Month)
    this.state.curStartTime =  year == data[0] && month == data[1] ? '本月' : data[0] + '-' + data[1]
    this.state.form.parm.page = 1   
    this.setState({
        markDateVisible: false, 
        curStartTime:this.state.curStartTime,
        form: {...this.state.form},
        markDateSelectedValue
    })
  }
  // 重置
  resetStartTime() {
    this.state.curStartTime = '本月';
    this.state.form.Month = ''
    this.setState({
        form: this.state.form,
        markDateVisible: false,
        curStart: '本月',
        Time:this.state.curStartTime,
    })
    this.getYearMonth()
  }
  componentDidMount(){
    this.getYearMonth()
  }
  // 默认、重置当前年月
  getYearMonth(){
    let YY = new Date().getFullYear();
    let MM = new Date().getMonth() + 1;
    const markDateSelectedValue = [];
    markDateSelectedValue.push(YY + '年')
    markDateSelectedValue.push(MM + '月')
    this.state.form.Month = YY + '-' + MM
    this.setState({
      form: {...this.state.form},
      markDateSelectedValue
    })
  }
  goContractDetail(item){
    this.props.navigation.navigate('AgentContractDetail',{
        id: item.KeyID,
        isOwner: 0
    })
  }

  // 渲染列表每一项数据
  renderAllData({ item }) {
    return (
      <TouchableOpacity onPress={this.goContractDetail.bind(this,item)}>
        <View style={styles.container}>
          <View
            style={[styles.content_top, styles.content_title, styles.border]}
          >
           <View style={styles.flash_box}>
              <Text style={styles.border_primary}></Text>
              <Text style={styles.content_name}>{item.HouseName}</Text>
            </View>
            <Text style={styles.red_font}> {item.StrTime}</Text>
          </View>
          <View style={styles.content_title}>
            <Text style={styles.content_color}>
              合同编号：
              <Text style={styles.num}>{
                item.ContractNumber.length > 8 ? 
                item.ContractNumber.slice(0,6) + '...' : item.ContractNumber
                }</Text>
            </Text>
            <Text style={styles.content_color}>
              到期时间：
              <Text style={styles.num}>
                {dateFormat(item.EndTime, "yyyy-MM-dd")}
              </Text>
            </Text>
          </View>
          <View style={styles.content_title}>
            <Text style={styles.content_color}>
              业主：
              <Text style={styles.num}>
                {item.Name} {item.Phone}
              </Text>
            </Text>
            <Text style={styles.month}>{item.Amount}元/月</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    // debugger
    return (
      <View style={{ position: "relative", ...Container }}>
        <Header
          title="租客合同到期"
          // hideLeft
          headerRight={
            <TouchableOpacity
              onPress={this.toggleSearch.bind(this)}
            >
              {this.state.isShowSearchBar ? null : (
                <IconFont name="search" size={24} color="white" />
              )}
            </TouchableOpacity>
          }
        >
          {this.state.isShowSearchBar ? (
            <SearchBar
              placeholder={"请输入房源名称/租客姓名/租客电话"}
              cancelText={"取消"}
              onChangeText={text => {
                this.resetSearch(text)
              }}
              onCancel={(text) => {
                this.toggleSearch()
                text && this.resetSearch('')
              }}
              onClear={() => {
                this.resetSearch('')
              }}
            />
          ) : null}
        </Header>

          {/* Picker 筛选 start */}
            <View style={[style.select_box, style.select_position]}>
              <TouchableOpacity
                onPress={this.toggleDateVisible.bind(this)}
                style={style.select_btn}
              >
                <View style={style.select_label_box}>
                  <Text
                    style={[
                      style.select_text,
                      this.state.curStartTime === "本月" ? "" : style.selected_text
                    ]}
                  >
                   {this.state.curStartTime}
                  </Text>
                  <IconFont
                    name="sanjiaoxing"
                    size={10}
                    color={
                      this.state.curStartTime === "本月" ? "#dddddd" : "#389ef2"
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
            </View>
          {/* Picker 筛选 end */}
          <ScrollView style={styles.margin_bottom}>
            <List
              request={QueryAgentTenantExpire}
              form={this.state.form}
              listKey={"AgentTenantExpire"}
              setForm={form => this.setState({ form })}
              renderItem={this.renderAllData.bind(this)}
            />
          </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
    marginTop: 100,
    marginBottom: 100
  },
  content_name: {
    fontSize: 15,
    lineHeight:18,
    height: 18,
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
  margin_bottom: {
    // marginBottom: 150
  }
});
