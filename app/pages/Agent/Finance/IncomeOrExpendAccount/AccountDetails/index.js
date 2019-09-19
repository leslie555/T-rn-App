import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import Toast from 'react-native-root-toast';
import { Header, ButtonGroup, ImagePreview, FullModal } from "../../../../../components";
import { GiftedForm } from "../../../../../components/Form/GiftedForm";
import {BookKeepDetails, RemoveBookKeepByIDs, UpdateBookKeepByIDs} from '../../../../../api/owner'
import { dateFormat } from '../../../../../utils/dateFormat'
import { connect } from 'react-redux'
import { setAccountDetail } from '../../../../../redux/actions/accountDetail'
import {getEnumDesByValue} from '../../../../../utils/enumData'
import { deleteList } from '../../../../../redux/actions/list'
 class AccountDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      disabled: false,
      keyID: 0,
      listDetail: {},
      btnOptions: [],
      loading: false,
      enumList: []
    },
    this.defaultStatus = [
      {label: '未收', key: 1},

      {label: '已收', key: 2},

      {label: '未支', key: 3},

      {label: '已支', key: 4},

      {label: '部分收', key: 5},

      {label: '部分付', key: 6},
    ],
    this.defaultBtns = [
      {
        label: '删除',
        value: 'Delete'
      },
      {
        label: '修改',
        value: 'Modify'
      },
      {
        label: '去收款',
        value: 'Receivables'
      }
    ]
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.accountDetail) !==
      JSON.stringify(nextProps.accountDetail)
    ) {
      this.getFilterBtn(nextProps.accountDetail)
    }
  }
  componentWillMount(){
    this.setState({
      loading: true
    })
  }
  componentDidMount(){
    let keyID = this.props.navigation.state.params.item.KeyID
    BookKeepDetails({keyID}).then(({Data})=>{
      this.props.dispatch(
        setAccountDetail({
          data: Data
        })
      )
      this.getFilterBtn(Data)
      this.setState({
        loading: false
      })
    })

  }
  // 改变收支状态
  getFilterStatus(item){
    let result = ''
    switch (item) {
      case 1:
        result = '未收'
        break
      case 2:
        result = '已收'
        break
      case 3:
        result = '未支'
        break
      case 4:
        result = '已支'
        break
      case 5:
        result = '部分收'
        break
      case 6:
        result = '部分付'
        break
    }
    return result;
  }
  goPages(routeName,item) {
    this.props.navigation.navigate(routeName,item)
  }
   getFilterBtn(data){
      this.getFilterStatus(data.InOrOutStatus)
     const defaultStatus = this.defaultStatus.filter(res =>
         res.key === data.InOrOutStatus
      )
     if(defaultStatus.length===0){
       return
     }
      console.log('收支状态',defaultStatus);
    // 判断该显示什么按钮
    let  btns = [];
    if( data.HouseKey && defaultStatus[0].key === 1){
      btns = ['Modify','Delete','Receivables']
    }
    else if( data.HouseKey && defaultStatus[0].key === 5 ){
      btns = ['Receivables']
    }
    else if( data.HouseKey && (defaultStatus[0].key === 2 ||
             defaultStatus[0].key === 4 ||
             defaultStatus[0].key === 6)){
      btns = []
    }
    else {
      btns = ['Modify','Delete']
    }
    if( (data.UnPaidMoney == 0.00 || data.UnPaidMoney == 0)  && defaultStatus[0].key !== 3 ){
      btns.pop()
    }
    this.setState({
      btnOptions: this.defaultBtns.filter(x=>btns.find(y=>y===x.value))
    })
  }

  // 删除
  handleDelete(){
    this.setState({
      loading: false
    })
    console.log('this.props.accountDetail',this.props.accountDetail.KeyID)
    const KeyID = this.props.accountDetail.KeyID;
    Alert.alert(
          '提示',
          '确认删除吗',
          [
            {
              text: '取消'
            },
            {
              text: '确定',
              onPress: () => {
                this.setState({
                  loading: true
                })
                RemoveBookKeepByIDs(
                  [KeyID]
                ).then(response=>{
                  console.log('删除--response',response)
                  if(response.Code === 0){
                    this.setState({
                      loading: false
                    },()=>{
                      setTimeout(()=>{
                        Alert.alert(
                          '提示',
                          '删除成功',
                          [
                            { text: '确定',
                              onPress: ()=>{
                                //删除返回列表  redux
                                this.props.dispatch(
                                  deleteList({
                                    KeyID: this.props.navigation.state.params.item.KeyID,
                                    key: this.props.navigation.state.params.item.key,
                                  })
                                )
                                this.props.navigation.goBack()
                              }}
                          ]
                      )
                      },100)
                    })
                  }
                }).catch(err=>{
                    this.setState({
                      loading: false
                    })
                })
              }
            }
          ],
          {cancelable: false}
      )

  }
  // 修改
  handleModify(){
    this.props.navigation.navigate('AgentEditCashBook',{
      editType: 1,
      data: this.props.accountDetail
    })
  }
  // 去收款
  handleReceivables(){
    const {
      KeyID, // 账单id
      Amount, // 账单总金额
      UnPaidMoney, // 总未付金额
    } = this.props.accountDetail;
    this.goPages('AgentSelectPayMode',{
      billId: KeyID,
      totalAmount: Amount,
      unPaidAmount: UnPaidMoney,
      orderType: 1
    })
  }

  render() {
    const item = this.props.accountDetail;
    return (
      <View style={{flex:1}}>
         <FullModal visible={this.state.loading} />
          <Header
            title="记账详情"
          />
          <GiftedForm
              formName='RepairRuleForm0'
              clearOnClose={true}
          >
          <GiftedForm.LabelWidget
              name='HouseName'
              title='房源名称'
              required= {false}
              renderRight={false}
              disabled={true}
              value={item.HouseName || '无'}
          />
          <GiftedForm.LabelWidget
              name='ReceivablesDate'
              title='收支日期'
              required= {false}
              renderRight={false}
              disabled={true}
              value={dateFormat(item.ReceivablesDate, "yyyy-MM-dd") || '无'}
          />
          <GiftedForm.LabelWidget
              name='PayType'
              title='收支类型'
              required= {false}
              renderRight={false}
              disabled={false}
              value={ getEnumDesByValue('InOrOut',item.InOrOut)}
          />
          <GiftedForm.LabelWidget
              name='BudgetStatus'
              title='收支状态'
              required= {false}
              renderRight={false}
              disabled={true}
              value={this.getFilterStatus(item.InOrOutStatus) || '无'}
          />
            <GiftedForm.LabelWidget
              name='Project'
              title='项目'
              required= {false}
              renderRight={false}
              disabled={true}
              value={item.BillProjectName || '无'}
          />
          <GiftedForm.LabelWidget
              name='Money'
              title='总金额'
              required= {false}
              renderRight={false}
              disabled={true}
              value={item.Amount + '元'}
          />
          <GiftedForm.LabelWidget
              name='UnPaidMoney'
              title='未付金额'
              required= {false}
              renderRight={false}
              disabled={true}
              value={ item.UnPaidMoney + '元'}
          />
          <GiftedForm.LabelWidget
              name='VoucherNumber'
              title='凭证编号'
              required= {false}
              renderRight={false}
              disabled={true}
              value={item.VoucherID || '无'}
          />
          <GiftedForm.NoticeWidget title={`图片凭证`}/>
          <View style={styles.backgronud_color}>
            <ImagePreview imgSrc={item.ImageUpload ? item.ImageUpload : []} />
          </View>
          <GiftedForm.NoticeWidget  title={`备注`}/>
          <GiftedForm.TextAreaWidget
              name='RepairRemark'
              required={false}
              disabled={true}
              maxLength={100}
              value={item.Remark}
          />
          </GiftedForm>
          <View>
            <ButtonGroup
                options={this.state.btnOptions}
                handleDeleteClick={() => this.handleDelete()}
                handleModifyClick={() => this.handleModify()}
                handleReceivablesClick={() => this.handleReceivables()}
            />
          </View>
      </View>
    )
  }
}

const mapToProps = state => ({accountDetail: state.accountDetail})
export default connect(mapToProps)(AccountDetails)
const styles =StyleSheet.create({
  backgronud_color: {
    backgroundColor: '#fff',
    minHeight: 50
  }
})
