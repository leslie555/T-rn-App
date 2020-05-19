import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import { Header, FullModal, PickerAreaStatement, Picker, SelectDateBanner, BossKeyHeader } from "../../../../components";
import {DisplayStyle, DEVICE_WIDTH, Container, CommonColor} from '../../../../styles/commonStyles'
import { ContractExpireHomePage  } from '../../../../api/bossKey'
import { dateFormat } from "../../../../utils/dateFormat";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

class ContractExpire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'date',
      CityCode: '',
      FullID: '',
      ReportTimeType: 0,
      StartTime: dateFormat(new Date()),
      loadingVisible: false,
      contractProjectVisible: false,
      tenantExpire: '',
      tenantRenew: '',
      tenantCheckout: '',
      tenantPending: '',
      ownerExpire: '',
      ownerRenew: '',
      ownerCheckout: '',
      ownerPending: ''
    };
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state === nextState){
      return false
    }
    return true
  }

  fetchData = async() => {
    this.setState({ loadingVisible: true })
    const { CityCode, ReportTimeType, StartTime, FullID } = this.state
    const params = {CityCode, ReportTimeType, StartTime, FullID}
    const tenApi = ContractExpireHomePage({ ContractType: 0, ...params})
    const ownerApi = ContractExpireHomePage({ ContractType: 1, ...params })
    try {
      // 两种写法都是同时调用,因为上面有赋值给tenApi...
      // const [tenant, owner] = await Promise.all([tenApi, ownerApi])
      const { Data: tenData }  = await tenApi
      const { Data: ownerData } = await ownerApi
      this.setState({
        loadingVisible: false,
        tenantExpire: tenData.ExpireCount,
        tenantRenew: tenData.ReNewCount,
        tenantCheckout: tenData.CheckOutCount,
        tenantPending: tenData.NoOperate,
        ownerExpire: ownerData.ExpireCount,
        ownerRenew: ownerData.ReNewCount,
        ownerCheckout: ownerData.CheckOutCount,
        ownerPending: ownerData.NoOperate
      })
    } catch(err) {
      this.setState({ loadingVisible: false })
      console.log(err)
    }
  }

  getPickerData = (index, subIndex, mydata, num) => {
    // index: 报表0，区域1
    console.log('区域组件',index, num, subIndex, mydata)
    const { value, FullID } = mydata
    if(index === 0) {   // 报表类型
      subIndex === 0 ? this.setState({ ReportTimeType: 0, type: 'date' }) :
      (
        subIndex === 1 ? this.setState({ ReportTimeType: 1, type: 'month'}) : 
        this.setState({ReportTimeType: 2, type: 'year'})
      )
    }else if(index === 1) {  // 区域选择
      if(num !== 1){
        this.setState({ CityCode: value, FullID: '' }, () => { this.fetchData()} )
      }
    }else if(index === 2){  // 门店选择
      // if (mydata&&mydata.KeyID === 'One') mydata["FullID"] = ''
      this.setState({ FullID: mydata["FullID"], CityCode: '' }, () => {this.fetchData()})
    } 
  }

  contractProjectConfirm = (data) => {
    console.log('点击确定选择', data)
  }

  changeDate = (date) => {
    this.setState({ StartTime: dateFormat(date) }, () => {this.fetchData()}) 
  }

  // ContractType: 1,  // 0业主 1租客 
  // ContractQueryType: 0 // 0:到期, 1:续约 2:退房 3:到期未处理
  goContractList = (title, ContractType, ContractQueryType) => {
    // debugger
    const { CityCode, ReportTimeType, StartTime, FullID } = this.state
    this.props.navigation.navigate('BossContractExpireList', { 
      injectData:{
        title,
        CityCode,
        ReportTimeType,
        StartTime,
        FullID,
        ContractType,
        ContractQueryType
      }
    })
  }

  renderItemAll = () => {
    const {
      tenantExpire,
      tenantRenew,
      tenantCheckout,
      tenantPending,
      ownerExpire,
      ownerRenew,
      ownerCheckout,
      ownerPending,
    } = this.state
    return(
      <View style={{flex: 1, zIndex: -2}}>
        <SelectDateBanner 
          type={this.state.type}
          handleChange={(data, type) => {
            console.log('日历组件', data, type)
            this.changeDate(data)
          }}
        />
        <View >
          <View>
            <Text style={style.first_title}>租客到期</Text>
            <View style={style.line_one}>
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('租客到期', 1, 0)}}>
                <Text style={style.data_text}>{tenantExpire || 0}</Text>
                <Text> 租客到期</Text>
              </TouchableOpacity>
              <View style={style.vertical_line} />
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('租客续约', 1, 1)}}>
                <Text style={style.data_text}>{tenantRenew || 0}</Text>
                <Text> 续约</Text>
              </TouchableOpacity>
            </View>
            <View style={style.line_two}>
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('租客退房', 1, 2)}}>
                <Text style={style.data_text}>{tenantCheckout || 0}</Text>
                <Text> 退房</Text>
              </TouchableOpacity>
              <View style={style.vertical_line} />
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('租客到期未处理', 1, 3)}}>
                <Text style={style.data_text}>{tenantPending || 0}</Text>
                <Text> 到期未处理</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={style.first_title}>业主到期</Text>
            <View style={style.line_one}>
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('业主到期', 0, 0)}}>
                <Text style={style.data_text}>{ownerExpire || 0}</Text>
                <Text> 业主到期</Text>
              </TouchableOpacity>
              <View style={style.vertical_line} />
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('业主续约', 0, 1)}}>
                <Text style={style.data_text}>{ownerRenew || 0}</Text>
                <Text> 续约</Text>
              </TouchableOpacity>
            </View>
            <View style={style.line_two}>
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('业主退房', 0, 2)}}>
                <Text style={style.data_text}>{ownerCheckout || 0}</Text>
                <Text> 退房</Text>
              </TouchableOpacity>
              <View style={style.vertical_line} />
              <TouchableOpacity style={style.content_button} onPress={() => {this.goContractList('业主到期未处理', 0, 3)}}>
                <Text style={style.data_text}>{ownerPending || 0}</Text>
                <Text> 到期未处理</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Picker
          visible={this.state.contractProjectVisible}
          type={'cascader'}
          // pickerData={this.state.receiptPaymentArr}
          // selectedValue={this.state.contractPickerValue}
          onPickerConfirm={(data) => this.contractProjectConfirm(data)}
          closeModal={() => {
              this.setState({ contractProjectVisible: false })
          }}
        />
      </View>
    )
  }

  render() {
    const { loadingVisible } = this.state
    return (
      <View style={Container}>
        <FullModal visible={loadingVisible} type={2} />
        <Header title="合同到期" />
        <BossKeyHeader
          renderItem={this.renderItemAll}
          getPickerData={(index, subIndex, data, num)=>this.getPickerData(index, subIndex, data, num)}
          type={[1,2]}
          selectShop={3}
        />
      </View>)
  }
}

const style = StyleSheet.create({
  first_title: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold'
  },
  // second_title: {
  //   marginTop: 30,
  //   fontSize: 18,
  //   fontWeight: 'bold'
  // },
  line_one: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginHorizontal: 15,
    backgroundColor: '#fff',
    ...DisplayStyle('row', 'center', 'center')
  },
  line_two: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: "#eee",
    marginHorizontal: 15,
    backgroundColor: '#fff',
    ...DisplayStyle('row', 'center', 'center')
  },
  vertical_line: {
    height: 30,
    width: 1,
    backgroundColor: '#eee'
  },
  content_button: {
    height: 70,
    lineHeight: 70,
    flex: 1,
    borderColor: "#eee",
    ...DisplayStyle('column', 'center', 'center')
  },
  data_text: {
    color: CommonColor.color_primary,
    fontWeight: 'bold',
    fontSize: 18
  }
})

export default connect()(withNavigation(ContractExpire))
