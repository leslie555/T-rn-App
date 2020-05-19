import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Header, List } from "../../../../../components";
import { getContractExpireList  } from '../../../../../api/bossKey'
import {DisplayStyle, Container, CommonColor} from '../../../../../styles/commonStyles'
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { dateFormat } from "../../../../../utils/dateFormat";
import { getEnumDesByValue } from "../../../../../utils/enumData"

class ContractDetailList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        FullID: '',
        CityCode: '5101XX',
        ContractType: 1,  // 0业主 1租客 
        StartTime: dateFormat(new Date()),
        ReportTimeType: 1, // 0:日报表   1:月报表    2:年报表
        ContractQueryType: 0 // 0:到期, 1:续约 2:退房 3:到期未处理
      },
      title: '',
      isOwner: false
    };
  }

  componentWillMount() {
    const myData = this.props.navigation.state.params.injectData
    const newForm = Object.assign({}, this.state.form, myData)
    const title =  newForm.title
    console.log('业主', newForm.ContractType)
    delete newForm.title;
    console.log('newform', newForm)
    this.setState({ 
      form: newForm,
      title,
      isOwner: newForm.ContractType === 0 ? true : false
    });
  }

  trimStr(val) {
    var str = val
    if (val.length > 16) {
      str = val.slice(0, 16)
      str = str + '...'
    }
    return str
  }
   
  renderMsgItem({ item, index  }) {
    // item是FlatList中固定的参数名
    return (
      <View >
        <TouchableOpacity onPress={this.toDetails.bind(this, index)}>
          <View style={style.card}>
            <Text  style={style.card_title}>{item.HouseName}</Text>
            <View style={style.cut_line}></View>
            <View style={style.one_line}>
              <Text >合同编号：{this.trimStr(item.ContractNumber)}</Text>
              <Text >合同类型：{getEnumDesByValue('PaperType', item.PaperType)}</Text>
            </View>
            <View style={style.one_line}>
              <Text >租客：{item.Name} {item.Phone}</Text>
              <Text >{item.Price}元/月</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  toDetails(id) {
    console.log('传入合同详情数据',id,this.state.isOwner, this.props.allList['BossContractExpireList'][id])
    // 跳转到详情
    // this.props.navigation.navigate('BossContractExpireDetail', {
    //   myList: this.props.allList['BossContractExpireList'][id]
    // })
    this.props.navigation.navigate('AgentContractDetail', {
      id: this.props.allList['BossContractExpireList'][id].KeyID,
      isOwner: this.state.isOwner,
      departmentType: 'other'
    })
  }

  render() {
    console.log('列表', this.state.dataList)
    return (
      <View style={{ flex: 1 }}>
        <Header title={this.state.title} />
        <List
          request={getContractExpireList}
          form={this.state.form}
          listKey={'BossContractExpireList'}
          setForm={form => this.setState({ form })}
          renderItem={this.renderMsgItem.bind(this)}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  cut_line: {
    height: 1,
    backgroundColor: '#eee'
  },
  card: {
    marginHorizontal: 15,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor:'#fff',
    borderRadius: 4,
  },
  card_title: {
    paddingVertical: 5,
  },
  one_line: {
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingVertical: 5,
  }

})

const mapToProps = state => ({ allList: state.list })
export default connect(mapToProps)(withNavigation(ContractDetailList))
