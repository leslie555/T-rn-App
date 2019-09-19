import React from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    Linking,
    RefreshControl,
    Dimensions,
    TouchableWithoutFeedback} from 'react-native'
    import ScrollableTabView from 'react-native-scrollable-tab-view'
import styles from './style'
import IconFont from '../../../../utils/IconFont/index'
// import SearchBar from '../../../../components/SearchBar'
import ListLoading from "../../../../components/ListLoading";
import EmptyList from "../../../../components/EmptyList";
import ListFooterComponent from "../../../../components/ListFooterComponent";
import { List , Header , SearchBar , ListSelector , Picker} from '../../../../components'
import { TopMenuItem } from '../../../../components/ListSelector'

import {SelectBookKeepPage} from '../../../../api/personalAccount'
import { QueryBillItem } from '../../../../api/owner'
//redux
import { connect } from 'react-redux'
import { accountList } from '../../../../redux/actions/account'

import {dateFormat} from '../../../../utils/dateFormat'
import { fetchBillData } from '../../../../utils/arrUtil';

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.currentCItem = {}
        this.state = {
            //接口接受的数据
            billProject: [],
            // 展示picker是否出现
            billProjectVisible: false,
            // 选中的数据
            billProjectSelectedValue: [],
            //自定义组件的名称
            BillProjectText: "项目",

            // 头部展示字段
            headerText:'收入记账',
            //判断搜索框是否出现
            isShow: false,
            //list组件接受的key
            listKey: 'IncomeOrExpendAccount',
            form: {
                parm: {
                    page: 1,
                    size: 10
                },
                Keyword: '',
                //1:收入 2:支出
                type: 1,
                StartTime :'',
                EndTime :'',
                  /// 1未收   2已收   3未支   4已支  5 逾期
                InOrOutStatus :'',
                ProjectID:'',

            },
            listConfig : [
                {
                  type: 'title',
                  title: '状态',
                  data: [
                    {
                      title: '全部',
                      value: ''
                    },
                    {
                      title: '未收',
                      value: 1
                    },
                    {
                      title: '已收',
                      value: 2
                    },
                    {
                        title: '部分收',
                        value: 5
                    },
                    {
                      title: '逾期',
                      value: 7
                    }

                  ]
                },
                {
                    type: 'customize', // 自定义组件
                    componentKey: 'aaa'
                },
                {
                  type: 'panel', // 更多筛选组件
                  title: '更多',
                  components: [
                    {
                      type: 'datepicker',
                      title: '日期'
                    }
                  ]
                }
              ]
        }

        this.ListSelector = null
    }
    //进入新增页面
    addNewAccount(){
        // console.log(this.state.listKey)
      this.props.navigation.navigate('AgentEditCashBook',{editType: 0,busType: this.props.navigation.state.params.label==='收入记账'? 1 : 2})
    }
    // 进入详情
    accountList(item){
        // console.log(this.state.listKey)
        item.key = this.state.listKey;
        console.log(item,78)
        this.props.navigation.navigate('AgentAccountDetails',{item})
    }
    // 返回上一级
    goBack(){
        this.props.navigation.goBack();
    }
    // 输入关键字
    onChangeText(text) {
        const form = {...this.state.form}
        form.parm.page = 1
        form.Keyword = text
        this.setState({
            form
        })
    }
    // 取消搜索
    onCancel(text) {
        if (!text) {
            this.setState({
                isShow: false
            })
            const form = {...this.state.form}
            form.Keyword = ''
            this.setState({
                form
            })
        }
    }
    // 清除关键字
    onClear() {
        const form = {...this.state.form}
        form.Keyword = ''
        this.setState({
            form
        })
    }
    //是否显示头部
    showSearch(){
        this.setState({
            isShow: true
        })
    }

    onSelectMenu = (index, subindex, data) => {

        console.log(index, subindex, data)
        // index = 0  为第一个
        // index = 2  为更多
        //subindex 为每一个的下标
        //data  返回过来的数据
        const form = {...this.state.form}
        form.parm.page = 1
        if(index == 0){
           /// 1未收   2已收   3未支   4已支  5 逾期
           form.InOrOutStatus = data.value
        }else if(index == 2){
            form.EndTime = data[0].data.endTime;
            form.StartTime = data[0].data.startTime;
        }
        this.setState({
            form : form,
        })
    }

    //自定义组件  项目 选中后返回来的数据
    billProjectConfirm(data) {
        //获取项目名称
        this.state.BillProjectText = data[1];
        let keyId
        if(data[0] === '全部' && data[1] === '全部'){
            keyId = ''
        }else{
                //获取项目的所有数据
            let getInitialData = this.props.accountList.account;
            //选中的KeyID
            getInitialData.forEach(item =>{
                if(item.Name == data[0]){
                    item.Children.forEach(list =>{
                        if(list.Name == data[1]){
                            keyId =  list.KeyID
                        }
                    })
                }
            })
        }
        const form = {...this.state.form}
        form.parm.page = 1
        form.ProjectID = keyId
        this.setState({
            BillProjectText : this.state.BillProjectText,
            form : form
        })
    }


    renderApprovalItem({item}) {
        return (
            <View style={styles.outside_box}>
                <View style={styles.inside_box}>
                    <TouchableOpacity onPress={this.accountList.bind(this,item)}>
                        <View style={styles.item_title}>
                            <View style={styles.item_title_bothCon}>
                                {this.state.form.type === 1 ?
                                    <Text
                                    style={styles.item_title_text}>应收款日： &nbsp;&nbsp;&nbsp;{dateFormat(item.ReceivablesDate)}</Text> :
                                    <Text
                                    style={styles.item_title_text}>应付款日： &nbsp;&nbsp;&nbsp;{dateFormat(item.ReceivablesDate)}</Text>
                                }
                            </View>
                            <View>
                                <Text
                                    style={[styles.item_title_textRight,styles.account_colorR]}>{item.Describe}</Text>
                            </View>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.con_body}>
                            <View style={styles.item_info}>
                                <View style={styles.type_title_container}>
                                    <Text style={styles.type_title}>房源名称：&nbsp;&nbsp;{item.HouseName}</Text>
                                    <Text style={styles.content_title}>{item.Amount}元</Text>
                                </View>
                            </View>
                            <View style={styles.content_container}>
                                <View style={styles.content_container_time}>
                                    <Text style={styles.content_title}>项         目：&nbsp;&nbsp;{item.BillProjectName}</Text>
                                    {/* <Text
                                        style={styles.content_text}></Text> */}
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderContent = () => {
        const renderItem = ({ item }) => {
            return  this.renderApprovalItem({item})
        }
        return (
            <List
              request={SelectBookKeepPage}
              form={this.state.form}
              setForm={form => this.setState({ form })}
              listKey={this.state.listKey}
              onRefresh={this.onRefresh}
              renderItem={renderItem}
            />
        )
      }
    //herder 组件
    renderAccount(){
        return(
            <View style={styles.accountHeader}>
                <TouchableOpacity  onPress={this.showSearch.bind(this)}>
                    <IconFont name='search'   size={20} color='white'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.addNewAccount.bind(this)}>
                    <Text style={styles.account_add} >新增</Text>
                </TouchableOpacity>
            </View>

        )
    }
    projectBtn(){
        this.setState({
            billProjectVisible:true,
        })
    }
    componentDidMount(){
        //判断进入的是哪个页面  收入记账 or 支出记账
        let label = this.props.navigation.state.params.label;
        if(label == '收入记账'){
            this.state.form.parm.page = 1;
            this.setState({
                form:this.state.form
            })
        }else{
            this.state.form.type = 2;
            this.state.form.parm.page = 1;
            this.state.listConfig[0].data = [
                  {
                    title: '全部',
                    value: ''
                  },
                  {
                    title: '未支',
                    value: 3
                  },
                  {
                    title: '已支',
                    value: 4
                  },
                  {
                    title: '部分付',
                    value: 6
                  },
                  {
                    title: '逾期',
                    value: 7
                  }
            ],
            this.state.listKey = 'ExpendOrIncomeAccount'

            this.setState({
                listConfig:this.state.listConfig,
                form:this.state.form,
                headerText:label,
                listKey:this.state.listKey,
            })
        }
        //自定义 项目的组件
        fetchBillData(1,true).then(({Data,realData}) => {
            //用redux 记录返回来没有做处理的项目数据
            this.props.dispatch(
                accountList({
                  key: 'account',
                  data: realData
                })
              )

              console.log(this.props.accountList.account,2525)
            this.setState({
              billProject: Data
            })
        })

    }
    render() {
        const AccountText = (
           this.renderAccount()
        )
        const customComponent = {
            aaa: (
              <TopMenuItem
                customize
                label={this.state.BillProjectText}
                selected={this.state.billProjectVisible}
                onPress={() => {
                  this.setState({
                    billProjectVisible: !this.state.billProjectVisible
                  })
                }}
              />
            )
          }
        return (
            <View style={styles.container}>
                <Header
                    hideLeft={false}
                    title={this.state.headerText}
                    headerRight = {AccountText}
                >
                    {!this.state.isShow?'':
                        <SearchBar
                        hideCancelText={'取消'}
                        placeholder={'请输入房源名称'}
                        hideCancelText={!this.state.isShow}
                        onChangeText={this.onChangeText.bind(this)}
                        onCancel={this.onCancel.bind(this)}
                        onClear={this.onClear.bind(this)}
                    />}
                </Header>


                <Picker
                    visible={this.state.billProjectVisible}
                    type={'cascader'}
                    pickerData={this.state.billProject}
                    selectedValue={this.state.billProjectSelectedValue}
                    onPickerConfirm={(data) => this.billProjectConfirm(data)}
                    closeModal={() => {
                    this.setState({billProjectVisible: false})
                    }}
                />
                <ListSelector
                    ref={ListSelector => (this.ListSelector = ListSelector)}
                    config={this.state.listConfig}
                    onSelectMenu={this.onSelectMenu}
                    renderContent={this.renderContent}
                    customComponent={customComponent}
                />
            </View>
        )
    }
}

const mapToProps = state => {
    return { accountList: state.account }
}
export default connect(mapToProps)(Account)
