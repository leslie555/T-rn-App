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
import { GetOwnerList } from "../../../../../api/report"; // 请求接口
import { dateFormat } from "../../../../../utils/dateFormat";
export default class OwnerExpire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSearchBar: false,
      isShowShadow: false,
      markDateVisible: false,
      markDateSelectedValue: [],
      form: {
        parm: {
          page: 1,
          size: 10
        },
        KeyWord: '',
        Month: ''
      },
      curMonth: '本月',
    }
  }
  componentDidMount(){
    let Y = new Date().getFullYear();
    let M = new Date().getMonth() + 1;
    const markDateSelectedValue = [];
    markDateSelectedValue.push(Y + '年')
    markDateSelectedValue.push(M + '月')
    this.state.form.Month = Y + '-' + M
    this.setState({
      form: {...this.state.form},
      markDateSelectedValue
    })
  }
  markDateConfirm(data) {
    const markDateSelectedValue = [...data];
    data[0] = data[0].slice(0, -1)
    data[1] = data[1].slice(0, -1)
    this.state.form.Month = data.join('-')
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    console.log('curStartMonth',this.state.form.Month)
    console.log('data', data)
    this.state.curMonth = year == data[0] && month == data[1] ? '本月' : data[0] + '-' + data[1];
    this.state.form.parm.page = 1
    this.setState({
        form: {...this.state.form},
        curMonth: this.state.curMonth,
        markDateVisible: false,
        markDateSelectedValue
    })
  }
  resetStartTime() {
    this.state.form.parm.page = 1
    this.state.form.Month = ''
    this.setState({
        form: this.state.form,
        curMonth: '本月',
        markDateVisible: false
    })
  }
  resetSearch(text){
    this.state.form.KeyWord = text
        this.setState({
            form: {...this.state.form}
        })
    console.log('text',text)
  }
  toggleDateVisible(){
    this.setState({
      markDateVisible: true
    })
  }
  toggleSearch(){
    this.setState({
      isShowSearchBar: !this.state.isShowSearchBar
    });
  }
  goContractDetail(item){
    console.log('items',item)
    this.props.navigation.navigate('AgentContractDetail',{
      id: item.KeyID,
      isOwner: 1
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
              {/* <Text >{item.ContractNumber.length}</Text> */}
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
    return (
      <View style={[styles.contain_body,Container]}>
        <Header
          title="业主合同到期"
          headerRight={
            <TouchableOpacity
              onPress={this.toggleSearch.bind(this)}
            ><IconFont name="search" size={24} color="white" />
            </TouchableOpacity>
          }
        >
          {this.state.isShowSearchBar ? (
            <SearchBar
              // hideRight={this.state.isShowSearchBar}
              placeholder={"请输入房源名称/业主姓名/业主电话"}
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
          </View>
          {/* Picker 筛选 end */}
          {/* <ScrollView style={styles.margin_bottom}>          */}
            <List
              request={GetOwnerList}
              form={this.state.form}
              listKey={"AgentOwnerExpire"}
              setForm={form => this.setState({ form })}
              renderItem={this.renderAllData.bind(this)}
            />
        {/* </ScrollView> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  contain_body: {
    position: 'relative',
    flex: 1
  },
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
    color: "#777",
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
  border_primary: {
    width:3,
    height:12,
    lineHeight:12,
    marginRight: 10,
    backgroundColor:CommonColor.color_primary,
  },
  content_name: {
    height: 18,
    lineHeight:18,
    fontSize: 15,
    color: "#333"
  },
  margin_bottom: {
    marginBottom: 150
  },
  flash_box: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
