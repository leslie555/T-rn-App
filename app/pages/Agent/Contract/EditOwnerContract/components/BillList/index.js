import React, {Component} from 'react'
import {Alert, FlatList, Image, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './style'
import IconFont from "../../../../../../utils/IconFont";
import {getTreeNodeByValue} from "../../../../../../utils/arrUtil";
import {ToChinesNum} from "../../../../../../utils/stringFormat";
import {priceFormat} from "../../../../../../utils/priceFormat";
import {dateFormat} from "../../../../../../utils/dateFormat";
import {QueryBillItem} from '../../../../../../api/owner'
import {Picker} from '../../../../../../components'
import Toast from "react-native-root-toast";
import {validateNumber} from "../../../../../../utils/validate";

export default class BillList extends React.Component {
  constructor(props) {
    super(props)
    if (this.props.type === 0) { // 0业主 默认支出 1租客 默认收入
      this.childrenKey = 'OwnerBillDetail'
    } else {
      this.childrenKey = 'TenantBillDetail'
    }
    this.billProjectClone = []
    this.currentCItem = {}
    this.currentItem = {}
    this.scrollRef = null
    this.state = {
      tableList: [],
      total: 0,
      billProject: [],
      billProjectVisible: false,
      billProjectSelectedValue: [],
      markDateVisible: false,
      markDateSelectedValue: []
    }
  }

  componentWillMount() {
    this._renderItem = ({item, index}) => (
        <View style={styles.bill_item} key={index}>
          <TouchableOpacity onPress={() => this.handleBillDelete(index)} style={styles.right_delete_box}>
            <Image source={require('../../images/del-icon.png')}/>
          </TouchableOpacity>
          <View style={styles.bill_num_box}>
            <Text style={styles.bill_num}>账期{ToChinesNum(index + 1)}</Text>
          </View>
          <View style={styles.bill_box}>
            <View style={styles.bill_add_box}>
              <Text style={styles.bill_add_text}>收入</Text>
              <TouchableOpacity style={styles.bill_add_btn} onPress={() => this.handleBillItemAdd(item, 1)}>
                <IconFont name='addition' size={18} color='#389ef2'></IconFont>
              </TouchableOpacity>
            </View>
            {item[this.childrenKey].map((cItem, cIndex) => {
              if (cItem.InOrOut === 2) return null
              return (
                  <View style={styles.bill_content} key={cIndex}>
                    {cItem.CanOperate === 0 ?
                        <Text style={styles.bill_text}>{cItem.BillProjectName}</Text> :
                        <TouchableOpacity style={styles.bill_cascade}
                                          onPress={() => this.onBillProjectPress(cItem)}>
                          <Text style={styles.bill_cascade_text}>{cItem.BillProjectName}</Text>
                          <IconFont name='sanjiaoxing' size={12} color='#999'></IconFont>
                        </TouchableOpacity>
                    }
                    <TextInput style={styles.bill_input} defaultValue={cItem.Amount + ''}
                               keyboardType={`phone-pad`}
                               onChangeText={(val) => this.amountChange(cItem, val)}/>
                    {cItem.CanOperate === 1 &&
                    <TouchableOpacity style={styles.bill_del_item_btn}
                                      onPress={() => this.handleBillItemDelete(item, cIndex)}>
                      <IconFont name='guanbixuanfu' size={16} color='#999'></IconFont>
                    </TouchableOpacity>
                    }
                  </View>
              )
            })}
            <View style={styles.bill_add_box}>
              <Text style={styles.bill_add_text}>支出</Text>
              <TouchableOpacity style={styles.bill_add_btn} onPress={() => this.handleBillItemAdd(item, 2)}>
                <IconFont name='addition' size={18} color='#389ef2'></IconFont>
              </TouchableOpacity>
            </View>
            {item[this.childrenKey].map((cItem, cIndex) => {
              if (cItem.InOrOut === 1) return null
              return (
                  <View style={styles.bill_content} key={cIndex}>
                    {cItem.CanOperate === 0 ?
                        <Text style={styles.bill_text}>{cItem.BillProjectName}</Text> :
                        <TouchableOpacity style={styles.bill_cascade}
                                          onPress={() => this.onBillProjectPress(cItem)}>
                          <Text style={styles.bill_cascade_text}>{cItem.BillProjectName}</Text>
                          <IconFont name='sanjiaoxing' size={12} color='#999'></IconFont>
                        </TouchableOpacity>
                    }
                    <TextInput style={styles.bill_input} defaultValue={cItem.Amount + ''}
                               keyboardType={`phone-pad`}
                               onChangeText={(val) => this.amountChange(cItem, val)}/>
                    {cItem.CanOperate === 1 &&
                    <TouchableOpacity style={styles.bill_del_item_btn}
                                      onPress={() => this.handleBillItemDelete(item, cIndex)}>
                      <IconFont name='guanbixuanfu' size={18} color='#999'></IconFont>
                    </TouchableOpacity>
                    }
                  </View>
              )
            })}
            <View style={styles.bill_line}></View>
            <View style={styles.bill_content}>
              <Text style={styles.bill_text_bold}>总金额（元）</Text>
              <Text style={styles.bill_text1}>{priceFormat(item.BillAmount)}</Text>
            </View>
            <View style={styles.bill_content}>
              <Text style={styles.bill_text_bold}>应付款日</Text>
              <TouchableOpacity style={styles.bill_time} onPress={() => this.onMarkDatePress(item)}>
                <Text style={styles.bill_time_text}>{item.ReceivablesDate}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  }

  componentDidMount() {
    QueryBillItem({}).then(({Data}) => {
      const pickerData = []
      const data = Data
      for (let i = 0; i < data.length; i++) {
        const _data = {}
        let nameArr = []
        if (data[i].Children) {
          nameArr = data[i].Children.map(val => val.Name)
        }
        _data[data[i].Name] = nameArr
        pickerData.push(_data)
      }
      this.billProjectClone = Data
      this.setState({
        billProject: pickerData
      })
    })
  }

  render() {
    const headerComponent = (
        <View style={styles.bill_list_content}>
          <View style={styles.bill_total}>
            <Text style={styles.head_text}>账单合计（元）：{priceFormat(this.state.total)}</Text>
            <TouchableOpacity onPress={() => this.handleBillAdd()} style={styles.add_bill_btn_box}>
              <Text style={styles.add_bill_btn_text}>添加账期</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
    return (
        <View style={{flex: 1}}>
          <FlatList
              ref={ref => this.scrollRef = ref}
              style={styles.bill_container}
              automaticallyAdjustContentInsets={false}
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='always'
              scrollEventThrottle={0}
              data={this.state.tableList}
              extraData={this.state}
              keyExtractor={(item, index) => index + ''}
              renderItem={this._renderItem}
              ListHeaderComponent={headerComponent}
          />
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
          <Picker
              visible={this.state.markDateVisible}
              type={'date'}
              selectedValue={this.state.markDateSelectedValue}
              onPickerConfirm={(data) => this.markDateConfirm(data)}
              closeModal={() => {
                this.setState({markDateVisible: false})
              }}
          />
        </View>

    )
  }

  scrollToEnd() {
    this.scrollRef.scrollToEnd({animated: true})
  }

  initData(data) {
    debugger
    data.map((item, index) => {
      item.ReceivablesDate = dateFormat(item.ReceivablesDate)
      item[this.childrenKey].map((cItem, cIndex) => {
        cItem.Amount = priceFormat(cItem.Amount)
      })
    })
    // this.setState({
    //   tableList: data
    // })
    this.state.tableList = data
    this.reCalcAmount()
  }

  getProjectNameArrByCode(id) {
    let nameArr = []
    if (id) {
      nameArr = getTreeNodeByValue(this.billProjectClone, id, {
        children: 'Children',
        value: 'KeyID',
        label: 'Name'
      }).pathNameArr
    }
    return nameArr
  }

  billProjectConfirm(data) {
    const selectedValue = []
    let next = this.billProjectClone
    data.forEach(val => {
      const item = next.find(v => v.Name === val)
      selectedValue.push(item.KeyID)
      next = item.Children
    })
    this.currentCItem.BillProjectID = selectedValue[1]
    this.currentCItem.BillProjectName = data[1]
    this.setState({
      tableList: this.state.tableList
    })
  }

  onBillProjectPress(cItem) {
    this.currentCItem = cItem
    const nameArr = this.getProjectNameArrByCode(cItem.BillProjectID)
    this.setState({
      billProjectSelectedValue: nameArr,
      billProjectVisible: true
    })
  }

  markDateConfirm(data) {
    data[0] = data[0].slice(0, -1)
    data[1] = data[1].slice(0, -1)
    data[2] = data[2].slice(0, -1)
    this.currentItem.ReceivablesDate = data.join('-')
    this.setState({
      tableList: this.state.tableList
    })
  }

  onMarkDatePress(item) {
    this.currentItem = item
    const itemArr = item.ReceivablesDate.split('-')
    itemArr[0] = +itemArr[0] + '年'
    itemArr[1] = +itemArr[1] + '月'
    itemArr[2] = +itemArr[2] + '日'
    this.setState({
      markDateSelectedValue: itemArr,
      markDateVisible: true
    })
  }

  handleBillAdd() {
    const last = this.state.tableList[this.state.tableList.length - 1]
    const obj = {
      BillAmount: 0,
      BillStartDate: '',
      BillEndDate: '',
      ReceivablesDate: last.ReceivablesDate || dateFormat(new Date())
    }
    obj[this.childrenKey] = []
    this.state.tableList.push(obj)
    this.setState({
      tableList: this.state.tableList
    }, () => {
      setTimeout(() => {
        this.scrollToEnd()
      }, 10)
    })
  }

  handleBillDelete(index) {
    Alert.alert('温馨提示', '确认要删除该账期吗？', [
      {
        text: '取消', onPress: () => {
        }
      },
      {
        text: '确认', onPress: () => {
          this.state.tableList.splice(index, 1)
          this.reCalcAmount()
        }
      }
    ], {cancelable: false})
  }

  handleBillItemAdd(item, type) {
    const obj = {
      OwnerBillID: '',
      BillProjectID: '',
      BillProjectName: '',
      InOrOut: type,
      Amount: '',
      CanOperate: 1
    }
    item[this.childrenKey].push(obj)
    this.setState({
      tableList: this.state.tableList
    })
  }

  handleBillItemDelete(item, index) {
    item[this.childrenKey].splice(index, 1)
    this.reCalcAmount()
  }

  amountChange(cItem, val) {
    cItem.Amount = val
    this.reCalcAmount()
  }

  reCalcAmount() {
    // 业主 收入为负 租客 支出为负
    this.state.total = 0
    this.state.tableList.map((item, index) => {
      item.BillAmount = 0
      item[this.childrenKey].map((cItem, cIndex) => {
        if (this.props.type === 0 && cItem.InOrOut === 1 || this.props.type === 1 && cItem.InOrOut === 2) {
          item.BillAmount -= +cItem.Amount
        } else {
          item.BillAmount += +cItem.Amount
        }
      })
      this.state.total += +item.BillAmount
    })
    this.setState({
      total: this.state.total,
      tableList: this.state.tableList
    })
  }

  validate() {
    // 验证是否填写完整
    return new Promise((resolve, reject) => {
      debugger
      for (let i = 0; i < this.state.tableList.length; i++) {
        const item = this.state.tableList[i]
        if (!item.ReceivablesDate) {
          Toast.show('账单收款日未填写完整', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          return reject()
        }
        for (let j = 0; j < item[this.childrenKey].length; j++) {
          const cItem = item[this.childrenKey][j]
          if (!cItem.BillProjectID || !cItem.Amount) {
            Toast.show('账单项目未填写完整', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return reject()
          }
          if (!validateNumber(cItem.Amount)) {
            Toast.show('账单金额只能为数字', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM
            })
            return reject()
          }
        }
      }
      return resolve()
    })
  }

  getValue() {
    return this.state.tableList
  }
}
