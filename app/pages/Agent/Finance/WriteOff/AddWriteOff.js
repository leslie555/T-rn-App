import React, { Component } from 'react'
import {
  Alert,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { FullModal, Header, UploadFile } from '../../../../components'
import { showSelectAny } from '../../../../components/SelectAny/util'
import { AddReimbursement, EditReimbursement } from '../../../../api/pay'
import ButtonGroup from '../../../../components/ButtonGroup'
import { connect } from 'react-redux'
import Toast from 'react-native-root-toast'
import { addList, updateList } from '../../../../redux/actions/list'
import { fetchBillData, getTreeNodeByValue } from '../../../../utils/arrUtil'
import { updateContractDetail } from '../../../../redux/actions/contract'
import { validateNumber } from '../../../../utils/validate'
import IconFont from '../../../../utils/IconFont'
import { dateFormat } from '../../../../utils/dateFormat'
import { Container, DisplayStyle, _1PX } from '../../../../styles/commonStyles'
import diffArr from '../../../../utils/arrUtil/diffArr'

class AddWriteOff extends React.Component {
  constructor(props) {
    super(props)
    this.numberPad =
      Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`
    this.data = JSON.parse(this.props.navigation.getParam('data', 'null'))
    this.ImageList = JSON.parse(this.props.navigation.getParam('imgList', '[]'))
    this.reimbursementTypes = JSON.parse(
      this.props.navigation.getParam('reimbursementTypes', '[]')
    )
    this.editType = props.navigation.getParam('editType', '1')
    this.isEdit = !!this.data
    this.state = {
      form: {
        HouseName: '',
        Remark: ''
      },
      ImageList: [],
      billProject: [],
      selectedProject: [
        {
          BillProjectIDMark: [],
          Money: '',
          BillProjectName: '',
          BillProjectTypeName: ''
        }
      ],
      loading: false
    }
    this.houseInfo = null
  }

  componentWillMount() {
    fetchBillData().then(({ Data }) => {
      this.setState(
        {
          billProject: Data
        },
        () => {
          this.initForm()
        }
      )
    })
  }

  componentDidMount() {
    this.viewDidAppear = this.props.navigation.addListener('willFocus', obj => {
      if (!obj.state.params) {
        return
      } else {
        const houseInfo = obj.state.params.houseInfo
        if (houseInfo) {
          this.houseInfo = JSON.parse(houseInfo)
          this.setState({
            form: {
              ...this.state.form,
              HouseName: this.houseInfo.HouseName
            }
          })
        }
      }
    })
  }
  initForm() {
    if (this.isEdit) {
      const form = { ...this.data }
      this.houseInfo = { ...this.data, KeyID: this.data.HouseID }
      const ImageList = [...this.ImageList]
      const selectedProject = this.reimbursementTypes
        ? this.reimbursementTypes.map(v => ({
            ...v,
            BillProjectIDMark: [v.BillProjectTypeID, v.BillProjectID]
          }))
        : [{}]
      this.setState({
        form,
        selectedProject,
        ImageList
      })
    }
  }

  handleSave = Status => {
    const validationResults = GiftedFormManager.validate('AddWriteOffForm')
    const values0 = GiftedFormManager.getValues('AddWriteOffForm')
    if (validationResults.isValid) {
      let flag = true
      this.state.selectedProject.forEach((v, index) => {
        if (!v.BillProjectName) {
          Toast.show(`项目${index + 1}不能为空!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          flag = false
        }
        if (!validateNumber(v.Money)) {
          Toast.show(`项目${index + 1}中金额只能为数字!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          flag = false
        }
        if (!v.Money) {
          Toast.show(`项目${index + 1}中金额不能为空!`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          flag = false
        }
      })
      if (!flag) return
      let param = {}
      // 新增
      const costProject = this.state.selectedProject.map(v => ({
        ...v,
        BillProjectTypeID: v.BillProjectIDMark[0],
        BillProjectID: v.BillProjectIDMark[1]
      }))
      param = {
        ment: {
          ...this.state.form,
          ...values0,
          ImageList: this.state.ImageList,
          ImageLocation: this.state.ImageList,
          ImageID: this.state.ImageList.map(v => v.KeyID).join(','),
          HouseID: this.houseInfo.KeyID,
          HouseKey: this.houseInfo.HouseKey,
          ContractNum: this.houseInfo.ContractNum,
          costProject,
          Status
        },
        mentType: costProject
      }
      if (this.isEdit) {
        const diffImg = diffArr(this.ImageList, this.state.ImageList, [
          'ImageLocation'
        ])
        const diffProject = diffArr(this.reimbursementTypes, costProject, [
          'BillProjectID'
        ])
        Object.assign(param.ment, {
          ImageLocation: diffImg,
          ImageList: diffImg,
          costProject: diffProject
        })
        Object.assign(param, {
          mentType: diffProject,
          OperationType: 1
        })
      }
      this.setState({
        loading: true
      })
      const fn = this.isEdit ? EditReimbursement : AddReimbursement
      fn(param)
        .then(res => {
          // 这里设置想要的数据 是取Data还是什么 先看Data才知道
          //修改详情
          const Data = res.Data.Data
          if (this.isEdit) {
            this.props.dispatch(
              updateList({
                key: 'writeOffList',
                KeyID: Data.reimbursements[0].KeyID,
                data: {
                  ...Data.reimbursements[0],
                  reimbursementTypes: Data.reimbursementTypes
                }
              })
            )
          } else {
            this.props.dispatch(
              addList({
                key: 'writeOffList',
                data: {
                  ...Data.reimbursements[0],
                  reimbursementTypes: Data.reimbursementTypes
                }
              })
            )
          }
          this.setState(
            {
              loading: false
            },
            () => {
              setTimeout(() => {
                Alert.alert(
                  '提示',
                  '保存成功',
                  [
                    {
                      text: '确定',
                      onPress: () => {
                        this.props.navigation.navigate('AgentWriteOff')
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }, 100)
            }
          )
        })
        .catch(() => {
          this.setState({
            loading: false
          })
        })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }

  billProjectChange(data, index) {
    const selectedProject = [...this.state.selectedProject]
    const pathNode = getTreeNodeByValue(this.state.billProject, data.KeyID, {
      children: 'Children',
      value: 'KeyID',
      label: 'Name'
    })
    selectedProject[index].BillProjectIDMark = pathNode.pathArr
    selectedProject[index].BillProjectTypeName = pathNode.pathNameArr[0]
    selectedProject[index].BillProjectName = pathNode.pathNameArr[1]
    this.setState({
      selectedProject
    })
  }
  onMoneyChange({ nativeEvent: { text } }, index) {
    const selectedProject = [...this.state.selectedProject]
    selectedProject[index].Money = +text
    this.setState({
      selectedProject
    })
  }
  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 13
      },
      path: 'AgentAddWriteOff',
      returnKey: 'houseInfo'
    })
  }
  addProject = () => {
    const selectedProject = [...this.state.selectedProject]
    selectedProject.push({
      BillProjectIDMark: [],
      Money: ''
    })
    this.setState({
      selectedProject
    })
  }
  removeProject(index) {
    const selectedProject = [...this.state.selectedProject]
    selectedProject.splice(index, 1)
    this.setState({
      selectedProject
    })
  }
  onUploadFileChange(data) {
    this.setState({
      ImageList: data
    })
  }

  render() {
    const { form, selectedProject, billProject, ImageList } = this.state
    return (
      <View style={Container}>
        <FullModal visible={this.state.loading} loadingText="保存中..." />
        <Header title={this.editType == 0 ? `添加报销` : `修改报销`} />
        <GiftedForm formName="AddWriteOffForm">
          <GiftedForm.SeparatorWidget />
          <GiftedForm.LabelWidget
            name="HouseName"
            title="房源名称"
            placeholder="请选择"
            onLabelPress={() => {
              this.showSelectHouseFn()
            }}
            value={form.HouseName}
          />
          {selectedProject.map((v, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    ...DisplayStyle('row', 'center', 'space-between'),
                    paddingVertical: 5,
                    paddingHorizontal: 15
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#999'
                    }}
                  >{`项目${index + 1}：`}</Text>
                  <TouchableOpacity
                    onPress={
                      !index
                        ? this.addProject
                        : () => {
                            this.removeProject(index)
                          }
                    }
                  >
                    <View
                      style={{
                        // borderWidth: _1PX,
                        // borderColor: !index ? '#389ef2' : 'red',
                        borderRadius: 5,
                        padding: 4
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: !index ? '#389ef2' : 'red'
                        }}
                      >
                        {!index ? '添加项目' : '删除'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <GiftedForm.CascaderWidget
                  name="BillProjectIDMark"
                  title="项目"
                  data={billProject}
                  value={v.BillProjectIDMark}
                  onSelect={data => {
                    this.billProjectChange(data, index)
                  }}
                />
                <GiftedForm.TextInputWidget
                  name="Money"
                  title="金额"
                  maxLength={18}
                  onChange={text => {
                    this.onMoneyChange(text, index)
                  }}
                  keyboardType={this.numberPad}
                  value={v.Money + ''}
                />
              </View>
            )
          })}
          <GiftedForm.NoticeWidget title={`图片凭证`} />
          <UploadFile
            list={ImageList}
            type={`AgentWriteOff`}
            onChange={data => this.onUploadFileChange(data)}
          />
          <GiftedForm.NoticeWidget title={`备注`} />

          <GiftedForm.TextAreaWidget
            name="Remark"
            numberOfLines={5}
            required={false}
            placeholder="请填写备注"
            maxLength={100}
            value={form.Remark}
          />
        </GiftedForm>
        <View>
          <ButtonGroup
            options={[
              { label: '暂存', value: 'Store' },
              { label: '确定', value: 'Save' }
            ]}
            handleSaveClick={() => this.handleSave(2)}
            handleStoreClick={() => this.handleSave(1)}
          />
        </View>
      </View>
    )
  }
}

const mapToProps = state => ({ enumList: state.enum.enumList })
export default connect(mapToProps)(AddWriteOff)
