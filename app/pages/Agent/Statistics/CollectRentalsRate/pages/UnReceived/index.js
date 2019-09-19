import { View, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import SearchBar from "../../../../../../components/SearchBar";
import IconFont from "../../../../../../utils/IconFont";
import ListItem from "../../Components/ListItem";
import { List, Header, Picker } from "../../../../../../components";
import styles from "./style";
import { fetchBillData } from "../../../../../../utils/arrUtil/fetchBillData";
import { ShowRentCollectionList } from "../../../../../../api/report";

export default class Received extends Component {
  constructor(props) {
    super(props);
    this.billProjectClone = [];
    this.currentCItem = {};
    this.UnReceivedType = this.props.navigation.getParam("UnReceivedType", "");
    this.type = this.props.navigation.getParam("type", 0)
    this.state = {
      isShowSearch: false,
      markDateVisible: false,
      markDateSelectedValue: [],
      monthTitle: "本月",
      billProjectVisible: false,
      billProjectSelectedValue: [],
      billProjectText: "项目",
      form: {
        parm: {
          page: 1,
          size: 10
        },
        Month: "",
        BillProjectName: "",
        type: this.type,
        KeyWord: ""
      }
    };
  }

  componentDidMount() {
    if(this.type == 0) {
      this.initMonth()
    } else if(this.type == 2) {
      this.initToday();
    }    
    this.initBillProject().then(() => {
      this.setState({
        form: this.state.form,
        markDateSelectedValue: this.state.markDateSelectedValue,
        billProject: this.state.billProject
      });
    });
  }

  initToday() {
    let Y = new Date().getFullYear();
    let M = new Date().getMonth() + 1;
    if (M < 10) {
      M = "0" + M;
    }
    let D = new Date().getDate();
    if (D < 10) {
      D = "0" + D;
    }
    const Month = Y + "-" + M + "-" + D
    this.state.form.Month = Month
  }  
  
  initMonth() {
    let Y = new Date().getFullYear();
    let M = new Date().getMonth() + 1;
    const markDateSelectedValue = [];
    markDateSelectedValue.push(Y + "年");
    markDateSelectedValue.push(M + "月");
    if (M < 10) {
      M = "0" + M;
    }
    const Month = Y + "-" + M;
    this.state.form.Month = Month;
    this.state.markDateSelectedValue = markDateSelectedValue;
  }

  initBillProject() {
    return fetchBillData(1, true).then(({ Data, realData }) => {
      this.billProjectClone = realData;
      this.state.billProject = Data;
    });
  }

  _onPress(name) {
    if (name === "date") {
      this.setState({ markDateVisible: true });
    } else if (name === "billProject") {
      this.setState({ billProjectVisible: true });
    }
  }

  // 搜索
  // 重置搜索条件
  resetSearch = text => {
    const form = Object.assign({}, this.state.form);
    form.parm.page = 1;
    form.KeyWord = text;
    this.setState({
      form
    });
  };

  _onChangeText = text => {
    this.resetSearch(text);
  };

  _onCancel = text => {
    if (!text) {
      this.setState({
        isShowSearch: false
      });
    } else {
      this.resetSearch("");
      this.setState({
        isShowSearch: false
      });
    }
  };

  _onClear = () => {
    this.resetSearch("");
  };

  changeMonth = dataMonth => {
    let Month;
    if (dataMonth.slice(0, -1) < 10) {
      Month = 0 + dataMonth.slice(0, -1);
    } else {
      Month = dataMonth.slice(0, -1);
    }
    return Month;
  };

  changeMonthTitle = data => {
    return data[1].slice(0, -1) == new Date().getMonth() + 1
      ? "本月"
      : data.join("");
  };

  billProjectConfirm(data) {
    this.currentCItem.BillProjectName = data[1];
    const billProjectSelectedValue = [...data];
    if (data[1] === "全部") {
      this.currentCItem.BillProjectName = "";
    }
    const form = Object.assign({}, this.state.form);
    form.BillProjectName = this.currentCItem.BillProjectName;
    const billProjectText = data[1];
    this.setState({
      billProjectText,
      form,
      billProjectSelectedValue
    });
  }

  markDateConfirm(data) {
    const dataMonth = data[1];
    const markDateSelectedValue = [];
    const Month = this.changeMonth(dataMonth);
    markDateSelectedValue.push.apply(markDateSelectedValue, data);
    this.state.form.Month = data[0].slice(0, -1) + "-" + Month;
    this.state.monthTitle = this.changeMonthTitle(data);
    this.state.form.parm.page = 1;
    const form = Object.assign({}, this.state.form);
    this.setState({
      form,
      monthTitle: this.state.monthTitle,
      markDateVisible: false,
      markDateSelectedValue
    });
  }

  render() {
    const headerRight = (
      <TouchableOpacity onPress={() => this.setState({ isShowSearch: true })}>
        <IconFont name="search" size={20} color="white" />
      </TouchableOpacity>
    );
    const search = (
      <SearchBar
        onChangeText={this._onChangeText}
        onCancel={this._onCancel}
        onClear={this._onClear}
        placeholder={"小区/门牌号/租客姓名"}
      />
    );
    const renderItem = ({ item }) => {
      return <ListItem item={item} disabled={false} />;
    };
    return (
      <View style={styles.container}>
        <Header
          title={!this.UnReceivedType ? "未收" : "今日未收"}
          headerRight={headerRight}
        >
          {this.state.isShowSearch ? search : null}
        </Header>
        <View style={styles.head_filter}>
          {!this.UnReceivedType && (
            <TouchableOpacity
              onPress={() => this._onPress("date")}
              style={styles.select_btn}
            >
              <Text style={[styles.select_text]}>{this.state.monthTitle}</Text>
              <IconFont name="sanjiaoxing" size={10} color={this.state.color} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => this._onPress("billProject")}
            style={styles.select_btn}
          >
            <Text style={[styles.select_text]}>
              {this.state.billProjectText}
            </Text>
            <IconFont name="sanjiaoxing" size={10} color={this.state.color} />
          </TouchableOpacity>
        </View>
        {!this.UnReceivedType && (
          <Picker
            visible={this.state.markDateVisible}
            type={"dateYearMonth"}
            selectedValue={this.state.markDateSelectedValue}
            onPickerConfirm={data => this.markDateConfirm(data)}
            closeModal={() => {
              this.setState({ markDateVisible: false });
            }}
          />
        )}
        <Picker
          visible={this.state.billProjectVisible}
          type={"cascader"}
          pickerData={this.state.billProject}
          selectedValue={this.state.billProjectSelectedValue}
          onPickerConfirm={data => this.billProjectConfirm(data)}
          closeModal={() => {
            this.setState({ billProjectVisible: false });
          }}
        />
        <List
          request={ShowRentCollectionList}
          form={this.state.form}
          listKey={`AgentUnReceivedList${this.type}`}
          setForm={form => this.setState({ form })}
          renderItem={renderItem}
        />
      </View>
    );
  }
}
